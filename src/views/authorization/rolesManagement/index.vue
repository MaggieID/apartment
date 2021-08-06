<template>
  <div class="g-container">
    <el-card>
      <div class="mb15">
        <el-button type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
        <el-button type="warning" :disabled="multipleSelection.length!=1" icon="el-icon-edit" @click="editRole">修改</el-button>
        <el-button type="danger" :disabled="multipleSelection.length==0" icon="el-icon-delete" @click="delData">删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column align="center" label="角色名称">
            <template slot-scope="{row}">
              <span>{{ row.RoleName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色备注">
            <template slot-scope="{row}">
              <span>{{ row.RoleDescription }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="角色编辑" :visible.sync="addVisible" width="500px" @before-close="addVisible = false">
      <el-form ref="form" :model="form" :rules="roleRules" label-width="80px">
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="form.RoleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <!-- <el-form-item label="上级角色">
          <el-select v-model="form.ParentId" placeholder="请选择" style="width:100%">
            <template v-for="item in tableData">
              <el-option v-if="item.Id!=form.Id" :key="item.Id" :value="item.Id" :label="item.RoleName" />
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item label="角色备注">
          <el-input v-model="form.RoleDescription" placeholder="请输入备注" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="roleComfirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { GetRoles, EditRole, DelRole } from '@/api/Role'
import { copyObj } from '@/utils'
export default {
  name: 'RoleManagement',
  data() {
    return {
      addVisible: false,
      addSign: false,
      form: {},
      roleRules: {
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      upperRoleData: [],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.GetRoles()
  },
  methods: {
    GetRoles() {
      var that = this
      GetRoles({
        AppPage: null
      }).then(res => {
        that.tableData = res.Data
      })
    },
    getList(val) {
      this.queryPara.pageSize = val.limit
      this.queryPara.pageIndex = val.page
      this.GetRoles()
    },
    cancel() {
      this.addVisible = false
    },
    // 新增角色
    addRole() {
      this.addVisible = true
      this.addSign = true
      this.form = {
        Id: 0,
        RoleName: '',
        RoleDescription: '',
        ParentId: null,
        RoleGroupId: null
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑角色
    editRole() {
      this.addVisible = true
      this.addSign = false
      this.form = copyObj(this.multipleSelection[0])
      console.log(this.dicForm)
    },
    delData() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          var delArr = []
          this.multipleSelection.forEach(element => {
            delArr.push(element.Id)
          })
          this.DelRole(delArr, () => {
            this.GetRoles()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除角色
    DelRole(delArr, fn) {
      DelRole(delArr).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: res.Message,
            type: 'success'
          })
          fn()
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    roleComfirm() {
      var that = this
      var data = {
        Id: this.addSign ? null : this.form.Id,
        RoleName: this.form.RoleName,
        RoleDescription: this.form.RoleDescription,
        ParentId: null,
        RoleGroupId: null
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          EditRole(data).then(res => {
            that.addVisible = false
            that.GetRoles()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
