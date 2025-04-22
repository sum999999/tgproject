<template>
  <div class="lottery home-lottery">
    <div class="inner">
      <div class="lottery-list">
        <ul class="lee-change-background">
          <li
            v-for="item in hotList"
            :key="item.lotteryId"
          >
            <router-link
              :to="item.status === '0' ? `${$route.fullPath}` : {name: 'buyLottery', params: {id: item.lotteryId}}"
              :target=" item.status === '1' ? '_blank' : ''"
              :class="{'not-allow':item.status==='0'}"
            >
              <img
                :src="item.lotteryIcon"
                alt=""
              >
              <span>{{item.lotteryName}}
                <!-- 热门彩种描述 -->
                <div
                  class="tooltip-inner"
                  v-if="item.activityDescribe != '无' ? item.activityDescribe != '' ? item.activityDescribe != null ? true : false : false : false"
                  :style="`${item.activityDescribe.length == 3 ? 'right: -70px;' : item.activityDescribe.length == 4 ? 'right: -80px;' : 'right: -49px;'}`"
                >{{item.activityDescribe}}
                  <div class="tooltip-arrow"></div>
                </div>
              </span>
            </router-link>
          </li>
        </ul>
      </div>
      <div
        class="all-lottery"
        :class="{'low-more': type === 1}"
        @mouseleave="leaveMoreList()"
      >
        <div
          class="high-frequency lee-frequency "
          @mouseenter="enterMoreList(1)"
          :class="{active: type === 1}"
        >
          <div
            class="before-document"
            v-show="type == 1 "
          ></div>
          <div class="label">
            <p>高频彩</p>
          </div>
          <ul>
            <li
              v-for="item in highList.slice(0, 4)"
              :key="item.lotteryId"
              class="lee-change-height"
            >
              <router-link
                :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}"
                class="color-hover"
                :class="[item.status === '0' ? 'lottery-pointer-not' : '']"
                :target="item.status === '1' ?  '_blank' : '' "
              >{{item.lotteryName}}</router-link>
            </li>
          </ul>
          <span
            class="more"
            :class="{'dsn': type === 1}"
          >
            <i class="i-icon i-arrow-right"></i>
          </span>
        </div>
        <div
          class="low-frequency lee-frequency"
          @mouseenter="enterMoreList(2)"
          :class="{ 'active':type === 2}"
        >
          <div
            class="before-document"
            v-show="type==2"
          ></div>
          <div class="label">
            <p>低频彩</p>
          </div>
          <ul>
            <li
              v-for="item in lowList.slice(0, 4)"
              :key="item.lotteryId"
              class="lee-change-height"
            >
              <router-link
                :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}"
                class="color-hover"
                :class="[item.status === '0' ? 'lottery-pointer-not' : '']"
                :target="item.status === '1' ?  '_blank' : '' "
              >{{item.lotteryName}}</router-link>
            </li>
          </ul>
          <span
            class="more"
            :class="{'dsn': type === 2}"
          >
            <i class="i-icon i-arrow-right"></i>
          </span>
        </div>
        <!-- -->
        <div
          class="all-list"
          v-show="showList"
        >
          <div class="inner">
            <h3>
              <i
                class="i-icon i-low fl"
                v-show="type === 2"
              ></i>
              <i
                class="i-icon i-high fl"
                v-show="type === 1"
              ></i>
              <span :class="{'i-low-afterspan': type === 2 ,'i-high-afterspan': type === 1 }">{{moreListTitle}}</span>
            </h3>
            <ul>
              <li
                v-for="item in moreList"
                :key="item.lotteryId"
              >
                <router-link
                  :to="item.status === '0' ? `${$route.fullPath}` : {name:'buyLottery',params: {id: item.lotteryId}}"
                  :target=" item.status === '1' ? '_blank' : ''"
                  class="color-hover"
                  :class="{'lottery-pointer-not' : item.status === '0' ,'pointer-not' : item.status === '0','diff-color':type === 2}"
                >{{item.lotteryName}}</router-link>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div class="open-all">
        <router-link
          to="/lottery"
          target="_blank"
        >
          全部彩种&nbsp;&nbsp;&gt;&gt;
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      showList: false,
      type: "",
      moreListTitle: "",
      hotList: [],
      highList: [],
      lowList: [],
      moreList: []
    };
  },
  methods: {
    enterMoreList(type) {
      if (type === 1) {
        this.moreList = this.highList;
        this.moreListTitle = "高频彩";
      } else if (type === 2) {
        this.moreList = this.lowList;
        this.moreListTitle = "低频彩";
      }
      this.type = type;
      this.showList = true;
    },
    leaveMoreList() {
      this.showList = false;
      this.type = "";
    }
  },
  created() {
    this.$http
      .post("/api/v2/lottery/queryLotteryBar", "", { unenc: true })
      .then(response => {
        if (response.data.code !== 0) return;
        this.showFlag = true;
        let data = response.data.data;
        this.hotList = data.lotteryHotList;
        this.highList = data.lotteryHightList;
        this.lowList = data.lotteryLowList;
        let homeLottery = $(".home-lottery")[0];
        if (homeLottery) {
          homeLottery.style.maxHeight = "606px";
          homeLottery.style.height = "606px";
        }
        setTimeout(() => {
          homeLottery = $(".home-lottery")[0];
          if (homeLottery) {
            homeLottery.style.overflow = "visible";
          }
        }, 2000);
      });
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/mixin.less";
@deep: ~'>>>';
.box-shadow(@one,@two,@three,@four,@color) {
  box-shadow: @one @two @three @four @color;
  -webkit-box-shadow: @one @two @three @four @color;
}
.lottery {
  width: 220px;
  position: absolute;
  top: 44px;
  left: 0;
  z-index: 6;
  color: #333;
  border-top: none;
  /*  border: 1px solid @primary-color;
    background-color: @lottery-bg; */
  @{deep}.lottery-list {
    li {
      width: 100%;
      &:last-child {
        a {
          border-bottom: none;
        }
      }
      a {
        display: flex;
        align-items: center;
        width: 218px;
        height: 57px;
        line-height: 56px;
        /*     border-bottom: 1px solid @lottery-list-border; */
        padding-left: 8px;
        color: #000;
        transition: all 0.2s;
        img {
          width: 42px;
          height: 42px;
          margin-right: 5px;
        }
        span {
          position: relative;
        }
        &:hover {
          /*   color: @primary-color;
          background-color: @lottery-list-nav-hover-bg; */
          padding-left: 20px;
        }
        &.not-allow {
          /*  color: @lottery-list-not-allow-color; */
          cursor: not-allowed;
          img {
            .gray();
          }
          &:hover {
            /*   color: @lottery-list-not-allow-color; */
            background: inherit;
          }
        }
      }
    }
  }
  .all-lottery {
    position: relative;
    .label {
      float: left;
      width: 44px;
      line-height: 22px;
      text-align: center;
      display: block;
      /* color: @primary-color; */
    }
    @{deep} .before-document {
      &::before {
        content: "";
        background: #fff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      width: 2px;
      z-index: 2000;
      //   background-color: #fff4ec;
      top: 0;
      right: -2px;
      position: absolute;
      height: 80px;
    }
    .high-frequency {
      height: 82px;
      position: relative;
      /*     border-top: 1px solid @lottery-list-border; */
      &.active {
        border-right: 1px solid #fff4ec;
        /*    border-top-color: @primary-color;
        border-bottom: 1px solid @primary-color; */
      }
      p {
        display: inline-block;
        width: 28px;
        /*    border: 1px solid @primary-color; */
        position: relative;
        margin-top: 6px;
        border-radius: 6px;
        -webkit-border-radius: 6px;
        /*  color: @primary-color; */
      }
      a {
        &:hover {
          /*  color: @primary-color; */
        }
      }
    }
    &.low-more {
      .low-frequency {
        border-top: 1px solid transparent;
      }
      .high-frequency {
        /*   border-top: 1px solid @primary-color; */
      }
    }
   .low-frequency {
      &:extend(.lottery .all-lottery .high-frequency);
      /*   border-bottom: 1px solid @lottery-list-border; */

      p {
        &:extend(.lottery .all-lottery .high-frequency p);
        border: 1px solid #16bd27;
        color: #16bd27;
      }
      a {
        &:hover {
          color: #16bd27;
        }
      }
    }
    .more {
      display: block;
      position: absolute;
      top: 50%;
      right: 6px;
      transform: translate(0, -50%);
      cursor: pointer;
      .i-arrow-right {
        width: 11px;
        height: 18px;
        margin-top: 20px;
        background-position: -176px -114px;
      }
    }
   ul {
      float: left;
      width: 170px;
      max-height: 170px;
      padding: 5px 8px;
      overflow: auto;
      li {
        float: left;
        width: 50%;
        .ellipse();
        line-height: 36px;
        a {
          color: #222;
        }
      }
    }
    .all-list {
      position: absolute;
      top: 0px;
      left: 218px;
      width: 500px;
      height: 207px;

      /*  background-color: @lottery-bg;
      border: 1px solid @primary-color; */
      background-color: #fff;
      .box-shadow(3px, 1px, 2px, 0px, rgba(0, 0, 0, 0.2));
      .inner {
        padding: 7px;
        width: 496px;
        height: 204px;
      }
      h3 {
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        font-weight: normal;
        span {
          padding-left: 10px;
          &.i-high-afterspan {
            /*   color: @primary-color; */
          }
          &.i-low-afterspan {
            color: #16bd27;
            /*  color: @lottery-low-frequency-color; */
          }
        }
      }
      @{deep} ul {
        width: 100%;
        padding: 1px 0;
        li {
          width: 25%;
          text-indent: 10px;
          line-height: 20px;
          height: 20px;
          a {
            font-size: 12px;
            &:hover {
              /*   color: @primary-color; */
            }
            &.diff-color:hover {
              /*  color: @lottery-low-frequency-color; */
            }
          }
        }
      }
    }
  }
  @{deep} .open-all {
    text-align: center;
    line-height: 43px;
    cursor: pointer;
    height: 43px;
    a {
      color: #333;
      &:hover {
        /*    color: @primary-color; */
      }
    }
  }
.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}

.tooltip-arrow {
  bottom: -7px;
  left: 10px;
  border-width: 7px 12px 0 0px;
  /*  border-top-color: @tooltip-inner-bg; */
}

.tooltip-inner {
  position: absolute;
  top: 2px;
  right: -36px;
  padding: 0px 12px;
  white-space: nowrap;
  max-width: 200px;
  color: rgb(255, 255, 255);
  text-align: center;
  /*   background-color: @tooltip-inner-bg; */
  border-radius: 4px;
  -webkit-border-radius: 4px;
  height: 28px;
  line-height: 28px;
  font-size: 20px;
  transform: scale(0.5);
  -webkit-transform: scale(0.5);
  transform-origin: 50% 50%;
  -webkit-transform-origin: 50% 50%;
}
}



</style>

