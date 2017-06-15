import React, { PropTypes } from 'react'
import { Label } from 'react-desktop/macOs'

function Baloon({ language, relevance }) {
  return <Label>{language}, {relevance}</Label>
}

Baloon.propTypes = {
  language: PropTypes.string,
  relevance: PropTypes.number
}

export default Baloon
