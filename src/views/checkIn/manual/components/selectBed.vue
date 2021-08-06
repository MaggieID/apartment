<template>
  <transition name="el-zoom-in-center">
    <div v-show="value" class="g-container selectBox">
      <div style="background: white;height:100%">
        <div class="treeTitle">
          <span style="font-weight: bold;vertical-align: middle;">选择床位信息</span>
          <span class="el-dialog__headerbtn">
            <el-button type="text" class="el-dialog__close el-icon-close close" @click="cancel"></el-button>
          </span>
        </div>
        <div style="height: calc(100% - 115px);">
          <el-scrollbar style="height:100%">
            <SelectBed ref="selectBed" multiple is-user="2" @change="changeBed"></SelectBed>
          </el-scrollbar>
        </div>
        <div class="add-footer">
          <div style="float: left;">
            <span style="color:#6A6A6A;padding-right: 15px;">已选人员数据:{{ userList.length }}条</span>
            <span style="color:#3385FF">当前选中:床位数据:{{ bedList.length }}条</span>
          </div>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" :disabled="bedList.length==0" @click="showInto=true">确 定</el-button>
        </div>
      </div>
      <batchInto v-model="showInto" :user-list="userList" :bed-list="bedList"></batchInto>
    </div>
  </transition>
</template>
<script>
import SelectBed from '@/components/SelectBed'
import batchInto from './batchInto'
export default {
  components: {
    SelectBed,
    batchInto
  },
  props: {
    value: Boolean,
    userList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      bedList: [],
      showInto: false
    }
  },
  mounted() {},
  methods: {
    changeBed(row) {
      this.bedList = row == null ? [] : row
    },
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.leftForm {
  ::v-deep .el-form-item__label {
    color: #767a7f;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
}

.close {
  font-size: 25px;
  vertical-align: middle;
}
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
</style>