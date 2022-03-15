const XLSX = require('xlsx')
var data = [
  {'姓名': '张三', '城市': 'Seattle', 'age': '12'},
  {'姓名': 'Mike', '城市': 'Los Angeles', 'age': '22'},
  {'姓名': 'Zach', '城市': 'New York', 'age': '33'}
]/* 如果没有导入xlsx组件则导入 */

var ws = XLSX.utils.json_to_sheet(data)/* 新建空workbook，然后加入worksheet */
var wb = XLSX.utils.book_new()/* 新建book */
ws['A1'].l = {Target: 'file:///D:/kotlin-executable-jar/build/'} /* Link to /SheetJS/t.xlsx */
console.log(ws)
XLSX.utils.book_append_sheet(wb, ws, 'People')/* 生成xlsx文件(book,sheet数据,sheet命名) */
XLSX.writeFile(wb, 'sheetjs.xlsx')/* 写文件(book,xlsx文件名称) */
