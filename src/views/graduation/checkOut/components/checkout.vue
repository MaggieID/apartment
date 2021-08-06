<template>
  <div>
    <el-dialog title="确认退宿信息" append-to-body :visible.sync="value" width="1200px" :before-close="close">
      <div style="display: flex;">
        <div v-if="dataList.length>1" class="treeBox">
          <el-scrollbar style="height:100%">
            <el-radio-group v-model="user" @change="selectNode">
              <el-radio v-for="(item,Index) in dataList" :key="Index" :label="Index" border>{{ item.Name }}</el-radio>
            </el-radio-group>
          </el-scrollbar>
        </div>
        <el-card class="el-card is-always-shadow rightForm " style="flex: 1;height: 518px;">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="psn">
              <el-form style="padding-right: 120px;">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="姓名：">{{ userDetails.Name }} </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="编号：">{{ userDetails.Number }} </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别：">{{ userDetails.Sex_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电话：">{{ userDetails.Phone }} </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="身份："> {{ userDetails.Identity_CN }}</el-form-item>
                  </el-col>
                  <el-col v-if="userDetails.Identity==0" :span="12">
                    <el-form-item label="入学时间："> {{ userDetails.StartSchoolTime |parseTime }}</el-form-item>
                  </el-col>
                  <el-col v-if="userDetails.Identity==0" :span="12">
                    <el-form-item label="学制："> {{ userDetails.StudyingYear_CN }}</el-form-item>
                  </el-col>
                  <!-- <el-col :span="12" v-if="data.Identity==0">
                <el-form-item label="毕业时间："> {{ userDetails.BedName }}</el-form-item>
              </el-col> -->
                  <el-col :span="12">
                    <el-form-item label="证件类型："> {{ userDetails.IdentificationType_CN }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="证件号码："> {{ userDetails.IdentificationNumber }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="生日："> {{ userDetails.Birthday }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="民族："> {{ userDetails.Race_CN }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="国籍："> {{ userDetails.Nationality_CN }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="籍贯："> {{ userDetails.NativePlace_CN }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="婚姻："> {{ userDetails.Marriage_CN }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱："> {{ userDetails.Email }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="住址："> {{ userDetails.Addr }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="出生地："> {{ userDetails.BirthAddr }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否已入住："> <span v-if="userDetails.IsCheckIn!=undefined">{{ userDetails.IsCheckIn==0?'未入住':'已入住' }}</span> </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="学院：">
                      <div v-for="item in userDetails.UserColleges" :key="item.CollegeId">{{ item.CollegePath }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="部门：">
                      <div v-for="item in userDetails.UserDeps" :key="item.DepartmentId">{{ item.DepPath }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-image class="imageBox" :src="userDetails.PhotoPath" :preview-src-list="[userDetails.PhotoPath]">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-tab-pane>
            <el-tab-pane v-for="item in LiveInfo" :key="item.BedId" :label="item.BedName" :name="item.BedId.toString()">
              <el-row :gutter="20">
                <el-scrollbar style="height:430px">
                  <el-form>
                    <el-col :span="8">
                      <el-form-item label="床号："> {{ item.BedName }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="床位价格："> {{ item.BedPrice }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="床位性别："> {{ item.BedSex_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="状态："> 已入住 </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="类型："> {{ LiveType[item.LiveType] }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="床位用途："> {{ item.LivePurpose_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="合同价格："> {{ item.ContractPrice }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="入住时间："> {{ item.CheckInTime|parseTime }} </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="到期时间："> {{ item.EstimatedEndTime |parseTime }} </el-form-item>
                    </el-col>
                    <el-col v-for="(man,i) in item.Manager" :key="i" :span="8">
                      <el-form-item :label="man.RoleName+'：'"> {{ man.UserName }} </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="床位标签：">
                        <el-tag v-for="tag in item.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="床位路径："> {{ item.BedFullPath }} </el-form-item>
                    </el-col>
                  </el-form>
                </el-scrollbar>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <!-- <userDetail :active-name="activeName" :user-details="userInfo" :contract="contractInfo" type="" :bed="bedInfo" style="margin-top: -10px;"></userDetail> -->
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
        <el-button type="primary" @click="BatchTSSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { BatchTS } from '@/api/LiveOperation'
import { GetDics } from '@/api/Dic'
import { GetTemplateInfos } from '@/api/Construct'
import { QueryUserDetails, QueryUserLiveInfo } from '@/api/UserInfo'
import FormRender from '@/components/FormRender'
export default {
  components: {
    FormRender
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
      userDetails: {},
      contractInfo: {},
      templateList: [],
      rules: {
        templateId: [
          { required: true, message: '请选择合同模板', trigger: 'change' }
        ]
      },
      LiveInfo: []
    }
  },
  computed: {
    LiveType() {
      return this.$store.getters.LiveType
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
        console.log(this.dataList)
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
      this.QueryUserLiveInfo()
      this.QueryUserDetails()
    },
    QueryUserLiveInfo() {
      QueryUserLiveInfo({
        UserId: this.dataList[this.user].Id
      }).then(res => {
        this.LiveInfo = res.Data
      })
    },
    QueryUserDetails() {
      QueryUserDetails({
        UserId: this.dataList[this.user].Id
      }).then(res => {
        this.userDetails = res.Data
      })
    },
    BatchTSSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var tishi =
            this.dataList.length > 1
              ? `你确定要批量安排这${this.dataList.length}个人退宿吗?`
              : `你确认要继续安排${this.dataList[this.user].Name}退宿吗?`
          this.$confirm(tishi, '提示', {
            type: 'warning'
          })
            .then(() => {
              this.TuiSu()
            })
            .catch(() => {})
        }
      })
    },
    TuiSu() {
      // for (var key in this.formData) {
      //   this.formData[key] =
      //     this.form[key] == '' ? null : JSON.stringify(this.form[key])
      // }
      var keyIds = []
      this.dataList.forEach(row => {
        row.StudentLiveInfos.forEach(item => {
          keyIds.push(item.ContractId)
        })
      })
      console.log(keyIds)
      BatchTS({
        contractIds: keyIds
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
.imageBox {
  position: absolute;
  top: 20px;
  right: 0px;
}
::v-deep .el-tabs--border-card {
  border: 1px solid #dcdfe6;
}
</style>