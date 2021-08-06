<template>
  <div>
    <el-dialog title="设置床位" append-to-body :visible.sync="value" width="600px" :before-close="close">
      <el-radio-group v-model="purpose" class="radioUser">
        <div v-for="(item,index) in CWYTList" :key="item.Id" class="radioDetail">
          <el-avatar icon="iconfont iconicon3" class="avatar" :style="{background: colors[index%6]}"></el-avatar>
          <el-radio :label="item.Code">
            <div>
              <span class="username">{{ item.CName }}</span>
              <div class="usertext">{{ item.Description }}</div>
            </div>
          </el-radio>
        </div>
      </el-radio-group>
      <!-- <div style="color:#F56C6C;margin-top:20px">*设置床位类型需要将床位为空置床，或将人员退宿、调宿方可设置成功</div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="UpdateBedLivePurpose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { UpdateBedLivePurpose } from '@/api/Construct'
export default {
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
      purpose: '',
      dics: [],
      loading: false,
      colors: ['#6FB9FE', '#B18FF7', '#E6A23C', '#9FADC3', '#22B573', '#E6A23C']
    }
  },
  computed: {
    CWYTList() {
      return this.$store.getters.CWYTList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.purpose = this.data.BedLivePurpose
      }
    }
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('input', false)
    },
    UpdateBedLivePurpose() {
      UpdateBedLivePurpose({
        Id: this.data.BedId,
        purpose: this.purpose
      })
        .then(res => {
          this.loading = false
          if (res.BS == 1) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$emit('getList')
            this.close()
          } else {
            this.$message.error(res.Message)
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.radioDetail {
  padding-left: 60px;
  min-height: 60px;
  .avatar {
    position: absolute;
    left: 30px;
  }
  ::v-deep .el-radio__input {
    position: absolute;
    right: 5px;
    top: calc(50% - 7px);
  }
  ::v-deep .el-radio__label {
    padding: 0;
  }
}
</style>