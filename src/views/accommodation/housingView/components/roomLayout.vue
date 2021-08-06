<template>
  <div class="houseDrawing" unselectable="on" onselectstart="return false" onselect="document.selection.empty()">
    <div>
      <el-card v-if="isshow" :style="styleObject" shadow="hover">
        鼠标悬浮时显示
      </el-card>
      <div id="box" @mousedown="mouseDown($event)">
        <template v-for="(item, index) in list">
          <div v-if="item.StructureTag==7" :key="index" :style="{ left: item.X + 'px', top: item.Y + 'px' }" class="drag" @contextmenu.prevent="show(item)">
            <div class="roomup rooms" :style="{'border-top': '6px solid'+getColor(item.RoomState),background: item.RoomType.TypeBackColour,color: item.RoomType.TypeFontColour}">
              <span class="door" />
              {{ item.Name }}
            </div>
          </div>
          <div v-else :key="index" class="liuceng" :style="{position: 'absolute', left: item.X + 'px', top: item.Y + 'px' }"> {{ item.Name }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    editSign: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isshow: false,
      styleObject: {}
    }
  },
  watch: {
    editSign(val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    getColor(item) {
      var color = ''
      switch (item) {
        case -1:
          color = '#C5CBD2'
          break
        case 0:
          color = '#00728d'
          break
        case 1:
          color = '#80b0b2'
          break
        case 2:
          color = '#b6cdb1'
          break
      }
      return color
    },
    mouseDown(e) {
      this.isshow = false
      var that = this
      var sidebarStatus = Cookies.get('sidebarStatus')
      var selList = []
      var fileNodes = document.getElementById('box').children
      for (var i = 0; i < fileNodes.length; i++) {
        if (fileNodes[i].className.indexOf('drag') !== -1) {
          fileNodes[i].className = 'drag'
          selList.push(fileNodes[i])
        }
      }
      var isSelect = true
      var evt = window.event || arguments[0]
      var startX = evt.x || evt.clientX
      var startY = evt.y || evt.clientY
      var selDiv = document.createElement('div')
      selDiv.style.cssText =
        'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;'
      selDiv.id = 'selectDiv'
      document.getElementById('box').appendChild(selDiv)
      selDiv.style.left = startX + 'px'
      selDiv.style.top = startY + 'px'
      var _x = null
      var _y = null
      that.clearEventBubble(evt)
      document.onmousemove = e => {
        evt = window.event || arguments[0]
        if (isSelect) {
          if (selDiv.style.display === 'none') {
            selDiv.style.display = ''
          }
          _x = evt.x || evt.clientX
          _y = evt.y || evt.clientY
          selDiv.style.left =
            Math.min(_x, startX) - (sidebarStatus === '0' ? 440 : 600) + 'px'
          selDiv.style.top = Math.min(_y, startY) - 180 + 'px'
          selDiv.style.width = Math.abs(_x - startX) + 'px'
          selDiv.style.height = Math.abs(_y - startY) + 'px'
          var _l = selDiv.offsetLeft
          var _t = selDiv.offsetTop
          var _w = selDiv.offsetWidth
          var _h = selDiv.offsetHeight
          for (var i = 0; i < selList.length; i++) {
            var sl = selList[i].offsetWidth + selList[i].offsetLeft
            var st = selList[i].offsetHeight + selList[i].offsetTop
            if (
              sl > _l &&
              st > _t &&
              selList[i].offsetLeft < _l + _w &&
              selList[i].offsetTop < _t + _h
            ) {
              if (selList[i].className.indexOf('selectedBox') === -1) {
                selList[i].className = selList[i].className + ' selectedBox'
              }
            } else {
              if (selList[i].className.indexOf('selectedBox') !== -1) {
                selList[i].className = 'drag'
              }
            }
          }
        }
        that.clearEventBubble(evt)
      }
      document.onmouseup = () => {
        isSelect = false
        if (selDiv) {
          document.getElementById('box').removeChild(selDiv)
        }
        selList = null
        _x = null
        _y = null
        selDiv = null
        startX = null
        startY = null
        evt = null
      }
    },
    clearEventBubble(evt) {
      if (evt.stopPropagation) {
        evt.stopPropagation()
      } else {
        evt.cancelBubble = true
      }
      if (evt.preventDefault) {
        evt.preventDefault()
      } else {
        evt.returnValue = false
      }
    },
    show(item) {
      this.isshow = true
      this.styleObject = {
        position: 'absolute',
        left: item.X + 36 + 'px',
        top: item.Y + 40 + 'px',
        zIndex: 9999
      }
    },
    init() {
      var z = 1
      var that = this
      /* eslint-disable */
      this.$nextTick(() => {
        $('.drag')
          .click(function(e) {
            $(this).toggleClass('selectedBox')
          })
          .drag('start', function() {
            $(this).css('zIndex', z++)
          })
          .drag('init', function() {
            if ($(this).is('.selectedBox')) {
              return $('.selectedBox')
            }
          })
          .drag(function(ev, dd) {
            $(this).css({
              top: dd.offsetY,
              left: dd.offsetX
            })
            that.list[$(this).index()].X = dd.offsetX
            that.list[$(this).index()].Y = dd.offsetY
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.houseDrawing {
  #box {
    width: 100%;
    height: 100vh;
    position: relative;
    .rooms {
      height: 52px;
      width: 40px;
      line-height: 50px;
      background: #80c687;
      margin: 0 2px;
      text-align: center;
      cursor: pointer;
    }
    .door {
      position: absolute;
      display: inline-block;
      // background: white;
      width: 9px;
      height: 8px;
      left: 0;
      right: 0;
      margin: auto;
    }
    .roomup {
      border-top: 6px solid #00728d;
    }
  }
  .selectedBox {
    border: 1px red solid;
  }
  .drag {
    position: absolute;
  }
  .roomup .door {
    border-radius: 0px 8px 0px 0px;
    bottom: 0;
  }

  .roomdown .door {
    border-radius: 0px 0px 0px 8px;
  }
  .roomdown {
    border-bottom: 6px solid #b6cdb1;
  }
  .zoulang {
    height: 58px;
    line-height: 58px;
    border: 1px dashed #000;
    margin: 0 2px;
    text-align: center;
    position: relative;
  }
  .xiaofang {
    position: absolute;
    height: 15px;
    line-height: 15px;
  }
  .xiaofang img {
    width: 15px;
    height: 15px;
    margin-left: 201px;
    cursor: pointer;
  }
  .tabs1 {
    background: #00728d;
  }
  .tabs2 {
    background: #80b0b2;
  }
  .tabs3 {
    background: #b6cdb1;
  }
  .tabs4 {
    background: #80c687;
  }
  .tabs5 {
    background: #3c9681;
  }
}
</style>
