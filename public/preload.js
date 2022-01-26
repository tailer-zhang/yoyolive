global.electron = require('electron');
window.isElectron = true;
window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;