<template>
  <div class="g-container">
    <div class="toptitle">方案</div>
    <el-scrollbar style="height:calc(100% - 30px)">
      <div class="plan">
        <div style="flex:1">
          <span style="font-size: 36px;">秋季新生入学住宿分配</span>
          <el-tag style="vertical-align: text-bottom;">进行中</el-tag>
          <el-form label-width="95px" label-position="left" class="rightForm plantext">
            <el-form-item label="时间：">
              2021-10-22
            </el-form-item>
            <el-form-item label="负责人：">
              张三
            </el-form-item>
          </el-form>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="planNum" @click="showUser(2)">
                <div class="numimg">
                  <i class="iconfont iconrenshu"></i>
                </div>
                <div class="numtext">
                  人员数总
                  <div>6000</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="planNum" @click="showBed(2)">
                <div class="numimg">
                  <i class="iconfont iconicon3"></i>
                </div>
                <div class="numtext">
                  床位数总
                  <div>6000</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="planNum">
                <div class="numimg">
                  <i class="iconfont iconzhaobiaofangan"></i>
                </div>
                <div class="numtext">
                  已创建子方案
                  <div>6000</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="width:270px;margin-left: 10px;">
          <div>未分配人员数 <i class="el-icon-circle-plus-outline" style="float: right;font-size: 18px;" @click="showAddUser=true"></i></div>
          <div class="nofp" @click="showUser(0)">666</div>
        </div>
        <div style="width:270px;margin-left: 10px;background:#E6A23C;">
          <div>未分配床位数 <i class="el-icon-circle-plus-outline" style="float: right;font-size: 18px;" @click="showAddBed=true"></i></div>
          <div class="nofp" @click="showBed(0)">5555</div>
        </div>
      </div>
      <div class="searchbox">
        <el-form inline class="m-search rightForm">
          <el-form-item>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="primary" icon="el-icon-circle-plus-outline">创建子方案</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="single">单个方案创建</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="1">学院一键创建</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="2">专业一键创建</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline" command="3">班级一键创建</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="success" icon="iconfont iconhebing" style="margin-left:10px"><span style="padding-left:5px">合并方案</span></el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.StudyingYear" clearable placeholder="请选择入住模式">
              <el-option label="一人一床" value="0"></el-option>
              <el-option label="多人一床" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.Phone" clearable placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item v-if="addSign">
            <el-button type="success" icon="el-icon-search">临时保存</el-button>
            <el-button type="primary" icon="el-icon-edit-outline">编辑</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-checkbox-group v-model="checkList">
        <el-row :gutter="10">
          <el-col v-for="item in 3" :key="item+'a'" :lg="8" :xl="6">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="headericon">
                <i class="el-icon-edit-outline" style="color:#3385FF" title="编辑"></i>
                <i class="el-icon-delete" style="color:#F56C6C" title="删除"></i>
              </div>
              <el-row :gutter="10">
                <el-form label-width="85px" label-position="top" class="m-search rightForm modifyRorm">
                  <el-col :span="12">
                    <el-form-item label="方案名称：">
                      <el-input v-model="item.Account" size="mini" clearable placeholder="请输入子方案名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分配学院：">
                      <el-input v-model="item.Account" size="mini" clearable placeholder="请输入子方案名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入住模式：">
                      <el-input v-model="item.Account" size="mini" clearable placeholder="请输入子方案名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人：">
                      <el-input v-model="item.Account" size="mini" clearable placeholder="请输入子方案名称"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
                <el-col :span="12">
                  <div class="purple">
                    <span>已添加人员</span>
                    <div>111</div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="purple" style="background:#E6A23C">
                    <span>已添加床位</span>
                    <div>222</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col v-for="item in 12" :key="item" :lg="8" :xl="6" class="oldArr">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="headericon">
                <el-checkbox :label="item" class="checkbox"></el-checkbox>
                <i class="iconfont iconfuzhilianjiexian" title="复制链接"></i>
                <i class="iconfont iconhetong" title="查看合同"></i>
                <i class="el-icon-view" title="查看详情"></i>
                <i class="el-icon-edit-outline" title="编辑"></i>
                <i class="el-icon-delete" title="删除"></i>
              </div>
              <el-row :gutter="10">
                <el-form label-width="85px" label-position="left" class="m-search">
                  <el-col :span="12">
                    <el-form-item label="方案名称：">
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="分配学院：">
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入住模式：">
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人：">
                    </el-form-item>
                  </el-col>
                </el-form>
                <el-col :span="8">
                  <div class="purple">
                    <span>已添加人员</span>
                    <div>111</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="purple" style="background:#E6A23C">
                    <span>已添加床位</span>
                    <div>222</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="purple" style="background:#22B573">
                    <span>已分配床位</span>
                    <div>3334</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-scrollbar>
    <allUsers v-model="showAllUser" :distribution="distribution"></allUsers>
    <allBeds v-model="showAllBed" :distribution="distribution"></allBeds>
    <addUser v-model="showAddUser"></addUser>
    <addBed v-model="showAddBed"></addBed>
    <singleScheme v-model="showSingle"></singleScheme>
    <onekeyAdd v-model="showOnekeyAdd" :type="type" @create="createScheme"></onekeyAdd>
  </div>
