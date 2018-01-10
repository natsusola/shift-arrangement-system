const path = require('path');

let config = {
  entry: {
    main: path.resolve(__dirname, '../src/main/main.js')
  },
  output: {
    filename: 'main.min.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-0', ['env', {target: {node: 7}}]]
          }
        }
      }
    ]
  },
  target: 'electron-main',
};

module.exports = config;
