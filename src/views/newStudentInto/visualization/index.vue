<template>
  <div class="g-container visualization">
    <el-scrollbar style="height:100%">
      <div class="row-wrap">
        <div class=" card info-card">
          <el-dropdown style="width:100%"
                       placement="bottom-start"
                       trigger="click">
            <div class="head">
              <div class="name-wrap">
                <span class="name">秋季新生入学住宿分配</span>
                <span class="status">进行中</span>
              </div>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown"
                              style="min-width:200px;text-align:center;">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="content">
            <div class="info-item">
              <div class="lable">时间：</div>
              <div class="value">的说法三大法师打发斯蒂芬</div>
            </div>
            <div class="info-item">
              <div class="lable">负责人：</div>
              <div class="value">的说法三大法师打发斯蒂芬</div>
            </div>
            <div class="info-row"
                 style="margin-top:30px">
              <div class="info-row-item">
                <div class="icon-box bg-blue">
                  <div class="icon-circle bg-lightblue">
                    <i class="iconfont iconrenshu"></i>

                  </div>
                </div>
                <div class="info-content blue">
                  <div class="title">人员数总</div>
                  <div class="num">
                    <countTo separator=''
                             :startVal='0'
                             :endVal='6000'
                             :duration='3000'></countTo>
                  </div>

                </div>
              </div>
              <div class="info-row-item">
                <div class="icon-box bg-orange">
                  <div class="icon-circle bg-lightorange">
                    <i class="iconfont iconchuang1"></i>

                  </div>
                </div>
                <div class="info-content orange">
                  <div class="title">床位数总</div>
                  <div class="num">
                    <countTo separator=''
                             :startVal='0'
                             :endVal='6000'
                             :duration='3000'></countTo>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-row"
                 style="margin-top:24px">
              <div class="info-row-item">
                <div class="icon-box bg-green">
                  <div class="icon-circle bg-lightgreen">
                    <i class="iconfont iconchuang21"></i>

                  </div>
                </div>
                <div class="info-content green">
                  <div class="title">已入住数</div>
                  <div class="num">
                    <countTo separator=''
                             :startVal='0'
                             :endVal='6000'
                             :duration='3000'></countTo>
                  </div>

                </div>
              </div>
              <div class="info-row-item">
                <div class="icon-box bg-green">
                  <div class="icon-circle bg-lightgreen">
                    <i class="iconfont iconzhaobiaofangan"></i>

                  </div>
                </div>
                <div class="info-content green">
                  <div class="title">已创建子方案</div>
                  <div class="num">
                    <countTo separator=''
                             :startVal='0'
                             :endVal='6000'
                             :duration='3000'></countTo>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="card remaining-beds">
          <div class="head">
            <div class="name-wrap">
              <span class="name">剩余床位数</span>
            </div>
            <i class="el-icon-circle-plus-outline"></i>
          </div>
          <div class="content">
            <i class="iconfont iconchuang1 bg-icon"></i>
            <countTo class="num"
                     separator=''
                     :startVal='0'
                     :endVal='2500'
                     :duration='3000'></countTo>
          </div>
        </div>
        <div class="card table-card">
          <div class="head">
            <div class="name-wrap">
              <span class="name">实时入住情况</span>
            </div>
            <i class="iconfont iconexpand-full"></i>
          </div>
          <div class="content">
            <el-table :data="tableData"
                      stripe
                      height="230">
              <el-table-column prop="date"
                               label="日期"
                               width="180">
              </el-table-column>
              <el-table-column prop="name"
                               label="姓名"
                               width="180">
              </el-table-column>
              <el-table-column prop="address"
                               label="地址">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="main-wrap">
        <div class="head">
          <el-select v-model="value"
                     placeholder="请选择入住模式">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-select style="margin-left:17px"
                     v-model="value"
                     placeholder="请选择分配类型">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div style="display:inline-block;width:318px;max-width:318px;margin-left:17px">
            <el-input placeholder="请输入搜索关键词"
                      v-model="input3"
                      class="input-with-select">

              <el-button slot="append"
                         style="primary"
                         icon="el-icon-search"></el-button>
            </el-input>
          </div>

        </div>
        <div class="content">
          <div class="plan-row"
               v-for="i in 3"
               :key="i">
            <plan class="plan-item"
                  v-for="j in 4"
                  :key="j"></plan>

          </div>

        </div>
      </div>
    </el-scrollbar>

  </div>
