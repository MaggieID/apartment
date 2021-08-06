<template>
  <div>
    <el-dialog title="连接绑定数据字典" :visible.sync="value" width="70%" @before-close="close">
      <div class="mb15">
        <el-input v-model="queryPara.search" clearable placeholder="请输入搜索关键字" class="input-with-select" style="width:380px;">
          <el-select slot="prepend" v-model="queryPara.dicLevel" clearable placeholder="请选择标识" style="width:135px;" @clear="clear">
            <el-option label="系统" :value="0" />
            <el-option label="用户" :value="1" />
          </el-select>
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search" />
        </el-input>
        <span v-if="currentRow.length!=0" style="color: red; padding-left: 50px; font-size: 15px;">字典名称 : {{ currentRow[0].cName }}</span>
      </div>
      <el-row :gutter="20" style="height:calc(100% - 52px)">
        <el-col :span="8" style="height:100%">
          <el-scrollbar style="height:100%">
            <el-table ref="tb" :data="tableData" stripe style="width: 100%" height="560" highlight-current-row @selection-change="handleSelectionChange" @select-all="onSelectAll" @current-change="handleCurrentChange">
              <el-table-column type="selection" width="50" />
              <el-table-column type="index" label="序号" width="50" />
              <el-table-column prop="name" label="标识" width="85">
                <template slot-scope="{row}">
                  {{ row.level==0?'系统级':'用户级' }}
                </template>
              </el-table-column>
              <el-table-column prop="cName" label="字典名称" />
              <el-table-column prop="number" label="字典编号" />
            </el-table>
          </el-scrollbar>
        </el-col>
        <el-col :span="16" style="height:100%;border-left: 1px solid #dfe6ec;">
          <el-scrollbar style="height:100%">
            <el-table :data="dicList" stripe row-key="id" height="450" default-expand-all :tree-props="{children: 'childs'}" style="width: 100%">
              <el-table-column prop="cName" label="字典码" min-width="150px" />
              <el-table-column prop="code" label="字典值" />
              <el-table-column prop="sort" label="排序" />
              <el-table-column prop="description" label="备注" />
              <el-table-column label="标识">
                <template slot-scope="{row}">
                  {{ row.level==0?'系统级':'用户级' }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="状态" width="100">
                <template slot-scope="{row}">
                  <el-switch v-model="row.isEnable" disabled />
                </template>
              </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="queryPara.pageIndex" :limit.sync="queryPara.pageSize" @pagination="getList" />
          </el-scrollbar>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="complete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GetDics, GetAllDicsByPId } from '@/api/Dic'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      queryPara: {
        pid: undefined,
        search: '',
        dicLevel: undefined,
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      currentRow: [],
      tableData: [],
      dicList: [],
      chek: []
    }
  },
  mounted() {
    this.GetDics()
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(val.pop())
      } else {
        this.chek = val
      }
    },
    onSelectAll() {
      this.$refs.tb.clearSelection()
    },
    complete() {
      console.log(this.chek)
      if (this.chek.length == 0) {
        this.$message({
          message: '请选择数据字典类型',
          type: 'warning'
        })
        return
      }
      this.close()
      this.$emit('complete', this.chek[0])
    },
    GetDics() {
      GetDics({
        dicLevel: this.queryPara.dicLevel,
        search: this.queryPara.search,
        AppPage: null
      }).then(res => {
        this.tableData = res.Data
      })
    },
    getChildDics() {
      GetAllDicsByPId({
        Pid: this.queryPara.pid,
        Search: '',
        AppPage: {
          Size: this.queryPara.pageSize,
          Index: this.queryPara.pageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.dicList = res.Data
        this.total = res.Totals
      })
    },
    getList(val) {
      console.log(val)
      this.queryPara.pageSize = val.limit
      this.queryPara.pageIndex = val.page
      this.GetDics()
    },
    search() {
      this.queryPara.pageIndex = 1
      this.GetDics()
    },
    clear() {
      this.queryPara.dicLevel = undefined
    },
    handleCurrentChange(val) {
      this.queryPara.pid = val.id
      this.currentRow = [val]
      this.getChildDics()
    }
  }
}
</script>