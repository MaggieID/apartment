<template>
  <div class="modifyDialog">
    <el-dialog :visible.sync="value" :title="'教职工'+addSign?'新增':'修改'" :before-close="cancel" :modal="false" width="1000px">
      <el-form ref="form" :model="form" :rules="formRule" label-position="top">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="1">
            <div style="height:460px">
              <el-scrollbar style="height:100%">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="账号" prop="Account">
                      <el-input v-model="form.Account" maxlength="30" show-word-limit clearable placeholder="请输入账号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="addSign" :span="8">
                    <el-form-item label="密码" prop="Password">
                      <el-input v-model="form.Password" type="password" clearable placeholder="请输入密码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="姓名" prop="Name">
                      <el-input v-model="form.Name" maxlength="10" show-word-limit clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="曾用名" prop="UsedName">
                      <el-input v-model="form.UsedName" clearable placeholder="请输入曾用名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="职工号" prop="Number">
                      <el-input v-model="form.Number" clearable placeholder="请输入用户编码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="性别" prop="Sex">
                      <el-select v-model="form.Sex" filterable clearable>
                        <el-option v-for="item in data.SEXList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="籍贯" prop="NativePlace">
                      <el-cascader v-model="form.NativePlace" popper-class="cascader" clearable :props="{ checkStrictly: true,value:'Code',label:'CName',children:'Childs' }" filterable :options="data.NATIVEPLACEList"></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="民族" prop="Race">
                      <el-select v-model="form.Race" filterable clearable>
                        <el-option v-for="item in data.NATIONList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="政治面貌" prop="Politics">
                      <el-select v-model="form.Politics" filterable clearable>
                        <el-option v-for="item in data.ZZMMList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件类型" prop="IdentificationType">
                      <el-select v-model="form.IdentificationType" filterable clearable>
                        <el-option v-for="item in data.SFZJLXList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件号码" prop="IdentificationNumber">
                      <el-input v-model="form.IdentificationNumber" clearable placeholder="请输入证件号码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="婚姻状态" prop="Marriage">
                      <treeselect v-model="form.Marriage" clearable :options="data.MARRIAGEList" :normalizer="normalizer" placeholder="请选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="生日" prop="Birthday">
                      <el-date-picker v-model="form.Birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出生地" prop="BirthAddr">
                      <el-input v-model="form.BirthAddr" clearable placeholder="请输入出生地"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="住址" prop="Addr">
                      <el-input v-model="form.Addr" clearable placeholder="请输入住址"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="手机" prop="Phone">
                      <el-input v-model="form.Phone" clearable placeholder="请输入手机"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮箱" prop="Email">
                      <el-input v-model="form.Email" clearable placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="部门" prop="DepartmentIds">
                      <treeselect v-model="form.DepartmentIds" clearable multiple value-consists-of="LEAF_PRIORITY" :options="data.departmentList" :normalizer="normalizer1" placeholder="请选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="教师状态" prop="TeaSatus">
                      <treeselect v-model="form.TeaSatus" clearable :options="data.JZGDQZTList" :normalizer="normalizer" placeholder="请选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="学院" prop="CollegeIds">
                      <treeselect v-model="form.CollegeIds" clearable multiple value-consists-of="LEAF_PRIORITY" :options="data.collegeList" :normalizer="normalizer1" placeholder="请选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="教师类型" prop="TeaCategory">
                      <treeselect v-model="form.TeaCategory" clearable :options="data.JZGLBList" :normalizer="normalizer" placeholder="请选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="国籍" prop="Nationality">
                      <el-select v-model="form.Nationality" filterable clearable>
                        <el-option v-for="item in data.COUNTRYList" :key="item.Code" :label="item.CName" :value="item.Code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="标签" prop="LabelIds">
                      <el-select v-model="form.LabelIds" multiple filterable clearable>
                        <el-option v-for="item in data.labels" :key="item.Id" :label="item.LabelName" :value="item.Id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="备注" prop="Remark">
                      <el-input v-model="form.Remark" clearable placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="上传图片">
                      <el-upload class="avatar-uploader" :action="imgReqPath+'/Api/Comm/File/UploadPhotoFile'" :show-file-list="false" list-type="picture-card" :on-success="handlePhotoSuccess" :before-upload="beforePhotoUpload">
                        <div v-if="imageUrl!=null" class="show-avatar">
                          <img :src="imageUrl" alt="照片" class="avatar">
                          <div class="handle-wrap" @click.stop="()=>{}">
                            <i class="el-icon-zoom-in" @click.stop="handlePictureCardPreview(imageUrl)"></i>
                            <i class="el-icon-delete" @click.stop="handleRemove"></i>
                          </div>
                        </div>
                        <i v-else class="el-icon-plus avatar-uploader-icon" />
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="4">
            <div style="height:460px">
              <el-scrollbar style="height:100%">
                <el-row :gutter="20">
                  <el-col v-for="(element,i) in sortable" :key="element.TypeId" :span="8">
                    <form-render :index="i" :ele="element" width="100%" :data="form" />
                  </el-col>
                </el-row>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看大图" :visible.sync="previewImageVisible">
      <img width="100%" :src="previewImageUrl" alt="big_image">
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import { RegisterTeacher, UpdateTeacherInfo } from '@/api/UserInfo'
import FormRender from '@/components/FormRender'
export default {
  components: { Treeselect, FormRender },
  props: {
    value: Boolean,
    addSign: Boolean,
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    college: {
      type: Array,
      default: () => {
        return []
      }
    },
    department: {
      type: Array,
      default: () => {
        return []
      }
    },
    templateInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '1',
      imageUrl: null,
      previewImageUrl: '',
      previewImageVisible: false,
      loading: false,
      imgReqPath: window.apiPath,
      formRule: {
        Account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        Password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能少于六位数', trigger: 'blur' }
        ],
        Name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        Sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        Phone: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ],
        Email: [
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ]
      },
      formData: {},
      sortable: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.imageUrl = this.addSign ? null : this.form.PhotoPath
        this.formData = {}
        console.log(this.templateInfo)
        this.sortable = this.templateInfo.TemplateExtCols
        this.sortable.map((val, index) => {
          val.TypeId = val.Id.toString()
          this.$set(
            this.formData,
            val.Id.toString(),
            val.DefaultValue != null ? JSON.parse(val.DefaultValue) : ''
          )
          this.$set(
            this.form,
            val.Id.toString(),
            val.DefaultValue != null
              ? JSON.parse(val.DefaultValue)
              : val.ControlType == 2
              ? []
              : null
          )
          if (!this.addSign) {
            for (var key in this.form.UserProps) {
              if (val.FieldKey == key) {
                console.log(val.FieldKey, key)
                this.$set(
                  this.formData,
                  val.Id.toString(),
                  JSON.parse(this.form.UserProps[key])
                )
                this.$set(
                  this.form,
                  val.Id.toString(),
                  JSON.parse(this.form.UserProps[key])
                )
              }
            }
          }
        })
      }
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.loading = false
      this.$emit('input', false)
    },
    submitAdd() {
      var that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.loading) {
            return
          }
          this.loading = true
          var data = JSON.parse(JSON.stringify(this.form))
          for (var key in this.formData) {
            this.formData[key] =
              this.form[key] == '' ? null : JSON.stringify(this.form[key])
          }
          var form = {
            Id: data.Id,
            Name: data.Name,
            Number: data.Number,
            Sex: data.Sex,
            Identity: data.Identity,
            IdentificationType: data.IdentificationType,
            IdentificationNumber: data.IdentificationNumber,
            Birthday: data.Birthday,
            BirthAddr: data.BirthAddr,
            Nationality: data.Nationality,
            NativePlace: data.NativePlace ? data.NativePlace.join(',') : '',
            Race: data.Race,
            Marriage: data.Marriage,
            Politics: data.Politics,
            Addr: data.Addr,
            Remark: data.Remark,
            TeaCategory: data.TeaCategory,
            TeaSatus: data.TeaSatus,
            UsedName: data.UsedName,
            PhotoId: data.PhotoId,
            Account: data.Account,
            Password: data.Password,
            Phone: data.Phone,
            Email: data.Email,
            CollegeIds: data.CollegeIds,
            DepartmentIds: data.DepartmentIds,
            LabelIds: data.LabelIds,
            ProExts: {
              TemplateId: this.templateInfo.Id.toString(),
              PropertyValue: this.formData
            }
          }
          console.log(form)
          if (this.addSign) {
            RegisterTeacher(form)
              .then(res => {
                that.saveRes(res)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            UpdateTeacherInfo(form)
              .then(res => {
                that.saveRes(res)
              })
              .catch(() => {
                this.loading = false
              })
          }
        } else {
          this.$message({
            message: '必填项为空,无法提交',
            type: 'warning'
          })
        }
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
        this.$emit('getList')
      } else {
        this.$message.error(res.Message)
      }
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.imageUrl = null
      this.form.PhotoId = null
    },
    // 点击查看大图
    handlePictureCardPreview(url) {
      this.previewImageUrl = url
      this.previewImageVisible = true
    },
    handlePhotoSuccess(res, file) {
      if (res.BS === 1) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.PhotoId = res.Data[0]
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.Message)
      }
    },
    beforePhotoUpload(file) {
      // eslint-disable-next-line eqeqeq
      const isJPG = file.type == 'image/jpeg' || 'image/png' || 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG / PNG / GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    normalizer1(node) {
      return {
        id: node.Id,
        label: node.Name,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    normalizer(node) {
      return {
        id: node.Code,
        label: node.CName,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    }
  }
}
</script>
<style lang="scss">
::v-deep .el-dialog__body {
  height: 560px;
}
.cascader {
  height: 300px;
  .el-cascader-panel {
    height: 100% !important;
  }
}
.modifyDialog .el-col-8 {
  height: 105px;
}
</style>
