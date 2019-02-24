const glob = require('glob');
const path = require('path');
const fs = require('fs');
var gen = require('./gitgen');
var conf = require('./config');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * @Description: 计算模板内容
 * @param {gitInfo} 通过git中的日志信息计算出模板内容
 * @return: template（String） 
 */
function computedTenplate(gitInfo, conf) {
  //模板
  let template = '/*\n';
  conf.map((cur) => {
    if (cur.isShow) {
      template += ` @ ${cur.name}: ${cur.needComputed ? (gitInfo[cur.name] || cur.default) : cur.default}\n`;
    }
  })
  template += '*/\n';

  return template;
}

module.exports = () => {
  new Promise((resolve, reject) => {
    rl.question('请输入需要处理的绝对路径和文件类型（’#‘分割如：/Users/ansike/Documents/desktc#vue）？\n', (ipt) => {
      //对答案进行处理
      let ipts = ipt.split('#');
      if (ipts.length !== 2) {
        console.error('请检查输入的格式');
        process.exit(0);
      }
      let filePath = ipts[0];
      let fileSuffix = ipts[1];
      console.log(`您输入的路径为：${filePath}`);
      console.log(!fs.statSync(filePath))
      if (!fs.statSync(filePath)) {
        console.log(`请检查该路径`);
        reject('路径不存在');
      } else {
        resolve({
          filePath: filePath,
          fileSuffix: fileSuffix
        });
      }
      rl.close();
      // process.exit(0);
    });
  }).then((options) => {
    //获取所有的文件
    let matchPath = options.filePath + '/**/*.' + options.fileSuffix;
    var files = glob.sync(matchPath);
    console.log(`${matchPath}下共有${files.length}个${options.fileSuffix}文件需要处理`);

    // 匹配文件名
    const regVue = /[a-zA-Z]*.vue$/;

    files.map((file) => {
      // 获取git中的信息
      gen.getChangeInfo(file, {
        config: conf
      }).then((gitInfo) => {
        // 获取要修改的文件
        let willChangeFile = fs.readFileSync(file, 'utf-8');

        //如果有注释的话直接跳过
        if (willChangeFile.substring(0, 2) == '/*') {
          console.log(file);
          return;
        }

        //设置文件名
        gitInfo.FileName = regVue.exec(file)[0];
        let template = computedTenplate(gitInfo, conf);

        //写文件
        fs.writeFileSync(file, template + willChangeFile, (err) => {
          console.log(err);
        })

      }).catch((res) => {
        console.log(res);
      })
    })
  }).catch((res) => {
    console.log('reject' + res);
  })
}
