<template>
  <Dialog :visible="value" @close="close">
    <div style="height: 100%;display: flex; flex-flow: column;">
      <div class="titleDialog">查看详情<span>*查看已经添加人员明细</span></div>
      <el-form class="rightForm" style="padding: 0 10px;" inline>
        <el-form-item label="已选学生 :"><span class="span">444</span></el-form-item>
        <el-form-item label="女生数量 :"><span class="span">222</span></el-form-item>
        <el-form-item label="男生数量 :"><span class="span">333</span></el-form-item>
      </el-form>
      <el-card shadow="never">
        <el-form inline class="m-search">
          <el-form-item>
            <treeselect v-model="formInline.collegeNumber" clearable no-options-text="无" :options="collegeList" :normalizer="normalizer" placeholder="请选择学院" />
          </el-form-item>
          <el-form-item>
            <treeselect v-model="formInline.StuCategory" clearable :options="dictObject.XSLBList" :normalizer="normalizer1" placeholder="请选择学生类别" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.StudyingYear" clearable placeholder="请选择学制">
              <el-option v-for="item in dictObject.XZList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.Phone" clearable placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
            <el-button type="danger" icon="el-icon-delete">移除</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column prop="LabelName" align="center" label="姓名" />
          <el-table-column prop="LabelName" align="center" label="学号" />
          <el-table-column prop="LabelName" align="center" label="性别" />
          <el-table-column prop="LabelName" align="center" label="班级" />
          <el-table-column align="center" label="操作">
            <template>
              <el-button type="text" @click="showDetails=true">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-card>
    </div>
    <userDetails v-model="showDetails" :data="userData"></userDetails>
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog'
import pagination from '@/components/Pagination'
import userDetails from '@/components/UserInfo/detailsDialog'
import Treeselect from '@riophae/vue-treeselect'
import { GetDics } from '@/api/Dic'
export default {
  components: { Dialog, pagination, userDetails, Treeselect },
  props: {
    value: Boolean
  },
  data() {
    return {
      tableData: [{}],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      showDetails: false,
      userData: {},
      formInline: {},
      dictObject: {}
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetCollegeTree')
    this.getDict()
  },
  methods: {
    async getDict() {
      const reuqTyep = [
        'XSLB', // 用户类别
        'XZ' // 学制
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
    normalizer1(node) {
      return {
        id: node.Code,
        label: node.CName,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    close() {
      this.$emit('input', false)
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetLabels()
    },
    queryList() {
      this.query.PageIndex = 1
      this.GetLabels()
    }
  }
}
</script>
<style lang="scss" scoped>
.titleDialog {
  font-size: 15px;
  font-weight: 600;
  padding: 5px 10px;
  span {
    color: #f56c6c;
    font-size: 12px;
    padding-left: 10px;
  }
}
</style>