<template>
  <div
    class="tab-body"
    v-loading="loading"
    id="scrollBody"
  >
<!--    <BackTop></BackTop>-->
    <div class="title-tab">
      <ul class="title">
        <li>{{$tex("基本走势")}}</li>
      </ul>
      <div class="date-choice">
        <date-choice @sendData="getChiceDate"></date-choice>
      </div>
    </div>
    <div
      class="record-list"
      @mouseenter="showIndictor"
      @mouseleave="hideIndictor"
    >
      <ul
        class="ul_pre"
        :style="{'top':top+'px'}"
        v-if="isShowIndictorWrap"
      >
        <li
          class="pre_li"
          v-if="showPreIndictor"
          @click.self="goPre"
        ></li>
        <li
          class="next_li"
          v-if="showNextIndictor"
          @click.self="goNext"
        ></li>
      </ul>
      <div
        v-if="trendList.length"
        class="trend-content-wrap"
      >
        <table
          border="0 "
          cellspacing="0 "
          cellpadding="0"
          id="table-content"
          class="common-table"
          :class="[code==='klsf'?'klsf-table':'']"
        >
          <tr>
            <td
              v-for=" (item,index) in trendTitle "
              :key="index "
              :rowspan="index<=1&&item.rowspan "
              :colspan="index>=1&&item.colspan"
            >{{item.title?item.title:item}}</td>
          </tr>
          <tr>
            <td
              v-for="(num,index) in openBalls"
              :key="index"
              class="example-ball"
            >
              <span>{{num}}</span>
            </td>
          </tr>
          <tr
            v-for="(item,idx) in trendList "
            :key="idx"
          >
            <td>{{item.periodNo}}</td>
            <template v-if="code!=='klsf'">
              <td
                v-for="(ballInfo,index) in item.trendNumbers"
                :key="index"
                class="example-ball prize-ball"
              >
                <span>{{ballInfo}}</span>
              </td>
            </template>
            <template v-else-if="code==='klsf'">
              <td class="klsf">
                <span
                  v-for="(ballInfo,index) in item.trendNumbers"
                  :key="index"
                  class="prize-ball"
                >{{ballInfo}}</span>
              </td>
            </template>
            <td
              v-for="(number,index) in item.trendResultNumber"
              :key="`trendResultNumber-${index}`"
            >
              <span
                v-if="typeof number==='object'"
                :ref="'line-trend' + idx + number.num"
                class="win-ball"
                :class="[code==='klsf'&&index>19?'special-win-ball':'']"
                :style="{'background':number.clr}"
              >{{number.content}}</span>
              <span
                v-else-if="typeof number==='object'"
                :class="[number.isDouble?'double-ball':'',number.isLarge?'large-ball':'']"
              >{{number.content}}</span>
              <span
                v-else
                :class="[number==='green'?'green-ball':number==='gray'?'gray-ball':number==='red'?'red-ball':number==='blue'?'blue-ball':'']"
              >{{number==='green'?$tex('绿波'):number==='gray'?$tex('灰波'):number==='red'?$tex('红波'):number==='blue'?$tex('蓝波'):number}}</span>
            </td>
          </tr>
          <tr>
            <td
              v-for="(item,index) in statCategory"
              :key="index"
              :rowspan="item.rowspan"
              :colspan="item.colspan"
              class="weight-title"
            >
              {{item.title}}
            </td>
          </tr>
          <tr>
            <td
              v-for="(num,index) in openBalls"
              :key="index"
              class="weight-title"
            >
              {{num}}
            </td>
          </tr>
          <tr class="times">
            <td :colspan="code==='klsf'?2:openBallCount*1+1">{{$tex("出现次数")}}</td>

            <td
              v-for="(item,index) in trendList.trendTimesInfo"
              :key="index"
            >{{item}}</td>
          </tr>
          <tr class="ave-miss">
            <td :colspan="code==='klsf'?2:openBallCount*1+1">{{$tex("平均遗漏")}}</td>
            <td
              v-for="(item,index) in trendList.trendAverMiss"
              :key="index"
            >{{item}}</td>
          </tr>
          <tr class="max-miss">
            <td :colspan="code==='klsf'?2:openBallCount*1+1">{{$tex("最大遗漏")}}</td>
            <td
              v-for="(item,index) in trendList.trendMaxMiss"
              :key="index"
            >{{item }}
            </td>
          </tr>
          <tr class="continue">
            <td :colspan="code==='klsf'?2:openBallCount*1+1">{{$tex("最大连出")}}</td>
            <td
              v-for="(item,index) in trendList.trendConnects"
              :key="index"
            >{{item }}
            </td>
          </tr>
          <tr
            class="continue"
            v-if="code==='11x5'"
          >
            <td :colspan="openBallCount*1+1">{{$tex("当前遗漏")}}</td>
            <td
              v-for="(item,index) in trendList.currMiss"
              :key="index"
            >{{item }}
            </td>
          </tr>
        </table>
      </div>
      <div
        v-else
        style="height:100px;text-align:center;line-height:90px;"
      >{{$tex("暂无数据")}}</div>
    </div>
  </div>
