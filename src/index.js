const electron = require('electron');
const path = require('path');
const axios = require('axios');
const BrowserWindow = electron.remote.BrowserWindow;
const {ipcRenderer} = electron;

const addWindowOptions = {frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200};
const notifyBtn = document.getElementById('notifyBtn');
const modalPath = path.join('file://', __dirname, 'add.html')

let targetPrice = 0;

const notifyIfGreater = (btcValue, targetPrice) => {
  const notification = {
    title: 'BTC Alert',
    body: `BTC just beat target price ${btcValue}`,
    icon: path.join(__dirname, '../assets/images/btc.png')
  }

  if(targetPrice && btcValue > targetPrice) {
    new window.Notification(notification.title, notification);
  }
}

const getBtc = () => {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=AUD')
    .then(res => {
      // const cryptos = res.data.BTC.AUD;
      // document.querySelector('h1').innerHTML = `$${cryptos.toLocaleString('en')}`
      const {BTC, ETH} = res.data;
      document.getElementById('btc-value').innerHTML = `$${BTC.AUD.toLocaleString('en')}`
      document.getElementById('eth-value').innerHTML = `$${ETH.AUD.toLocaleString('en')}`
      return res;
    })
    .then((res) => {
      ipcRenderer.send('fetched-price', res.data);
      return res;
    })
    .then((res) => notifyIfGreater(res.data.BTC.USD, targetPrice))
}

setInterval(getBtc, 3000);

notifyBtn.addEventListener('click', (event) => {
  let win = new BrowserWindow(addWindowOptions);
  win.loadURL(modalPath);
  win.show();
  win.on('close', () => win = null)
})

ipcRenderer.on('target-price-val', (event, arg) => {
  targetPrice = Number(arg);
  document.getElementById('targetPrice').innerHTML = `$${targetPrice.toLocaleString('en')}`;
})