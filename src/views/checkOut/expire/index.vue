<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-card class="box-card">
        <div style="padding:20px 20px 0;border-bottom: 10px solid #f0f2f5;">
          <div class="rightForm">
            <el-form inline>
              <el-form-item>
                <el-button type="success" icon="el-icon-download">下载名单</el-button>
              </el-form-item>
              <el-form-item>
                <el-select clearable placeholder="请选择学院">
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-date-picker type="date" placeholder="请选择退宿日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input clearable placeholder="请输入搜索关键词" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search">查询</el-button>
              </el-form-item>
              <div style="float: right;">
                <displayFields title="更多人员信息" api-name="" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" />
                <el-button type="primary">高级搜索 <span class="el-icon-arrow-down"></span></el-button>
              </div>
            </el-form>
          </div>
        </div>
        <div style="padding:15px">
          <el-table :data="tableList">
            <el-table-column prop="Number" align="center" label="姓名" />
            <el-table-column prop="Name" align="center" label="学号" />
            <el-table-column prop="Number" align="center" label="性别" />
            <el-table-column prop="Number" align="center" label="班级" />
            <el-table-column prop="Number" align="center" label="床位号" />
            <el-table-column prop="Number" align="center" label="床位性别" />
            <el-table-column prop="Number" align="center" label="楼栋路径" />
            <el-table-column prop="Number" align="center" label="床位状态" />
            <el-table-column prop="Number" align="center" label="预计退宿日期" />
            <el-table-column prop="Number" align="center" label="操作" />
          </el-table>
          <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import displayFields from '@/components/DisplayFields'
export default {
  components: {
    pagination,
    displayFields
  },
  data() {
    return {
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableData: []
    }
  },
  mounted() {},
  methods: {
    switchView() {
      this.showView = !this.showView
    },
    cancel() {
      this.$emit('input', false)
    },
    submitAdd() {},
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
    },
    getMoreInfo(data) {
      this.tableColumn = data
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table th {
  background-color: #ffffff;
}
::v-deep .el-card__body {
  padding: 0px;
}
</style>