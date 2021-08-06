<template>
  <div>
    <el-dialog title="下载模板" append-to-body :visible.sync="value" width="800px" :before-close="close">
      <div style="display: flex;">
        <el-tabs v-model="activeName" type="border-card" style="flex: 1;height: 450px;" @tab-click="handleClick">
          <el-tab-pane label="楼栋树形" name="1">
            <el-scrollbar style="height:380px">
              <el-tree ref="building" :props="props" check-strictly show-checkbox class="tree" highlight-current :data="buildTree" />
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="学院树形" name="2">
            <el-scrollbar style="height:380px">
              <el-tree ref="college" :props="props" check-strictly show-checkbox class="tree" highlight-current :data="collegeList" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div style="width: 272px; margin-left: 10px;">
          <el-card v-if="activeName=='1'" style="height: 85px;margin-bottom: 10px;">
            <div class="dowmname">入住状态</div>
            <el-checkbox-group v-model="checkState" @change="getState">
              <div class="dowmcheckbox">
                <el-checkbox label="0">未入住</el-checkbox>
              </div>
              <div class="dowmcheckbox">
                <el-checkbox label="1">已入住</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>
          <el-card style="height: 115px;">
            <div class="dowmname">性别</div>
            <el-checkbox-group v-model="checkSex" @change="getSex">
              <div v-for="item in sexList" :key="item.Code" class="dowmcheckbox">
                <el-checkbox :label="item.Code">{{ item.CName }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="downloadLoading" @click="downLoadTemplate">下载模板</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ExcelTSContractLDInfo, ExcelTSContractRYInfo } from '@/api/LiveInfo'
var fileDownload = require('js-file-download')
import { parseTime } from '@/utils'
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      props: {
        label: 'Name',
        children: 'Childs'
      },
      checkSex: [],
      checkState: [],
      activeName: '1',
      downloadLoading: false
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    },
    buildTree() {
      return this.$store.getters.buildTree
    },
    sexList() {
      return this.$store.getters.sexList
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    downLoadTemplate() {
      if (this.activeName == '1') {
        this.ExcelTSContractLDInfo()
      } else {
        this.ExcelTSContractRYInfo()
      }
    },
    ExcelTSContractRYInfo() {
      this.downloadLoading = true
      var collegeNumbers = this.$refs.college.getCheckedNodes()
      ExcelTSContractRYInfo({
        collegeNumbers: collegeNumbers.map(item => {
          return item.YL
        }),
        sex: this.checkSex.length > 0 ? this.checkSex[0] : null
      }).then(res => {
        this.downloadLoading = false
        this.close()
        fileDownload(res, '退宿模板-学院' + parseTime(new Date()) + '.xlsx')
      })
    },
    ExcelTSContractLDInfo() {
      this.downloadLoading = true
      var constructNumbers = this.$refs.building.getCheckedNodes()
      ExcelTSContractLDInfo({
        constructNumbers: constructNumbers.map(item => {
          return item.YL
        }),
        liveState: this.checkState.length > 0 ? this.checkState[0] : null,
        bedsex: this.checkSex.length > 0 ? this.checkSex[0] : null
      }).then(res => {
        this.downloadLoading = false
        this.close()
        fileDownload(res, '退宿模板-楼栋' + parseTime(new Date()) + '.xlsx')
      })
    },
    getSex(val) {
      this.checkSex = val.length > 0 ? [val[val.length - 1]] : []
    },
    getState(val) {
      this.checkState = val.length > 0 ? [val[val.length - 1]] : []
    },
    handleClick(tab, event) {
      this.checkSex = []
      this.checkState = []
    }
  }
}
</script>
<style lang="scss" scoped>
.dowmname {
  margin-bottom: 10px;
  color: #4884ff;
}
.dowmcheckbox {
  display: inline-block;
  width: 50%;
  margin: 5px 0;
}
</style>