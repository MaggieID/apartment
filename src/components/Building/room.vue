<template>
  <div v-show="getRoom(data)">
    <el-checkbox v-if="getLength()>0" v-model="checkAll" :indeterminate="isIndeterminate" @change="getLabel">
      <roomInfo :data="data" :roles="getRoomName(data)" :attribute="attribute" :show-state="showState"></roomInfo>
    </el-checkbox>
    <roomInfo v-else :data="data" :roles="getRoomName(data)" :attribute="attribute" :show-state="showState"></roomInfo>
    <el-checkbox-group v-model="checks" @change="getChange">
      <template v-for="(psn,psnIndex) in data.chilesLiveInfos">
        <div :key="psnIndex" class="bed">
          <el-checkbox v-show="getState(psn)" v-if="notdisabled(psn)" :label="JSON.stringify(psn)">
            <bedInfo :data="psn" select class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState"></bedInfo>
          </el-checkbox>
          <div v-else v-show="getState(psn)" class="el-checkbox__label">
            <bedInfo :data="psn" class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState"></bedInfo>
          </div>
        </div>
      </template>
    </el-checkbox-group>
  </div>
</template>
<script>
import { getState, getRoom, notdisabled, getRoomName } from '@/utils/bedState'
import bedInfo from './bedInfo'
import roomInfo from './roomInfo.vue'
export default {
  components: { bedInfo, roomInfo },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isUser: {
      type: String,
      default: '2'
    },
    showState: {
      type: String,
      default: ''
    },
    attribute: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      checks: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  computed: {
    roomColor() {
      return this.$store.getters.roomColor
    }
  },
  watch: {
    checkList: {
      deep: true,
      handler(val) {
        this.getNewData()
      }
    },
    showState() {
      this.getNewData()
    }
  },
  methods: {
    getRoomName(room) {
      return getRoomName(room, this.showState, this.attribute)
    },
    getNewData() {
      var newVal = []
      if (this.getRoom(this.data)) {
        var effective = this.data.chilesLiveInfos.filter(item => {
          return this.notdisabled(item) && this.getState(item)
        })
        for (let i = 0; i < effective.length; i++) {
          for (let j = 0; j < this.checkList.length; j++) {
            var item = JSON.parse(this.checkList[j])
            if (item.BedId == effective[i].BedId) {
              newVal.push(this.checkList[j])
              break
            }
          }
        }
      }
      this.getChange(newVal)
    },
    getState(bed) {
      return getState(bed, this.showState, this.attribute)
    },
    getRoom(room) {
      return getRoom(room, this.showState, this.attribute)
    },
    notdisabled(psn) {
      return notdisabled(psn, this.isUser)
    },
    getLength() {
      var effective = []
      if (this.getRoom(this.data)) {
        effective = this.data.chilesLiveInfos.filter(item => {
          return this.notdisabled(item) && this.getState(item)
        })
      }
      return effective.length
    },
    getChange(val) {
      this.checks = val
      const checkedCount = val.length
      this.checkAll = checkedCount === this.getLength()
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.getLength()
      this.$emit('change', this.checks)
    },
    getLabel(val) {
      this.checks = this.getBed(val ? this.data.chilesLiveInfos : [], [])
      this.isIndeterminate = false
      this.$emit('change', this.checks)
    },
    getBed(items, val) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].BedId != undefined) {
          if (this.notdisabled(items[i]) && this.getState(items[i])) {
            val.push(JSON.stringify(items[i]))
          }
        } else {
          if (items[i].chilesLiveInfos.length > 0) {
            this.getBed(items[i].chilesLiveInfos, val)
          }
        }
      }
      return val
    },
    getClass(bed) {
      var tab = 'tab1'
      if (bed.IsLock == 1 || bed.BedLivePurpose == 4) {
        tab = 'tab3'
      } else {
        if (bed.UserLiveInfos.length == 0) {
          tab = 'tab1'
        } else {
          tab = 'tab2'
        }
      }
      return tab
    }
  }
}
</script>