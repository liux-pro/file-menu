import {exec} from 'child_process'

const fs = require('fs')
const path = require('path')

// 获取目录下所有子目录，不含文件
export function getDirs (parent, hint = '', depth = 1) {
  let files = fs.readdirSync(parent)
  files = files.map((file) => {
    return path.join(parent, file)
  }).map(file => {
    let basename = path.basename(file)
    let obj = {
      label: basename,
      path: file,
      hint: path.join(hint, basename),
      depth,
      type: fs.statSync(file).isDirectory() ? 'dir' : 'other'
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
