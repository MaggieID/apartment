<template>
  <Dialog :visible="value" @close="close">
    <div style="height: 100%;">
      <div style="height: 100px;display: flex;align-items: center; ">
        <div style="flex: 1;display: flex;">
          <div>
            <div>
              <span style="font-size: 35px; font-weight: 400;">{{ roomInfo.Name }}</span>
              <div v-for="(tag,index) in roomInfo.BedLables" :key="index" class="roomTag" :style="{	background:tag.BackgroundColor ,color: tag.FontColor}">{{ tag.LabelName }}</div>
            </div>
            <div style="color: gray;">{{ roomInfo.ConstructFullPath }}</div>
            <div style="padding: 10px 0;">
              <span style="color: gray;">{{ roomInfo.RoomLivePurposeName }}</span>
              <i class="el-icon-edit" style="color: #3385FF;" title="设置房间" @click="roomVisible=true"></i>
              <i class="el-icon-picture-outline" style="color: #3385FF;" title="查看房间图片" @click="showImage=true"></i>
            </div>
          </div>
          <div v-if="RoomPlate!=null" style="margin-left: 15px;">
            <el-popover placement="right" width="280" trigger="click" popper-class="elpopover">
              <div style="margin: -12px;background: #3385FF;">
                <div ref="printhtml" class="QRcode">
                  <img :src="RoomPlate.QRCode" alt="二维码" style="width: 100%;">
                  <div class="plate">
                    <div style="font-size: 2em;font-weight: 400;">{{ roomInfo.Name }}</div>
                    <div style="font-size: 1em;">{{ roomInfo.ConstructFullPath }}</div>
                  </div>
                </div>
                <div style="text-align: center;padding: 5px 5px 10px;">
                  <el-button round size="mini" @click="toImage">下载门牌</el-button>
                  <el-button round size="mini" @click="printing">打印门牌</el-button>
                </div>
              </div>
              <img slot="reference" :src="RoomPlate.QRCode" alt="二维码" style="width: 80px;height: 80px;">
            </el-popover>
          </div>
        </div>
        <div style="width: 550px;">
          <el-form class="rightForm" inline>
            <el-form-item label="入住总人数:"><span>{{ roomInfo.CheckInCount }}个</span></el-form-item>
            <el-form-item label="已入住床位:"><span>{{ roomInfo.CheckInCount }}个</span></el-form-item>
            <el-form-item label="多人床位:"><span>{{ roomInfo.MoreUserOneBedCount }}个</span></el-form-item>
            <el-form-item label="空床位:"><span>{{ roomInfo.EmptyBed }}个</span></el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="isshow">
        <ul id="menu2" class="menu1">
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
      <el-scrollbar style="height:calc(100% - 100px);">
        <div v-for="bed in roomInfo.chilesLiveInfos" :key="bed.BedId" class="box-card el-card">
          <div class="el-card__header" style="position: relative;">
            <span><i class="iconfont iconicon3" :style="{'margin-right': '5px',color:bed.BedLiveType=='一人一床'?'#3385FF':'#E2A02E'}"></i>{{ bed.BedName }}</span>
            <el-popover placement="right" width="200" trigger="click" @show="showLabel(bed)" @hide="UpdateBedLabels">
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="item in labelList" :key="item.Id" :label="item.Id">{{ item.LabelName }}</el-checkbox>
              </el-checkbox-group>
              <i slot="reference" class="el-icon-edit" style="position: absolute; right: 15px; top: 13px;cursor: pointer;" title="设置床位标签"></i>
            </el-popover>
          </div>
          <div v-if="bed.UserLiveInfos.length==0" class="bg" @dblclick="getBed(bed)" @contextmenu.prevent="itemClick($event,bed,null)">
            <div v-if="bed.BedLivePurpose=='5'">
              <img src="./images/ph.png" alt="">
              <div style="color:#E6A23C">该床位已设置为陪护床！</div>
            </div>
            <div v-else-if="bed.BedLivePurpose=='6'">
              <img src="./images/wx.png" alt="">
              <div style="color:#22B573">该床位在建设或维修中！</div>
            </div>
            <div v-else-if="bed.BedLivePurpose=='3'">
              <img src="./images/xl.png" alt="">
              <div style="color:#B18FF7">该床位已设置为行李专用床！</div>
            </div>
            <div v-else-if="bed.BedLivePurpose=='4'">
              <img src="./images/jy.png" alt="">
              <div style="color:#ACACAC">该床位已设置为禁用床!</div>
            </div>
            <div v-else>
              <img src="./images/kc.png" alt="">
              <div style="color:#329AFE">床位空空如也，待您安排！</div>
            </div>
          </div>
          <div v-else style="height:300px" @dblclick="getBed(bed)">
            <el-scrollbar style="height:100%">
              <div v-for="(user,ui) in bed.UserLiveInfos" :key="ui" class="detail" @contextmenu.prevent="itemClick($event,bed,user)">
                <el-form class=" el-card__body">
                  <el-form-item label="姓名：">{{ user.UserName }}</el-form-item>
                  <el-form-item label="性别：">{{ user.Sex_CN }}</el-form-item>
                  <el-form-item label="编号：">{{ user.UserNumber }}</el-form-item>
                  <el-form-item label="电话：">{{ user.Phone }}</el-form-item>
                  <el-form-item label="部门：">
                    <div v-for="i in user.UserColleges" :key="i.CollegeNumber">{{ i.CollegeFullPath }}</div>
                  </el-form-item>
                  <el-form-item label="入住时间：">{{ user.CheckInTime }}</el-form-item>
                  <el-form-item label="到期时间：">{{ user.OutInTime }}</el-form-item>
                  <el-form-item label="状态：">已入住</el-form-item>
                  <el-form-item>
                    <el-tag>{{ user.IsDormitoryDirectors==0?'舍员':'宿舍长' }}</el-tag>
                  </el-form-item>
                </el-form>
              </div>
              <div style="padding: 0px 15px;">
                <el-tag v-for="tag in bed.BedLables" :key="tag.LabelId" :style="{	background:tag.BackgroundColor ,color: tag.FontColor,marginRight:'5px'}">{{ tag.LabelName }}</el-tag>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-scrollbar>
      <userDetail v-model="showUser" :data="bedInfo" :tree-id="treeId" @getList="GetRoomLiveInfo"></userDetail>
      <roomSetting v-model="roomVisible" :data="roomInfo" @getList="GetRoomLiveInfo"></roomSetting>
      <bedSetting v-model="bedVisible" :data="bedInfo" @getList="GetRoomLiveInfo"></bedSetting>
      <bedHistory v-model="historyVisible" :data="bedInfo"></bedHistory>
      <bedInfo v-model="bedinfoVisible" :data="bedInfo" @getList="GetRoomLiveInfo"></bedInfo>
      <roomImage v-model="showImage" :data="roomInfo"></roomImage>
    </div>
  </Dialog>
