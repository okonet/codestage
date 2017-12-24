// Needed for ASAR archives
import 'hazardous'
import 'babel-polyfill'
import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ipcMain,
  app,
  dialog,
  Menu,
  Tray,
  globalShortcut,
  clipboard,
  BrowserWindow
} from 'electron'
import { enableLiveReload } from 'electron-compile'
import settings from 'electron-settings'
import log from 'electron-log'
import isDev from 'electron-is-dev'
import NotificationCenter from 'node-notifier/notifiers/notificationcenter'
import clipboardWatcher from 'electron-clipboard-watcher'
import isPlatform from './isPlatform'
import codeHighlight from './codeHighlight'
import configureStore from '../shared/store/createStore'
import { setWindowVisibility, setWindowSize } from '../shared/actions/window'
import { errorOccured, resetErrors } from '../shared/actions/errors'
import { windows, WindowSizes } from '../shared/constants/window'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'
import { HIGHLIGHT_COMPLETE, REDUX_ACTION } from '../shared/constants/events'
import execAppleScript from './executeAppleScript'

const { name } = require('../../package.json')

const notifications = new NotificationCenter({})

const width = 800
const height = 600

const initialState = {}
const store = configureStore(initialState, 'main')

ipcMain.on(REDUX_ACTION, (event, payload) => {
  store.dispatch(payload)
})

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// We'll need this to prevent from quiting the app by closing Preferences window
let forceQuit = false

// ClipboardWatcher instance to remove on quit
let watcher = null

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide()
}

function registerShortcut(newShortcut, oldShortcut, callback) {
  // Unregister old shortcut
  if (oldShortcut) {
    globalShortcut.unregister(oldShortcut)
  }

  //  Register new shortcut
  const isRegistered = globalShortcut.register(newShortcut, callback)

  if (!isRegistered) {
    log.error('Shortcut registration failed')
  }
}

