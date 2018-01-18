'use static';

process.env.NODE_ENV = 'production';

const del = require('del');
const { spawn } = require('child_process');
const chalk = require('chalk');
const webpack = require('webpack');
const Multispinner = require('multispinner');

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

build();

function build() {
  del.sync(['dist/*']);
  const tasks = ['main', 'renderer'];

  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  });

  let results = '';

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f');
    console.log(`\n\n${results}`);
    console.log(`take it away ${chalk.yellow('`electron-builder`')}\n`);
    process.exit()
  });

  pack(mainConfig)
    .then(res => {
      results += res + '\n\n';
      m.success('main');
    })
    .catch(err => {
      m.error('main');
      console.log(`\n  failed to build main process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    });

  pack(rendererConfig)
    .then(res => {
      results += res + '\n\n';
      m.success('renderer');
    })
    .catch(err => {
      m.error('renderer');
      console.log(`\n  failed to build main process`)
      console.error(`\n${err}\n`)
      process.exit(1)
    });
}

function pack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err);
      else if (stats.hasErrors()) {
        let err = ''
        stats.toString({
          chunks: false,
          colors: true
        })
        .split(/\r?\n/)
        .forEach(line => { err += `    ${line}\n` });

        reject(err);
      }
      else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }));
      }
    });
  });
}
