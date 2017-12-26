import React from 'react'
import { Window } from 'react-desktop/macOs'
import General from './General'

export default function Preferences(props) {
  return (
    <Window>
      <General {...props} />
    </Window>
  )
}
