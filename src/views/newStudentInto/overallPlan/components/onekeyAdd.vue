<template>
  <div>
    <el-dialog :title="types[type-1]+'一键创建'" :visible.sync="value" width="800px" :before-close="close">
      <el-form ref="form" :model="form" :rules="formRule" label-position="top">
        <el-form-item :label="'创建'+types[type-1]" prop="Account">
          <treeselect v-model="form.collegeNumber" multiple value-consists-of="LEAF_PRIORITY" clearable no-options-text="无" style="width: 400px;" :options="collegeList" :normalizer="normalizer" :placeholder="'请选择'+types[type-1]" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.hetong">统一合同模板</el-checkbox>
          <el-checkbox v-model="form.moshi">统一入住模式</el-checkbox>
        </el-form-item>
        <el-form-item v-if="form.hetong" label="合同模板" prop="Account">
          <el-input v-model="form.Account" clearable placeholder="请输入子方案名称" style="width: 400px;"></el-input>
        </el-form-item>
        <el-form-item v-if="form.moshi" label="入住模式" prop="Account">
          <el-radio-group v-model="form.radio" size="small" class="checkRadio">
            <el-radio label="1" border>
              <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
              <div class="righttext">
                <div>自动分配</div>
                <div>分配规则自动入住</div>
              </div>
            </el-radio>
            <el-radio label="2" border>
              <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
              <div class="righttext">
                <div>自主选床</div>
                <div>线下上设备自主选择</div>
              </div>
            </el-radio>
            <el-radio label="3" border>
              <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
              <div class="righttext">
                <div>房间顺序入住</div>
                <div>按照房间顺序入住</div>
              </div>
            </el-radio>
            <el-radio label="4" border>
              <div class="lefticon"><i class="iconfont iconchuangweiyidong "></i></div>
              <div class="righttext">
                <div>手动安排入住</div>
                <div>由老师手动安排入住</div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确定创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
export default {
  components: {
    Treeselect
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      formRule: {},
      form: {},
      showUser: false,
      showBed: false,
      radio: '1',
      types: ['学院', '专业', '班级']
    }
  },
  computed: {
    collegeList() {
      return this.$store.getters.collegeList
    }
  },
  methods: {
    normalizer(node) {
      return {
        id: node.YL,
        label: node.Name,
        children: node.Childs
          ? node.Childs.length != 0
            ? node.Childs
            : undefined
          : undefined
      }
    },
    close() {
      this.$emit('input', false)
    },
    submit() {
      this.close()
      this.$emit('create', this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
.checkRadio {
  .el-radio {
    padding: 10px 15px;
    background: #f6fafe;
    border-radius: 10px;
    height: 50px;
    margin-right: 15px;
  }
  ::v-deep .el-radio__input {
    display: none;
  }
  ::v-deep .el-radio__label {
    // display: flex;
    padding: 0;
    .lefticon {
      width: 28px;
      height: 28px;
      border-radius: 28px;
      background: #3385ff;
      text-align: center;
      line-height: 28px;
      display: inline-block;
      vertical-align: bottom;
      i {
        background: #418eff;
        color: white;
        font-size: 14px;
      }
    }
    .righttext {
      display: inline-block;
      vertical-align: middle;
      div:nth-child(1) {
        color: black;
        font-size: 14px;
        margin-bottom: 3px;
      }
      div:nth-child(2) {
        color: #848391;
      }
    }
  }
}
</style>