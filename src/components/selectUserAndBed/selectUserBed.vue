<template>
  <Dialog :visible="value" @close="cancel">
    <div class="g-container ">
      <el-tabs class="selectTabs g-container">
        <el-tab-pane label="从人员查询" name="0">
          <el-container style="height: 100%;">
            <el-aside v-if="showSide&&broadside" width="377px">
              <slot></slot>
            </el-aside>
            <el-main>
              <div v-if="broadside" class="treeTitle">
                <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
                <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
                <span style="font-weight: bold;vertical-align: middle;">{{ name }}</span>
              </div>
              <el-scrollbar :style="{height: 'calc(100% - '+(broadside?115:65)+'px)'}">
                <SelectUser ref="selectUser" :is-check-in="isCheckIn" @change="changeUser"></SelectUser>
              </el-scrollbar>
              <div class="add-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="submitUser">确 定</el-button>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="从床位查询" name="1">
          <el-container style="height: 100%;">
            <el-aside v-if="showSide&&broadside" width="377px">
              <slot></slot>
            </el-aside>
            <el-main>
              <div v-if="broadside" class="treeTitle">
                <i v-if="showSide" class="el-icon-s-fold side" @click="showSide=false"></i>
                <i v-if="!showSide" class="el-icon-s-unfold side" @click="showSide=true"></i>
                <span style="font-weight: bold;vertical-align: middle;">{{ name }}</span>
              </div>
              <el-scrollbar :style="{height: 'calc(100% - '+ (broadside?115:65)+'px)'}">
                <SelectBed ref="selectBed" :is-user="isUser" @change="changeBed"></SelectBed>
              </el-scrollbar>
              <div class="add-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="submitBed">确 定</el-button>
              </div>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="title" append-to-body :visible.sync="showuser" width="1000px" @before-close="showuser=false">
        <el-table :data="userList" style="width: 100%" stripe highlight-current-row @row-click="handleuser">
          <el-table-column prop="Name" align="center" label="姓名" />
          <el-table-column prop="Number" align="center" label="编码" />
          <el-table-column align="center" label="性别">
            <template slot-scope="{row}">
              <el-tag :type="row.UserSex_CN=='男性'?'':'danger'">{{ row.UserSex_CN }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Identity_CN" align="center" label="身份" />
          <el-table-column align="center" label="学院">
            <template slot-scope="{row}">
              <el-tag v-for="(tag,index) in row.UserColleges" :key="index">{{ tag }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="{row}">
              <el-tag v-for="(tag,index) in row.UserDeps" :key="index">{{ tag }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showuser=false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="title" append-to-body :visible.sync="showbed" width="1000px" @before-close="showbed=false">
        <el-table :data="liveInfo" style="width: 100%" stripe highlight-current-row @row-click="handlebed">
          <el-table-column prop="BedName" align="center" label="床位号" />
          <el-table-column prop="BedSex_CN" align="center" label="床位性别" />
          <el-table-column prop="LivePurpose_CN" align="center" label="床位用途" />
          <el-table-column prop="LiveType" align="center" label="床位类型">
            <template slot-scope="{row}">
              {{ LiveType[row.LiveType] }}
            </template>
          </el-table-column>
          <el-table-column prop="LiveState" align="center" label="床位状态">
            <template>
              已入住
            </template>
          </el-table-column>
          <el-table-column prop="BedPrice" align="center" label="床位价格" />
          <el-table-column prop="BedFullPath" min-width="200" align="center" label="楼栋途径" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showbed=false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </Dialog>
</template>
<script>
import SelectBed from '@/components/SelectBed'
import SelectUser from '@/components/SelectUser'
import { QueryUserLiveInfo } from '@/api/UserInfo'
import { GetBedUserInfos } from '@/api/Construct'
import Dialog from '@/components/Dialog'
export default {
  components: {
    SelectBed,
    SelectUser,
    Dialog
  },
  props: {
    value: Boolean,
    broadside: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    isCheckIn: {
      type: Number,
      default: null
    },
    isUser: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      activeName: '0',
      loading: false,
      bedId: null,
      userId: null,
      showbed: false,
      showuser: false,
      liveInfo: [],
      user: {},
      bed: {},
      userList: [],
      title: '',
      showSide: true
    }
  },
  computed: {
    LiveType() {
      return this.$store.getters.LiveType
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$refs.selectUser.getConditions()
        this.$refs.selectBed.getSearch()
      }
    }
  },
  mounted() {},
  methods: {
    resetFields() {
      this.bedId = null
      this.userId = null
      this.user = {}
      this.bed = {}
      this.$refs.selectUser.resetFields()
      this.$refs.selectBed.resetFields()
    },
    cancel() {
      this.showbed = false
      this.showuser = false
      this.$emit('input', false)
    },
    submitUser() {
      if (this.userId == null) {
        this.$message({
          message: '请选择人员',
          type: 'warning'
        })
        return
      }
      this.QueryUserLiveInfo()
    },
    QueryUserLiveInfo() {
      QueryUserLiveInfo({
        UserId: this.userId
      }).then(res => {
        if (res.BS == 0) {
          this.$message({
            message: '该人员没有床位',
            type: 'warning'
          })
          return
        }
        this.liveInfo = res.Data
        if (this.liveInfo.length > 1) {
          this.showbed = true
        } else {
          this.$emit('change', {
            bedId: res.Data[0].BedId,
            userId: this.userId
          })
          this.cancel()
        }
      })
    },
    handleuser(row) {
      this.user = row
      this.userId = row.CheckInUserId
    },
    changeUser(row) {
      this.user = row
      this.userId = row.Id
      this.title = row.Name + row.Number
    },
    handlebed(row) {
      this.bed = row
      this.bedId = row.BedId
    },
    submit() {
      this.$emit('change', {
        bedId: this.bedId,
        userId: this.userId
      })
      this.cancel()
    },
    GetBedUserInfos() {
      GetBedUserInfos({
        BedId: this.bedId,
        page: null
      }).then(res => {
        if (res.BS == 0) {
          this.$message({
            message: '该床位没有人员',
            type: 'warning'
          })
          return
        }
        this.userList = res.Data
        if (this.userList.length > 1) {
          this.showuser = true
        } else {
          this.$emit('change', {
            bedId: this.bedId,
            userId: res.Data[0].CheckInUserId
          })
          this.cancel()
        }
      })
    },
    submitBed() {
      if (this.bedId == null) {
        this.$message({
          message: '请选择床位',
          type: 'warning'
        })
        return
      }
      this.GetBedUserInfos()
    },
    changeBed(row) {
      console.log(row)
      if (row == null) {
        this.bed = row
        this.bedId = null
        this.title = null
      } else {
        this.bed = row
        this.bedId = row.Id
        this.title = row.ConstructFullPath
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectTabs {
  ::v-deep .el-tabs__header {
    margin: 0;
    border-radius: 5px 5px 0px 0px;
    background-color: white;
    .el-tabs__nav-wrap {
      padding: 0px 20px;
    }
    .el-tabs__nav {
      padding: 5px;
    }
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: white;
  padding: 0;
  line-height: unset;
  margin: 0;
  // border-right: 10px solid #f0f2f5;
  margin-right: 10px;
}
.el-main {
  padding: 0 !important;
  background-color: white;
}
</style>