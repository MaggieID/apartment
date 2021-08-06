<template>
  <div>
    <el-drawer :modal="false" size="800px" :visible.sync="value" :before-close="handleClose">
      <div slot="title">
        <span style="color: black;">已分配数</span>
        <span class="titleText red">*(查看已分配成功的信息)</span>
        <div style="margin-top: 5px;">
          <span class="titleText blue">已分配总数:600</span>
          <span class="titleText blue">男生总数:600</span>
          <span class="titleText yellow">女生总数:450</span>
          <span class="titleText blue">已入住总数:150</span>
          <span class="titleText blue">已入住男生数:150</span>
          <span class="titleText yellow">已入住女生数:150</span>
        </div>
      </div>
      <el-scrollbar style="height:100%">
        <div style="padding:0 20px">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="LabelName" align="center" label="姓名" />
            <el-table-column prop="LabelName" align="center" label="学号" />
            <el-table-column prop="LabelName" align="center" label="性别" />
            <el-table-column prop="LabelName" align="center" label="床位号" />
            <el-table-column prop="LabelName" align="center" label="床位路径" />
            <el-table-column prop="LabelName" align="center" label="状态" />
            <el-table-column align="center" label="操作">
              <template>
                <el-button type="text">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
export default {
  components: { pagination },
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
      }
    }
  },
  methods: {
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
.yellow {
  color: #e7a543;
}
</style>