app.on('ready', async () => {
  if (isDev) {
    enableLiveReload({ strategy: 'react-hmr' })

    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require('electron-devtools-installer') // eslint-disable-line

    const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]
    extensions.forEach(extension => {
      installExtension(extension)
        .then(ext => console.log(`Added Extension:  ${ext}`))
        .catch(err => console.log('An error occurred: ', err))
    })

    // eslint-disable-next-line global-require
    require('electron-debug')({
      showDevTools: 'undocked'
    })
  }

  // If running for the first time set settings to use defaults
  if (!settings.has('highlight')) {
    settings.setAll(DEFAULT_SETTINGS)
  }

  windows.main = new BrowserWindow({
    width,
    height,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    vibrancy: 'light',
    show: false
  })

  // Close main window on blur
  windows.main.on('blur', () => {
    const state = store.getState()
    const { size, windowVisible } = state.window
    if (windowVisible && size !== WindowSizes.NORMAL) {
      store.dispatch(setWindowVisibility(false))
    }
  })

  // Sync window state with the store
  windows.main.on('close', () => {
    store.dispatch(setWindowVisibility(false))
  })

  windows.preferences = new BrowserWindow({
    width,
    height,
    center: true,
    frame: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden-inset',
    show: false
  })

  // const startUrl = isDev ? 'http://localhost:5000' : `file://${__dirname}/../../build/index.html`
  const startUrl = `file://${__dirname}/../renderer/index.html`

  windows.main.loadURL(`${startUrl}#main`)
  windows.preferences.loadURL(`${startUrl}#preferences`)

  Object.keys(windows).forEach(win => {
    // Provides a way to require node/electron stuff in CRA
    windows[win].webContents.on('dom-ready', () => {
      windows.main.webContents.executeJavaScript('window.require')
    })

    // Prevent closing the application when window is closed
    windows[win].on('close', event => {
      if (!forceQuit) {
        event.preventDefault()
        // Still close the window, though
        windows[win].hide()
      }
    })
  })

  function handleError(error) {
    log.error(error)
    store.dispatch(errorOccured(error))
  }

  async function pasteToActiveApp() {
    const autopaste = settings.get('autopaste', DEFAULT_SETTINGS.autopaste)
    // Pasting into the active application
    if (autopaste) {
      try {
        await execAppleScript('paste')
      } catch (error) {
        handleError(error)
      }
    }
  }

  async function highlightText(text) {
    const result = await codeHighlight(text, settings).catch(handleError)
    Object.keys(windows).forEach(win => {
      windows[win].webContents.send(
        HIGHLIGHT_COMPLETE,
        Object.assign({}, result, {
          text
        })
      )
    })
    // Explictely write to `text` of clipboard the same value as before
    // in order not to trigger the clipboard watcher
    clipboard.write({
      text,
      rtf: result.value
    })

    const OPEN_ACTION_VALUE = 'Languages'

    notifications.notify(
      {
        title: `Highlighted as ${result.language}`,
        message: `Switch to Keynote and Paste from clipboard...
Language: ${result.language}
Theme: ${result.theme}`,
        closeLabel: 'Close',
        actions: OPEN_ACTION_VALUE
      },
      (err, response, metadata) => {
        if (err) store.dispatch(errorOccured(err))

        if (metadata.activationValue === OPEN_ACTION_VALUE) {
          store.dispatch(setWindowVisibility(true))
          store.dispatch(setWindowSize(WindowSizes.NORMAL))
        }
      }
    )
  }

  async function onShortcutPressed() {
    const state = store.getState()
    const { windowVisible } = state.window
    if (!windowVisible) {
      store.dispatch(setWindowSize(WindowSizes.NORMAL))
      store.dispatch(setWindowVisibility(true))
    }
  }

  // Pasting into the active application
  async function selectAndHighlight() {
    try {
      await execAppleScript('activate')
      await execAppleScript('selectall')
      await highlightText(clipboard.readText())
      await pasteToActiveApp()
    } catch (error) {
      handleError(error)
    }
  }

  // Watch for clipboard changes
  watcher = clipboardWatcher({
    // When clipboard content changes rehighlight it and
    // put RTF into RTF part of clipboard ready to use in Keynote.app
    onTextChange: async text => {
      console.log(text)
      await highlightText(text)
    }
  })

  function getMenu() {
    return Menu.buildFromTemplate([
      {
        label: 'Highlight from clipboard',
        type: 'normal',
        click: async () => {
          await highlightText(clipboard.readText())
          await pasteToActiveApp()
        }
      },
      {
        label: 'Open CodeStage...',
        type: 'normal',
        accelerator: settings.get('shortcut', DEFAULT_SETTINGS.shortcut),
        click: () => {
          store.dispatch(setWindowSize(WindowSizes.NORMAL))
          store.dispatch(setWindowVisibility(true))
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'about'
      },
      {
        label: 'Preferences...',
        type: 'normal',
        click: () => {
          windows.preferences.show()
        }
      },
      {
        type: 'separator'
      },
      {
        label: `Quit ${name}`,
        role: 'quit',
        type: 'normal'
      }
    ])
  }
  tray = new Tray(path.join(__dirname, '..', '..', 'resources', 'iconTemplate@2x.png'))
  tray.setContextMenu(getMenu())

  const shortcut = settings.get('shortcut', DEFAULT_SETTINGS.shortcut)
  registerShortcut(shortcut, null, onShortcutPressed)
  settings.watch('shortcut', (newVal, oldVal) => {
    console.log('Shortcut changed: %s -> %s', newVal, oldVal)
    if (newVal) {
      tray.setContextMenu(getMenu()) // Update shortcut accelerators in the menu
      registerShortcut(newVal, oldVal, onShortcutPressed)
    }
  })
  // Watch language and theme change and re-highlight the code
  settings.watch('highlight', selectAndHighlight)

  store.subscribe(() => {
    const state = store.getState()
    const { assistiveAccessDisabled, error } = state.errors
    if (error) {
      if (assistiveAccessDisabled) {
        dialog.showErrorBox(
          'Assistive access required',
          'Please add codestage to assistive access!'
        )
      } else {
        console.error('Unexpected error occured', error)
      }
      store.dispatch(resetErrors())
    }
  })
})

app.on('before-quit', () => {
  forceQuit = true
})

app.on('will-quit', () => {
  Object.keys(windows).forEach(win => {
    windows[win].destroy() // Destroy window reference
    windows[win] = null // De-reference object
  })
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
  // Remove clipboard watcher
  watcher.stop()
})
