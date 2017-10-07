import React, { Component } from 'react'
import { Checkbox, Label, TextInput, Button } from 'react-desktop/macOs'
import styled from 'styled-components'
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

const Form = styled.div`
  display: block;
  width: 100%;
  padding: 2rem;
`
const FormRow = styled.div`
  display: flex;
  padding: 0.5rem;
`

const FormLabel = styled.div`
  margin-right: .5rem;
  width: 30%;
  text-align: right;
`

const OffsetField = styled.div`
  padding-left: calc(30% + .5rem);
  width: 100%;
`

class General extends Component {
  onShortcutUpdated = shortcut => {
    settings.set('shortcut', shortcut)
  }

  onAutopasteChanged = evt => {
    settings.set('autopaste', evt.target.checked)
  }

  resetSettings = () => {
    settings.setAll(DEFAULT_SETTINGS)
  }

  render() {
    return (
      <Form>
        <FormRow>
          <FormLabel>
            <Label>Global shortcut</Label>
          </FormLabel>

          <ShortcutRecorder
            initialValue={settings.get('shortcut', DEFAULT_SETTINGS.shortcut)}
            displayModifiers={MAC_MODIFIERS}
            exportModifiers={ELECTRON_MODIFIERS}
            onUpdate={this.onShortcutUpdated}
            renderer={TextInput}
          />
        </FormRow>
        <FormRow>
          <OffsetField>
            <Checkbox
              label="Auto-paste to the formost application"
              defaultChecked={settings.get('autopaste', DEFAULT_SETTINGS.autopaste)}
              onChange={this.onAutopasteChanged}
            />
          </OffsetField>
        </FormRow>
        <FormRow>
          <OffsetField>
            <Button onClick={this.resetSettings}>Reset settings</Button>
          </OffsetField>
        </FormRow>
      </Form>
    )
  }
}

export default General
