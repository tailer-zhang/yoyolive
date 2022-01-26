const { autoUpdater } = require("electron-updater");
const global = require('./global');
const { log } = process.env.NODE_ENV === "development" ? console : require("electron-log");

function Message(type, data) {
  const sendData = {
    type,
    data
  }
  global.sharedObject.win.webContents.send('renderer-updateMsg', sendData)
}

// 当更新发生错误的时候触发。
autoUpdater.on('error', (err) => {
  log('更新出现错误')
  log(err.message)
  if (err.message.includes('sha512 checksum mismatch')) {
    Message(-1, 'sha512校验失败')
  }
})

// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
  log('开始检查更新')
  Message(0)
})

// 发现可更新数据时
autoUpdater.on('update-available', () => {
  log('有更新')
  Message(1)
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  log('没有更新')
  Message(2)
})

// 下载监听
autoUpdater.on('download-progress', (progressObj) => {
  console.log(progressObj);
  Message(3, progressObj)
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  log('下载完成')
  Message(4)
  setTimeout(() => { // 重启更新提示1秒后在进行重启安装
    global.willQuitApp = true
    autoUpdater.quitAndInstall()
  }, 1000)
})

module.exports = (data) => {
  log('Update', data)
  autoUpdater.setFeedURL(data.upDateUrl);
  autoUpdater.checkForUpdates().catch(err => {
    log('网络连接问题', err)
    Message(5, err.code)
  })
}