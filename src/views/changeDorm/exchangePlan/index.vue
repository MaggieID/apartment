  // <div>互调安排</div>
<template>
  <div class="g-container">
    <el-scrollbar style="height:100%">
      <div style="display:flex">
        <UserBedInfo :bed="bedInfo" style="flex: 1;" button-name="互调人员" :user="userInfo" :show-contract="false" @onClick="showUser=true"></UserBedInfo>
        <div>
          <i class="iconfont iconhuhuan refresh"></i>
        </div>
        <UserBedInfo :bed="newBedInfo" style="flex: 1;" button-name="互调目标" :user="newUserInfo" :show-contract="false" @onClick="showNewUser=true"></UserBedInfo>
      </div>
      <div style="display:flex;margin-top: 10px;">
        <el-card style="flex: 1;height: 340px;" shadow="never">
          <div slot="header" class="top-title">
            <span style="padding-right: 50px;">合同信息</span>
          </div>
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="开始日期：" prop="EstimatedStartTime">
              <el-date-picker v-model="form.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="结束日期：" prop="EstimatedEndTime">
              <el-date-picker v-model="form.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="床位价格：" prop="Price">
              <el-input v-model.number="form.Price" style="max-width:215px" />
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="form.Remark" placeholder="请输入内容" type="textarea" style="max-width:215px" />
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="flex: 1;height: 340px;" shadow="never">
          <div slot="header" class="top-title">
            <span style="padding-right: 50px;">合同信息</span>
          </div>
          <el-form ref="newForm" :model="newForm" :rules="rules" label-width="120px">
            <el-form-item label="开始日期：" prop="EstimatedStartTime">
              <el-date-picker v-model="newForm.EstimatedStartTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="结束日期：" prop="EstimatedEndTime">
              <el-date-picker v-model="newForm.EstimatedEndTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="床位价格：" prop="Price">
              <el-input v-model.number="newForm.Price" style="max-width:215px" />
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="newForm.Remark" placeholder="请输入内容" type="textarea" style="max-width:215px" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <el-card style="text-align: right;" shadow="never">
        <el-button type="warning" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="HuDiaoSubmit">确认互调</el-button>
      </el-card>
    </el-scrollbar>
    <selectUserBed v-model="showUser" broadside name="选择互调人员信息" is-user="1" @change="getInfo">
      <div class="treeTitle">
        <span style="font-weight: bold;">互调目标信息</span>
      </div>
      <div style="padding: 20px;height:calc(100% - 52px)">
        <el-scrollbar style="height:100%">
          <userInfo :data="newUserInfo" vertical></userInfo>
        </el-scrollbar>
      </div>
    </selectUserBed>
    <selectUserBed v-model="showNewUser" broadside name="选择互调目标人员信息" is-user="1" @change="getNewInfo">
      <div class="treeTitle">
        <span style="font-weight: bold;">互调人员信息</span>
      </div>
      <div style="padding: 20px;height:calc(100% - 52px)">
        <el-scrollbar style="height:100%">
          <userInfo :data="userInfo" vertical></userInfo>
        </el-scrollbar>
      </div>
    </selectUserBed>
  </div>
</template>
<script>
import { HuDiao, GetContract } from '@/api/LiveOperation'
import UserBedInfo from '@/components/selectUserAndBed/UserBedInfo'
import selectUserBed from '@/components/selectUserAndBed/selectUserBed'
import { QueryUserDetails } from '@/api/UserInfo'
import { GetBeds } from '@/api/Construct'
import userInfo from '@/components/UserInfo'
export default {
  components: {
    UserBedInfo,
    selectUserBed,
    userInfo
  },
  data() {
    return {
      showUser: false,
      showNewUser: false,
      form: {},
      newForm: {},
      checkList: [],
      formData: {},
      bedInfo: {},
      userInfo: {},
      BedId: null,
      UserId: null,
      newBedInfo: {},
      newUserInfo: {},
      newBedId: null,
      newUserId: null,
      rules: {
        EstimatedStartTime: [
          { required: true, message: '请选择合同开始时间', trigger: 'change' }
        ],
        EstimatedEndTime: [
          { required: true, message: '请选择合同结束时间', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.bedId != undefined) {
      this.getInfo(this.$route.query)
    }
  },
  methods: {
    getInfo(info) {
      this.BedId = info.bedId
      this.UserId = info.userId
      QueryUserDetails({
        UserId: info.userId
      }).then(res => {
        this.userInfo = res.Data
      })
      GetBeds({
        Id: info.bedId,
        Page: null
      }).then(res => {
        this.bedInfo = res.Data[0]
      })
      GetContract({
        UserId: info.userId,
        BedId: info.bedId
      }).then(res => {
        this.form = res.Data[0]
      })
    },
    getNewInfo(info) {
      this.newBedId = info.bedId
      this.newUserId = info.userId
      QueryUserDetails({
        UserId: info.userId
      }).then(res => {
        this.newUserInfo = res.Data
      })
      GetBeds({
        Id: info.bedId,
        Page: null
      }).then(res => {
        this.newBedInfo = res.Data[0]
      })
      GetContract({
        UserId: info.userId,
        BedId: info.bedId
      }).then(res => {
        this.newForm = res.Data[0]
      })
    },
    getUser(val) {
      this.userInfo = val
      this.UserId = val.Id
    },
    getBed(val) {
      this.bedInfo = val
      this.BedId = val.Id
    },
    HuDiaoSubmit() {
      if (this.UserId == '') {
        this.$message({
          message: '请选择互调人员',
          type: 'warning'
        })
        return
      }
      if (this.newUserId == '') {
        this.$message({
          message: '请选择互调目标',
          type: 'warning'
        })
        return
      }
      this.$confirm(
        `你确认要让${this.userInfo.Name}与${this.newUserInfo.Name}互调床位?`,
        '提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.HuDiao()
        })
        .catch(() => {})
    },
    HuDiao() {
      this.$refs.form.validate(valid => {
        if (valid) {
          HuDiao({
            newBedId: this.newBedId,
            oldBedId: this.BedId,
            oldUserId: this.UserId,
            newUserId: this.newUserId,
            oldConstract: {
              EstimatedStartTime: this.form.EstimatedStartTime,
              EstimatedEndTime: this.form.EstimatedEndTime,
              Price: this.form.Price,
              Remark: this.form.Remark
            },
            newConstract: {
              EstimatedStartTime: this.newForm.EstimatedStartTime,
              EstimatedEndTime: this.newForm.EstimatedEndTime,
              Price: this.newForm.Price,
              Remark: this.newForm.Remark
            }
          }).then(res => {
            if (res.BS == 1) {
              this.$message({
                message: '互调成功',
                type: 'success'
              })
              this.resetForm()
              if (this.$route.name == 'arrangeExchange') {
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
      this.newBedInfo = {}
      this.newBedId = ''
      this.newUserInfo = {}
      this.newUserId = ''
      this.$refs.newForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.refresh {
  height: 45px;
  width: 45px;
  background: white;
  display: inline-block;
  color: #4884ff;
  font-size: 36px;
  text-align: center;
  border-radius: 5px;
  line-height: 45px;
  margin: 5px;
  margin-top: 200px;
}
</style>
