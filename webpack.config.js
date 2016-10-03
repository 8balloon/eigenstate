module.exports = {
  entry: {
    js: './src/index.js'
  },
  output: {
    path: './lib',
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
      loaders: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                  presets: ['es2015'],
              }
          }
      ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    react: true
  }
}
