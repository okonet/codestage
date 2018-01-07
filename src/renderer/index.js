import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { remote, ipcRenderer } from 'electron' // eslint-disable-line import/no-extraneous-dependencies
import settings from 'electron-settings'
import { getThemes, getLanguages } from '../../lib/src/highlighters/ace'
import configureStore from '../shared/store/createStore'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'

const { REDUX_ACTION } = require('../shared/constants/events')

const route = window.location.hash
const initialState = remote.getGlobal('mainStore').getState() || {} // Hydrate the initial state from the main process on full reload
const store = configureStore(initialState, 'renderer')

function render() {
  const App = require('./App').default // eslint-disable-line
  Promise.all([getLanguages(), getThemes()]).then(res => {
    const languagesList = res[0]
    const themesList = res[1]
    const props = {
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

if (module.hot) {
  module.hot.accept(render)
}
