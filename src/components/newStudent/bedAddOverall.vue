<template>
  <Dialog :visible="value" @close="close">
    <div style="height: 100%;display: flex; flex-flow: column;">
      <div class="titleDialog">查看详情<span>*查看已经添加床位明细</span></div>
      <el-form class="rightForm" style="padding: 0 10px;" inline>
        <el-form-item label="已选房间 :"><span class="span">444</span></el-form-item>
        <el-form-item label="混合房间数 :"><span class="span">222</span></el-form-item>
        <el-form-item label="男生房间数 :"><span class="span">333</span></el-form-item>
        <el-form-item label="女生房间数 :"><span class="span">333</span></el-form-item>
        <el-form-item label="已选床位 :"><span class="span">333</span></el-form-item>
        <el-form-item label="混合床位数  :"><span class="span">333</span></el-form-item>
        <el-form-item label="男生床位数 :"><span class="span">333</span></el-form-item>
        <el-form-item label="女生床位数 :"><span class="span">333</span></el-form-item>
      </el-form>
      <el-card shadow="never">
        <el-form inline class="m-search">
          <el-form-item>
            <treeselect v-model="formInline.collegeNumber" clearable no-options-text="无" :options="buildTree" :normalizer="normalizer" placeholder="请选择楼栋" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.StudyingYear" clearable placeholder="请选择床位类型">
              <el-option label="一人一床" value="0"></el-option>
              <el-option label="多人一床" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.StudyingYear" clearable placeholder="请选择床位用途">
              <el-option v-for="item in CWYTList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
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
          <el-table-column prop="LabelName" align="center" label="床位号" />
          <el-table-column prop="LabelName" align="center" label="床位性别" />
          <el-table-column prop="LabelName" align="center" label="床位路径" />
          <el-table-column prop="LabelName" align="center" label="床位价格" />
          <el-table-column align="center" label="操作">
            <template>
              <el-button type="text" @click="showDetails=true">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-card>
    </div>
    <bedDetail v-model="showDetails" :data="bedData"></bedDetail>
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog'
import pagination from '@/components/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import bedDetail from '@/components/SelectBed/bedDetail'
export default {
  components: { Dialog, pagination, Treeselect, bedDetail },
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
      bedData: {},
      formInline: {}
    }
  },
  computed: {
    buildTree() {
      return this.$store.getters.buildTree
    },
    CWYTList() {
      return this.$store.getters.CWYTList
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4)
    this.$store.dispatch('actions/getCWYT')
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