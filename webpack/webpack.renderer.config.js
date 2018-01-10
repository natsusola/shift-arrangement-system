const path = require('path');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.__DEBUG__ !== 'false';

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vendors: [
      'vue', 'lodash'
    ]
  },
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: __DEBUG__ ? 'source-map' : '',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['stage-0', ['env', {modules: false}]]
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: __DEBUG__,
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: !__DEBUG__ } },
          { loader: 'sass-loader' },
        ]
      },
      {
        test: /\.(png|gif|jpg|svg|ttf|woff|woff2|otf|eot)$/,
        use: {
          loader: 'file-loader',
          // options: { outputPath: 'assets/', publicPath: '/fs/' }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
    })
  ]
};
