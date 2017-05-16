import eventStringgifier from 'key-event-to-string'
import React, { Component, PropTypes } from 'react'

const defaultOptions = {
  cmd: 'Cmd',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  joinWith: ' + '
}

function toFormattedString(details, options = defaultOptions) {
  const { modifiers, character } = details.map
  const result = []

  if (modifiers.cmd) result.push(options.cmd)
  if (modifiers.ctrl) result.push(options.ctrl)
  if (modifiers.alt) result.push(options.alt)
  if (modifiers.shift) result.push(options.shift)
  if (character) result.push(character)

  return result.join(options.joinWith)
}

function toDetailsObject(value, options = defaultOptions) {
  const parts = value.split(options.joinWith)
  const character = parts.pop()
  const modifiers = Object.keys(options).reduce((res, key) => {
    if (key !== 'joinWith') {
      return {
        ...res,
        [key]: parts.some(part => part === options[key])
      }
    }
    return res
  }, {})

  return {
    hasKey: character.length,
    hasModifier: Object.keys(modifiers).some(mod => !!modifiers[mod]),
    map: {
      character,
      modifiers
    }
  }
}

export default class ShortcutRecorder extends Component {
  constructor(props) {
    super()
    this.state = {
      isRecording: false,
      value: toDetailsObject(props.initialValue, props.exportModifiers),
      currentValue: null
    }
  }

  isValid = details => {
    const { hasKey, hasModifier } = details
    return hasKey && hasModifier
  }

  onKeyChange = event => {
    const { exportModifiers, onUpdate } = this.props
    const details = eventStringgifier.details(event)

    if (this.isValid(details)) {
      this.setState({
        isRecording: false,
        value: details
      })
      onUpdate(toFormattedString(details, exportModifiers), details)
    }
    this.setState({
      currentValue: details
    })
  }

  startRecording = () => {
    this.setState({
      isRecording: true,
      currentValue: toDetailsObject('')
    })
  }

  cancelRecording = () => {
    this.setState({
      isRecording: false,
      currentValue: toDetailsObject('')
    })
  }

  render() {
    const { displayModifiers, placeholder, renderer } = this.props
    const { currentValue, isRecording } = this.state
    const value = toFormattedString(isRecording ? currentValue : this.state.value, displayModifiers)
    return React.createElement(renderer, {
      value,
      placeholder,
      onFocus: this.startRecording,
      onBlur: this.cancelRecording,
      onKeyDown: this.onKeyChange,
      onKeyUp: this.onKeyChange
    })
  }
}

ShortcutRecorder.propTypes = {
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  displayModifiers: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  exportModifiers: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onUpdate: PropTypes.func,
  renderer: PropTypes.node
}

ShortcutRecorder.defaultProps = {
  placeholder: 'Recording...',
  displayModifiers: defaultOptions,
  exportModifiers: defaultOptions,
  renderer: 'input',
  onUpdate: () => {}
}
