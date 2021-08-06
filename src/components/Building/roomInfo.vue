<template>
  <div>
    <div v-if="attribute==2" style="height: 34px;">
      <el-popover v-if="roles.length > 1" placement="bottom-start" width="150" trigger="hover">
        <div style="font-size: 10px; color: #2a66e2; margin-bottom: 10px;">
          【{{ data.Name }}】所有管理员
        </div>
        <div v-for="(role,index) in roles" :key="index">
          {{ role.UserName }}
        </div>
        <span slot="reference" class="room" :style="{background: roomColor[data.RoomCapacity]}" @click="roomClick(data)">
          {{ roles[0].UserName }} <i class="el-icon-arrow-down" style="position: absolute;left: 10px; top: 7px; color: #fff;"></i>
        </span>
      </el-popover>
      <el-tooltip v-if="roles.length==1" effect="light" :content="data.Name" placement="right">
        <span class="room" :style="{background: roomColor[data.RoomCapacity]}" @click="roomClick(data)">{{ roles[0].UserName }}</span>
      </el-tooltip>
      <span v-if="roles.length==0" :style="{background: roomColor[data.RoomCapacity]}" class="room">
        <span v-if="showState==''" @click="roomClick(data)">{{ data.Name }}</span>
        <el-tooltip v-else effect="light" :content="data.Name" placement="right">
          <span style="display:block;height: 28px;" @click="roomClick(data)"></span>
        </el-tooltip>
      </span>
    </div>
    <span v-else class="room" :style="{background: roomColor[data.RoomCapacity]}" @click="roomClick(data)">{{ data.Name }}</span>
  </div>
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
    roles: {
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
  },
  computed: {
    roomColor() {
      return this.$store.getters.roomColor
    }
  },
  methods: {
    roomClick(data) {
      this.$emit('roomClick', data)
    }
  }
}
</script>