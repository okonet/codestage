'use strict'

const { app, Menu, Tray, globalShortcut, clipboard } = require('electron')
const isPlatform = require('./isPlatform')
const codeHighlight = require('./codeHighlight')

const SHORTCUT = 'CommandOrControl+Alt+X'

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide()
}

app.on('ready', () => {
  tray = new Tray('./resources/iconTemplate.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  // Register a shortcut listener.
  const ret = globalShortcut.register(SHORTCUT, () => {
    console.log(`${ SHORTCUT } is pressed`)
    codeHighlight(clipboard)
  })

  if (!ret) {
    console.log('Shortcut registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered(SHORTCUT))
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
