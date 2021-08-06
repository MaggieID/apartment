<template>
  <div class="g-container">
    <el-container style="height: 100%;">
      <el-aside width="377px">
        <el-tabs v-model="activeName" type="border-card" style="height:100%" @tab-click="tabClick">
          <el-tab-pane label="学院资源管理" name="1" />
          <el-tab-pane label="楼栋资源管理" name="2" />
          <el-tab-pane label="部门资源管理" name="3" />
          <el-scrollbar style="height:100%">
            <el-tree :expand-on-click-node="false" :props="props" class="tree" highlight-current :data="treeData" @node-click="handleChange" />
          </el-scrollbar>
        </el-tabs>
      </el-aside>
      <el-main style="padding: 20px;">
        <el-scrollbar style="height:100%">
          <div class="conditions">
            <el-form inline>
              <el-form-item>
                <el-button :disabled="treeId==''" type="primary" icon="el-icon-plus" @click="addRole">添加</el-button>
                <el-button type="danger" :disabled="multipleSelection.length==0" icon="el-icon-delete" @click="deleteRole">删除</el-button>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="formInline.UserName" clearable placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="学工号">
                <el-input v-model="formInline.UserNumber" clearable placeholder="请输入学工号" />
              </el-form-item>
              <el-form-item label="身份">
                <el-select v-model="formInline.Identity" clearable placeholder="请选择身份">
                  <el-option v-for="(item,index) in IdentityData" :key="index" :label="item" :value="index" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" :disabled="treeId==''" @click="listQuery.PageIndex = 1;tableQuery()">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="tableContent">
            <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="UserName" align="center" label="姓名" />
              <el-table-column prop="UserNumber" align="center" label="学号" />
              <el-table-column prop="RoleName" align="center" label="角色" />
              <el-table-column align="center" label="性别">
                <template slot-scope="{row}">
                  <el-tag :type="row.Sex=='男性'?'':'danger'">{{ row.Sex }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="FullPath" align="center" label="路径" />
            </el-table>
            <pagination :total="listQuery.PageTotal" :page.sync="listQuery.PageIndex" :limit.sync="listQuery.PageSize" @pagination="GetFaceTable" />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
    <el-dialog title="添加人员" :visible.sync="addVisible" :modal="false" width="1000px" @before-close="addVisible=false">
      <div style=" height: 450px;">
        <el-scrollbar style="height:100%">
          <div style="padding: 0 20px;">
            <el-form inline :model="list" label-width="55px">
              <el-form-item>
                <el-input v-model="list.Condition" clearable placeholder="请输入姓名/学工号" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="list.Sex" clearable placeholder="请选择性别">
                  <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="list.Identity" clearable placeholder="请选择身份">
                  <el-option v-for="(item,index) in IdentityData" :key="index" :label="item" :value="index.toString()" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
            <el-form ref="ruleForm">
              <el-table :data="userList" stripe style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
                <el-table-column prop="Name" align="center" label="姓名" />
                <el-table-column prop="Number" align="center" label="学工号" />
                <el-table-column align="center" label="性别">
                  <template slot-scope="{row}">
                    <el-tag :type="row.Sex==1?'':'danger'">{{ row.Sex_CN }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="Identity_CN" align="center" label="身份" />
              </el-table>
              <pagination :total="addQuery.PageTotal" :page.sync="addQuery.PageIndex" :limit.sync="addQuery.PageSize" @pagination="getPagination" />
              <el-form-item label="角色">
                <el-select v-model="role" placeholder="请选择">
                  <el-option v-for="item in roleData" :key="item.Id" :label="item.RoleName" :value="item.Id" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import { QueryUserList } from '@/api/UserInfo'
import { GetRoles } from '@/api/Role'
import { GetALLConstructTree } from '@/api/Construct'
import {
  AddURC,
  AddURD,
  AddURS,
  DelURC,
  DelURD,
  DelURS,
  QueryURC,
  QueryURD,
  QueryURS
} from '@/api/Permission'
export default {
  name: 'DataResource',
  components: { pagination },
  data() {
    return {
      activeName: '1',
      formInline: {},
      treeData: [],
      userList: [],
      list: {},
      role: '',
      addQuery: {
        PageTotal: 0,
        PageIndex: 1,
        PageSize: 10
      },
      listQuery: {
        PageTotal: 0,
        PageIndex: 1,
        PageSize: 10
      },
      roleData: [],
      props: {
        label: 'Name',
        children: 'Childs'
      },
      tableData: [],
      addVisible: false,
      currentRow: null,
      treeId: '',
      conditions: [],
      multipleSelection: [],
      department: []
    }
  },
  computed: {
    IdentityData() {
      return this.$store.getters.IdentityData
    },
    sexList() {
      return this.$store.getters.sexList
    }
  },
  mounted() {
    this.tabClick()
    this.GetRoles()
    this.$store.dispatch('actions/getSex')
  },
  methods: {
    GetConstructTree() {
      var that = this
      GetALLConstructTree().then(res => {
        that.treeData = res.Data.Childs
      })
    },
    deleteRole() {
      this.$confirm('你确定要删除该文件吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          var ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.Id)
          })
          switch (this.activeName) {
            case '1':
              DelURC(ids).then(res => {
                this.saveResult(res, () => {
                  this.listQuery.PageIndex = 1
                })
              })
              break
            case '2':
              DelURS(ids).then(res => {
                this.saveResult(res, () => {
                  this.listQuery.PageIndex = 1
                })
              })
              break
            case '3':
              DelURD(ids).then(res => {
                this.saveResult(res, () => {
                  this.listQuery.PageIndex = 1
                })
              })
              break
          }
        })
        .catch(() => {})
    },
    saveResult(res, fn) {
      if (res.BS == 1) {
        this.$message({
          message: res.Message,
          type: 'success'
        })
        fn()
        this.tableQuery()
      } else {
        this.$message.error(res.Message)
      }
    },
    tabClick() {
      switch (this.activeName) {
        case '1':
          this.$store.dispatch('actions/GetCollegeTree').then(res => {
            this.treeData = res.Data.Childs
          })
          break
        case '2':
          this.GetConstructTree()
          break
        case '3':
          this.$store.dispatch('actions/GetDepartmentTree').then(res => {
            this.treeData = res.Data.Childs
          })
          break
      }
      this.treeId = ''
      this.formInline = {}
      this.tableData = []
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    GetRoles() {
      GetRoles({
        AppPage: null
      }).then(res => {
        this.roleData = res.Data
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleChange(val) {
      this.treeId = val.Id
      this.listQuery.PageIndex = 1
      this.multipleSelection = []
      this.formInline = {}
      this.tableQuery()
    },
    tableQuery() {
      switch (this.activeName) {
        case '1':
          this.QueryURC()
          break
        case '2':
          this.QueryURS()
          break
        case '3':
          this.QueryURD()
          break
      }
    },
    GetFaceTable(val) {
      this.listQuery.PageSize = val.limit
      this.listQuery.PageIndex = val.page
      this.tableQuery()
    },
    QueryURC() {
      QueryURC({
        UserName: this.formInline.UserName,
        UserNumber: this.formInline.UserNumber,
        Identity: this.formInline.Identity,
        CollegeId: this.treeId,
        AppPage: {
          Size: this.listQuery.PageSize,
          Index: this.listQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.listQuery.PageTotal = res.Totals
      })
    },
    QueryURD() {
      QueryURD({
        UserName: this.formInline.UserName,
        UserNumber: this.formInline.UserNumber,
        Identity: this.formInline.Identity,
        DepartmentId: this.treeId,
        AppPage: {
          Size: this.listQuery.PageSize,
          Index: this.listQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.listQuery.PageTotal = res.Totals
      })
    },
    QueryURS() {
      QueryURS({
        UserName: this.formInline.UserName,
        UserNumber: this.formInline.UserNumber,
        Identity: this.formInline.Identity,
        ConstructId: this.treeId,
        AppPage: {
          Size: this.listQuery.PageSize,
          Index: this.listQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableData = res.Data
        this.listQuery.PageTotal = res.Totals
      })
    },
    // 添加人员按钮
    addRole() {
      this.addVisible = true
      this.role = ''
      this.currentRow = null
      this.list = {}
      this.queryList()
    },
    queryList() {
      this.addQuery.PageIndex = 1
      this.GetUserList()
    },
    GetUserList() {
      var data = {
        Identity: this.list.Identity,
        Condition: this.list.Condition,
        Sex: this.list.Sex,
        AppPage: {
          Size: this.addQuery.PageSize,
          Index: this.addQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }
      QueryUserList(data).then(res => {
        this.userList = res.Data
        this.addQuery.PageTotal = res.Totals
      })
    },
    getPagination(val) {
      this.addQuery.PageSize = val.limit
      this.addQuery.PageIndex = val.page
      this.GetUserList()
    },
    // 添加人员确认按钮
    addComfirm() {
      if (this.role === '') {
        this.$message.error('请选择角色')
        return
      }
      if (this.currentRow == null) {
        this.$message.error('请选择人员')
        return
      }
      switch (this.activeName) {
        case '1':
          AddURC({
            UserId: this.currentRow.Id,
            RoleId: this.role,
            CollegeId: this.treeId
          }).then(res => {
            this.saveResult(res, () => {
              this.addVisible = false
            })
          })
          break
        case '2':
          AddURS({
            UserId: this.currentRow.Id,
            RoleId: this.role,
            ConstructId: this.treeId
          }).then(res => {
            this.saveResult(res, () => {
              this.addVisible = false
            })
          })
          break
        case '3':
          AddURD({
            UserId: this.currentRow.Id,
            RoleId: this.role,
            DepartmentId: this.treeId
          }).then(res => {
            this.saveResult(res, () => {
              this.addVisible = false
            })
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: white;
  padding: 0;
  line-height: unset;
  margin: 0;
  margin-right: 10px;
}

.el-main {
  background-color: white;
}

::v-deep .el-tabs__content {
  height: calc(100% - 39px);
}
.tabs {
  ::v-deep .el-tabs__header {
    border: none;
  }
  ::v-deep .el-tabs__item {
    border: none;
  }
}
</style>
