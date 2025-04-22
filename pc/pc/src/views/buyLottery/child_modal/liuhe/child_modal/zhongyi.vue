<template>
  <div class="zhongyi">
    <odds></odds>
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item)"
          :class="{active: selectLeast === item.selectLeast}"
        >
          <span>{{item.name}}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class='prize_example'>
        <play-example
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
        ></play-example>
      </div>
      <!-- 中奖提示说明 -->
      <!-- 玩法说明 -->
      <div class='tip-wrap'>
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
        <li
          v-for="item in 5"
          :key="item"
        >
          <div class="container">
            <span class="num">{{$tex("号码")}}</span>
            <span class="price">{{$tex("勾选")}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li
          v-for="(item, idx) in listData"
          :key="idx"
        >
          <div class="container">
            <span class="num">
              <i
                class="ball"
                :style="{background: item.clr}"
              >{{item.ball}}</i>
            </span>
            <span class="price">
              <Checkbox
                class="check-price"
                v-model="item.selected"
                @on-change="checkboxChange()"
                :disabled="selected.length >= selectMust && !item.selected"
              ></Checkbox>
              <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()" :disabled="selected.length >= selectMust && !item.selected"> -->
            </span>
          </div>
        </li>
        <li>
          <div class="container"></div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="operation">
      <div class="price lf">
        <span
          class="minus icon-m-p lf"
          @click="minusPlus(-1)"
        >
          <Icon type="minus"></Icon>
        </span>
        <span class="price-input lf">
          <zk-input v-model="price"
                    type="digit"
                    :digitilen="2"
                    :max="parseInt(singleLimit)"
                    :min="1">
        </zk-input>
<!--          <InputNumber-->
<!--                  :precision="precision"-->
<!--                  :step="step"-->
<!--            :max="parseInt(singleLimit)"-->
<!--            :min="1"-->
<!--            v-model="price"-->
<!--          ></InputNumber>-->
        </span>
        <span
          class="plus icon-m-p lf"
          @click="minusPlus(1)"
        >
          <Icon type="plus"></Icon>
        </span>
        <div class="clr"></div> -->
      </div>
      <div v-if="!hasPermission('element.currencyExchange')" class="company lf">
        <span
          v-for="(item, idx) in companyList"
          :class="{active: item.value === companyValue}"
          :key="idx"
          @click="getCompanyValue(item.value)"
        >
          {{item.label}}
        </span>
      </div>
      <div
        class="total lf"
        v-if="num"
      >
        <prize-tip
          :count="num"
          :money="money"
          :singlePrizeMoney="singlePrizeMoney"
          :hasLogin="!!user.userId"
        ></prize-tip>
      </div>
      <div
        class="add-note lf"
        @click="add"
      >
        <span>
          <Icon
            type="plus-round"
            size="12"
          ></Icon>
        </span>
        <b>{{$tex("添加注单")}}</b>
      </div>
    </div>
  </div>
</template>

<script>
// import liuhe from './common_modal/handle_data.js'
// import popupModal from './common_modal/popup.vue'
import inputValue from "./common_modal/input_modal.vue";
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import prizeTip from "../../common_vue/prize_tip.vue";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";
import { ZkInput } from '@/components/ZkInput'

export default {
  props: {
    data: {
      type: [Array, Object]
    },
    betLimRate: {
      type: String,
      default: "1"
    }
  },
  components: {
    inputValue,
    // popupModal,
    odds,
    playTip,
    playExample,
    prizeTip,
    ZkInput
  },
  data() {
    return {
      tabList: [],
      selectMust: "",
      selectLeast: "",
      listData: [],
      selected: [],
      price: "",
      listType: ["701601", "701602", "701603", "701604", "701605", "701606"],
      orderList: [],
      companyList: [
        // 金额单位
        { value: 1, label: this.$tex("元") },
        { value: 10, label: this.$tex("角") },
        { value: 100, label: this.$tex("分") }
      ],
      singleLimit: 0,
      companyValue: 1, // 当前选中的company
      hasClick: false, //阻止都次空投
      playTipInfo: {},
      num: 0,
      totalNote: 0
    };
  },
  computed: {
    // money () { //总金额
    //   return this.num * this.price / this.companyValue;
    // },
    // singlePrizeMoney () { //单注最大中奖金额
    //   return this.price / this.companyValue * this.maxOdd;
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
        .multiply(this.maxOdd)
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
      return Math.max(...this.listData.map(item => item.maxOdds));
    },
    user() {
      return this.$store.state.user;
    },
    limTotalNote() {
      return this.totalNote <= 0 || !this.totalNote
        ? 0
        : this.totalNote * this.betLimRate;
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
      return 1
    }
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
      if (this.limTotalNote && this.num > this.limTotalNote) {
        this.$Message.error(this.$tex("违规投注"));
        return;
      }
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
    checkboxChange() {
      this.selected = [];
      this.listData.forEach(item => {
        if (item.selected) this.selected.push(item);
      });
      let result = this.bettingAmount(
        this.selected.join(","),
        this.selectLeast
      );
      if (this.selected.length < this.selectLeast) {
        this.num = 0;
        return;
      }
      this.num = result.length;
    },
    changeList(item) {
      if (this.selectLeast === item.selectLeast) {
        return;
      }
      this.hasClick = false;
      this.listData = item.children[0].layout.rates;
      this.playTipInfo = item.children[0];
      this.selectMust = item.selectMust;
      this.selectLeast = item.selectLeast;
      this.price = item.children[0].layout.costAmount;
      this.singleLimit = item.children[0].singleLimit; //单注最大金额
      this.totalNote = item.children[0].totalNote;
      this.cancel();
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(data) {
      let arr = [];
      let listData = this.listData[0];
      let lotteryId = listData.lotteryId;
      let lotteryPlayId = listData.lotteryPlayId;
      let lotteryBettingId = listData.lotteryBettingId;
      let odd = listData.maxOdds;
      data.forEach(item => {
        arr.push({
          lotteryId: lotteryId,
          lotteryPlayId: lotteryPlayId,
          lotteryBettingId: lotteryBettingId,
          odds: odd,
          lotteryNumber: item.join(","),
          singleMoney: this.newSingleMoney,
          bettingMoney: this.newSingleMoney * 1,
          bettingNum: 1,
          rebate: 0
        });
      });
      return arr;
    },
    commit() {
      if (!this.selected.length || this.selected.length < this.selectLeast) {
        if (!this.hasClick) {
          this.$Message.warning(this.$tex("没有投注或注数不够"));
          this.hasClick = true;
        }
        return;
      }
      let balls = this.selected.map(item => item.ball);
      let noteNum = this.bettingAmount(balls.join(","), this.selectLeast);
      this.orderList = this.getSelected(noteNum);
    },
    cancel() {
      // this.orderList = []; //清空单注列表
      this.companyValue = 1;
      this.num = 0;
      this.price = this.tabList[0].children[0].layout.costAmount;
      this.selected.forEach(item => {
        item.selected = false;
      });
      this.selected = [];
    }
  },
  created() {
    let data = this.data;
    data.forEach(item => {
      // 必须选中的条数
      item.selectLeast = this.listType.indexOf(item.id) + 5;
      if (item.selectLeast >= 8) {
        item.selectMust = item.selectLeast + 3;
      } else {
        item.selectMust = 10;
      }
    });
    this.tabList = data;
    this.selectMust = data[0].selectMust;
    this.selectLeast = data[0].selectLeast;
    this.price = this.tabList[0].children[0].layout.costAmount;
    this.singleLimit = this.tabList[0].children[0].singleLimit; //单注最大金额
    this.listData = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
    this.totalNote = this.tabList[0].children[0].totalNote;
  }
};
</script>

<style lang="less" scoped>
  @deep: ~">>>";
.zhongyi .tab {
  position: relative;
}
.zhongyi .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.zhongyi .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.zhongyi .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.zhongyi .detail-thead li,
.zhongyi .detail-body li {
  width: 20%;
}
.zhongyi span.num {
  width: 35%;
}
.zhongyi span.price {
  width: 50%;
}
.zhongyi .detail-body li .check-price {
  width: 16px;
  line-height: 20px;
}
.zhongyi .operation {
  position: relative;
  height: 35px;
  margin-top: 40px;
}
.zhongyi .operation .price {
  /*   border: 1px solid @primary-color; */
  height: 35px;
  overflow: hidden;
}
.zhongyi .operation .price .icon-m-p {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  color: @primary-color;
  cursor: pointer;
}
.zhongyi .operation .price .minus {
  /* border-right: 1px solid @primary-color; */
}
.zhongyi .operation .price .plus {
  /*  border-left: 1px solid @primary-color; */
}
.zhongyi .operation .company {
  height: 35px;
  margin-left: 10px;
  border-left: 1px solid #d2d0d0;
}
.zhongyi .operation .company span {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
   &:not(.active) {
    border-left:none;
  }
  /*   color: #949494;
    border: 1px solid #d2d0d0;
  border-left: 0; */
  /* margin-left:-1px; */
}
.zhongyi .operation .company span.active {
  /*   border: 1px solid @primary-color;
  color: #be1204; */
  z-index: 2;
  margin-left: -1px;
}
.zhongyi .operation .odd-compute {
  font-size: 12px;
  height: 35px;
  margin-left: 10px;
}
.zhongyi .operation .odd-compute > span {
  display: inline-block;
  float: left;
}
.zhongyi .operation .odd-compute span.odds,
.zhongyi .operation .odd-compute span.rebate {
  line-height: 18px;
  min-width: 60px;
  max-width: 80px;
  text-align: center;
  color: @primary-color;
}
.zhongyi .operation .odd-compute span.slider {
  width: 160px;
  margin: 0 8px;
}
.zhongyi .operation .odd-compute span.slider .ivu-slider {
  line-height: 15px;
}
.zhongyi .operation .add-note span {
  display: inline-block;
  vertical-align: middle;
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
.zhongyi .operation .add-note b {
  font-weight: normal;
  display: inline-block;
  vertical-align: top;
}
.zhongyi .operation .total {
  font-size: 16px;
  line-height: 35px;
  margin-left: 10px;
  margin-top: -2px;
}
.zhongyi .operation .total strong {
  color: @primary-color;
}
.zhongyi .operation .add-note {
  position: absolute;
  text-align: center;
  left: 990px;
  margin-bottom: 20px;

  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /*  background: @result-page-chase-num-bg;
  border: 1px solid @result-page-order-border;
  box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset; */
  cursor: pointer;
}
.zhongyi .operation .add-note span {
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
.zhongyi .operation .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
/* 覆盖ivu-input-number样式 */
.zhongyi .price-input {
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
.zhongyi .price-input .ivu-input-number-handler-wrap {
  display: none;
}
.zhongyi .price-input .ivu-input-number {
  border: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
}
.zhongyi .price-input .ivu-input-number-input-wrap {
  height: 100%;
}
.zhongyi .ivu-input-number-input {
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
.zhongyi .price-input .ivu-input-number >>> .ivu-input-number-input {
  text-align: center;
  height: 33px;
  line-height: 33px;
}
</style>

