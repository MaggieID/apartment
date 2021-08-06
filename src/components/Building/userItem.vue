<template>
  <span>
    <div v-if="attribute==3">
      <el-popover v-if="name.length > 1" placement="bottom-start" width="150" trigger="hover">
        <div style="font-size: 10px; color: #2a66e2; margin-bottom: 10px;">
          【{{ data.UserName }}】
        </div>
        <div v-for="(role,index) in name" :key="index">
          {{ role }}
        </div>
        <span slot="reference">
          {{ name[0] }}
          <!-- <i class="el-icon-arrow-down" style="position: absolute;left: 10px; top: 7px; color: #fff;"></i> -->
        </span>
      </el-popover>
      <el-tooltip v-if="name.length==1" effect="light" :content="data.UserName" placement="right">
        <span>{{ name[0] }}</span>
      </el-tooltip>
      <span v-if="name.length==0">
        <span v-if="showState==''">{{ data.UserName }}</span>
        <el-tooltip v-else effect="light" :content="data.UserName" placement="right">
          <span style="display:block;height: 30px;"></span>
        </el-tooltip>
      </span>
    </div>
    <div v-else>{{ data.UserName }}</div>
  </span>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: Array,
      default: () => {
        return []
      }
    },
    showState: {
      type: String,
      default: ''
    },
    attribute: {
      type: Number,
      default: 0
    }
  }
}
</script>