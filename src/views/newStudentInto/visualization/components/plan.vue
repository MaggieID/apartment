<template>
  <div class="plan">
    <div class="head">
      <i class="iconfont iconhetong"></i>
      <i class="iconfont iconrenqun1 blue"></i>
      <i class="iconfont iconic_bedroom1 orange"></i>
      <i class="iconfont icona-zu2571"></i>
    </div>
    <div class="content">
      <div class="info-row"
           style="height:34px">
        <div class="info-item">
          <div class="lable">方案名称：</div>
          <div class="value">的说法三大法师打发斯蒂芬</div>
        </div>
        <div class="info-item">
          <div class="lable">分配学院：</div>
          <div class="value">的说法三大法师打发斯蒂芬</div>
        </div>
      </div>
      <div class="info-row"
           style="margin-top:8px;height:34px">
        <div class="info-item">
          <div class="lable">入住模式：</div>
          <div class="value">自动入住</div>
        </div>
        <div class="info-item">
          <div class="lable">负责人：</div>
          <div class="value">张超</div>
        </div>
      </div>
      <div class="info-row">
        <div class="num-box blue">
          <div class="title">已添加人员</div>
          <div class="num">
            <countTo separator=''
                     :startVal='0'
                     :endVal='2500'
                     :duration='3000'></countTo>
          </div>
          <i class="iconfont iconrenshu bg-icon"></i>
        </div>
        <div class="num-box orange">
          <div class="title">已添加床位</div>
          <div class="num">
            <countTo separator=''
                     :startVal='0'
                     :endVal='2500'
                     :duration='3000'></countTo>
          </div>
          <i class="iconfont iconchuang1 bg-icon"></i>
        </div>
      </div>
      <div class="info-row"
           style="margin-top:8px">
        <div class="num-box green">
          <div class="title">已分配</div>
          <div class="num">
            <countTo separator=''
                     :startVal='0'
                     :endVal='2500'
                     :duration='3000'></countTo>
          </div>
          <i class="iconfont iconchuang21 bg-icon"></i>
        </div>
        <div class="num-box green">
          <div class="title">已入住</div>
          <div class="num">
            <countTo separator=''
                     :startVal='0'
                     :endVal='2500'
                     :duration='3000'></countTo>
          </div>
          <i class="iconfont iconchuang21 bg-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from 'vue-count-to';

export default {
  name: 'plan',
  components: { countTo },

}
</script>

<style lang="scss" scoped>
$bule: #3385ff;
$orange: #e6a23c;
$green: #22b573;
.plan {
  height: 302px;
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px #dfdfdf;
  border-radius: 5px;
  .head {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 16px;
    border-bottom: 1px solid #f5f7fa;
    i {
      cursor: pointer;
      color: #848391;
      & + i {
        margin-left: 18px;
      }
      &.blue {
        color: $bule;
      }
      &.orange {
        color: $orange;
      }
    }
  }
  .content {
    padding: 16px 16px 10px;
    .info-row {
      display: flex;
      & + .info-row {
        // margin-top: 18px;
      }
      .info-item {
        display: flex;
        flex: 1;
        font-size: 12px;
        line-height: 16px;
        & + .info-item {
          margin-left: 8px;
        }
        .lable {
          min-width: 65px;
          color: #767a7f;
        }
        .value {
          flex: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .num-box {
        position: relative;
        flex: 1;
        height: 80px;
        border-radius: 4px;
        color: #fff;
        text-align: center;
        & + .num-box {
          margin-left: 8px;
        }
        &.blue {
          background-color: $bule;
          .bg-icon {
            color: #4c92f6;
          }
        }
        &.green {
          background-color: $green;

          .bg-icon {
            color: #4cc58f;
          }
        }
        &.orange {
          background-color: $orange;

          .bg-icon {
            color: #e8a847;
          }
        }

        .bg-icon {
          position: absolute;
          left: 0;
          bottom: -10px;
          font-size: 76px;
        }
        .title {
          position: relative;
          margin-top: 10px;
          font-size: 14px;
          z-index: 99;
        }
        .num {
          position: relative;
          margin-top: 2px;
          z-index: 99;
          font-size: 40px;
          color: #fff;
        }
      }
    }
  }
}
</style>