</template>
<script>
import { getCanvasLine } from "../commonJs/drawCanvas.js";
import config from "../const.js";
import dateChoice from "./dateChoice.vue";
import eleInfo from "@/utils/dom.js";
export default {
  components: {
    dateChoice
  },
  props: {
    code: {
      //彩种大类
      type: String
    },
    lotteryId: {
      type: String
    },
    openBallCount: {
      type: String
    }
  },
  data() {
    return {
      openBalls: [],
      trendTitle: [],
      statCategory: [],
      params: {
        lotteryId: "",
        num: "200"
      },
      trendList: [],
      loading: false,
      top: 180, //初始状态指示器相对于父级的位置
      wrapOffsetTop: 0, //表格容器顶部与文档的距离
      showPreIndictor: false, //是否显示指示器
      showNextIndictor: false,
      isShowIndictorWrap: false //是否显示指示器
    };
  },
  methods: {
    goPre() {
      //点击左指示器
      let wrap = document.getElementsByClassName("trend-content-wrap")[0];
      let width = wrap.clientWidth;
      wrap.scrollLeft =
        wrap.scrollLeft - width < 0 ? 0 : wrap.scrollLeft - width;
      this.showIndictor();
    },
    goNext() {
      //点击右指示器
      let wrap = document.getElementsByClassName("trend-content-wrap")[0];
      let width = wrap.clientWidth;
      wrap.scrollLeft =
        wrap.scrollLeft + width === wrap.scrollWidth
          ? wrap.scrollWidth
          : wrap.scrollLeft + width;
      this.showIndictor();
    },
    hideIndictor() {
      //鼠标移入
      this.showPreIndictor = false;
      this.showNextIndictor = false;
    },
    showIndictor() {
      //鼠标移出
      let wrap = document.getElementsByClassName("trend-content-wrap")[0];
      if (wrap && wrap.scrollLeft === 0) {
        this.showPreIndictor = false;
      } else {
        this.showPreIndictor = true;
      }
      if (wrap.scrollWidth === wrap.clientWidth + wrap.scrollLeft) {
        this.showNextIndictor = false;
      } else {
        this.showNextIndictor = true;
      }
    },
    setBaseCanvas() {
      getCanvasLine(
        this,
        "table-content",
        "line-trend",
        this.openBallCount * 1,
        this.trendList
      );
      this.loading = false;
    },
    getChiceDate(result) {
      //获取选择的时间
      this.params = Object.assign({}, this.params, result);
      this.getData();
    },
    initScrollEvent() {
      window.addEventListener("scroll", this.setElementTop, false);
      if (!this.trendList.length) return;
      let wrap = document.getElementsByClassName("trend-content-wrap")[0];
      wrap && wrap.addEventListener("scroll", this.showIndictor, false);
      setTimeout(() => {
        this.wrapOffsetTop = eleInfo.getElementPosition(wrap).y; //获取元素相对于文档的高度
        this.isShowIndictorWrap = true;
      }, 1000);
    },
    getData() {
      let length = this.trendList.length;
      this.loading = true;
      this.$http
        .post("/api/v2/trend/queryOpencodes", this.params, { unenc: true })
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          let recordList = response.data.data.records;
          this.trendList = config[this.code].getBaseTrendData(recordList);
          // this.$nextTick(() => {
          //   this.initScrollEvent();
          // })
          if (this.code === "klsf") {
            //不需要绘图
            this.loading = false;
            return;
          }
          let canvas = document.getElementsByTagName("canvas");
          let table = document.getElementById("table-content");
          if (canvas.length) {
            for (let i = 1; i <= this.openBallCount * 1; i++) {
              for (let j = 1; j <= length - 1; j++) {
                let cas = document.getElementById("table-canvas" + i + j);
                if (cas) {
                  table.removeChild(cas);
                }
              }
            }
          }
          this.$nextTick(() => {
            //   if (!this.trendList.length) return;
            if (this.trendList.length) {
              this.setBaseCanvas();
            }
            this.initScrollEvent();
          });
        });
    },
    setElementTop() {
      let scrollTop = eleInfo.getScrollTop();
      if (scrollTop < 180) {
        this.top = 180;
      } else if (
        eleInfo.getScrollHeight() - 180 >=
        eleInfo.getScrollTop() + eleInfo.getWindowHeight()
      ) {
        this.top = eleInfo.getScrollTop();
      }
    }
  },
  //   mounted () {

  //   },
  created() {
    this.params.lotteryId = this.lotteryId;
    this.trendTitle = config[this.code].trendTitle;
    this.openBalls = config[this.code].openBalls;
    this.statCategory = config[this.code].statCategory;
    this.getData();
  },
  beforeDestroy() {
    let wrap = document.getElementsByClassName("trend-content-wrap")[0];
    if (wrap) {
      wrap.removeEventListener("scroll", this.showIndictor);
    }
    window.removeEventListener("scroll", this.setElementTop);
  }
};
</script>
<style lang="less" scoped>
  #table-content {
    table-layout: auto;
  }
