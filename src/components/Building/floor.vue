<template>
  <div class="collapse">
    <div class="collapse-title">
      <el-checkbox v-if="multiple&&select" v-model="checkAll" :indeterminate="isIndeterminate" @change="getLabel">
        <span class="collapse-name"> {{ data.Name }}</span>
      </el-checkbox>
      <span v-else class="collapse-name"> {{ data.Name }}</span>
      <el-collapse-transition>
        <div v-if="!show">
          <div class="collapse-detail">
            <span class="name">入住学院</span>
            <el-form class="rightForm" inline>
              <el-form-item v-for="(item,i) in data.CollegePeopleStatistics" :key="i" :label="item.Name+' :'"><span class="span">{{ item.Count }}个</span></el-form-item>
            </el-form>
          </div>
          <div class="collapse-detail">
            <span class="name">管理员</span>
            <el-form class="rightForm" inline>
              <el-form-item v-for="(item,i) in data.ConstructRoles" :key="i" :label="item.RoleName+' :'"><span class="span">{{ item.UserName }}</span></el-form-item>
            </el-form>
          </div>
          <div class="collapse-detail">
            <span class="name">床位情况</span>
            <el-form class="rightForm" inline>
              <el-form-item label="总床位 :"><span class="span">{{ data.BedTotal }}个</span></el-form-item>
              <el-form-item label="空床位 :"><span class="span">{{ data.EmptyBed }}个</span></el-form-item>
              <el-form-item label="已入住床位 :"><span class="span">{{ data.CheckInCount }}个</span></el-form-item>
            </el-form>
          </div>
          <div class="collapse-detail">
            <span class="name">房间情况</span>
            <el-form class="rightForm" inline>
              <el-form-item label="总房间 :"><span class="span">{{ data.RoomTotal }}个</span></el-form-item>
              <el-form-item label="空房间 :"><span class="span">{{ data.EmptyRoomCount }}个</span></el-form-item>
              <el-form-item label="全部入住房间 :"><span class="span">{{ data.FullRoomCount }}个</span></el-form-item>
              <el-form-item label="部分入住房间 :"><span class="span">{{ data.NotFullRoomCount }}个</span></el-form-item>
            </el-form>
          </div>
          <div class="collapse-detail">
            <span class="name">床位类型</span>
            <el-form class="rightForm" inline>
              <el-form-item v-for="(item,i) in data.BedPurposeTJ" v-show="item.Name!=''" :key="i" :label="item.Name+' :'"><span class="span">{{ item.Count }}个</span></el-form-item>
            </el-form>
          </div>
          <div class="collapse-detail">
            <span class="name">房间类型</span>
            <el-form class="rightForm" inline>
              <el-form-item v-for="(item,i) in data.RoomPurposeTJ" v-show="item.Name!=''" :key="i" :label="item.Name+':'"><span class="span">{{ item.Count }}个</span></el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-transition>
      <i class="el-icon-arrow-right show " :class="{'is-active':show}" @click="show=!show"></i>
    </div>
    <el-collapse-transition>
      <div v-if="show" style="flex-direction: column; justify-content: space-between;">
        <div v-if="multiple" style="display: flex;margin-bottom: 10px;overflow-x: auto;overflow-y: hidden;" :class="select?'checkbox':'nocheckbox'">
          <template v-if="data.chilesLiveInfos[0].StructureEnum==7">
            <div v-for="(two,indexTwo) in data.chilesLiveInfos" :key="indexTwo" class="el-card is-always-shadow suite">
              <div class="suitename">{{ two.Name }}</div>
              <div style="display: flex;">
                <template v-for="(three,indexThree) in two.chilesLiveInfos" class="rooms">
                  <room :key="indexThree" :ref="'room'+three.Number" :show-state="showState" :attribute="attribute" :is-user="isUser" :check-list="checkList" :data="three" @change="getList"></room>
                </template>
              </div>
            </div>
          </template>
          <template v-else>
            <div style="display: flex;padding: 10px;margin-right: 5px;margin-bottom: 10px;" class="el-card is-always-shadow">
              <template v-for="(two,indexTwo) in data.chilesLiveInfos" class="rooms">
                <room :key="indexTwo" :ref="'room'+two.Number" :show-state="showState" :attribute="attribute" :data="two" :is-user="isUser" :check-list="checkList" @change="getList"></room>
              </template>
            </div>
          </template>
        </div>
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import room from './room'
import { getState, getRoom, notdisabled } from '@/utils/bedState'
export default {
  components: {
    room
  },
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
      show: true,
      checkAll: false,
      isIndeterminate: false,
      checkList: [],
      room: false,
      checks: []
    }
  },
  watch: {
    showState() {
      this.getLabel(false)
    }
  },
  methods: {
    getList() {
      var checkList = []
      this.checkAll = true
      this.isIndeterminate = false
      for (var item in this.$refs) {
        if (item.indexOf('room') != -1) {
          checkList = checkList.concat(this.$refs[item][0].checks)
          if (!this.$refs[item][0].checkAll) {
            this.checkAll = false
            this.isIndeterminate = true
          }
        }
      }
      if (checkList.length == 0) {
        this.checkAll = false
        this.isIndeterminate = false
        return
      }
      this.checks = checkList
      this.$emit('getValue', checkList)
    },
    getLabel(val) {
      this.checkList = this.getBed(val ? this.data.chilesLiveInfos : [], [])
      this.isIndeterminate = false
      this.checks = this.checkList
      // console.log(this.checkList, 12345)
      this.$emit('getValue', this.checkList)
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
    getBed(items, val) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].StructureEnum == 8) {
          if (this.getRoom(items[i])) {
            items[i].chilesLiveInfos.forEach(element => {
              if (this.notdisabled(element) && this.getState(element)) {
                val.push(JSON.stringify(element))
              }
            })
          }
        } else {
          if (items[i].chilesLiveInfos.length > 0) {
            this.getBed(items[i].chilesLiveInfos, val)
          }
        }
      }
      return val
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
    // display: flex;
    padding: 10px;
  }
  &-detail {
    display: flex;
    .name {
      line-height: 35px;
      font-weight: bold;
      padding: 0 10px;
      display: inline-block;
      position: relative;
      flex: 0 0 85px;
    }
    .name::before {
      content: '';
      width: 3px;
      height: 15px;
      background: #3385ff;
      position: absolute;
      left: 0;
      top: 10px;
    }
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
    font-size: 18px;
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