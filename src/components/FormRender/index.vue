<template>
  <div>
    <el-form-item v-if="ele.ControlType==7" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'blur',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-input v-model="data[ele.TypeId]" clearable :style="{maxWidth:width}" placeholder="请输入" />
    </el-form-item>
    <el-form-item v-if="ele.ControlType==1" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'change',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <template v-if="ele.BindingDicKey">
        <treeselect v-model="data[ele.TypeId]" :append-to-body="append" :limit="1" :clearable="true" :options="ele.Items" no-options-text="无" :normalizer="normalizer" placeholder="请选择" />
      </template>
      <template v-else>
        <el-select v-model="data[ele.TypeId]" clearable :style="{maxWidth:width}">
          <el-option v-for="(item,eleIndex) in ele.Items" :key="eleIndex" :label="item.ItemValue" :value="item.ItemValue"></el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item v-if="ele.ControlType==4" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'change',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-radio-group v-model="data[ele.TypeId]">
        <template v-if="ele.BindingDicKey">
          <el-radio v-for="(item,eleIndex) in ele.Items" :key="eleIndex" :label="item.Code">{{ item.CName }}</el-radio>
        </template>
        <template v-else>
          <el-radio v-for="(item,eleIndex) in ele.Items" :key="eleIndex" :label="item.ItemValue">{{ item.ItemValue }}</el-radio>
        </template>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="ele.ControlType==2" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'change',type:'array',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-checkbox-group v-model="data[ele.TypeId]" @change="change">
        <template v-if="ele.BindingDicKey">
          <el-checkbox v-for="(item,eleIndex) in ele.Items" :key="eleIndex" :label="item.Code">{{ item.CName }}</el-checkbox>
        </template>
        <template v-else>
          <el-checkbox v-for="(item,eleIndex) in ele.Items" :key="eleIndex" :label="item.ItemValue">{{ item.ItemValue }}</el-checkbox>
        </template>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item v-if="ele.ControlType==6" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'blur', required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-date-picker v-model="data[ele.TypeId]" type="date" value-format="yyyy-MM-dd" :style="{maxWidth:width}" placeholder="选择日期" />
    </el-form-item>
    <el-form-item v-if="ele.ControlType==3" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'blur',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-upload class="uploadRender" :action="imgReqPath+'/Api/Comm/File/UploadPhotoFile'" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
        <el-button size="mini" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item v-if="ele.ControlType==5" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'blur',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-switch v-model="data[ele.TypeId]" />
    </el-form-item>
    <el-form-item v-if="ele.ControlType==0" :label="ele.FieldName+'：'" :prop="ele.TypeId" :rules="[{ trigger: 'blur',required:ele.IsRequired==1?true:false, message:ele.FieldName+ '不能为空'}]">
      <el-input v-model="data[ele.TypeId]" clearable placeholder="输入内容" type="textarea" :style="{maxWidth:width}" />
    </el-form-item>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
export default {
  name: 'FormRender',
  components: {
    Treeselect
  },
  props: {
    ele: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 整个表单的数据
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    value: {
      type: [String, Number, Array, Boolean],
      default: () => {
        return ''
      }
    },
    width: {
      type: String,
      default: '200px'
    },
    showDel: {
      type: Boolean,
      default: true
    },
    append: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgReqPath: window.apiPath,
      fileList: []
    }
  },
  methods: {
    handleSuccess(res, file) {
      console.log(res, file)
      if (res.BS === 1) {
        this.fileList = [file]
        this.data[this.ele.TypeId] = res.Data[0]
        this.$message.success('上传成功')
      } else {
        this.fileList = []
        this.$message.error(res.Message)
      }
    },
    handleRemove(file, fileList) {
      this.fileList = []
      this.data[this.ele.TypeId] = null
    },
    normalizer(node) {
      return {
        id: node.Code,
        label: node.CName,
        children: node.childs
          ? node.childs.length
            ? node.childs
            : undefined
          : node.childs
      }
    },
    clickFormItem(val) {
      this.$emit('onclick', val)
    },
    delFormItem(val) {
      this.$emit('delFormItem', val)
    },
    change(val) {
      // this.data[this.ele.TypeId] = val
      // this.$forceUpdate()
      // console.log(val, this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-render {
  // text-align: center;
  cursor: pointer;
  padding: 1px 0px;
  &.active {
    background-color: #c8ebfb;
  }
  .el-icon-error,
  .empty {
    display: inline-block;
    width: 40px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    color: rgba(255, 0, 0, 0.6);
    vertical-align: middle;
    &:hover {
      color: red;
    }
  }
  ::v-deep .el-form-item {
    margin: 10px 0;
  }
  ::v-deep .el-radio-group {
    text-align: left;
    vertical-align: middle;
    min-width: 200px;
  }
  ::v-deep .el-checkbox-group {
    text-align: left;
    vertical-align: middle;
    display: inline-block;
    min-width: 200px;
  }
  // ::v-deep .el-input {
  //   width: 200px;
  //   vertical-align: middle;
  // }
  ::v-deep .el-textarea {
    width: 200px;
    vertical-align: middle;
  }
  ::v-deep .el-select {
    vertical-align: middle;
  }
  ::v-deep .el-select .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #dcdfe6;
    color: #606266;
    cursor: pointer;
  }
  ::v-deep .el-input.is-disabled .el-input__icon {
    cursor: pointer;
  }
}
.uploadRender {
  ::v-deep .el-upload-list {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
