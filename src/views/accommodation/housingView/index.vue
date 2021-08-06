<template>
  <div class="g-container">
    <el-container style="height: 100%;">
      <el-aside v-if="showSide" width="340px">
        <el-scrollbar style="height:100%">
          <el-tree :props="props" class="tree" :data="buildTree" node-key="Id" @node-click="handleCheckChange" />
        </el-scrollbar>
      </el-aside>
      <el-main>
        <div class="treeTitle">
          <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
          <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
          <span style="vertical-align: middle;">{{ FullPath }}</span>
          <div style="float: right;">
            <div style="float: right;">
              <el-select v-model="tag" placeholder="床位标签方案" style="width:200px">
                <el-option v-for="(item,index) in RoomTags" :key="index" :label="item.LabelName" :value="item.LabelId">
                </el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-plus">应用方案</el-button>
            </div>
          </div>
        </div>
        <div class="tabs">
          <div class="tabitem">
            <span :style="{border:getColor(0)+' solid'}" @click="getRooms(0)" />全入住
            <span :style="{border:getColor(1)+' solid'}" @click="getRooms(1)" />部分入住
            <span :style="{border:getColor(2)+' solid'}" @click="getRooms(2)" />空房
            <template v-for="(item,key,i) in listData.RoomTypeSum">
              <span :key="i" :style="{background:item.TypeBackColour}" />{{ item.TypeName }}
            </template>
          </div>
        </div>
        <div style="float: right;padding: 15px;">
          <el-button size="small" @click="InitRoomListView">初始化</el-button>
          <el-button v-if="!editSign" :disabled="treeValue == ''" size="small" type="primary" @click="editItems">编辑</el-button>
          <el-button v-if="editSign" :disabled="treeValue == ''" size="small" type="success" @click="saveItems">保存</el-button>
        </div>
        <div class="iconspan">
          <span>
            <img style="width: 100%;" src="@/images/11_03.jpg">
          </span>
          <span style="background: #C5CBD2;" />
          <span style="border: 1px dashed #000;" />
          <span>
            <img style="width: 100%;" src="@/images/N@2x.png">
          </span>
          <span>
            <img style="width: 125%; height: 100%;" src="@/images/zhinengxiaofangshuan.png">
          </span>
          <span>
            <img style="width: 145%; transform: rotate(-90deg);" src="@/images/icon-test.png">
          </span>
        </div>
        <div class="padding20 " style="height: calc(100% - 187px);">
          <el-scrollbar style="height:100%">
            <div>
              <div style=" text-align: center;">
                <img style="width: 23px;height: 30px;" src="@/images/N@2x.png">
              </div>
            </div>
            <div v-if="layoutHtml == ''">
              <div v-show="!editSign" id="showbox">
                <template v-for="(item, index) in list">
                  <div v-if="item.StructureTag != 7" :key="index" class="liuceng" :style="{ position: 'absolute', left: item.X + 'px', top: item.Y + 'px' }">
                    {{ item.Name }}
                  </div>
                  <div v-else :key="index" :style="{ position: 'absolute', left: item.X + 'px', top: item.Y + 'px' }">
                    <div v-show="showNum == -1||showNum == item.RoomState" class="roomup rooms" :style="{'border-top': '6px solid'+getColor(item.RoomState),background: item.RoomType.TypeBackColour,color: item.RoomType.TypeFontColour}">
                      <span class="door" />
                      {{ item.Name }}
                    </div>
                  </div>
                </template>
              </div>
              <roomLayout v-show="editSign" :edit-sign="editSign" :list="list" @rightClick="rightClick" />
            </div>
            <div v-else v-html="layoutHtml"></div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import roomLayout from './components/roomLayout'
