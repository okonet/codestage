import React, { PropTypes } from 'react'
import { ListView, ListViewRow, ListViewHeader, Text } from 'react-desktop/macOs'

export default function ItemsList({ heading, items, selectedItem, onClick }) {
  return (
    <ListView>
      <ListViewHeader>
        <Text size="11" color="#696969">{heading}</Text>
      </ListViewHeader>
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
  heading: PropTypes.string,
  items: PropTypes.array.isRequired, // eslint-disable-line
  selectedItem: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
