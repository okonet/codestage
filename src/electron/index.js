'use strict';

const fs = require('fs');
const path = require('path');
const {
  app,
  Menu,
  Tray,
  globalShortcut,
  clipboard,
  BrowserWindow
} = require('electron');
const SystemFonts = require('system-font-families').default;
const settings = require('electron-settings');
const Positioner = require('electron-positioner');
const isPlatform = require('./isPlatform');
const codeHighlight = require('./codeHighlight');
const { resolveStylesheetsDir } = require('../../lib/');

const isProduction = process.env.NODE_ENV === 'production';
const systemFonts = new SystemFonts();

settings.defaults({
  shortcut: 'CommandOrControl+Alt+X',
  fontface: 'Courier New',
  theme: 'xcode',
  autopaste: true
});

// Prevent garbage collection
// Otherwise the tray icon would randomly hide after some time
let tray = null;

// Hide dock icon before the app starts
if (isPlatform('macOS')) {
  app.dock.hide();
}

app.on('ready', () => {
  tray = new Tray('./resources/iconTemplate@2x.png');

  const width = 400;
  const height = 300;
  const browserWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    //    resizable: false,
    movable: false,
    vibrancy: 'dark'
    //    show: false
  });
  const positioner = new Positioner(browserWindow);

  tray.on('click', (event, trayBounds) => {
    positioner.move('trayCenter', trayBounds);
    browserWindow.show();

    const startUrl = isProduction
      ? `file://${__dirname}/dist/index.html`
      : 'http://localhost:3000';

    browserWindow.loadURL(startUrl);
  });

  //  browserWindow.on('blur', () => {
  //    browserWindow.hide();
  //  });

  // tray.setToolTip('Loading...')
  const selectedFont = settings.getSync('fontface');
  const selectedTheme = settings.getSync('theme');
  const autopaste = settings.getSync('autopaste');
  const fontList = systemFonts.getFontsSync();
  const themeList = fs
    .readdirSync(path.join(resolveStylesheetsDir()))
    .map(stylesheet => stylesheet.replace(/\.css$/, ''));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Font',
      submenu: fontList.map(font => ({
        label: font,
        type: 'radio',
        checked: font === selectedFont,
        click: menuItem => {
          settings.setSync('fontface', menuItem.label);
        }
      }))
    },
    {
      label: 'Theme',
      submenu: themeList.map(theme => ({
        label: theme,
        type: 'radio',
        checked: theme === selectedTheme,
        click: menuItem => {
          settings.setSync('theme', menuItem.label);
        }
      }))
    },
    {
      label: 'Auto-paste to the formost application',
      type: 'checkbox',
      checked: autopaste,
      click: menuItem => {
        settings.setSync('autopaste', menuItem.checked);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit highlighter',
      role: 'quit',
      type: 'normal'
    }
  ]);
  // tray.setContextMenu(contextMenu)

  // Register a shortcut listener.
  settings.get('shortcut').then(shortcut => {
    const ret = globalShortcut.register(shortcut, () => {
      codeHighlight(clipboard, settings);
    });

    if (!ret) {
      console.log('Shortcut registration failed');
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered(shortcut));
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
