<template>
  <div>
    <el-dialog title="确认入住信息" append-to-body :visible.sync="value" width="60%" :before-close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: 450px;">
        <div class="m-search contract">
          <div style="width:400px;height: 100%;border-right: 1px solid #e6ebf5;">
            <div class="contractheader">合同规则</div>
            <el-form-item label="开始日期：" prop="EstimatedStartTime">
              <el-date-picker v-model="form.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="结束日期：" prop="EstimatedEndTime">
              <el-date-picker v-model="form.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="床位价格：" prop="Price">
              <el-input v-model.number="form.Price" />
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="form.Remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </div>
          <div style="flex: 1;padding-left: 20px;">
            <div class="contractheader">入住规则</div>
            <el-scrollbar style="height:100%">
              <el-form-item label="合同模板：" prop="templateId">
                <el-select v-model="form.templateId" placeholder="请选择" @change="changeTemplate">
                  <el-option v-for="item in templateList" :key="item.Id" :label="item.TemplateName" :value="item.Id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-col v-for="(element,i) in templateExtCols" :key="element.TypeId" :md="12">
                  <form-render :index="i" :show-del="false" :ele="element" :data="form">
                  </form-render>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="rzSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GetTemplateInfos } from '@/api/Construct'
import FormRender from '@/components/FormRender'
import { BatchRZ } from '@/api/LiveOperation'
import { GetDics } from '@/api/Dic'
export default {
  components: {
    FormRender
  },
  props: {
    value: Boolean,
    userList: {
      type: Array,
      default: () => {
        return []
      }
    },
    bedList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        EstimatedStartTime: '',
        EstimatedEndTime: '',
        Price: 0,
        Remark: '',
        templateId: ''
      },
      formData: {},
      templateExtCols: [],
      rules: {
        EstimatedStartTime: [
          { required: true, message: '请选择合同开始时间', trigger: 'change' }
        ],
        EstimatedEndTime: [
          { required: true, message: '请选择合同结束时间', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择合同模板', trigger: 'change' }
        ]
      },
      templateList: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    }
  },
  mounted() {
    this.GetTemplateInfos()
  },
  methods: {
    GetTemplateInfos() {
      GetTemplateInfos({
        TypeName: 'CheckIn'
      }).then(res => {
        this.templateList = res.Data
      })
    },
    changeTemplate(val) {
      var data = this.templateList.find(item => {
        return item.Id == val
      })
      this.templateExtCols = data.TemplateExtCols
      this.templateExtCols.map(val => {
        val.TypeId = val.Id.toString()
        this.$set(
          this.formData,
          val.Id.toString(),
          val.DefaultValue != null ? JSON.parse(val.DefaultValue) : ''
        )
        this.$set(
          this.form,
          val.Id.toString(),
          val.DefaultValue != null ? JSON.parse(val.DefaultValue) : ''
        )
        if (val.Items == null) {
          if (
            val.ControlType == 2 ||
            val.ControlType == 4 ||
            val.ControlType == 1
          ) {
            val.Items = []
          }
        }
        if (val.BindingDicKey != null) {
          GetDics({
            number: val.BindingDicKey
          }).then(res => {
            val.Items = res.Data
          })
        }
      })
    },
    rzSubmit() {
      this.$confirm('安排批量入住,您确定要继续吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.BatchRZ()
        })
        .catch(() => {})
    },
    BatchRZ() {
      this.$refs.form.validate(valid => {
        if (valid) {
          for (var key in this.formData) {
            this.formData[key] =
              this.form[key] == '' ? null : JSON.stringify(this.form[key])
          }
          var bedId = this.bedList.map(item => {
            return item.Id
          })
          var checkInUserId = this.userList.map(item => {
            return item.Id
          })
          var data = {
            bedId: bedId,
            checkInUserId: checkInUserId,
            constract: {
              EstimatedStartTime: this.form.EstimatedStartTime,
              EstimatedEndTime: this.form.EstimatedEndTime,
              Price: this.form.Price,
              Remark: this.form.Remark
            },
            ProExts: {
              TemplateId: this.form.templateId.toString(),
              PropertyValue: this.formData
            }
          }
          BatchRZ(data).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '操作成功,等待后台处理中...',
                type: 'success',
                duration: 5000
              })
              this.cancel()
              // location.reload()
              this.$router.replace({ path: `/redirect${this.$route.fullPath}` })
            } else {
              this.$message.error(res.Message)
            }
          })
        }
      })
    },
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>