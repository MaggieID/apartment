<template>
  <div>
    <el-dialog title="床位历史信息" append-to-body :visible.sync="value" width="900px" :before-close="close">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="UserName" label="姓名" align="center"> </el-table-column>
        <el-table-column prop="UserNumber" label="编号" align="center"> </el-table-column>
        <el-table-column prop="Sex_CN" label="性别" align="center"> </el-table-column>
        <el-table-column prop="ChangeType" label="状态" align="center"> </el-table-column>
        <el-table-column prop="CreatedTime" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="Remark" label="备注" align="center"></el-table-column>
      </el-table>
      <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
    </el-dialog>
  </div>
</template>
<script>
import { GetBedUserChangerHistroy } from '@/api/LiveInfo'
import pagination from '@/components/Pagination'
export default {
  components: { pagination },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.query.PageIndex = 1
        this.GetBedUserChangerHistroy()
      }
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    GetBedUserChangerHistroy() {
      GetBedUserChangerHistroy({
        BedId: this.data.BedId,
        appPage: {
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
      this.GetBedUserChangerHistroy()
    }
  }
}
</script>