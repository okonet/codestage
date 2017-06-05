/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

const path = require('path')
const { name } = require('../../package.json')
const { app, Menu, Tray, globalShortcut, clipboard, BrowserWindow } = require('electron')
const settings = require('electron-settings')
const log = require('electron-log')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')
const { DEFAULT_SETTINGS } = require('./defaults')

const width = 800
const height = 600

const isDev = require('electron-is-dev')
require('electron-debug')({
  showDevTools: 'undocked'
})

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null
// Create a reference to be able to destroy it
const windows = {}

// We'll need this to prevent from quiting the app by closing Preferences window
let forceQuit = false

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
  windows.main = new BrowserWindow({
    width,
    height,
    center: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    titleBarStyle: 'hidden-inset',
    vibrancy: 'dark',
    show: true
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

  const startUrl = isDev ? 'http://localhost:3000' : `file://${__dirname}/../../build/index.html`

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

  const mainMenu = Menu.buildFromTemplate([
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

  // Register a shortcut listener.
  const onShortcutPressed = () => {
    const res = codeHighlight(clipboard.readText(), settings)
    Object.keys(windows).forEach(win => {
      windows[win].webContents.send('global-shortcut-pressed', res)
    })
    // windows.main.show()
  }

  const shortcut = settings.get('shortcut', DEFAULT_SETTINGS.shortcut)
  registerShortcut(shortcut, null, onShortcutPressed)
  settings.watch('shortcut', (newVal, oldVal) =>
    registerShortcut(newVal, oldVal, onShortcutPressed)
  )

  // Watch language change and re-highlight the code
  settings.watch('lastUsedLanguage', language => {
    if (language) {
      onShortcutPressed()
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
})
