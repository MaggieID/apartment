<template>
  <div>
    <el-dialog :title="currentItem.DefaultName+addSign?'新增':'修改'" :modal="false" :before-close="cancel" :visible.sync="value" width="750px">
      <div>
        <el-scrollbar style="height:100%">
          <el-form ref="form" style="padding-right: 100px;" :model="form" label-width="120px" :rules="formRule">
            <el-form-item :label="currentItem.DefaultName +'名称'" prop="ConstructName">
              <el-input v-model="form.ConstructName" class="formItem" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum!=0" prop="ParentId" label="所属节点">
              <el-select v-model="form.ParentId" class="formItem">
                <el-option v-for="item in parentList" :key="item.Id" :label="item.ConstructName" :value="item.Id">{{ item.ConstructFullPath }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="currentItem.DefaultName +'标签'" prop="LabelIds">
              <el-select v-model="form.LabelIds" multiple class="formItem">
                <el-option v-for="item in labelList" :key="item.Id" :label="item.LabelName" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum==9" prop="bedLiveType" label="床位类型">
              <el-select v-model="form.bedLiveType" class="formItem">
                <el-option label="一人一床" :value="0"></el-option>
                <el-option label="多人一床" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum==4" prop="Count" label="楼层数量">
              <el-input v-model.number="form.Count" class="formItem" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum==8" prop="Count" label="床位数量">
              <el-input v-model.number="form.Count" class="formItem" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum==8||currentItem.StructureEnum==9" prop="Sex" :label="currentItem.DefaultName +'性别'">
              <el-select v-model="form.Sex" class="formItem">
                <el-option v-for="item in sexList" :key="item.Id" :label="item.CName" :value="item.Code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentItem.StructureEnum==7||currentItem.StructureEnum==8||currentItem.StructureEnum==9" prop="Price" :label="currentItem.DefaultName +'价格'">
              <el-input v-model.number="form.Price" class="formItem" placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="ConstructDescroption">
              <el-input v-model="form.ConstructDescroption" type="textarea" class="formItem" placeholder="请输入"></el-input>
            </el-form-item>
            <form-render v-for="(element,i) in sortable_item" :key="element.TypeId" :index="i" :ele="element" width="100%" :data="form">
            </form-render>
            <el-form-item label="上传图片">
              <el-upload ref="upload" action="#" list-type="picture-card" :auto-upload="false" :http-request="handleUploadImg" :on-change="handleOnChange" accept=".gif, .png, .jpg, .jpeg" :file-list="fileList" :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看大图" :visible.sync="previewImageVisible">
      <img width="100%" :src="previewImageUrl" alt="big_image">
    </el-dialog>
  </div>
</template>
<script>
import {
  GetTemplateInfo,
  AddConstruct,
  UpdateConstruct,
  GetParentConstruct
} from '@/api/Construct'
import FormRender from '@/components/FormRender'
import { GetDics } from '@/api/Dic'
import { UploadPhotoFile } from '@/api/UserInfo'
export default {
  components: {
    FormRender
  },
  props: {
    value: Boolean,
    currentItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    addSign: Boolean,
    types: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      ConstructSex: 0,
      previewImageUrl: '',
      previewImageVisible: false,
      loading: false,
      formRule: {
        ConstructName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        ParentId: [
          { required: true, message: '请选择归属上级', trigger: 'change' }
        ],
        Count: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字值' }
        ],
        Price: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字值' }
        ],
        Sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      sortable_item: [],
      formData: {},
      templateInfo: {},
      parentList: [],
      fileList: [],
      newImgs: []
    }
  },
  computed: {
    sexList() {
      return this.$store.getters.sexList
    },
    labelList() {
      return this.$store.getters.labelList
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.fileList = []
        this.newImgs = []
        this.form.PhotoIds = []
        if (!this.addSign) {
          this.form.photos.forEach(element => {
            this.form.PhotoIds.push(element.FileId)
            this.fileList.push({
              name: element.FileId,
              url: element.FilePath
            })
          })
          console.log(this.fileList, this.form.PhotoIds)
        }
        this.GetTemplateInfo()
        this.GetParentConstruct()
      }
    }
  },
  mounted() {
    this.$store.dispatch('actions/getSex')
    this.$store.dispatch('actions/GetLabels', 0)
  },
  methods: {
    GetParentConstruct() {
      GetParentConstruct({
        StructureId: this.form.StructureId
      }).then(res => {
        this.parentList = res.Data
        // console.log(this.currentItem, this.parentList)
        if (this.currentItem.StructureEnum == 0) {
          this.form.ParentId = res.Data[0].Id
        }
      })
    },
    GetTemplateInfo() {
      GetTemplateInfo({
        typeName: this.types[this.currentItem.StructureEnum]
      }).then(res => {
        if (res.BS == 1) {
          // console.log(res.Data)
          this.templateInfo = res.Data
          this.sortable_item = res.Data.TemplateExtCols
          this.formData = {}
          this.sortable_item.map((val, index) => {
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
                : ''
            )
            if (!this.addSign) {
              for (var key in this.form.Pairs) {
                if (val.FieldKey == key) {
                  this.$set(
                    this.formData,
                    val.Id.toString(),
                    JSON.parse(this.form.Pairs[key])
                  )
                  this.$set(
                    this.form,
                    val.Id.toString(),
                    JSON.parse(this.form.Pairs[key])
                  )
                }
              }
            }
            if (val.Items == null) {
              if (
                val.ControlType == 2 ||
                val.ControlType == 4 ||
                val.ControlType == 1
              ) {
                val.Items = []
              }
            }
            if (val.BindingDicKey != null) {
              GetDics({
                number: val.BindingDicKey
              }).then(res => {
                val.Items = res.Data
              })
            }
          })
        }
      })
    },
    cancel() {
      this.loading = false
      this.$emit('input', false)
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList.splice(
        this.fileList.findIndex(item => item.uid === file.uid),
        1
      )
    },
    // 上传照片到本地
    handleOnChange(file, fileList) {
      if (
        !(
          file.raw.type == 'image/jpeg' ||
          file.raw.type == 'image/jpg' ||
          file.raw.type == 'image/png' ||
          file.raw.type == 'image/gif'
        )
      ) {
        this.$message({
          type: 'warning',
          message: '请选择图片格式:jpeg/jpg/png/gif'
        })
        fileList.pop()
        return
      }
      const existFile = fileList
        .slice(0, fileList.length - 1)
        .find(f => f.name === file.name)
      if (existFile) {
        this.$message({
          type: 'warning',
          message: '当前图片已经存在'
        })
        fileList.pop()
      } else {
        this.fileList = fileList
      }
    },
    // 自定义上传照片
    handleUploadImg(params) {
      // console.log(params.file)
      this.newImgs.push(params.file)
      if (
        this.newImgs.length ===
        this.fileList.length - this.form.PhotoIds.length
      ) {
        const parm = new FormData()
        this.newImgs.forEach(item => {
          console.log(item)
          parm.append('file', item)
        })
        console.log(parm)
        UploadPhotoFile(parm).then(res => {
          console.log(res)
          if (res.BS === 1) {
            this.form.PhotoIds = this.form.PhotoIds.concat(res.Data)
            this.submitAdd()
          }
        })
      }
    },
    // 点击查看大图
    handlePictureCardPreview(url) {
      this.previewImageUrl = url
      this.previewImageVisible = true
    },
    submitUpload() {
      // if (this.loading) return
      this.$refs.upload.submit()
      if (this.form.PhotoIds.length === this.fileList.length) {
        this.submitAdd()
      }
    },
    // 保存
    submitAdd() {
      var that = this
      console.log(this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          for (var key in this.formData) {
            this.formData[key] =
              this.form[key] == '' ? null : JSON.stringify(this.form[key])
          }
          // console.log(this.form, this.formData)
          var data = {
            ConstructId: this.form.ConstructId,
            StructureId: this.form.StructureId,
            ConstructName: this.form.ConstructName,
            ConstructSort: this.form.ConstructSort,
            ConstructDescroption: this.form.ConstructDescroption,
            ParentId: this.form.ParentId,
            Price: this.form.Price,
            Count: this.form.Count,
            Sex: this.form.Sex,
            LabelIds: this.form.LabelIds,
            PhotoIds: this.form.PhotoIds,
            bedLiveType: this.form.bedLiveType,
            ProExts: {
              TemplateId: this.templateInfo.Id.toString(),
              PropertyValue: this.formData
            }
          }
          // console.log(data)
          if (this.addSign) {
            AddConstruct(data)
              .then(res => {
                that.saveRes(res)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            UpdateConstruct(data)
              .then(res => {
                that.saveRes(res)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    saveRes(res) {
      this.loading = false
      // console.log(res)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.formItem {
  width: 100%;
}
</style>

