<template>
  <div>
    <div style="padding:15px 20px 0;border-bottom: 10px solid #f0f2f5;">
      <div v-if="!showMore">
        <el-form inline>
          <el-form-item>
            <el-input v-model="formInline.Condition" clearable placeholder="请输入姓名/学工号" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.Sex" clearable placeholder="请选择性别">
              <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.Identity" clearable placeholder="请选择身份">
              <el-option v-for="(item,index) in IdentityData" :key="index" :label="item" :value="index.toString()" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="conditions=null;GetUserList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <displayFields title="更多人员信息" api-name="user_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
            <displayFields v-show="showMore" ref="searchField" title="更多筛选条件" api-name="user_query" left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getCondition" />
            <el-button type="primary" @click="handelMore">高级搜索 <span :class="showMore?'up':'down'" class="el-icon-d-arrow-left"></span></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="showMore" class="m-search">
        <el-form ref="form" label-width="90px">
          <el-row>
            <el-col v-for="(item,index) in queryConditions" :key="index" :xl="6" :md="8">
              <el-form-item v-if="item.ColumnName=='UserColleges.CollegeNumber'||item.ColumnName=='UserDeps.DepNumber'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                <treeselect v-model="listQuery[item.ColumnName]" :limit="1" multiple clearable no-options-text="无" :options="item.Items" :normalizer="normalizer" placeholder="请选择" />
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
              <form-render v-else :key="item.TypeId" :index="index" :ele="item" width="100%" :data="listQuery"></form-render>
            </el-col>
            <el-col :span="24">
              <div v-if="showMore" style="text-align: right; margin-bottom: 20px;">
                <div style="float: left;">
                  <el-button type="primary" @click="getConditions">查询</el-button>
                  <el-button type="danger" @click="listQuery={}">清除</el-button>
                </div>
                <displayFields title="更多人员信息" api-name="user_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
                <displayFields v-show="showMore" ref="searchField" title="更多筛选条件" api-name="user_query" left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getCondition" />
                <el-button type="primary" @click="handelMore">高级搜索 <span :class="showMore?'up':'down'" class="el-icon-d-arrow-left"></span></el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div style="padding:20px">
      <el-table ref="singleTable" :data="tableList" stripe highlight-current-row @row-click="handleCurrentChange" @select-all="selectAll" @select="selectChange">
        <el-table-column v-if="multiple" type="selection" align="center" width="55" fixed="left"></el-table-column>
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
      </el-table>
      <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
    </div>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import displayFields from '@/components/DisplayFields'
import FormRender from '@/components/FormRender'
import { QueryUserList } from '@/api/UserInfo'
import { GetDics } from '@/api/Dic'
import Treeselect from '@riophae/vue-treeselect'
import { getConditions } from '@/utils/conditions'
export default {
  components: {
    pagination,
    displayFields,
    FormRender,
    Treeselect
  },
  props: {
    isCheckIn: {
      type: Number,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMore: false,
      formInline: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableColumn: [],
      currentRow: null,
      queryConditions: [],
      dictObject: {},
      listQuery: {},
      conditions: null,
      selectDataArr: []
    }
  },
  computed: {
    IdentityData() {
      return this.$store.getters.IdentityData
    },
    sexList() {
      return this.$store.getters.sexList
    }
  },
  mounted() {
    // this.GetUserList()
    this.$store.dispatch('actions/GetLabels', 1).then(res => {
      this.dictObject.labels = res.Data
    })
    this.$store.dispatch('actions/GetCollegeTree').then(res => {
      this.dictObject.collegeList = res.Data.Childs
    })
    this.$store.dispatch('actions/GetDepartmentTree').then(res => {
      this.dictObject.departmentList = res.Data.Childs
    })
    this.getDict()
  },
  methods: {
    resetFields() {
      this.$refs.singleTable.setCurrentRow()
      this.currentRow = null
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
    async getDict() {
      const reuqTyep = [
        'SEX', // 性别
        'ZZMM', // 政治面貌
        'NATION', // 民族
        'SFZJLX', // 证件类型
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
      // console.log(this.dictObject)
    },
    // 增加了筛选条件的结果
    getCondition(data) {
      // 选择框类型
      const selectArr = [
        { key: 'UserDetails.Politics', name: '政治面貌', list: 'ZZMM' },
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
            v.Items = this.dictObject.departmentList
          }
          if (v.ColumnName == 'UserColleges.CollegeNumber') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.collegeList
          }
          if (v.ColumnName == 'UserLabels.LabelId') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.labels
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
    handleCurrentChange(val) {
      if (!this.multiple) {
        this.currentRow = val
        this.$emit('change', val)
      }
    },
    getConditions() {
      this.query.PageIndex = 1
      var showList = this.$refs.searchField.showList
      this.conditions = getConditions(showList, this.listQuery)
      console.log(this.conditions)
      this.GetUserList()
    },
    GetUserList() {
      var that = this
      var data = {
        Identity: this.formInline.Identity,
        Condition: this.formInline.Condition,
        Sex: this.formInline.Sex,
        FilterInfo: this.conditions,
        isCheckIn: this.isCheckIn,
        AppPage: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }
      QueryUserList(data).then(res => {
        this.tableList = res.Data
        this.query.pageTotal = res.Totals
        if (this.multiple) {
          setTimeout(() => {
            that.selectDataArr.forEach(item => {
              that.tableList.forEach(listitem => {
                if (item.Id === listitem.Id) {
                  that.$refs.singleTable.toggleRowSelection(listitem, true)
                }
              })
            })
          }, 0)
        }
      })
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
    selectChange(arr, row) {
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
    cancel() {
      this.$emit('cancel')
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetUserList()
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