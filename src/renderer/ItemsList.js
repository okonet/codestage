import React, { Component, PropTypes } from 'react'
import { equals } from 'ramda'
import { ArrowKeyStepper, AutoSizer, List } from 'react-virtualized'
import { Flex, Box } from 'grid-styled'
import { ListViewRow, Text } from 'react-desktop/macOs'
import SearchField from './SearchField'

const ListHeader = Box.extend`
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
`

export default class ItemsList extends Component {
  static propTypes = {
    focusable: PropTypes.bool,
    heading: PropTypes.string,
    items: PropTypes.array.isRequired, // eslint-disable-line
    selectedItem: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    focusable: false
  }

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

  componentWillReceiveProps(nextProps) {
    if (!equals(this.props.items, nextProps.items)) {
      this.setState({
        items: nextProps.items,
        query: ''
      })
    }
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
    const { onChange } = this.props
    const { items } = this.state
    if (typeof onChange === 'function') {
      onChange(items[index])
    }
  }

  onEnterPressed = () => {
    const { onSelect } = this.props
    const { items } = this.state
    const selectedIndex = this.getSelectedIndex()
    this.onSelectionChange(selectedIndex)
    if (typeof onSelect === 'function') {
      onSelect(items[selectedIndex])
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
    const { items } = this.state
    const selectedIndex = this.getSelectedIndex()
    switch (evt.key) {
      case 'ArrowUp': {
        evt.preventDefault()
        this.onSelectionChange(Math.max(0, selectedIndex - 1))
        break
      }
      case 'ArrowDown': {
        evt.preventDefault()
        this.onSelectionChange(Math.min(selectedIndex + 1, items.length - 1))
        break
      }
      case 'Enter': {
        evt.preventDefault()
        this.onEnterPressed()
        break
      }
      default: {
        break
      }
    }
  }

  render() {
    const { heading, focusable } = this.props
    const { query, items } = this.state
    const selectedIndex = this.getSelectedIndex()
    return (
      <Flex column flex="1" style={{ height: '100%' }}>
        <ListHeader p={7}>
          <SearchField
            focusable={focusable}
            placeholder={`Filter ${heading}...`}
            value={query}
            onChange={this.onFilterChange}
            onKeyDown={this.onKeyDown}
          />
        </ListHeader>
        <Box flex="1">
          <AutoSizer>
            {({ height, width }) => (
              <ArrowKeyStepper
                columnCount={1}
                rowCount={items.length}
                mode="cells"
                ref={this.setRef}
                onScrollToChange={this.onStepperChanged}
              >
                {({ onSectionRendered }) => (
                  <List
                    width={width}
                    height={height}
                    rowCount={items.length}
                    rowHeight={28}
                    rowRenderer={this.rowRenderer}
                    onSectionRendered={onSectionRendered}
                    scrollToIndex={selectedIndex}
                  />
                )}
              </ArrowKeyStepper>
            )}
          </AutoSizer>
        </Box>
      </Flex>
    )
  }
}
