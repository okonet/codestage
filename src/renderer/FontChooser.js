import React, { PropTypes } from 'react'
import fontManager from 'font-manager' // eslint-disable-line
import { ascend, groupBy, filter, prop, sort } from 'ramda'
import { Flex, Box } from 'grid-styled'
import { Box as Well, Checkbox, Label } from 'react-desktop/macOs'
import { FontSizes } from '../shared/constants/editor'
import ItemsList from './ItemsList'

const fonts = fontManager.getAvailableFontsSync()
const familyName = prop('family')
const byName = ascend(familyName)
const onlyMonospace = family => family.some(font => font.monospace === true)
const sortedFonts = sort(byName, fonts)
const byFamilies = groupBy(familyName)
const allFonts = byFamilies(sortedFonts)
const monospaceFonts = filter(onlyMonospace, allFonts)

export default class FontChooser extends React.Component {
  static propTypes = {
    fontface: PropTypes.string.isRequired,
    fontsize: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  state = {
    monospaceOnly: true
  }

  monospaceOnlyChanged = event => {
    this.setState({ monospaceOnly: event.target.checked })
  }

  onFontSizeChanged = event => {
    const newFontSize = event.target.value
    const { fontface, onChange } = this.props
    onChange({
      fontface,
      fontsize: newFontSize
    })
  }

  onFontFamilyChanged = newFontFamily => {
    const { fontsize, onChange } = this.props
    onChange({
      fontface: newFontFamily,
      fontsize
    })
  }

  render() {
    const { fontface, fontsize } = this.props
    const { monospaceOnly } = this.state
    const fontList = Object.keys(monospaceOnly ? monospaceFonts : allFonts)
    const min = FontSizes[0]
    const max = FontSizes[FontSizes.length - 1]
    return (
      <Flex direction="column">
        <Well label="Font size">
          <Label>Font size — {fontsize / 2}pt</Label>
          <Flex>
            <Label>{min / 2}pt</Label>
            <input
              type="range"
              min={min}
              max={max}
              step={16}
              value={fontsize}
              style={{ width: 110 }}
              onChange={this.onFontSizeChanged}
            />
            <Label>{max / 2}pt</Label>
          </Flex>
        </Well>

        <Box my={1}>
          <Well label="Font family" padding={0} style={{ height: 340 }}>
            <ItemsList
              focusable
              heading="fonts"
              items={fontList}
              selectedItem={fontface}
              onChange={this.onFontFamilyChanged}
              onSelect={this.props.onConfirm}
            />
          </Well>
        </Box>

        <Box m={1}>
          <Checkbox
            label="Only monospace fonts"
            onChange={this.monospaceOnlyChanged}
            defaultChecked={monospaceOnly}
          />
        </Box>
      </Flex>
    )
  }
}
