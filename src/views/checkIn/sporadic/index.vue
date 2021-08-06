// 零星入住
<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-row :gutter="10">
        <el-col :span="12">
          <ShowUserInfo button-name="入住人员" :data="userInfo" @onClick="showUser=true"></ShowUserInfo>
        </el-col>
        <el-col :span="12">
          <ShowBedInfo button-name="入住床位" :data="bedInfo" @onClick="showBed=true"></ShowBedInfo>
        </el-col>
      </el-row>
      <el-card style="height: 440px;margin-top: 10px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: calc(100% - 25px);">
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
                  <el-col v-for="(element,i) in templateExtCols" :key="element.TypeId" :lg="8" :md="12">
                    <form-render :index="i" :show-del="false" :ele="element" :data="form">
                    </form-render>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </div>
        </el-form>
        <div style="text-align: right;">
          <el-button type="warning" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="RuZhuSubmit">确认入住</el-button>
        </div>
      </el-card>
    </el-scrollbar>
    <addUser ref="addUser" v-model="showUser" :data="bedInfo" @change="getUser"></addUser>
    <addBed ref="addBed" v-model="showBed" is-user="0" :data="userInfo" @change="getBed"></addBed>
  </div>
</template>
<script>
import FormRender from '@/components/FormRender'
import { GetTemplateInfos, GetBeds } from '@/api/Construct'
import addUser from '@/components/selectUserAndBed/addUser'
import addBed from '@/components/selectUserAndBed/addBed'
import { RuZhu } from '@/api/LiveOperation'
import ShowBedInfo from '@/components/selectUserAndBed/ShowBedInfo'
import ShowUserInfo from '@/components/selectUserAndBed/ShowUserInfo'
import { GetDics } from '@/api/Dic'
export default {
  components: {
    FormRender,
    addUser,
    addBed,
    ShowBedInfo,
    ShowUserInfo
  },
  data() {
    return {
      showUser: false,
      showBed: false,
      form: {
        EstimatedStartTime: '',
        EstimatedEndTime: '',
        Price: 0,
        Remark: '',
        templateId: ''
      },
      checkList: [],
      formData: {},
      templateExtCols: [],
      bedInfo: {},
      userInfo: {},
      BedId: null,
      UserId: null,
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
  mounted() {
    this.GetTemplateInfos()
    console.log(this.$route.query.BedId)
    if (this.$route.query.BedId != undefined) {
      GetBeds({
        Id: this.$route.query.BedId,
        Page: null
      }).then(res => {
        this.getBed(res.Data[0])
      })
    }
  },
  methods: {
    getUser(val) {
      this.userInfo = val
      this.UserId = val.Id
    },
    getBed(val) {
      if (val == null) {
        this.bedInfo = {}
        this.BedId = null
      } else {
        this.bedInfo = val
        this.BedId = val.Id
      }
    },
    RuZhuSubmit() {
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
      this.$confirm(`你确认要让${this.userInfo.Name}入住?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.RuZhu()
        })
        .catch(() => {})
    },
    RuZhu() {
      this.$refs.form.validate(valid => {
        if (valid) {
          for (var key in this.formData) {
            this.formData[key] =
              this.form[key] == '' ? null : JSON.stringify(this.form[key])
          }
          RuZhu({
            constract: {
              EstimatedStartTime: this.form.EstimatedStartTime,
              EstimatedEndTime: this.form.EstimatedEndTime,
              Price: this.form.Price,
              Remark: this.form.Remark
            },
            BedId: this.BedId,
            CheckInUserId: this.UserId,
            ProExts: {
              TemplateId: this.form.templateId.toString(),
              PropertyValue: this.formData
            }
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '入住成功',
                type: 'success'
              })
              this.resetForm()
              if (this.$route.name == 'arrangecheckIn') {
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
    resetForm() {
      this.bedInfo = {}
      this.BedId = ''
      this.userInfo = {}
      this.UserId = ''
      this.$refs.form.resetFields()
      this.$refs.addUser.resetFields()
      this.$refs.addBed.resetFields()
    },
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
    }
  }
}
</script>
<style lang="scss" scoped>
.contract {
  height: calc(100% - 15px);
  margin-bottom: 10px;
  display: flex;
  border-bottom: 1px solid #e6ebf5;
}
.contractheader {
  font-weight: 600;
  margin-bottom: 15px;
}
</style>
