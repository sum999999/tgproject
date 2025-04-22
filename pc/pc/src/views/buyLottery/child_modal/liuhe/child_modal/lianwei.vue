<template>
  <div class="lianwei">
    <odds></odds>
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item)"
          :class="{ active: tabNum === item.num }"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class="prize_example">
        <play-example
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
          :hasLogin="!!user.userId"
        ></play-example>
      </div>
      <!-- 中奖提示说明 -->
      <!-- 玩法说明 -->
      <div class="tip-wrap">
        <play-tip
          :playDesc="playTipInfo.playDesc"
          :tip="playTipInfo.layout.tips && playTipInfo.layout.tips"
          :isLiuHe="true"
          :maxOdd="maxOdd"
          :hasLogin="!!user.userId"
        ></play-tip>
      </div>
      <!-- 玩法说明结束 -->
    </div>
    <div class="detail-thead nav-bg">
      <ul>
        <li v-for="item in 2" :key="item" style="width:50%">
          <div class="container">
            <span class="project">{{ $tex("尾数") }}</span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ $tex("赔率") }}</span
            >
            <span
              class="num"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              >{{ $tex("号码") }}</span
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li v-for="(item, idx) in listData" :key="idx" style="width: 50%">
          <div class="container">
            <span class="project">
              <label>
                <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()"> -->
                <Checkbox
                  class="check-price"
                  v-model="item.selected"
                  @on-change="checkboxChange(idx)"
                ></Checkbox>
                <span>{{ item.ball }}</span>
              </label>
            </span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ item.maxOdds }}</span
            >
            <span
              class="num"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
            >
              <i
                class="ball"
                v-for="value in item.mantissa"
                :key="value.ball"
                :style="{
                  background: item.selected ? value.clr : '#fff',
                  color: item.selected ? '#fff' : '#333',
                }"
              >
                {{ value.ball }}
              </i>
            </span>
          </div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="operation">
      <div class="price lf">
        <span class="minus icon-m-p lf" @click="minusPlus(-1)">
          <Icon type="minus"></Icon>
        </span>
        <span class="price-input lf">
          <zk-input
            v-model="price"
            type="digit"
            :digitilen="2"
            :max="parseInt(singleLimit)"
            :min="1"
          >
          </zk-input>
          <!--          <InputNumber-->
          <!--                  :precision="precision"-->
          <!--                  :step="step"-->
          <!--            :max="parseInt(singleLimit)"-->
          <!--            :min="1"-->
          <!--            v-model="price"-->
          <!--          ></InputNumber>-->
        </span>
        <span class="plus icon-m-p lf" @click="minusPlus(1)">
          <Icon type="plus"></Icon>
        </span>
        <div class="clr"></div>
      </div>
      <div v-if="!hasPermission('element.currencyExchange')" class="company lf">
        <span
          v-for="(item, idx) in companyList"
          :class="{ active: item.value === companyValue }"
          :key="idx"
          @click="getCompanyValue(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <div class="total lf" v-if="num">
        <prize-tip
          :count="num"
          :money="money"
          :singlePrizeMoney="singlePrizeMoney"
          :hasLogin="!!user.userId"
        ></prize-tip>
      </div>
      <div class="add-note lf" @click="add">
        <span>
          <Icon type="plus-round" size="12"></Icon>
        </span>
        <b>{{ $tex("添加注单") }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import liuhe from "./common_modal/handle_data.js";
// import popupModal from './common_modal/popup.vue'
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import prizeTip from "../../common_vue/prize_tip.vue";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";
import { ZkInput } from "@/components/ZkInput";

export default {
  props: {
    data: {
      type: [Array, Object],
    },
    betLimRate: {
      type: String,
      default: "1",
    },
  },
  components: {
    // popupModal,
    odds,
    playTip,
    playExample,
    prizeTip,
    ZkInput,
  },
  data() {
    return {
      tabList: [],
      tabNum: "",
      listData: [],
      selected: [],
      price: "",
      orderList: [],
      companyList: [
        // 金额单位
        { value: 1, label: this.$tex("元") },
        { value: 10, label: this.$tex("角") },
        { value: 100, label: this.$tex("分") },
      ],
      singleLimit: 0,
      companyValue: 1, // 当前选中的company
      hasClick: false, //添加单注判断
      playTipInfo: {},
      num: 0,
      choiceMaxOdds: 0, //选择号码的最大赔率
    };
  },
  computed: {
    // money () { //总金额
    //   return this.num * this.price / this.companyValue;
    // },
    // singlePrizeMoney () { //单注最高中奖金额
    //   return this.price / this.companyValue * this.choiceMaxOdds;
    // },
    // newSingleMoney () { //单注金额
    //   return this.price / this.companyValue;
    // },
    money() {
      //总金额
      return numeral(this.num)
        .multiply(this.price)
        .divide(this.companyValue)
        .value();
    },
    singlePrizeMoney() {
      //单注最高中奖金额
      return numeral(this.price)
        .divide(this.companyValue)
        .multiply(this.choiceMaxOdds)
        .value();
    },
    newSingleMoney() {
      //投注单价
      return numeral(this.price)
        .divide(this.companyValue)
        .value();
    },
    maxOdd() {
      //最大赔率
      return Math.max(...this.listData.map((item) => item.maxOdds));
    },
    user() {
      return this.$store.state.user;
    },
    precision() {
      if (hasPermission("buyLottery.decimals")) {
        return 2;
      }
      return void 0;
    },
    step() {
      if (hasPermission("buyLottery.decimals")) {
        return 0.01;
      }
      return 1;
    },
    // limTotalNote () {
    //     return (this.totalNote <= 0 || !this.totalNote) ? 0 : this.totalNote * this.betLimRate;
    // }
  },
  methods: {
    hasPermission,
    minusPlus(num) {
      //操作单注金额
      num += Number(this.price);
      if (num < 1 || num > parseInt(this.singleLimit)) {
        return;
      }
      this.price = num;
    },
    // 元角分发生变化时
    getCompanyValue(num) {
      this.companyValue = num;
    },
    add() {
      //添加注单
      // if (this.limTotalNote && this.num > this.limTotalNote) {
      //     this.$Message.error('违规投注');
      //     return;
      // }
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      this.commit();
      this.$emit("add-note", this.orderList);
      this.cancel();
    },
    bettingAmount(betballs, num) {
      var results = [];
      var balls = betballs.split(",");
      for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
          if ((i >> j) & 1) {
            cur.push(balls[j]);
          }
        }
        if (cur.length == num) {
          results.push(cur);
        }
      }
      return results;
    },
    /**
     * 计算投注是否违规
     */
    isExceedBet(idx) {
      for (let i = 0, len = this.listData.length; i < len; i++) {
        if (this.listData[i].selected && i !== idx) {
          this.listData[i].selected = false;
          this.checkboxChange(idx);
          break;
        }
      }
    },
    checkboxChange(idx) {
      this.selected = this.listData.filter((item) => item.selected);
      //计算注数和金额
      let balls = this.selected.map((item) => item.ball);
      let noteNum = this.bettingAmount(balls.join(","), this.tabNum);
      this.num = noteNum.length;
      if (this.totalNote > 0 && this.totalNote * this.betLimRate < this.num) {
        //超标投注
        this.isExceedBet(idx);
      } else {
        if (this.num) {
          this.choiceMaxOdds = Math.max(
            ...this.selected.map((item) => item.maxOdds)
          );
        }
      }
    },
    changeList(item) {
      if (this.tabNum === item.num) return;
      this.hasClick = false;
      this.listData = item.children[0].layout.rates;
      this.playTipInfo = item.children[0];
      this.tabNum = item.num;
      this.totalNote = item.children[0].totalNote;
      this.price = item.children[0].layout.costAmount;
      this.singleLimit = item.children[0].singleLimit; //单注最大金额
      this.cancel();
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(data) {
      let arr = [];
      let vm = this;
      let minOdd = Math.min(...this.selected.map((item) => item.maxOdds));
      let { lotteryId, lotteryPlayId, lotteryBettingId } = this.listData[0];
      data.forEach((item) => {
        arr.push({
          lotteryId: lotteryId,
          lotteryPlayId: lotteryPlayId,
          lotteryBettingId: lotteryBettingId,
          odds: `${this.choiceMaxOdds},${minOdd}`,
          lotteryNumber: item.join(","),
          singleMoney: this.newSingleMoney,
          bettingMoney: this.newSingleMoney * 1,
          bettingNum: 1,
          rebate: 0,
        });
      });
      return arr;
    },
    getResult(clear) {
      if (clear) this.cancel("clear");
    },
    commit() {
      if (!this.selected.length || this.selected.length < this.tabNum) {
        if (!this.hasClick) {
          this.$Message.warning(this.$tex("没有投注或注数不够"));
          this.hasClick = true;
        }
        return;
      }
      let balls = this.selected.map((item) => item.ball);
      let noteNum = this.bettingAmount(balls.join(","), this.tabNum);
      this.orderList = this.getSelected(noteNum);
      this.cancel();
    },
    cancel() {
      this.num = 0;
      this.companyValue = 1;
      this.price = this.tabList[0].children[0].layout.costAmount;
      this.selected.forEach((item) => {
        item.selected = false;
      });
      this.selected = [];
    },
  },
  created() {
    this.data.forEach((item) => {
      item.children[0].layout.rates.forEach((value) => {
        value.mantissa = liuhe.mantissa.filter(
          (vvv) => vvv.label === value.ball
        )[0].data;
      });
      if (item.id === "70901") {
        item.num = 2;
      } else if (item.id === "70902") {
        item.num = 3;
      } else if (item.id === "70903") {
        item.num = 4;
      } else {
        item.num = 5;
      }
    });
    this.tabList = this.data;
    this.tabNum = this.tabList[0].num;
    this.price = this.tabList[0].children[0].layout.costAmount;
    this.singleLimit = this.tabList[0].children[0].singleLimit; //单注最大金额
    this.listData = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
    this.totalNote = this.tabList[0].children[0].totalNote;
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.lianwei .tab {
  position: relative;
}
.lianwei .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.lianwei .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.lianwei .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.lianwei .detail-thead li,
.lianwei .detail-body li {
  width: 50%;
}
.lianwei li .project,
.lianwei li .odds {
  width: 25%;
}
.lianwei li .num {
  width: 50%;
  text-align: left;
}
/* 无赔率时 */
.lianwei li .num.big-width {
  width: 75%;
  text-align: center;
}
/* 无赔率时 */
.lianwei li .num i {
  margin: 0 5px;
  text-align: center;
}
.lianwei .detail-body li .project label {
  display: inline-block;
}
.lianwei .detail-body li .container {
  font-weight: bold;
}
.lianwei .detail-body li .container .odds {
  color: @primary-color;
}
.lianwei .detail-body li .project label * {
  float: left;
}
.lianwei .detail-body li .check-price {
  width: 16px;
  height: 16px;
  /* margin-top: 8px; */
  margin-top: -1px;
  margin-right: 3px;
}
.lianwei .operation {
  position: relative;
  height: 35px;
  margin-top: 40px;
}
.lianwei .operation .price {
  /*  border: 1px solid @primary-color; */
  height: 35px;
  overflow: hidden;
}
.lianwei .operation .price .icon-m-p {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px; /*
  color: @primary-color; */
  cursor: pointer;
}
/* .lianwei .operation .price .minus {
  border-right: 1px solid @primary-color;
}
.lianwei .operation .price .plus {
  border-left: 1px solid @primary-color;
} */
/* .picked-result .current-info .price input{
        width: 80px;
        height: 100%;
        border: 0;
        outline: none;
        color: #be1204;
        text-align: center;
    } */
.lianwei .operation .company {
  height: 35px;
  margin-left: 10px;
  border-left: 1px solid #d2d0d0;
}
.lianwei .operation .company span {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  &:not(.active) {
    border-left: none;
  }
  cursor: pointer;
  /*   color: #949494;
   border: 1px solid #d2d0d0;
  border-left: 0; */
  /* margin-left:-1px; */
}
.lianwei .operation .company span.active {
  /*   border: 1px solid @primary-color;
  color: @primary-color; */
  z-index: 2;
  margin-left: -1px;
}
.lianwei .operation .odd-compute {
  font-size: 12px;
  height: 35px;
  margin-left: 10px;
}
.lianwei .operation .odd-compute > span {
  display: inline-block;
  float: left;
}
.lianwei .operation .odd-compute span.odds,
.lianwei .operation .odd-compute span.rebate {
  line-height: 18px;
  min-width: 60px;
  max-width: 80px;
  text-align: center;
  color: @primary-color;
}
.lianwei .operation .odd-compute span.slider {
  width: 160px;
  margin: 0 8px;
}
.lianwei .operation .odd-compute span.slider .ivu-slider {
  line-height: 15px;
}
.lianwei .operation .add-note span {
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
.lianwei .operation .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
.lianwei .operation .total {
  font-size: 16px;
  line-height: 35px;
  margin-left: 10px;
  margin-top: -2px;
}
.lianwei .operation .total strong {
  /*  color: #be1204; */
}
.lianwei .operation .add-note {
  position: absolute;
  left: 990px;
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /* background: @result-page-chase-num-bg;
  border: 1px solid @result-page-order-border;
  box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset; */
  cursor: pointer;
}
.lianwei .operation .add-note span {
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
/* 覆盖ivu-input-number样式 */
.lianwei .price-input {
  width: 80px;
  height: 100%;
  display: inline-block;
  .zk-input-wrap {
    height: 100%;
    @{deep} {
      input {
        height: 100%;
        width: 100%;
        border: none;
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
}
.lianwei .price-input .ivu-input-number-handler-wrap {
  display: none;
}
.lianwei .price-input .ivu-input-number {
  border: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
  padding: 0;
}
.lianwei .price-input .ivu-input-number-input-wrap {
  height: 100%;
}
.lianwei .ivu-input-number-input {
  border: 0;
  outline: none;
  color: @primary-color;
  text-align: center;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
}
</style>
<style scoped>
.lianwei .price-input .ivu-input-number >>> .ivu-input-number-input {
  text-align: center;
  height: 33px;
  line-height: 33px;
}
</style>
