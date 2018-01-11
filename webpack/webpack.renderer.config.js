const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.__DEBUG__ !== 'false';
const hash = moment().format('YYMMDDHHmm');

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vendors: [ 'vue', 'lodash' ]
  },
  output: {
    filename: `renderer/js/[name].min.js?${hash}`,
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: __DEBUG__ ? 'source-map' : '',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-0']
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
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      '@': path.join(__dirname, '../src/renderer'),
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors'],
      filename: 'renderer/js/[name].min.js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../src/index.html'),
    })
  ]
};

module.exports = config;
