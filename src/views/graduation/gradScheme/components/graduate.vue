<template>
  <div>
    <div v-show="!showMore">
      <el-form inline class="m-search">
        <el-form-item>
          <slot name="add"></slot>
        </el-form-item>
        <el-form-item>
          <treeselect v-model="formInline.collegeNumber" :append-to-body="true" clearable no-options-text="无" :options="collegeList" :normalizer="normalizer" placeholder="请选择学院" />
        </el-form-item>
        <el-form-item>
          <div class="block">
            <el-date-picker v-model="formInline.graduationStartTime" type="month" placeholder="请选择毕业时间"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.queryString" clearable placeholder="请输入搜索关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="conditions=null;getConditions()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <displayFields title="更多人员信息" api-name="studentList_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
          <el-button type="primary" @click="handelMore">高级搜索 <span :class="showMore?'up':'down'" class="el-icon-d-arrow-left"></span></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="showMore" class="m-search">
      <el-form ref="form" label-width="90px">
        <el-row>
          <el-col v-for="(item,index) in queryConditions" :key="index" :xl="6" :md="8">
            <el-form-item v-if="item.ColumnName=='UserColleges.CollegeNumber'||item.ColumnName=='UserDeps.DepNumber'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
              <treeselect v-model="listQuery[item.ColumnName]" :limit="1" multiple :append-to-body="true" clearable no-options-text="无" :options="item.Items" :normalizer="normalizer" placeholder="请选择" />
            </el-form-item>
            <el-form-item v-else-if="item.ColumnName=='UserDetails.IsCheckIn'||item.ColumnName=='UserDetails.IsOutside'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
              <el-select v-model="listQuery[item.ColumnName]" clearable placeholder="请选择">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else-if="item.ColumnName=='UserLabels.LabelId'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
              <el-select v-model="listQuery[item.ColumnName]" clearable placeholder="请选择">
                <el-option v-for="i in item.Items" :key="i.Id" :label="i.LabelName" :value="i.Id"></el-option>
              </el-select>
            </el-form-item>
            <form-render v-else :key="item.TypeId" :index="index" append :ele="item" width="100%" :data="listQuery"></form-render>
          </el-col>
          <el-col :span="24">
            <div v-if="showMore" style="text-align: right; margin-bottom: 10px;">
              <div style="float: left;">
                <el-button type="primary" @click="getConditions">查询</el-button>
                <el-button type="danger" @click="listQuery={}">清除</el-button>
                <slot name="add"></slot>
              </div>
              <displayFields title="更多人员信息" api-name="user_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
              <displayFields ref="searchField" title="更多筛选条件" api-name="user_query" left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getCondition" />
              <el-button type="primary" @click="handelMore">高级搜索 <span :class="showMore?'up':'down'" class="el-icon-d-arrow-left"></span></el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table ref="table" style="width:100%" :data="tableData" @select-all="selectAll" @select="selectChange">
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
      <el-table-column align="center" label="操作" fixed="right" min-width="80">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
    <userDetails v-model="showDetails" :data="userInfo"></userDetails>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import FormRender from '@/components/FormRender'
