import {exec} from 'child_process'

const dialog = require('electron').remote.dialog

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
export function getDirs (parent, hint = '', depth = 1) {
  console.log(depth)
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

export function openDir (path) {
  // 上边的方法太慢，会有一秒多的延迟
  // exec(`explorer.exe /select,"${path}"`)
  exec(`start "" "${path}"`)
}

export function selectDir () {
  return dialog.showOpenDialog({
    properties: ['openDirectory']
  })[0]
}
