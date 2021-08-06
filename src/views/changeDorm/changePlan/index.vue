// 换宿
<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <el-row :gutter="10">
        <el-col :span="12">
          <UserBedInfo :bed="bedInfo" button-name="换宿人员" :contract="contractInfo" :user="userInfo" @onClick="showUser=true"></UserBedInfo>
        </el-col>
        <el-col :span="12">
          <ShowBedInfo button-name="换宿床位" :data="newBedInfo" @onClick="showBed=true"></ShowBedInfo>
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
          <el-button type="primary" @click="HuanShuSubmit">确认换宿</el-button>
        </div>
      </el-card>
    </el-scrollbar>
    <selectUserBed v-model="showUser" broadside name="选择换宿人员信息" is-user="1" @change="getInfo">
      <div class="treeTitle">
        <span style="font-weight: bold;">换宿床位信息</span>
      </div>
      <div style="padding: 20px;height:calc(100% - 52px)">
        <el-scrollbar style="height:100%">
          <el-form class="leftForm">
            <el-form-item label="床号："> {{ newBedInfo.BedName }}</el-form-item>
            <el-form-item label="价格："> {{ newBedInfo.BedPrice }} </el-form-item>
            <el-form-item label="性别："> {{ newBedInfo.BedSex_CN }} </el-form-item>
            <el-form-item label="标签：">
              <el-tag v-for="tag in newBedInfo.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
            </el-form-item>
            <el-form-item label="住宿类型："> {{ newBedInfo.LiveType }} </el-form-item>
            <el-form-item label="住宿状态："> {{ newBedInfo.LiveState }} </el-form-item>
            <el-form-item label="床位用途："> {{ newBedInfo.LivePurpose_CN }} </el-form-item>
            <el-form-item label="床位路径："> {{ newBedInfo.ConstructFullPath }} </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </selectUserBed>
    <addBed ref="addBed" v-model="showBed" :data="userInfo" is-user="0" @change="getBed"></addBed>
  </div>
</template>
<script>
import FormRender from '@/components/FormRender'
import { GetTemplateInfos } from '@/api/Construct'
import { HuanShu, GetContract } from '@/api/LiveOperation'
import UserBedInfo from '@/components/selectUserAndBed/UserBedInfo'
import selectUserBed from '@/components/selectUserAndBed/selectUserBed'
import { QueryUserDetails } from '@/api/UserInfo'
import { GetBeds } from '@/api/Construct'
import addBed from '@/components/selectUserAndBed/addBed'
import ShowBedInfo from '@/components/selectUserAndBed/ShowBedInfo'
import { GetDics } from '@/api/Dic'
export default {
  components: {
    FormRender,
    UserBedInfo,
    selectUserBed,
    addBed,
    ShowBedInfo
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
      CheckInUserId: null,
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
      newBedInfo: {},
      newBedId: null,
      UseOldConstracts: false,
      contractInfo: {},
      templateList: []
    }
  },
  mounted() {
    this.GetTemplateInfos()
    if (this.$route.query.bedId != undefined) {
      this.getInfo(this.$route.query)
    }
  },
  methods: {
    getBed(val) {
      this.newBedInfo = val
      this.newBedId = val.Id
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
    },
    HuanShuSubmit() {
      if (this.newBedId == '') {
        this.$message({
          message: '请选择换宿床位',
          type: 'warning'
        })
        return
      }
      if (this.UserId == '') {
        this.$message({
          message: '请选择换宿人员',
          type: 'warning'
        })
        return
      }
      this.$confirm(
        `你确认要让${this.userInfo.Name}换宿到${this.newBedInfo.BedName}?`,
        '提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          if (this.UseOldConstracts) {
            this.HuanShu()
          } else {
            this.$refs.form.validate(valid => {
              if (valid) {
                this.HuanShu()
              }
            })
          }
        })
        .catch(() => {})
    },
    HuanShu() {
      for (var key in this.formData) {
        this.formData[key] =
          this.form[key] == '' ? null : JSON.stringify(this.form[key])
      }
      var data = {}
      if (this.UseOldConstracts) {
        data = {
          newBedId: this.newBedId,
          oldBedId: this.BedId,
          UserId: this.UserId,
          UseOldConstracts: 1,
          ProExts: {
            TemplateId: this.form.templateId.toString(),
            PropertyValue: this.formData
          }
        }
      } else {
        data = {
          newBedId: this.newBedId,
          oldBedId: this.BedId,
          UserId: this.UserId,
          UseOldConstracts: 0,
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
      }
      HuanShu(data).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '换宿成功',
            type: 'success'
          })
          this.resetForm()
          if (this.$route.name == 'arrangechangePlan') {
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
    },
    resetForm() {
      this.newBedInfo = {}
      this.newBedId = null
      this.$refs.form.resetFields()
    },
    getCols(val) {
      var data = []
      val.forEach(element => {
        if (element.TcGroup == 0) {
          data.push(element)
        }
      })
      return data
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
