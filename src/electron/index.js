/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

require('babel-register')
require('babel-polyfill')
require('hazardous') // Needed for ASAR archives?
const path = require('path')
const { name } = require('../../package.json')
const {
  ipcMain,
  app,
  dialog,
  Menu,
  Tray,
  globalShortcut,
  clipboard,
  BrowserWindow
} = require('electron')
const Positioner = require('electron-positioner')
const settings = require('electron-settings')
const log = require('electron-log')
const isDev = require('electron-is-dev')
const clipboardWatcher = require('electron-clipboard-watcher')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')
const configureStore = require('../shared/store/createStore')
const { setWindowVisibility, setWindowSize } = require('../shared/actions/window')
const { errorOccured, resetErrors } = require('../shared/actions/errors')
const { WindowSizes } = require('../shared/constants/window')
const execute = require('./executeAppleScript')
const { DEFAULT_SETTINGS } = require('./defaults')
const { HIGHLIGHT_COMPLETE, REDUX_ACTION } = require('../shared/constants/events')

const width = 800
const height = 600
const windowSizes = {
  mini: {
    width: 100,
    height: 30
  },
  list: {
    width: 200,
    height: 400
  },
  normal: {
    width: 800,
    height: 600
  }
}

const initialState = {}
const store = configureStore(initialState, 'main')

ipcMain.on(REDUX_ACTION, (event, payload) => {
  store.dispatch(payload)
})

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null
// Create a reference to be able to destroy it
const windows = {}

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

app.on('ready', () => {
  if (isDev) {
    // eslint-disable-next-line global-require
    require('electron-debug')({
      showDevTools: 'undocked'
    })

    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require('electron-devtools-installer') // eslint-disable-line global-require

    const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]
    extensions.forEach(extension => {
      installExtension(extension)
        .then(ext => console.log(`Added Extension:  ${ext}`))
        .catch(err => console.log('An error occurred: ', err))
    })
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

  const startUrl = isDev ? 'http://localhost:5000' : `file://${__dirname}/../../build/index.html`

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
        await execute(path.resolve(__dirname, 'paste.applescript'))
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
    clipboard.writeRTF(result.value)
    const state = store.getState()
    const { windowVisible } = state.window
    if (!windowVisible) {
      store.dispatch(setWindowSize(WindowSizes.MINI))
      store.dispatch(setWindowVisibility(true))
    }
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
      await execute(path.resolve(__dirname, 'activate.applescript'))
      await execute(path.resolve(__dirname, 'selectall.applescript'))
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
      await highlightText(text)
    }
  })

  const mainMenu = Menu.buildFromTemplate([
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
      accelerator: 'Cmd+,',
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
  tray = new Tray(path.join(__dirname, '..', '..', 'public', 'iconTemplate@2x.png'))
  tray.setContextMenu(mainMenu)

  const positioner = new Positioner(windows.main)
  const getWinPosition = size => {
    if (size === WindowSizes.NORMAL) {
      return positioner.calculate('center')
    }
    // Do not cache tray position since it can change over time
    return positioner.calculate('trayCenter', tray.getBounds())
  }
  const shortcut = settings.get('shortcut', DEFAULT_SETTINGS.shortcut)
  registerShortcut(shortcut, null, onShortcutPressed)
  settings.watch('shortcut', (newVal, oldVal) => {
    if (newVal) {
      registerShortcut(newVal, oldVal, onShortcutPressed)
    }
  })
  // Watch language change and re-highlight the code
  settings.watch('lastUsedLanguage', language => {
    if (language) {
      selectAndHighlight()
    }
  })
  store.subscribe(() => {
    const state = store.getState()
    const { size, windowVisible } = state.window
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

    if (windowVisible) {
      windows.main.show()
    } else {
      windows.main.hide()
    }
    windows.main.setBounds(
      Object.assign(windowSizes[size], getWinPosition(size)),
      windowVisible && size !== WindowSizes.MINI
    )
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
  // Remove highlight watcher
  watcher.stop()
})
