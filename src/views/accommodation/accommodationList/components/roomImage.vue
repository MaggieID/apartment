<template>
  <div>
    <div>
      <el-dialog :title="data.Name" append-to-body :visible.sync="value" width="1000px" :before-close="close">
        <div style="text-align: center;margin-bottom: 15px;">
          <el-radio-group v-model="radio">
            <el-radio-button label="1">房间图片</el-radio-button>
            <el-radio-button label="2">全景VR</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="radio=='1'">
          <el-carousel :interval="4000" type="card" class="imgcarousel" height="400px" :autoplay="false">
            <el-carousel-item v-for="item in data.Photos" :key="item.FileId">
              <img :src="item.FilePath" alt="" style="width: 100%; height: 100%;">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-show="radio=='2'" style="height:426px">
          <div id="viewer" class="PSViewer"></div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import PhotoSphereViewer from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
export default {
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      radio: '1',
      img: require('./images/aa.png')
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.radio = '1'
        if (this.PSV) {
          this.PSV.destroy()
        }
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    init() {
      this.PSV = PhotoSphereViewer({
        panorama: this.img,
        container: document.getElementById('viewer'),
        time_anim: false,
        navbar: ['autorotate', 'zoom'],
        navbar_style: {
          backgroundColor: 'rgba(58,67,77,0.7)'
        },
        size: {
          width: '100%',
          height: '440px'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.imgcarousel {
  ::v-deep .el-carousel__item.is-active {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    background: white;
    width: 60%;
    transform: translateX(190px) scale(1) !important;
  }
}
</style>