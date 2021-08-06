<template>
  <div class="g-container selectBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button v-if="!select" type="primary" icon="el-icon-edit" @click="select=true">编辑</el-button>
        <el-button v-if="select" type="success" icon="fa fa-save" @click="resetFields">保存</el-button>
        <el-button v-if="select" type="warning" icon="el-icon-refresh-left">初始化</el-button>
      </div>
      <el-scrollbar :style="{height:select? 'calc(100% - 60px)':'100%'}">
        <building ref="building" multiple :select="select"></building>
      </el-scrollbar>
      <div v-if="select" class="add-footer" style="position: relative;">
        <span style=" position: absolute; left: 20px; top: 20px; color: red;">*请勾选换宿或互调的住宿</span>
        <el-button>取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
      </div>
    </el-card>
    <changeBed v-model="showChange" :check-list="checkList"></changeBed>
    <exchangeBed v-model="showExchange" :check-list="checkList"></exchangeBed>
  </div>
</template>
<script>
import Building from './components/Building'
import changeBed from './components/changeBed'
import exchangeBed from './components/exchangeBed'
export default {
  components: { Building, changeBed, exchangeBed },
  data() {
    return {
      loading: false,
      showDetail: false,
      formInline: {},
      viewList: {},
      treeId: null,
      select: true,
      showChange: false,
      checkList: [],
      showExchange: false
    }
  },
  mounted() {},
  methods: {
    resetFields() {
      this.$refs.building.checkList = []
      this.select = false
    },
    submitAdd() {
      var checkList = this.$refs.building.checkList
      console.log(checkList)
      if (checkList.length > 2 || checkList.length == 0) {
        this.$message({
          message: '请选择两个互调或换宿的床位',
          type: 'warning'
        })
        return
      }
      var psn = 0
      for (let index = 0; index < checkList.length; index++) {
        const element = JSON.parse(checkList[index])
        console.log(element)
        if (element.UserLiveInfos.length == 0) {
          psn++
        }
      }
      if (psn == 2) {
        this.$message({
          message: '您选择了两个空床',
          type: 'warning'
        })
        return
      }
      if (psn == 1) {
        this.showChange = true
      } else {
        this.showExchange = true
      }
      this.checkList = checkList
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  padding: 0;
  height: calc(100% - 55px);
}
.rightForm {
  ::v-deep .el-form-item__label {
    color: #767a7f;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  b {
    color: #f56c6c;
    padding-right: 15px;
  }
  .span {
    color: #3385ff;
  }
}
.add-footer {
  padding: 15px 20px;
  text-align: right;
  border-top: 1px solid #f0f2f5;
}
</style>