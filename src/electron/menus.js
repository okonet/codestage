'use strict';

const { Menu } = require('electron');
const settings = require('electron-settings');

const autopaste = settings.getSync('autopaste');

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
    checked: autopaste,
    click: menuItem => {
      settings.setSync('autopaste', menuItem.checked);
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Quit code presenter',
    role: 'quit',
    type: 'normal'
  }
]);

module.exports = {
  mainMenu
};
