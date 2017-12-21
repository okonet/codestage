import React, { PropTypes } from 'react'
import Main from './Main'
import Preferences from './Preferences'

export default function App({ route, ...rest }) {
  if (route.endsWith('preferences')) {
    return <Preferences {...rest} />
  }
  return <Main {...rest} />
}

App.propTypes = {
  route: PropTypes.string.isRequired
}
