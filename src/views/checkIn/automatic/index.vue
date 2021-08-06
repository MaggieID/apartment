<template>
  <div class="g-container" style="display: flex;flex-flow: column;">
    <div style="display: flex;flex: 1;" class="topCard">
      <el-card style="flex: 1; margin-right: 5px;">
        <div slot="header">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser=true">入住人员</el-button>
          <el-button type="warning" @click="uploadVisible=true">批量导入</el-button>
          <el-button type="success" :loading="downloadLoading" @click="ExcelUserInfoTemplate">下载人员</el-button>
        </div>
        <el-form style="height: 116px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="已选学生：">{{ userData.selectData.length }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="男生数量："> {{ userData.boyList.length }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="女生数量：">{{ userData.girlList.length }} </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="checkBox">
          <div class="checkTitle">已选学院范围</div>
          <div class="checks">
            <el-tag v-for="(item ,index) in userData.xy" :key="index" class="tag">{{ item }}</el-tag>
          </div>
        </div>
      </el-card>
      <el-card style="flex: 1; margin-left: 5px;">
        <div slot="header">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="addBed=true">入住床位</el-button>
        </div>
        <el-form>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="已选房间：">{{ bedData.allRooms.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="混合房间数："> {{ bedData.mixRooms.length }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="男生房间数：">{{ bedData.boyRooms.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="女生房间数："> {{ bedData.girlRooms.length }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="已选床位：">{{ bedData.selectData.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="混合床位数：">{{ bedData.mixBeds.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="男生床位数：">{{ bedData.boyBeds.length }} </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="女生床位数：">{{ bedData.girlBeds.length }} </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="checkBox">
          <div class="checkTitle">已选楼栋范围</div>
          <div class="checks">
            <el-tag v-for="(item ,index) in bedData.ld" :key="index" class="tag">{{ item }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>
    <el-card class="bottomCard">
      <div style="float: right;">
        <el-button type="warning" @click="reset">重置</el-button>
        <el-button type="primary" @click="RuZhuSubmit">执行入住</el-button>
      </div>
      <div style="height: 32px; line-height: 32px;">
        <span style="padding-right: 20px;">自动分配规则</span>
        <el-radio-group v-model="currentRules">
          <el-radio :label="0">班级</el-radio>
          <el-radio :label="1">民族</el-radio>
          <el-radio :label="2">籍贯</el-radio>
        </el-radio-group>
      </div>
    </el-card>
    <checkBed v-model="addBed" @change="getBed"></checkBed>
    <checkUser v-model="addUser" @change="getUser"></checkUser>
    <el-dialog title="确认入住信息" append-to-body :visible.sync="showCheck" width="850px" @before-close="showCheck=false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="height:500px;">
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
              <template v-for="(element,i) in templateExtCols">
                <form-render :key="element.TypeId" :index="i" :show-del="false" :ele="element" :data="form">
                </form-render>
              </template>
            </el-scrollbar>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCheck=false">取 消</el-button>
        <el-button type="primary" @click="AutomaticMatchingRZ">确 定</el-button>
      </div>
    </el-dialog>
    <upload v-model="uploadVisible" import-path="/Api/Xsgy/LiveInfo/ImportAutomaticMatchingUserExcel" @getData="getSex"></upload>
  </div>
</template>
<script>
import checkBed from './components/checkBed.vue'
import checkUser from './components/checkUser.vue'
import { AutomaticMatchingRZ } from '@/api/LiveOperation'
import { GetTemplateInfos } from '@/api/Construct'
import { GetDics } from '@/api/Dic'
import FormRender from '@/components/FormRender'
import upload from '@/components/Upload/upload'
import { GetAutomaticInfo, ExcelUserInfoTemplate } from '@/api/LiveInfo'
var fileDownload = require('js-file-download')
import { parseTime } from '@/utils'
export default {
  components: { checkBed, checkUser, FormRender, upload },
  data() {
    return {
      addBed: false,
      addUser: false,
      currentRules: 0,
      bedData: {
        selectData: [],
        boyBeds: [],
        girlBeds: [],
        mixBeds: [],
        boyRooms: [],
        girlRooms: [],
        mixRooms: [],
        allRooms: [],
        ld: []
      },
      userData: {
        selectData: [],
        boyList: [],
        girlList: [],
        xy: []
      },
      showCheck: false,
      form: {
        EstimatedStartTime: '',
        EstimatedEndTime: '',
        Price: 0,
        Remark: '',
        templateId: ''
      },
      formData: {},
      templateInfo: {},
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
      uploadVisible: false,
      downloadLoading: false,
      templateList: []
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4)
    this.$store.dispatch('actions/GetCollegeTree')
    this.$store.dispatch('actions/getSex')
    this.GetTemplateInfos()
    console.log(this.$route)
    if (this.$route.query.jobKey != undefined) {
      this.GetAutomaticInfo()
    }
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
    ExcelUserInfoTemplate() {
      this.downloadLoading = true
      ExcelUserInfoTemplate().then(res => {
        this.downloadLoading = false
        fileDownload(res, `自动匹配入住人员模板${parseTime(new Date())}.xlsx`)
      })
    },
    GetAutomaticInfo() {
      GetAutomaticInfo({
        jobKey: this.$route.query.jobKey,
        currentResult: 0,
        page: null
      }).then(res => {
        this.getSex(res.Data)
      })
    },
    getSex(data) {
      console.log(data)
      this.userData.boyList = []
      this.userData.girlList = []
      this.userData.xy = []
      var xy = []
      this.userData.selectData = data
      data.forEach(element => {
        element.userColleges.forEach(item => {
          if (item.XYNumber != null && xy.indexOf(item.XYNumber) == -1) {
            xy.push(item.XYNumber)
            this.userData.xy.push(item.XYName)
          }
        })
        if (element.Sex == 1) {
          this.userData.boyList.push(element)
        }
        if (element.Sex == 2) {
          this.userData.girlList.push(element)
        }
      })
    },
    reset() {
      this.$router.push({
        name: 'checkInautomatic'
      })
      this.currentRules = 0
      this.bedData = {
        selectData: [],
        boyBeds: [],
        girlBeds: [],
        mixBeds: [],
        boyRooms: [],
        girlRooms: [],
        mixRooms: [],
        allRooms: [],
        ld: []
      }
      this.userData = {
        selectData: [],
        boyList: [],
        girlList: [],
        xy: []
      }
    },
    getBed(data) {
      this.bedData = data
    },
    getUser(data) {
      this.userData = data
    },
    RuZhuSubmit() {
      if (this.userData.selectData.length == 0) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return
      }
      if (this.bedData.selectData.length == 0) {
        this.$message({
          message: '请选择床位',
          type: 'warning'
        })
        return
      }
      this.showCheck = true
      this.$refs.form.resetFields()
    },
    AutomaticMatchingRZ() {
      this.$refs.form.validate(valid => {
        if (valid) {
          for (var key in this.formData) {
            this.formData[key] =
              this.form[key] == '' ? null : JSON.stringify(this.form[key])
          }
          var bedId = this.bedData.selectData.map(item => {
            return item.Id
          })
          var UserId = this.userData.selectData.map(item => {
            return item.Id
          })
          AutomaticMatchingRZ({
            bedId: bedId,
            checkInUserId: UserId,
            currentRules: this.currentRules,
            constract: {
              EstimatedStartTime: this.form.EstimatedStartTime,
              EstimatedEndTime: this.form.EstimatedEndTime,
              Price: this.form.Price,
              Remark: this.form.Remark
            },
            ProExts: {
              TemplateId: this.templateInfo.Id.toString(),
              PropertyValue: this.formData
            }
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '操作成功,等待后台处理中...',
                type: 'success',
                duration: 5000
              })
              this.showCheck = false
              this.reset()
            } else {
              this.$message.error(res.Message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.topCard {
  ::v-deep .el-card__body {
    height: calc(100% - 55px);
  }
  ::v-deep .el-card__header {
    padding: 8px 20px;
  }
}
.checkBox {
  height: calc(100% - 116px);
  .checkTitle {
    font-weight: bold;
  }
  .checks {
    background: #f5f7fa;
    margin-top: 10px;
    border-radius: 10px;
    height: calc(100% - 25px);
    padding: 15px;
  }
  .tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.bottomCard {
  margin-top: 10px;
  height: 70px;
}
</style>