<template>
  <div class="g-container" style="background: white;">
    <div v-show="showView" style="height:100%">
      <el-scrollbar style="height:100%">
        <div style="padding:15px 20px 0;border-bottom: 10px solid #f0f2f5;">
          <div class="m-search" :style="{height:!showMore?'110px':'',overflow: 'hidden'}">
            <el-form ref="form" label-width="90px">
              <el-row>
                <el-col v-for="(item,index) in queryConditions" :key="index" :xl="6" :md="8">
                  <el-form-item v-if="item.ColumnName=='CheckInUser.UserDeps'||item.ColumnName=='CheckInUser.UserColleges'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                    <treeselect v-model="listQuery[item.ColumnName]" :limit="1" multiple :append-to-body="true" clearable no-options-text="无" :options="item.Items" :normalizer="normalizer" placeholder="请选择" />
                  </el-form-item>
                  <el-form-item v-else-if="item.ColumnName=='CheckInUser.UserLabels.LabelId'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                    <el-select v-model="listQuery[item.ColumnName]" clearable placeholder="请选择">
                      <el-option v-for="i in item.Items" :key="i.Id" :label="i.LabelName" :value="i.Id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-else-if="item.ColumnName=='Bed.LiveState'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                    <el-select v-model="listQuery[item.ColumnName]" clearable placeholder="请选择">
                      <el-option v-for="(i,j) in item.Items" :key="j" :label="i.ItemValue" :value="j"></el-option>
                    </el-select>
                  </el-form-item>
                  <form-render v-else :key="item.TypeId" :index="index" append :ele="item" width="100%" :data="listQuery"></form-render>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div style="text-align: right; margin-bottom: 20px;">
            <div style="float: left;">
              <el-button type="primary" @click="tableTS">批量退宿</el-button>
              <el-button type="primary" @click="getConditions">查询</el-button>
              <el-button type="danger" @click="listQuery={}">清除</el-button>
              <el-button type="primary" plain icon="el-icon-refresh" @click="switchView">转换视图</el-button>
            </div>
            <el-checkbox v-model="checked">全选</el-checkbox>
            <displayFields title="更多表格信息" api-name="contractliveinfo_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
            <displayFields v-show="showMore" ref="searchField" title="更多筛选条件" api-name="contractliveinfo_query" left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getCondition" />
            <el-button type="primary" @click="handelMore">高级搜索 <span :class="showMore?'up':'down'" class="el-icon-d-arrow-left"></span></el-button>
          </div>
        </div>
        <div style="padding:20px">
          <el-table ref="singleTable" :data="tableList" stripe @selection-change="selectbedChange">
            <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
            <template v-for="(item,index) in tableColumn">
              <el-table-column :key="index" :width="(item.ColumnName=='UserLabels'||item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'||item.ColumnName=='ConstructFullPath')?'180':'120'" :prop="item.ColumnName" :label="item.ColumnCnName" align="center">
                <template slot-scope="{row}">
                  <div v-if="item.ColumnName=='UserColleges'">
                    <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</el-tag>
                  </div>
                  <div v-else-if="item.ColumnName=='UserDeps'">
                    <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId" style="margin-right:5px">{{ tag.DepName }}</el-tag>
                  </div>
                  <div v-else-if="item.ColumnName=='UserLabels'">
                    <el-tag v-for="tag in row.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                  </div>
                  <span v-else>{{ row[item.ColumnName] }}{{ row.ContractProps[item.ColumnName]|tojson }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作" header-align="center" fixed="right" min-width="150">
              <template slot-scope="{row}">
                <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
                <el-button type="primary" @click="isBatchTS(row)">确认退宿</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
        </div>
      </el-scrollbar>
    </div>
    <div v-show="!showView" style="height:100%">
      <el-scrollbar style="height: calc(100% - 60px);">
        <building ref="building" is-user="1" select multiple @change="handleCurrentChange">
          <el-button type="primary" plain icon="el-icon-refresh" @click="switchView">转换视图</el-button>
        </building>
      </el-scrollbar>
      <div class="add-footer">
        <el-button type="primary" @click="getBedInfo">确认退宿</el-button>
      </div>
    </div>
    <el-dialog title="选择退宿人员" :visible.sync="dialogVisible" width="1000px" @before-close="dialogVisible=false">
      <el-carousel ref="carousel" :autoplay="false" :loop="false" arrow="never" indicator-position="none" height="500px">
        <el-carousel-item v-for="(item,index) in moreUser" :key="item.BedId" :name="index.toString()">
          <div style="font-size: 17px; font-weight: 600; margin-bottom: 10px;">{{ item.ConstructFullPath }}</div>
          <el-scrollbar style="height:calc(100% - 20px)">
            <el-table :data="item.UserLiveInfos" style="width: 100%;" row-key="id" @selection-change="handleSelectionChange">
              <el-table-column type="selection" align="center" width="50" />
              <el-table-column prop="UserNumber" align="center" label="用户编码" />
              <el-table-column prop="UserName" align="center" label="用户名" />
              <el-table-column prop="Sex_CN" align="center" label="性别" />
              <el-table-column prop="CheckInTime" align="center" label="入住时间" />
              <el-table-column prop="OutInTime" align="center" label="到期时间" />
              <el-table-column align="center" label="学院">
                <template slot-scope="{row}">
                  <div v-for="College in row.UserColleges" :key="College.CollegeId">{{ College.CollegePath }}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <span style="padding-right: 15px;">
          <el-tag> {{ activeIndex+1 }}</el-tag> / <el-tag> {{ moreUser.length }}</el-tag>
        </span>
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="activeIndex!=0" @click="prev">上一个</el-button>
        <el-button v-if="activeIndex!=moreUser.length-1" @click="next">下一个</el-button>
        <el-button type="primary" :disabled="newList.length!=moreUser.length" @click="viewTS">确 定</el-button>
      </div>
    </el-dialog>
    <userDetails v-model="showDetails" :data="userInfo"></userDetails>
    <checkout v-model="showIn" :data-list="dataList" @getData="getConditions"></checkout>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import displayFields from '@/components/DisplayFields'
import Treeselect from '@riophae/vue-treeselect'
import Building from '@/components/Building'
import {
  BatchTS,
  GetContractLiveInfo,
  BatchTSByQueryCondition
} from '@/api/LiveOperation'
import { getConditions } from '@/utils/conditions'
import FormRender from '@/components/FormRender'
import { GetDics } from '@/api/Dic'
import userDetails from '@/components/UserInfo/detailsDialog'
import checkout from './components/checkout.vue'
export default {
  components: {
    pagination,
    displayFields,
    Treeselect,
    Building,
    FormRender,
    userDetails,
    checkout
  },
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    }
  },
  data() {
    return {
      showView: true,
      formInline: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableColumn: [],
      queryConditions: [],
      dictObject: {},
      listQuery: {},
      currentRow: null,
      viewList: [],
      selectDataArr: [],
      dialogVisible: false,
      moreUser: [],
      activeIndex: 0,
      moreList: {},
      newList: [],
      showMore: false,
      conditions: null,
      showDetails: false,
      userInfo: {},
      checked: false,
      contract: [],
      dataList: [],
      showIn: false
    }
  },
  mounted() {
    this.GetContractLiveInfo()
    this.$store.dispatch('actions/GetCollegeTree').then(res => {
      this.dictObject.collegeList = res.Data.Childs
    })
    this.$store.dispatch('actions/GetDepartmentTree').then(res => {
      this.dictObject.departmentList = res.Data.Childs
    })
    this.$store.dispatch('actions/GetLabels', 1).then(res => {
      this.dictObject.labels = res.Data
    })
    this.getDict()
  },
  methods: {
    isBatchTS(row) {
      this.dataList = [row]
      this.showIn = true
    },
    async getDict() {
      const reuqTyep = [
        'NATION', // 民族
        'SFZJLX', // 证件类型
        'CWYT',
        'SEX',
        'YHSF'
      ]
      const dictObject = {}
      reuqTyep.map(v => {
        dictObject[v + 'List'] = []
      })
      this.dictObject = dictObject
      reuqTyep.map(value => {
        GetDics({
          number: value
        }).then(res => {
          if (res.BS == 1) {
            this.dictObject[`${value}List`] = res.Data
          } else {
            this.dictObject[`${value}List`] = []
          }
        })
      })
    },
    seeDetail(row) {
      this.userInfo = row
      this.showDetails = true
    },
    handelMore() {
      this.showMore = !this.showMore
      this.formInline = {}
      this.listQuery = {}
    },
    getConditions() {
      this.dialogVisible = false
      this.query.PageIndex = 1
      var showList = this.$refs.searchField.showList
      this.conditions = getConditions(showList, this.listQuery)
      console.log(this.conditions)
      this.GetContractLiveInfo()
    },
    GetContractLiveInfo() {
      var that = this
      GetContractLiveInfo({
        filterInfo: this.conditions,
        AppPage: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        that.tableList = res.Data
        that.query.pageTotal = res.Totals
      })
    },
    getCondition(data) {
      // 选择框类型
      const selectArr = [
        { key: 'CheckInUser.UserDetails.Race', name: '民族', list: 'NATION' },
        { key: 'CheckInUser.Identity', name: '身份', list: 'YHSF' },
        {
          key: 'CheckInUser.UserDetails.IdentificationType',
          name: '证件类型',
          list: 'SFZJLX'
        },
        { key: 'Bed.LivePurpose', name: '床位用途', list: 'CWYT' },
        { key: 'Bed.BedSex', name: '床位性别', list: 'SEX' },
        { key: 'CheckInUser.Sex', name: '人员性别', list: 'SEX' }
      ]
      const allCondition = [...selectArr]
      if (data.length) {
        data.map((v, i) => {
          this.$set(this.listQuery, v.key, '')
          v.TypeId = v.ColumnName
          v.ControlType = 7
          v.FieldName = v.ColumnCnName
          v.Items = []
          if (v.ColumnName == 'CheckInUser.UserColleges') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.departmentList
          }
          if (v.ColumnName == 'CheckInUser.UserDeps') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.collegeList
          }
          if (v.ColumnName == 'CheckInUser.UserLabels.LabelId') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.labels
          }
          if (v.ColumnName == 'Bed.LiveState') {
            v.Items = [
              {
                ItemValue: '已入住'
              },
              {
                ItemValue: '未入住'
              }
            ]
          }
          allCondition.map(item => {
            const status = v.ColumnName === item.key
            if (status) {
              if (selectArr.includes(item)) {
                this.$set(this.listQuery, item.key, undefined)
                v.ControlType = 1
                v.BindingDicKey = item.list
                v.Items = this.dictObject[`${item.list}List`]
              }
            }
          })
        })
      }
      this.queryConditions = data
    },
    viewTS() {
      var data = this.contract
      this.newList.forEach(element => {
        data = data.concat(element)
      })
      console.log(data)
      this.dataList = data
      this.showIn = true
      // var contractIds = data.map(item => {
      //   return item.ContractId
      // })
      // this.BatchTS(contractIds)
    },
    tableTS() {
      if (this.checked) {
        this.BatchTSByQueryCondition()
      } else {
        this.dataList = this.selectDataArr
        this.showIn = true
        // var contractIds = this.selectDataArr.map(item => {
        //   return item.ContractId
        // })
        // this.BatchTS(contractIds)
      }
    },
    BatchTSByQueryCondition() {
      var showList = this.$refs.searchField.showList
      this.conditions = getConditions(showList, this.listQuery)
      this.$confirm('您已勾选全选按钮,确定全部退宿?', '提示', {
        type: 'warning'
      })
        .then(() => {
          BatchTSByQueryCondition({
            filterInfo: this.conditions
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '操作成功,等待后台处理中...',
                type: 'success',
                duration: 5000
              })
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    BatchTS(data) {
      this.$confirm('您确定要将选中的数据进行退宿?', '提示', {
        type: 'warning'
      })
        .then(() => {
          BatchTS({
            contractIds: data
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '操作成功,等待后台处理中...',
                type: 'success',
                duration: 5000
              })
              this.dialogVisible = false
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    cancel() {
      this.newList = []
      this.moreList = {}
      this.dialogVisible = false
    },
    next() {
      this.$refs.carousel.next()
      this.activeIndex = this.$refs.carousel.activeIndex
    },
    prev() {
      this.$refs.carousel.prev()
      this.activeIndex = this.$refs.carousel.activeIndex
    },
    handleSelectionChange(row) {
      if (row.length > 0) {
        this.moreList[this.activeIndex] = row
      } else {
        delete this.moreList[this.activeIndex]
      }
      var more = []
      for (var i in this.moreList) {
        more.push(this.moreList[i])
      }
      this.newList = more
      console.log(this.moreList, row, this.activeIndex)
    },
    getBedInfo() {
      if (this.moreUser.length > 0) {
        this.dialogVisible = true
        this.activeIndex = 0
        this.$nextTick(() => {
          this.$refs.carousel.activeIndex = 0
        })
      } else {
        var contractIds = this.contract.map(item => {
          return item.ContractId
        })
        this.BatchTS(contractIds)
      }
    },
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
      var arr = []
      this.contract = []
      val.forEach(element => {
        var item = JSON.parse(element)
        console.log(item)
        item.UserLiveInfos.map(i => {
          i.BedId = item.BedId
        })
        if (item.UserLiveInfos.length > 1) {
          arr.push(item)
        } else {
          this.contract.push(item.UserLiveInfos[0])
        }
      })
      this.moreUser = arr
    },
    selectbedChange(row) {
      this.selectDataArr = row
    },
    switchView() {
      this.showView = !this.showView
      this.selectDataArr = []
      this.contract = []
      this.listQuery = {}
      if (!this.showView) {
        this.$refs.building.resetFields()
        this.$refs.building.GetLiveInfoViewList()
      } else {
        this.$refs.singleTable.clearSelection()
      }
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetContractLiveInfo()
    },
    getMoreInfo(data) {
      this.tableColumn = data
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-d-arrow-right {
  transition: all 0.3s;
}
.up {
  transform: rotate(90deg);
}
.down {
  transform: rotate(-90deg);
}
</style>