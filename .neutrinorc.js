const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  use: [
    "neutrino-preset-react",
    (neutrino) => neutrino.config.target('electron-renderer')
  ],
  env: {
    NODE_ENV: {
      production: {
        use: [
          // Use UglifyJS instead of Babili since it's too slow and runs out of memory
          neutrino =>
            neutrino.config
              .plugin('minify')
              .use(UglifyJSPlugin, [{ parallel: true }])
              .end(),
        ],
      },
    }
  }
}
