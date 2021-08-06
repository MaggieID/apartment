<template>
  <div>
    <el-drawer :modal="false" size="800px" :visible.sync="value" :before-close="handleClose">
      <div v-if="distribution==2" slot="title">
        <span style="color: black;padding-right: 15px;">人员总数</span>
        <span class="titleText blue">总人数:600人</span>
        <span class="titleText red">未分配数:450人</span>
        <span class="titleText blue">已分配数:150人</span>
      </div>
      <div v-if="distribution==0" slot="title">
        <span style="color: black;">未分配人员信息</span>
      </div>
      <div v-if="distribution==1" slot="title">
        <span style="color: black;">添加入住人员</span>
      </div>
      <el-scrollbar style="height:100%">
        <div style="padding:0 20px">
          <el-form inline class="m-search">
            <el-form-item v-if="distribution==0">
              <el-button type="danger" icon="el-icon-delete">移除</el-button>
            </el-form-item>
            <el-form-item>
              <treeselect v-model="formInline.collegeNumber" clearable no-options-text="无" :options="collegeList" :normalizer="normalizer" placeholder="请选择学院" />
            </el-form-item>
            <el-form-item v-if="distribution==2">
              <el-select v-model="formInline.StudyingYear" clearable placeholder="请选择学制">
                <el-option label="已分配" value="1"></el-option>
                <el-option label="未分配" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.Phone" clearable placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column v-if="distribution!=2" type="selection" align="center" width="55"></el-table-column>
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
        </div>
      </el-scrollbar>
    </el-drawer>
    <userDetails v-model="showDetails" :data="userData"></userDetails>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import userDetails from '@/components/UserInfo/detailsDialog'
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: { pagination, userDetails, Treeselect },
  props: {
    value: Boolean,
    distribution: {
      type: Number,
      default: 0
    }
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
      formInline: {}
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    }
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
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetLabels()
    },
    queryList() {
      this.query.PageIndex = 1
      this.GetLabels()
    },
    handleClose() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer.rtl {
  height: calc(100% - 60px);
  top: 60px;
  border-radius: 16px 0 0 16px;
}
::v-deep .el-drawer__header {
  border-bottom: 1px solid #e6ebf5;
  padding-bottom: 15px;
}
.titleText {
  font-size: 14px;
  padding-right: 15px;
}
.red {
  color: #f57070;
}
.blue {
  color: #64a2ff;
}
</style>