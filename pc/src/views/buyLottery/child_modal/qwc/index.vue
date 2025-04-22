<template>
  <div class="play-qwc">
    <tab-menu
      v-if="lotteryData"
      v-bind="$attrs"
      :lotteryData="lotteryData"
      @get-currentLottery="getCurrentLottery"
    ></tab-menu>
    <component
      :is="view"
      ref="order"
      v-bind="$attrs"
      :currentLottery="currentLottery"
      :jetton="jettonValue"
      @change="handleBallsArray"
    ></component>
    <prize-tip
      :count="bettingNum"
      :money="bettingMoney"
      :singlePrizeMoney="singlePrizeMoney"
      :hasLogin="isLoginUser"
    ></prize-tip>
    <div class="add-note">
      <jetton-box
        v-model="jettonValue"
        :min="minSingleLimit"
        :max="maxSingleLimit"
      ></jetton-box>
      <div class="add-note-btn" @click="add2Cart">
        <span>
          <Icon type="plus-round" size="12"></Icon>
        </span>
        <i>{{ $tex("添加注单") }}</i>
      </div>
    </div>
    <lottery-cart
      v-if="currentLottery"
      v-bind="$attrs"
      :currentLottery="currentLottery"
      :double-odds="true"
      :refresh="resultListRefresh"
      :list="orderList"
      :status="resultStatus"
      :diffBallOdds="diffBallOdds"
      :closeLoading="closeLoading"
      :self-flag="selfFlag"
      @get-result="checkoutCart"
    ></lottery-cart>
    <Spin v-if="showSpin" size="large" fix></Spin>
  </div>
</template>

<script>
import numeral from "numeral";
import tabMenu from "../shared/children_modal/TabMenu";
import OrdersUtils, * as Orders from "./components/orders";
import LotteryCart from "../shared/children_modal/result_page";
import PrizeTip from "../common_vue/prize_tip";
import JettonBox from "@/components/JettonBox";

import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

