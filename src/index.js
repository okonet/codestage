import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import configureStore from './shared/store/createStore'
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
const { HIGHLIGHT_COMPLETE, REDUX_ACTION } = require('./shared/constants/events')

const route = window.location.hash

const themeDirPath = path.join(resolvePackageDir('highlight.js'), 'styles')
const languagesList = fs
  .readdirSync(path.join(resolvePackageDir('highlight.js'), 'lib', 'languages'))
  .map(file => file.replace(/\.js$/, ''))
const themesList = fs.readdirSync(themeDirPath).map(file => file.replace(/\.css$/, ''))

const initialState = {}
const store = configureStore(initialState, 'renderer')

let sharedState = {}

// If running for the first time set settings to use defaults
if (!settings.has('theme')) {
  settings.setAll(DEFAULT_SETTINGS)
}
function render(Component) {
  const props = {
    ...sharedState,
    preferences: settings.getAll(),
    themeDirPath,
    themesList,
    languagesList
  }
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component route={route} {...props} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

Object.keys(DEFAULT_SETTINGS).forEach(key => {
  settings.watch(key, (newVal, oldVal) => {
    console.log(`Settings updated for ${key}: ${oldVal} -> ${newVal}`)
    render(App)
  })
})

ipcRenderer.on(REDUX_ACTION, (event, payload) => {
  store.dispatch(payload)
})

ipcRenderer.on(HIGHLIGHT_COMPLETE, (event, { html, language, relevance }) => {
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
    const NextApp = require('./ui/App') // eslint-disable-line
    render(NextApp)
  })
}
