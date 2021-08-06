<template>
  <div>
    <el-dialog title="添加入住人员" append-to-body :visible.sync="value" width="1200px" :before-close="close">
      <div class="btmg">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="已选学生：">{{ selectData.length }} </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="男生数量："> {{ boyList.length }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="女生数量：">{{ girlList.length }} </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="已选学院范围：">
                <el-tag v-for="(item ,index) in xy" :key="index" style="margin-right:5px;margin-bottom: 5px;">{{ item }}</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="display: flex;height: 500px;">
        <el-card shadow="never" style="width: 325px;margin-right: 10px;">
          <el-scrollbar style="height:100%">
            <el-tree ref="college" :props="props" check-strictly show-checkbox class="tree" highlight-current :data="collegeList" />
          </el-scrollbar>
        </el-card>
        <el-card shadow="never" style="flex: 1;">
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
              <el-select v-model="list.isCheckIn" clearable placeholder="请选择入住状态">
                <el-option label="未入住" value="0"></el-option>
                <el-option label="已入住" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="queryList">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="table" :data="userList" stripe style="width: 100%" height="340px" @select-all="selectAll" @select="selectChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column prop="Name" align="center" label="姓名" />
            <el-table-column prop="Number" align="center" label="学工号" />
            <el-table-column align="center" label="性别">
              <template slot-scope="{row}">
                <el-tag :type="row.Sex==1?'':'danger'">{{ row.Sex_CN }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Identity_CN" align="center" label="身份" />
            <el-table-column align="center" label="学院班级">
              <template slot-scope="{row}">
                <div v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="{row}">
                <span :style="{color: row.IsCheckIn==1?'#21b321':''}">{{ row.IsCheckIn==1?'已入住':'未入住' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :total="addQuery.PageTotal" :page.sync="addQuery.PageIndex" :limit.sync="addQuery.PageSize" @pagination="getPagination" />
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { QueryUserList } from '@/api/UserInfo'
import pagination from '@/components/Pagination'
export default {
  components: { pagination },
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
      props: {
        label: 'Name',
        children: 'Childs'
      },
      userList: [],
      addQuery: {
        PageTotal: 0,
        PageIndex: 1,
        PageSize: 10
      },
      list: {},
      selectData: [],
      boyList: [],
      girlList: [],
      xy: []
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    },
    sexList() {
      return this.$store.getters.sexList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.list = {}
        this.selectData = []
        this.getSex()
        this.queryList()
      }
    }
  },
  methods: {
    submitAdd() {
      this.$emit('change', {
        selectData: this.selectData,
        boyList: this.boyList,
        girlList: this.girlList,
        xy: this.xy
      })
      this.close()
    },
    getSex() {
      this.boyList = []
      this.girlList = []
      this.xy = []
      var xy = []
      this.selectData.forEach(element => {
        element.UserColleges.forEach(item => {
          if (item.XYNumber != null && xy.indexOf(item.XYNumber) == -1) {
            xy.push(item.XYNumber)
            this.xy.push(item.XYName)
          }
        })
        if (element.Sex == 1) {
          this.boyList.push(element)
        }
        if (element.Sex == 2) {
          this.girlList.push(element)
        }
      })
    },
    selectAll(arr) {
      if (arr.length > 0) {
        this.selectData = this.selectData.concat(arr)
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (this.selectData[i].Id === this.userList[j].Id) {
              this.selectData.splice(i, 1)
            }
          }
        }
      }
      this.getSex()
    },
    selectChange(arr, row) {
      if (this.selectData.length > 0) {
        const arr = this.selectData.filter(item => {
          return item.Id === row.Id
        })
        if (arr.length > 0) {
          for (let i = 0; i < this.selectData.length; i++) {
            if (this.selectData[i].Id === row.Id) {
              this.selectData.splice(i, 1)
            }
          }
        } else {
          this.selectData.push(row)
        }
      } else {
        this.selectData.push(row)
      }
      this.getSex()
    },
    queryList() {
      this.addQuery.PageIndex = 1
      this.GetUserList()
    },
    GetUserList() {
      var that = this
      console.log(this.$refs.college.getCheckedNodes())
      var getCheckedNodes = this.$refs.college.getCheckedNodes()
      var CollegeNumber = getCheckedNodes.map(item => {
        return item.YL
      })
      var data = {
        Identity: this.list.Identity,
        Condition: this.list.Condition,
        Sex: this.list.Sex,
        isCheckIn: this.list.isCheckIn,
        FilterInfo:
          CollegeNumber.length > 0
            ? {
                Logic: 1,
                Field: '',
                Operator: 0,
                Filters: [
                  {
                    Logic: 1,
                    Field: 'UserColleges.CollegeNumber',
                    Operator: 14,
                    value: CollegeNumber,
                    Filters: []
                  }
                ]
              }
            : null,
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
        setTimeout(() => {
          that.selectData.forEach(item => {
            that.userList.forEach(listitem => {
              if (item.Id === listitem.Id) {
                that.$refs.table.toggleRowSelection(listitem, true)
              }
            })
          })
        }, 0)
      })
    },
    getPagination(val) {
      this.addQuery.PageSize = val.limit
      this.addQuery.PageIndex = val.page
      this.GetUserList()
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.btmg {
  background: #ecf5ff;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 15px;
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
}
</style>