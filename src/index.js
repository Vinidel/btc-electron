// const {BrowserWindow, ipcRenderer } = require('electron');
// const path = require('path:node');
// const axios = require('axios');

const addWindowOptions = {frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200};
const notifyBtn = document.getElementById('notifyBtn');
const modalPath = electron.pathJoin('file://', electron.__dirname, 'add.html')

let targetPrice = 0;

const notifyIfGreater = (btcValue, targetPrice) => {
  const notification = {
    title: 'BTC Alert',
    body: `BTC just beat target price ${btcValue}`,
    icon: electron.pathJoin(electron.__dirname, '../assets/images/btc.png')
  }

  if(targetPrice && btcValue > targetPrice) {
    new window.Notification(notification.title, notification);
  }
}

const getBtc = () => {
  electron.getBtc('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=AUD')
    .then(res => {
      // const cryptos = res.data.BTC.AUD;
      // document.querySelector('h1').innerHTML = `$${cryptos.toLocaleString('en')}`
      const {BTC, ETH} = res.data;
      document.getElementById('btc-value').innerHTML = `$${BTC.AUD.toLocaleString('en')}`
      document.getElementById('eth-value').innerHTML = `$${ETH.AUD.toLocaleString('en')}`
      return res;
    })
    .then((res) => {
      electron.ipcSend('fetched-price', res.data);
      return res;
    })
    .then((res) => notifyIfGreater(res.data.BTC.USD, targetPrice))
}

setInterval(getBtc, 3000);

// Click on Notify me when
notifyBtn.addEventListener('click', (event) => {
  console.log('Sending event', event)
  electron.ipcSend('click-notify-me')
})

electron.ipcOn('target-price-val', (event, arg) => {
  targetPrice = Number(arg);
  document.getElementById('targetPrice').innerHTML = `$${targetPrice.toLocaleString('en')}`;
})