const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.NODE_ENV !== 'production';
const __TARGET__ = process.env.TARGET || 'electron';

const TARGET_OPTIONS = {
  web: {
    output: 'web',
    indexOutput: 'web',
    target: 'web',
    contentBase: path.join(__dirname, `../dist/web`),
    filePubliPath: '../../'
  },
  electron: {
    output: 'electron/renderer',
    indexOutput: 'electron',
    target: 'electron-renderer',
    contentBase: path.join(__dirname, `../dist/electron`),
    filePubliPath: '../../../'
  }
};

const platform = TARGET_OPTIONS[__TARGET__];

const hash = moment().format('YYMMDDHHmm');

const extractCSS = new ExtractTextPlugin(`css/plugins.css?${hash}`);
const extractSCSS = new ExtractTextPlugin(`css/main.css?${hash}`);

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vendors: [
      'vue', 'vue-router', 'bootstrap-vue', 'lodash', 'moment',
      'pouchdb-browser', 'pouchdb-find', 'file-saver', 'xlsx'
    ]
  },
  output: {
    filename: `js/[name].js?${hash}`,
    path: path.resolve(__dirname, `../dist/${platform.output}`),
  },
  devtool: __DEBUG__ ? 'source-map' : '',
  target: platform.target,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(supports-color|prettier)\/).*/,
        use: {
          loader: 'babel-loader',
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
            },
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
          options: {
            outputPath: `assets/`,
            publicPath: platform.filePubliPath
          }
        }
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': `vue/dist/vue.esm.js`,
      '@': path.resolve(__dirname, '../src/renderer'),
    },
    extensions: ['.js', '.vue', '.json', '.scss']
  },
  node: {
    __dirname: __DEBUG__,
    __filename: __DEBUG__
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
      filename: `js/[name].js`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new webpack.DefinePlugin({
      __DEBUG__: __DEBUG__,
    }),
    extractCSS,
    extractSCSS,
  ]
};

if (process.env.TARGET === 'web') {
  config.devServer = {
    contentBase: platform.contentBase
  };
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;
