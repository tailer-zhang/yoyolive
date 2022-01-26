const increment = require('./uitls/increment');
const checkUpdate = require('./uitls/checkUpdate');
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn, exec } = require("child_process");
const global = require('./uitls/global');
const path = require("path");
const log =
  process.env.NODE_ENV === "development" ? console : require("electron-log");
const START_VIDEO_PROCESS = "START_VIDEO_PROCESS";
const SHUTDOWN_VIDEO_PROCESS = "SHUTDOWN_VIDEO_PROCESS";
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

let workerProcess = null;
let autoLiveFlag = false;
let cwd = path.join(__dirname, "server");
if (process.env.NODE_ENV !== "development") {
  cwd = path.join(__dirname, "..", "server");
}

log.warn("server cwd:", cwd);

app.on("ready", onReady);
app.on("window-all-closed", onWindowAllClosed);
app.on("quit", destoryVideoProcess)

ipcMain.on(START_VIDEO_PROCESS, (event, status) => {
  if(!autoLiveFlag) {
    launchVideoProcess(status);
    autoLiveFlag = true; 
  }

});

ipcMain.on(SHUTDOWN_VIDEO_PROCESS, (event, status) => {
  destoryVideoProcess();
});

ipcMain.handle("openvedio", () => {
  console.log(" workerProcess.connected",  workerProcess.connected)
  return workerProcess.connected;
})

// 热更新 增量更新
ipcMain.handle('win-increment', (_, data) => {
  increment(data, destoryVideoProcess);
});
// 全量更新
ipcMain.handle('win-update', (_, data) => {
  checkUpdate(data)
})

function onReady() {
  launchVideoProcess();
  createWindow();
}

function onCloseWindow() {
  mainWindow = null;
  destoryVideoProcess();
}

function onWindowAllClosed() {
  mainWindow = null;
  if (process.platform !== "darwin") {
    app.quit();
  }
}

function createWindow() {
  let options = {
    frame: false,
    titleBarStyle: "hidden",
    resizable: false,
    width: 1080,
    height: 720,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true, // 允許在 Render Process 使用 Remote Module
      contextIsolation: false, // 讓在 preload.js 的定義可以傳遞到 Render Process (React)
      webSecurity: false,
    },
  };

  mainWindow = new BrowserWindow(options);
  
  if (process.env.NODE_ENV === "development") {
    mainWindow.openDevTools();
    mainWindow.loadURL(`http://localhost:3000`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/../app.asar.unpacked/index.html`);
  }

  mainWindow.on("close", onCloseWindow);

  global.sharedObject.win = mainWindow;
  return mainWindow;
}

function destoryVideoProcess() {
  const endBatPath = "end.bat";
  let shutdownBat = exec(endBatPath, { cwd: cwd });
  if (typeof workerProcess !== "undefined") {
    workerProcess = null;
  }
}

function launchVideoProcess(flag) {
  console.log("workerProcess", workerProcess);
  if (!workerProcess || flag) {
    
    const childProcessCallback = (err, stdout, stderr) => {
      autoLiveFlag = false;
      if (err) {
        log.error("error:", err);
      }
      log.warn("stdout:", stdout);
      log.error("stderr:", stderr);
    };
    
    log.info(process.env.ENABLE_SERVER_CONSOLE);
    
    const cmdStr = "server.exe"; // 本地需要启动的后台服务可执行文件的路径
    if (!!process.env.ENABLE_SERVER_CONSOLE) {
      log.info('spawn');
      autoLiveFlag = false;
      workerProcess = spawn(cmdStr, [] , { cwd: cwd, detached: true });
    } else {
      log.info('exec');
      autoLiveFlag = false;
      workerProcess = exec(cmdStr, { cwd: cwd }, childProcessCallback);
    }
    workerProcess.on("close", () => {
      console.log("close!!!!");
      workerProcess = null;
      autoLiveFlag = false;
    })
    workerProcess.on("exit", () => {
      console.log("exit!!!!");
      workerProcess = null;
      autoLiveFlag = false;
    })
    workerProcess.stdout.on("data", (data) => {
      log.info(`workerProcess.stdout:${data}`);
    });

    workerProcess.stderr.on("data", (error) => {
      log.error(`workerProcess.stderr:${error}`);
    });
   
  }
}
