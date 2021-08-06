<template>
  <div class="permissionList">
    <div class="components">
      <el-tree ref="tree" :props="props" node-key="Id" check-strictly icon-class="el-icon-arrow-right" :data="treeData" show-checkbox>
        <div slot-scope="{ node, data }" class="custom-tree-node">
          <div class="headLabel">{{ node.label }}</div>
          <div v-if="data.Buttons.length>0">
            <el-checkbox-group v-model="checkList" style="padding-left: 30px;padding-bottom: 10px;">
              <el-checkbox v-for="item in data.Buttons" :key="item.Id" :label="item.Id">{{ item.BtnName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      checkList: []
    }
  },
  watch: {
    activeItem: {
      handler(newVal, oldVal) {
        if (this.$refs.tree) {
          var data = []
          if (newVal.MenuIds == null || newVal.MenuIds.length === 0) {
            data = []
          } else {
            data = newVal.MenuIds
          }
          this.checkList = newVal.MenuBtnIds
          this.$nextTick(function() {
            this.$refs.tree.setCheckedKeys(data, false)
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getSelected() {
      return this.$refs.tree.getCheckedNodes()
    }
  }
}
</script>
<style lang="scss">
.components {
  margin-bottom: 10px;
  .el-tree {
    border-top: 1px solid #e6ebf5;
  }
  .el-tree > .el-tree-node {
    background-color: #f7f9fa;
  }
  .el-tree-node__children > .el-tree-node {
    background: white;
  }
  .el-tree-node {
    white-space: nowrap;
    outline: none;
    // border-bottom: 1px solid #e6ebf5;
    position: relative;
    .headLabel {
      height: 50px;
      font-size: 15px;
      line-height: 50px;
      padding-left: 25px;
    }
    :last-child {
      border-bottom: 0px solid #e6ebf5;
    }
    .el-tree-node__content {
      min-height: 60px;
      height: auto;
      border-bottom: 1px solid #e6ebf5;
      padding: 8px 20px !important;
    }
    .el-tree-node__content:hover {
      background: none;
    }
    .el-tree-node__expand-icon {
      font-size: 15px;
    }
    .el-tree-node__content > label.el-checkbox {
      top: 25px;
      position: absolute;
    }
  }
  .el-tree-node__expand-icon {
    position: absolute;
    right: 20px;
  }
  .el-tree-node__children {
    background: white;
    padding-left: 20px;
  }
  .custom-tree-node {
    width: 100%;
  }
}
</style>
