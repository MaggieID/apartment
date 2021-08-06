<template>
  <div>
    <el-dialog title="修改数据" append-to-body :visible.sync="value" width="800px" :before-close="close">
      <el-row class="m-search">
        <el-form ref="form" :model="form" label-width="80px">
          <template v-for="(formitem,index) in ResultInfo">
            <el-col :key="index" :span="12">
              <el-form-item :label="labels[formitem.ColName]" :class="{'is-error':formitem.AnalyseResult==0}">
                <el-input v-model="form[formitem.ColName]" :rows="4" :type="(formitem.ColName=='CollegeFullPath'||formitem.ColName=='ConstructFullPath')?'textarea':'text'">
                  <i v-if="formitem.ColName=='UserName'" slot="suffix" class="el-input__icon el-icon-edit" @click="addUser"></i>
                </el-input>
                <div v-if="formitem.AnalyseResult==0" class="el-form-item__error">{{ formitem.ResultExplain }}</div>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择退宿人员" :visible.sync="userVisible" :modal="false" width="1200px" @before-close="userVisible=false">
      <div style=" height: 450px;">
        <el-scrollbar style="height:100%">
          <div style="padding: 0 20px;">
            <el-form inline :model="list" label-width="55px">
              <el-form-item>
                <el-input v-model="list.Condition" clearable placeholder="请输入姓名/学工号" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="list.Sex" clearable placeholder="请选择人员性别">
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
            <el-table :data="userList" stripe style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
              <el-table-column prop="UserName" align="center" label="姓名" />
              <el-table-column prop="UserNumber" align="center" label="学工号" />
              <el-table-column align="center" label="性别">
                <template slot-scope="{row}">
                  <el-tag :type="row.Sex==1?'':'danger'">{{ row.Sex_CN }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="Identity_CN" align="center" label="身份" />
              <el-table-column align="center" label="学院班级" min-width="150">
                <template slot-scope="{row}">
                  <div v-for="tag in row.UserColleges" :key="tag.CollegeId" style="margin-right:5px">{{ tag.CollegeName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="BedName" align="center" label="床位号" />
              <el-table-column prop="BedSex" align="center" label="床位性别" />
              <el-table-column prop="ConstructFullPath" align="center" label="楼栋路径" min-width="200" />
            </el-table>
            <pagination :total="addQuery.PageTotal" :page.sync="addQuery.PageIndex" :limit.sync="addQuery.PageSize" @pagination="getPagination" />
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="userComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { BatchSetExcelBatchTS, GetTSAnalyseResultInfo } from '@/api/LiveInfo'
import pagination from '@/components/Pagination'
import { GetContractLiveInfo } from '@/api/LiveOperation'
export default {
  components: {
    pagination
  },
  props: {
    value: Boolean,
    listInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {},
      loading: false,
      ResultInfo: [],
      labels: {
        UserName: '姓名',
        BedName: '床位号',
        UserNumber: '编号',
        BedSex: '床位性别',
        UserSex: '人员性别',
        LiveState: '床位状态',
        CollegeFullPath: '学院班级',
        ConstructFullPath: '床位路径'
      },
      userVisible: false,
      list: {},
      addQuery: {
        PageTotal: 0,
        PageIndex: 1,
        PageSize: 10
      },
      userList: [],
      currentRow: null,
      bedInfo: null
    }
  },
  computed: {
    sexList() {
      return this.$store.getters.sexList
    },
    IdentityData() {
      return this.$store.getters.IdentityData
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.form = JSON.parse(JSON.stringify(this.listInfo))
        })
        this.GetTSAnalyseResultInfo()
      }
    }
  },
  methods: {
    change(row) {
      console.log(row)
      if (row == null) {
        this.bedInfo = null
      } else {
        this.bedInfo = row
      }
    },
    userComfirm() {
      if (this.currentRow == null) {
        this.$message.error('请选择人员')
        return
      }
      this.userVisible = false
      this.form.UserId = this.currentRow.UserId
      this.form.UserName = this.currentRow.UserName
      this.form.UserSex = this.currentRow.Sex_CN
      this.form.UserNumber = this.currentRow.UserNumber
      this.form.CollegeFullPath =
        this.currentRow.UserColleges.length > 0
          ? this.currentRow.UserColleges[0].CollegePath
          : ''
      this.form.BedId = this.currentRow.BedId
      this.form.BedName = this.currentRow.BedName
      this.form.BedSex = this.currentRow.BedSex_CN
      this.form.LiveState = this.currentRow.BedLiveState_CN
      this.form.ConstructFullPath = this.currentRow.ConstructFullPath
    },
    // 添加人员按钮
    addUser() {
      this.userVisible = true
      this.currentRow = null
      this.queryList()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    queryList() {
      this.addQuery.PageIndex = 1
      this.GetUserList()
    },
    GetUserList() {
      var data = {
        nameOrNumber: this.list.Condition,
        userSex: this.list.Sex,
        identity: this.list.Identity,
        filterInfo: null,
        AppPage: {
          Size: this.addQuery.PageSize,
          Index: this.addQuery.PageIndex,
          OrderPro: '',
          Order: ''
        }
      }
      GetContractLiveInfo(data).then(res => {
        this.userList = res.Data
        this.addQuery.PageTotal = res.Totals
      })
    },
    getPagination(val) {
      this.addQuery.PageSize = val.limit
      this.addQuery.PageIndex = val.page
      this.GetUserList()
    },
    normalizer1(node) {
      return {
        id: node.FullPath,
        label: node.Name,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    GetTSAnalyseResultInfo() {
      GetTSAnalyseResultInfo({
        key: this.listInfo.ID
      }).then(res => {
        var keys = []
        for (const key in this.labels) {
          keys.push(key)
        }
        var ResultInfo = []
        for (let i = 0; i < keys.length; i++) {
          for (let j = 0; j < res.Data.length; j++) {
            if (res.Data[j].ColName == keys[i]) {
              ResultInfo.push(res.Data[j])
            }
          }
        }
        this.ResultInfo = ResultInfo
      })
    },
    submitAdd() {
      if (this.loading) {
        return
      }
      this.loading = true
      console.log(this.form)
      // debugger
      BatchSetExcelBatchTS({
        models: [this.form]
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
        this.$emit('input', false)
        this.$emit('getData')
      } else {
        this.$message.error(res.Message)
      }
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>