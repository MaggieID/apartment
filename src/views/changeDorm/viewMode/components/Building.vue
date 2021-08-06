<template>
  <div>
    <div class="rightForm" style="padding:15px 40px 15px 20px;border-bottom: 1px solid #f0f2f5;">
      <el-form inline>
        <el-form-item>
          <treeselect v-model="treeId" style="width: 200px;" searchable :append-to-body="true" clearable :options="buildTree" :normalizer="normalizer" placeholder="请选择楼栋" @select="selectChange" />
        </el-form-item>
        <el-form-item>
          <slot></slot>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="treeId!=null" style="padding:15px 40px 15px 20px;border-bottom: 1px solid #f0f2f5;position: relative;">
      <el-form class="rightForm" inline>
        <el-form-item label="总房间:"><b>{{ viewList.RoomTotal }}个</b></el-form-item>
        <el-form-item label="空房间:"><b>{{ viewList.EmptyRoomCount }}个</b></el-form-item>
        <el-form-item label="总床位:"><b>{{ viewList.BedTotal }}个</b></el-form-item>
        <el-form-item label="空床位:"><b>{{ viewList.EmptyBed }}个</b></el-form-item>
        <el-form-item label="已入住床位:"><b>{{ viewList.CheckInCount }}个</b></el-form-item>
      </el-form>
      <span :class="showDetail?'el-icon-arrow-down':'el-icon-arrow-right'" style="font-weight: bold;position: absolute; right: 25px; top: 25px;" @click="showDetail=!showDetail"></span>
    </div>
    <div v-show="showDetail" style="padding:15px 40px 15px 20px;border-bottom: 1px solid #f0f2f5;">
      <el-form class="rightForm">
        <el-row :gutter="20">
          <el-col v-for="(item,index) in viewList.CollegePeopleStatistics" :key="index" :span="8">
            <el-form-item :label="item.CollegeName+':'"><span class="span">{{ item.Count }}个</span></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="tabs">
      <div style="position: absolute; right: 15px; top: 11px;">
        <el-select v-model="showState" clearable placeholder="请选择显示状态">
          <el-option v-for="(item,index) in states" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </div>
      <div class="tabitem">
        <div class="tabdiv"><span class="tab1"></span>空置</div>
        <div class="tabdiv"><span class="tab2"></span>已入住</div>
        <div class="tabdiv"><span class="tab3"></span>锁定</div>
        <div v-for="(item,index) in capacityList" :key="index" class="tabdiv"><span :style="{background: roomColor[item.RoomCapacity]}"></span>{{ item.RoomCapacityName }}</div>
      </div>
    </div>
    <div class="bedView">
      <template v-for="(one , index) in viewList.chilesLiveInfos">
        <floor v-if="one.chilesLiveInfos.length > 0" :ref="'floor'+one.Number" :key="index" :show-state="showState" :is-user="isUser" :data="one" :show-room="showRoom">
          <el-checkbox-group v-model="checkList" @change="getChange">
            <single ref="single" :data="one" :show-room="showRoom" :select="select" :is-user="isUser" :show-state="showState"></single>
          </el-checkbox-group>
        </floor>
      </template>
    </div>
  </div>
</template>
<script>
import single from './single'
import floor from './floor'
import { GetLiveInfoViewList } from '@/api/LiveInfo'
import { GetRoomCapacity } from '@/api/Construct'
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: {
    single,
    floor,
    Treeselect
  },
  props: {
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
    }
  },
  data() {
    return {
      show: true,
      roomDetail: {},
      bedInfo: {},
      showState: 0,
      checkList: [],
      viewList: {},
      showDetail: false,
      treeId: null,
      capacityList: [],
      states: [
        '默认显示',
        '显示已入住',
        '显示禁用床',
        '显示锁定床',
        '显示多人床',
        '显示行李床',
        '显示陪护床',
        '显示维修床',
        '显示8人间',
        '显示6人间',
        '显示混合房',
        '显示空调房',
        '显示风扇房'
      ]
    }
  },
  computed: {
    roomColor() {
      return this.$store.getters.roomColor
    },
    buildTree() {
      return this.$store.getters.buildTree
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4)
    this.treeId = '000000000000'
    this.GetLiveInfoViewList()
    this.GetRoomCapacity()
  },
  methods: {
    normalizer(node) {
      return {
        id: node.YL,
        label: node.Name,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    GetRoomCapacity() {
      GetRoomCapacity({
        ConstructNumber: this.treeId
      }).then(res => {
        this.capacityList = res.Data
      })
    },
    selectChange(node) {
      if (node.Childs.length == 0) {
        this.treeId = node.YL
        // this.showState = ''
        this.GetLiveInfoViewList()
        this.GetRoomCapacity()
      }
    },
    GetLiveInfoViewList() {
      var that = this
      GetLiveInfoViewList({
        Number: this.treeId
      }).then(res => {
        that.viewList = res.Data
      })
    },
    getChange(val) {
      if (!this.multiple) {
        this.checkList = [val[val.length - 1]]
      }
      this.$emit('change', this.checkList)
      console.log(this.$refs.single, this.checkList)
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix {
  zoom: 1;
}
.clearfix ::after {
  content: '';
  display: block;
  clear: both;
}
.rightForm {
  ::v-deep .el-form-item__content {
    vertical-align: middle;
  }
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