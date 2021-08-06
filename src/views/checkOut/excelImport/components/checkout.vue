<template>
  <div>
    <el-dialog title="确认退宿信息" append-to-body :visible.sync="value" width="1200px" :before-close="close">
      <div style="display: flex;">
        <div v-if="dataList.length>1" class="treeBox">
          <el-scrollbar style="height:100%">
            <el-radio-group v-model="user" @change="selectNode">
              <el-radio v-for="(item,Index) in dataList" :key="Index" :label="Index" border>{{ item.UserName }}</el-radio>
            </el-radio-group>
          </el-scrollbar>
        </div>
        <el-card class="el-card is-always-shadow" style="flex: 1;">
          <userDetail :active-name="activeName" :user-details="userInfo" :contract="contractInfo" type="" :bed="bedInfo" style="margin-top: -10px;"></userDetail>
        </el-card>
        <el-card style="height: 518px;width:370px;margin-left: 10px;">
          <div slot="header" class="top-title">
            <span style="padding-right: 50px;">退宿规则</span>
          </div>
          <div style="height:calc(100% - 50px);" class="m-search">
            <el-scrollbar style="height:100%">
              <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="合同模板：" prop="templateId">
                  <el-select v-model="form.templateId" placeholder="请选择" @change="changeTemplate">
                    <el-option v-for="item in templateList" :key="item.Id" :label="item.TemplateName" :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <template v-for="(element,i) in templateExtCols">
                  <form-render :key="element.TypeId" :index="i" :show-del="false" :ele="element" :data="form">
                  </form-render>
                </template>
              </el-form>
            </el-scrollbar>
          </div>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="RuZhuSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ExcelBatchTS, GetContract } from '@/api/LiveOperation'
import { GetDics } from '@/api/Dic'
import { GetTemplateInfos, GetBeds } from '@/api/Construct'
import { QueryUserDetails } from '@/api/UserInfo'
import FormRender from '@/components/FormRender'
import userDetail from '@/components/UserInfo/userDetail'
export default {
  components: {
    FormRender,
    userDetail
  },
  props: {
    value: Boolean,
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      user: 0,
      activeName: 'psn',
      form: {
        templateId: ''
      },
      checkList: [],
      formData: {},
      templateExtCols: [],
      bedInfo: {},
      userInfo: {},
      contractInfo: {},
      templateList: [],
      rules: {
        templateId: [
          { required: true, message: '请选择合同模板', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = 'psn'
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
        this.user = 0
        this.selectNode()
      }
    }
  },
  mounted() {
    this.GetTemplateInfos()
  },
  methods: {
    GetTemplateInfos() {
      GetTemplateInfos({
        TypeName: 'CheckOut'
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
    selectNode() {
      this.GetBeds()
      this.QueryUserDetails()
      this.GetContract()
    },
    GetBeds() {
      GetBeds({
        Id: this.dataList[this.user].BedId,
        Page: null
      }).then(res => {
        this.bedInfo = res.Data[0]
      })
    },
    QueryUserDetails() {
      QueryUserDetails({
        UserId: this.dataList[this.user].UserId
      }).then(res => {
        this.userInfo = res.Data
      })
    },
    GetContract() {
      GetContract({
        UserId: this.dataList[this.user].UserId,
        BedId: this.dataList[this.user].BedId
      }).then(res => {
        this.contractInfo = res.Data[0]
      })
    },
    RuZhuSubmit() {
      var tishi =
        this.dataList.length > 1
          ? `你确定要批量安排这${this.dataList.length}个人退宿吗?`
          : `你确认要继续安排${this.dataList[this.user].UserName}退宿吗?`
      this.$confirm(tishi, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.TuiSu()
        })
        .catch(() => {})
    },
    TuiSu() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // for (var key in this.formData) {
          //   this.formData[key] =
          //     this.form[key] == '' ? null : JSON.stringify(this.form[key])
          // }
          var keyIds = this.dataList.map(item => {
            return item.ID
          })
          ExcelBatchTS({
            keyIds: keyIds
            // ProExts: {
            //   TemplateId: this.from.templateId.toString(),
            //   PropertyValue: this.formData
            // }
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '操作成功,等待后台处理中...',
                type: 'success',
                duration: 5000
              })
              this.$emit('input', false)
              this.$emit('getData')
            } else {
              this.$message.error(res.Message)
            }
          })
        }
      })
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" >
.treeBox {
  height: 518px;
  margin-right: 10px;
  .el-radio {
    width: 120px;
    text-align: center;
    margin: 10px 0;
    margin-left: 0 !important;
    display: block;
  }
  .el-radio__input {
    display: none;
  }
  .upload-demo {
    display: inline-block;
  }
  .mytree {
    .el-tree-node {
      &:first-child {
        left: -4px;
      }
      &:before {
        left: 0;
      }
    }
  }
}
</style>