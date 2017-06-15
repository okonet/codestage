import React, { PropTypes } from 'react'
import { TitleBar, Window } from 'react-desktop/macOs'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setWindowSize, setWindowVisibility } from '../shared/actions/window'
import { WindowSizes } from '../shared/contants/window'
import Baloon from './Baloon'
import LangChooser from './LangChooser'

const TransparentWindow = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  -webkit-app-region: ${props => (props.size === WindowSizes.NORMAL ? 'drag' : 'inherit')};
`

function Main({ size, onClick, onCloseClick }) {
  return (
    <TransparentWindow
      onClick={() => {
        onClick(size)
      }}
      size={size}
    >
      {size === WindowSizes.MINI
        ? <Baloon {...this.props} />
        : <Window chrome padding="0px">
            <TitleBar controls inset onCloseClick={onCloseClick}>
              Title
            </TitleBar>
            <LangChooser {...this.props} />
          </Window>}
    </TransparentWindow>
  )
}

Main.propTypes = {
  size: PropTypes.oneOf([WindowSizes.MINI, WindowSizes.NORMAL]),
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func
}

const mapStateToProps = state => ({
  size: state.window.size
})

const mapDispatchToProps = dispatch => ({
  onClick: size => {
    if (size === WindowSizes.MINI) {
      dispatch(setWindowSize(WindowSizes.NORMAL))
    }
  },
  onCloseClick: () => {
    dispatch(setWindowVisibility(false))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
