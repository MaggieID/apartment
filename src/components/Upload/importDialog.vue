<template>
  <div style="display: inline-block;margin-right: 10px;" class="import">
    <el-button type="success" icon="el-icon-upload" :disabled="disabled" @click="batchpsn=true">{{ btnName }}</el-button>
    <el-dialog title="批量导入" :visible.sync="batchpsn" width="400px" :before-close="taggleshow">
      <div>
        <el-upload v-loading="importLoading" class="upload-demo" drag :action="apiPath+importApi" :on-success="handleSuccess" :headers="headers" :on-progress="handleProgress" :on-error="handleError" :before-upload="beforeUpload" :show-file-list="progressShow">
          <i class="el-icon-upload" />
          <div class="el-upload__text" style="line-height: 0px;">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div style="text-align: right;margin-top: 20px;">
        <el-button v-loading="downLoading" type="primary" @click="downloadTemplate">{{ `下载${downloadName}` }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export default {
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
  methods: {
    taggleshow() {
      this.batchpsn = false
    },
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
      console.log(err, file, fileList)
    },
    handleProgress(event, file, fileList) {
      console.log(event, file, fileList)
      this.progressShow = true
    },
    handleUpLoadExcel(file) {
      if (this.upLoadFile) {
        const excelForm = new FormData()
        excelForm.append('file', this.upLoadFile.raw)
        this.importLoading = true
        this.progressShow = true
        this.changeImport = true
        console.log(this.importApi)
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
            console.log(res)
            this.importLoading = false
            if (res) {
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
              this.status = 'success'
              this.$message.error('导入失败')
            }
          })
          .catch(err => {
            console.log(err, 123)
            this.progressShow = false
            this.importLoading = false
            this.$message.error('导入失败')
          })
      } else {
        return false
      }
    },
    // 监听上传的文件 -- 先处理文件
    handleOnChangeFile(file) {
      console.log(file)
      const reg = RegExp(/\.*(.xlsx|.xls)$/)
      if (reg.test(file.name)) {
        this.upLoadFile = file
      } else {
        this.$message.error('文件格式错误,请上传.xls或.xlsx格式文件')
      }
    },
    // 下载模板
    downloadTemplate(type) {
      this.downLoading = true
      request({
        url: this.downloadApi,
        method: 'post',
        responseType: 'blob',
        data: {}
      }).then(res => {
        console.log(res)
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
