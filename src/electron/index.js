'use strict'

const { app, ipcMain, Tray, globalShortcut, clipboard, BrowserWindow } = require('electron')
const settings = require('electron-settings')
const Positioner = require('electron-positioner')
const stripIndent = require('strip-indent')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')
const { mainMenu } = require('./menus')

const isProduction = process.env.NODE_ENV === 'production'

settings.defaults({
  shortcut: 'CommandOrControl+Alt+X',
  fontface: 'Courier New',
  theme: 'xcode',
  autopaste: true
})

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide()
}

ipcMain.on('show-options-menu', (event, bounds) => {
  const x = parseInt(bounds.left.toFixed(), 10)
  const y = parseInt(bounds.bottom.toFixed(), 10)
  mainMenu.popup(x + 4, y)
})

app.on('ready', () => {
  tray = new Tray('./resources/iconTemplate@2x.png')

  const width = 400
  const height = 300
  const browserWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    //    resizable: false,
    movable: false,
    vibrancy: 'dark',
    transparent: true,
    //    backgroundColor: 'transparent'
    show: false
  })
  const positioner = new Positioner(browserWindow)

  const startUrl = isProduction ? `file://${__dirname}/dist/index.html` : 'http://localhost:3000'

  browserWindow.loadURL(startUrl)
  browserWindow.webContents.on('dom-ready', () => {
    browserWindow.webContents.executeJavaScript('window.require')
  })

  tray.on('click', (event, trayBounds) => {
    positioner.move('trayCenter', trayBounds)
    browserWindow.show()
    if (!isProduction) {
      browserWindow.webContents.openDevTools()
    }
  })

  //  browserWindow.on('blur', () => {
  //    browserWindow.hide();
  //  });

  // Register a shortcut listener.
  settings.get('shortcut').then(shortcut => {
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
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
