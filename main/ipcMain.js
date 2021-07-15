const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const {
  download,
  writeFile,
  readFile,
  showOpenDialog,
  getVideoInfo,
} = require("./utils");

function mainProcess() {
  ipcMain.handle("getVideoInfo", getVideoInfo);

  ipcMain.handle("download", download);

  ipcMain.handle("writeFile", writeFile);

  ipcMain.handle("readFile", readFile);

  ipcMain.handle("showOpenDialog", showOpenDialog);
}

module.exports = mainProcess;
