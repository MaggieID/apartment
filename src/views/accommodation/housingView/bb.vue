<template>
  <div>
    <el-button @click="open">启动</el-button>
    <el-button @click="close">关闭</el-button>
    <el-button @click="close">测试</el-button>
  </div>
</template>
<script>
// import signalR from '@/utils/signalr.min'
export default {
  data() {
    return {
      connection: null
    }
  },
  mounted() {
    // document.addEventListener('DOMContentLoaded', function() {
    //   var connection = new signalR.HubConnectionBuilder()
    //     .withUrl('http://192.168.6.244:8340/ChatHub')
    //     .withAutomaticReconnect()
    //     .configureLogging(signalR.LogLevel.Information)
    //     .build()
    //   console.log(connection)
    //   connection
    //     .start()
    //     .then(function() {
    //       console.log('connection started')
    //     })
    //     .catch(error => {
    //       console.error(error.message)
    //     })
    // })
    this.open()
  },
  methods: {
    open() {
      console.log('开启')
      document.addEventListener('DOMContentLoaded', function() {
        var connection = new signalR.HubConnectionBuilder()
          .withUrl('http://192.168.6.244:8340/ChatHub')
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build()
        console.log(connection)
        this.connection = connection
        connection
          .start()
          .then(function() {
            console.log('connection started')
          })
          .catch(error => {
            console.error(error.message)
          })
        connection.on('OnConnectedMessage', function(name, message) {
          console.log('OnConnectedMessage', name, message)
        })
        connection.on('ReceiveTextMessage', function(obj) {
          console.log('ReceiveTextMessage', obj)
        })
      })
    },
    close() {
      console.log('关闭')
      this.connection.onclose(function(error) {
        if (error) {
          console.log(`Connection closed with error: ${error}`)
        }
      })
    }
  }
}
</script>