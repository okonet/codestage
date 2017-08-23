module.exports = {
  "use": [
    "neutrino-preset-react",
    (neutrino) => neutrino.config.target('electron-renderer')
  ]
}
