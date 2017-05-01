import React, { Component } from 'react'
import { Label } from 'react-desktop/macOs'
import ShortcutRecorder from './ShortcutRecorder'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote } = window.require('electron')
const settings = remote.require('electron-settings')
const { DEFAULT_SETTINGS } = remote.require('../electron/defaults')

const ELECTRON_MODIFIERS = {
  cmd: 'Command',
  ctrl: 'Control',
  alt: 'Alt',
  shift: 'Shift',
  joinWith: '+'
}

const MAC_MODIFIERS = {
  cmd: '⌘',
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  joinWith: ''
}

class General extends Component {
  onShortcutUpdated = shortcut => {
    settings.set('shortcut', shortcut)
  }

  render() {
    return (
      <section className="">

        <Label>Global shortcut</Label>

        <ShortcutRecorder
          initialValue={settings.get('shortcut', DEFAULT_SETTINGS.shortcut)}
          displayModifiers={MAC_MODIFIERS}
          exportModifiers={ELECTRON_MODIFIERS}
          onUpdate={this.onShortcutUpdated}
        />

      </section>
    )
  }
}

export default General
