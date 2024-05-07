const { contextBridge, ipcRenderer  } = require('electron')
const path = require('node:path');
const axios = require('axios');

contextBridge.exposeInMainWorld('electron', {
    openDialog: (method, config) => ipcRenderer.invoke('dialog', method, config),
    // ipcSend: (method, config) => ipcRenderer.invoke('send', method, config),
    ipcSend: (method, config) => ipcRenderer.send(method, config),
    pathJoin: path.join,
    ipcOn: ipcRenderer.on,
    getBtc: (url) => axios.get(url),
    __dirname: __dirname
  });