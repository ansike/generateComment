/*
 @ Description: This is a discription
 @ Author: ansike@zuoyebang.com
 @ CreatedTime: Tue Feb 26 09:25:42 2019 +0800
 @ LastEditor: ansike@zuoyebang.com
 * @LastEditTime: 2019-04-01
*/
const glob = require('glob');
const fs = require('fs');
var gen = require('./gitgen');
var conf = require('./config');

/**
 * @Description: 计算模板内容
 * @param {gitInfo} 通过git中的日志信息计算出模板内容
 * @return: template（String） 
 */
function computedTemplate(gitInfo, conf) {
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

module.exports = (options) => {
  //获取所有的文件
  let matchPath = options.filePath + '/**/*.' + options.fileSuffix;
  var files = glob.sync(matchPath);
  console.log(`${matchPath}下共有${files.length}个${options.fileSuffix}文件需要处理`);

  // 匹配文件名
  const regVue = new RegExp("[a-zA-Z]*."+options.fileSuffix+"$");
console.log(regVue)
  files.map((file) => {
    // 获取git中的信息
    console.log('gen', file)
    gen.getChangeInfo(file, {
      config: conf
    }).then((gitInfo) => {
      // 获取要修改的文件 
      let willChangeFile = fs.readFileSync(file, 'utf-8');

      //如果有注释的话直接跳过
      if (willChangeFile.substring(0, 2) == '/*') {
        // console.log(file);
        return;
      }

      //设置文件名
      gitInfo.FileName = regVue.exec(file)[0];
      let template = computedTemplate(gitInfo, conf);

      //写文件
      fs.writeFileSync(file, template + willChangeFile, (err) => {
        console.log(err);
      })

    }).catch((res) => {
      console.log(res);
    })
  })
}