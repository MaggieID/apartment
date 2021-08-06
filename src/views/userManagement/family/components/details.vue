<template>
  <div>
    <el-dialog :visible.sync="value" title="教职工详情" :before-close="cancel" :modal="false" width="1000px">
      <el-form label-position="right" label-width="120px" class="detail">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="1">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <div style="display: flex;">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="姓名："> {{ data.Name }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="曾用名：">{{ data.UsedName }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="职工号："> {{ data.Number }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="性别："> {{ data.Sex_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="教师状态："> {{ data.TeaSatus_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="教师类别："> {{ data.TeaCategory_CN }} </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="标签：">
                        <el-tag v-for="tag in data.UserLabels" :key="tag.LabelId" style="margin-right:5px">{{ tag.LabelName }}</el-tag>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div style="width: 350px;">
                    <el-image style="width:150px;height:200px" :src="data.PhotoPath" :preview-src-list="[data.PhotoPath]"></el-image>
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
                    <!-- <el-col :span="8">
                      <el-form-item label="班主任："> 最广泛的 </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="辅导员："> 最广泛的 </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item v-if="item.Type==1" label="办公室主任："> 最广泛的 </el-form-item>
                      <el-form-item v-if="item.Type==0" label="班长："> 最广泛的 </el-form-item>
                    </el-col> -->
                  </el-row>
                  <el-divider v-if="index!=depAnColl.length-1"></el-divider>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="住宿信息" name="3">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="净身高："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="体重："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="兴趣爱好："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="特长："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性格："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="年龄："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮编："> 最广泛的 </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="健康状况："> 最广泛的 </el-form-item>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="扩展信息" name="4">
            <div class="detailsinfo">
              <el-scrollbar style="height:100%">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="账号："> {{ data.Account }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="国籍："> {{ data.Nationality_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="籍贯："> {{ data.NativePlace_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="民族："> {{ data.Race_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="政治面貌："> {{ data.Politics_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件类型："> {{ data.IdentificationType_CN }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件号码："> {{ data.IdentificationNumber }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="手机："> {{ data.Phone }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="住址："> {{ data.Addr }} </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮箱："> {{ data.Email }} </el-form-item>
                  </el-col>
                </el-row>
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
  QueryUserProExtInfo
} from '@/api/UserInfo'

export default {
  filters: {
    tojson(val) {
      if (!val) return
      var show = JSON.parse(val)
      if (typeof JSON.parse(val) == 'object') {
        show = show.join(',')
      }
      return show
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
      proExtInfo: [],
      ownRoleInfo: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.activeName = '1'
        this.QueryUserDepAnColl()
        this.QueryUserOwnRoleInfo()
        this.QueryUserProExtInfo()
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('input', false)
    },
    QueryUserDepAnColl() {
      QueryUserDepAnColl({
        userId: this.data.Id
      }).then(res => {
        this.depAnColl = res.Data
      })
    },
    QueryUserOwnRoleInfo() {
      QueryUserOwnRoleInfo({
        userId: this.data.Id
      }).then(res => {
        this.ownRoleInfo = res.Data
      })
    },
    QueryUserProExtInfo() {
      QueryUserProExtInfo({
        userId: this.data.Id
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
}
</style>
