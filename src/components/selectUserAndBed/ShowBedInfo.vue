<template>
  <div>
    <el-card style="height: 500px;">
      <div slot="header" class="btn-top">
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="handelClick">{{ buttonName }}</el-button>
        <el-tabs v-if="LiveInfo.length>0" v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="床位信息" name="bed">
            <el-form>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="床号："> {{ data.BedName }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="价格："> {{ data.BedPrice }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="床位性别："> {{ data.BedSex_CN }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="状态："> {{ data.LiveState }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="类型："> {{ data.LiveType }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="床位用途："> {{ data.LivePurpose }} </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="床位标签：">
                    <el-tag v-for="tag in data.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="床位路径："> {{ data.ConstructFullPath }} </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane v-for="item in LiveInfo" :key="item.CheckInUserId" :label="item.Name" :name="item.CheckInUserId.toString()">
            <userInfo v-if="activeName!='bed'" :data="user"></userInfo>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-form v-if="LiveInfo.length==0">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="床号："> {{ data.BedName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格："> {{ data.BedPrice }} </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="床位性别："> {{ data.BedSex_CN }} </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态："> {{ data.LiveState }} </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型："> {{ data.LiveType }} </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="床位用途："> {{ data.LivePurpose_CN }} </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="床位标签：">
              <el-tag v-for="tag in data.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="床位路径："> {{ data.ConstructFullPath }} </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { GetBedUserInfos } from '@/api/Construct'
import userInfo from '@/components/UserInfo'
import { QueryUserDetails } from '@/api/UserInfo'
export default {
  components: {
    userInfo
  },
  props: {
    buttonName: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: 'bed',
      LiveInfo: [],
      user: {}
    }
  },
  watch: {
    data(val) {
      console.log(val)
      this.activeName = 'bed'
      if (this.data.Id == null) {
        this.LiveInfo = []
        return
      }
      this.GetBedUserInfos()
    }
  },
  methods: {
    GetBedUserInfos() {
      GetBedUserInfos({
        BedId: this.data.Id,
        page: null
      }).then(res => {
        this.LiveInfo = res.Data
      })
    },
    tabClick(tab, event) {
      // console.log(tab.name, event)
      if (this.activeName != 'bed') {
        this.QueryUserDetails(tab.name)
      }
    },
    QueryUserDetails(Id) {
      QueryUserDetails({
        UserId: Id
      }).then(res => {
        this.user = res.Data
      })
    },
    handelClick() {
      this.$emit('onClick')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 8px 20px;
}
.el-button {
  i {
    font-size: 15px;
  }
  padding: 8px 20px;
}
</style>