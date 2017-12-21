import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { ipcRenderer } from 'electron' // eslint-disable-line import/no-extraneous-dependencies
import settings from 'electron-settings'
import { getThemes, getLanguages } from '../../lib/src/highlighters/ace'
import configureStore from '../shared/store/createStore'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'

const { HIGHLIGHT_COMPLETE, REDUX_ACTION } = require('../shared/constants/events')

const route = window.location.hash
const initialState = {}
const store = configureStore(initialState, 'renderer')

let sharedState = {}

// If running for the first time set settings to use defaults
if (!settings.has('theme')) {
  settings.setAll(DEFAULT_SETTINGS)
}
function render() {
  const App = require('./App') // eslint-disable-line
  Promise.all([getLanguages(), getThemes()]).then(res => {
    const languagesList = res[0]
    const themesList = res[1]
    const props = {
      ...sharedState,
      preferences: settings.getAll(),
      themesList,
      languagesList
    }
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <App route={route} {...props} />
        </Provider>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

render()

Object.keys(DEFAULT_SETTINGS).forEach(key => {
  settings.watch(key, (newVal, oldVal) => {
    console.log(`Settings updated for ${key}: ${oldVal} -> ${newVal}`)
    render()
  })
})

ipcRenderer.on(REDUX_ACTION, (event, payload) => {
  store.dispatch(payload)
})

ipcRenderer.on(HIGHLIGHT_COMPLETE, (event, { text, html, language, relevance }) => {
  sharedState = {
    ...sharedState,
    text,
    html,
    language,
    relevance
  }
  console.log(sharedState)
  render()
})

if (module.hot) {
  module.hot.accept(render)
}
