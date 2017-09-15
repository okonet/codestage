import React, { Component, PropTypes } from 'react'
import { ArrowKeyStepper, AutoSizer, List } from 'react-virtualized'
import { ListView, ListViewRow, ListViewHeader, Text } from 'react-desktop/macOs'
import { ListViewFooter, TextInput } from 'react-desktop'

export default class ItemsList extends Component {
  constructor(props) {
    super()
    const { items, selectedItem } = props
    const selectedIndex = items.indexOf(selectedItem)
    this.state = {
      items: props.items,
      selectedIndex,
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
    const { items, selectedIndex } = this.state
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
    this.setState(
      {
        selectedIndex: index
      },
      () => {
        if (typeof onSelect === 'function') {
          onSelect(item)
        }
      }
    )
  }

  onStepperChanged = ({ scrollToRow }) => {
    const { items } = this.state
    const item = items[scrollToRow]
    this.onSelectionChange(item, false)
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
    switch (evt.key) {
      case 'ArrowUp': {
        this.setState(({ selectedIndex }) => ({
          selectedIndex: Math.max(0, selectedIndex - 1)
        }))
        break
      }
      case 'ArrowDown': {
        this.setState(({ items, selectedIndex }) => ({
          selectedIndex: Math.min(selectedIndex + 1, items.length - 1)
        }))
        break
      }
      default: {
        break
      }
    }
  }

  render() {
    const { heading } = this.props
    const { query, items, selectedIndex } = this.state
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
          <TextInput value={query} onChange={this.onFilterChange} onKeyDown={this.onKeyDown} />
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