export default {
  name: "index",
  components: {
    tabMenu,
    ...Orders,
    LotteryCart,
    PrizeTip,
    JettonBox,
  },
  data() {
    return {
      lotteryData: null,
      selfFlag: "",
      showSpin: true,
      currentLottery: null,
      resultListRefresh: `${new Date().getTime()}`,
      resultStatus: {},
      diffBallOdds: [],
      closeLoading: `${new Date().getTime()}`,
      bettingNum: 0,
      bettingMoney: 0,
      jettonValue: 0,
      computeNote: null,
      maxOdds: 0,
      singlePrizeMoney: 0,
      cacheOrderList: [],
      orderList: [],
    };
  },
  computed: {
    ...mapGetters(["isLoginUser", "getSysUserAmountBySelfFlag"]),
    view() {
      return OrdersUtils.viewMatch(this.lotteryPlayId.slice(0, 4));
    },
    lotteryPlayId() {
      return (this.currentLottery && this.currentLottery.lotteryPlayId) || "";
    },
    layout() {
      if (this.currentLottery) {
        const layout = this.currentLottery.layout;
        if (typeof layout === "string") {
          return JSON.parse(layout);
        }
        return layout;
      }
      return {};
    },
    minSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { min } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return min;
      } else {
        return this.layout.costAmount;
      }
    },
    maxSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { max } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return max;
      } else {
        return parseInt(this.currentLottery && this.currentLottery.singleLimit);
      }
    },
    singleMoney() {
      return hasPermission("buyLottery.singleLimit")
        ? this.minSingleLimit
        : this.layout.costAmount;
    },
    periodInfo() {
      return this.$store.state.preiodInfo;
    },
  },
  created() {
    this.computeNote = require(`../shared/children_modal/common_modal/${this.$attrs.code}.js`);
    this.getLotteryDetailV2();
  },
  methods: {
    getLotteryDetailV2() {
      const lotteryId = this.$route.params.id;
      if (!lotteryId) return;
      this.$store.dispatch("getLotteryDetailV2", { lotteryId }).then((data) => {
        this.lotteryData = data;
        this.selfFlag = this.lotteryData.lottery.selfFlag;
        this.showSpin = false;
      });
    },
    getCurrentLottery(currentLottery) {
      this.currentLottery = Object.assign({}, currentLottery);
      this.resetOrder();
    },
    resetOrder() {
      this.$refs["order"] && this.$refs["order"].clear();
      this.bettingNum = 0;
      this.bettingMoney = 0;
      this.jettonValue = 0;
      this.maxOdds = 0;
      this.singlePrizeMoney = 0;
      this.cacheOrderList = [];
    },
    add2Cart() {
      if (!this.isLoginUser) {
        return this.$store.commit("getShouldLogin", true);
      }
      this.orderList = JSON.parse(JSON.stringify(this.cacheOrderList));
      this.resetOrder();
    },
    checkoutCart(result) {
      var params = {
        bettingInfoList: result.list,
        totalMoney: result.totalMoney,
        bettingRecordList: [
          {
            lotteryRecordId: this.periodInfo.lotteryRecordId, // 4.28
            periodNo: this.periodInfo.periodNo,
            num: 1,
          },
        ],
      };
      if (result.chase.length) {
        params.bettingRecordList = [];
        result.chase.forEach((value) => {
          params.bettingRecordList.push({
            lotteryRecordId: value.lotteryRecordId,
            periodNo: value.periodNo,
            num: value.odds,
          });
        });
      }
      this.$http
        .post("/api/v2/lottery/betting", params, { userId: true })
        .then((response) => {
          if (response.data.code !== 0) {
            return (this.closeLoading = `${new Date().getTime()}`);
          }
          this.resultListRefresh = `${new Date().getTime()}`;
          this.$store.commit("getSuccessModal", true);
          setTimeout(() => {
            this.$store.commit("getSuccessModal", false);
          }, 1500);
        });
    },
    handleBallsArray(layouts = []) {
      const balls = [];
      let bettingMoney = 0;
      let maxOdds = 0;
      let maxOddsPrice = 0;
      const orderList = [];
      layouts.forEach((layout) => {
        layout.balls.forEach((ball) => {
          if (ball.value > 0) {
            balls.push(ball.ball);
            bettingMoney += ball.value;
            if (ball.maxOdds > maxOdds) {
              maxOdds = ball.maxOdds;
              maxOddsPrice = ball.value;
            }
            orderList.push({
              bettingMoney: ball.value,
              bettingNum: this.computeNote[this.lotteryPlayId](ball.ball)
                .length,
              company: 1,
              lotteryNumber: ball.ball,
              odds: ball.retDoubleOdds,
              rebate: 0,
              singleMoney: ball.value,
            });
          }
        });
      });
      if (!balls.length) {
        return;
      }
      const ballsStr = balls.join(",");
      const noteResult = this.computeNote[this.lotteryPlayId](ballsStr);
      this.bettingNum = noteResult.length;
      this.bettingMoney = bettingMoney;
      this.maxOdds = maxOdds;
      this.singlePrizeMoney = Number(
        numeral(maxOdds)
          .multiply(maxOddsPrice)
          .value()
      );
      this.cacheOrderList = orderList;
    },
  },
};
</script>

<style scoped lang="less">
.prize-tip {
  padding: 30px;
}

.jetton-box {
  padding: 0 30px;
}
.add-note {
  display: flex;
  align-items: center;
}
.add-note-btn {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  color: #ffffff;
  background: @primary-color;
  border: 1px solid @primary-color;
  box-shadow: -1px 1px 1px @primary-color;
  margin-left: 140px;
}
.add-note-btn span {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #fff;
  width: 18px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  float: left;
  margin-top: 3px;
  margin-right: 4px;
}
.add-note-btn i {
  display: inline-block;
  margin-top: 1px;
}
</style>
