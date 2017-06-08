import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setWindowSize } from '../shared/actions/window'
import { WindowSizes } from '../shared/contants/window'
import LangChooser from './LangChooser'

const TransparentWindow = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

class Main extends Component {
  render() {
    const { size, onClick } = this.props
    return (
      <TransparentWindow onClick={() => {
        onClick(size)
      }}>
        {size}
        <LangChooser {...this.props} />
      </TransparentWindow>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    size: state.window.size
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (size) => {
      if (size === WindowSizes.MINI) {
        dispatch(setWindowSize(WindowSizes.NORMAL))
      } else {
        dispatch(setWindowSize(WindowSizes.MINI))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
