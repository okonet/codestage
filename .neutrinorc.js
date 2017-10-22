module.exports = {
  use: [
    ["neutrino-preset-react", {
      babel: {
        presets: [
          ['babel-preset-env', {
            targets: {
              browsers: [
                'Chrome 59',
              ]
            }
          }]
        ]
      }
    }],
    (neutrino) => neutrino.config.target('electron-renderer')
  ]
}
