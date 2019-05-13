var path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    path: __dirname + './dist',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
    ],
    loaders: [
      { test: /\.json$/, include: path.join(__dirname, 'node_modules', 'pixi.js'), loader: 'json' },
      { test: /\.js$/, include: /sample|src/, loader: 'babel?presets[]=es2015' },
      { test: /\.png$|\.jpg$/, include: /sample/, loader: 'file?name=[path][name].[ext]' }
    ]
  },
  node: {
    fs: 'empty'
  },
  devServer: {
    contentBase: __dirname + '/sample'
  }
}
