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

let count = 0
let valid = 0

function showNode (data) {
  for (let i = 0; i < data.length; i++) {
    count++;
    /^\d+?/.exec(data[i].hint.toLowerCase())
    if (filterNode('exe', data[i])) {
      valid++
    }
    if (data[i].type === 'dir' && data[i].children) {
      showNode(data[i].children)
    }
  }
}
let that = {type: 'all'}
function filterNode (value, data) {
  if (data.depth > 9999) return false

  // 类型
  if (that.type !== 'all') {
    if (that.type !== data.type) {
      return false
    }
  }
  return (data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
    (data.comment && data.comment.toLowerCase().indexOf(value.toLowerCase()) !== -1)
}

let dirs = getDirs('E:\\Games')
showNode(dirs)
console.log(count)
console.log(valid)
