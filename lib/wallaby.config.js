/* eslint global-require: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

module.exports = () => ({
  files: [
    'package.json',
    'src/**/*.js',
    'src/**/*.js.snap',
    'node_modules/highlight.js/styles/*.css',
    '!src/**/*.spec.js'
  ],

  tests: ['src/**/*.spec.js'],

  env: {
    type: 'node',
    runner: 'node'
  },

  testFramework: 'jest'
})
