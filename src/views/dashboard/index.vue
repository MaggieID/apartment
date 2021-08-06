<template>
  <div class="layer-container">
    <el-scrollbar style="height:95%">
      <div>
        <el-row :gutter="14">
          <el-col :lg="6" :md="10" :sm="10" class="mb15">
            <el-row :gutter="14" class="mb15">
              <el-col :span="12">
                <div class="totalTab" style="background:#F8BC00;">
                  今日登录
                  <span>10</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="totalTab" style="background: #B5A1DD;">
                  晚归人数
                  <span>12</span>
                </div>
              </el-col>
            </el-row>
            <div class="card" style="height: 280px;">
              <div class="head">各学院人员数</div>
              <!-- <collegeNumber></collegeNumber> -->
              <div style="height: 230px;overflow: hidden;">
                <table style="width: 100%;margin-top: 20px;" cellspacing="0" cellpadding="0">
                  <tr style="background: #EDEDED; height: 29px;">
                    <td style="padding-left: 50px;">学院名称</td>
                    <td style="width: 70px;">人数</td>
                  </tr>
                  <tr style="height: 29px;">
                    <td style="position: relative;padding: 10px 20px 10px 50px;">
                      <!-- <svg v-if="item.Rownum == 1" class="icon" style="width: 20px;height: 20px;position: absolute;left: 20px;top: 7px;" aria-hidden="true">
                        <use xlink:href="#icon-paiming1"></use>
                      </svg>
                      <svg v-if="item.Rownum == 2" class="icon" style="width: 20px;height: 20px;position: absolute;left: 20px;top: 7px;" aria-hidden="true">
                        <use xlink:href="#icon-paiming2"></use>
                      </svg>
                      <svg v-if="item.Rownum == 3" class="icon" style="width: 20px;height: 20px;position: absolute;left: 20px;top: 7px;" aria-hidden="true">
                        <use xlink:href="#icon-paiming"></use>
                      </svg> -->
                      <div style="position: absolute; left: 25px;top: 10px;">
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </el-col>
          <el-col :lg="10" :md="14" :sm="14" class="mb15">
            <el-row :gutter="14" class="mb15">
              <el-col :span="8">
                <div class="totalTab" style="background: #4783FF;">
                  今日旷寝
                  <span>20</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="totalTab" style="background: #D57FFB;">
                  请假人数
                  <span>12</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="totalTab" style="background: #2DC7C9;">
                  今日违纪
                  <span>15</span>
                </div>
              </el-col>
            </el-row>
            <div class="card" style="height: 280px;">
              <div class="head">各楼栋总床位预分配床位数、空置床数</div>
              <!-- <bedAllocation></bedAllocation> -->
              <div id="myChart1" style="height: 240px;width:100%;"></div>
            </div>
          </el-col>
          <el-col :lg="4" :md="8" :sm="12" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">各楼栋入住人数占比</div>
              <!-- <proportionOfBuildings></proportionOfBuildings> -->
              <div id="myChart2" style="height: 320px;width:100%;"></div>
            </div>
          </el-col>
          <el-col :lg="4" :md="8" :sm="12" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">待处理事件</div>
              <ul class="preList" @mouseenter="mouseenter('pendingSeen')" @mouseleave="leavePending">
                <li v-for="(item,index) in pendingList" :key="index">
                  <span class="pretab">{{ index }}</span>
                  {{ item.name }}
                  <span style="float: right;">2019-04-07 18:59:22</span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">本月违纪类型统计</div>
              <div id="myChart3" style="height: 300px;width:100%;"></div>
            </div>
          </el-col>
          <el-col :lg="5" :md="7" :sm="12" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">学校人员类型</div>
              <div id="myChart4" style="height: 300px;width:100%;"></div>
              <!-- <schoolPepoleType></schoolPepoleType> -->
            </div>
          </el-col>
          <el-col :lg="5" :md="7" :sm="10" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">924预分配方案</div>
              <!-- <programme></programme> -->
              <div>
                <el-carousel height="380px" :interval="10000" @change="drawPie">
                  <el-carousel-item v-for="(item,index) in programme" :key="index">
                    <div class="head">{{ item.schemeName }}</div>
                    <div>
                      <div class="progressT">
                        男生已入住
                        <span></span>
                      </div>
                      <el-progress :percentage="item.allManCount!=0?(item.manCount/item.allManCount)*100:0" :stroke-width="8" :show-text="false"></el-progress>
                      <div class="progressB">总人数：</div>
                      <div class="progressT">
                        女生已入住
                        <span></span>
                      </div>
                      <el-progress :percentage="item.allFemaleCount!=0?(item.femaleCount/item.allFemaleCount)*100:0" :stroke-width="8" :show-text="false"></el-progress>
                      <div class="progressB">总人数：</div>
                    </div>
                    <div style="margin-top: 20px;position: relative;">
                      <div :id="'myChart5'+index" style="height: 150px;width:100%;"></div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <!-- <div>
                <el-progress :percentage="percentage" :color="customColor"></el-progress>
              </div> -->
            </div>
          </el-col>
          <el-col :lg="8" :md="10" :sm="14" class="mb15">
            <div class="card" style="height: 380px;">
              <div class="head">各楼栋房间数</div>
              <!-- <sumTotalfrooms></sumTotalfrooms> -->
              <div style="position: relative;margin-top: 15px;">
                <div style="position: absolute;top: 0px;left: 40px;font-size: 14px;">
                  总房间数：<span style="font-size: 24px;">0</span>
                </div>
                <div id="myChart6" style="height: 300px;width:100%;"></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="card" style="height: 400px;">
          <div class="head">近七日晚归人数、旷寝人数、违纪人数趋势图</div>
          <div id="myChart7" style="height: 300px;width:100%;margin-top: 20px;"></div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import echarts from 'echarts';
