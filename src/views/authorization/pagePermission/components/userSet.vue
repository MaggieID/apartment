<template>
  <div class="user-set">
    <div class="personal">
      <div class="conditions">
        <el-form inline>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleClickAdd">添加</el-button>
            <el-button type="danger" :disabled="tableChecked.length==0" icon="el-icon-delete" @click="RemoveUserToGroup">删除</el-button>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.UserName" clearable placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="学工号">
            <el-input v-model="searchForm.UserNumber" clearable placeholder="请输入学工号" />
          </el-form-item>
          <el-form-item label="身份">
            <el-select v-model="searchForm.Identity" clearable placeholder="请选择身份">
              <el-option v-for="(item,index) in IdentityData" :key="index" :label="item" :value="index.toString()" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchTable.PageIndex = 1;tableQuery()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-table :data="tableList" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column prop="Name" align="center" label="姓名" />
          <el-table-column prop="Number" align="center" label="学工号" />
          <el-table-column align="center" label="性别">
            <template slot-scope="{row}">
              <el-tag :type="row.Sex==1?'':'danger'">{{ row.Sex_CN }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Identity_CN" align="center" label="身份" />
          <el-table-column align="center" label="学院">
            <template slot-scope="{row}">
              <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId">{{ tag.CollegeName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="{row}">
              <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId">{{ tag.DepName }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="searchTable.Total" :page.sync="searchTable.PageIndex" :limit.sync="searchTable.PageSize" @pagination="GetFaceTable" />
      </div>
    </div>
    <el-dialog title="添加人员" :visible.sync="addVisible" :modal="false" width="1000px" @before-close="addVisible=false">
      <div style=" height: 450px;">
        <el-scrollbar style="height:100%">
          <div style="padding: 0 20px;">
            <el-form inline>
              <el-form-item>
                <el-input v-model="addForm.Condition" clearable placeholder="请输入姓名/学工号" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="addForm.Sex" clearable placeholder="请选择性别">
                  <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="addForm.Identity" clearable placeholder="请选择身份">
                  <el-option v-for="(item,index) in IdentityData" :key="index" :label="item" :value="index.toString()" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
            <div style="margin-bottom: 15px;">
              <i style="color:#ff0d0d;">* </i><span style="color:#4884ff;">选择新增人员</span><span>（已选<b style="color:#4884ff;"> {{ selectDataArr.length }} </b>人）</span>
            </div>
            <div class="table-add">
              <el-table ref="multipleTable" stripe :data="userList" @select-all="selectAll" @select="selectChange">
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column prop="Name" align="center" label="姓名" />
                <el-table-column prop="Number" align="center" label="学工号" />
                <el-table-column align="center" label="性别">
                  <template slot-scope="{row}">
                    <el-tag :type="row.Sex==1?'':'danger'">{{ row.Sex_CN }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="Identity_CN" align="center" label="身份" />
                <el-table-column align="center" label="学院">
                  <template slot-scope="{row}">
                    <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId">{{ tag.CollegeName }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="部门">
                  <template slot-scope="{row}">
                    <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId">{{ tag.DepName }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <pagination :total="AddTable.Total" :page.sync="AddTable.PageIndex" :limit.sync="AddTable.PageSize" @pagination="addSearch" />
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  UpdateViewGroupUser,
  QueryViewGroupUserInfos,
  DelViewGroupUser
} from '@/api/Permission'
import { QueryUserList } from '@/api/UserInfo'
export default {
  name: 'UserSet',
  components: {
    Pagination
  },
  props: {
    activeId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      searchForm: {},
      searchTable: {
        PageIndex: 1,
        PageSize: 10,
        Total: 0
      },
      addForm: {},
      tableList: [],
      addVisible: false,
      AddTable: {
        PageIndex: 1,
        PageSize: 10,
        Total: 0
      },
      userList: [],
      saveLoading: false,
      selectDataArr: [],
      tableChecked: []
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
  watch: {
    activeId(val) {
      if (val != null) {
        this.tableQuery()
      }
    }
  },
  mounted() {
    this.$store.dispatch('actions/getSex')
  },
  methods: {
    tableQuery() {
      QueryViewGroupUserInfos({
        ViewGroupId: this.activeId,
        UserName: this.searchForm.UserName,
        UserNumber: this.searchForm.UserNumber,
        UserIdentity: this.searchForm.Identity,
        AppPage: {
          Size: this.searchTable.PageSize,
          Index: this.searchTable.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableList = res.Data
        this.searchTable.Total = res.Totals
      })
    },
    GetFaceTable(val) {
      this.searchTable.PageSize = val.limit
      this.searchTable.PageIndex = val.page
      this.tableQuery()
    },
    handleAddSubmit() {
      this.saveLoading = true
      const arr = []
      this.selectDataArr.forEach(item => {
        arr.push(item.Id)
      })
      UpdateViewGroupUser({
        ViewGroupId: this.activeId,
        UserIds: arr
      }).then(res => {
        this.saveLoading = false
        if (res.BS == 1) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.tableQuery()
          this.addVisible = false
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    handleClickAdd() {
      this.addVisible = true
      this.selectDataArr = []
      this.$nextTick(() => {
        this.addForm = {}
        this.$refs.multipleTable.clearSelection()
        this.queryList()
      })
    },
    handleSelectionChange(val) {
      this.tableChecked = val
    },
    RemoveUserToGroup() {
      this.$confirm('此操作将永久删除该数据，是否继续？', '删除提示', {
        type: 'warning'
      })
        .then(() => {
          var arr = []
          this.tableChecked.forEach(element => {
            arr.push(element.Id)
          })
          var data = {
            UserIds: arr,
            ViewGroupId: this.activeId
          }
          DelViewGroupUser(data).then(res => {
            if (res.BS == 1) {
              this.searchTable.PageIndex = 1
              this.tableQuery()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    queryList() {
      this.AddTable.PageIndex = 1
      this.QueryUserList()
    },
    addSearch(val) {
      this.AddTable.PageSize = val.limit
      this.AddTable.PageIndex = val.page
      this.QueryUserList()
    },
    QueryUserList() {
      var data = {
        Identity: this.addForm.Identity,
        Condition: this.addForm.Condition,
        Sex: this.addForm.Sex,
        AppPage: {
          Size: this.AddTable.PageSize,
          Index: this.AddTable.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }
      var that = this
      QueryUserList(data).then(res => {
        that.userList = res.Data
        setTimeout(() => {
          that.selectDataArr.forEach(item => {
            that.userList.forEach(listitem => {
              if (item.Id == listitem.Id) {
                that.$refs.multipleTable.toggleRowSelection(listitem, true)
              }
            })
          })
        }, 0)
        that.AddTable.Total = res.Totals
      })
    },
    selectChange(arr, row) {
      if (this.selectDataArr.length > 0) {
        const arr = this.selectDataArr.filter(item => {
          return item.Id === row.Id
        })
        if (arr.length > 0) {
          for (let i = 0; i < this.selectDataArr.length; i++) {
            if (this.selectDataArr[i].Id === row.Id) {
              this.selectDataArr.splice(i, 1)
            }
          }
        } else {
          this.selectDataArr.push(row)
        }
      } else {
        this.selectDataArr.push(row)
      }
    },
    selectAll(arr) {
      if (arr.length > 0) {
        this.selectDataArr = this.selectDataArr.concat(arr)
      } else {
        for (let i = 0; i < this.selectDataArr.length; i++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (this.selectDataArr[i].Id === this.userList[j].Id) {
              this.selectDataArr.splice(i, 1)
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.user-set {
  .vue-treeselect {
    line-height: 1.2rem;
    width: 200px;
  }
  .vue-treeselect .el-loading-spinner {
    margin-top: -10px;
  }
  .title {
    position: relative;
    padding-left: 10px;
    margin-bottom: 15px;
  }
  .title::before {
    content: '';
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #4884ff;
  }
}
</style>
