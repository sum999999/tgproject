<template>
  <div
    class="report-wrap"
    v-loading="loading"
  >
    <div class="search clearfix">
      <Row>
        <Col span="8">
        <div class="win-money">
          <span class="key"><i class="iconfont icon-money"></i> <span>{{$tex("盈利金额")}}</span></span>
          <span class="num">{{winTotal}}</span>
        </div>
        </Col>
        <Col span="14">
        <history-select
          class="select-wrap"
          @get-history-select="getHistorySelect"
        ></history-select>
        <div class="selectDate">
          <DatePicker
            v-model="reportTime"
            type="daterange"
            placement="bottom-end"
            :disabled="disPicker"
            :options="option"
            :editable="false"
            :placeholder="$tex('请选择查询时间')"
            style="width: 200px"
          ></DatePicker>
        </div>
        </Col>
        <Col span="2">
        <div class="button">
          <Button
            type="primary"
            class="wxbutton"
            @click="search"
          >{{$tex("搜索")}}</Button>
        </div>
        </Col>
      </Row>
    </div>
    <div class="report-tip">
      <Icon
        class="tip"
        type="android-bulb"
        size="24"
        color="#fec746"
      ></Icon>
      {{remarks}}
    </div>
    <div class="table">
      <ul class="report-list clearfix">
        <li
          v-for=" (item,index) in userReport "
          :key="index"
        >
          <div class="inner">
            <i
              class="icon"
              :class="[`icon-${item.key}`]"
            ></i>
            <!-- <img class="img"
                 :src="require(`@/assets/images/report/${item.key}.png`)"
                 alt=""> -->
            <p class="key">{{item.name}}</p>
            <span class="num"> {{item.value }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import dateUtil from "@/utils/format_date.js";
import page from "@/components/page.vue";
import common from "../../common/mixin";
import numeral from "numeral";
import HistorySelect from "@/components/HistorySelect";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";

export default {
  components: { page, HistorySelect },
  mixins: [common],
  data() {
    return {
      reportTime: [],
      userReport: {},
      remarks: "",
      winTotal: "",
      pageParams: {
        currentPage: 1,
        total: 0
      },
      disPicker: true,
      loading: false
    };
  },
  methods: {
    search() {
      this.quertReportList();
    },
    getHistorySelect(obj) {
      if (obj) {
        this.disPicker = true;
        this.reportTime = [new Date(obj.startTime), new Date(obj.endTime)];
      } else {
        this.disPicker = false;
        this.reportTime = [];
      }
    },
    quertReportList() {
      this.loading = true;
      var startTime = "",
        endTime = "";
      if (this.reportTime.length > 0) {
        if (this.reportTime[0] != null) {
          startTime = convert2ServerDateTime(this.reportTime[0]);
        }
        if (this.reportTime[1] != null) {
          this.reportTime[1].setHours(23);
          this.reportTime[1].setMinutes(59);
          this.reportTime[1].setSeconds(59);
          endTime = convert2ServerDateTime(this.reportTime[1]);
        }
      }
      this.$http
        .post(
          "/api/v2/agent/subuser/oneReport",
          { gtBuyTime: startTime, ltBuyTime: endTime },
          { userId: true, unenc: true }
        )
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          const { reportList, remarks, winTotal } = response.data.data;
          this.userReport = reportList;
          this.remarks = remarks;
          this.winTotal = winTotal;
        });
    }
  },
  created() {
    /*   const imgSrc = "@/assets/images/report/"
    const files = require.context("@/assets/images/report/", false, /\.png$/);
    const modules = {};files.keys().forEach(key => {
       let k = key.replace(/(\.\/|\.png)/g, "")
       console.log(`${imgSrc}${k}.png`, k)
       modules[k] = require(`${imgSrc}${k}.png`);
     });
     console.log(modules)
  */
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    this.reportTime = [startTime, endTime];
    this.quertReportList();
  }
};
</script>
<style lang ="less">
@deep: ~'>>>';
@images: "~@/assets/images/report";
.report-tip {
  border-radius: 6px;
  border: 1px solid #e2e2e2;
  padding: 10px 12px;
  color: #c81722;
  position: relative;
  padding-left: 40px;
  font-size: 12px;
  margin-bottom: 18px;
  margin-top: 10px;
  .tip {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.report-wrap {
  .search {
    text-align: right;
    margin-top: 14px;
    margin-bottom: 18px;
    .selectDate {
      display: inline-block;
      vertical-align: top;
    }
    .datetext {
      &:extend(.report-wrap .search .selectDate);
      margin-top: 5px;
    }
    .button {
      &:extend(.report-wrap .search .selectDate);
      margin-left: 12px;
      button {
        width: 66px;
        height: auto;
        white-space: normal;
        word-break: break-all;
      }
    }
    .ivu-select-dropdown-list {
      text-align: center;
    }
  }
  .table {
    margin-top: 13px;
  }
  /* .ivu-select-item {
    text-align: center;
    padding-left: 25px;
  } */

}
.win-money {
  /*height: 30px;*/
  /*line-height: 30px;*/
  font-size: 0;
  text-align: left;
  display: flex;
  .key {
    max-width: 120px;
    display: inline-block;
    /*   background-color: #be1204;
        border: 1px solid #be1204; */
    color: #fff;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

    padding: 0 10px;
    font-size: 14px;
    .iconfont {
      vertical-align: middle;
      font-size: 18px;
    }
    span {
      vertical-align: middle;
    }
  }
  .num {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border: 1px solid #cccccc;
    border-left: none;
    color: #be1204;
    padding: 0 20px;
    font-size: 14px;
    text-align: center;
    min-width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.select-wrap {
  width: 80px;
  margin-right: 10px;
}
.report-list {
  margin-left: -3%;
  min-height: 200px;
  & > li {
    float: left;
    width: 30.33%;
    margin-left: 3%;
    margin-bottom: 3%;
    font-size: 14px;
    .inner {
      height: 96px;
      padding: 20px;
      border: 1px solid #e2e2e2;
      border-radius: 5px;
      overflow: hidden;
    }
    .key {
      margin-bottom: 4px;
      padding-top: 10px;
    }
    .num {
      color: #be1204;
    }
    .icon {
      float: left;
      width: 58px;
      height: 58px;
      margin-right: 20px;
      background-image: url("@{images}/userReport.png");
    }
    .icon-amountSum {
      background-position: -59px -117px;
    }
    .icon-bettingMoney {
      background-position: -1px -175px;
    }
    .icon-buyTotal {
      background-position: -175px -117px;
    }
    .icon-prizeSum {
      background-position: -175px -59px;
    }
    .icon-rebateMoney {
      background-position: -59px -59px;
    }
    .icon-rechargeTotal {
      background-position: -1px -59px;
    }
    .icon-takeTotalFee {
      background-position: -59px -1px;
    }
    .icon-winMoney {
      background-position: -1px -1px;
    }
    .icon-activitySum {
      background-position: -59px -175px;
    }
    .icon-status35 {
      background-position: -117px -1px;
    }
    .icon-status26 {
      background-position: -175px -1px;
    }
      .icon-status52 {
          background-position: -175px -175px;
      }
      .icon-status45 {
          background-position: -1px -232px;
      }
      .icon-status46 {
          background-position: -59px -232px;
      }
    .icon-profittotal {
      background-position: -117px -59px;
    }
    .icon-losstotal {
      background-position: -1px -117px;
    }

    .icon-commissiontotal {
      background-position: -117px -117px;
    }
  }
}
</style>
