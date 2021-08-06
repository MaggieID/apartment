<template>
  <div class="g-container">
    <el-card class="box-card">
      <el-scrollbar style="height:100%">
        <el-form inline class="m-search">
          <el-form-item>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addData">新增批次</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="el-icon-delete" :disabled="multipleSelection.length==0" @click="delData">删除</el-button>
          </el-form-item>
          <el-form-item>
            <displayFields title="更多人员信息" api-name="user_display" show-sort left-icon="el-icon-s-operation" style="margin-right: 10px;" @GetUserDisplay="getMoreInfo" />
          </el-form-item>
        </el-form>
        <div v-for="batch in batchList" :key="batch.Id" class="collapse">
          <div class="collapse-title">
            <i class="el-icon-arrow-right show" :class="{'is-active':show==batch.Id}" @click="clickShow(batch)"></i>
            {{ batch.GraduateBatchName }}
            <div class="editIcon">
              <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="showAdd=true">添加</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelGraduateBatch(batch)">删除</el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="editData(batch)">修改</el-button>
            </div>
          </div>
          <el-collapse-transition>
            <div v-if="show==batch.Id" style="flex-direction: column; justify-content: space-between;">
              <el-table :data="tableList" @selection-change="selectChange">
                <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
                <template v-for="(item,index) in tableColumn">
                  <el-table-column :key="index" :width="(item.ColumnName=='UserColleges'||item.ColumnName=='UserDeps'||item.ColumnName=='UserLabels')?'180':'120'" :prop="item.ColumnName" :label="item.ColumnCnName" align="center">
                    <template slot-scope="{row}">
                      <div v-if="item.ColumnName=='PhotoPath'">
                        <el-image v-if="row.PhotoPath" style="width: 50px; height: 50px" :src="row.PhotoPath" :preview-src-list="[row.PhotoPath]" />
                      </div>
                      <div v-else-if="item.ColumnName=='UserColleges'">
                        <el-tag v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='UserDeps'">
                        <el-tag v-for="tag in row.UserDeps" :key="tag.DepartmentId" style="margin-right:5px">{{ tag.DepName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='UserLabels'">
                        <el-tag v-for="tag in row.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </div>
                      <div v-else-if="item.ColumnName=='IsCheckIn'||item.ColumnName=='IsOutside'">
                        <el-tag v-if="row[item.ColumnName]==1" type="success">是</el-tag>
                        <el-tag v-if="row[item.ColumnName]==0" type="danger">否</el-tag>
                      </div>
                      <span v-else>{{ row[item.ColumnName] }}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column prop="Number" align="center" label="床位号" min-width="100">
                  <template slot-scope="{row}">
                    <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedName }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="Number" align="center" label="床位性别" min-width="100">
                  <template slot-scope="{row}">
                    <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedSex_CN }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="Number" align="center" label="楼栋路径" min-width="300">
                  <template slot-scope="{row}">
                    <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedFullPath }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="Number" align="center" label="床位价格" min-width="100">
                  <template slot-scope="{row}">
                    <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.BedPrice }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="Number" align="center" label="合同价格" min-width="100">
                  <template slot-scope="{row}">
                    <div v-for="item in row.StudentLiveInfos" :key="item.BedId">{{ item.ContractPrice }}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80">
                  <template slot-scope="{row}">
                    <el-button type="text" icon="el-icon-view" title="查看详情" class="btn-detail" @click="seeDetail(row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination :total="query.pageTotal" :page.sync="query.PageIndex" :limit.sync="query.PageSize" @pagination="handleSizeChange" />
            </div>
          </el-collapse-transition>
        </div>
      </el-scrollbar>
    </el-card>
    <el-dialog title="新增批次" :visible.sync="showModify" width="600px" @before-close="showModify=false">
      <el-form ref="form" :model="form" :rules="formRule" label-width="120px">
        <el-form-item label="批次名称" prop="GraduateBatchName">
          <el-input v-model="form.GraduateBatchName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModify=false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="toSave">确 定</el-button>
      </span>
    </el-dialog>
    <addStudent v-model="showAdd" :data="show" @getList="search"></addStudent>
    <userDetails v-model="showDetails" :data="userInfo"></userDetails>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { DelGraduateBatch } from '@/api/GraduateBatch'
