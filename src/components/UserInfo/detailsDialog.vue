<template>
  <div>
    <el-dialog :visible.sync="value" :title="userInfo.Identity_CN+'详情'" :before-close="cancel" :modal="false" width="1000px">
      <el-form label-width="120px" class="detail">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="1">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <div style="display: flex;">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="姓名："> {{ userInfo.Name }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="曾用名：">{{ userInfo.UsedName }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="编号："> {{ userInfo.Number }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="身份："> {{ userInfo.Identity_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="性别："> {{ userInfo.Sex_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="入学时间："> {{ userInfo.StartSchoolTime }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="学制："> {{ userInfo.StudyingYear_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="学生状态："> {{ userInfo.StuSatus_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="学生类别："> {{ userInfo.StuCategory_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="标签：">
                        <el-tag v-for="tag in userInfo.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div style="width: 350px;">
                    <el-image style="width:150px;height:200px" :src="userInfo.PhotoPath" :preview-src-list="[userInfo.PhotoPath]"></el-image>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="学院部门" name="2">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <div v-for="(item,index) in depAnColl " :key="index">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="item.Type==0?'部门：':'学院：'">{{ item.Path }} </el-form-item>
                    </el-col>
                    <el-col v-for="manager in item.Manager" :key="manager.RoleId" :span="8">
                      <el-form-item :label="manager.RoleName+'：'"> {{ manager.UserName }} </el-form-item>
                    </el-col>
                  </el-row>
                  <el-divider v-if="index!=depAnColl.length-1"></el-divider>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="住宿信息" name="3">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <div>
                  <span class="letfBorder">是否住宿：</span>
                  <span>
                    <el-tag v-if="userInfo.IsCheckIn==1" type="success">是</el-tag>
                    <el-tag v-if="userInfo.IsCheckIn==0" type="danger">否</el-tag>
                  </span>
                </div>
                <div>
                  <span class="letfBorder">住宿信息：</span>
                  <div v-for="(item,index) in LiveInfo " :key="index">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="床位路径："> {{ item.BedFullPath }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="入住日期："> {{ item.CheckInTime| parseTime }} </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="预计退宿时间："> {{ item.EstimatedEndTime| parseTime }} </el-form-item>
                      </el-col>
                      <el-col v-for="(manager,index1) in item.Manager" :key="index1" :span="8">
                        <el-form-item :label="manager.RoleName+'：'"> {{ manager.UserName }} </el-form-item>
                      </el-col>
                    </el-row>
                    <el-divider v-if="index!=LiveInfo.length-1"></el-divider>
                  </div>
                </div>
                <div>
                  <span class="letfBorder">床位历史：</span>
                  <el-table :data="HisInfo" stripe header-row-class-name="table" style="width: 100%;line-height: normal;">
                    <el-table-column label="床位路径" prop="BedPath" align="center"> </el-table-column>
                    <el-table-column label="床位号" prop="BedName" align="center" width="150"> </el-table-column>
                    <el-table-column label="状态" align="center" width="150">
                      <template slot-scope="{row}">
                        {{ ActionType[row.ActionType] }}
                      </template>
                    </el-table-column>
                    <el-table-column label="时间" align="center" width="150">
                      <template slot-scope="{row}">
                        {{ row.ActionTime| parseTime }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="扩展信息" name="4">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="国籍："> {{ userInfo.Nationality_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="籍贯："> {{ userInfo.NativePlace_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="民族："> {{ userInfo.Race_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="政治面貌："> {{ userInfo.Politics_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件类型："> {{ userInfo.IdentificationType_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件号码："> {{ userInfo.IdentificationNumber }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="手机："> {{ userInfo.Phone }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="住址："> {{ userInfo.Addr }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮箱："> {{ userInfo.Email }} </el-form-item>
                  </el-col>
                </el-row>
                <el-table v-if="userInfo.Identity==0" :data="EcPs" border header-row-class-name="table" style="width: 100%;line-height: normal;">
                  <el-table-column label="联系人姓名" prop="Name" align="center"> </el-table-column>
                  <el-table-column label="关系" prop="Relation" align="center"> </el-table-column>
                  <el-table-column label="电话" prop="ContactNumber" align="center"> </el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="应用角色" name="5">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <div v-for="(item,index) in ownRoleInfo" :key="index">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="'角色'+(index+1)+'：'"> {{ item.RoleName }} </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="权限范围："> {{ item.ResourceName }} </el-form-item>
                    </el-col>
                  </el-row>
                  <el-divider v-if="index!=ownRoleInfo.length-1"></el-divider>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="6">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <el-row>
                  <el-col v-for="item in proExtInfo" :key="item.ControlId" :span="8">
                    <el-form-item :label="item.FieldName+'：'"> {{ item.FieldValue|tojson }} </el-form-item>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  QueryUserDepAnColl,
  QueryUserOwnRoleInfo,
  QueryUserProExtInfo,
  QueryUserEmergencyContact,
  QueryUserLiveHisInfo,
  QueryUserLiveInfo,
  QueryUserDetails
} from '@/api/UserInfo'
import { parseTime } from '@/utils'
export default {
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
    },
    parseTime(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
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
      form: {},
      activeName: '1',
      depAnColl: [],
      EcPs: [],
      HisInfo: [],
      LiveInfo: [],
      proExtInfo: [],
      ownRoleInfo: [],
      userInfo: {}
    }
  },
  computed: {
    ActionType() {
      return this.$store.getters.ActionType
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = '1'
        this.QueryUserDepAnColl()
        this.QueryUserOwnRoleInfo()
        this.QueryUserProExtInfo()
        this.QueryUserLiveHisInfo()
        this.QueryUserLiveInfo()
        this.QueryUserDetails()
      }
    }
  },
  methods: {
    QueryUserDetails() {
      QueryUserDetails({
        UserId: this.data.UserId
      }).then(res => {
        this.userInfo = res.Data
        if (res.Data.Identity == 0) {
          this.QueryUserEmergencyContact()
        }
      })
    },
    cancel() {
      this.$emit('input', false)
    },
    QueryUserLiveHisInfo() {
      QueryUserLiveHisInfo({
        UserId: this.data.UserId
      }).then(res => {
        this.HisInfo = res.Data
      })
    },
    QueryUserLiveInfo() {
      QueryUserLiveInfo({
        UserId: this.data.UserId
      }).then(res => {
        this.LiveInfo = res.Data
      })
    },
    QueryUserEmergencyContact() {
      QueryUserEmergencyContact({
        UserId: this.data.UserId
      }).then(res => {
        this.EcPs = res.Data
      })
    },
    QueryUserDepAnColl() {
      QueryUserDepAnColl({
        UserId: this.data.UserId
      }).then(res => {
        this.depAnColl = res.Data
      })
    },
    QueryUserOwnRoleInfo() {
      QueryUserOwnRoleInfo({
        UserId: this.data.UserId
      }).then(res => {
        this.ownRoleInfo = res.Data
      })
    },
    QueryUserProExtInfo() {
      QueryUserProExtInfo({
        UserId: this.data.UserId
      }).then(res => {
        this.proExtInfo = res.Data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail {
  ::v-deep .el-form-item__label {
    color: #98989a;
  }
  .detailsinfo {
    height: 450px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .letfBorder {
    border-left: 3px solid #4783ff;
    padding-left: 5px;
    font-weight: bold;
    color: black;
    margin-left: 10px;
    display: inline-block;
    margin-bottom: 10px;
    margin-top: 20px;
  }
}
</style>
