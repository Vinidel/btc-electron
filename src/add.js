const {remote, ipcRenderer} = require('electron');

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', (e) => {
  remote
    .getCurrentWindow()
    .close();
})


const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click', (e) => {
  ipcRenderer.send('update-notify-value', document.getElementById('notifyVal').value)
  remote
    .getCurrentWindow()
    .close();
})
