<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card style="height: 500px;">
            <div class="mb15">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showUser=true">换宿人员</el-button>
              <!-- <el-button type="warning">批量导入</el-button> -->
              <el-button type="danger" icon="el-icon-delete" :disabled="SelectionUser.length==0" @click="delUser">删除</el-button>
            </div>
            <el-table :data="userData" style="width: 100%" height="415" row-key="ContractId" @selection-change="handleSelectionUser">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column prop="UserNumber" align="center" label="编号">
              </el-table-column>
              <el-table-column prop="UserName" align="center" label="姓名">
              </el-table-column>
              <el-table-column prop="Sex_CN" align="center" label="性别">
              </el-table-column>
              <el-table-column prop="ConstructFullPath" align="center" label="床位路径" min-width="150">
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button type="text" size="small" class="btn-detail" @click="handleUser(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 500px;">
            <div class="mb15">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showBed=true">换宿空床</el-button>
              <el-button type="danger" icon="el-icon-delete" :disabled="SelectionBed.length==0" @click="delBed">删除</el-button>
            </div>
            <el-table :data="bedData" style="width: 100%" height="415" row-key="BedId" @selection-change="handleSelectionBed">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column prop="ConstructFullPath" align="center" label="床位路径" min-width="150">
              </el-table-column>
              <el-table-column prop="BedName" align="center" label="床位号">
              </el-table-column>
              <el-table-column prop="BedSex_CN" align="center" label="床位性别">
              </el-table-column>
              <el-table-column align="center" label="床位标签">
                <template slot-scope="{row}">
                  <el-tag v-for="tag in row.Labels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="address" align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button type="text" size="small" class="btn-detail" @click="handleBed(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-card style="height: 440px;margin-top: 10px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height: calc(100% - 25px);">
          <div class="m-search contract">
            <div style="width:400px;height: 100%;border-right: 1px solid #e6ebf5;">
              <div class="contractheader">合同规则
                <el-checkbox v-model="UseOldConstracts" style="margin-left: 20px;">应用历史合同</el-checkbox>
              </div>
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
          <el-button type="primary" @click="RuZhuSubmit">批量换宿</el-button>
        </div>
      </el-card>
    </el-scrollbar>
    <selectBed ref="addBed" v-model="showBed" is-user="0" @change="getBed"></selectBed>
    <bedInfo v-model="showbedInfo" :data="bedInfo"></bedInfo>
    <selectUser v-model="showUser" @change="getUser"></selectUser>
    <userDetail v-model="showuserInfo" :data="userInfo"></userDetail>
  </div>
</template>
<script>
import FormRender from '@/components/FormRender'
import { GetTemplateInfos } from '@/api/Construct'
import { GetDics } from '@/api/Dic'
import selectBed from './components/SelectBed'
import bedInfo from './components/bedInfo'
import selectUser from './components/SelectUser'
import { BatchHS } from '@/api/LiveOperation'
import userDetail from './components/userDetail'
export default {
  components: { FormRender, selectBed, bedInfo, selectUser, userDetail },
  data() {
    return {
      showBed: false,
      showUser: false,
      tableData: [],
      form: {
        EstimatedStartTime: '',
        EstimatedEndTime: '',
        Price: 0,
        Remark: '',
        templateId: ''
      },
      formData: {},
      templateExtCols: [],
      bedInfo: {},
      userInfo: {},
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
      bedData: [],
      userData: [],
      showbedInfo: false,
      showuserInfo: false,
      SelectionBed: [],
      SelectionUser: [],
      UseOldConstracts: false,
      templateList: []
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
    delUser() {
      var userData = this.userData
      for (let i = 0; i < this.SelectionUser.length; i++) {
        for (let j = 0; j < userData.length; j++) {
          if (this.SelectionUser[i].ContractId == userData[j].ContractId) {
            userData.splice(j, 1)
            j = j - 1
          }
        }
      }
      this.userData = userData
    },
    delBed() {
      var bedData = this.bedData
      for (let i = 0; i < this.SelectionBed.length; i++) {
        for (let j = 0; j < bedData.length; j++) {
          if (this.SelectionBed[i].Id == bedData[j].Id) {
            bedData.splice(j, 1)
            j = j - 1
          }
        }
      }
      this.bedData = bedData
    },
    getUser(row) {
      console.log(row)
      var userData = this.userData
      for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < userData.length; j++) {
          if (row[i].ContractId == userData[j].ContractId) {
            userData.splice(j, 1)
            j = j - 1
          }
        }
      }
      this.userData = userData.concat(row)
    },
    handleSelectionUser(row) {
      this.SelectionUser = row
    },
    handleSelectionBed(row) {
      this.SelectionBed = row
    },
    handleUser(row) {
      this.userInfo = row
      this.showuserInfo = true
    },
    handleBed(row) {
      this.bedInfo = row
      this.showbedInfo = true
    },
    getBed(row) {
      var bedData = this.bedData
      for (let i = 0; i < row.length; i++) {
        for (let j = 0; j < bedData.length; j++) {
          if (row[i].Id == bedData[j].Id) {
            bedData.splice(j, 1)
            j = j - 1
          }
        }
      }
      this.bedData = bedData.concat(row)
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    RuZhuSubmit() {
      this.$confirm('安排批量换宿,您确定要继续吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          if (this.userData.length == 0) {
            this.$message({
              message: '请选择换宿人员!',
              type: 'warning'
            })
            return
          }
          if (this.bedData.length == 0) {
            this.$message({
              message: '请选择换宿床位!',
              type: 'warning'
            })
            return
          }
          if (this.UseOldConstracts) {
            this.BatchHS()
          } else {
            this.$refs.form.validate(valid => {
              if (valid) {
                this.BatchHS()
              }
            })
          }
        })
        .catch(() => {})
    },
    BatchHS() {
      for (var key in this.formData) {
        this.formData[key] =
          this.form[key] == '' ? null : JSON.stringify(this.form[key])
      }
      var data = {}
      var contractIds = this.userData.map(item => {
        return item.ContractId
      })
      var newBedIds = this.bedData.map(item => {
        return item.Id
      })
      if (this.UseOldConstracts) {
        data = {
          contractIds: contractIds,
          newBedIds: newBedIds,
          UseOldConstracts: 1,
          ProExts: {
            TemplateId: this.form.TemplateId.toString(),
            PropertyValue: this.formData
          }
        }
      } else {
        data = {
          contractIds: contractIds,
          newBedIds: newBedIds,
          UseOldConstracts: 0,
          constract: {
            EstimatedStartTime: this.form.EstimatedStartTime,
            EstimatedEndTime: this.form.EstimatedEndTime,
            Price: this.form.Price,
            Remark: this.form.Remark
          },
          ProExts: {
            TemplateId: this.form.TemplateId.toString(),
            PropertyValue: this.formData
          }
        }
      }
      BatchHS(data).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '操作成功,等待后台处理中...',
            type: 'success',
            duration: 5000
          })
          this.resetForm()
          this.userData = []
          this.bedData = []
        } else {
          this.$message.error(res.Message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>