// import { InitRoomListView, SaveRoomListView, GetRoomListView } from '@/api/Room'
export default {
  components: {
    roomLayout
  },
  data() {
    return {
      RoomTags: [],
      tag: '',
      props: {
        label: 'Name',
        children: 'Childs'
      },
      editSign: false,
      list: [],
      treeValue: '',
      layoutHtml: '',
      initRoom: false,
      FullPath: '',
      showSide: true,
      listData: {},
      showNum: -1,
      showItem: true
    }
  },
  computed: {
    buildTree() {
      return this.$store.getters.buildTree
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBuilding', 4).then(res => {
      this.FullPath = res.Data.FullPath
    })
  },
  methods: {
    getColor(item) {
      var color = ''
      switch (item) {
        case -1:
          color = '#C5CBD2'
          break
        case 0:
          color = '#00728d'
          break
        case 1:
          color = '#80b0b2'
          break
        case 2:
          color = '#b6cdb1'
          break
      }
      return color
    },
    getRooms(num) {
      if (this.showItem) {
        this.showNum = num
      } else {
        this.showNum = -1
      }
      this.showItem = !this.showItem
    },
    InitRoomListView() {
      // var that = this
      // InitRoomListView({
      //   id: this.treeValue
      // }).then(res => {
      //   that.layoutHtml = res.Data
      //   that.$nextTick(() => {
      //     /* eslint-disable */
      //     console.log($('.drag'))
      //     var list = []
      //     for (let index = 0; index < $('.liuceng').length; index++) {
      //       var liuceng = {
      //         x: $('.liuceng')[index].offsetLeft,
      //         y: $('.liuceng')[index].offsetTop,
      //         constructId: $('.liuceng')[index].id
      //       }
      //       list.push(liuceng)
      //     }
      //     for (var i = 0; i < $('.drag').length; i++) {
      //       list.push({
      //         x: $('.drag').eq(i)[0].offsetLeft,
      //         y: $('.drag').eq(i)[0].offsetTop,
      //         constructId: $('.drag').eq(i)[0].lastChild.id
      //       })
      //     }
      //     this.SaveRoomListView(list)
      //   })
      // })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return this.GetContextTree('-1', resolve)
      } else if (node.data.Tag >= 3) {
        return resolve([])
      } else {
        return this.GetContextTree(node.data.Id, resolve)
      }
    },
    GetRoomListView() {
      // var that = this
      // if (this.treeValue == '') return
      // GetRoomListView({
      //   id: this.treeValue
      // }).then(res => {
      //   that.list = res.Data.Data
      //   that.listData = res.Data
      //   that.layoutHtml = ''
      // })
    },
    handleCheckChange(node) {
      this.FullPath = node.Tag2
      if (node.Tag == 5 || node.Tag == 3) {
        this.treeValue = node.Id
        this.GetRoomListView()
      } else {
        this.treeValue = ''
        this.editSign = false
      }
    },
    tabClick() {
      this.broadside = !this.broadside
    },
    rightClick() {},
    saveItems() {
      console.log(this.list)
      var list = []
      this.list.forEach(element => {
        list.push({
          x: element.X,
          y: element.Y,
          constructId: element.Id
        })
      })
      this.SaveRoomListView(list)
    },
    editItems() {
      this.editSign = true
    },
    SaveRoomListView(list) {
      // var that = this
      // SaveRoomListView({
      //   constructFatherId: this.treeValue,
      //   list: list
      // }).then(res => {
      //   if (res) {
      //     that.editSign = false
      //     that.$message({
      //       message: '保存成功',
      //       type: 'success'
      //     })
      //     that.GetRoomListView()
      //   }
      // })
    }
  }
}
</script>
<style>
.upload-demo {
  display: inline-block;
}
</style>
<style lang="scss">
.el-aside {
  background-color: white;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
}
.el-main {
  padding: 0 !important;
  background-color: white;
}
#roomBox {
  display: flex;
  .rooms {
    height: 52px;
    width: 40px;
    background: #80c687;
    margin: 0 2px;
    text-align: center;
    cursor: pointer;
    border-top: 6px solid #00728d;
  }
  .drag {
    position: static;
  }
}
.liuceng {
  width: 75px;
  color: #949494;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding: 0 20px;
}
.floor {
  display: flex;
  margin-bottom: 25px;
}
#showbox {
  width: 100%;
  height: 100vh;
  position: relative;
  .rooms {
    height: 52px;
    width: 40px;
    // line-height: 50px;
    background: #80c687;
    margin: 0 2px;
    text-align: center;
    cursor: pointer;
  }
  .door {
    position: absolute;
    display: inline-block;
    // background: white;
    width: 9px;
    height: 8px;
    left: 0;
    right: 0;
    margin: auto;
  }
  .roomup {
    border-top: 6px solid #00728d;
  }
}
// .selected {
//   border: 1px red solid;
// }
.drag {
  position: absolute;
}
.roomup .door {
  border-radius: 0px 8px 0px 0px;
  bottom: 0;
}

.roomdown .door {
  border-radius: 0px 0px 0px 8px;
}
.roomdown {
  border-bottom: 6px solid #b6cdb1;
}
.zoulang {
  height: 58px;
  line-height: 58px;
  border: 1px dashed #000;
  margin: 0 2px;
  text-align: center;
  position: relative;
}
.xiaofang {
  position: absolute;
  height: 15px;
  line-height: 15px;
  img {
    width: 15px;
    height: 15px;
    margin-left: 201px;
    cursor: pointer;
  }
}

.iconspan {
  padding: 15px;
  span {
    display: inline-block;
    width: 23px;
    height: 33px;
    margin-right: 20px;
  }
}
</style>
