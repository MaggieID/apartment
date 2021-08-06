<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-card shadow="never" class="m-search">
        <div :style="{height:!expand?'110px':'',overflow: 'hidden'}">
          <el-form ref="form" label-width="90px">
            <el-row :gutter="20">
              <el-col v-for="(item,index) in queryConditions" :key="index" :span="6">
                <el-form-item v-if="item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                  <treeselect v-model="listQuery[item.ColumnName]" :limit="1" multiple :append-to-body="true" clearable no-options-text="无" :options="item.Items" :normalizer="normalizer" placeholder="请选择" />
                </el-form-item>
                <el-form-item v-else-if="item.ColumnName=='UserLabels.LabelId'" :label="item.ColumnCnName+'：'" :prop="item.ColumnName">
                  <el-select v-model="listQuery[item.ColumnName]" clearable placeholder="请选择">
                    <el-option v-for="i in item.Items" :key="i.Id" :label="i.LabelName" :value="i.Id"></el-option>
                  </el-select>
                </el-form-item>
                <form-render v-else :key="item.TypeId" :index="index" append :ele="item" width="100%" :data="listQuery"></form-render>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="text-align: right;">
          <el-button type="primary" icon="el-icon-search" @click="getConditions">查询</el-button>
          <DisplayFields ref="searchField" title="更多查询字段" left-icon="el-icon-s-operation" api-name="otherstaffs_query" @GetUserDisplay="getCondition" />
          <div class="more" @click="expand=!expand">
            <span>{{ expand?'收起':'展开' }}</span>
            <i :class="expand?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top:15px" shadow="never">
        <el-form ref="form" :inline="true">
          <div style="float: right;">
            <importDialog></importDialog>
            <el-button type="warning" icon="el-icon-document">导出查询</el-button>
          </div>
          <div class="mb15">
            <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
            <el-button type="success" icon="el-icon-edit" :disabled="multipleSelection.length!=1" @click="modifyData">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length==0" @click="delData">删除</el-button>
            <DisplayFields title="更多表格字段" api-name="otherstaffs_display" show-sort left-icon="el-icon-s-operation" @GetUserDisplay="getMoreInfo" />
          </div>
        </el-form>
        <div>
          <el-table :data="tableData" stripe style="width: 100%" @selection-change="selectChange">
            <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
            <template v-for="(item,index) in tableColumn">
              <el-table-column :key="index" :width="(item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'||item.ColumnName=='UserLabels')?'180':'120'" :prop="item.ColumnName" :label="item.ColumnCnName" align="center">
                <template slot-scope="{row}">
                  <div v-if="item.ColumnName=='PhotoPath'">
                    <el-image v-if="row.PhotoPath" style="width: 70px; height: 50px" :src="row.PhotoPath" :preview-src-list="[row.PhotoPath]" />
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
                  <span v-else>{{ row[item.ColumnName] }}{{ row.UserProps[item.ColumnName]|tojson }}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作" align="center" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" size="small" class="btn-detail" @click="handleDetail(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-card>
    </el-scrollbar>
    <!-- 新增弹框 -->
    <modifyDialog v-model="modifyVisible" :add-sign="addSign" :form="form" :template-info="templateInfo" :data="dictObject" @getList="QueryOtherStaffs" />
    <!-- 详情弹框 -->
    <detailsDialog v-model="detailVisible" :data="userInfo" />
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import DisplayFields from '@/components/DisplayFields'
import { QueryOtherStaffs, DelOtherStaffs } from '@/api/UserInfo'
import detailsDialog from './components/details'
import modifyDialog from './components/modify'
import { GetDics } from '@/api/Dic'
import { GetTemplateInfo } from '@/api/Construct'
import Treeselect from '@riophae/vue-treeselect'
import FormRender from '@/components/FormRender'
import { getConditions } from '@/utils/conditions'
import importDialog from '@/components/Upload/importDialog'
import { copyObj } from '@/utils'
export default {
  components: {
    DisplayFields,
    pagination,
    detailsDialog,
    modifyDialog,
    Treeselect,
    FormRender,
    importDialog
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
      listQuery: {},
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableData: [],
      expand: false,
      detailVisible: false,
      modifyVisible: false,
      multipleSelection: [],
      queryConditions: [],
      tableColumn: [],
      dictObject: {},
      form: {},
      templateInfo: {
        templateExtCols: []
      },
      addSign: false,
      conditions: null,
      userInfo: {}
    }
  },
  created() {
    this.QueryOtherStaffs()
    this.GetTemplateInfo()
    this.$store.dispatch('actions/GetCollegeTree').then(res => {
      this.dictObject.collegeList = res.Data.Childs
    })
    this.$store.dispatch('actions/GetDepartmentTree').then(res => {
      this.dictObject.departmentList = res.Data.Childs
    })
    this.getDict()
    this.$store.dispatch('actions/GetLabels', 1).then(res => {
      this.dictObject.labels = res.Data
    })
  },
  methods: {
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
          DelOtherStaffs({
            ids: ids
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.multipleSelection = []
              that.getConditions()
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    getMoreInfo(data) {
      this.tableColumn = data
    },
    async getDict() {
      const reuqTyep = [
        'COUNTRY', // 国家/地区
        'NATIVEPLACE', // 籍贯
        'JZGLB', // 用户类别
        'JZGDQZT', // 用户状态
        'SEX', // 性别
        'MARRIAGE', // 婚姻
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
    // 增加了筛选条件的结果
    getCondition(data) {
      const selectArr = [
        { key: 'UserDetails.Politics', name: '政治面貌', list: 'ZZMM' },
        {
          key: 'UserDetails.IdentificationType',
          name: '证件类型',
          list: 'SFZJLX'
        },
        { key: 'UserDetails.Race', name: '民族', list: 'NATION' },
        { key: 'Sex', name: '性别', list: 'SEX' },
        { key: 'UserDetails.Nationality', name: '国籍', list: 'COUNTRY' },
        { key: 'UserDetails.Marriage', name: '婚姻', list: 'MARRIAGE' },
        { key: 'UserDetails.NativePlace', name: '籍贯', list: 'NATIVEPLACE' }
      ]
      // 时间类型
      const allCondition = [...selectArr]
      console.log(this.dictObject)
      if (data.length) {
        data.map((v, i) => {
          this.$set(this.listQuery, v.key, '')
          v.TypeId = v.ColumnName
          v.ControlType = 7
          v.FieldName = v.ColumnCnName
          v.Items = []
          if (v.ColumnName == 'UserDeps') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.departmentList
          }
          if (v.ColumnName == 'UserColleges') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.collegeList
          }
          if (v.ColumnName == 'UserLabels.LabelId') {
            this.$set(this.listQuery, v.key, [])
            v.Items = this.dictObject.labels
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
    selectChange(val) {
      this.multipleSelection = val
    },
    getConditions() {
      this.query.PageIndex = 1
      var showList = this.$refs.searchField.showList
      this.conditions = getConditions(showList, this.listQuery)
      console.log(this.conditions)
      this.QueryOtherStaffs()
    },
    QueryOtherStaffs() {
      QueryOtherStaffs({
        DynamicFilterInfo: this.conditions,
        AppPage: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.query.pageTotal = res.Totals
      })
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.QueryOtherStaffs()
    },
    GetTemplateInfo() {
      GetTemplateInfo({
        typeName: 'TempUserInfo'
      }).then(res => {
        res.Data.TemplateExtCols.map((val, index) => {
          val.TypeId = val.Id.toString()
          this.$set(this.listQuery, val.FieldKey, '')
          if (val.Items == null) {
            if (
              val.ControlType == 2 ||
              val.ControlType == 4 ||
              val.ControlType == 1
            ) {
              val.Items = []
            }
          }
          if (val.BindingDicKey != null) {
            GetDics({
              number: val.BindingDicKey
            }).then(res => {
              val.Items = res.Data
            })
          }
        })
        this.templateInfo = res.Data
      })
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
    modifyData() {
      this.modifyVisible = true
      this.addSign = false
      var data = copyObj(this.multipleSelection[0])
      this.form = data
      this.form.CollegeIds = data.UserColleges.map(item => {
        return item.CollegeId
      })
      this.form.DepartmentIds = data.UserDeps.map(item => {
        return item.DepartmentId
      })
      this.$set(
        this.form,
        'LabelIds',
        data.UserLabels.map(item => {
          return item.LabelId
        })
      )
      this.form.NativePlace = data.NativePlace.split(',')
      console.log(this.form)
    },
    // 新增弹出
    addData() {
      this.modifyVisible = true
      this.addSign = true
      this.form = {
        Name: '',
        Number: '',
        Sex: '',
        IdentificationType: '',
        IdentificationNumber: '',
        Nationality: '',
        NativePlace: '',
        Race: '',
        Marriage: null,
        Politics: '',
        Addr: '',
        PhotoId: null,
        Account: '',
        Password: '',
        Phone: '',
        Email: '',
        Labels: []
      }
    },
    handleDetail(row) {
      this.detailVisible = true
      this.userInfo = row
    }
  }
}
</script>