<template>
  <div class="collapse">
    <div class="collapse-title">
      <span class="collapse-name"> {{ data.Name }}</span>
      <el-form class="rightForm" inline>
        <el-form-item v-for="(item,i) in data.CollegePeopleStatistics" :key="i" :label="item.CollegeName+':'"><span class="span">{{ item.Count }}个</span></el-form-item>
      </el-form>
      <i class="el-icon-arrow-right show " :class="{'is-active':show}" @click="show=!show"></i>
    </div>
    <el-collapse-transition>
      <div v-if="show" style="flex-direction: column; justify-content: space-between;">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import { getState, getRoom, disabled } from '@/utils/bedState'
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showRoom: {
      type: Boolean,
      default: true
    },
    select: {
      type: Boolean,
      default: false
    },
    isUser: {
      type: String,
      default: '2'
    },
    showState: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: true,
      checkAll: false,
      isIndeterminate: false,
      checkList: [],
      room: false,
      checks: []
    }
  },
  methods: {
    getState(bed) {
      return getState(bed, this.showState)
    },
    getRoom(room) {
      return getRoom(room, this.showState)
    },
    disabled(psn) {
      return disabled(psn, this.isUser)
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse {
  &-title {
    min-height: 60px;
    width: 100%;
    border-top: 1px solid #f0f2f5;
    position: relative;
    display: flex;
    padding: 10px;
  }
  .show {
    position: absolute;
    top: 20px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.3s;
  }
  .is-active {
    transform: rotate(90deg);
  }
  &-name {
    font-size: 15px;
    padding-right: 20px;
    font-weight: 600;
    line-height: 39px;
    display: inline-block;
    min-width: 150px;
  }
}
.collapse:last-child {
  border-bottom: 1px solid #f0f2f5;
}
.checkbox {
  .el-checkbox {
    position: relative;
  }
  ::v-deep .el-checkbox__label {
    padding-left: 0;
  }
  ::v-deep .el-checkbox__input {
    position: absolute;
    right: 8px;
    top: 10px;
  }
}
.nocheckbox {
  font-size: 15px;
  .el-checkbox {
    position: relative;
  }
  ::v-deep .el-checkbox__label {
    padding-left: 0;
  }
  ::v-deep .el-checkbox__input {
    display: none;
  }
}
.suite {
  padding: 10px;
  margin-right: 5px;
  margin-bottom: 10px;
  background: #ecf5ff;
  position: relative;
  overflow: initial;
}
.suitename {
  text-align: center;
  color: #dcdcdc;
  font-size: 18px;
  margin: auto;
  margin-bottom: 10px;
  min-width: 120px;
}
</style>