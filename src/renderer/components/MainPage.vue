<template>
  <div>
    <div style="display: flex;justify-content: space-around">
      <div id="search">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="input-with-select">
          <el-select v-model="type" slot="prepend" placeholder="请选择" @change="filterChange">
            <el-option label="仅限文件夹" value="dir"></el-option>
            <el-option label="仅限文件" value="file"></el-option>
            <el-option label="搜索所有" value="all"></el-option>
          </el-select>
          <el-input-number @change="filterChange" slot="append" v-model="maxDepth" controls-position="right" :min="1"
                           :max="20"></el-input-number>
        </el-input>
      </div>
      <el-button @click="exportExcel" slot="append">导出</el-button>
    </div>
    <el-virtual-tree
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :render-content="renderContent"
        height="calc(100vh  - 40px)"
        ref="tree">
    </el-virtual-tree>
    <el-dialog
        :visible.sync="centerDialogVisible"
        width="60%"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <el-input autofocus type="textarea"
                autosize
                v-model="currentComment"
                :autosize="{ minRows: 4}"
                placeholder="请输入备注"
                ref="input"
      ></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveComment">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {getDirs, openDir, selectDir} from '../files'
import ElVirtualTree from '/src/components/el-virtual-tree'

export default {
  name: 'MainPage',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  components: {ElVirtualTree},
  methods: {
    filterNode (value, data) {
      if (data.depth > this.maxDepth) return false

      // 类型
      if (this.type !== 'all') {
        if (this.type !== data.type) {
          return false
        }
      }
      const show = (data.hint.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
          (data.comment && data.comment.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      const label = data.label
      data.label = ''
      data.label = label
      return show
    },
    exportExcel () {
      const e = require('../excel')
      let array = []
      const showNode = (data) => {
        for (let i = 0; i < data.length; i++) {
          if (this.filterNode(this.filterText, data[i])) {
            array.push(e.nodeToRow(data[i]))
          }
          if (data[i].type === 'dir' && data[i].children) {
            showNode(data[i].children)
          }
        }
      }

      showNode(this.data)
      e.saveExcel(array)
    },
    handleNodeClick (data, node, element) {
      console.log(data)
      openDir(data.path)
    },
    highlight (label, key) {
      if (label.toLowerCase().indexOf(key.toLowerCase()) === -1) {
        return `${label}`
      } else {
        return label.replace(new RegExp(`(${key})`, 'ig'), (word) => {
          return `<span>${word}</span>`
        })
      }
    },
    showInput (node) {
      this.temp = node
      this.centerDialogVisible = true
      this.currentComment = this.temp.data.comment
      // 即使设置了autofocus，弹窗第二次出来之后，不会自动聚焦
      setTimeout(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      }, 300) /* 没显示出来就聚焦没用，所以延迟聚焦，出来之后再调用 */
    },
    filterChange () {
      this.$refs.tree.filter(this.filterText)
    },
    saveComment () {
      if (!this.currentComment) {
        this.$message.error('不能为空')
        return
      }
      let label = this.temp.data.label
      this.temp.data.comment = this.currentComment
      this.currentComment = ''
      this.temp.data.label = ''
      this.temp.data.label = label
      this.temp = null
      this.centerDialogVisible = false
    },
    renderContent (h, {node, data, store}) {
      const highlightLabel = this.highlight(data.label, this.filterText)
      const highlightComment = data.comment ? this.highlight(data.comment, this.filterText) : '<i class=\'el-icon-s-comment\' style=\'opacity: 0.4\'></i>'
      const showInput = () => {
        event.stopPropagation()
        this.showInput(node)
      }
      const handleNodeClick = () => {
        event.stopPropagation()
        this.handleNodeClick(data)
      }
      return (
        <span class="tree" onClick={handleNodeClick}>
          <span class="red" domPropsInnerHTML={highlightLabel}/>
          <button class="el-button el-button--default" onClick={showInput}>
            <span class="red" domPropsInnerHTML={highlightComment}/>
          </button>
        </span>)
    }
  },

  data () {
    return {
      path: '',
      temp: null,
      type: 'all',
      maxDepth: 20,
      centerDialogVisible: false,
      currentComment: '',
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.path = selectDir()
    console.log(this.path)
    this.data = getDirs(this.path)
    window.data = this.data
    document.querySelector('#loading').remove()
  }
}
</script>

<style>
.tree {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree .red * {
  color: red;
}

.el-tree .el-button {
  padding: 0;
  color: black;
}

.tree span {
  font-size: 30px;
  font-family: Consolas, serif;
}

.el-tree .el-button span {
  font-size: 27px;
}

.el-tree .el-button--success.is-plain {
  color: black;
}

.el-tree .el-tree-node__content {
  height: 33px;
}

/*.tree button {*/
/*  opacity: 0.4;*/
/*}*/

.tree i:hover {
  opacity: 1 !important;
}

.el-tree-node__content:hover {
  background-color: #c3d9ff;
}

/*隐藏默认小箭头*/
.el-tree-node__expand-icon {
  color: dodgerblue;
}

.el-input-group__prepend {
  width: 80px;
  background-color: white;

}

.el-input-group__append {
  padding: 0;
  background-color: white;
}

.el-input-group__append div.el-input {
  line-height: 0;
  font-size: 30px;
}

.el-input-number .el-input input.el-input__inner {
  height: 36px;
  border-style: none;
}
#search {
  width: 90%;
}
</style>
