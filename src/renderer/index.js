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

function render() {
  const App = require('./App').default // eslint-disable-line
  Promise.all([getLanguages(), getThemes()]).then(res => {
    const languagesList = res[0]
    const themesList = res[1]
    const props = {
      ...sharedState,
      preferences: settings.get('highlight'),
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
  settings.watch(key, render)
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
  render()
})

if (module.hot) {
  module.hot.accept(render)
}
