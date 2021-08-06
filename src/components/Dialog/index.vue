<template>
  <transition name="el-zoom-in-center">
    <div v-show="visible" class="dialog">
      <span class="el-dialog__headerbtn">
        <el-button type="text" class="el-dialog__close el-icon-close close" @click="close"></el-button>
      </span>
      <slot />
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang='scss'>
.dialog {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #f0f2f5;
  width: calc(100% - 30px);
  // padding-right: 30px;
  height: calc(100vh - 170px);
  z-index: 1000;
  overflow: hidden;
  font-size: 14px;
  .el-dialog__headerbtn {
    top: -5px;
    z-index: 999;
    right: 0;
  }
}
</style>
