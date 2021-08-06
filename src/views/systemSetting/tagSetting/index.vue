<template>
  <div class="g-container">
    <el-tabs v-model="activeName" type="border-card" style="height:100%" @tab-click="tabClick">
      <el-tab-pane label="房间标签设置" name="0"> </el-tab-pane>
      <el-tab-pane label="人员标签设置" name="1"> </el-tab-pane>
      <el-scrollbar style="height:100%">
        <div class="mb15">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="success" icon="el-icon-edit" :disabled="multipleSelection.length!=1" @click="modifyData">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length==0" @click="delData">删除</el-button>
        </div>
        <el-table :data="tableData" border stripe style="width: 100%" @selection-change="selectChange">
          <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
          <el-table-column prop="LabelName" align="center" label="标签名称" />
          <el-table-column align="center" label="背景颜色">
            <template slot-scope="{ row }">
              <span class="outsitespan">
                <span class="innerspan" :style="{ background: row.BackgroundColor }" />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="字体颜色">
            <template slot-scope="{ row }">
              <span class="outsitespan">
                <span class="innerspan" :style="{ background: row.FontColor }" />
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Remark" align="center" label="备注" />
        </el-table>
        <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
      </el-scrollbar>
    </el-tabs>
    <el-dialog title="标签编辑" :visible.sync="editVisible" width="600px" @before-close="editVisible=false">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" style="padding-right: 50px;">
        <el-form-item label="标签名称" prop="LabelName">
          <el-input v-model="ruleForm.LabelName" />
        </el-form-item>
        <el-form-item label="背景颜色" prop="BackgroundColor">
          <el-color-picker v-model="ruleForm.BackgroundColor" />
        </el-form-item>
        <el-form-item label="字体颜色" prop="FontColor">
          <el-color-picker v-model="ruleForm.FontColor" />
        </el-form-item>
        <el-form-item label="描述" prop="Remark">
          <el-input v-model="ruleForm.Remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="toSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteLable, AddLabel, UpdateLabel, GetLabels } from '@/api/Lable'
import pagination from '@/components/Pagination'
import { copyObj } from '@/utils'
export default {
  components: { pagination },
  data() {
    return {
      activeName: '0',
      multipleSelection: [],
      tableData: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      editVisible: false,
      ruleForm: {},
      addSign: false,
      loading: false,
      rules: {
        LabelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.GetLabels()
  },
  methods: {
    tabClick() {
      this.tableData = []
      this.multipleSelection = []
      this.queryList()
    },
    GetLabels() {
      GetLabels({
        LabelName: '',
        LabelType: parseInt(this.activeName),
        Page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        if (res.BS == 1) {
          this.tableData = res.Data
          this.query.pageTotal = res.Totals
        }
      })
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
    },
    add() {
      this.ruleForm = {
        Id: 0,
        Remark: '',
        LabelName: '',
        BackgroundColor: '',
        FontColor: '',
        LabelType: parseInt(this.activeName)
      }
      this.editVisible = true
      this.addSign = true
    },
    toSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.loading) {
            return
          }
          this.loading = true
          var data = {
            Id: this.ruleForm.Id,
            Remark: this.ruleForm.Remark,
            LabelName: this.ruleForm.LabelName,
            BackgroundColor: this.ruleForm.BackgroundColor,
            FontColor: this.ruleForm.FontColor,
            LabelType: this.ruleForm.LabelType
          }
          if (this.addSign) {
            AddLabel(data).then(res => {
              this.saveRes(res)
            })
          } else {
            UpdateLabel(data).then(res => {
              this.saveRes(res)
            })
          }
        }
      })
    },
    saveRes(res) {
      this.loading = false
      console.log(res)
      if (res.BS == 1) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.editVisible = false
        this.GetLabels()
      } else {
        this.$message.error(res.Message)
      }
    },
    modifyData() {
      this.editVisible = true
      this.addSign = false
      this.ruleForm = copyObj(this.multipleSelection[0])
    },
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
          DeleteLable({
            ids: ids
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.multipleSelection = []
              that.queryList()
            } else {
              that.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content {
  height: calc(100% - 39px);
}
.innerspan {
  display: inline-block;
  width: 26px;
  height: 26px;
}
.outsitespan {
  padding: 5px;
  width: 38px;
  height: 38px;
  display: inline-block;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
</style>
