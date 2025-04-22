<template>
  <div
    class="direct-trend"
    v-loading="loading"
  >
<!--    <BackTop></BackTop>-->
    <div class="title-tab">
      <ul class="title">
        <li>{{$tex("位置走势")}}</li>
      </ul>
      <!-- <ul>
                <li v-for="(item,index) in dates" :key="index" @click="searchByDate(index)" :class="{'active':dateIndex===index}">{{item}}</li>
            </ul> -->
      <div class="date-choice">
        <date-choice @sendData="getChiceDate"></date-choice>
      </div>
    </div>
    <div
      v-if="directTrendList.length"
      class="table-wrap"
    >
      <div
        class="tip"
        @click="tipFlag=!tipFlag"
        :class="{'large-height':tipFlag}"
        @mouseleave="tipFlag=false"
      >
        <p>
          <span>{{$tex("说明")}}:</span>{{$tex("1 奇偶：除2余数为1的为奇数，含1、3、5、7、9，除2余0的为偶数，含2、4、6、8、10；")}}
          <i></i>
        </p>
        <p>
          <span></span>{{$tex("2 大小：6、7、8、9、10为大数，1、2、3、4、5为小数;")}}</p>
        <p>
          <span></span>{{$tex("3 012路：除3余数为0的为0路号码，包含3、6、9,；除3余数为1的为1路号码，包含1、4、7、10；除3余数为2的为2路号码，包含2、5、8;")}}</p>
        <p>
          <span></span>{{$tex("4 升平降：比上期奖号数值大的，表示本期奖号特征为升；与上期相同的，表示本期奖号特征为平；比上期奖号数值小的，表示本期奖号特征为降;")}}</p>
        <p>
          <span></span>{{$tex("5 分隔线：每五期使用分隔线，使横向导航更加清晰;")}}</p>
        <p>
          <span></span>{{$tex("6 出现总次数：统计期数内实际出现的次数;")}}</p>
        <p>
          <span></span>{{$tex("7 遗漏：自上期开出到本期间隔的期数;")}}</p>
        <p>
          <span></span>{{$tex("8 平均遗漏：统计期数内遗漏的平均值。（计算公式：平均遗漏＝（统计期数-出现次数）/ 出现次数）;")}}</p>
        <p>
          <span></span>{{$tex("9 最大遗漏：统计期数内遗漏的最大值;")}}</p>
        <p>
          <span></span>{{$tex("10 当前遗漏：自上期开出到当前期所间隔的期数;")}}</p>
        <p>
          <span></span>{{$tex("11 最大连出值：统计期数内连续开出的最大值;")}}</p>
      </div>
      <div class="tab">
        <ul>
          <li
            v-for="(item,index) in positionTrendTab"
            :key="index"
            @click="changeRank(index)"
            :class="{'active':directMenuFlag===index}"
          >{{item}}</li>
        </ul>
      </div>
      <div
        id="direct-table-wrap"
        style="position:relative"
      >
        <table
          border="0 "
          cellspacing="0 "
          cellpadding="0"
          id="direct-table"
        >
          <tbody>
            <tr>
              <td
                v-for="(item,index) in directTableTitle"
                :key="index"
                :colspan="index===2?item[directMenuFlag].colspan:item.colspan"
              >{{index===2?item[directMenuFlag].title:item.title}}</td>
            </tr>
            <tr
              v-for="(item,topIndex) in directTrendList"
              :key="topIndex"
            >
              <td>{{item.periodNo}}</td>
              <td>
                <span
                  v-for="(ball,index) in item.lotteryNumber.split(',')"
                  :key="index"
                  :class="{'number-active':index===directMenuFlag}"
                >{{ball}}&nbsp;</span>
              </td>
              <td
                v-for="(itms,idx) in item.directResultNumber"
                :key="idx"
                :class="[idx<10?'gray-bg':'',idx>9?'no-padding':'']"
              >
                <span
                  v-if="typeof itms ==='object'&&!itms.type"
                  :class="[itms.clr?'txt-ball':'']"
                  :style="{'background-color':itms.clr}"
                >{{itms.content}}</span>
                <span
                  v-else-if="typeof itms==='object'&&itms.type&&itms.type==='ball'"
                  class="win-ball"
                  :ref='"line-direct" + topIndex'
                >{{itms.content}}</span>
                <span v-else>{{itms}}</span>
              </td>
            </tr>
            <tr>
              <td
                v-for="(item,index) in directTrendStaticTitle"
                :key="index"
                :colspan="item.colspan"
                :rowspan="item.rowspan"
                class="static-title"
              >{{item.title}}</td>
            </tr>
            <tr>
              <td
                v-for="(item,index) in directTrendStaticSubTitle"
                :key="index"
                class="static-title"
              >{{item}}</td>
            </tr>
            <tr class="times">
              <td colspan="2">{{$tex("总次数")}}</td>
              <td
                v-for="(item,index) in directTrendList.directTrendTimesInfo"
                :key="index"
              >{{item}}</td>
            </tr>
            <tr class="ave-miss">
              <td colspan="2">{{$tex("平均遗漏")}}</td>
              <td
                v-for="(item,index) in directTrendList.directTrendAverMiss"
                :key="index"
              >{{item}}</td>
            </tr>
            <tr class="max-miss">
              <td colspan="2">{{$tex("当前遗漏")}}</td>
              <td
                v-for="(item,index) in directTrendList.directTrendMaxMiss"
                :key="index"
              >{{item}}</td>
            </tr>
            <tr class="continue">
              <td colspan="2">{{$tex("最大连出")}}</td>
              <td
                v-for="(item,index) in directTrendList.directTrendMaxConnects"
                :key="index"
              >{{item}}</td>
            </tr>
            <tr class="continue">
              <td colspan="2">{{$tex("最大遗漏")}}</td>
              <td
                v-for="(item,index) in directTrendList.directTrendMaxMiss"
                :key="index"
              >{{item}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      v-else
      style="height:100px;text-align:center;line-height:90px;border:1px solid #f1f1f1;border-top:none;"
    >暂无数据</div>
  </div>
</template>

<script>
import config from "../const.js";
import { getCanvasLine } from "../commonJs/drawCanvas.js";
import dateChoice from "./dateChoice.vue";
export default {
  components: {
    dateChoice
  },
  props: {
    code: {
      type: String
    },
    lotteryId: {
      type: String
    }
  },
  data() {
    return {
      dateIndex: 0,
      tipFlag: false, //位置走势贴士
      positionTrendTab: [], //号码tab
      directTableTitle: [], //表格标题
      directTrendStaticTitle: [], //数据统计标题
      directTrendStaticSubTitle: [], //表格底部标题
      directMenuFlag: 0, //位置走势号码标识
      directTrendList: [], //走势
      params: {
        lotteryId: "",
        num: "200"
      },
      loading: false
    };
  },
  methods: {
    /**
     *  切换名次
     */
    changeRank(index) {
      if (this.directMenuFlag === index) return;
      this.directMenuFlag = index;
      this.directTrendList = config[this.code].getDirectTrend(
        this.directTrendList,
        index
      );
      let table = document.getElementById("direct-table-wrap");
      for (let i = 1; i <= this.directTrendList.length - 1; i++) {
        table.removeChild(document.getElementById("table-canvas" + i));
      }
      this.$nextTick(() => {
        this.setCanvasLine();
      });
    },
    getChiceDate(result) {
      //获取选择的时间
      this.params = Object.assign(result, this.params);
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$http
        .post("/api/v2/trend/queryOpencodes", this.params, { unenc: true })
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          let data = response.data.data;
          let recordList = data.records;
          let table = document.getElementById("direct-table-wrap");
          if (document.getElementById("table-canvas1")) {
            for (let i = 1; i <= this.directTrendList.length - 1; i++) {
              table.removeChild(document.getElementById("table-canvas" + i));
            }
          }
          this.directTrendList = config[this.code].getDirectTrend(
            recordList,
            this.directMenuFlag
          );
          if (this.directTrendList.length) {
            this.$nextTick(() => {
              this.setCanvasLine();
            });
          }
        });
    },
    /**
     * canvas绘图
     */
    setCanvasLine() {
      getCanvasLine(
        this,
        "direct-table-wrap",
        "line-direct",
        1,
        this.directTrendList
      );
    }
  },
  created() {
    this.params.lotteryId = this.lotteryId;
    this.positionTrendTab = config[this.code].positionTrendTab;
    this.directTableTitle = config[this.code].directTableTitle;
    this.directTrendStaticTitle = config[this.code].directTrendStaticTitle;
    this.directTrendStaticSubTitle =
      config[this.code].directTrendStaticSubTitle;
    this.getData();
  }
};
</script>

