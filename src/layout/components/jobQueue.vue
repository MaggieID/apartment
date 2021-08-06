<template>
  <div class="right-menu-item">
    <el-popover v-model="visible" placement="bottom" trigger="manual" @show="showTable" @hide="hideTable">
      <el-table :data="jobData">
        <el-table-column label="执行时间" align="center" width="150">
          <template slot-scope="{row}">
            {{ row.CreatedTime|parseTime }}
          </template>
        </el-table-column>
        <el-table-column property="JobName" label="任务" align="center" min-width="140"></el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.HandleStats!=0">{{ row.HandleResultMsg }}</span>
            <span v-else>进行中 <i class="el-icon-loading"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="进度" align="center" width="100">
          <template slot-scope="{row}">
            <el-progress :text-inside="true" :stroke-width="20" :percentage="row.Progress*100"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center" width="80">
          <template slot-scope="{row}">
            <el-button v-if="row.ResultCall!='空地址'" type="text" size="small" class="btn-detail" @click="handleDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="query.pageTotal" :page-size="5" :current-page.sync="query.PageIndex" style="margin-top: 15px; text-align: center;" @current-change="handlePageChange"></el-pagination>
      <span slot="reference" class="el-icon-document job" title="任务列表" @click="visible = !visible"></span>
    </el-popover>
    <el-dialog title="任务详情" append-to-body :visible.sync="showDetail" width="1000px" @before-close="showDetail=false">
      <div v-if="task.JobName=='自动匹配入住任务'" style="position: relative;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="分配成功清单" name="1"></el-tab-pane>
          <el-tab-pane label="分配失败清单" name="0"></el-tab-pane>
        </el-tabs>
        <el-button v-if="activeName=='0'" type="primary" style="position: absolute;top: 0;right: 0;" :disabled="tableQuery.pageTotal==0" @click="toAutomatic">继续入住</el-button>
      </div>
      <el-table :data="tableList">
        <el-table-column prop="UserNumber" align="center" label="用户编码" />
        <el-table-column prop="UserName" align="center" label="用户姓名" />
        <el-table-column prop="Sex_CN" align="center" label="人员性别" />
        <el-table-column prop="BedName" align="center" label="床位号" />
        <el-table-column prop="BedSex_CN" align="center" label="床位性别" />
        <el-table-column prop="BedFullPath" min-width="200" align="center" label="床位路径" />
        <el-table-column prop="ErrorDetails" min-width="150" align="center" label="详情" />
      </el-table>
      <pagination :total="tableQuery.pageTotal" :page.sync="tableQuery.PageIndex" :limit.sync="tableQuery.PageSize" @pagination="handleSizeChange" />
    </el-dialog>
  </div>
</template>
<script>
import { QueryJobQueue } from '@/api/LiveOperation'
import request from '@/utils/request'
import pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime(val) {
      return parseTime(val)
    }
  },
  components: {
    pagination
  },
  data() {
    return {
      jobData: [],
      query: {
        PageIndex: 1,
        PageSize: 5,
        pageTotal: 0
      },
      showDetail: false,
      tableList: [],
      tableQuery: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      task: {},
      visible: false,
      activeName: '1'
    }
  },
  computed: {
    backProgress() {
      return this.$store.getters.backProgress
    }
  },
  watch: {
    backProgress: {
      deep: true,
      handler(val) {
        console.log(val, 8888)
        this.QueryJobQueue()
      }
    }
  },
  methods: {
    toAutomatic() {
      if (this.$route.name == 'checkInautomatic') {
        this.$router.replace({
          path: `/redirect${this.$route.fullPath}`,
          query: {
            jobKey: this.task.JobKey
          }
        })
      } else {
        this.$router.push({
          name: 'checkInautomatic',
          query: {
            jobKey: this.task.JobKey
          }
        })
      }
      this.visible = false
      this.showDetail = false
    },
    handleClick() {
      this.tableQuery.PageIndex = 1
      this.getDetails()
    },
    handleDetail(row) {
      console.log(row)
      this.task = row
      this.tableQuery.PageIndex = 1
      this.showDetail = true
      if (this.task.JobName != '自动匹配入住任务') {
        this.activeName = undefined
      } else {
        this.activeName = '1'
      }
      this.getDetails()
    },
    getDetails() {
      request({
        url: '/Api/Xsgy/' + this.task.ResultCall,
        method: 'post',
        data: {
          jobKey: this.task.JobKey,
          currentResult: this.activeName,
          page: {
            size: this.tableQuery.PageSize,
            index: this.tableQuery.PageIndex,
            orderPro: '',
            order: ''
          }
        }
      }).then(res => {
        console.log(res)
        this.tableList = res.Data
        this.tableQuery.pageTotal = res.Totals
      })
    },
    handleSizeChange(val) {
      this.tableQuery.PageIndex = val.page
      this.tableQuery.PageSize = val.limit
      this.getDetails()
    },
    showTable() {
      this.QueryJobQueue()
    },
    hideTable() {
      this.$store.dispatch('actions/GetBatchProgressBar', [])
    },
    handlePageChange(val) {
      this.query.PageIndex = val
      this.QueryJobQueue()
    },
    QueryJobQueue() {
      QueryJobQueue({
        jobName: '',
        page: {
          size: 5,
          index: this.query.PageIndex,
          orderPro: 'CreatedTime',
          order: 'asc'
        }
      }).then(res => {
        this.jobData = res.Data
        this.query.pageTotal = res.Totals
        if (this.visible) {
          var JobKey = res.Data.filter(item => {
            if (item.HandleStats == 0) {
              return item.JobKey
            }
          })
          var getJobKey = JobKey.map(item => {
            return item.JobKey
          })
          this.$store.dispatch('actions/GetBatchProgressBar', getJobKey)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.job {
  font-size: 20px;
  color: #fff;
}
</style>