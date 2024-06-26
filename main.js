// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, shell, dialog} = require('electron')
const ipc = require('electron').ipcMain;
const path = require('node:path')

const powerSaveBlocker = require('electron').powerSaveBlocker;
const id = powerSaveBlocker.start('prevent-app-suspension');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

require('electron-reload')(__dirname)

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const menu = Menu.buildFromTemplate([{
    label: 'Menu',
    submenu: [
      {label: 'Adjust notification value'},
      {
        label: 'CoinMarketCap', click() {
          shell.openExternal('http://coinmarketcap.com');
        }
      },
      {type: 'separator'},
      {
        label: 'Exit' , click() {
          app.quit();
        }
      }
    ]
  }])

  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
app.whenReady().then(() => {
  createWindow();
  ipc.handle('dialog', (event, method, params) => {       
    dialog[method](params);
  });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('update-notify-value', (event, arg) => {
  mainWindow.webContents.send('target-price-val', arg);
})


ipc.on('fetched-price', (event, arg) => {
// console.log('New price is ', arg);
});

// Create notify me when window from here cannot create in renderer
ipc.on('click-notify-me', (event, arg) => {
  console.log('hello')
  const modalPath = path.join('file://', __dirname, '/src/add.html')
  const addWindowOptions = {frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200};
  let win = new BrowserWindow(addWindowOptions);
  win.loadURL(modalPath);
  win.show();
  win.on('close', () => win = null)
})