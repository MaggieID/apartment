<template>
  <div>
    <el-dialog title="个人信息" append-to-body :visible.sync="value" width="900px" :before-close="close">
      <div v-if="userList.length > 1" style="margin-bottom: 10px;">
        <el-radio-group v-model="radio" @change="handelChange">
          <el-radio-button v-for="(item,index) in userList" :key="index" :label="index">{{ item.UserName }}</el-radio-button>
        </el-radio-group>
      </div>
      <el-tabs v-model="activeName" type="border-card" class="rightForm">
        <el-tab-pane label="基本信息" name="psn" style="height:430px">
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
              <el-col v-if="data.Identity==0" :span="12">
                <el-form-item label="毕业时间："> {{ userDetails.GraduateTime }}</el-form-item>
              </el-col>
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
        <el-tab-pane label="床位信息" name="1" style="height:430px">
          <el-form>
            <el-row>
              <el-col :span="8">
                <el-form-item label="床号："> {{ bed.BedName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="价格："> {{ bed.BedPrice }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="床位性别："> {{ bed.BedSex_CN }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态："> {{ bed.LiveState }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="类型："> {{ bed.LiveType }} </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="床位用途："> {{ bed.LivePurpose_CN }} </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="床位标签：">
                  <el-tag v-for="tag in bed.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="床位路径："> {{ bed.ConstructFullPath }} </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="合同信息" name="2" style="height:430px">
          <el-form>
            <el-row>
              <el-scrollbar style="height:430px">
                <el-col :span="8">
                  <el-form-item label="开始入住："> {{ contract.EstimatedStartTime|parseTime }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束入住：">{{ contract.EstimatedEndTime|parseTime }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="床位价格：">{{ contract.Price }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="备注：">{{ contract.Remark }} </el-form-item>
                </el-col>
                <el-col v-for="(item,index) in contract.Exts" :key="index" :span="8">
                  <el-form-item :label="item.FieldName+'：'">{{ item.FieldValue |tojson }} </el-form-item>
                </el-col>
              </el-scrollbar>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="margin-top:10px">
        <el-button v-if="notdisabled(bed)" type="success" size="small" @click="checkIn">入住</el-button>
        <el-button type="success" size="small" @click="exchangePlan">换宿</el-button>
        <el-button type="success" size="small" @click="changePlan">互调</el-button>
        <el-button type="success" size="small" @click="checkOut">退宿</el-button>
        <el-button type="success" size="small" @click="bedVisible=true">设置床位</el-button>
        <el-button type="success" size="small" @click="historyVisible=true">床位历史信息</el-button>
        <el-button v-if="userinfo.length>0" type="primary" size="small" @click="SetDormitoryDirector">{{ userinfo[radio].IsSSZ==0?'设置宿舍长':'取消宿舍长' }}</el-button>
      </div>
    </el-dialog>
    <bedSetting v-model="bedVisible" :data="data" @getList="GetLiveInfoViewList"></bedSetting>
    <bedHistory v-model="historyVisible" :data="data"></bedHistory>
  </div>
</template>
<script>
import { QueryUserDetails } from '@/api/UserInfo'
import { GetBeds, SetDormitoryDirector } from '@/api/Construct'
import { GetContract } from '@/api/LiveOperation'
import { parseTime } from '@/utils'
import bedSetting from './bedSetting'
import bedHistory from './bedHistory'
import { GetBedUserInfos } from '@/api/Construct'
export default {
  components: {
    bedSetting,
    bedHistory
  },
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    },
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    treeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: 0,
      activeName: 'psn',
      userList: [],
      userDetails: {},
      bed: {},
      contract: {},
      historyVisible: false,
      bedVisible: false,
      userinfo: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = 'psn'
        this.userList = this.data.UserLiveInfos
        this.radio = 0
        this.handelChange()
        this.GetBedUserInfos()
      }
    }
  },
  methods: {
    GetBedUserInfos() {
      GetBedUserInfos({
        BedId: this.data.BedId,
        page: null
      }).then(res => {
        this.userinfo = res.Data
      })
    },
    SetDormitoryDirector() {
      SetDormitoryDirector({
        bedId: this.data.BedId,
        dormitoryDirectorId:
          this.userList[this.radio].IsDormitoryDirectors == 0
            ? this.userList[this.radio].UserId
            : null
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.$emit('getList')
          this.GetBedUserInfos()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    notdisabled(bed) {
      var BedLivePurpose = !(
        bed.LivePurpose == '3' ||
        bed.LivePurpose == '4' ||
        bed.LivePurpose == '6'
      )
      var backState =
        this.data.IsLock == 0 && BedLivePurpose && bed.LiveType == '多人一床'
      return backState
    },
    checkIn() {
      this.$router.push({
        name: 'arrangecheckIn',
        query: { BedId: this.data.BedId }
      })
    },
    GetLiveInfoViewList() {
      this.$emit('getList')
      this.GetBeds()
    },
    checkOut() {
      this.$router.push({
        name: 'arrangecheckOut',
        query: {
          bedId: this.data.BedId,
          userId: this.userList[this.radio].UserId,
          construct: this.treeId
        }
      })
    },
    changePlan() {
      this.$router.push({
        name: 'arrangechangePlan',
        query: {
          bedId: this.data.BedId,
          userId: this.userList[this.radio].UserId,
          construct: this.treeId
        }
      })
    },
    exchangePlan() {
      this.$router.push({
        name: 'arrangeExchange',
        query: {
          bedId: this.data.BedId,
          userId: this.userList[this.radio].UserId,
          construct: this.treeId
        }
      })
    },
    handelChange() {
      this.activeName = 'psn'
      this.QueryUserDetails()
      this.GetBeds()
      this.GetContract()
    },
    QueryUserDetails() {
      QueryUserDetails({
        UserId: this.userList[this.radio].UserId
      }).then(res => {
        this.userDetails = res.Data
      })
    },
    GetBeds() {
      GetBeds({
        Id: this.data.BedId,
        Page: null
      }).then(res => {
        this.bed = res.Data[0]
      })
    },
    GetContract() {
      GetContract({
        UserId: this.userList[this.radio].UserId,
        BedId: this.data.BedId
      }).then(res => {
        this.contract = res.Data[0]
      })
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.imageBox {
  position: absolute;
  top: 20px;
  right: 0px;
}
::v-deep .el-tabs--border-card {
  border: 1px solid #dcdfe6;
}
</style>