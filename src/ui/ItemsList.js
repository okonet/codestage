import React, { Component, PropTypes } from 'react'
import { ArrowKeyStepper, AutoSizer, List } from 'react-virtualized'
import { ListView, ListViewRow, ListViewHeader, Text } from 'react-desktop/macOs'

export default class ItemsList extends Component {
  componentDidMount() {
    this.syncScrollPosition()
  }

  componentDidUpdate() {
    this.syncScrollPosition()
  }

  syncScrollPosition() {
    const { items, selectedItem } = this.props
    const selectedIndex = items.indexOf(selectedItem)
    if (this.keyStepper) {
      this.keyStepper.setScrollIndexes({ scrollToRow: selectedIndex })
    }
  }

  setRef = ref => {
    this.keyStepper = ref
  }

  rowRenderer = ({ key, index, style }) => {
    const { items, selectedItem } = this.props
    const item = items[index]
    return (
      <ListViewRow
        key={key}
        onClick={() => this.onSelectionChange(item)} // eslint-disable-line react/jsx-no-bind
        background={selectedItem === item ? '#d8dadc' : null}
        style={{
          ...style,
          margin: 0,
          boxSizing: 'border-box'
        }}
      >
        <Text color="#414141" size="13">
          {item}
        </Text>
      </ListViewRow>
    )
  }

  onSelectionChange = item => {
    const { onSelect } = this.props
    if (typeof onSelect === 'function') {
      onSelect(item)
    }
  }

  onStepperChanged = ({ scrollToRow }) => {
    const { items } = this.props
    const item = items[scrollToRow]
    this.onSelectionChange(item, false)
  }

  render() {
    const { heading, items, selectedItem } = this.props
    const selectedIndex = items.indexOf(selectedItem)
    return (
      <ListView>
        <ListViewHeader>
          <Text size="11" color="#696969">
            {heading}
          </Text>
        </ListViewHeader>
        <AutoSizer>
          {({ height, width }) =>
            <ArrowKeyStepper
              columnCount={1}
              rowCount={items.length}
              mode="cells"
              ref={this.setRef}
              onScrollToChange={this.onStepperChanged}
            >
              {({ onSectionRendered }) =>
                <List
                  width={width}
                  height={height}
                  rowCount={items.length}
                  rowHeight={28}
                  rowRenderer={this.rowRenderer}
                  onSectionRendered={onSectionRendered}
                  scrollToIndex={selectedIndex}
                />}
            </ArrowKeyStepper>}
        </AutoSizer>
      </ListView>
    )
  }
}

ItemsList.propTypes = {
  heading: PropTypes.string,
  items: PropTypes.array.isRequired, // eslint-disable-line
  selectedItem: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}
