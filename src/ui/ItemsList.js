import React, { Component, PropTypes } from 'react'
import { ArrowKeyStepper, AutoSizer, List } from 'react-virtualized'
import { ListView, ListViewRow, ListViewHeader, Text } from 'react-desktop/macOs'
import { ListViewFooter, SearchField } from 'react-desktop'

export default class ItemsList extends Component {
  constructor(props) {
    super()
    this.state = {
      items: props.items,
      query: ''
    }
  }

  componentDidMount() {
    this.syncScrollPosition()
  }

  componentDidUpdate() {
    this.syncScrollPosition()
  }

  syncScrollPosition() {
    const selectedIndex = this.getSelectedIndex()
    if (this.keyStepper) {
      this.keyStepper.setScrollIndexes({ scrollToRow: selectedIndex })
    }
  }

  getSelectedIndex() {
    const { selectedItem } = this.props
    const { items } = this.state
    return items.indexOf(selectedItem)
  }

  setRef = ref => {
    this.keyStepper = ref
  }

  rowRenderer = ({ key, index, style }) => {
    const { items } = this.state
    const selectedIndex = this.getSelectedIndex()
    const item = items[index]
    return (
      <ListViewRow
        key={key}
        onClick={() => this.onSelectionChange(index)} // eslint-disable-line react/jsx-no-bind
        background={selectedIndex === index ? '#d8dadc' : null}
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

  onSelectionChange = index => {
    const { onSelect } = this.props
    const { items } = this.state
    const item = items[index]
    if (typeof onSelect === 'function') {
      onSelect(item)
    }
  }

  onStepperChanged = ({ scrollToRow }) => {
    this.onSelectionChange(scrollToRow)
  }

  onFilterChange = evt => {
    const { items } = this.props
    const query = evt.target.value
    const filteredItems = items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
    this.setState({
      query,
      items: filteredItems
    })
  }

  onKeyDown = evt => {
    console.log(this.state)
    const { items } = this.state
    const selectedIndex = this.getSelectedIndex()
    switch (evt.key) {
      case 'ArrowUp': {
        this.onSelectionChange(Math.max(0, selectedIndex - 1))
        break
      }
      case 'ArrowDown': {
        this.onSelectionChange(Math.min(selectedIndex + 1, items.length - 1))
        break
      }
      default: {
        break
      }
    }
  }

  render() {
    const { heading } = this.props
    const { query, items } = this.state
    const selectedIndex = this.getSelectedIndex()
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
        <ListViewFooter>
          <SearchField
            placeholder={`Filter ${heading}...`}
            value={query}
            onChange={this.onFilterChange}
            onKeyDown={this.onKeyDown}
          />
        </ListViewFooter>
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
