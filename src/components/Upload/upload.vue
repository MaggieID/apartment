<template>
  <div>
    <el-dialog title="批量导入" :visible.sync="value" width="400px" :before-close="close">
      <div>
        <el-upload ref="upload" class="upload-demo" drag :auto-upload="false" :action="apiPath+importPath" :on-success="handleSuccess" :headers="headers" :on-change="handleChange" :before-upload="beforeUpload" :file-list="fileList" :show-file-list="true">
          <i class="el-icon-upload" />
          <div class="el-upload__text" style="line-height: 0px;">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    value: Boolean,
    importPath: {
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
      fileList: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.fileList = []
      }
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      const reg = RegExp(/\.*(.xlsx|.xls)$/)
      return reg.test(file.name)
    },
    handleSuccess(res, file) {
      if (res.BS === 1) {
        this.$message.success({
          message: '导入成功',
          type: 'success'
        })
        this.$emit('getData', res.Data)
        this.close()
      } else {
        this.fileList = []
        this.$message.error('导入失败')
      }
    },
    handleChange(file, fileList) {
      this.fileList = [file]
    }
  }
}
</script>