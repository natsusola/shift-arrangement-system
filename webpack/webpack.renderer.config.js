const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.NODE_ENV !== 'production';
const __TARGET__ = process.env.TARGET || 'electron';

const TARGET_OPTIONS = {
  web: {
    name: 'WEB',
    output: 'web',
    indexOutput: 'web',
    target: 'web',
    contentBase: path.join(__dirname, `../dist/web`),
    filePubliPath: '../../'
  },
  electron: {
    name: 'ELECTRON',
    output: 'electron/renderer',
    indexOutput: 'electron',
    target: 'electron-renderer',
    contentBase: path.join(__dirname, `../dist/electron`),
    filePubliPath: '../../../'
  }
};

const platform = TARGET_OPTIONS[__TARGET__];

const datetime = moment().format('YYYY/MM/DD HH:mm ZZ');

const extractCSS = new ExtractTextPlugin(`css/plugins.css?${__DEBUG__ ? '' : '[contenthash:8]'}`);
const extractSCSS = new ExtractTextPlugin(`css/main.css?${__DEBUG__ ? '' : '[contenthash:8]'}`);

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vue: ['vue', 'vue-router', 'bootstrap-vue'],
    pouchdb: ['pouchdb-browser', 'pouchdb-find', 'pouchdb-load', 'pouchdb-replication-stream'],
    vendors: ['lodash', 'moment', 'file-saver', 'xlsx'],
  },
  output: {
    filename: `js/[name].js?${__DEBUG__ ? '' : '[chunkhash:8]'}`,
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
          use: [
            {
              loader: 'css-loader',
              options: { minimize: !__DEBUG__, }
            },
            { loader: 'sass-loader', }
          ]
        })
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [{
            loader: 'css-loader',
            options: { minimize: !__DEBUG__ }
          }]
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
      'pouchdb-promise':  'pouchdb-promise/lib/index', // 不加 pouchdb-utils 會出錯
    },
    extensions: ['.js', '.vue', '.json', '.scss']
  },
  node: {
    __dirname: __DEBUG__,
    __filename: __DEBUG__
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: 'popper.js',
      Tether: 'tether',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'pouchdb', 'vue'],
      filename: `js/[name].js?${__DEBUG__ ? '' : '[chunkhash:8]'}`
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      updated_at: datetime
    }),
    new webpack.DefinePlugin({
      __DEBUG__: __DEBUG__,
      __TARGET__: JSON.stringify(platform.name)
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

if (!__DEBUG__) {
  config.plugins.push(
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new webpack.optimize.UglifyJsPlugin({parallel: true})
  );
} else {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
