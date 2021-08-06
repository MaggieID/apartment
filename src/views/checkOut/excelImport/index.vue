<template>
  <div class="g-container">
    <el-card class="box-card">
      <el-scrollbar style="height:100%">
        <el-form inline>
          <el-form-item>
            <el-button type="primary" :disabled="multipleSelection.length==0" @click="BatchRZ">确认退宿</el-button>
            <el-button type="danger" :disabled="multipleSelection.length==0" @click="delData">删除</el-button>
            <el-button type="warning" @click="uploadVisible = true">批量导入</el-button>
            <el-button type="success" @click="downloadVisible=true">下载模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.result" placeholder="请选择分析结果状态" clearable>
              <el-option label="数据错误" value="0"></el-option>
              <el-option label="成功" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.liveState" placeholder="请选择床位状态" clearable>
              <el-option label="未入住" value="0"></el-option>
              <el-option label="已入住" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.name" placeholder="请输入姓名/编号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" @selection-change="selectChange">
          <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
          <el-table-column prop="UserName" align="center" label="姓名">
            <template slot-scope="{row}">
              <span v-if="row.AnalyseResult==0">{{ row.UserName }}</span>
              <el-button v-else type="text" @click="handleRow(row,'showDetails')">{{ row.UserName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="UserNumber" align="center" label="编号" />
          <el-table-column prop="UserSex" align="center" label="性别" />
          <el-table-column prop="CollegeFullPath" align="center" label="学院班级" min-width="150" />
          <el-table-column prop="BedName" align="center" label="床位号" />
          <el-table-column prop="BedSex" align="center" label="床位性别" />
          <el-table-column prop="ConstructFullPath" align="center" label="楼栋路径" min-width="150" />
          <el-table-column prop="LiveState" align="center" label="床位状态" />
          <el-table-column prop="AnalyseResult_CN" align="center" label="分析结果">
            <template slot-scope="{row}">
              <span :style="{color:row.AnalyseResult==0?'red':'green'}">{{ row.AnalyseResult_CN }}</span>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="操作" fixed="right" width="150">
            <template slot-scope="{row}">
              <el-button v-if="row.AnalyseResult==0" type="text" icon="el-icon-edit-outline" title="修改" class="btn-detail btn-del" @click="handleRow(row,'showUpdata')"></el-button>
              <el-button v-if="row.AnalyseResult==1" type="success" @click="handleRow(row,'showIn')">确认退宿</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-scrollbar>
    </el-card>
    <upload v-model="uploadVisible" import-path="/Api/Xsgy/LiveInfo/ImportBatchTSExcel" @getData="search"></upload>
    <download v-model="downloadVisible"></download>
    <updata v-model="showUpdata" :list-info="listInfo" @getData="search"></updata>
    <checkout v-model="showIn" :data-list="dataList" @getData="search"></checkout>
    <userDetails v-model="showDetails" :data="listInfo"></userDetails>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import upload from '@/components/Upload/upload'
import download from './components/download'
import { GetExcelBatchTS, DeleteExcelBatchTSRedis } from '@/api/LiveInfo'
import updata from './components/updata.vue'
import checkout from './components/checkout.vue'
import userDetails from '@/components/UserInfo/detailsDialog'
export default {
  components: { pagination, upload, download, updata, checkout, userDetails },
  data() {
    return {
      tableData: [],
      form: {},
      uploadVisible: false,
      multipleSelection: [],
      downloadVisible: false,
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      dataList: [],
      showUpdata: false,
      listInfo: {},
      showIn: false,
      showDetails: false
    }
  },
  mounted() {
    this.$store.dispatch('actions/getSex')
    this.$store.dispatch('actions/GetCollegeTree')
    this.$store.dispatch('actions/GetBuilding', 9)
    this.GetExcelBatchTS()
  },
  methods: {
    handleRow(row, type) {
      this.listInfo = row
      this[type] = true
      this.dataList = [row]
    },
    BatchRZ() {
      this.showIn = true
      this.dataList = this.multipleSelection.filter(item => {
        return item.AnalyseResult == 1
      })
    },
    selectChange(val) {
      this.multipleSelection = val
    },
    search() {
      this.query.PageIndex = 1
      this.GetExcelBatchTS()
    },
    GetExcelBatchTS() {
      GetExcelBatchTS({
        result: this.form.result,
        liveState: this.form.liveState,
        userName: this.form.name,
        userNumber: this.form.name,
        page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          orderPro: '',
          order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.query.pageTotal = res.Totals
      })
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetExcelBatchTS()
    },
    delData() {
      this.$confirm('此操作将永久删除该数据，是否继续？', '删除提示', {
        type: 'warning'
      })
        .then(() => {
          var ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.ID)
          })
          var that = this
          DeleteExcelBatchTSRedis({
            keys: ids
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.multipleSelection = []
              that.search()
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table th {
  background-color: #ffffff;
}
</style>