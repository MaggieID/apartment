<template>
  <div class="g-container">
    <el-container style="height: 100%;">
      <el-aside width="350px">
        <div class="headerTitle">
          <span>页面权限组</span>
          <div class="addBtn" @click="setGround">
            <i class="el-icon-circle-plus-outline" />
            <span>新 增</span>
          </div>
        </div>
        <div style="height: calc(100% - 55px);">
          <el-scrollbar style="height:100%">
            <div class="groundLists">
              <div style="width:100%;padding:0;margin:0">
                <div v-for="(item, i) in itemList" :key="i" class="groundList" :class="activeId == item.Id ? 'active' : ''">
                  <div class="groundName" @click="selectItem(item)">
                    <i class="el-icon-user-solid" />
                    <span v-if="!item.IsInput" class="itemName">
                      {{ item.GroupName }}
                    </span>
                    <el-input v-else :ref="'groundName' + i" v-model="item.GroupName" placeholder="请输入权限名称" class="itemName" />
                  </div>
                  <div class="iconList">
                    <div v-if="!item.IsInput" style="text-align:center">
                      <i class="el-icon-edit-outline tableEdit" style="cursor: pointer;font-size:20px" @click="editName(item, i)" />
                      <i class="el-icon-delete tableDelete" style="cursor: pointer;font-size:20px;margin-left:2px" @click="DelectPermissionGroup(item.Id)" />
                    </div>
                    <div v-else style="text-align:center">
                      <i class="el-icon-circle-check tableEdit" style="cursor: pointer;font-size:20px" @click="editStateCheck(item, i)" />
                      <i class="el-icon-circle-close tableDelete" style="cursor: pointer;font-size:20px;margin-left:2px" @click="editStateClose(item, i)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-main style="padding: 0px;" class="layer-content">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="页面权限" name="1" :disabled="activeId == null">
            <div class="btnList" style="margin-bottom: 20px;">
              <el-button type="primary" :disabled="activeId == null" @click="savePermission">保存</el-button>
              <el-button type="success" :disabled="activeId == null" @click="ResetViewPermission">重置</el-button>
            </div>
            <div class="pagePermission">
              <el-scrollbar style="height:100%">
                <collapse ref="menuCollapse" :tree-data="powerTreeData" :active-item="activeItem" :props="{label:'MenuName',children:'Childs'}" />
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户维护" name="2" :disabled="activeId == null">
            <div class="ueser">
              <el-scrollbar style="height:100%">
                <user-set ref="userSet" :role="currentRole" :active-id="activeId" :active-name="activeName" :botton-power="bottonPower" @ParentGetRoleList="ParentGetRoleList" />
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  QueryViewGroup,
  AddViewGroup,
  UpdateViewGroup,
  GetMenuInfos,
  DelectPermissionGroup
} from '@/api/Permission'
import userSet from './components/userSet.vue'
import collapse from './components/collapse.vue'
export default {
  name: 'PagePermission',
  components: { userSet, collapse },
  data() {
    return {
      activeName: '1',
      activeId: null,
      itemList: [],
      addSign: false,
      currentRole: {},
      bottonPower: [],
      powerTreeData: [],
      activeItem: {}
    }
  },
  mounted() {
    this.QueryViewGroup()
    this.GetMenuInfos()
  },
  methods: {
    QueryViewGroup() {
      var that = this
      QueryViewGroup({
        AppPage: null
      }).then(res => {
        if (res.BS == 1) {
          res.Data.forEach(element => {
            element.IsInput = false
          })
          // that.activeId = null
          that.itemList = res.Data
        } else {
          that.itemList = []
        }
      })
    },
    savePermission() {
      var arr = this.$refs.menuCollapse.getSelected()
      console.log(arr, this.$refs.menuCollapse.checkList)
      var data = []
      arr.forEach(element => {
        data.push(element.Id)
      })

      this.UpdateViewGroup(
        {
          Id: this.activeId,
          GroupName: null,
          Remark: null,
          MenuIds: data,
          MenuBtnIds: this.$refs.menuCollapse.checkList,
          UserIds: null
        },
        () => {}
      )
    },
    GetMenuInfos() {
      var that = this
      GetMenuInfos({
        AppPage: null
      }).then(res => {
        that.powerTreeData = res.Data
      })
    },
    setGround() {
      if (this.itemList.length > 0) {
        if (this.itemList[this.itemList.length - 1].GroupName === '') {
          this.$message({
            message: '请完善新增项填写',
            type: 'warning'
          })
          return
        } else {
          this.itemList.push({ GroupName: '', IsInput: true })
          this.addSign = true
        }
      } else {
        this.itemList.push({ GroupName: '', IsInput: true })
        this.addSign = true
      }
    },
    // 权限名称编辑
    editName(item, index) {
      this.addSign = false
      this.itemList[index].IsInput = true
    },
    ParentGetRoleList() {},
    editStateClose(item, index) {
      if (this.addSign) {
        this.itemList.pop()
      } else {
        this.itemList[index].IsInput = false
      }
    },
    // 编辑新增确定按钮
    editStateCheck(item, index) {
      if (item.GroupName === '') {
        this.$message({
          message: '名称不能为空',
          type: 'warning'
        })
      } else {
        var that = this
        if (this.addSign) {
          AddViewGroup({
            GroupName: item.GroupName
          }).then(res => {
            if (res) {
              that.itemList[index].IsInput = false
              that.$message({
                message: '保存成功',
                type: 'success'
              })
              that.QueryViewGroup()
            }
          })
        } else {
          var data = {
            Id: item.Id,
            GroupName: item.GroupName,
            remark: '',
            menuIds: null,
            menuBtnIds: null,
            userIds: null
          }
          this.UpdateViewGroup(data, () => {
            that.itemList[index].IsInput = false
          })
        }
      }
    },
    UpdateViewGroup(data, fn) {
      UpdateViewGroup(data).then(res => {
        if (res.BS == 1) {
          fn()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.QueryViewGroup()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    DelectPermissionGroup(Id) {
      var that = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          DelectPermissionGroup({
            Id: Id
          }).then(res => {
            if (res) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.activeId = null
              that.QueryViewGroup()
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    // 重置权限
    ResetViewPermission() {},
    // 选择当前项
    selectItem(item) {
      if (item.IsInput) {
        return
      }
      this.activeId = item.Id
      this.activeItem = item
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: white;
  padding: 0 15px;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
}

.el-main {
  background-color: white;
}

.headerTitle {
  font-size: 15px;
  margin-top: 10px;
  color: #606266;
  height: 44px;
  position: relative;
  line-height: 34px;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 15px;
  .addBtn {
    position: absolute;
    cursor: pointer;
    right: 24px;
    bottom: 8px;
    &:hover {
      color: #4884ff;
    }
  }
}

.groundLists {
  font-size: 15px;
  align-items: center;
  .groundList {
    list-style: none;
    border-bottom: 1px solid #e4e7ed;
    padding: 0px 20px;
    line-height: 60px;
    display: flex;
    .groundName {
      flex: 1;
      display: flex;
      margin-right: 10px;
      i {
        line-height: 60px;
        font-size: 25px;
        min-width: 20px;
        padding-right: 10px;
      }
      .itemName {
        flex: 1;
        font-size: 14px;
        display: flex;
        align-items: center;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      cursor: pointer;
    }
    .iconList {
      width: 48px;
      display: flex;
      align-items: center;
    }
    &:hover {
      background-color: #f0f2f5;
    }
    &.active {
      background-color: #e9f0ff;
    }
  }
}
.pagePermission {
  height: calc(100vh - 305px);
}
.ueser {
  height: calc(100vh - 249px);
}
</style>
