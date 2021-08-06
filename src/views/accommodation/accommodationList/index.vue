<template>
  <div class="g-container">
    <el-container style="height: 100%;">
      <el-aside v-if="showSide" width="377px">
        <el-scrollbar style="height:100%">
          <el-tree :props="props" class="tree" highlight-current :data="buildTree" @node-click="handleChange" />
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="treeTitle">
          <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
          <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
          <span style="vertical-align: middle;">{{ FullPath }}</span>
          <span :class="showDetail?'el-icon-arrow-down':'el-icon-arrow-right'" style="font-weight: bold;position: absolute; right: 27px; top: 32px;" @click="showDetail=!showDetail"></span>
        </div>
        <div style="height: calc(100% - 52px);">
          <el-scrollbar style="height:100%">
            <div id="detail" ref="detail" :style="{height:showDetail?'auto':'0px',border:showDetail?'':'none'}">
              <el-form class="rightForm">
                <el-row :gutter="20">
                  <el-col v-for="(item,index) in viewList.CollegePeopleStatistics" :key="index" :span="8">
                    <el-form-item :label="item.CollegeName+':'"><span class="span">{{ item.Count }}个</span></el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="tabs">
              <div v-if="treeId!=''">
                <el-form class="rightForm" inline>
                  <el-form-item label="总房间:"><b>{{ viewList.RoomTotal }}个</b></el-form-item>
                  <el-form-item label="空房间:"><b>{{ viewList.EmptyRoomCount }}个</b></el-form-item>
                  <el-form-item label="总床位:"><b>{{ viewList.BedTotal }}个</b></el-form-item>
                  <el-form-item label="空床位:"><b>{{ viewList.EmptyBed }}个</b></el-form-item>
                  <el-form-item label="已入住床位:"><b>{{ viewList.CheckInCount }}个</b></el-form-item>
                </el-form>
              </div>
              <div class="tabitem">
                <div class="tabdiv"><span class="tab1"></span>空置</div>
                <div class="tabdiv"><span class="tab2"></span>已入住</div>
                <div class="tabdiv"><span class="tab3"></span>锁定</div>
                <div v-for="(item,index) in capacityList" :key="index" class="tabdiv"><span :style="{background: roomColor[item.RoomCapacity]}"></span>{{ item.RoomCapacityName }}</div>
              </div>
              <div style="margin-top: 10px;">
                <el-select v-model="attribute" style="width: 105px;" @change="showState=''">
                  <el-option v-for="(item,index) in stateCondition" :key="index" :label="item" :value="index"></el-option>
                </el-select>
                <el-select v-model="showState" placeholder="请选择显示状态">
                  <el-option label="默认显示" value=""></el-option>
                  <el-option v-for="(item,index) in changeAttribute()" :key="index" :label="item.name" :value="JSON.stringify(item)"></el-option>
                </el-select>
                <el-button type="warning" plain icon="el-icon-refresh" @click="switchView=!switchView;showState=''">{{ switchView?'房间视图':'床位视图' }}</el-button>
              </div>
            </div>
            <div class="bedView" unselectable="on" onselectstart="return false" onselect="document.selection.empty()">
              <div v-show="isshow">
                <ul id="menu1" class="menu1">
                  <li v-if="notdisabled(bedInfo,'0')" @click="checkIn">入住</li>
                  <li v-if="notdisabled(bedInfo,'1')" @click="changePlan">换宿</li>
                  <li v-if="notdisabled(bedInfo,'1')" @click="exchangePlan">互调</li>
                  <li v-if="notdisabled(bedInfo,'1')" @click="checkOut">退宿</li>
                  <li @click="historyVisible=true">床位历史信息</li>
                  <li @click="bedVisible=true">设置床位</li>
                  <li @click="UpdateBedIsLock">{{ bedInfo.IsLock==0?'锁定':'解锁' }}</li>
                  <li v-if="userInfo!=null" @click="SetDormitoryDirector">{{ userInfo.IsDormitoryDirectors==0?'设置宿舍长':'取消宿舍长' }}</li>
                </ul>
              </div>
              <template v-for="(one , index) in viewList.chilesLiveInfos">
                <floor v-if="one.chilesLiveInfos.length > 0" :key="index" :data="one" class="nocheckbox">
                  <room :data="one" :show-state="showState" :attribute="attribute" :show-room="switchView" @roomClick="roomClick" @bedClick="bedClick" @dbGetBed="dbGetBed"></room>
                </floor>
              </template>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <roomDetail v-model="showRoomDetail" :data="roomDetail" :tree-id="treeId" @getList="GetLiveInfoViewList"></roomDetail>
    <userDetail v-model="showUser" :data="bedInfo" :tree-id="treeId" @getList="GetLiveInfoViewList"></userDetail>
    <bedSetting v-model="bedVisible" :data="bedInfo" @getList="GetLiveInfoViewList"></bedSetting>
    <bedHistory v-model="historyVisible" :data="bedInfo"></bedHistory>
    <bedInfo v-model="bedinfoVisible" :data="bedInfo" @getList="GetLiveInfoViewList"></bedInfo>
  </div>
