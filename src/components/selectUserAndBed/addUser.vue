<template>
  <Dialog :visible="value" @close="cancel">
    <div class="g-container">
      <el-container style="height: 100%;">
        <el-aside v-if="showSide" width="377px">
          <div class="treeTitle">
            <span style="font-weight: bold;">床位信息</span>
          </div>
          <div style="padding: 20px;height:calc(100% - 60px)">
            <el-scrollbar style="height:100%">
              <el-form class="leftForm">
                <el-form-item label="床号："> {{ data.BedName }}</el-form-item>
                <el-form-item label="价格："> {{ data.BedPrice }} </el-form-item>
                <el-form-item label="性别："> {{ data.BedSex_CN }} </el-form-item>
                <el-form-item label="标签：">
                  <el-tag v-for="tag in data.Labels" :key="tag.LabelId" :style="{ background: tag.BackgroundColor,color: tag.FontColor}" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                </el-form-item>
                <el-form-item label="住宿类型："> {{ data.LiveType }} </el-form-item>
                <el-form-item label="住宿状态："> {{ data.LiveState }} </el-form-item>
                <el-form-item label="床位用途："> {{ data.LivePurpose_CN }} </el-form-item>
                <el-form-item label="床位路径："> {{ data.ConstructFullPath }} </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main>
          <div class="treeTitle">
            <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
            <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
            <span style="font-weight: bold;vertical-align: middle;">选择人员信息</span>
          </div>
          <div style="height: calc(100% - 115px);">
            <el-scrollbar style="height:100%">
              <SelectUser ref="selectUser" @change="change"></SelectUser>
            </el-scrollbar>
          </div>
          <div class="add-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
          </div>
        </el-main>
      </el-container>
    </div>
  </Dialog>
</template>
<script>
import SelectUser from '@/components/SelectUser'
import { QueryUserDetails } from '@/api/UserInfo'
import Dialog from '@/components/Dialog'
export default {
  components: { SelectUser, Dialog },
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
      showSide: true,
      loading: false,
      currentRow: null
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$refs.selectUser.getConditions()
      }
    }
  },
  methods: {
    resetFields() {
      this.currentRow = null
      this.$refs.selectUser.resetFields()
    },
    cancel() {
      this.$emit('input', false)
    },
    submitAdd() {
      if (this.currentRow == null) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return
      }
      QueryUserDetails({
        UserId: this.currentRow.Id
      }).then(res => {
        this.cancel()
        this.$emit('change', res.Data)
      })
    },
    change(val) {
      this.currentRow = val
    }
  }
}
</script>
<style lang="scss" scoped>
.el-aside {
  background-color: white;
  padding: 0;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
  .leftForm {
    ::v-deep .el-form-item__label {
      color: #767a7f;
    }
    .el-form-item {
      margin-bottom: 5px;
    }
  }
}

.el-main {
  padding: 0 !important;
  background-color: white;
  .add-footer {
    padding: 15px 20px;
    text-align: right;
    border-top: 1px solid #f0f2f5;
  }
  .rightForm {
    ::v-deep .el-form-item__label {
      color: #767a7f;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>