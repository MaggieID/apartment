<template>
  <transition name="el-zoom-in-center">
    <div v-show="value" class="g-container selectBox">
      <div style="background: white;height:100%">
        <div class="treeTitle">
          <span style="font-weight: bold;vertical-align: middle;">选择人员信息</span>
          <span class="el-dialog__headerbtn">
            <el-button type="text" class="el-dialog__close el-icon-close close" @click="cancel"></el-button>
          </span>
        </div>
        <div style="height: calc(100% - 115px);">
          <el-scrollbar style="height:100%">
            <SelectUser ref="selectUser" multiple @change="changeUser"></SelectUser>
          </el-scrollbar>
        </div>
        <div class="add-footer">
          <div style="float: left;">
            <span style="color:#6A6A6A;padding-right: 15px;">已选床位数据:{{ bedList.length }}条</span>
            <span style="color:#3385FF">当前选中:人员数据{{ userList.length }}条</span>
          </div>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" :disabled="userList.length==0" @click="showInto=true">确 定</el-button>
        </div>
      </div>
      <batchInto v-model="showInto" :user-list="userList" :bed-list="bedList"></batchInto>
    </div>
  </transition>
</template>
<script>
import SelectUser from '@/components/SelectUser'
import batchInto from './batchInto'
export default {
  components: {
    SelectUser,
    batchInto
  },
  props: {
    value: Boolean,
    bedList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      userList: [],
      showInto: false
    }
  },
  mounted() {},
  methods: {
    changeUser(row) {
      this.userList = row
    },
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>