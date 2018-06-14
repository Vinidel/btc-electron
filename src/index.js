const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;

const addWindowOptions = {frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200};
const notifyBtn = document.getElementById('notifyBtn');
const modalPath = path.join('file://', __dirname, 'add.html')

notifyBtn.addEventListener('click', (event) => {
  let win = new BrowserWindow(addWindowOptions);
  win.loadURL(modalPath);
  win.show();
  win.on('close', () => win = null)
})