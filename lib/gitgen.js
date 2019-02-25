const exec = require('child_process').exec
const fs = require('fs');

// git log --pretty=format:'%cd' --date=format:'%Y-%m-%d %H:%M:%S' index.html
var command = "git log --pretty=format:'%cd#%ce#H' tempFile";
// 获取git改动清单

/**
 * @description 执行git命令，返回，修改人，时间
 * @param {*} file  传入文件及路径
 * @returns promise
 */
exports.getChangeInfo = function (file, options) {
  let tempCommand = command.replace('tempFile', file);
  // console.log('tempCommand',tempCommand)
  return new Promise((resolve, reject) => {
    exec(tempCommand, 'utf8', (err, stdout, stderr) => {
      if (err) {
        reject(err);
        console.log('err:', err)
        console.log('stderr:', stderr)
      } else {
        let times = stdout.split('\n');
        let start = times[times.length - 1].split('#');
        let end = times[0].split('#');
        let res = {
          Author: start[1],
          CreatedTime: start[0],
          LastEditor: end[1],
          LastEditTime: end[0]
        }
        console.log(tempCommand, res);
        resolve(res);
      }
    })
  })
}
