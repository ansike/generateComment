# generateComment
根据git记录生成文件的头部信息（前提是该项目有git仓库）

``` javascript
/*
 @ Description: This is a discription
 @ Author: xxx@xxxx.com
 @ CreatedTime: 2018-03-07 15:43:56
 @ LastEditor: yyy@yyyy.com
 @ LastEditTime: 2019-01-10 11:37:17
*/
```
### 第一步 安装依赖
``` javascript
npm i generatecomment
```
### 第二步 创建脚本文件
在项目根目录下创建comment.js文件，复制以下内容到文件中
``` javascript
const path = require('path');
const comment = require("../lib/comment");
comment({
  filePath: path.resolve(__dirname, "../test/"),
  fileSuffix: "js"
})
```
### 第三步 运行脚本文件
``` javascript
node comment.js
```

