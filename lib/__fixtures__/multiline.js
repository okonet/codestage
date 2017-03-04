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
