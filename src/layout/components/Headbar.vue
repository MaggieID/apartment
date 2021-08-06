<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container"
               :is-active="sidebar.opened"
               class="hamburger-container"
               @toggleClick="toggleSideBar" /> -->
    <div ref="logo" class="logo" @click="toggleSideBar">
      <img src="../../assets/images/logo.png" width="30" alt="">
      <template>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <span>{{ systemName }}</span><i class="el-icon-caret-bottom  el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in systemList" :key="index">
              <div @click="clickItem(item)">{{ item.name }}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
    <div class="right-menu" :class="{ mobile: device === 'mobile' }">
      <jobQueue></jobQueue>
      <template v-if="device !== 'mobile'">
        <span class="time right-menu-item">{{ time | timeFormate }}</span>
      </template>
      <div class="user right-menu-item">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <div class="avatar-container">
              <img :src=" userInfo.PhotoPath ? userInfo.PhotoPath : defaultAvatar " class="user-avatar" :onerror="defaultAvatar">
              <div>
                <div class="name">{{ userInfo.Name }}</div>
                <div class="name" style="color:#88A2F5;font-size: 12px;">{{ userInfo.Number }}</div>
              </div>
              <i class="el-icon-caret-bottom el-icon--right">
              </i>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link :to="{ path: '/personalInformation', query: { DisplayBlock: '1' } }">
                个人信息
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="{ path: '/personalInformation', query: { DisplayBlock: '2' } }">
                修改密码
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="device === 'mobile'" disabled>
              <span style="display:block;" @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 退出 -->
      <div v-if="device !== 'mobile'" class="loginout right-menu-item">
        <div class="loginout-wrapper" @click="logout">
          <i class="el-icon-switch-button" />
          <span class="text">退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultAvatar from '@/assets/images/avatar4.gif'
import jobQueue from './jobQueue'
export default {
  components: {
    jobQueue
  },
  // 挂载完成时
  filters: {
    // 获取当前时间函数
    timeFormate(timeStamp) {
      const year = new Date(timeStamp).getFullYear()
      const month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      const date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      const hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      const mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      const ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
      return (
        year +
        '年' +
        month +
        '月' +
        date +
        '日' +
        ' ' +
        hh +
        ':' +
        mm +
        ':' +
        ss
      )
      // console.log(this.nowTime);
    }
  },
  data() {
    return {
      time: new Date(),
      defaultAvatar: 'this.src="' + defaultAvatar + '"',
      systemList: window.systemList
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'device']),
    systemName() {
      return window.systemName
    }
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除我们的定时器
    }
  },
  mounted() {
    var _this = this // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function() {
      _this.time = new Date() // 修改数据date
    }, 1000)
  },
  methods: {
    clickItem(val) {
      location.href = val.url
    },
    toggleSideBar() {
      // this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      console.log(window.location)
      location.href = `/login/?redirect=${window.location.pathname +
        window.location.hash}`
    }
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  // display: flex;
  height: 60px;
  // overflow: hidden;
  position: relative;
  background: #1b1e24;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  font-size: 0;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    // float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .logo {
    float: left;
    margin-left: 18px;
    cursor: pointer;
    img {
      vertical-align: middle;
      margin-right: 7px;
    }
    span {
      vertical-align: middle;
      letter-spacing: 1px;
      font-size: 18px;
      color: #fff;
      line-height: 59px;
    }
  }

  .tags-view-container {
    float: left;
    position: relative;
    top: 30px;
    margin-left: 40px;
    // flex: 1;
    max-width: calc(100% - 207px - 515px - 40px);
    box-shadow: none;
    border-bottom: none;
    background: transparent;
    &.mobile {
      max-width: calc(100% - 55px - 180px - 40px);
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    // flex: 1;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      height: 60px;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .time {
      font-size: 14px;
      color: #fff;
    }

    .avatar-container {
      margin-left: 10px;
      display: flex;
      padding: 0 10px;
      padding-right: 30px;
      border-right: 1px solid #fff;
      border-left: 1px solid #fff;
      position: relative;
      margin-top: 10px;
      align-items: center;
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
      }
      .name {
        color: #fff;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80px;
        line-height: 20px;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: 8px;
        top: 9px;
        font-size: 18px;
        color: white;
      }
    }

    &.mobile {
      .set-container {
        margin-right: 20px;
      }
    }
    .set-container {
      // margin-right: 30px;
      margin-left: 24px;
      .set-wrapper {
        // margin-top: 10px;
        position: relative;
        .el-icon-s-tools {
          cursor: pointer;
          color: #fff;
          font-size: 20px;
          vertical-align: middle;
        }

        .text {
          color: #fff;
          font-size: 14px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .loginout {
      margin-right: 28px;
      margin-left: 4px;
      .loginout-wrapper {
        position: relative;
        cursor: pointer;
        .el-icon-switch-button {
          color: #fff;
          font-size: 20px;
          vertical-align: middle;
        }
        .text {
          color: #fff;
          font-size: 14px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
