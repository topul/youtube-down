const { ipcMain, app } = require("electron");
const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");

function mainProcess() {
  ipcMain.handle("download", async (event, args) => {
    let output = "";
    try {
      output = await youtubedl(args.url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: "https://www.youtube.com",
        playlistStart: args.startPlaylist,
        playlistEnd: args.endPlaylist,
        proxy: args.proxy,
      });
    } catch (error) {
      output = error;
    }
    return output;
  });

  ipcMain.handle("writeFile", (event, args) => {
    console.log(args);
    fs.writeFile(
      path.join(app.getAppPath(), args.fileName),
      args.fileContent,
      (err) => {
        if (err) throw err;
        console.log("文件保存成功");
      }
    );
  });

  ipcMain.handle("readFile", (event, args) => {
    console.log(args);
    try {
      return fs.readFileSync(path.join(app.getAppPath(), args), {
        encoding: "utf-8",
      });
    } catch (error) {
      return error;
    }
  });
}

module.exports = mainProcess;
