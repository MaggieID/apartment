<template>
  <div style="display: inline-block;">
    <el-popover v-model="visible" width="200" trigger="manual">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button plain size="mini" style="float: right; padding: 3px 6px;" @click="handleCheckedCitiesChange([])">重置</el-button>
      <div style="margin: 15px 0;" />
      <div style=" height: 200px;">
        <el-scrollbar style="height:100%">
          <el-checkbox-group v-model="checkedOptions" @change="handleCheckedCitiesChange">
            <div v-for="item in columnSelections" :key="item.ColumnName">
              <el-checkbox class="block" :label="item.ColumnName">{{ item.ColumnCnName }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div style=" padding-top: 10px; text-align: center;">
        <el-button size="mini" round @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" round @click="saveAppColumns">确定</el-button>
      </div>
      <el-button slot="reference" style="margin-left: 10px;padding: 8px 0;" type="text" @click="visible = true;sort = false"><i :class="leftIcon" /> {{ title }} <i :class="rightIcon" /></el-button>
    </el-popover>
    <el-popover v-if="showSort" v-model="sort" width="200" trigger="manual">
      <div style="height: 200px;">
        <el-scrollbar style="height:100%">
          <draggable v-model="showList" draggable=".item">
            <div v-for="item in showList" :key="item.ColumnName" class="item">
              {{ item.ColumnCnName }}
            </div>
          </draggable>
        </el-scrollbar>
      </div>
      <div style="padding-top: 10px; text-align: center;">
        <el-button size="mini" round @click="sort = false">取消</el-button>
        <el-button type="primary" size="mini" round @click="saveSort">确定</el-button>
      </div>
      <el-button slot="reference" style="margin-left: 10px;padding: 8px 0;" type="text" @click="sort = true;visible=false"><i class="el-icon-sort" /> 排序</el-button>
    </el-popover>
  </div>
</template>
<script>
import {
  SaveAppColumns,
  GetUserAppColumns,
  GetAppColumns
} from '@/api/UserColumnConfig'
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  props: {
    apiName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '更多筛选条件'
    },
    rightIcon: {
      type: String,
      default: ''
    },
    leftIcon: {
      type: String,
      default: ''
    },
    showSort: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkAll: false,
      visible: false,
      sort: false,
      checkedOptions: [],
      isIndeterminate: true,
      columnSelections: [],
      pickOptions: [],
      showList: []
    }
  },
  computed: {
    // 拖拽表单1
    dragOptions1() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        group: {
          put: ['shared']
        }
      }
    }
  },
  watch: {
    apiName() {
      this.GetAppColumns()
    }
  },
  mounted() {
    this.GetAppColumns()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedOptions = val
        ? this.pickOptions.map(item => {
            return item.ColumnName
          })
        : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      this.checkedOptions = value
      const checkedCount = value.length
      this.checkAll = checkedCount === this.columnSelections.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.columnSelections.length
    },
    GetAppColumns() {
      var that = this
      if (this.apiName == '') return
      GetAppColumns({
        getColumnType: this.apiName
      }).then(res => {
        that.columnSelections = res.Data
        that.pickOptions = res.Data
        that.GetUserAppColumns()
      })
    },
    GetUserAppColumns() {
      var that = this
      if (this.apiName == '') return
      GetUserAppColumns({
        getColumnType: this.apiName
      }).then(res => {
        that.checkedOptions = []
        var result = res.Data ? res.Data : []
        var showList = []
        if (result.length === 0) {
          var arr = []
          showList = this.pickOptions
          this.pickOptions.forEach(element => {
            arr.push(element.ColumnName)
          })
          this.checkedOptions = arr
          this.isIndeterminate = false
        } else {
          for (let i = 0; i < result.length; i++) {
            that.checkedOptions.push(result[i].ColumnName)
            for (let j = 0; j < this.pickOptions.length; j++) {
              if (result[i].ColumnName == this.pickOptions[j].ColumnName) {
                showList.push(this.pickOptions[j])
              }
            }
          }
        }
        that.handleCheckedCitiesChange(that.checkedOptions)
        this.showList = showList
        that.$emit('GetUserDisplay', showList)
      })
    },
    saveAppColumns() {
      console.log(this.checkedOptions)
      this.tosave(this.checkedOptions)
    },
    saveSort() {
      console.log(this.showList)
      var columns = []
      this.showList.forEach(element => {
        columns.push(element.ColumnName)
      })
      console.log(columns)
      this.tosave(columns)
    },
    tosave(columns) {
      var that = this
      if (this.apiName == '') return
      SaveAppColumns({
        columns: columns,
        columnType: this.apiName
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          that.visible = false
          that.sort = false
          that.GetUserAppColumns()
        } else {
          this.$message.error(res.Message)
        }
      })
    }
  }
}
</script>
<style scoped>
.item {
  cursor: pointer;
}
</style>
