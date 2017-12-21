import React, { PropTypes } from 'react'

const { array, string, func } = PropTypes

function Dropdown({ items, selectedItem, onChange }) {
  return (
    <select value={selectedItem} onChange={onChange}>
      {items.map(item => <option key={item}>{item}</option>)}
    </select>
  )
}

Dropdown.propTypes = {
  items: array.isRequired, // eslint-disable-line react/forbid-prop-types
  selectedItem: string.isRequired,
  onChange: func
}

export default Dropdown
