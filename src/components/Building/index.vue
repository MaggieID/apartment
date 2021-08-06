<template>
  <div>
    <div class="rightForm" style="padding:15px 40px 15px 20px;border-bottom: 1px solid #f0f2f5;">
      <el-form inline>
        <el-form-item>
          <treeselect v-model="treeId" style="width: 200px;" searchable :append-to-body="append" clearable :options="buildTree" :normalizer="normalizer" placeholder="请选择楼栋" @select="selectChange" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="attribute" style="width: 105px;" @change="showState=''">
            <el-option v-for="(item,index) in stateCondition" :key="index" :label="item" :value="index"></el-option>
          </el-select>
          <el-select v-model="showState" placeholder="请选择显示状态">
            <el-option label="默认显示" value=""></el-option>
            <el-option v-for="(item,index) in changeAttribute()" :key="index" :label="item.name" :value="JSON.stringify(item)"></el-option>
          </el-select>
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
      <div class="tabitem">
        <div class="tabdiv"><span class="tab1"></span>空置</div>
        <div class="tabdiv"><span class="tab2"></span>已入住</div>
        <div class="tabdiv"><span class="tab3"></span>锁定/禁用</div>
        <div v-for="(item,index) in capacityList" :key="index" class="tabdiv"><span :style="{background: roomColor[item.RoomCapacity]}"></span>{{ item.RoomCapacityName }}</div>
      </div>
    </div>
    <div class="bedView">
      <template v-for="(one , index) in viewList.chilesLiveInfos">
        <floor v-if="one.chilesLiveInfos.length > 0" :ref="'floor'+one.Number" :key="index" :attribute="attribute" :show-state="showState" :is-user="isUser" :data="one" :show-room="showRoom" :select="select" :multiple="multiple" @getValue="getValue">
          <el-checkbox-group v-if="!multiple" v-model="checkList" @change="getChange">
            <single :data="one" :show-room="showRoom" :select="select" :is-user="isUser" :attribute="attribute" :show-state="showState"></single>
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
    height: {
      type: Number,
      default: 330
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
    append: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true,
      roomDetail: {},
      bedInfo: {},
      showState: '',
      checkList: [],
      viewList: {},
      showDetail: false,
      treeId: null,
      capacityList: [],
      stateCondition: ['床位属性', '房间属性', '角色属性', '其他属性'],
      attribute: 0
    }
  },
  computed: {
    roomColor() {
      return this.$store.getters.roomColor
    },
    buildTree() {
      return this.$store.getters.buildTree
    },
    FJYTList() {
      return this.$store.getters.FJYTList
    },
    CWYTList() {
      return this.$store.getters.CWYTList
    },
    RoleList() {
      return this.$store.getters.RoleList
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4)
    this.$store.dispatch('actions/getCWYT')
    this.$store.dispatch('actions/getFJYT')
    this.$store.dispatch('actions/GetRoles')
    this.treeId = '000000000000'
    this.GetLiveInfoViewList()
  },
  methods: {
    changeAttribute() {
      var states = []
      switch (this.attribute) {
        case 0: {
          states.push({
            name: '显示空置床',
            value: '未入住',
            field: 'BedLiveState'
          })
          states.push({
            name: '显示锁定床',
            value: 1,
            field: 'IsLock'
          })
          states.push({
            name: '显示多人床',
            value: '多人一床',
            field: 'BedLiveType'
          })
          this.CWYTList.forEach(item => {
            states.push({
              name: '显示' + item.CName,
              value: item.Code,
              field: 'BedLivePurpose'
            })
          })
          break
        }
        case 1: {
          this.capacityList.forEach(item => {
            states.push({
              name: `显示${item.RoomCapacityName}`,
              value: item.RoomCapacity,
              field: 'RoomCapacity'
            })
          })
          this.FJYTList.forEach(item => {
            states.push({
              name: `显示${item.CName}`,
              value: item.Code,
              field: 'RoomLivePurpose'
            })
          })
          break
        }
        case 2: {
          this.RoleList.forEach(item => {
            states.push({
              name: `显示${item.RoleName}`,
              value: item.Id,
              field: 'ConstructRoles'
            })
          })
          break
        }
        case 3: {
          states.push({
            name: '显示班级',
            field: 'BJName'
          })
          states.push({
            name: '显示年级',
            field: 'NJName'
          })
          states.push({
            name: '显示学院',
            field: 'XYName'
          })
          break
        }
        default: {
          break
        }
      }
      return states
    },
    resetFields() {
      this.treeId = null
      if (this.multiple) {
        for (var item in this.$refs) {
          if (item.indexOf('floor') != -1) {
            this.$refs[item][0].getLabel(false)
          }
        }
      } else {
        this.checkList = []
      }
      this.$emit('change', [])
    },
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
        this.GetLiveInfoViewList()
      }
    },
    GetLiveInfoViewList() {
      if (this.treeId == null) {
        this.viewList = {}
        return
      }
      var that = this
      GetLiveInfoViewList({
        Number: this.treeId
      }).then(res => {
        that.viewList = res.Data
        this.GetRoomCapacity()
      })
    },
    getValue() {
      var checkList = []
      for (var item in this.$refs) {
        if (item.indexOf('floor') != -1) {
          checkList = checkList.concat(this.$refs[item][0].checks)
        }
      }
      // console.log(checkList)
      this.$emit('change', checkList)
    },
    getChange(val) {
      if (!this.multiple) {
        this.checkList = [val[val.length - 1]]
      }
      this.$emit('change', this.checkList)
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