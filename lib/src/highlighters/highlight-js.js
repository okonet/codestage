const Highlight = require('highlight.js')

/* Highlight `value` as `language`. */
function highlight(value, language) {
  return Highlight.highlight(language, value).value
}

/* Highlight `value` with auto language detection. */
function highlightAuto(value, options) {
  return Highlight.highlightAuto(value, options.subset)
}

module.exports = {
  highlight,
  highlightAuto
}
