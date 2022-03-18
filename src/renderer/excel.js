const XLSX = require('xlsx')
const dialog = require('electron').remote.dialog
// var data = [
//   {'姓名': '张三', '城市': 'Seattle', 'age': '12'},
//   {'姓名': 'Mike', '城市': 'Los Angeles', 'age': '22'},
//   {'姓名': 'Zach', '城市': 'New York', 'age': '33'}
// ]
export function buildCell (text, path) {
  let cell = {v: text, t: 's'}
  if (path) {
    cell.l = {
      Target: `file:///${path}`
    }
  }
  return cell
}

export function saveExcel (aoa) {
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  console.log(ws)
  XLSX.utils.book_append_sheet(wb, ws, '文件夹')/* 生成xlsx文件(book,sheet数据,sheet命名) */
  // XLSX.writeFile(wb, 'sheetjs.xlsx')/* 写文件(book,xlsx文件名称) */
  const o = dialog.showSaveDialog({
    title: 'Save file as',
    filters: [{
      name: 'Excel',
      extensions: ['xlsx']
    }]
  })
  XLSX.writeFile(wb, o)
}

export function nodeToRow (node) {
  let arr = []
  // n级目录空出前边
  for (let i = 0; i < node.depth - 1; i++) {
    arr.push([])
  }
  arr.push(buildCell(node.label, node.path))
  if (node.comment) {
    arr.push(node.comment)
  }
  return arr
}

export function convert (data) {
  let array = []
  return array
}
