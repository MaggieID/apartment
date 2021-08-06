<template>
  <div slot="header">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-if="showUser" label="人员信息" name="0">
        <el-scrollbar style="height:350px">
          <userInfo :data="user" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="床位信息" name="1">
        <el-scrollbar style="height:350px">
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
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="showContract" label="合同信息" name="2">
        <el-form>
          <el-row>
            <el-scrollbar style="height:350px">
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
  </div>
</template>
<script>
import userInfo from '@/components/UserInfo'
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    },
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    }
  },
  components: { userInfo },
  props: {
    user: {
      type: Object,
      default: () => {
        return {}
      }
    },
    bed: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showContract: {
      type: Boolean,
      default: true
    },
    showUser: {
      type: Boolean,
      default: true
    },
    contract: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '0'
    }
  },
  mounted() {
    this.activeName = this.showUser ? '0' : '1'
  },
  methods: {
    onClick() {
      this.$emit('onClick')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs--border-card {
  border: 1px solid #dcdfe6;
}
</style>
