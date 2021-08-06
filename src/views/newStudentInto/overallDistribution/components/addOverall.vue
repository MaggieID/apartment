<template>
  <div>
    <Dialog :visible="value" @close="close">
      <div class="titleDialog">创建统筹</div>
      <div style="display: flex;flex-flow: column;height: calc(100% - 35px);">
        <div style="display: flex;flex: 1;" class="topCard">
          <el-card style="flex: 1; margin-right: 5px;">
            <div slot="header">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showAddUser=true">入住新生</el-button>
            </div>
            <el-form style="height: 116px;">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="已选学生：">{{ userData.selectData.length }} </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="男生数量："> {{ userData.boyList.length }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="女生数量：">{{ userData.girlList.length }} </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="checkBox">
              <div class="checkTitle">已选学院范围
                <a style="float: right; font-weight: 400; color: #4884ff; text-decoration: underline;" @click="showUser=true">人员明细</a>
              </div>
              <div class="checks">
                <el-tag v-for="(item ,index) in userData.xy" :key="index" class="tag">{{ item }}</el-tag>
              </div>
            </div>
          </el-card>
          <el-card style="flex: 1; margin-left: 5px;">
            <div slot="header">
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="showAddBed=true">入住床位</el-button>
            </div>
            <el-form>
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="已选房间：">{{ bedData.allRooms.length }} </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="混合房间数："> {{ bedData.mixRooms.length }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="男生房间数：">{{ bedData.boyRooms.length }} </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="女生房间数："> {{ bedData.girlRooms.length }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="已选床位：">{{ bedData.selectData.length }} </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="混合床位数：">{{ bedData.mixBeds.length }} </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="男生床位数：">{{ bedData.boyBeds.length }} </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="女生床位数：">{{ bedData.girlBeds.length }} </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="checkBox">
              <div class="checkTitle">已选楼栋范围
                <a style="float: right; font-weight: 400; color: #4884ff; text-decoration: underline;" @click="showBed=true">床位明细</a>
              </div>
              <div class="checks">
                <el-tag v-for="(item ,index) in bedData.ld" :key="index" class="tag">{{ item }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>
        <el-card class="bottomCard">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="统筹名称：" prop="EstimatedStartTime">
              <el-input v-model="form.Price" style="width:350px" />
            </el-form-item>
            <el-form-item label="时间范围：" prop="EstimatedEndTime">
              <el-date-picker v-model="form.EstimatedEndTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="负责人：" prop="Price">
              <el-select v-model="form.Price" placeholder="请选择" style="width:350px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="Remark">
              <el-input v-model="form.Remark" type="textarea" style="width:350px" placeholder="请输入内容" />
            </el-form-item>
          </el-form>
          <div style="position: absolute; bottom: 15px; right: 20px;">
            <el-button @click="close">取消</el-button>
            <el-button type="primary">创建</el-button>
          </div>
        </el-card>
      </div>
    </Dialog>
    <userAddOverall v-model="showUser"></userAddOverall>
    <bedAddOverall v-model="showBed"></bedAddOverall>
    <addUser v-model="showAddUser"></addUser>
    <addBed v-model="showAddBed"></addBed>
  </div>
</template>
<script>
import Dialog from '@/components/Dialog'
import userAddOverall from '@/components/newStudent/userAddOverall'
import bedAddOverall from '@/components/newStudent/bedAddOverall'
import addUser from '@/components/newStudent/addUser.vue'
import addBed from '@/components/newStudent/addBed.vue'
export default {
  components: { Dialog, userAddOverall, bedAddOverall, addUser, addBed },
  props: {
    value: Boolean
  },
  data() {
    return {
      bedData: {
        selectData: [],
        boyBeds: [],
        girlBeds: [],
        mixBeds: [],
        boyRooms: [],
        girlRooms: [],
        mixRooms: [],
        allRooms: [],
        ld: []
      },
      userData: {
        selectData: [],
        boyList: [],
        girlList: [],
        xy: []
      },
      form: {},
      rules: {},
      options: [],
      showUser: false,
      showBed: false,
      showAddUser: false,
      showAddBed: false
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.checkBox {
  height: calc(100% - 116px);
  .checkTitle {
    font-weight: bold;
  }
  .checks {
    background: #f5f7fa;
    margin-top: 10px;
    border-radius: 10px;
    height: calc(100% - 75px);
    padding: 15px;
  }
  .tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.bottomCard {
  margin-top: 10px;
  height: 270px;
  position: relative;
}
.titleDialog {
  font-size: 15px;
  font-weight: 600;
  padding: 5px 10px 15px;
}
</style>