</template>
<script>
import allUsers from './components/allUsers.vue'
import allBeds from './components/allBeds.vue'
import addUser from '@/components/newStudent/addUser.vue'
import addBed from '@/components/newStudent/addBed.vue'
import singleScheme from './components/singleScheme.vue'
import onekeyAdd from './components/onekeyAdd.vue'
export default {
  components: { allUsers, allBeds, addUser, addBed, singleScheme, onekeyAdd },
  data() {
    return {
      formInline: {},
      checkList: [],
      showAllUser: false,
      showAllBed: false,
      distribution: 0,
      showAddUser: false,
      showAddBed: false,
      showSingle: false,
      showOnekeyAdd: false,
      type: '1',
      addSign: true,
      newArr: []
    }
  },
  mounted() {
    // console.log(this.$route.params.id)
    this.$store.dispatch('actions/GetCollegeTree')
  },
  methods: {
    createScheme() {
      this.addSign = true
    },
    handleCommand(command) {
      if (command == 'single') {
        this.showSingle = true
      } else {
        this.showOnekeyAdd = true
        this.type = command
      }
    },
    showUser(num) {
      this.distribution = num
      this.showAllUser = true
    },
    showBed(num) {
      this.distribution = num
      this.showAllBed = true
    }
  }
}
</script>
<style lang="scss" scoped>
.headericon {
  font-size: 18px;
  text-align: right;
  color: #bcbcbc;
  i {
    padding: 0 5px;
    cursor: pointer;
  }
  .checkbox {
    float: left;
    ::v-deep .el-checkbox__label {
      display: none;
    }
  }
}
.toptitle {
  font-size: 18px;
  margin-bottom: 10px;
}
.plantext {
  margin: 20px 0;
  ::v-deep .el-form-item__label {
    color: white;
    font-size: 20px;
  }
  ::v-deep .el-form-item__content {
    font-size: 20px;
  }
}
.planNum {
  display: flex;
  cursor: pointer;
  .numimg {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    background: #69a5f8;
    text-align: center;
    line-height: 70px;
    i {
      font-size: 30px;
      background: #7bb0f9;
      padding: 8px;
      border-radius: 40px;
    }
  }
  .numtext {
    padding: 0 10px;
    div {
      font-size: 40px;
      padding-top: 10px;
    }
  }
}
.plan {
  display: flex;
  > div {
    border-radius: 10px;
    height: 260px;
    color: white;
    background: #448ef6;
    padding: 15px;
  }
}
.searchbox {
  background: white;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 10px 10px 0 0;
}
.box-card {
  margin-bottom: 10px;
}
.purple {
  border-radius: 10px;
  height: 80px;
  background: #448ef6;
  color: white;
  margin-top: 10px;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  div {
    font-size: 40px;
  }
}
.nofp {
  font-size: 90px;
  text-align: center;
  margin-top: 65px;
  cursor: pointer;
}
.oldArr {
  position: relative;
}
.oldArr > ::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  background: #48484891;
  z-index: 99;
  top: 0;
  left: 0;
}
.modifyRorm {
  margin-top: -8px;
  ::v-deep .el-form-item__label {
    width: 100%;
    text-align: left;
    padding: 5px 0 0;
    line-height: 20px;
  }
  .vue-treeselect__control {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #e4e7ed;
  }
  .el-select,
  .el-input {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    border: none;
    outline: none;
    width: 100%;
    border-bottom: 1px solid #e4e7ed;
    border-radius: 0;
  }
  .el-input__inner:focus {
    box-shadow: none;
  }
}
</style>