import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import settings from 'electron-settings'
import { Flex } from 'grid-styled'
import { setWindowVisibility } from '../shared/actions/window'
import Editor from './Editor'

function Main({ closeWindow, confirmSelection, ...rest }) {
  return (
    <Flex>
      <Editor {...rest} onConfirmSelection={confirmSelection} onClose={closeWindow} />
    </Flex>
  )
}

Main.propTypes = {
  confirmSelection: PropTypes.func,
  closeWindow: PropTypes.func
}

const mapStateToProps = state => ({
  windowVisible: state.window.windowVisible
})

const mapDispatchToProps = dispatch => ({
  confirmSelection: state => {
    settings.set('highlight', {
      ...settings.get('highlight'),
      ...state
    })
    dispatch(setWindowVisibility(false))
  },
  closeWindow: () => {
    dispatch(setWindowVisibility(false))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)
