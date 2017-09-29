import React, { PropTypes } from 'react'
import focusOnKeyDown from 'react-focus-onkeydown'
import styled from 'styled-components'

const Input = styled(focusOnKeyDown('input'))`
font-size: 16px;
  width: 100%;
`

const SearchField = ({ focusable = false, ...rest }) =>
  <Input type="search" focusOnKeyDown={focusable} {...rest} />

SearchField.propTypes = {
  focusable: PropTypes.bool
}

export default SearchField
