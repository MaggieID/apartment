<template>
  <div class="g-container">
    <el-card class="box-card">
      <el-scrollbar style="height:100%">
        <el-form inline>
          <el-form-item>
            <el-select v-model="graduateBatchId" placeholder="请选择批次" @change="search">
              <el-option v-for="item in batchList" :key="item.Id" :label="item.GraduateBatchName" :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="multipleSelection.length==0" @click="pilTuisu">批量退宿</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length==0" @click="delData">删除</el-button>
          </el-form-item>
          <el-form-item>
            <displayFields title="更多人员信息" api-name="user_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
          </el-form-item>
        </el-form>
        <el-table :data="tableList" border @selection-change="selectChange">
          <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
          <template v-for="(item,index) in tableColumn">
            <el-table-column :key="index" :width="(item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'||item.ColumnName=='UserLabels')?'180':'120'" :prop="item.ColumnName" :label="item.ColumnCnName" align="center">
              <template slot-scope="{row}">
                <div v-if="item.ColumnName=='PhotoPath'">
                  <el-image v-if="row.PhotoPath" style="width: 50px; height: 50px" :src="row.PhotoPath" :preview-src-list="[row.PhotoPath]" />
                </div>
                <div v-else-if="item.ColumnName=='UserColleges'">
                  <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</el-tag>
                </div>
                <div v-else-if="item.ColumnName=='UserDeps'">
                  <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId" style="margin-right:5px">{{ tag.DepName }}</el-tag>
                </div>
                <div v-else-if="item.ColumnName=='UserLabels'">
                  <el-tag v-for="tag in row.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                </div>
                <div v-else-if="item.ColumnName=='IsCheckIn'||item.ColumnName=='IsOutside'">
                  <el-tag v-if="row[item.ColumnName]==1" type="success">是</el-tag>
                  <el-tag v-if="row[item.ColumnName]==0" type="danger">否</el-tag>
                </div>
                <span v-else>{{ row[item.ColumnName] }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column prop="Number" align="center" label="床位号" min-width="100">
            <template slot-scope="{row}">
              <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Number" align="center" label="床位性别" min-width="100">
            <template slot-scope="{row}">
              <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedSex_CN }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Number" align="center" label="楼栋路径" min-width="300">
            <template slot-scope="{row}">
              <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedFullPath }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Number" align="center" label="床位价格" min-width="100">
            <template slot-scope="{row}">
              <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedPrice }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Number" align="center" label="合同价格" min-width="100">
            <template slot-scope="{row}">
              <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.ContractPrice }}</div>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="操作" fixed="right" min-width="160">
            <template slot-scope="{row}">
              <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
              <el-button v-if="row.StudentLiveInfos.length>0" type="primary" @click="tuisu(row)">确认退宿</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-scrollbar>
    </el-card>
    <userDetails v-model="showDetails" :data="userInfo"></userDetails>
    <checkout v-model="showIn" :data-list="dataList" @getData="search"></checkout>
  </div>
</template>
<script>
import {
  GetBatchStudentList,
  DelGraduateBatchStudent
} from '@/api/GraduateBatch'
import pagination from '@/components/Pagination'
import displayFields from '@/components/DisplayFields'
import userDetails from '@/components/UserInfo/detailsDialog'
import checkout from './components/checkout.vue'
import { BatchTS } from '@/api/LiveOperation'
export default {
  components: { pagination, displayFields, userDetails, checkout },
  data() {
    return {
      formInline: {},
      listQuery: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      graduateBatchId: null,
      tableColumn: [],
      multipleSelection: [],
      userInfo: {},
      showDetails: false,
      showIn: false,
      dataList: []
    }
  },
  computed: {
    batchList() {
      return this.$store.getters.batchList
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBatchList')
  },
  methods: {
    tuisu(row) {
      this.dataList = [row]
      this.showIn = true
    },
    pilTuisu() {
      var keyIds = []
      this.multipleSelection.forEach(row => {
        // row.StudentLiveInfos.forEach(item => {
        // })
        if (row.StudentLiveInfos.length > 0) {
          keyIds.push(row)
        }
      })
      if (keyIds.length == 0) {
        this.$message({
          message: '选中毕业生中没有床位可退宿!',
          type: 'warning'
        })
        return
      }
      this.dataList = keyIds
      this.showIn = true
      // this.$confirm('该操作将让选中毕业生全部进行退宿,是否继续?', '提示', {
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.BatchTS(keyIds)
      //   })
      //   .catch(() => {})
    },
    BatchTS(data) {
      BatchTS({
        contractIds: data
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '操作成功,等待后台处理中...',
            type: 'success',
            duration: 5000
          })
          this.search()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    seeDetail(row) {
      this.userInfo = row
      this.userInfo.UserId = row.Id
      this.showDetails = true
    },
    getMoreInfo(data) {
      this.tableColumn = data
    },
    selectChange(val) {
      this.multipleSelection = val
    },
    delData() {
      this.$confirm('此操作将永久删除该数据，是否继续？', '删除提示', {
        type: 'warning'
      })
        .then(() => {
          var ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.Id)
          })
          var that = this
          DelGraduateBatchStudent({
            graduateBatchId: this.show,
            studentIds: ids
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
    },
    search() {
      this.query.PageIndex = 1
      this.GetBatchStudentList()
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetBatchStudentList()
    },
    GetBatchStudentList() {
      GetBatchStudentList({
        graduateBatchId: this.graduateBatchId,
        page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableList = res.Data
        this.query.pageTotal = res.Totals
      })
    }
  }
}
</script>