
<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-row>
        <el-col :span="12">
          <UserBedInfo :bed="bedInfo" button-name="退宿人员" :user="userInfo" :contract="contractInfo" @onClick="showUser=true"></UserBedInfo>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 500px;">
            <div slot="header" class="top-title" style="padding-bottom: 2px;">退宿规则</div>
            <div style="height:calc(100% - 85px)">
              <el-scrollbar style="height:100%">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                  <el-row>
                    <el-form-item label="合同模板：" prop="templateId">
                      <el-select v-model="form.templateId" placeholder="请选择" @change="changeTemplate">
                        <el-option v-for="item in templateList" :key="item.Id" :label="item.TemplateName" :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-col v-for="(element,i) in templateExtCols" :key="element.TypeId" :span="12">
                      <form-render :index="i" :show-del="false" :ele="element" :data="form">
                      </form-render>
                    </el-col>
                  </el-row>
                </el-form>
              </el-scrollbar>
            </div>
            <div style="text-align: right;">
              <el-button type="warning" @click="resetForm">重置</el-button>
              <el-button type="primary" @click="TuiShuSubmit">确认退宿</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
    <selectUserBed ref="select" v-model="showUser" is-user="1" :is-check-in="1" @change="getInfo"></selectUserBed>
  </div>
</template>
<script>
import UserBedInfo from '@/components/selectUserAndBed/UserBedInfo'
import selectUserBed from '@/components/selectUserAndBed/selectUserBed'
import FormRender from '@/components/FormRender'
import { GetTemplateInfos } from '@/api/Construct'
import { GetDics } from '@/api/Dic'
import { QueryUserDetails } from '@/api/UserInfo'
import { GetBeds } from '@/api/Construct'
import { TuiShu, GetContract } from '@/api/LiveOperation'
export default {
  components: {
    selectUserBed,
    FormRender,
    UserBedInfo
  },
  data() {
    return {
      showUser: false,
      formData: {},
      form: {
        templateId: ''
      },
      templateExtCols: [],
      userInfo: {},
      bedInfo: {},
      BedId: '',
      UserId: '',
      contractInfo: {},
      templateList: [],
      rules: {
        templateId: [
          { required: true, message: '请选择合同模板', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.GetTemplateInfos()
    if (this.$route.query.bedId != undefined) {
      this.getInfo(this.$route.query)
    }
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
    resetForm() {
      this.BedId = ''
      this.UserId = ''
      this.bedInfo = {}
      this.userInfo = {}
      this.$refs.form.resetFields()
      this.$refs.select.resetFields()
    },
    TuiShuSubmit() {
      if (this.UserId == null) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return
      }
      if (this.BedId == null) {
        this.$message({
          message: '请选择床位',
          type: 'warning'
        })
        return
      }
      this.$confirm(`你确认要${this.userInfo.Name}退宿?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.TuiShu()
        })
        .catch(() => {})
    },
    TuiShu() {
      this.$refs.form.validate(valid => {
        console.log(form)
        if (valid) {
          var form = JSON.parse(JSON.stringify(this.formData))
          for (var key in this.formData) {
            form[key] =
              this.formData[key] == ''
                ? null
                : JSON.stringify(this.formData[key])
          }
          TuiShu({
            BedId: this.BedId,
            UserId: this.UserId
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '退宿成功',
                type: 'success'
              })
              this.resetForm()
              if (this.$route.name == 'arrangecheckOut') {
                this.$router.push({
                  name: 'accommodationList',
                  params: {
                    construct: this.$route.query.construct
                  }
                })
              }
            } else {
              this.$message.error(res.Message)
            }
          })
        }
      })
    },
    getInfo(info) {
      this.BedId = info.bedId
      this.UserId = info.userId
      this.QueryUserDetails(info.userId)
      this.GetBeds(info.bedId)
      this.GetContract()
    },
    QueryUserDetails(UserId) {
      QueryUserDetails({
        UserId: UserId
      }).then(res => {
        this.userInfo = res.Data
      })
    },
    GetBeds(bedId) {
      GetBeds({
        Id: bedId,
        Page: null
      }).then(res => {
        this.bedInfo = res.Data[0]
      })
    },
    GetContract() {
      GetContract({
        UserId: this.UserId,
        BedId: this.BedId
      }).then(res => {
        this.contractInfo = res.Data[0]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
