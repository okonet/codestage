/* eslint global-require: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

module.exports = wallaby => ({
  files: [
    'package.json',
    'src/*.js',
    'src/**/*.js.snap',
    'node_modules/highlight.js/styles/*.css',
    '!src/*.spec.js'
  ],

  tests: ['src/*.spec.js'],

  env: {
    type: 'node',
    runner: 'node',
    params: {
      runner: '--harmony_proxies'
    }
  },

  testFramework: 'jest'

  // setup: () => {
  //   wallaby.testFramework.configure(require('./package.json').jest);
  // }

})
