const path = require('path');

let config = {
  entry: {
    main: path.resolve(__dirname, '../src/main/main.js')
  },
  output: {
    filename: 'main.min.js',
    path: path.join(__dirname, '../dist')
  },
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
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: true
  },
  target: 'electron-main',
};

module.exports = config;
