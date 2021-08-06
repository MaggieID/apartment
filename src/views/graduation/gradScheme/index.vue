<template>
  <div class="g-container">
    <el-card class="box-card">
      <el-scrollbar style="height:100%">
        <graduate ref="graduate" @change="getSelectData">
          <el-button slot="add" type="primary" :disabled="selectData.length==0" icon="el-icon-circle-plus-outline" @click="showAddBatch=true">新增计划</el-button>
        </graduate>
      </el-scrollbar>
    </el-card>
    <AddGraduateBatch v-model="showAddBatch" :select-data="selectData" @getList="getList"></AddGraduateBatch>
  </div>
</template>
<script>
import AddGraduateBatch from './components/AddGraduateBatch'
import graduate from './components/graduate'
export default {
  components: {
    AddGraduateBatch,
    graduate
  },
  data() {
    return {
      showAddBatch: false,
      selectData: []
    }
  },
  mounted() {},
  methods: {
    getSelectData(row) {
      this.selectData = row
    },
    getList() {
      this.$refs.graduate.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-d-arrow-right {
  transition: all 0.3s;
}
.up {
  transform: rotate(90deg);
}
.down {
  transform: rotate(-90deg);
}
</style>