<template>
  <Dialog :visible="value" @close="close">
    <el-card class="box-card">
      <div slot="header" style="font-weight: bold;font-size: 15px; padding-top: 5px;">
        <span>添加毕业生人员信息</span>
      </div>
      <el-scrollbar style="height: calc(100% - 85px);">
        <graduate ref="graduate" @change="getSelectData"> </graduate>
      </el-scrollbar>
      <div class="add-footer">
        <span style="float: left; color: #4884ff; font-size: 16px;">当前选中:{{ selectData.length }} 条数据</span>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
      </div>
    </el-card>
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog'
import graduate from '../../gradScheme/components/graduate'
import { AddGraduateBatchStudent } from '@/api/GraduateBatch'
export default {
  components: { Dialog, graduate },
  props: {
    value: Boolean,
    data: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectData: [],
      loading: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$refs.graduate.getList()
      }
    }
  },
  methods: {
    submitAdd() {
      var that = this
      if (this.selectData.length == 0) {
        that.$message({
          message: '请选择毕业生',
          type: 'warning'
        })
        return
      }
      var ids = []
      this.selectData.forEach(element => {
        ids.push(element.Id)
      })
      AddGraduateBatchStudent({
        graduateBatchId: this.data,
        studentIds: ids
      }).then(res => {
        if (res.BS == 1) {
          that.$message({
            message: '添加成功',
            type: 'success'
          })
          that.close()
          this.$emit('getList')
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    getSelectData(row) {
      this.selectData = row
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>