/*
 @ Description: This is a discription
 @ Author: 
 @ CreatedTime: 
 @ LastEditor: 
 @ LastEditTime: 
*/
const path = require('path');
const comment = require("../lib/comment");

comment({
  filePath: path.resolve(__dirname, "../test/"),
  fileSuffix: "js"
})