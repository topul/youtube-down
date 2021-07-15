const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");
const { download, writeFile, readFile, showOpenDialog } = require("./utils");

function mainProcess() {
  ipcMain.handle("download", download);

  ipcMain.handle("writeFile", writeFile);

  ipcMain.handle("readFile", readFile);

  ipcMain.handle("showOpenDialog", showOpenDialog);
}

module.exports = mainProcess;
