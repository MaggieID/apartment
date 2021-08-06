<template>
  <div>
    <i v-if="data.IsLock==1" class="bedIcon fa fa-lock"></i>
    <el-popover v-model="visible" placement="right" width="280" :trigger="select?'hover':'click'">
      <i v-if="data.BedLiveType=='多人一床'" slot="reference" class="iconfont iconren-duoren bedIcon"></i>
      <div v-if="!select" class="radioUser">
        <div v-for="(user,ui) in data.UserLiveInfos" :key="user.UserId" class="radioDetail" @contextmenu.prevent="itemClick($event,data,ui)">
          <div>
            <span class="username">{{ user.UserName }}</span>
            <el-tag v-if="user.Sex_CN=='男性'" type="success">{{ user.Sex_CN }}</el-tag>
            <el-tag v-else-if="user.Sex_CN=='女性'" type="danger">{{ user.Sex_CN }}</el-tag>
            <el-tag v-else type="warning">{{ user.Sex_CN }}</el-tag>
          </div>
          <div class="usertext">编号 : {{ user.UserNumber }}</div>
          <div class="usertext">时间 : {{ user.CheckInTime }} 至 {{ user.OutInTime }}</div>
        </div>
      </div>
      <el-table v-else :data="data.UserLiveInfos">
        <el-table-column property="UserNumber" label="编号" show-overflow-tooltip></el-table-column>
        <el-table-column property="UserName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column label="学院" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div v-for="tag in row.UserColleges" :key="tag.CollegeNumber">{{ tag.CollegeName }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-popover>
    <!-- <span v-if="data.UserLiveInfos.length > 0"> -->
    <userItem v-if="data.UserLiveInfos.length > 0" :attribute="attribute" :show-state="showState" :data="data.UserLiveInfos[radio]" :name="showName(data.UserLiveInfos[radio])"></userItem>
    <!-- {{ showName(data.UserLiveInfos[radio]) }} -->
    <!-- </span> -->
    <span v-if="data.UserLiveInfos.length==0">{{ data.BedLivePurpose_CN==''?'空':data.BedLivePurpose_CN }}</span>
  </div>
</template>
<script>
import userItem from './userItem'
export default {
  components: { userItem },
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
    },
    showState: {
      type: String,
      default: ''
    },
    attribute: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      radio: 0,
      isshow: false,
      visible: false
    }
  },
  methods: {
    showName(data) {
      var show = []
      if (this.attribute == 3) {
        if (this.showState != '') {
          var state = JSON.parse(this.showState)
          for (let i = 0; i < data.UserColleges.length; i++) {
            if (data.UserColleges[i][state.field] != null) {
              show.push(data.UserColleges[i][state.field])
            }
          }
        } else {
          show = []
        }
      }
      return show
    },
    itemClick(e, item, radio) {
      this.visible = false
      this.$emit('userClick', { e, item, radio })
    }
  }
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
.bedIcon {
  position: absolute;
  left: 10px;
  font-size: 16px;
  display: inline-block;
  height: 100%;
  line-height: 30px;
}
</style>