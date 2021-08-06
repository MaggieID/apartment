<template>
  <div style="display: flex;margin-bottom: 10px;overflow-x: auto;overflow-y: hidden;" :class="select?'checkbox':'nocheckbox'">
    <template v-if="data.chilesLiveInfos[0].StructureEnum==7">
      <div v-for="(two,indexTwo) in data.chilesLiveInfos" :key="indexTwo" class="el-card is-always-shadow suite">
        <div class="suitename">{{ two.Name }}</div>
        <div style="display: flex;">
          <template v-for="(three,indexThree) in two.chilesLiveInfos" class="rooms">
            <div v-show="getRoom(three)" :key="indexThree">
              <roomInfo :data="three" :roles="getRoomName(three)" :attribute="attribute" :show-state="showState" @roomClick="roomClick"></roomInfo>
              <template v-for="(psn,psnIndex) in three.chilesLiveInfos">
                <div v-show="showRoom" :key="psnIndex" class="bed" @dblclick="getBedinfo(psn)" @contextmenu.prevent="itemClick($event,psn,psnIndex)">
                  <el-checkbox v-show="getState(psn)" v-if="notdisabled(psn)&&select" :label="JSON.stringify(psn)">
                    <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" select class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState" @userClick="userClick"></bedInfo>
                  </el-checkbox>
                  <div v-else v-show="getState(psn)" class="el-checkbox__label">
                    <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState" @userClick="userClick"></bedInfo>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="display: flex;margin-bottom: 10px;">
        <template v-for="(two,indexTwo) in data.chilesLiveInfos" class="rooms">
          <div v-show="getRoom(two)" :key="indexTwo" style="padding: 10px;margin-right: 5px;" class="el-card is-always-shadow">
            <roomInfo :data="two" :roles="getRoomName(two)" :attribute="attribute" :show-state="showState" @roomClick="roomClick"></roomInfo>
            <template v-for="(psn,psnIndex) in two.chilesLiveInfos">
              <div v-show="showRoom" :key="psnIndex" class="bed" @dblclick="getBedinfo(psn)" @contextmenu.prevent="itemClick($event,psn)">
                <el-checkbox v-show="getState(psn)" v-if="notdisabled(psn)&&select" :label="JSON.stringify(psn)">
                  <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" select class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState" @userClick="userClick"></bedInfo>
                </el-checkbox>
                <div v-else v-show="getState(psn)" class="el-checkbox__label">
                  <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" class="psns" :class="getClass(psn)" :attribute="attribute" :show-state="showState" @userClick="userClick"></bedInfo>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import bedInfo from './bedInfo'
import roomInfo from './roomInfo.vue'
import { getState, getRoom, notdisabled, getRoomName } from '@/utils/bedState'
export default {
  components: {
    bedInfo,
    roomInfo
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showRoom: {
      type: Boolean,
      default: true
    },
    select: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
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
    return {}
  },
  computed: {
    roomColor() {
      return this.$store.getters.roomColor
    }
  },
  methods: {
    getRoomName(room) {
      return getRoomName(room, this.showState, this.attribute)
    },
    getBedinfo(bed) {
      this.$emit('dbGetBed', bed)
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
    getChange(val) {
      if (this.multiple) {
        this.checkList = val
      } else {
        this.checkList = val.length > 0 ? [val[val.length - 1]] : []
      }
      this.$emit('change', this.checkList)
      console.log(this.checkList)
    },
    getLabel(val) {
      this.$emit('getFloor', val ? this.data.chilesLiveInfos : [])
      this.checkList = this.getBed(val ? this.data.chilesLiveInfos : [], [])
      this.isIndeterminate = false
    },
    getBed(items, val) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].BedId != undefined) {
          if (items[i].IsLock == 0) {
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
    },
    roomClick(room) {
      this.$emit('roomClick', room)
    },
    userClick({ e, item, radio }) {
      this.$emit('bedClick', { e, item, radio })
    },
    itemClick(e, item) {
      // console.log(this.$refs['psnindex' + item.BedId])
      var radio = 0
      if (item.BedLiveType == '多人一床') {
        radio = null
        this.$refs['psnindex' + item.BedId][0].visible = true
        this.$emit('bedClick', { e, item, radio })
        return
      }
      this.$emit('bedClick', { e, item, radio })
    }
  }
}
</script>
<style lang="scss" scoped>
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