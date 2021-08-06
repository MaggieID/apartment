<template>
  <div class="g-container">
    <el-tabs v-model="activeName" type="border-card" style="height:100%" @tab-click="tabClick">
      <el-tab-pane label="从人员安排" name="1">
        <el-scrollbar style="height:100%">
          <SelectUser ref="selectUser" multiple @change="changeUser"></SelectUser>
        </el-scrollbar>
        <div style="padding:15px 20px 0;">
          <el-button type="primary" :disabled="userList.length==0" @click="showBed=true">新增入住</el-button>
          <span style="padding-left: 20px;color: #4884ff;">当前选中 : 人员数据 {{ userList.length }} 条</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="从床位安排" name="2">
        <el-scrollbar style="height:100%">
          <SelectBed ref="selectBed" multiple is-user="2" @change="changeBed"></SelectBed>
        </el-scrollbar>
        <div style="padding:15px 20px 0;">
          <el-button type="primary" :disabled="bedList.length==0" @click="showUser=true">新增入住</el-button>
          <span style="padding-left: 20px;color: #4884ff;">当前选中 : 床位数据 {{ bedList.length }} 条</span>
        </div>
      </el-tab-pane>
    </el-tabs>
    <SelectUserDialog v-model="showUser" :bed-list="bedList"></SelectUserDialog>
    <SelecttBedDialog v-model="showBed" :user-list="userList"></SelecttBedDialog>
  </div>
</template>
<script>
import SelectBed from '@/components/SelectBed'
import SelectUser from '@/components/SelectUser'
import SelecttBedDialog from './components/selectBed'
import SelectUserDialog from './components/selectUser'

export default {
  components: { SelectBed, SelectUser, SelectUserDialog, SelecttBedDialog },
  data() {
    return {
      activeName: '1',
      showUser: false,
      showBed: false,
      userList: [],
      bedList: []
    }
  },
  methods: {
    changeUser(row) {
      console.log(row)
      this.userList = row
    },
    changeBed(row) {
      console.log(row)
      this.bedList = row == null ? [] : row
    },
    tabClick() {}
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content {
  height: calc(100% - 40px);
  padding: 0;
  .el-tab-pane {
    height: calc(100% - 60px);
  }
}
</style>