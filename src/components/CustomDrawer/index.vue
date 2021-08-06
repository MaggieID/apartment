<template>
  <div>
    <div class="drawer" :style="{background:showDrawer? '#6564649c':'',width:showDrawer? '100%':'20px'}">
      <div class="drawer-inner" :style="{width:showDrawer? 'calc(100% - 25px)':'20px','box-shadow': '0 2px 12px 0 #0000005c'}">
        <div class="btnside"></div>
        <transition name="fade">
          <div class="drawer-inner" style="width:100%">
            <div v-if="showDrawer" class="showbtn" @click="showDrawer=false">
              <i class="el-icon-d-arrow-left" />
            </div>
            <div v-else class="showbtn" @click="showDrawer=true">
              <i class="el-icon-s-operation" />
            </div>
            <div v-if="showDrawer" style="display: flex;height: 100%;">
              <div style="width: 400px; padding: 30px 20px; border-right: 1px solid gainsboro;height: 100%;">
                <el-scrollbar style="height:100%">
                  <el-form label-width="80px">
                    <draggable :clone="cloneData" :list="formtype_list" :options="dragOptions1">
                      <transition-group class="form-list-group" :name="'flip-list'" tag="div">
                        <div v-for="(item) in formtype_list" :key="item.type" class="type-item">
                          <el-form-item :label="item.name">
                            <el-input v-if="item.type==7" v-model="from.input" readonly style="width:200px" />
                            <el-select v-if="item.type==1" v-model="from.select" placeholder="下拉选框"></el-select>
                            <el-radio-group v-if="item.type==4" v-model="from.radio">
                              <el-radio :label="0">单选框</el-radio>
                              <el-radio :label="1">单选框</el-radio>
                            </el-radio-group>
                            <el-checkbox-group v-if="item.type==2" v-model="from.checkList">
                              <el-checkbox label="多选框" />
                              <el-checkbox label="多选框" />
                            </el-checkbox-group>
                            <el-date-picker v-if="item.type==6" v-model="from.date" readonly type="date" style="width:200px" placeholder="选择日期" />
                            <el-button v-if="item.type==3" size="mini" type="primary">点击上传</el-button>
                            <el-switch v-if="item.type==5" v-model="from.switch" />
                            <el-input v-if="item.type==0" v-model="from.textarea" readonly placeholder="输入内容" type="textarea" style="width:200px" />
                          </el-form-item>
                        </div>
                      </transition-group>
                    </draggable>
                  </el-form>
                </el-scrollbar>
              </div>
              <div style="flex: 1;height: 100%;padding: 20px;">
                <div style="margin-bottom: 15px;">{{ title }}</div>
                <el-scrollbar style="height:calc(100% - 60px)">
                  <el-form ref="formValidate" label-width="120px" :model="formData">
                    <draggable :list="sortable_item" :options="dragOptions2">
                      <transition-group class="form-list-group" :name="'flip-list'" tag="div">
                        <form-render v-for="(element,i) in sortable_item" :key="element.TypeId" :index="i" :class="currentItem==element.TypeId?'active':''" :ele="element" :data="formData" :sortable-item="sortable_item" @onclick="clickFormItem(element,i)" @delFormItem="delFormItem(i)">
                        </form-render>
                      </transition-group>
                    </draggable>
                  </el-form>
                </el-scrollbar>
                <div style="text-align: right;padding-right: 100px;">
                  <el-button type="warning" round @click="initialization">初始化</el-button>
                  <el-button type="primary" round @click="saveTemplate">保存</el-button>
                </div>
              </div>
              <div v-if="isAttributeShow" class="attribute">
                <el-scrollbar style="height:calc(100% - 60px)">
                  <div style="margin-bottom: 40px;">属性</div>
                  <el-form ref="inputForm" :model="inputForm" label-position="top">
                    <el-form-item label="标题名称">
                      <div class="select-option">
                        <el-input v-model="inputForm.fieldName" placeholder="标题名称" />
                        <i v-if="inputForm.controlType==1 || inputForm.controlType==2 || inputForm.controlType==4" class="el-icon-info link-option" @click="linkOption"></i>
                      </div>
                    </el-form-item>
                    <el-form-item label="键名">
                      <el-input v-model="inputForm.fieldKey" placeholder="键名" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input v-model="inputForm.describe" placeholder="描述" type="textarea" />
                    </el-form-item>
                    <div v-if="inputForm.controlType==1 || inputForm.controlType==2 || inputForm.controlType==4">
                      <el-form-item label="选项设置">
                        <template v-for="(item,index) in inputForm.selectItems">
                          <div :key="index" class="select-option" style="margin-bottom: 15px;">
                            <el-input v-model="item.ItemValue" class="" :placeholder="'请输入下拉框内容'+index+1"></el-input>
                            <i class="el-icon-circle-plus add-option" @click="addOption(item,index)"></i>
                            <!-- <i class="el-icon-info link-option" @click="linkOption(item,index)"></i> -->
                            <i class="el-icon-remove del-option" @click="delOption(item,index)"></i>
                          </div>
                        </template>
                      </el-form-item>
                    </div>
                    <div>
                    </div>
                    <el-form-item label="是否必填">
                      <el-radio-group v-model="inputForm.IsRequired">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <dataDialog v-model="showDialog" @complete="complete"></dataDialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import FormRender from '@/components/FormRender'
