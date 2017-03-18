var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    javascript: './index.js'
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js'
  },
  devTool: 'source-map',
  module: {
    loaders: [
      {
        test: /.js?$/,
        loaders: ['babel?presets[]=es2015,presets[]=react'],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
        exclude: /node_modules/
      },
      {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        loader: 'file?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.jpg$/,
        loader: 'file',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loaders: ['babel?presets[]=es2015,presets[]=react'],
        exclude: /node_modules/,
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader:'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /node_modules/,
      }


    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
