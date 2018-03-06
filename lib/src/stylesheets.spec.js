const {
  getSafeCssText,
  getUniqueColors,
  stripBackgroundForSelector,
  colorTableToRTF
} = require('./stylesheets')

describe('getSafeCssText', () => {
  it('should return a new CSS string for a given CSS text', () => {
    const css = getSafeCssText('* { color: red; }')
    expect(css).toMatchSnapshot()
  })

  it('should remove unparsed colors from new CSS', () => {
    const sheet = `
* { background: red; }
* { background: #cf0; }
* { background: transparent; }   
* { background: #yyy; }
* { background: url(""); }
* { background: nonsense; }`
    expect(getSafeCssText(sheet)).toMatchSnapshot()
  })
})

describe('getUniqueColors', () => {
  it('should return a unique list of all used colors', () => {
    const colorTable = getUniqueColors(`
      * { color: red; }
      .test { background-color: red }
      .test-2 { background: rgba(0, 100, 255, 0.5); }
    `)
    expect(colorTable).toMatchSnapshot()
  })
})

describe('stripBackgroundForSelector', () => {
  it('should remove background rules for a given selector', () => {
    const cssText = '.test { background-color: red; background: none; color: blue; }'
    const strippedCss = stripBackgroundForSelector(cssText, 'test')
    expect(strippedCss).toMatchSnapshot()
  })

  it('should only remove background rules for a given selector', () => {
    const cssText = '* { color: red; }'
    const strippedCss = stripBackgroundForSelector(cssText, 'test')
    expect(strippedCss).toMatchSnapshot()
  })
})

describe('colorTableToRTF', () => {
  it('should return a string', () => {
    const colorTable = getUniqueColors(`
      .test { background-color: red }
      .test-2 { background: rgba(0, 100, 255, 0.5); }
    `)
    const res = colorTableToRTF(colorTable)
    expect(res).toMatchSnapshot()
  })
})
