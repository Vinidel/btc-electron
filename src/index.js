const electron = require('electron');
const path = require('path');
const axios = require('axios');
const BrowserWindow = electron.remote.BrowserWindow;
const {ipcRenderer} = electron;

const addWindowOptions = {frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200};
const notifyBtn = document.getElementById('notifyBtn');
const modalPath = path.join('file://', __dirname, 'add.html')

const price = document.querySelector('h1');
const targetPrice = document.getElementById('targetPrice');


const getBtc = () => {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
      const cryptos = res.data.BTC.USD;
      price.innerHTML = `$${cryptos.toLocaleString('en')}`
    })
}

setInterval(getBtc(), 3000);

notifyBtn.addEventListener('click', (event) => {
  let win = new BrowserWindow(addWindowOptions);
  win.loadURL(modalPath);
  win.show();
  win.on('close', () => win = null)
})

ipcRenderer.on('target-price-val', (event, arg) => {
  targetPrice.innerHTML = `$${Number(arg).toLocaleString('en')}`;
})

ipcRenderer.on('price-fetched', (event, arg) => {
  price.innerHTML = `$${arg.toLocaleString('en')}`;
})