import React from 'react'
import ReactDOM from 'react-dom'
import App from './ui/App'
import './ui/index.css'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote, ipcRenderer } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const settings = remote.require('electron-settings')
const { resolvePackageDir } = remote.require('../../lib/')
const { DEFAULT_SETTINGS } = remote.require('../electron/defaults')

const route = window.location.hash

const themeDirPath = path.join(resolvePackageDir('highlight.js'), 'styles')
const languagesList = fs
  .readdirSync(path.join(resolvePackageDir('highlight.js'), 'lib', 'languages'))
  .map(file => file.replace(/\.js$/, ''))
const themesList = fs.readdirSync(themeDirPath).map(file => file.replace(/\.css$/, ''))

let sharedState = {}

function render(Component) {
  const props = {
    ...sharedState,
    preferences: settings.getAll(),
    themeDirPath,
    themesList,
    languagesList
  }
  ReactDOM.render(<Component route={route} {...props} />, document.getElementById('root'))
}

render(App)

Object.keys(DEFAULT_SETTINGS).forEach(key => {
  settings.watch(key, (newVal, oldVal) => {
    console.log(`Settings updated for ${key}: ${oldVal} -> ${newVal}`)
    render(App)
  })
})

ipcRenderer.on('global-shortcut-pressed', (event, { html, language, relevance }) => {
  sharedState = {
    ...sharedState,
    html,
    language,
    relevance
  }
  console.log(sharedState)
  render(App)
})

if (module.hot) {
  module.hot.accept('./ui/App', () => {
    const NextApp = require('./ui/App').default // eslint-disable-line
    render(NextApp)
  })
}
