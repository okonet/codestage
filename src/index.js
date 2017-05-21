import React from 'react'
import ReactDOM from 'react-dom'
import App from './ui/App'
import './ui/index.css'

const route = window.location.hash

function render(Component) {
  ReactDOM.render(<Component route={route} />, document.getElementById('root'))
}

render(App)

if (module.hot) {
  module.hot.accept('./ui/App', () => {
    const NextApp = require('./ui/App').default // eslint-disable-line
    render(NextApp)
  })
}
