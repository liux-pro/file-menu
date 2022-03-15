<template>
  <div>
    <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
    </el-input>
    <el-button @click="exportExcel">11111111</el-button>
    <el-tree
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        ref="tree">
      <span class="tree" slot-scope="{ node, data }">
        <span class="red" v-html="highlight(node.label,filterText)"></span>
        <el-button type="success" plain size="large" @click.stop="showInput">
            添加备注
        </el-button>
      </span>
    </el-tree>
    <el-dialog
        :visible.sync="centerDialogVisible"
        width="60%"
        center>
      <el-input autofocus type="textarea"
                autosize
                v-model="currentComment"
                :autosize="{ minRows: 4}"
                placeholder="请输入备注"
                ref="input"
      ></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {getDirs, openDir} from '../files'

export default {
  name: 'MainPage',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      if (data.depth > this.maxDepth) return false
      return data.hint.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    exportExcel () {
      console.log(this.data)
    },
    handleNodeClick (data, node, element) {
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
    showInput () {
      this.centerDialogVisible = true
      // 即使设置了autofocus，弹窗第二次出来之后，不会自动聚焦
      setTimeout(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      }, 300) /* 没显示出来就聚焦没用，所以延迟聚焦，出来之后再调用 */
    }
  },

  data () {
    return {
      maxDepth: 9999,
      centerDialogVisible: false,
      currentComment: '',
      filterText: '',
      data: getDirs('D:\\VC6 链接器\\VC6linker'),
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
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

.el-icon-caret-right {
  color: gray !important;
}

</style>
