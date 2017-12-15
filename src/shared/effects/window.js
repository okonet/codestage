// const Positioner = require('electron-positioner')

export const windowSizes = {
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

// const positioner = new Positioner(windows.main)
// const getWinPosition = size => {
//   if (size === WindowSizes.NORMAL) {
//     return positioner.calculate('center')
//   }
//   // Do not cache tray position since it can change over time
//   return positioner.calculate('trayCenter', tray.getBounds())
// }

export function toggleWindowEffect(win, visible) {
  if (visible) {
    win.show()
  } else {
    win.hide()
  }
}

export function resizeWindowEffect(win, size, shouldAnimate = true) {
  const { width, height } = windowSizes[size]
  win.setSize(width, height, shouldAnimate)
}
