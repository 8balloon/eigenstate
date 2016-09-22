var webpack = require('webpack')

module.exports = {
  entry: {
    devServer: 'webpack-dev-server/client?http://localhost:8080',
    devServerHot: 'webpack/hot/dev-server',
    js: './index.js',
    html: './index.html'
  },
  output: {
      path: './build',
      filename: 'bundle.js'
  },
  module: {
      loaders: [
          {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                  presets: ['react', 'es2015'],
                  plugins: ['transform-object-rest-spread']
              }
          },
          {
              test: /index\.html$/,
              loader: 'file?name=[name].[ext]'
          }
      ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ]
}
