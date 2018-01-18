const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.NODE_ENV !== 'production';
const hash = moment().format('YYMMDDHHmm');

const extractCSS = new ExtractTextPlugin(`renderer/css/plugins.css?${hash}`);
const extractSCSS = new ExtractTextPlugin(`renderer/css/main.css?${hash}`);

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vendors: [
      'vue', 'vue-router', 'bootstrap-vue', 'lodash', 'moment'
    ]
  },
  output: {
    filename: `renderer/js/[name].js?${hash}`,
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: __DEBUG__ ? 'source-map' : '',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // include: [ require.resolve("bootstrap-vue") ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-0'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: false,
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          use: [ 'css-loader', 'sass-loader' ]
        })
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [ 'css-loader' ]
        })
      },
      {
        test: /\.(png|gif|jpg|svg|ttf|woff|woff2|otf|eot)$/,
        use: {
          loader: 'file-loader',
          options: { outputPath: 'renderer/assets/', publicPath: '../../' }
        }
      },
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      '@': path.resolve(__dirname, '../src/renderer'),
    },
    extensions: ['.js', '.vue', '.json', '.scss']
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Popper: 'popper.js',
        Tether: 'tether',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors'],
      filename: 'renderer/js/[name].js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    extractCSS,
    extractSCSS,
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
