<template>
  <div style="display: flex;margin-bottom: 10px;overflow-x: auto;overflow-y: hidden;" :class="select?'checkbox':'nocheckbox'">
    <template v-if="data.chilesLiveInfos[0].StructureEnum==7">
      <div v-for="(two,indexTwo) in data.chilesLiveInfos" :key="indexTwo" class="el-card is-always-shadow suite">
        <div class="suitename">{{ two.Name }}</div>
        <div style="display: flex;">
          <template v-for="(three,indexThree) in two.chilesLiveInfos" class="rooms">
            <div v-show="getRoom(three)" :key="indexThree">
              <span class="room" :style="{background: roomColor[three.RoomCapacity]}">{{ three.Name }}</span>
              <template v-for="(psn,psnIndex) in three.chilesLiveInfos">
                <div v-show="showRoom" :key="psnIndex" class="bed">
                  <el-checkbox v-show="getState(psn)" v-if="psn.IsLock==0&&!disabled(psn.UserLiveInfos)&&select" :label="JSON.stringify(psn)">
                    <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" select class="psns" :class="getClass(psn)"></bedInfo>
                  </el-checkbox>
                  <div v-else v-show="getState(psn)" class="el-checkbox__label">
                    <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" class="psns" :class="getClass(psn)"></bedInfo>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="display: flex;">
        <template v-for="(two,indexTwo) in data.chilesLiveInfos" class="rooms">
          <div v-show="getRoom(two)" :key="indexTwo">
            <span class="room" :style="{background: roomColor[two.RoomCapacity]}">{{ two.Name }}</span>
            <template v-for="(psn,psnIndex) in two.chilesLiveInfos">
              <div v-show="showRoom" :key="psnIndex" class="bed">
                <el-checkbox v-show="getState(psn)" v-if="psn.IsLock==0&&!disabled(psn.UserLiveInfos)&&select" :label="JSON.stringify(psn)">
                  <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" select class="psns" :class="getClass(psn)"></bedInfo>
                </el-checkbox>
                <div v-else v-show="getState(psn)" class="el-checkbox__label">
                  <bedInfo :ref="'psnindex'+psn.BedId" :data="psn" class="psns" :class="getClass(psn)"></bedInfo>
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
import { getState, getRoom, disabled } from '@/utils/bedState'
export default {
  components: {
    bedInfo
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
    getState(bed) {
      return getState(bed, this.showState)
    },
    getRoom(room) {
      return getRoom(room, this.showState)
    },
    disabled(psn) {
      return disabled(psn, this.isUser)
    },
    getChange(val) {
      if (this.multiple) {
        this.checkList = val
      } else {
        this.checkList = [val[val.length - 1]]
      }
      this.$emit('change', this.checkList)
      var checkList = []
      this.checkList.forEach(element => {
        var item = JSON.parse(element)
        item.userIndex = this.$refs['psnindex' + item.BedId][0].radio
        checkList.push(item)
      })
      console.log(checkList)
    },
    getClass(bed) {
      var tab = 'tab1'
      if (bed.IsLock == 1) {
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
    itemClick(e, item) {
      var radio = this.$refs['psnindex' + item.BedId][0].radio
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