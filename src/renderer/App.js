import React, { PropTypes } from 'react'
import { injectGlobal } from 'styled-components'
import Main from './Main'
import Preferences from './Preferences'

// eslint-disable-next-line no-unused-expressions
injectGlobal`
body {
 margin: 0;
 padding: 0;
}
`

export default function App({ route, ...rest }) {
  if (route.endsWith('preferences')) {
    return <Preferences {...rest} />
  }
  return <Main {...rest} />
}

App.propTypes = {
  route: PropTypes.string.isRequired
}
