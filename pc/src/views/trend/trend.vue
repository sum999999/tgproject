<template>
  <div
    class="trend-list-contanier "
    v-loading="loading"
  >
    <div class="content">
      <ul class="list-type clearfix ">
        <li
          v-for="item in list"
          @click="changeLotteryCategory(item)"
          :key="item.lotteryType"
          :class="{'selected':item.code==currentType}"
        >
          <img
            class="img"
            :src="item.icon"
            alt=""
          >
          <span class="typeName">{{item.typeName}}</span>
        </li>
      </ul>
      <!-- 图表 -->
      <div
        class="echart-wrap"
        v-if="recordList.length"
      >
        <div class="main-title">
          <ul>
            <li
              v-for="(item,index) in lotterys"
              :key="index"
              @click="changeSubMenu(item)"
              :class="[lotteryId===item.lotteryId?'active':'']"
            >
              {{item.lotteryName}}
            </li>
          </ul>
          <ul>
            <li
              v-for="(item,index) in ballsTitle"
              :key="index"
              @click="showTrend(index)"
              :class="[titleIndex===index?'active':'']"
            >{{item}}</li>
          </ul>
        </div>
        <div class="my-chart">
          <line-chart
            :xData='peroidNo'
            :maxLabel="maxLabel"
            :splitNumber='splitNumber'
            :seriesData="seriesData"
          ></line-chart>
        </div>
      </div>
      <!-- 去走势的菜单 -->
      <ul
        class="lottery-list clearfix"
        v-if="subLotterys.length"
      >
        <li
          class="item"
          v-for="item in subLotterys"
          :key="item.lotteryType"
        >
          <div class="inner">
            <div class="info">
              <img
                class="img"
                :src="item.lotteryIcon"
                alt=""
              >
              <p class="name">{{item.lotteryName}}</p>
            </div>
            <ul class="types clearfix">
              <li
                :key="index"
                v-for="(disp,index) in item.disps"
                :displayId="disp.displayId"
              >
                <span @click="goTrendDetail(disp)">{{disp.displayName}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import lineChart from "./echart.vue";
import config from "./config.js";
export default {
  components: {
    lineChart
  },
  data() {
    return {
      list: [],
      currentType: "",
      lotterys: [],
      subLotterys: [],
      lotteryId: "",
      listDisps: [],
      // currentIndex: 0,
      loading: false,
      ballsTitle: [],
      recordList: [],
      params: {
        lotteryId: "",
        num: "25",
        time: ""
      },
      titleIndex: 0,
      seriesData: [], //折线图数据
      splitNumber: 0, //y轴的刻度数
      maxLabel: 0, //y轴最大坐标
      peroidNo: [], //期数
      recordList: [] //往期期号
    };
  },
  methods: {
    goTrendDetail(disp, code) {
      //去走势详情
      this.$router.push({
        name: "trend_detail",
        params: { id: disp.lotteryId },
        query: { displayId: disp.displayId, displayCode: disp.displayCode }
      });
    },
    setEchartData() {
      let result = config[this.currentType].getRankNumber(
        this.recordList,
        this.titleIndex
      );
      this.seriesData = result[0].reverse();
      this.peroidNo = result[1].reverse();
      this.splitNumber = config[this.currentType].label;
      this.maxLabel = config[this.currentType].maxBall;
    },
    showTrend(index) {
      //获取走势的
      if (this.titleIndex === index) return;
      this.titleIndex = index;
      this.setEchartData();
    },
    getListDisps(code) {
      //获取走势的菜单
      this.loading = true;
      this.$http
        .post(
          "/api/v2/trend/queryAllDisplaysByCode",
          { code: code },
          { unenc: true }
        )
        .then(response => {
          if (response.data.code !== 0) return;
          this.subLotterys = response.data.data.lotterys;
          this.loading = false;
        });
    },
    changeSubMenu(item) {
      //切换二级菜单
      if (item.lotteryId === this.lotteryId) return;
      this.lotteryId = item.lotteryId;
      this.titleIndex = 0;
      this.getData();
    },
    changeLotteryCategory(item) {
      console.log("changeLotteryCategory", item)
      //切换彩种
      if (this.currentType === item.code) return;
      this.currentType = item.code;
      if (
        item.code === "pk10" ||
        item.code === "ssc" ||
        item.code === "ksan" ||
        item.code === "11x5"
      ) {
        this.lotteryId = item.lotterys[0].lotteryId;
        this.ballsTitle = config[this.currentType].title;
        this.getData();
        this.titleIndex = 0;
        this.lotterys = item.lotterys;
      } else if (
        item.code !== "pk10" &&
        item.code !== "ssc" &&
        item.code !== "ksan" &&
        item.code !== "11x5"
      ) {
        this.recordList = [];
        this.subLotterys = [];
      }
      if (!item.lotterys[0].disps) {
        this.getListDisps(item.code);
        return;
      }
      this.subLotterys = item.lotterys;
    },
    getData() {
      //获取走势数据
      this.params.lotteryId = this.lotteryId;
      this.$http
        .post("/api/v2/trend/queryOpencodes", this.params, { unenc: true })
        .then(response => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          this.recordList = data.records.slice(0, 25);
          this.setEchartData();
        });
    }
  },
  created() {
    this.loading = true;
    this.$http
      .post(
        "/api/v2/trend/queryAllLotterys",
        { lotteryType: "" },
        { unenc: true }
      )
      .then(response => {
        this.loading = false;
        if (response.data.code !== 0) return;
        let type = response.data.data.types;
        this.list = type; //一级菜单
        this.currentType = type[0].code;
        this.ballsTitle = config[this.currentType].title;
        this.lotterys = type[0].lotterys; //二级菜单
        this.subLotterys = type[0].lotterys; //去走势的菜单
        this.lotteryId = this.lotterys[0].lotteryId;
        this.getData();
      });
  }
};
</script>

