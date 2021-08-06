<template>
  <div style="display: inline-block;" class="import">
    <el-button type="success" icon="el-icon-upload" :disabled="disabled" @click="batchpsn=true">{{ btnName }}</el-button>
    <el-dialog title="批量导入" :visible.sync="batchpsn" width="400px" :before-close="taggleshow">
      <div>
        <!-- <el-upload v-loading="importLoading" class="upload-demo" drag action :on-change="handleOnChangeFile" :http-request="handleUpLoadExcel" :show-file-list="false"> -->
        <el-upload v-loading="importLoading" class="upload-demo" drag :action="apiPath+importApi" :on-success="handleSuccess" :headers="headers" :on-progress="handleProgress" :on-error="handleError" :before-upload="beforeUpload" :show-file-list="progressShow">
          <i class="el-icon-upload" />
          <div class="el-upload__text" style="line-height: 0px;">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <!-- <div v-if="progressShow" class="progress">
        <div class="progress-line">
          <el-progress :stroke-width="3" :percentage="progressNumber" status="success"></el-progress>
        </div>
      </div> -->
      <div style="text-align: right;margin-top: 20px;">
        <treeselect :load-options="loadOptions" style="width: 250px;  display: inline-block; vertical-align: bottom;" :clearable="true" :options="treeData" no-options-text="无" value-consists-of="BRANCH_PRIORITY" :normalizer="normalizer" placeholder="请选择楼栋" @select="selects" @input="inputs" />
        <el-button type="primary" @click="downloadTemplate">下载模板</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import Treeselect from '@riophae/vue-treeselect'
import { GetConstructNextTree } from '@/api/Construct'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getConditions } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  components: { Treeselect },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    downloadName: {
      type: String,
      default: '导入模板'
    },
    btnName: {
      type: String,
      default: '批量导入'
    },
    importApi: {
      // 导入
      type: String,
      default: ''
    },
    downloadApi: {
      // 下载
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      apiPath: window.apiPath,
      status: 'success',
      treeData: [],
      formInline: {},
      batchpsn: false,
      dialogShow: false,
      upLoadFile: null,
      importLoading: false, // 导入完成再解除，防止一堆乱导入
      downLoading: false, // 防止疯狂点击下载模版按钮
      progressNumber: 0, // 进度条进度
      progressShow: false, // 显示进度条
      changeImport: false // 判断时候进行过导入程序
    }
  },
  mounted() {
    this.GetContextTree('-1')
  },
  methods: {
    handleSuccess(res, file) {
      console.log(res, file)
      if (res.BS === 2) {
        this.$message.success({
          message: '导入成功',
          type: 'success',
          onClose: () => {
            this.progressShow = false
            this.status = 'success'
            this.upLoadFile = null
          }
        })
        this.$emit('getData')
        this.taggleshow()
      } else {
        this.progressShow = false
        this.importLoading = false
        this.$message.error('导入失败')
      }
    },
    beforeUpload(file) {
      const reg = RegExp(/\.*(.xlsx|.xls)$/)
      return reg.test(file.name)
    },
    handleError(err, file, fileList) {
      this.progressShow = false
      this.importLoading = false
      this.$message.error('导入异常')
      console.log(err, file, fileList)
    },
    handleProgress(event, file, fileList) {
      console.log(event, file, fileList)
      this.progressShow = true
    },
    normalizer(node) {
      return {
        id: node.Id,
        label: node.Name,
        children: node.Children
      }
    },
    GetContextTree(id) {
      GetConstructNextTree({
        id: id
      }).then(res => {
        this.treeData = res.Data
      })
    },
    selects(node, l) {
      this.formInline.ConstructFullNumber = node.Number
    },
    inputs(node, l) {
      if (node === undefined) {
        this.formInline.ConstructFullNumber = ''
      }
    },
    loadOptions({ action, parentNode, callback }) {
      if (parentNode.Tag < 7) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          GetConstructNextTree({
            id: parentNode.Id
          }).then(res => {
            parentNode.Children = res.Data
            callback()
          })
        }
      } else {
        parentNode.Children = []
        callback()
      }
    },
    taggleshow() {
      this.batchpsn = false
    },
    handleUpLoadExcel(file) {
      if (this.upLoadFile) {
        const excelForm = new FormData()
        excelForm.append('file', this.upLoadFile.raw)
        this.importLoading = true
        this.progressShow = true
        this.changeImport = true
        request({
          url: this.importApi,
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: excelForm,
          onUploadProgress: progressEvent => {
            const num = ((progressEvent.loaded / progressEvent.total) * 100) | 0 // 百分比
            this.progressNumber = num
            // file.onProgress({ percent: num }); // 关闭内置进度条
          }
        })
          .then(res => {
            this.importLoading = false
            if (res) {
              this.$message.success({
                message: '导入成功',
                type: 'success',
                onClose: () => {
                  this.progressShow = false
                  this.upLoadFile = null
                }
              })
              this.$emit('getData')
              this.taggleshow()
            }
          })
          .catch(() => {
            this.progressShow = false
            this.importLoading = false
            this.$message.error('出现错误')
          })
      } else {
        return false
      }
    },
    // 监听上传的文件 -- 先处理文件
    handleOnChangeFile(file) {
      const reg = RegExp(/\.*(.xlsx|.xls)$/)
      if (reg.test(file.name)) {
        this.upLoadFile = file
      } else {
        this.$message.error('文件格式错误,请上传.xls或.xlsx格式文件')
      }
    },
    // 下载模板
    downloadTemplate() {
      this.downLoading = true
      var data = {}
      if (this.downloadName === '入住导入模板') {
        data = {
          values:
            this.formInline.ConstructFullNumber === ''
              ? []
              : [this.formInline.ConstructFullNumber]
        }
      } else {
        var conditions = []
        conditions = getConditions(conditions, this.formInline)
        data = {
          conditions: conditions,
          page: {
            pageSize: 10,
            currentPage: 1,
            orderproperty: '',
            order: ''
          }
        }
      }
      request({
        url: this.downloadApi,
        method: 'post',
        responseType: 'blob',
        data: data
      }).then(res => {
        if (res) {
          const blob = new Blob([res]) // 处理文档流
          const elink = document.createElement('a')
          const fileName = `${this.downloadName}.xls`
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          this.$message.error('下载错误')
        }
        this.downLoading = false
      })
    }
  }
}
</script>
<style lang='scss'>
.import .el-dialog__header {
  border-bottom: none !important;
}
.progress {
  padding-top: 10px;
  .title {
    padding-right: 10px;
  }
  .progress-line {
    padding-top: 10px;
  }
}
</style>
