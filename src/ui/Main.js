import React, { PropTypes } from 'react'
import { TitleBar, Window } from 'react-desktop/macOs'
import { connect } from 'react-redux'
import { withTimer } from 'react-with-timer-hoc'
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

const BaloonWithTimer = withTimer({
  delay: 3000,
  options: { startOnMount: true }
})(Baloon)

function Main({ size, windowVisible, onClick, closeWindow, ...rest }) {
  if (!windowVisible) {
    return null
  }

  return (
    <TransparentWindow
      onClick={() => {
        onClick(size)
      }}
      size={size}
    >
      {size === WindowSizes.MINI
        ? <BaloonWithTimer onTimeout={closeWindow} {...rest} />
        : <Window padding="0px" style={{ background: 'none' }}>
            <TitleBar controls onCloseClick={closeWindow} />
            <LangChooser {...rest} onConfirmSelection={closeWindow} />
          </Window>}
    </TransparentWindow>
  )
}

Main.propTypes = {
  size: PropTypes.oneOf([WindowSizes.MINI, WindowSizes.NORMAL]),
  windowVisible: PropTypes.bool,
  onClick: PropTypes.func,
  closeWindow: PropTypes.func
}

const mapStateToProps = state => ({
  size: state.window.size,
  windowVisible: state.window.windowVisible
})

const mapDispatchToProps = dispatch => ({
  onClick: size => {
    if (size === WindowSizes.MINI) {
      dispatch(setWindowSize(WindowSizes.NORMAL))
    }
  },
  closeWindow: () => {
    dispatch(setWindowVisibility(false))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