<style lang="less" scoped>
.border-radius(@dimesion) {
  border-radius: @dimesion;
  -webkit-border-radius: @dimesion;
  -moz-border-radius: @dimesion;
  -ms-border-radius: @dimesion;
  -o-border-radius: @dimesion;
}
.trend-list-contanier {
  background-color: #f5f5f5;
  padding-bottom: 40px;
  min-height: 300px;
  .echart-wrap {
    background: #fff;
    margin-bottom: 20px;
    padding: 6px 20px 0px;
    overflow: hidden;
    min-height: 306px;
    li {
      cursor: pointer;
    }
    .main-title {
      ul {
        &:first-child {
          border-bottom: 1px solid #e6e6e6;
          height: 48px;
          li {
            height: 100%;
            border-bottom: 1px solid transparent;
            &.active {
              /*  border-bottom-color: @primary-color;
                            color: @primary-color; */
            }
          }
        }
        &:last-child {
          li {
            height: 42px;
            line-height: 42px;
            &.active {
              /* color: @primary-color; */
            }
          }
        }
        li {
          float: left;
          margin-right: 20px;
          height: 100%;
          line-height: 48px;
          cursor: pointer;
          &:hover {
            /*    color: @primary-color; */
          }
        }
        &:after {
          display: block;
          content: "";
          clear: both;
        }
      }
    }
  }
}
.list-type {
  display: flex;
  flex-wrap: wrap;
  padding: 26px 0;
  li {
    display: flex;
    padding: 16px 10px;
    align-items: center;
    /*  background-color: @primary-color; */
    color: #fff;
    width: 11.111%;
    text-align: center;
    cursor: pointer;
    &.selected,
    &:hover {
      /*  background-color: @primary-color-hover; */
    }
    span {
      word-break: break-all;
    }
    .img {
      margin-right: 4px;
      width: 22px;
      display: inline-block;
      vertical-align: middle;
      filter: brightness(2);
      -webkit-filter: brightness(2);
      -ms-filter: brightness(2);
      -moz-filter: brightness(2);
      -o-filter: brightness(2);
      float: none;
    }
  }
}
.lottery-list {
  margin-left: -2%;
  .item {
    float: left;
    width: 48%;
    margin-left: 2%;
    margin-bottom: 2%;
    background-color: #fff;
    position: relative;
    height: 150px;
    box-shadow: 0 2px 9px 1px #eee;
    .inner {
      padding: 20px 10px 20px 200px;
    }
  }
  .info {
    position: absolute;
    left: 40px;
    top: 20px;
    .img {
      width: 80px;
      display: block;
      float: none;
      margin-bottom: 10px;
    }
    .name {
      font-weight: bold;
      text-align: center;
      font-size: 18px;
      white-space: nowrap;
    }
  }
  .types {
    padding-top: 20px;
    li {
      float: left;
      width: 50%;
      font-size: 16px;
      margin-bottom: 20px;
      span {
        cursor: pointer;
      }
      &:hover {
        /*   color: @primary-color; */
      }
    }
  }
}
</style>

