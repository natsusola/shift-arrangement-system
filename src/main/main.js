const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');
require('electron-debug')({ showDevTools: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let win;

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9090'
  : `file://${path.resolve(__dirname, 'renderer')}/index.html`;

function createWindow () {
  // Create the browser window.
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1600,
    defaultHeight: 900
  });

  mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    // loadURL: 'http://localhost:8080',
    x: mainWindowState.x,
    y: mainWindowState.y,
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   pathname: path.resolve(__dirname, '../../dist', 'index.html'),
  //   // pathname: `file://${__dirname}/index.html`,
  //   protocol: 'file:',
  //   slashes: true
  // }))
  mainWindow.loadURL(winURL);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindowState.manage(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
