'use strict'

const fs = require('fs')
const path = require('path')
const { app, Menu, Tray, globalShortcut, clipboard } = require('electron')
const SystemFonts = require('system-font-families').default
const settings = require('electron-settings')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')
const { resolveStylesheetsDir } = require('../lib/')

const systemFonts = new SystemFonts()

settings.defaults({
  shortcut: 'CommandOrControl+Alt+X',
  fontface: 'Courier New',
  theme: 'xcode'
})

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide()
}

app.on('ready', () => {
  tray = new Tray('./resources/iconTemplate.png')
  // tray.setToolTip('Loading...')
  const selectedFont = settings.getSync('fontface')
  const selectedTheme = settings.getSync('theme')
  const fontList = systemFonts.getFontsSync()
  const themeList = fs
    .readdirSync(path.join(resolveStylesheetsDir()))
    .map(stylesheet => stylesheet.replace(/\.css$/, ''))
  console.log(themeList)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Font',
      submenu: fontList.map(font => ({
        label: font,
        type: 'radio',
        checked: font === selectedFont,
        click: (menuItem) => {
          settings.setSync('fontface', menuItem.label)
        }
      }))
    },
    {
      label: 'Theme',
      submenu: themeList.map(theme => ({
        label: theme,
        type: 'radio',
        checked: theme === selectedTheme,
        click: (menuItem) => {
          settings.setSync('theme', menuItem.label)
        }
      }))
    },
    { label: 'Item3', type: 'radio', checked: true }
  ])
  tray.setContextMenu(contextMenu)

  // Register a shortcut listener.
  settings.get('shortcut').then((shortcut) => {
    const ret = globalShortcut.register(shortcut, () => {
      codeHighlight(clipboard, settings)
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
