<template>
  <div>
    <el-dialog title="床位信息" append-to-body :visible.sync="value" width="900px" :before-close="close">
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
      <el-button v-if="notdisabled(bed)" type="success" size="small" @click="checkIn">入住</el-button>
      <el-button type="success" size="small" @click="bedVisible=true">设置床位</el-button>
      <el-button type="success" size="small" @click="historyVisible=true">床位历史信息</el-button>
    </el-dialog>
    <bedSetting v-model="bedVisible" :data="data" @getList="GetLiveInfoViewList"></bedSetting>
    <bedHistory v-model="historyVisible" :data="data"></bedHistory>
  </div>
</template>
<script>
import { GetBeds } from '@/api/Construct'
import bedSetting from './bedSetting'
import bedHistory from './bedHistory'
export default {
  components: {
    bedSetting,
    bedHistory
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      bed: {},
      historyVisible: false,
      bedVisible: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.GetBeds()
      }
    }
  },
  methods: {
    notdisabled(bed) {
      var BedLivePurpose = !(
        bed.LivePurpose == '3' ||
        bed.LivePurpose == '4' ||
        bed.LivePurpose == '6'
      )
      var backState = this.data.IsLock == 0 && BedLivePurpose
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
    close() {
      this.$emit('input', false)
    },
    GetBeds() {
      GetBeds({
        Id: this.data.BedId,
        Page: null
      }).then(res => {
        this.bed = res.Data[0]
      })
    }
  }
}
</script>