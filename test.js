const fs = require('fs')
const path = require('path')

function getIntFromFilename (s) {
  let regExpExecArray = /^\d+?/.exec(s)
  if (regExpExecArray) {
    return parseInt(regExpExecArray[0])
  }
  return 0
}

// 获取目录下所有子目录以及文件
function getDirs (parent, hint = '', depth = 1) {
  let files = fs.readdirSync(parent)
  files = files.sort().sort((a, b) => {
    return getIntFromFilename(a) - getIntFromFilename(b)
  }).map((file) => {
    return path.join(parent, file)
  }).map(file => {
    let basename = path.basename(file)
    let obj = {
      label: basename,
      path: file,
      hint: path.join(hint, basename),
      depth,
      type: fs.statSync(file).isDirectory() ? 'dir' : 'file'
    }
    if (obj.type === 'dir') {
      let children = getDirs(file, obj.hint, depth + 1)
      if (children.length > 0) {
        obj.children = children
      }
    }
    return obj
  })
  return files
}

console.log(getDirs('E:\\Game'))
