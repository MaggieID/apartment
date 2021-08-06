<template>
  <div>
    <el-dialog title="创建子方案" :visible.sync="value" width="800px" :before-close="close">
      <el-form ref="form" :model="form" :rules="formRule" label-position="top" class="modifyDialog">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="方案名称" prop="Account">
              <el-input v-model="form.Account" clearable placeholder="请输入子方案名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配学院" prop="Account">
              <el-input v-model="form.Account" clearable placeholder="请输入子方案名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同样板" prop="Account">
              <el-input v-model="form.Account" clearable placeholder="请输入子方案名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="Account">
              <el-input v-model="form.Account" clearable placeholder="请输入子方案名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="checkBox">
        <span class="checkTitle">入住人员</span>
        <span class="selectnum">已选人数：</span>
        <span class="selectnum">男生人数：</span>
        <span class="selectnum">女生人数：</span>
        <a class="detail">人员明细</a>
        <div class="checks">
          <el-tag effect="dark" @click="showUser=true"><i class="el-icon-circle-plus-outline"></i> 添加</el-tag>
          <!-- <el-tag v-for="(item ,index) in userData.xy" :key="index" class="tag">{{ item }}</el-tag> -->
        </div>
      </div>
      <div class="checkBox">
        <span class="checkTitle">入住床位</span>
        <span class="selectnum">已选床数：</span>
        <span class="selectnum">男生床位：</span>
        <span class="selectnum">女生床位：</span>
        <a class="detail">床位明细</a>
        <div class="checks">
          <el-tag effect="dark" @click="showBed=true"><i class="el-icon-circle-plus-outline"></i> 添加</el-tag>
          <!-- <el-tag v-for="(item ,index) in userData.xy" :key="index" class="tag">{{ item }}</el-tag> -->
        </div>
      </div>
      <div class="checkBox">
        <div class="checkTitle">入住模式</div>
        <el-radio-group v-model="radio" size="small" class="checkRadio">
          <el-radio label="1" border>
            <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
            <div class="righttext">
              <div>自动分配</div>
              <div>分配规则自动入住</div>
            </div>
          </el-radio>
          <el-radio label="2" border>
            <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
            <div class="righttext">
              <div>自主选床</div>
              <div>线下上设备自主选择</div>
            </div>
          </el-radio>
          <el-radio label="3" border>
            <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
            <div class="righttext">
              <div>房间顺序入住</div>
              <div>按照房间顺序入住</div>
            </div>
          </el-radio>
          <el-radio label="4" border>
            <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
            <div class="righttext">
              <div>手动安排入住</div>
              <div>由老师手动安排入住</div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <allUsers v-model="showUser" :distribution="1"></allUsers>
    <allBeds v-model="showBed" :distribution="1"></allBeds>
  </div>
</template>
<script>
import allUsers from './allUsers.vue'
import allBeds from './allBeds.vue'
export default {
  components: { allUsers, allBeds },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formRule: {},
      form: {},
      showUser: false,
      showBed: false,
      radio: '1'
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
  margin: 10px 0 20px;
  .checkTitle {
    font-size: 16px;
  }
  .selectnum {
    color: #4884ff;
    padding-left: 30px;
  }
  .checks {
    background: #f5f7fa;
    margin-top: 10px;
    border-radius: 10px;
    height: 120px;
    padding: 15px;
    .el-tag--dark {
      cursor: pointer;
    }
  }
  .tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .detail {
    float: right;
    font-weight: 400;
    color: #4884ff;
    text-decoration: underline;
  }
  .checkRadio {
    margin-top: 10px;
    .el-radio {
      padding: 10px 15px;
      background: #f6fafe;
      border-radius: 10px;
      height: 50px;
      margin-right: 15px;
    }
    ::v-deep .el-radio__input {
      display: none;
    }
    ::v-deep .el-radio__label {
      // display: flex;
      padding: 0;
      .lefticon {
        width: 28px;
        height: 28px;
        border-radius: 28px;
        background: #3385ff;
        text-align: center;
        line-height: 28px;
        display: inline-block;
        vertical-align: bottom;
        i {
          background: #418eff;
          color: white;
          font-size: 14px;
        }
      }
      .righttext {
        display: inline-block;
        vertical-align: middle;
        div:nth-child(1) {
          color: black;
          font-size: 14px;
          margin-bottom: 3px;
        }
        div:nth-child(2) {
          color: #848391;
        }
      }
    }
  }
}
</style>