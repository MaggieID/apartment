<template>
  <transition name="fade">
    <div v-show="value" class="dialog">
      <div class="dialog-title">
        <div>{{ title }}</div>
        <i class="el-icon-close" @click="closeDialog"></i>
      </div>
      <div class="dialog-content">
        <slot />
      </div>
      <div class="dialog-foot">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="closeDialog">确认</el-button>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: Boolean
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 5px;
  left: 5px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  background: white;
  border-radius: 5px;
  z-index: 999;
  border: 1px solid gainsboro;
  box-shadow: 0 2px 12px 0 #0000005c;
  &-title {
    border-bottom: 1px solid gainsboro;
    padding: 15px;
    line-height: 20px;
    position: relative;
    i {
      position: absolute;
      top: 13px;
      right: 15px;
      font-size: 25px;
      cursor: pointer;
    }
  }
  &-content {
    padding: 15px;
    height: calc(100% - 120px);
  }
  &-foot {
    padding: 10px 30px;
    text-align: right;
  }
}
</style>
