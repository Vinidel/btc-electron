const {remote} = require('electron');

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', (e) => {
  remote
    .getCurrentWindow()
    .close();
})