</template>

<script>

import countTo from 'vue-count-to';
import plan from './components/plan.vue'
export default {
  components: { countTo, plan },
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      input3: ''
    }
  },
}
</script>

<style lang="scss" scoped>
.visualization {
  .blue {
    color: #3385ff;
  }
  .bg-blue {
    background-color: #3385ff;
  }
  .bg-lightblue {
    background-color: #4c94ff;
  }
  .orange {
    color: #e6a23c;
  }
  .bg-orange {
    background-color: #e6a23c;
  }
  .bg-lightorange {
    background-color: #e9ad54;
  }
  .green {
    color: #22b573;
  }
  .bg-green {
    background-color: #22b573;
  }
  .bg-lightgreen {
    background-color: #3dbe84;
  }

  .row-wrap {
    display: flex;
    .card {
      height: 290px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px 0px #d9d9d9;
      & + .card {
        margin-left: 8px;
      }
      .head {
        display: flex;
        height: 46px;
        align-items: center;
        padding: 6px 20px 0;
        border-bottom: 1px solid #f5f7fa;

        .name-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          .name {
            margin-right: 9px;
            font-size: 20px;
            font-weight: 500;
            color: #37465b;
          }
        }
      }
      .content {
      }
    }
    .info-card {
      width: 30%;
      min-width: 330px;
      .head {
        cursor: pointer;
        .name-wrap {
          .status {
            padding: 5px 10px;
            min-height: 24px;
            min-width: 50px;
            background: #ecf5ff;
            border: 1px solid #eceef2;
            border-radius: 4px;
            font-size: 14px;
            color: #3385ff;
            font-weight: 500;
          }
        }
        .el-icon-caret-bottom {
          color: #bcbcbc;
        }
      }
      .content {
        padding: 20px;
        .info-item {
          display: flex;
          font-size: 16px;
          & + .info-item {
            margin-top: 22px;
          }
          .lable {
            min-width: 65px;
          }
          .value {
            flex: 1;
          }
        }
        .info-row {
          display: flex;
          .info-row-item {
            flex: 1;
            display: flex;
            .icon-box {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 46px;
              height: 46px;
              // background: #3385ff;
              border-radius: 4px;
              .icon-circle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                // background-color: #4c94ff;
                border-radius: 50%;
                .iconfont {
                  font-size: 26px;
                  color: #fff;
                }
              }
            }
            .info-content {
              margin-left: 15px;
              flex: 1;
              .title {
                font-size: 10px;
              }
              .num {
                margin-top: 5px;
                font-size: 25px;
              }
            }
          }
        }
      }
    }
    .remaining-beds {
      width: 270px;
      flex-shrink: 0;
      background-color: #e6a23c;
      .head {
        border-bottom: 1px solid #e9af59;
        .name-wrap {
          .name {
            color: #fff;
          }
        }
        .el-icon-circle-plus-outline {
          cursor: pointer;
          color: #fff;
          font-size: 22px;
        }
      }
      .content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 243px;
        .bg-icon {
          position: absolute;
          font-size: 240px;
          color: #e8a94b;
        }
        .num {
          position: relative;
          z-index: 99;
          font-size: 90px;
          color: #fff;
        }
      }
    }
    .table-card {
      flex: 1;
      .head {
        .iconfont {
          cursor: pointer;
          color: #6a6a6a;
          font-size: 14px;
        }
      }
      .content {
        padding: 6px;
      }
    }
  }

  .main-wrap {
    margin-top: 17px;
    .head {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      // height: 58px;
      background: #fefefe;
      border-radius: 10px 10px 0px 0px;
      border-bottom: 1px solid #f0f2f5;
    }
    .content {
      padding: 16px;
      background: #f5f7fa;
      .plan-row {
        display: flex;
        & + .plan-row {
          margin-top: 17px;
        }
        .plan-item {
          flex: 1;
          & + .plan-item {
            margin-left: 12px;
          }
        }
      }
    }
  }
}
</style>