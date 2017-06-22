const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pluginName = 'opengraph'

module.exports = {
  entry: process.env.NODE_ENV !== "production" ? {
    'bundle': './src/index.js'
  } : {
    'plugin': './src/index.js',
    'plugin.min': './src/index.js'
  },
  output: process.env.NODE_ENV !== "production" ? {
    publicPath: '/'
  } : {
    path: path.join(__dirname, './dist', pluginName),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: process.env.NODE_ENV !== "production" ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, './src/LICENSE'),
      to: path.join(__dirname, './dist', pluginName)
    }])
  ]
}