import { GetTemplateControls, UpdateTemplate } from '@/api/Template'
import dataDialog from '@/components/dataDialog'
export default {
  components: {
    draggable,
    FormRender,
    dataDialog
  },
  props: {
    title: {
      type: String,
      default: ''
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
      showDialog: false,
      isAttributeShow: false,
      showDrawer: false,
      from: {
        input: '',
        select: '',
        radio: '',
        checkList: [],
        date: '',
        switch: false,
        textarea: ''
      },
      inputForm: {},
      formItemId: 0,
      formtype_list: [
        { name: '下拉框', type: 1, text: 'SelectBox' },
        { name: '多选框', type: 2, text: 'CheckBox' },
        { name: '上传框', type: 3, text: 'FileBox' },
        { name: '单选框', type: 4, text: 'RadioBox' },
        { name: '状态框', type: 5, text: 'StateBox' },
        { name: '日期框', type: 6, text: 'TimeBox' },
        { name: '输入框', type: 7, text: 'InputBox' },
        { name: '文本框', type: 0, text: 'Textbox' }
      ],
      sortable_item: [],
      formLoading: false,
      formData: {},
      currentItem: {},
      queryPara: {
        pid: undefined,
        search: '',
        dicLevel: undefined,
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      currentRow: [],
      tableData: [],
      dicList: [],
      Controls: {},
      chek: []
    }
  },
  computed: {
    // 拖拽表单1
    dragOptions1() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        // 分组
        group: {
          name: 'shared',
          pull: 'clone',
          revertClone: false
        },
        // 禁止拖动排序
        sort: false
      }
    },
    // 拖拽表单2
    dragOptions2() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        group: {
          // 只允许放置shared的控件,禁止pull
          put: ['shared']
        }
      }
    }
  },
  watch: {
    showDrawer(val) {
      if (val) {
        this.sortable_item = this.templateInfo.templateExtCols
      }
    }
  },
  mounted() {
    this.GetTemplateControls()
  },
  methods: {
    initialization() {
      this.sortable_item = this.templateInfo.templateExtCols
    },
    saveTemplate() {
      console.log(this.sortable_item)
      var extCols = []
      for (let i = 0; i < this.sortable_item.length; i++) {
        var controlJson = this.sortable_item[i]
        if (controlJson.fieldName === '') {
          this.$message({
            message: '标题名称不能为空',
            type: 'warning'
          })
          return
        }
        if (
          controlJson.controlType == 1 ||
          controlJson.controlType == 2 ||
          controlJson.controlType == 4
        ) {
          var selectItem = []
          var selectItems = this.sortable_item[i].selectItems
          for (let j = 0; j < selectItems.length; j++) {
            if (selectItems[j].ItemValue !== '') {
              selectItem.push({
                ItemKey: 'id' + j,
                ItemValue: selectItems[j].ItemValue,
                Sort: j
              })
            }
          }
          controlJson.selectItems = selectItem
        }
        extCols.push({
          controlType: this.sortable_item[i].controlType,
          controlJson: JSON.stringify(controlJson),
          order: i
        })
      }
      var data = {
        id: this.templateInfo.id,
        type: this.templateInfo.type,
        templateName: this.templateInfo.templateName,
        templateDescribe: this.templateInfo.templateDescribe,
        templateCols: this.templateInfo.templateCols,
        extCols: extCols
      }
      console.log(data)
      UpdateTemplate(data).then(res => {
        if (res.BS == 1) {
          this.$message({
            message: res.Message,
            type: 'success'
          })
          this.showDrawer = false
          this.$emit('GetTemplateInfo')
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    complete(val) {
      this.inputForm.bindingDicKey = val.number
      this.inputForm.fieldName = val.cName
      this.inputForm.fieldKey = val.number
      this.inputForm.describe = val.description
    },
    GetTemplateControls() {
      GetTemplateControls().then(res => {
        this.Controls = res.Data
      })
    },
    cloneData(original) {
      this.formItemId++
      // console.log(original)
      var cloneObj = {}
      var text = this.Controls[original.text].obj
      var obj = {
        controlType: original.type,
        fieldName: original.name,
        TypeId: this.formItemId
      }
      Object.assign(cloneObj, text, obj)
      if (original.type == 1) {
        cloneObj.selectItems = [
          {
            ItemValue: ''
          }
        ]
      }
      if (original.type == 2 || original.type == 4) {
        cloneObj.selectItems = [
          {
            ItemValue: '选项1'
          },
          {
            ItemValue: '选项2'
          }
        ]
      }
      if (original.type == 2) {
        this.formData[this.formItemId] = []
      }
      // console.log(cloneObj)
      this.sortable_item.push(cloneObj)
    },
    clickFormItem(item) {
      this.currentItem = item.TypeId
      this.inputForm = item
      this.isAttributeShow = true
    },
    // 删除表单子项
    delFormItem(val) {
      this.sortable_item.splice(val, 1)
      this.isAttributeShow = false
    },
    // 新增下拉子项
    addOption(item, index) {
      if (item.ItemValue === '') {
        this.$message({
          message: '选项内容不能为空',
          type: 'warning'
        })
        return
      }
      const array = this.inputForm.selectItems
      for (let i = 0; i < array.length; i++) {
        if (array[i].ItemValue === item.ItemValue && i !== index) {
          this.$message({
            message: '已存在相同项',
            type: 'warning'
          })
          return
        }
      }
      this.inputForm.selectItems.push({
        ItemValue: ''
      })
      this.$forceUpdate()
    },
    // 删除下拉子项
    delOption(item, index) {
      console.log(item, index)
      this.inputForm.selectItems.splice(index, 1)
    },
    linkOption(item) {
      console.log(item)
      this.showDialog = true
    }
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  width: calc(100% - 40px);
  transition: width 2s;
}
.fade-enter,
.fade-leave-active {
  width: 30px;
}
</style>
<style lang="scss" scoped>
.drawer {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .btnside {
    width: 45px;
    height: 45px;
    position: absolute;
    top: calc(50% - 25px);
    right: -23px;
    line-height: 45px;
    transform: rotate(45deg);
    border-radius: 0 23px 00px 0;
    background: white;
    box-shadow: 0 2px 12px 0 #0000005c;
  }
  &-inner {
    background: white;
    height: 100%;
    border-radius: 0px 10px 10px 0px;
    position: relative;
    .showbtn {
      position: absolute;
      top: calc(50% - 20px);
      right: -17px;
      background: #3385ff;
      color: white;
      width: 35px;
      height: 35px;
      font-size: 25px;
      border-radius: 35px;
      text-align: center;
      line-height: 35px;
    }
  }
}
.type-item {
  width: 300px;
  padding: 15px 15px 1px 1px;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 15px;
  }
}
.type-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.attribute {
  width: 400px;
  padding: 20px 30px 20px 20px;
  height: 100%;
  border-left: 1px solid gainsboro;
  ::v-deep .el-form-item__label {
    line-height: 10px;
  }
}
.select-option {
  display: flex;
  i {
    display: inline-block;
    line-height: 36px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    width: 30px;
  }
  .add-option {
    color: #22b573;
  }
  .del-option {
    color: #f56d6d;
  }
  .link-option {
    color: #e7a544;
  }
}
</style>