</template>
<script>
import {
  GetBeds,
  UpdateBedIsLock,
  GetRoomCapacity,
  SetDormitoryDirector
} from '@/api/Construct'
import { GetLiveInfoViewList } from '@/api/LiveInfo'
import roomDetail from './components/roomDetail'
import userDetail from './components/userDetail'
import bedSetting from './components/bedSetting'
import bedHistory from './components/bedHistory'
import room from '@/components/Building/single'
import floor from '@/components/Building/floor'
import bedInfo from './components/bedInfo'
import { notdisabled } from '@/utils/bedState'
export default {
  name: 'AccommodationList',
  components: {
    room,
    floor,
    userDetail,
    roomDetail,
    bedSetting,
    bedHistory,
    bedInfo
  },
  data() {
    return {
      switchView: true,
      showSide: true,
      loading: false,
      showDetail: false,
      formInline: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      tableColumn: [],
      currentRow: null,
      props: {
        label: 'Name',
        children: 'Childs'
      },
      FullPath: '',
      height: 330,
      viewList: {},
      treeId: '',
      historyVisible: false,
      bedinfoVisible: false,
      bedVisible: false,
      showUser: false,
      isshow: false,
      show: true,
      showRoomDetail: false,
      roomDetail: {},
      userList: [],
      bedInfo: {},
      userInfo: null,
      checkList: [],
      capacityList: [],
      showState: '',
      states: [],
      stateCondition: ['床位属性', '房间属性', '角色属性', '其他属性'],
      attribute: 0
    }
  },
  computed: {
    buildTree() {
      return this.$store.getters.buildTree
    },
    roomColor() {
      return this.$store.getters.roomColor
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
  watch: {
    showDetail(val) {
      var a = 330
      this.$nextTick(() => {
        if (val) {
          var h = document.getElementById('detail').offsetHeight
          a = 330 + h
        }
        this.height = a
      })
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4)
    this.$store.dispatch('actions/getCWYT')
    this.$store.dispatch('actions/getFJYT')
    this.$store.dispatch('actions/GetRoles')
    this.$store.dispatch('actions/GetLabels', 0)
    if (this.$route.params.construct != undefined) {
      this.treeId = this.$route.params.construct
      this.GetLiveInfoViewList()
      this.GetRoomCapacity()
    }
    this.treeId = '000000000000'
    this.GetLiveInfoViewList()
    this.GetRoomCapacity()
    this.changeAttribute(1)
  },
  methods: {
    SetDormitoryDirector() {
      SetDormitoryDirector({
        bedId: this.data.BedId,
        dormitoryDirectorId:
          this.userList[this.radio].IsDormitoryDirectors == 0
            ? this.userList[this.radio].UserId
            : null
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.GetLiveInfoViewList()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
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
    notdisabled(psn, isUser) {
      if (JSON.stringify(psn) == '{}') {
        return
      }
      return notdisabled(psn, isUser)
    },
    dbGetBed(bed) {
      this.bedInfo = bed
      this.userList = bed.UserLiveInfos
      if (this.userList.length > 0) {
        this.showUser = true
      } else {
        this.bedinfoVisible = true
      }
    },
    GetRoomCapacity() {
      GetRoomCapacity({
        ConstructNumber: this.treeId
      }).then(res => {
        this.capacityList = res.Data
      })
    },
    UpdateBedIsLock() {
      UpdateBedIsLock({
        Id: this.bedInfo.BedId,
        IsLock: this.bedInfo.IsLock == 0 ? 1 : 0
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.GetLiveInfoViewList()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    checkIn() {
      this.$router.push({
        name: 'arrangecheckIn',
        query: { BedId: this.bedInfo.BedId }
      })
    },
    checkOut() {
      this.$router.push({
        name: 'arrangecheckOut',
        query: {
          bedId: this.bedInfo.BedId,
          userId: this.userInfo.UserId,
          construct: this.treeId
        }
      })
    },
    changePlan() {
      this.$router.push({
        name: 'arrangechangePlan',
        query: {
          bedId: this.bedInfo.BedId,
          userId: this.userInfo.UserId,
          construct: this.treeId
        }
      })
    },
    exchangePlan() {
      this.$router.push({
        name: 'arrangeExchange',
        query: {
          bedId: this.bedInfo.BedId,
          userId: this.userInfo.UserId,
          construct: this.treeId
        }
      })
    },
    clickUser() {
      if (this.userList.length > 0) {
        this.showUser = true
      }
    },
    roomClick(val) {
      if (this.switchView) return
      this.roomDetail = val
      this.showRoomDetail = true
    },
    bedClick({ e, item, radio }) {
      console.log(item)
      if (radio == null) {
        this.isshow = false
        return
      }
      this.bedInfo = item
      this.userList = item.UserLiveInfos
      if (this.userList.length > 0) {
        this.userInfo = this.userList[radio]
      } else {
        this.userInfo = null
      }
      this.isshow = false
      this.isshow = true
      var menu = document.querySelector('#menu1')
      // console.log(window.innerHeight, menu.offsetHeight)
      this.$nextTick(() => {
        const maxLeft = window.innerWidth - 120
        const maxTop = window.innerHeight - menu.offsetHeight
        menu.style.left = (e.x > maxLeft ? maxLeft : e.x) + 'px'
        menu.style.top = (e.y > maxTop ? maxTop : e.y) + 'px'
      })
      document.addEventListener('click', this.foo)
    },
    foo() {
      this.isshow = false
      document.removeEventListener('click', this.foo)
    },
    handleChange(val) {
      if (val.Childs.length == 0) {
        this.treeId = val.YL
        this.formInline = {}
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
        that.FullPath = res.Data.ConstructFullPath
      })
    },
    GetBeds() {
      var that = this
      GetBeds({
        CName: '',
        CNumber: '',
        Sex: '',
        LiveType: undefined,
        LivePurpose: undefined,
        Page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        that.tableList = res.Data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-aside {
  background-color: white;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
}
#detail {
  padding: 0px 40px 0px 20px;
  border-bottom: 1px solid #f0f2f5;
  overflow: hidden;
  height: 0px;
}

.el-main {
  padding: 0 !important;
  background-color: white;
  .rightForm {
    ::v-deep .el-form-item__content {
      vertical-align: middle;
    }
  }
}
.nocheckbox {
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
.menu1 {
  width: 165px;
  position: fixed;
  width: 120px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 99999;
  padding-inline-start: 0px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  li {
    list-style: none;
    padding: 10px 5px;
    cursor: pointer;
  }
  :hover {
    background: #ecf5ff;
  }
  :last-child {
    border: none;
  }
}
::v-deep .el-divider--horizontal {
  margin: 5px 0;
}
</style>