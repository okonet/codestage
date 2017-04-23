import React, { PropTypes } from 'react'
import { ListView, ListViewRow, Text } from 'react-desktop/macOs'

export default function ItemsList({ items, selectedItem, onClick }) {
  return (
    <ListView>
      {items.map(item => (
        <ListViewRow
          onClick={onClick.bind(this, item)} // eslint-disable-line react/jsx-no-bind
          background={selectedItem === item ? '#d8dadc' : null}
        >
          <Text color="#414141" size="13">{item}</Text>
        </ListViewRow>
      ))}
    </ListView>
  )
}

ItemsList.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line
  selectedItem: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
