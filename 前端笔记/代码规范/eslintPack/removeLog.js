const fs = require('fs')
const path = require('path')

// 删除文件夹里的所有文件
function deleteFilesInDir(url) {
  console.log('=======================重置日志:开始===========================')
  let files = []

  if (fs.existsSync(url)) {
    //判断给定的路径是否存在
    files = fs.readdirSync(url) //返回文件和子目录的数组
    files.forEach(function (file) {
      const ext = path.extname(file)
      console.log(file)
      if (ext === '.log') {
        const curPath = path.join(url, file)
        if (fs.statSync(curPath).isDirectory()) {
          //同步读取文件夹文件，如果是文件夹，则递归调用
          deleteFilesInDir(curPath)
        } else {
          fs.unlinkSync(curPath) //是指定文件，则删除
        }
      }
    })
    console.log('=======================重置日志:完成===========================')
  } else {
    console.log('文件夹不存在')
  }
}

// deleteFilesInDir('./logs')
module.exports = deleteFilesInDir