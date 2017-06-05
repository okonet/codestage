import React, { Component } from 'react'
import styled from 'styled-components'
import LangChooser from './LangChooser'

const TransparentWindow = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

export default class Main extends Component {
  render() {
    return (
      <TransparentWindow>
        <LangChooser {...this.props} />
      </TransparentWindow>
    )
  }
}
