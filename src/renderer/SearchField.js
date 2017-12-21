import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { SearchField as SearchInput } from 'react-desktop/macOs'

const Input = styled(SearchInput)`
  font-size: 16px;
  width: 100%;
`

class SearchField extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown = evt => {
    const { focusable } = this.props
    // Focus on Cmd + F
    if (evt.metaKey && evt.code === 'KeyF' && this.node && focusable) {
      const el = ReactDOM.findDOMNode(this.node) // eslint-disable-line react/no-find-dom-node
      el.querySelector('input').focus()
    }
  }

  setRef = node => {
    this.node = node
  }

  render() {
    const { ...rest } = this.props
    delete rest.focusable
    return <Input type="search" innerRef={this.setRef} {...rest} />
  }
}

SearchField.propTypes = {
  focusable: PropTypes.bool
}

SearchField.defsultProps = {
  focusable: false
}

export default SearchField
