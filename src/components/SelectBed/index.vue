<template>
  <div>
    <div v-show="showView" style="padding:20px">
      <div>
        <div class="m-search">
          <el-form inline>
            <el-form-item>
              <treeselect v-model="formInline.CNumber" :limit="1" multiple :append-to-body="append" clearable :options="buildTree" :normalizer="normalizer" placeholder="请选择楼栋" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.Sex" clearable placeholder="请选择床位性别">
                <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.liveState" clearable placeholder="请选择床位状态">
                <el-option label="未入住" value="0"></el-option>
                <el-option label="已入住" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.CName" clearable placeholder="请输入搜索关键字" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getSearch">查询</el-button>
            </el-form-item>
            <el-form-item v-if="showSwitch">
              <el-button type="primary" plain icon="el-icon-refresh" @click="switchView">转换视图</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table ref="singleTable" :data="tableList" stripe highlight-current-row @row-click="handleCurrentChange" @select-all="selectAll" @select="selectbedChange">
        <el-table-column v-if="multiple" type="selection" align="center" width="55" fixed="left"></el-table-column>
        <el-table-column prop="BedName" align="center" label="床位号" />
        <el-table-column prop="BedSex_CN" align="center" label="床位性别" />
        <el-table-column prop="LivePurpose_CN" align="center" label="床位用途" />
        <el-table-column prop="LiveType" align="center" label="床位类型" />
        <el-table-column prop="LiveState" align="center" label="床位状态" />
        <el-table-column prop="BedPrice" align="center" label="床位价格" />
        <el-table-column prop="ConstructFullPath" min-width="200" align="center" label="楼栋途径" />
      </el-table>
      <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
    </div>
    <div v-show="!showView">
      <building ref="building" :is-user="isUser" select :multiple="multiple" :append="append" @change="handleCurrentChange">
        <el-button type="primary" plain icon="el-icon-refresh" @click="switchView">转换视图</el-button>
      </building>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import { GetBeds } from '@/api/Construct'
import Treeselect from '@riophae/vue-treeselect'
import Building from '@/components/Building'
export default {
  components: {
    pagination,
    Treeselect,
    Building
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    isUser: {
      type: String,
      default: '2'
    },
    append: {
      type: Boolean,
      default: false
    },
    showSwitch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showView: true,
      showDetail: false,
      formInline: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableColumn: [],
      currentRow: null,
      selectDataArr: []
    }
  },
  computed: {
    sexList() {
      return this.$store.getters.sexList
    },
    buildTree() {
      return this.$store.getters.buildTree
    }
  },
  mounted() {
    this.$set(this.formInline, 'liveState', this.isUser == 2 ? '' : this.isUser)
    this.GetBeds()
    this.$store.dispatch('actions/getSex')
  },
  methods: {
    normalizer(node) {
      return {
        id: node.YL,
        label: node.Name,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    handleCurrentChange(val) {
      if (this.showView) {
        if (!this.multiple) {
          this.currentRow = val
          this.$emit('change', {
            Id: this.currentRow.Id,
            ConstructFullPath: this.currentRow.ConstructFullPath
          })
        }
      } else {
        if (!this.multiple) {
          var row =
            val.length != 0 && val[0] != undefined ? JSON.parse(val[0]) : null
          if (row != null) {
            this.$emit('change', {
              Id: row.BedId,
              ConstructFullPath: row.ConstructFullPath
            })
          } else {
            this.$emit('change', null)
          }
        } else {
          var arr = []
          val.forEach(element => {
            var item = JSON.parse(element)
            arr.push({
              Id: item.BedId,
              ConstructFullPath: item.ConstructFullPath,
              BedSex_CN: item.BedSex_CN,
              Labels: item.BedLables,
              BedName: item.BedName
            })
          })
          this.$emit('change', arr)
        }
      }
    },
    selectAll(arr) {
      if (arr.length > 0) {
        this.selectDataArr = this.selectDataArr.concat(arr)
      } else {
        for (let i = 0; i < this.selectDataArr.length; i++) {
          for (let j = 0; j < this.tableList.length; j++) {
            if (this.selectDataArr[i].Id === this.tableList[j].Id) {
              this.selectDataArr.splice(i, 1)
            }
          }
        }
      }
      this.$emit('change', this.selectDataArr)
    },
    selectbedChange(arr, row) {
      if (this.selectDataArr.length > 0) {
        const arr = this.selectDataArr.filter(item => {
          return item.Id === row.Id
        })
        if (arr.length > 0) {
          for (let i = 0; i < this.selectDataArr.length; i++) {
            if (this.selectDataArr[i].Id === row.Id) {
              this.selectDataArr.splice(i, 1)
            }
          }
        } else {
          this.selectDataArr.push(row)
        }
      } else {
        this.selectDataArr.push(row)
      }
      this.$emit('change', this.selectDataArr)
    },
    GetBeds() {
      var that = this
      GetBeds({
        CName: this.formInline.CName,
        CNumber: this.formInline.CNumber,
        Sex: this.formInline.Sex,
        LiveType: undefined,
        LivePurpose: undefined,
        isLock: 0,
        liveState: this.formInline.liveState,
        Page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        that.tableList = res.Data
        that.query.pageTotal = res.Totals
        if (that.multiple) {
          that.selectDataArr.forEach(item => {
            that.tableList.forEach(listitem => {
              if (item.Id === listitem.Id) {
                that.$refs.singleTable.toggleRowSelection(listitem, true)
              }
            })
          })
        }
      })
    },
    switchView() {
      this.showView = !this.showView
      this.resetFields()
      this.selectDataArr = []
      this.listQuery = {}
      if (!this.showView) {
        this.$refs.building.resetFields()
        this.$refs.building.GetLiveInfoViewList()
      } else {
        this.$refs.singleTable.clearSelection()
      }
    },
    resetFields() {
      this.$refs.building.checkList = []
      this.$refs.singleTable.setCurrentRow()
      this.$refs.singleTable.clearSelection()
      this.currentRow = null
      this.$emit('change', null)
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetBeds()
    },
    getSearch() {
      this.query.PageIndex = 1
      this.GetBeds()
    },
    getMoreInfo(data) {
      this.tableColumn = data
    }
  }
}
</script>