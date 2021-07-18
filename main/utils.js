const fs = require("fs");
const path = require("path");
const youtubedl = require("youtube-dl-exec");
const { dialog, app } = require("electron");

const getConfig = () => {
  let configData = {};
  try {
    const configDataStr = fs.readFileSync(
      path.join(app.getAppPath(), "config.json"),
      {
        encoding: "utf-8",
      }
    );
    if (configDataStr) {
      configData = JSON.parse(configDataStr);
    }
  } catch (error) {
    console.log(error);
  }
  return configData;
};

// 获取视频信息
const getVideoInfo = async (event, args) => {
  const configData = getConfig();
  console.log(configData);
  let output = "";
  let config = {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    referer: "https://www.youtube.com",
  };
  if (configData.proxy) {
    config.proxy = `${configData.ip}:${configData.port}`;
  }
  try {
    output = await youtubedl(args.url, config);
    console.log(output);
  } catch (error) {
    output = error;
  }
  return output;
};

// 下载视频
const download = async (event, args) => {
  const configData = getConfig();
  console.log(configData);
  let output = "";
  let config = {
    format: `${args.formatNote}+bestaudio[ext=m4a]/best[ext=${args.ext}]/best`,
    output: `${configData.downloadFolder}/%(title)s.%(ext)s`,
  };
  if (configData.proxy) {
    config.proxy = `${configData.ip}:${configData.port}`;
  }
  try {
    output = await youtubedl(args.url, config);
    console.log(output);
  } catch (error) {
    output = error;
  }
  return output;
};

/**
 * 保存文件
 * @param {string} args { fileName, fileContent }
 */
const writeFile = (event, args) => {
  console.log(args);
  fs.writeFile(
    path.join(app.getAppPath(), args.fileName),
    args.fileContent,
    (err) => {
      if (err) throw err;
      console.log("文件保存成功");
    }
  );
};

/**
 * 读取文件
 * @param {string} args 文件路径
 * @returns 文件内容或错误信息
 */
const readFile = (event, args) => {
  console.log(args);
  try {
    return fs.readFileSync(path.join(app.getAppPath(), args), {
      encoding: "utf-8",
    });
  } catch (error) {
    return error;
  }
};

// 打开文件对话框
const showOpenDialog = (event, args) => {
  console.log(args);
  try {
    const result = dialog.showOpenDialogSync(args);
    console.log(result.canceled);
    console.log(result.filePaths);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  download,
  writeFile,
  readFile,
  showOpenDialog,
  getVideoInfo,
};