import { QueryStudentList } from '@/api/UserInfo'
import { getConditions } from '@/utils/conditions'
import displayFields from '@/components/DisplayFields'
import { GetDics } from '@/api/Dic'
import userDetails from '@/components/UserInfo/detailsDialog'
export default {
  components: {
    pagination,
    Treeselect,
    FormRender,
    displayFields,
    userDetails
  },
  data() {
    return {
      formInline: {},
      listQuery: {},
      tableData: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableColumn: [],
      showAddBatch: false,
      conditions: null,
      showMore: false,
      userInfo: {},
      showDetails: false,
      queryConditions: [],
      selectData: [],
      dictObject: {}
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    },
    departmentList() {
      return this.$store.getters.departmentList
    },
    labelList() {
      return this.$store.getters.labelList
    }
  },
  mounted() {
    this.getList()
    this.$store.dispatch('actions/GetBatchList')
    this.$store.dispatch('actions/GetCollegeTree')
    this.$store.dispatch('actions/GetDepartmentTree')
    this.getDict()
  },
  methods: {
    async getDict() {
      const reuqTyep = [
        'YHSF',
        'SEX', // 性别
        'ZZMM', // 政治面貌
        'NATION', // 民族
        'SFZJLX' // 证件类型
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
      console.log(this.dictObject)
    },
    seeDetail(row) {
      this.userInfo = row
      this.userInfo.UserId = row.Id
      this.showDetails = true
    },
    getList() {
      this.selectData = []
      this.getConditions()
    },
    getCondition(data) {
      // 选择框类型
      const selectArr = [
        {
          key: 'UserDetails.IdentificationType',
          name: '证件类型',
          list: 'SFZJLX'
        },
        { key: 'Identity', name: '用户身份', list: 'YHSF' },
        { key: 'UserDetails.Race', name: '民族', list: 'NATION' },
        { key: 'Sex', name: '性别', list: 'SEX' }
      ]
      const allCondition = [...selectArr]
      if (data.length) {
        data.map((v, i) => {
          this.$set(this.listQuery, v.key, '')
          v.TypeId = v.ColumnName
          v.ControlType = 7
          v.FieldName = v.ColumnCnName
          v.Items = []
          if (v.ColumnName == 'UserDeps.DepNumber') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.departmentList
          }
          if (v.ColumnName == 'UserColleges.CollegeNumber') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.collegeList
          }
          if (v.ColumnName == 'UserLabels.LabelId') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.labelList
          }
          if (
            v.ColumnName == 'UserDetails.IsCheckIn' ||
            v.ColumnName == 'UserDetails.IsOutside'
          ) {
            v.Items = [
              {
                ItemValue: '是'
              },
              {
                ItemValue: '否'
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
    handelMore() {
      this.showMore = !this.showMore
      this.formInline = {}
      this.listQuery = {}
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
    getMoreInfo(data) {
      this.tableColumn = data
    },
    getConditions() {
      this.query.PageIndex = 1
      if (this.showMore) {
        var showList = this.$refs.searchField.showList
        this.conditions = getConditions(showList, this.listQuery)
      } else {
        this.conditions = null
      }
      this.QueryStudentList()
    },
    selectAll(arr) {
      if (arr.length > 0) {
        this.selectData = this.selectData.concat(arr)
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < this.tableList.length; j++) {
            if (this.selectData[i].Id === this.tableList[j].Id) {
              this.selectData.splice(i, 1)
            }
          }
        }
      }
      this.$emit('change', this.selectData)
    },
    selectChange(arr, row) {
      if (this.selectData.length > 0) {
        const arr = this.selectData.filter(item => {
          return item.Id === row.Id
        })
        if (arr.length > 0) {
          for (let i = 0; i < this.selectData.length; i++) {
            if (this.selectData[i].Id === row.Id) {
              this.selectData.splice(i, 1)
            }
          }
        } else {
          this.selectData.push(row)
        }
      } else {
        this.selectData.push(row)
      }
      this.$emit('change', this.selectData)
    },
    QueryStudentList() {
      var that = this
      QueryStudentList({
        queryString: this.formInline.queryString,
        collegeNumber: this.formInline.collegeNumber,
        graduationStartTime: this.formInline.graduationStartTime,
        graduationEndTime: this.formInline.graduationEndTime,
        hasGraduateBatch: false,
        appDynamicFilterInfo: this.conditions,
        page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.query.pageTotal = res.Totals
        setTimeout(() => {
          that.selectData.forEach(item => {
            that.tableData.forEach(listitem => {
              if (item.Id === listitem.Id) {
                that.$refs.table.toggleRowSelection(listitem, true)
              }
            })
          })
        }, 0)
      })
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.QueryStudentList()
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