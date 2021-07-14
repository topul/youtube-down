const { app, BrowserWindow } = require("electron");
const {
  default: installExtension,
  VUEJS_DEVTOOLS,
} = require("electron-devtools-installer");
const path = require("path");
const mainProcess = require("./ipcMain");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(app.getAppPath(), "main/preload.js"),
    },
  });

  win.loadURL("http://localhost:3000/");
}

app.whenReady().then(() => {
  const vue_devtools_beta = {
    id: "ljjemllljcmogpfapbkkighbhhppjdbg",
    electron: ">=1.2.1",
  };
  installExtension(vue_devtools_beta, {
    loadExtensionOptions: { allowFileAccess: true },
  })
    .then((name) => console.log(`Added Extension: ${name}`))
    .then(() => createWindow())
    .then((err) => console.log("An error occurred: ", err));

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

mainProcess();
