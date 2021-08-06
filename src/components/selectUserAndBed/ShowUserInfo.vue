<template>
  <div>
    <el-card style="height: 500px;">
      <div slot="header" class="btn-top">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handelClick">{{ buttonName }}</el-button>
        <el-tabs v-if="LiveInfo.length>0" v-model="activeName" type="card">
          <el-tab-pane :label="data.Identity_CN+'信息'" name="psn">
            <userInfo :data="data"></userInfo>
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
      </div>
      <div v-if="LiveInfo.length==0">
        <userInfo :data="data"></userInfo>
      </div>
    </el-card>
  </div>
</template>
<script>
import { QueryUserLiveInfo } from '@/api/UserInfo'
import userInfo from '@/components/UserInfo'
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
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
      activeName: 'psn',
      LiveInfo: []
    }
  },
  computed: {
    LiveType() {
      return this.$store.getters.LiveType
    }
  },
  watch: {
    data(val) {
      console.log(val)
      this.activeName = 'psn'
      this.QueryUserLiveInfo()
    }
  },
  methods: {
    QueryUserLiveInfo() {
      QueryUserLiveInfo({
        UserId: this.data.Id
      }).then(res => {
        this.LiveInfo = res.Data
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