<style lang="less">
.direct-trend {
  table {
    min-width: 100%;
    color: #282828;
    border: 1px solid #dbdbdb;
    border-bottom: none;
    position: relative;
    td {
      border-right: 1px solid #eaeaea;
      border-bottom: 1px solid #eaeaea;
      text-align: center;
      height: 40px;
      color: #575757;
    }
    &#direct-table {
      min-width: 100%;
      color: #282828;
      border: 1px solid #dbdbdb;
      border-bottom: none;
      position: relative;
      tr {
        &:first-child {
          height: 40px;
          background: #f5f5f5;
          td {
            background-color: #e7e7e7;
            font-size: 14px;
          }
        }
      }
      td {
        width: 32px;
        border-bottom: 1px solid #eaeaea;
        text-align: center;
        height: 40px;
        font-size: 12px;
        color: #555;
        border-right-color: #d0d0d0;
        border-bottom-color: #d0d0d0;
        background-color: #fff;
        &:first-child {
          padding: 0 6px;
        }
        &:last-child {
          border-right: none;
        }
        &.gray-bg {
          background-color: #fcf9f2;
          span {
            display: inline-block;
            width: 19px;
          }
        }
        &.no-padding {
          padding: 0;
        }
        &.static-title {
          background: #ebebeb;
          font-size: 14px;
        }
        span {
          text-align: center;
          &.number-active {
            color: @primary-color;
          }
          &.win-ball {
            background-color: #1fa6e8;
            width: 19px;
            height: 19px;
            line-height: 19px;
            position: relative;
            border-radius: 50%;
            color: #fff;
            z-index: 200;
            text-align: center;
          }
          &.txt-ball {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            line-height: 38px;
          }
        }
      }
    }
  }
  .title-tab {
    height: 52px;
    line-height: 52px;
    border: 1px solid #e4e4e4;
    border-top: none;
    .title {
      float: left;
      padding-left: 19px;
      li {
        cursor: inherit;
        font-weight: bold;
        font-size: 18px;
        color: #333;
      }
    }
    .date-choice {
      float: right;
    }
  }
  .table-wrap {
    margin-top: 0;
    padding: 19px;
    background-color: #fafafa;
    border: 1px solid #f1f1f1;
    border-top: none;
    .tip {
      width: 960px;
      line-height: 28px;
      height: 30px;
      padding: 0 6px;
      border: 1px solid #dfe1e1;
      overflow: hidden;
      position: relative;
      background-color: #edf4fa;
      &.large-height {
        height: 100%;
      }
      p {
        color: #545454;
        &:first-child {
          cursor: pointer;
        }
      }
      i {
        position: absolute;
        right: 0;
        top: 0;
        display: block;
        width: 30px;
        height: 30px;
        background: url("/static/images/pre_p.png") no-repeat center center;
      }
      span {
        display: inline-block;
        width: 50px;
        color: #2cbaf5;
      }
    }
    .tab {
      padding: 20px 0;
      ul {
        margin-left: -25px;
        li {
          float: left;
          text-align: center;
          width: 58px;
          height: auto;
          line-height: 32px;
          margin-left: 25px;
          border: 1px solid #ddd;
          -webkit-border-radius: 4px;
          cursor: pointer;
          word-break: break-all;
          padding: 0 4px;
          &.active {
            /*  background-color: @primary-color; */
            border: none;
            color: #fff;
          }
        }
        &:after {
          display: block;
          content: "";
          clear: both;
          height: 0;
          visibility: hidden;
        }
      }
    }
  }
}
</style>

