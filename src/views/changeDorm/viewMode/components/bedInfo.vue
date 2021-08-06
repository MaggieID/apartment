<template>
  <div>
    <el-popover placement="right" width="280" trigger="hover">
      <i v-if="data.UserLiveInfos.length > 1" slot="reference" style="position: absolute;left: 10px;" class="iconfont iconren-duoren"></i>
      <el-radio-group v-model="radio" class="radioUser">
        <div v-for="(user,ui) in data.UserLiveInfos" :key="user.UserId" class="radioDetail">
          <el-radio :label="ui">
            <div>
              <span class="username">{{ user.UserName }}</span>
              <el-tag v-if="user.Sex_CN=='男性'" type="success">{{ user.Sex_CN }}</el-tag>
              <el-tag v-else-if="user.Sex_CN=='女性'" type="danger">{{ user.Sex_CN }}</el-tag>
              <el-tag v-else type="warning">{{ user.Sex_CN }}</el-tag>
            </div>
            <div class="usertext">编号 : {{ user.UserNumber }}</div>
            <div class="usertext">时间 : {{ user.CheckInTime }} 至 {{ user.OutInTime }}</div>
          </el-radio>
        </div>
      </el-radio-group>
      <!-- <el-table v-else :data="data.UserLiveInfos">
        <el-table-column property="UserNumber" label="编号" show-overflow-tooltip></el-table-column>
        <el-table-column property="UserName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column label="学院" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div v-for="tag in row.UserColleges" :key="tag.CollegeNumber">{{ tag.CollegeName }}</div>
          </template>
        </el-table-column>
      </el-table> -->
    </el-popover>
    <span v-if="data.UserLiveInfos.length > 0">{{ data.UserLiveInfos[radio].UserName }}</span>
    <span v-if="data.UserLiveInfos.length==0">{{ data.BedLivePurpose_CN==''?'空':data.BedLivePurpose_CN }}</span>
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
    select: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: 0,
      isshow: false
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
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