</style>
<style lang="less">
.tab-body {
  overflow: hidden;
  border-bottom: 0;
  .title-tab {
    width: 100%;
    height: 52px;
    line-height: 52px;
    border: 1px solid #dbdbdb;
    border-top: none;
    .title {
      &:first-child {
        float: left;
        font-size: 18px;
        font-weight: bold;
        line-height: 54px;
        padding-left: 20px;
      }
    }
    .date-choice {
      float: right;
      font-size: 14px;
    }
  }
  .record-list {
    width: 100%;
    position: relative;
    border: 1px solid #f1f1f1;
    border-top: none;
    padding: 9px 19px 19px;
    .ul_pre {
      position: absolute;
      left: 30px;
      width: 100%;
      z-index: 4;
      li {
        float: left;
        width: 40px;
        height: 140px;
        background-image: url("/static/images/trend_prev.png");
        background-position: center center;
        background-color: rgba(0, 0, 0, 0.25);
        background-repeat: no-repeat;
        cursor: pointer;
        &.next_li {
          float: right;
          margin-right: 60px;
          background-image: url("/static/images/trend_next.png");
        }
      }
    }
    .trend-content-wrap {
      width: 100%;
      border-right: 1px solid #dbdbdb;
      border-left: 1px solid #dbdbdb;
      overflow-y: auto;
      // overflow-x: scroll;
      overflow-x: auto;
      transition: scrollLeft 0.2s ease-out;
      -webkit-transition: scrollLeft 0.2s ease-out;
      .common-table {
        position: relative;
        min-width: 100%;
        color: #282828;
        border: 1px solid #dbdbdb;
        position: relative;
        border-right: none;
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        &.pcdd-table {
          border-left: none;
        }
        tr {
          &:first-child {
            font-weight: bold;
          }
          &:nth-child(2) {
            font-weight: bold;
          }
          &:nth-child(3) {
            td {
              &:first-child {
                padding: 0 6px;
              }
            }
          }
          td {
            border-right: 1px solid #dbdbdb;
            border-bottom: 1px solid #dbdbdb;
            text-align: center;
            height: 40px;
            color: #575757;
            &:nth-child(2) {
              padding: 0 6px;
            }
            &:last-child {
              border-right: none;
            }
            span {
              width: 20px;
              text-align: center;
            }
            &.example-ball {
              font-size: 12px;
              min-width: 32px;
              span {
                display: inline-block;
                width: 19px;
                height: 19px;
                line-height: 19px;
              }
            }
            .win-ball {
              display: inline-block;
              width: 19px;
              height: 19px;
              line-height: 19px;
              position: relative;
              border-radius: 50%;
              color: #fff;
              z-index: 2;
              text-align: center;
            }
            &.prize-ball {
              span {
                background: rgb(240, 57, 57);
                border-radius: 50%;
                color: #fff;
              }
            }
            &.weight-title {
              font-weight: bold;
              font-size: 14px;
            }
            &.klsf {
              span {
                /*     color: #be1204; */
                margin: 0 2px;
              }
            }
            // &.ksan {
            //     span {
            //         display: inline-block;
            //         vertical-align: middle;
            //         width: 30px;
            //         height: 30px;
            //         background: url(/static/images/trend-icons.png);
            //         background-position: 0 0;
            //         margin-top: 3px;
            //         &.ksan-2 {
            //             background-position: -32px 0;
            //         }
            //         &.ksan-3 {
            //             background-position: -64px 0;
            //         }
            //         &.ksan-4 {
            //             background-position: -96px 0;
            //         }
            //         &.ksan-5 {
            //             background-position: -128px 0;
            //         }
            //         &.ksan-6 {
            //             background-position: -160px 0;
            //         }
            //     }
            // }
          }
          &.times {
            background-color: rgb(252, 237, 237);
          }
          &.max-miss {
            background-color: rgb(255, 254, 196);
          }
          &.ave-miss {
            background-color: rgb(196, 254, 255);
          }
          &.continue {
            background-color: rgb(223, 255, 225);
          }
        }
        // .pcdd-tr {
        //     &:last-child {
        //         td {
        //             border-bottom: none;
        //         }
        //     }
        //     td {
        //         font-weight: normal;
        //         &:nth-child(2) {
        //             span {
        //                 display: inline-block;
        //                 vertical-align: middle;
        //                 width: 24px;
        //                 height: 24px;
        //                 line-height: 24px;
        //                 margin-top: 2px;
        //                 &.prize-ball {
        //                     background-color: #0064ec;
        //                     color: #fff;
        //                     border-radius: 50%;
        //                     -webkit-border-radius: 50%;
        //                     &:last-child {
        //                         background-color: #f13214;
        //                     }
        //                 }
        //             }
        //         }
        //         span {
        //             &.double-ball {
        //                 color: #f13214;
        //             }
        //             &.large-ball {
        //                 color: #f13214;
        //             }
        //             &.green-ball {
        //                 color: #11c619;
        //             }
        //             &.red-ball {
        //                 color: #f13214;
        //             }
        //             &.blue-ball {
        //                 color: #0064ec;
        //             }
        //             &.gray-ball {
        //                 color: #989899;
        //             }
        //         }
        //     }
        // }
        // .six-he {
        //     td {
        //         height: 60px;
        //         &:nth-child(2) {
        //             span {
        //                 font-size: 0;
        //                 margin: 6px 2px 0 2px;
        //             }
        //         }
        //         &.ball-info {
        //             max-width: 32px;
        //             span {
        //                 border-radius: 50%;
        //                 height: 24px;
        //                 line-height: 24px;
        //                 color: #fff;
        //                 margin: 0;
        //             }
        //         }
        //         &.six-he-single {
        //             span {
        //                 background-color: #b2b2b2;
        //             }
        //         }
        //         &.six-he-double {
        //             span {
        //                 background-color: #ff7614;
        //             }
        //         }
        //         &.six-he-small {
        //             span {
        //                 background-color: #b2b2b2;
        //             }
        //         }
        //         &.six-he-large {
        //             span {
        //                 background-color: #ff7614;
        //             }
        //         }
        //         &.six-he-red {
        //             span {
        //                 width: inherit;
        //                 color: #ec0022;
        //             }
        //         }
        //         &.six-he-blue {
        //             span {
        //                 width: inherit;
        //                 color: #0064ec;
        //             }
        //         }
        //         &.six-he-green {
        //             span {
        //                 width: inherit;
        //                 color: #11c619;
        //             }
        //         }
        //         &.six-he-equal {
        //             span {
        //                 width: inherit;
        //                 color: inherit;
        //             }
        //         }
        //         &.special-ball-info {
        //             max-width: 32px;
        //             &:first-child {
        //                 color: inherit;
        //             }
        //             &:nth-child(3) {
        //                 color: inherit;
        //             }
        //             span {
        //                 &:extend(.tab-body
        //                         .record-list
        //                         .trend-content-wrap
        //                         .common-table
        //                         .six-he
        //                         td.ball-info
        //                         span);
        //                 color: inherit;
        //             }
        //             &.six-he-single {
        //                 span {
        //                     background-color: #b2b2b2;
        //                     color: #fff;
        //                 }
        //             }
        //             &.six-he-double {
        //                 span {
        //                     background-color: #ff7614;
        //                     color: #fff;
        //                 }
        //             }
        //             &.six-he-small {
        //                 span {
        //                     background-color: #b2b2b2;
        //                     color: #fff;
        //                 }
        //             }
        //             &.six-he-large {
        //                 span {
        //                     background-color: #ff7614;
        //                     color: #fff;
        //                 }
        //             }
        //             &.six-he-red {
        //                 span {
        //                     width: inherit;
        //                     color: #ec0022;
        //                 }
        //             }
        //             &.six-he-blue {
        //                 span {
        //                     width: inherit;
        //                     color: #0064ec;
        //                 }
        //             }
        //             &.six-he-green {
        //                 span {
        //                     width: inherit;
        //                     color: #11c619;
        //                 }
        //             }
        //         }
        //         span {
        //             display: inline-block;
        //             vertical-align: middle;
        //             width: 24px;
        //             text-align: center;
        //             &.sum-char {
        //                 width: 12px;
        //                 i {
        //                     &:first-child {
        //                         background: none;
        //                     }
        //                 }
        //             }
        //             i {
        //                 display: inline-block;
        //                 vertical-align: middle;
        //                 width: 100%;
        //                 height: 24px;
        //                 line-height: 24px;
        //                 font-size: 14px;
        //                 color: #1a8fdb;
        //                 &:first-child {
        //                     border-radius: 50%;
        //                     background: url('/static/images/trend-icons.png')
        //                         no-repeat 0 -38px;
        //                     &.red {
        //                         background-position: -28px -38px;
        //                         color: #f13214;
        //                     }
        //                     &.green {
        //                         background-position: -58px -38px;
        //                         color: #28b169;
        //                     }
        //                 }
        //                 &:last-child {
        //                     color: #999;
        //                 }
        //             }
        //         }
        //     }
        // }
      }
      .klsf-table {
        tr {
          &:first-child {
            td {
              &:nth-child(1) {
                width: 70px;
              }
              &:nth-child(2) {
                width: 170px;
              }
              &:nth-child(3) {
                width: 470px;
              }
            }
          }
          td {
            &:last-child {
              border-right: none;
            }
            &.example-ball {
              span {
                width: inherit;
                font-size: 14px;
              }
            }
            span {
              &.special-win-ball {
                width: 100%;
                height: 40px;
                line-height: 40px;
                border-radius: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