// import bedAllocation from './components/bedAllocation';
// import collegeNumber from './components/collegeNumber';
// import programme from './components/programme';
// import proportionOfBuildings from './components/proportionOfBuildings';
// import schoolPepoleType from './components/schoolPepoleType';
// import sumTotalfrooms from './components/sumTotalfrooms';
export default {
  name: 'Home',
  components: {
    // bedAllocation,
    // collegeNumber,
    // programme,
    // proportionOfBuildings,
    // schoolPepoleType,
    // sumTotalfrooms
  },
  data() {
    return {
      pendingList: [
        {
          name: '申请审批1'
        },
        {
          name: '申请审批2'
        },
        {
          name: '申请审批3'
        },
        {
          name: '申请审批4'
        },
        {
          name: '申请审批5'
        },
        {
          name: '申请审批6'
        },
        {
          name: '申请审批7'
        },
        {
          name: '申请审批8'
        },
        {
          name: '申请审批9'
        },
        {
          name: '申请审批10'
        },
        {
          name: '申请审批11'
        },
        {
          name: '申请审批12'
        }
      ],
      pendingSeen: '',
      programme: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine()
      this.typetongji()
      this.typexueyuan()
      this.typekongzhichuangshu()
      this.ruzhurenshu()
      this.fangjianshu()
    })
    // var that = this;
    // setInterval(function() {
    //   that.$nextTick(function() {
    //     that.drawLine();
    //     that.typetongji();
    //   });
    // }, 180000);
    this.pendingSeen = setInterval(this.showPending, 5000)
  },
  methods: {
    mouseenter(key) {
      clearInterval(this[key])
    },
    leavePending() {
      if (this.pendingList.length > 5) {
        this.pendingSeen = setInterval(this.showPending, 5000)
      }
    },
    showPending() {
      setTimeout(() => {
        this.pendingList.push(this.pendingList[0])
        this.pendingList.shift()
      }, 500)
    },
    drawLine() {
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        grid: {
          top: 40,
          left: 40,
          right: 30,
          bottom: 20
        },
        color: ['#4783FF', '#3DDFBF', '#D57FFB'],
        legend: {
          data: ['晚归人数', '旷寝人数', '违纪人数'],
          icon: 'rect',
          textStyle: {
            color: '#898F97'
          },
          itemHeight: 4
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [
            '7月1日',
            '7月2日',
            '7月3日',
            '7月4日',
            '7月5日',
            '7月6日',
            '7月7日'
          ]
        },
        yAxis: {
          name: '人数',
          type: 'value'
        },
        series: [
          {
            symbol: 'circle',
            name: '晚归人数',
            smooth: true,
            data: [6, 5, 7, 9, 3, 6, 13, 8, 9, 21, 15, 4],
            type: 'line',
            areaStyle: {
              color: 'rgba(72, 132, 255, 0.15)'
            }
          },
          {
            name: '旷寝人数',
            smooth: true,
            symbol: 'circle',
            data: [3, 6, 3, 5, 7, 2, 9, 1, 7, 9, 4, 8],
            type: 'line',
            areaStyle: {
              color: 'rgba(61, 224, 191, 0.18)'
            }
          },
          {
            name: '违纪人数',
            smooth: true,
            symbol: 'circle',
            data: [0, 4, 2, 3, 2, 7, 4, 8, 5, 2, 9, 5],
            type: 'line',
            areaStyle: {
              color: 'rgba(214, 128, 251, 0.18)'
            }
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart7'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    },
    typekongzhichuangshu() {
      var option = {
        color: ['#4783FF', '#D57FFB', '#3DDFBF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'center',
          top: 'bottom',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#898F97'
          }
        },
        grid: {
          left: '6%',
          right: '6%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['楼栋A', '楼栋B', '楼栋C', '楼栋D'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总床位',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '空置床',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '预分配',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '已入住',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '暂停使用',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart1'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    },
    ruzhurenshu() {
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#898F97'
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            color: ['#996633', '#990033', '#009999', '#003333'],
            radius: ['40%', '60%'],
            avoidLabelOverlap: false,
            center: ['50%', '40%'],
            label: {
              show: false,
              position: 'center',
              normal: {
                show: true,
                position: 'outside'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
              normal: {
                show: true // 引导线显示
              }
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            data: [
              { value: 1048, name: '楼栋A' },
              { value: 1048, name: '楼栋B' },
              { value: 1048, name: '楼栋C' },
              { value: 1048, name: '楼栋D' }
            ]
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart2'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    },
    fangjianshu() {
      var option = {
        color: ['#4783FF', '#D57FFB', '#3DDFBF'],
        legend: {
          left: 'center',
          top: 'top',
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#898F97'
          }
        },
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: ['楼栋A', '楼栋B', '楼栋C', '楼栋D']
          }
        ],
        series: [
          {
            name: '男房间数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '女房间数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          },
          {
            name: '其他房间数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [0, 0, 0, 0]
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart6'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    },
    typexueyuan() {
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#4783FF', '#D57FFB', '#3DDFBF'],
        legend: {
          bottom: 10,
          icon: 'circle',
          textStyle: {
            color: '#898F97'
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['25%', '60%'],
            avoidLabelOverlap: false,
            center: ['50%', '40%'],
            label: {
              position: 'inner',
              formatter: '{d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 2500, name: '搜索引擎' },
              { value: 400, name: '直接访问' },
              { value: 580, name: '邮件营销' }
            ]
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart4'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    },
    drawPie(index) {
      var data = this.programme[index];
      var charts = echarts.init(document.getElementById('myChart5' + index));
      charts.setOption({
        graphic: [
          {
            type: 'text',
            left: 50,
            top: 50,
            style: {
              text: '剩余床位数',
              textAlign: 'center',
              fill: '#000',
              width: 30,
              height: 30,
              fontSize: 16
            }
          },
          {
            type: 'text',
            left: 80,
            top: 80,
            style: {
              text: data.remainingBedCount,
              textAlign: 'center',
              fill: '#000',
              width: 30,
              height: 30,
              fontSize: 20
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b}:{c} ({d}%)'
        },
        color: ['#4DA1FF', '#FFCD2F', '#DBD5FF'],
        legend: {
          type: 'scroll',
          orient: 'vertical',
          icon: 'circle',
          right: 10,
          top: 40,
          bottom: 20,
          textStyle: {
            color: '#898F97'
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['75%', '90%'],
            center: ['30%', '50%'],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: data.roomManCount, name: '男生剩余房间' },
              { value: data.roomFemaleCount, name: '女生剩余房间' },
              { value: data.roomHybridCount, name: '混合剩余房间' }
            ]
          }
        ]
      });
    },
    typetongji() {
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            formatter: value => {
              return value.split('').join('\n')
            }
          },
          data: [
            '公共卫生',
            '公共安全隐患',
            '晚归旷寝',
            '宿舍安全隐患',
            '违纪违规',
            '异常出入'
          ]
        },
        grid: {
          top: 40,
          left: 30,
          right: 20,
          bottom: 100
        },
        color: ['#4783FF'],
        yAxis: {
          type: 'value'
        },
        series: [
          {
            symbolSize: 1,
            data: [10, 20, 21, 13, 35, 45],
            type: 'line',
            lineStyle: {
              width: 3,
              shadowColor: '#4783FF',
              shadowBlur: 5,
              shadowOffsetY: 10
            }
          }
        ]
      }
      var charts = echarts.init(document.getElementById('myChart3'))
      charts.setOption(option)
      window.addEventListener('resize', () => {
        charts.resize()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.layer-container {
  width: 100%;
  height: calc(100vh - 124px);
  overflow: auto;

  .card {
    background: white;
    border-radius: 3px;
    padding: 15px;
    .head {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .totalTab {
    cursor: pointer;
    border-radius: 3px;
    height: 84px;
    padding: 15px 20px;
    color: white;
    span {
      font-size: 36px;
      display: block;
      text-align: right;
    }
  }
  .preList {
    list-style: none;
    padding: 0;
    font-size: 14px;
    height: 315px;
    overflow: hidden;
    li {
      padding: 10px 0;
    }
    .pretab {
      background: #ff0000;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 9px;
      color: white;
      text-align: center;
      line-height: 20px;
    }
    .progressT {
      font-size: 12px;
      color: #858585;
      margin-top: 18px;
      margin-bottom: 3px;
      span {
        color: #4783ff;
        float: right;
      }
    }
    .progressB {
      color: rgb(169, 176, 180);
      font-size: 9px;
      text-align: right;
      margin-top: 3px;
    }
  }
}
</style>
