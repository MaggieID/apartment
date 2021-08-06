<template>
  <Dialog :visible="value" @close="cancel">
    <div class="g-container">
      <el-container style="height: 100%;">
        <el-aside v-if="showSide" width="377px">
          <div class="treeTitle">
            <span style="font-weight: bold;">人员信息</span>
          </div>
          <div style="padding: 20px;height:calc(100% - 60px)">
            <el-scrollbar style="height:100%">
              <userInfo :data="data" vertical></userInfo>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main>
          <div class="treeTitle">
            <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
            <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
            <span style="font-weight: bold;vertical-align: middle;">选择床位信息</span>
          </div>
          <div style="height: calc(100% - 115px);">
            <el-scrollbar style="height:100%">
              <SelectBed ref="selectBed" :is-user="isUser" @change="change"></SelectBed>
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
import SelectBed from '@/components/SelectBed'
import { GetBeds } from '@/api/Construct'
import userInfo from '@/components/UserInfo'
import Dialog from '@/components/Dialog'
export default {
  components: { SelectBed, userInfo, Dialog },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isUser: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      showSide: true,
      loading: false,
      bedId: null
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$refs.selectBed.getSearch()
      }
    }
  },
  methods: {
    resetFields() {
      this.bedId = null
      this.$refs.selectBed.resetFields()
    },
    cancel() {
      this.$emit('input', false)
    },
    submitAdd() {
      if (this.bedId == null) {
        this.$message({
          message: '请选择床位',
          type: 'warning'
        })
        return
      }
      GetBeds({
        Id: this.bedId,
        Page: null
      }).then(res => {
        this.cancel()
        this.$emit('change', res.Data[0])
      })
    },
    change(row) {
      if (row == null) {
        this.bedId = null
      } else {
        this.bedId = row.Id
      }
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
  .close {
    font-size: 25px;
    vertical-align: middle;
  }
  .rightForm {
    ::v-deep .el-form-item__label {
      color: #767a7f;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    b {
      color: #f56c6c;
      padding-right: 15px;
    }
    span {
      color: #3385ff;
    }
  }
}
</style>