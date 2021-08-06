<template>
  <div>
    <div v-if="data.UserLiveInfos.length==0" class="bg">
      <div v-if="data.BedLivePurpose=='5'">
        <img src="./images/ph.png" alt="">
        <div style="color:#E6A23C">该床位已设置为陪护床！</div>
      </div>
      <div v-else-if="data.BedLivePurpose=='6'">
        <img src="./images/wx.png" alt="">
        <div style="color:#22B573">该床位在建设或维修中！</div>
      </div>
      <div v-else-if="data.BedLivePurpose=='3'">
        <img src="./images/xl.png" alt="">
        <div style="color:#B18FF7">该床位已设置为行李专用床！</div>
      </div>
      <div v-else-if="data.BedLivePurpose=='4'">
        <img src="./images/jy.png" alt="">
        <div style="color:#ACACAC">该床位已设置为禁用床!</div>
      </div>
      <div v-else>
        <img src="./images/kc.png" alt="">
        <div style="color:#329AFE">床位空空如也，待您安排！</div>
      </div>
    </div>
    <div v-else style="height:300px">
      <el-scrollbar style="height:100%">
        <template v-for="(user,ui) in data.UserLiveInfos">
          <el-form :key="ui" class="detail el-card__body">
            <!-- <el-popover placement="right" width="235" trigger="click">
            <i v-if="data.UserLiveInfos.length>1" slot="reference" class="iconfont iconqiehuan qiehuan"></i>
            <el-radio-group v-model="radio" class="radioUser">
              <div v-for="(user,ui) in data.UserLiveInfos" :key="ui" class="radioDetail">
                <el-radio :label="ui">
                  <div>
                    <span class="username">{{ user.UserName }}</span>
                    <el-tag v-if="user.Sex_CN=='男性'" type="success">{{ user.Sex_CN }}</el-tag>
                    <el-tag v-else-if="user.Sex_CN=='女性'" type="danger">{{ user.Sex_CN }}</el-tag>
                    <el-tag v-else type="warning">{{ user.Sex_CN }}</el-tag>
                  </div>
                  <div class="usertext">编号:{{ user.UserNumber }}</div>
                  <div class="usertext">时间:{{ user.CheckInTime }}至{{ user.OutInTime }}</div>
                </el-radio>
              </div>
            </el-radio-group>
          </el-popover> -->
            <el-form-item label="姓名：">{{ user.UserName }}</el-form-item>
            <el-form-item label="性别：">{{ user.Sex_CN }}</el-form-item>
            <el-form-item label="编号：">{{ user.UserNumber }}</el-form-item>
            <el-form-item label="电话：">{{ user.Phone }}</el-form-item>
            <el-form-item label="部门：">
              <div v-for="i in user.UserColleges" :key="i.CollegeNumber">{{ i.CollegeFullPath }}</div>
            </el-form-item>
            <el-form-item label="入住时间：">{{ user.CheckInTime }}</el-form-item>
            <el-form-item label="到期时间：">{{ user.OutInTime }}</el-form-item>
            <el-form-item label="状态：">已入住</el-form-item>
            <el-form-item>
              <el-tag v-for="tag in bedLables" :key="tag.LabelId" :style="{	background:tag.BackgroundColor ,color: tag.FontColor,marginRight:'5px'}">{{ tag.LabelName }}</el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bedLables: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      radio: 0
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  text-align: center;
  padding-top: 30px;
  width: 250px;
}
.detail {
  position: relative;
  display: inline-block;
  width: 250px;
  .qiehuan {
    color: #e28a0e;
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 999;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
}
.detail:not(:first-child) {
  margin-left: 10px;
}
.radioDetail {
  ::v-deep .el-radio__input {
    position: absolute;
    right: 5px;
    top: calc(50% - 10px);
  }
  ::v-deep .el-radio__label {
    padding: 0;
  }
}
</style>