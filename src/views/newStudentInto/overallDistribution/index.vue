<template>
  <div class="g-container">
    <el-card shadow="never">
      <el-scrollbar style="height:100%">
        <el-form inline>
          <el-form-item>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addData">创建统筹</el-button>
            <el-button type="warning" icon="el-icon-edit-outline" @click="queryList">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="queryList">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.keyword" clearable placeholder="请输入名称/编号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" @selection-change="selectChange">
          <el-table-column align="center" type="selection" width="55" fixed="left" />
          <el-table-column prop="LabelName" align="center" label="统筹名称">
            <template slot-scope="{row}">
              <el-button type="text" @click="planJump(row)">{{ row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="学生数">
            <template>
              <el-button type="text" @click="showStudent=true">100</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="床位数">
            <template>
              <el-button type="text" @click="showBed=true">200</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="已分配数">
            <template>
              <el-button type="text" @click="showDistribu=true">200</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="LabelName" align="center" label="时间" />
          <el-table-column prop="LabelName" align="center" label="状态" />
          <el-table-column prop="LabelName" align="center" label="子分配数" />
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-scrollbar>
    </el-card>
    <students v-model="showStudent"></students>
    <beds v-model="showBed"></beds>
    <distributions v-model="showDistribu"></distributions>
    <addOverall v-model="showAdd"></addOverall>
  </div>
</template>
<script>
import pagination from '@/components/Pagination'
import students from './components/students.vue'
import beds from './components/beds.vue'
import distributions from './components/distributions.vue'
import addOverall from './components/addOverall.vue'
export default {
  components: { pagination, students, beds, distributions, addOverall },
  data() {
    return {
      listQuery: {},
      multipleSelection: [],
      tableData: [{ name: 'aa' }, { name: 'bb' }],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      showStudent: false,
      showBed: false,
      showDistribu: false,
      showAdd: false
    }
  },
  methods: {
    planJump(row) {
      console.log(this.$router)
      this.$router.push({
        path: `/overallPlan/${row.name}`
      })
    },
    addData() {
      this.showAdd = true
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
    selectChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
</style>