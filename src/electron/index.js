/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

const path = require('path')
const { name } = require('../../package.json')
const { app, Menu, Tray, globalShortcut, clipboard, BrowserWindow } = require('electron')
const settings = require('electron-settings')
const Positioner = require('electron-positioner')
const stripIndent = require('strip-indent')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')
const { DEFAULT_SETTINGS } = require('./defaults')

const isDev = require('electron-is-dev')
require('electron-debug')({ showDevTools: true })

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide()
}

app.on('ready', () => {
  const width = 800
  const height = 600
  const browserWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    show: false
  })
  const positioner = new Positioner(browserWindow)

  const startUrl = `file://${__dirname}/../../build/index.html`

  browserWindow.loadURL(startUrl)
  browserWindow.webContents.on('dom-ready', () => {
    browserWindow.webContents.executeJavaScript('window.require')
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
        browserWindow.show()
        if (isDev) {
          browserWindow.webContents.openDevTools()
        }
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
  const shortcut = settings.get('shortcut', DEFAULT_SETTINGS.shortcut)
  const ret = globalShortcut.register(shortcut, () => {
    const codeSnippet = stripIndent(clipboard.readText())
    browserWindow.webContents.send('global-shortcut-pressed', { codeSnippet })
    codeHighlight(codeSnippet, settings)
  })

  if (!ret) {
    console.log('Shortcut registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered(shortcut))
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
