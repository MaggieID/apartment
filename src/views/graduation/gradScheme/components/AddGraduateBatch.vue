<template>
  <div>
    <el-dialog title="新增批次计划" :visible.sync="value" width="600px" :before-close="cancel">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="新增批次" name="1" style="height:300px;padding-top: 100px;padding-right: 45px;">
          <el-form ref="form" :model="form" :rules="formRule" label-width="120px">
            <el-form-item label="批次名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="应用已创建批次" name="2" style="height:300px;">
          <el-scrollbar style="height:100%;">
            <div style="padding: 15px;">
              <el-radio-group v-model="radio" style="width:100%;border-bottom: 1px solid gainsboro;">
                <div v-for="item in batchList" :key="item.Id" style="border-top: 1px solid gainsboro;padding: 15px 20px;position: relative;">
                  <el-radio :label="item.Id">
                    <el-input v-if="edit==item" v-model="item.GraduateBatchName" placeholder="请输入内容"></el-input>
                    <span v-else style="display: inline-block; height: 36px; line-height: 36px;">{{ item.GraduateBatchName }}</span>
                  </el-radio>
                  <!-- <div style="position: absolute; right: 0; top: 15px;">
                    <el-button v-if="edit==item" type="text" icon="el-icon-check" @click="edit=null"></el-button>
                    <el-button v-else type="text" icon="el-icon-edit" @click="edit=item"></el-button>
                  </div> -->
                </div>
              </el-radio-group>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="toSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { AddGraduateBatch, AddGraduateBatchStudent } from '@/api/GraduateBatch'
export default {
  props: {
    value: Boolean,
    selectData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      activeName: '1',
      form: {},
      radio: 0,
      input: '',
      edit: null,
      loading: false,
      formRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    batchList() {
      return this.$store.getters.batchList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = '1'
        this.form = {}
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      console.log(this.batchList)
    },
    cancel() {
      this.$emit('input', false)
    },
    toSave() {
      if (this.activeName == '1') {
        this.AddGraduateBatch()
      } else {
        this.AddGraduateBatchStudent()
      }
    },
    AddGraduateBatchStudent() {
      var ids = []
      this.selectData.forEach(element => {
        ids.push(element.Id)
      })
      AddGraduateBatchStudent({
        graduateBatchId: this.radio,
        studentIds: ids
      }).then(res => {
        this.saveRes(res)
      })
    },
    AddGraduateBatch() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var studentIds = this.selectData.map(item => {
            return item.Id
          })
          AddGraduateBatch({
            graduateBatechName: this.form.name,
            studentIds: studentIds
          })
            .then(res => {
              this.saveRes(res)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    saveRes(res) {
      this.loading = false
      if (res.BS == 1) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$emit('input', false)
        this.$emit('getList')
      } else {
        this.$message.error(res.Message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs--border-card {
  border: 1px solid #dcdfe6;
}
</style>