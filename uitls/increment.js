const global = require('./global');
const downloadFile = require("./downloadFile");
const { app } = require("electron");
const path = require('path')
const fse = require('fs-extra')
const AdmZip = require('adm-zip')
const log = process.env.NODE_ENV === "development" ? console : require("electron-log");

module.exports = (data, destoryVideoProcess) => {
  const resourcesPath = process.resourcesPath;
  // const unpackedPath = path.join(resourcesPath, './app.asar.unpacked')
  const unpackedPath = resourcesPath
  const sendMessage = (status, result) => {
    global.sharedObject.win?.webContents.send('downloadMsg', {
      status,
      result
    });
  };
  if (data.serverUpdate) {
    destoryVideoProcess()
  }
  downloadFile({ url: data.upDateUrl + 'unpacked.zip', targetPath: resourcesPath }, sendMessage).then(async (filePath) => {
    log.info(filePath)
    // backups(unpackedPath)
    const zip = new AdmZip(filePath)
    zip.extractAllToAsync(unpackedPath, true, (err) => {
      if (err) {
        console.error(err)
        reLoad(true)
        // reduction(unpackedPath)
        return
      }
      // fse.removeSync(filePath)
      if (data.serverUpdate) {
        reLoad(true)
      } else {
        reLoad(false)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

function backups(targetPath) {
  if (fse.pathExistsSync(targetPath + '.back')) { // 删除旧备份
    fse.removeSync(targetPath + '.back')
  }
  if (fse.pathExistsSync(targetPath)) {
    fse.copySync(targetPath, targetPath + '.back') // 备份目录
  }
}

function reduction(targetPath) {
  if (fse.pathExistsSync(targetPath + '.back')) {
    fse.moveSync(targetPath + '.back', targetPath)
  }
  reLoad(false)
}

function reLoad(close) {
  if (close) {
    app.relaunch()
    app.exit(0)
  } else {
    global.sharedObject.win?.webContents.reloadIgnoringCache()
  }
}