</template>
<script>
import {
  UpdateBedIsLock,
  UpdateBedLabels,
  GetRoomNumberPlate,
  SetDormitoryDirector
} from '@/api/Construct'
import { GetRoomLiveInfo } from '@/api/LiveInfo'
import userDetail from './userDetail'
import roomSetting from './roomSetting'
import bedSetting from './bedSetting'
import bedHistory from './bedHistory'
import bedInfo from './bedInfo'
import Dialog from '@/components/Dialog'
import { notdisabled } from '@/utils/bedState'
import roomImage from './roomImage.vue'
import printJs from '@/utils/print'
import html2canvas from 'html2canvas'
export default {
  components: {
    userDetail,
    roomSetting,
    bedSetting,
    bedHistory,
    bedInfo,
    Dialog,
    roomImage
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    treeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      historyVisible: false,
      bedVisible: false,
      roomInfo: {
        Name: ''
      },
      bedInfo: {},
      isshow: false,
      roomVisible: false,
      showUser: false,
      userList: [],
      userInfo: null,
      bedinfoVisible: false,
      showImage: false,
      checkList: [],
      RoomPlate: null
    }
  },
  computed: {
    labelList() {
      return this.$store.getters.labelList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.GetRoomLiveInfo()
        this.GetRoomNumberPlate()
      }
    }
  },
  // mounted() {
  //   this.GetRoomLiveInfo()
  //   this.GetRoomNumberPlate()
  // },
  methods: {
    SetDormitoryDirector() {
      SetDormitoryDirector({
        bedId: this.bedInfo.BedId,
        dormitoryDirectorId:
          this.userInfo.IsDormitoryDirectors == 0 ? this.userInfo.UserId : null
      }).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.$emit('getList', res.Data)
          this.GetRoomLiveInfo()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    toImage() {
      const opts = {
        useCORS: true,
        allowTaint: true,
        windowWidth: 300,
        windowHeight: 450
      }
      this.$nextTick(() => {
        html2canvas(this.$refs.printhtml, opts).then(canvas => {
          var imgData = canvas.toDataURL('image/png')
          console.log(canvas, imgData)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = imgData
          a.download = `${this.roomInfo.Name}二维码.png`
          a.click()
        })
      })
    },
    dataURLToBlob(dataurl, type) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1] || type
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    printing() {
      var div = document.createElement('div')
      var html =
        "<div class='QRcode0'>" + this.$refs.printhtml.innerHTML + '</div>'
      div.innerHTML = html
      console.log(div)
      printJs(div)
    },
    GetRoomNumberPlate() {
      GetRoomNumberPlate({
        constructNumber: this.data.Number
      }).then(res => {
        if (res.BS == 1) {
          this.RoomPlate = res.Data[0]
          console.log(res)
        } else {
          this.RoomPlate = null
        }
      })
    },
    showLabel(bed) {
      this.bedInfo = bed
      this.checkList = bed.BedLables.map(item => {
        return item.LabelId
      })
    },
    UpdateBedLabels() {
      UpdateBedLabels({
        Id: this.bedInfo.BedId,
        labelIds: this.checkList
      }).then(res => {
        if (res.BS == 1) {
          this.GetRoomLiveInfo()
          this.$emit('getList')
        }
      })
    },
    notdisabled(psn, isUser) {
      if (JSON.stringify(psn) == '{}') {
        return
      }
      return notdisabled(psn, isUser)
    },
    close() {
      this.$emit('input', false)
    },
    getBed(bed) {
      console.log(bed)
      this.bedInfo = bed
      this.userList = bed.UserLiveInfos
      if (this.userList.length > 0) {
        this.showUser = true
      } else {
        this.bedinfoVisible = true
      }
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
          this.GetRoomLiveInfo()
          this.$emit('getList')
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
    setBed(bed) {
      this.bedVisible = true
      this.bedInfo = bed
    },
    itemClick(e, bed, user) {
      this.bedInfo = bed
      this.userList = bed.UserLiveInfos
      this.userInfo = user
      this.isshow = false
      this.isshow = true
      var menu = document.querySelector('#menu2')
      this.$nextTick(() => {
        const maxLeft = window.innerWidth - menu.offsetWidth
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
    GetRoomLiveInfo() {
      var that = this
      GetRoomLiveInfo({
        Number: this.data.Number // '0000000000000000000000' //
      }).then(res => {
        that.roomInfo = res.Data
      })
    }
  }
}
</script>
<style>
.elpopover {
  border-radius: 10px;
  overflow: hidden;
}
.QRcode {
  width: 280px;
  border-radius: 10px;
  overflow: hidden;
}
.QRcode0 {
  width: 280px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgb(220, 220, 220);
}
</style>
<style lang="scss" scoped>
.plate {
  background: #3385ff !important;
  color: white !important;
  text-align: center;
  padding: 5px 5px 10px;
}
.roomTag {
  display: inline-block;
  border-radius: 30px;
  // border: #5e9fe6 1px solid;
  padding: 5px 10px;
  vertical-align: text-bottom;
  margin-left: 10px;
}
.box-card {
  margin: 5px;
  height: 350px;
  display: inline-block;
  ::v-deep .el-card__body {
    padding-top: 0 !important;
  }
}
::v-deep .el-divider--horizontal {
  margin: 5px 0;
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
.bg {
  text-align: center;
  padding-top: 30px;
  width: 250px;
  height: 300px;
}
.detail {
  position: relative;
  display: inline-block;
  width: 250px;
  .qiehuan {
    color: #e28a0e;
    position: absolute;
    right: 20px;
    top: 10px;
    z-index: 999;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
}
.detail:not(:first-child) {
  margin-left: 10px;
}
</style>