import React from 'react'
import focusOnKeyDown from 'react-focus-onkeydown'
import styled from 'styled-components'

const Input = styled(focusOnKeyDown('input'))`
font-size: 16px;
  width: 100%;
`

const SearchField = props => <Input type="search" {...props} />
export default SearchField
