const fs = require("fs");
const path = require("path");
const youtubedl = require("youtube-dl-exec");
const { dialog, app } = require("electron");
const request = require("request");

let videoUrls = [];

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

// 获取视频地址
const download = async (event, args) => {
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
    playlistStart: args.startPlaylist,
    playlistEnd: args.endPlaylist,
  };
  if (configData.proxy) {
    config.proxy = `${configData.ip}:${configData.port}`;
  }
  try {
    output = await youtubedl(args.url, config);
    if (output._type && output._type === "playlist") {
      // 播放列表
      output.entries.forEach((video) => {
        const videoSource = video.formats.find(
          (item) =>
            item.format_note === args.formatNote &&
            item.ext === "mp4" &&
            (item.acodec || item.vcodec)
        );
        if (videoSource) {
          downloadVideo(
            videoSource.url,
            `${configData.downloadFolder}/${video.title}.mp4`,
            config.proxy
          );
        } else {
          // 没找到这个清晰度
        }
      });
    } else {
      // 单个视频
      const videoSource = output.formats.find(
        (item) =>
          item.format_note === args.formatNote &&
          item.ext === "mp4" &&
          (item.acodec || item.vcodec)
      );
      if (videoSource) {
        downloadVideo(
          videoSource.url,
          `${configData.downloadFolder}/${output.title}.mp4`,
          config.proxy
        );
      } else {
        // 没找到这个清晰度
      }
    }
  } catch (error) {
    output = error;
  }
  return output;
};

// 下载视频
// TODO: 还要下载音频文件并合并
const downloadVideo = (file_url, targetPath, proxy) => {
  console.log(file_url, targetPath, proxy);
  let received_bytes = 0;
  let total_bytes = 0;

  let requestConfig = {
    method: "GET",
    uri: file_url,
  };
  if (proxy) {
    requestConfig.proxy = `http://${proxy}`;
  }

  let req = request(requestConfig);
  let out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on("response", (data) => {
    total_bytes = parseInt(data.headers["content-length"]);
  });

  req.on("data", (chunk) => {
    received_bytes += chunk.length;
    showProgress(received_bytes, total_bytes);
  });

  req.on("complete", () => {
    console.log("File successfully downloaded");
  });
};

const showProgress = (received, total) => {
  let percentage = (received * 100) / total;
  console.log(
    percentage + "% | " + received + " bytes out of " + total + " bytes."
  );
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

module.exports = { download, writeFile, readFile, showOpenDialog };
