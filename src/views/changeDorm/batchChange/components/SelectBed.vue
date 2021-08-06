<template>
  <transition name="el-zoom-in-center">
    <div v-show="value" class="g-container selectBox">
      <div style="background: white;height: 100%;">
        <div class="treeTitle">
          <span style="font-weight: bold;vertical-align: middle;">选择床位信息</span>
          <span slot="close" class="el-dialog__headerbtn">
            <el-button type="text" class="el-dialog__close el-icon-close close" @click="cancel"></el-button>
          </span>
        </div>
        <div style="height: calc(100% - 115px);">
          <el-scrollbar style="height:100%">
            <SelectBed ref="selectBed" multiple :is-user="isUser" @change="change"></SelectBed>
          </el-scrollbar>
        </div>
        <div class="add-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import SelectBed from '@/components/SelectBed'
export default {
  components: { SelectBed },
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
      loading: false,
      beds: []
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
      if (this.beds.length == 0) {
        this.$message({
          message: '请选择床位',
          type: 'warning'
        })
        return
      }
      this.cancel()
      this.$emit('change', this.beds)
    },
    change(row) {
      console.log(row)
      this.beds = row
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