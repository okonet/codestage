/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

const path = require('path')
const { name } = require('../../package.json')
const { app, Menu, Tray, globalShortcut, clipboard, BrowserWindow } = require('electron')
const settings = require('electron-settings')
const Positioner = require('electron-positioner')
const log = require('electron-log')
const stripIndent = require('strip-indent')
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
let preferencesWindow = null

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
  preferencesWindow = new BrowserWindow({
    width,
    height,
    frame: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden-inset',
    show: true
  })
  const positioner = new Positioner(preferencesWindow)

  const startUrl = isDev ? 'http://localhost:3000' : `file://${__dirname}/build/index.html`

  preferencesWindow.loadURL(startUrl)
  preferencesWindow.webContents.on('dom-ready', () => {
    preferencesWindow.webContents.executeJavaScript('window.require')
  })

  // Prevent closing the application when window is closed
  preferencesWindow.on('close', event => {
    event.preventDefault()
    // Still close the window, though
    preferencesWindow.hide()
  })

  const mainMenu = Menu.buildFromTemplate([
    {
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Auto-paste to the formost application',
      type: 'checkbox',
      checked: settings.get('autopaste', DEFAULT_SETTINGS.autopaste),
      click: menuItem => {
        settings.set('autopaste', menuItem.checked)
      }
    },
    {
      accelerator: 'Cmd+,',
      label: 'Preferences...',
      type: 'normal',
      click: () => {
        positioner.move('center')
        preferencesWindow.show()
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
    const codeSnippet = stripIndent(clipboard.readText())
    preferencesWindow.webContents.send('global-shortcut-pressed', { codeSnippet })
    codeHighlight(codeSnippet, settings)
  }
  const shortcut = settings.get('shortcut', DEFAULT_SETTINGS.shortcut)
  registerShortcut(shortcut, null, onShortcutPressed)
  settings.watch('shortcut', (newVal, oldVal) =>
    registerShortcut(newVal, oldVal, onShortcutPressed)
  )
})

app.on('will-quit', () => {
  // Destroy window reference
  preferencesWindow.destroy()
  // De-reference object
  preferencesWindow = null
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