import pagination from '@/components/Pagination'
import {
  GetBatchStudentList,
  AddGraduateBatch,
  UpdateGraduateBatch,
  DelGraduateBatchStudent
} from '@/api/GraduateBatch'
import addStudent from './components/addStudent.vue'
import displayFields from '@/components/DisplayFields'
import userDetails from '@/components/UserInfo/detailsDialog'
export default {
  components: { pagination, addStudent, displayFields, userDetails },
  filters: {
    parseTime(val) {
      return parseTime(val)
    }
  },
  data() {
    return {
      formInline: {},
      listQuery: {},
      tableList: [],
      query: {
        PageIndex: 1,
        PageSize: 10,
        pageTotal: 0
      },
      multipleSelection: [],
      show: null,
      form: {},
      showModify: false,
      formRule: {
        GraduateBatchName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      loading: false,
      addSign: false,
      showAdd: false,
      tableColumn: [],
      userInfo: {},
      showDetails: false
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    },
    batchList() {
      return this.$store.getters.batchList
    }
  },
  mounted() {
    this.$store.dispatch('actions/GetBatchList')
  },
  methods: {
    seeDetail(row) {
      this.userInfo = row
      this.userInfo.UserId = row.Id
      this.showDetails = true
    },
    getMoreInfo(data) {
      this.tableColumn = data
    },
    addData() {
      this.form = {}
      this.showModify = true
      this.addSign = true
    },
    editData(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.showModify = true
      this.addSign = false
    },
    toSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addSign) {
            this.AddGraduateBatch()
          } else {
            this.UpdateGraduateBatch()
          }
        }
      })
    },
    UpdateGraduateBatch() {
      UpdateGraduateBatch({
        graduatBatchId: this.form.Id,
        graduateBatechName: this.form.GraduateBatchName,
        studentIds: null
      })
        .then(res => {
          this.saveRes(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    AddGraduateBatch() {
      AddGraduateBatch({
        graduateBatechName: this.form.GraduateBatchName,
        studentIds: []
      })
        .then(res => {
          this.saveRes(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveRes(res) {
      this.loading = false
      if (res.BS == 1) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.showModify = false
        this.$store.dispatch('actions/GetBatchList')
      } else {
        this.$message.error(res.Message)
      }
    },
    clickShow(item) {
      if (this.show == item.Id) {
        this.show = null
      } else {
        this.show = item.Id
        this.search()
      }
    },
    selectChange(val) {
      this.multipleSelection = val
    },
    search() {
      this.query.PageIndex = 1
      this.GetBatchStudentList()
    },
    handleSizeChange(val) {
      this.query.PageIndex = val.page
      this.query.PageSize = val.limit
      this.GetBatchStudentList()
    },
    GetBatchStudentList() {
      GetBatchStudentList({
        graduateBatchId: this.show,
        page: {
          Size: this.query.PageSize,
          Index: this.query.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }).then(res => {
        this.tableList = res.Data
        this.query.pageTotal = res.Totals
      })
    },
    delData() {
      this.$confirm('此操作将永久删除该数据，是否继续？', '删除提示', {
        type: 'warning'
      })
        .then(() => {
          var ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.Id)
          })
          var that = this
          DelGraduateBatchStudent({
            graduateBatchId: this.show,
            studentIds: ids
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.multipleSelection = []
              that.search()
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    },
    DelGraduateBatch(item) {
      this.$confirm(
        `该批次下有${item.StudentNumber}个学生，是否继续删除？`,
        '删除提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          var that = this
          DelGraduateBatch({
            graduateBatchIds: [item.Id]
          }).then(res => {
            if (res.BS == 1) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
              that.$store.dispatch('actions/GetBatchList')
            } else {
              this.$message.error(res.Message)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse {
  &-title {
    height: 60px;
    width: 100%;
    border-top: 1px solid #f0f2f5;
    position: relative;
    padding: 10px;
    padding-left: 40px;
    line-height: 40px;
  }
  &-detail {
    display: flex;
    .name {
      line-height: 35px;
      font-weight: bold;
      padding: 0 10px;
      display: inline-block;
      position: relative;
      flex: 0 0 85px;
    }
    .name::before {
      content: '';
      width: 3px;
      height: 15px;
      background: #3385ff;
      position: absolute;
      left: 0;
      top: 10px;
    }
  }
  .show {
    position: absolute;
    top: 20px;
    left: 10px;
    cursor: pointer;
    font-size: 20px;
    transition: transform 0.3s;
  }
  .editIcon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    i {
      cursor: pointer;
      margin: 0 5px;
    }
  }
  .is-active {
    transform: rotate(90deg);
  }
  &-name {
    font-size: 18px;
    padding-right: 20px;
    font-weight: 600;
    line-height: 39px;
    display: inline-block;
    min-width: 150px;
  }
}
.collapse:last-child {
  border-bottom: 1px solid #f0f2f5;
}
</style>