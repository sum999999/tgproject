<template>
  <div class="hexiao">
    <odds></odds>
    <div class="tab sub-menu">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item, 1)"
          :class="{active: tabNum === item.num}"
        >
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div
      class="tab"
      style='height:45px;'
    >
      <ul>
        <li
          v-for="item in tabList2"
          :key="item.id"
          @click="changeList(item, 2)"
          :class="{active: tabId2 === item.id}"
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
          v-for="item in 2"
          :key="item"
          style="width:50%"
        >
          <div class="container">
            <span class="project">{{$tex("生肖")}}</span>
            <span class="num">{{$tex("号码")}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li
          v-for="(item, idx) in listData"
          :key="idx"
          style="width: 50%"
        >
          <div class="container">
            <span class="project">
              <label>
                <Checkbox
                  class="check-price"
                  v-model="item.selected"
                  @on-change="checkboxChange()"
                  :disabled="selected.length >= tabNum && !item.selected"
                ></Checkbox>
                <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()" :disabled="selected.length >= tabNum && !item.selected"> -->
                <animal :text="item.label"></animal>
              </label>
            </span>
            <span class="num">
              <i
                class="ball"
                v-for="value in item.data"
                :key="value.ball"
                v-if="value.ball!=='49'"
                :style="{background: item.selected ? value.clr : '#fff', color: item.selected ? '#fff' : '#333'}"
              >
                {{value.ball}}
              </i>
            </span>
          </div>
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
        <div class="clr"></div>
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
import liuhe from "./common_modal/handle_data.js";
// import popupModal from './common_modal/popup.vue'
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import prizeTip from "../../common_vue/prize_tip.vue";
import numeral from "numeral";
import Animal from "@/components/Animal";
import { hasPermission } from "@/utils/authority-utils";
import { ZkInput } from '@/components/ZkInput'

export default {
  props: {
    data: {
      type: [Array, Object]
    }
    // betLimRate: {
    //     type: String,
    //     default: '1'
    // }
  },
  components: {
    // popupModal,
    odds,
    playTip,
    playExample,
    prizeTip,
    Animal,
    ZkInput
  },
  data() {
    return {
      tabList: [],
      tabNum: "",
      tabList2: [],
      tabId2: "",
      listData: [],
      selected: [],
      // 为判断合肖几？
      listType: [
        "701203",
        "701204",
        "701205",
        "701206",
        "701207",
        "701208",
        "701209",
        "701210",
        "701211",
        "701212",
        "701213"
      ],
      orderList: [],
      companyList: [
        // 金额单位
        { value: 1, label: this.$tex("元") },
        { value: 10, label: this.$tex("角") },
        { value: 100, label: this.$tex("分") }
      ],
      price: 0,
      singleLimit: 0,
      companyValue: 1, // 当前选中的company
      hasClick: false, //添加单注判断
      playTipInfo: {},
      num: 0
      // totalNote: 0
    };
  },
  computed: {
    // money () { //总金额
    //     return this.num * this.price / this.companyValue;
    // },
    // singlePrizeMoney () { //单注最大中奖金额
    //     return this.price / this.companyValue * this.maxOdd;
    // },
    // newSingleMoney () { //单注金额
    //     return this.price / this.companyValue;
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
      return this.playTipInfo.layout.rates[0].maxOdds;
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
      return 1
    }
    // limTotalNote () {
    //     return (this.totalNote <= 0 || !this.totalNote) ? 0 : this.totalNote * this.betLimRate
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
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      this.commit();
      this.$emit("add-note", this.orderList);
      this.cancel();
    },
    checkboxChange() {
      let balls = [];
      this.selected = this.listData.filter(item => item.selected);
      //计算注数和金额
      if (this.selected.length < this.tabNum) {
        this.num = 0;
        return;
      }
      this.num = 1;
    },
    changeList(item, num) {
      this.hasClick = false;
      this.cancel();
      if (num === 1) {
        if (this.tabNum === item.num) return;
        this.tabNum = item.num;
        this.tabList2 = item.children;
        this.tabId2 = item.children[0].id;
        this.price = this.tabList2[0].layout.costAmount;
        this.singleLimit = this.tabList2[0].singleLimit;
        this.playTipInfo = item.children[0]; //中
        // this.totalNote = item.children[0].totalNote;
      } else {
        if (this.tabId2 === item.id) return;
        this.tabId2 = item.id;
        this.playTipInfo = item;
      }
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected() {
      let arr = [];
      let vm = this;
      let item = this.tabList2.filter(item => this.tabId2 === item.id)[0];
      let balls = this.selected.map(item => item.label);
      arr.push({
        lotteryId: item.layout.rates[0].lotteryId,
        lotteryPlayId: item.layout.rates[0].lotteryPlayId,
        lotteryBettingId: item.lotteryBettingId,
        odds: item.layout.rates[0].maxOdds,
        lotteryNumber: balls.join(","),
        singleMoney: this.newSingleMoney,
        bettingMoney: this.newSingleMoney * 1,
        bettingNum: 1,
        rebate: 0
      });
      return arr;
    },
    getResult(clear) {
      if (clear) this.cancel("clear");
    },
    commit() {
      if (this.selected.length < this.tabNum) {
        if (!this.hasClick) {
          this.$Message.warning(this.$tex("没有投注或注数不够"));
          this.hasClick = true;
        }
        return;
      }
      this.orderList = this.getSelected();
    },
    cancel() {
      this.companyValue = 1;
      this.num = 0;
      this.price = this.tabList2[0].layout.costAmount;
      this.selected.forEach(item => {
        item.selected = false;
      });
      this.selected = [];
    }
  },
  created() {
    this.data.forEach(item => {
      item.num = this.listType.indexOf(item.id) + 1;
    });
    this.tabList = this.data;
    this.tabNum = this.tabList[0].num;
    this.tabList2 = this.tabList[0].children;
    this.tabId2 = this.tabList2[0].id;
    this.price = this.tabList2[0].layout.costAmount;
    this.singleLimit = this.tabList2[0].singleLimit;
    this.listData = liuhe.zodiac();
    this.playTipInfo = this.tabList[0].children[0];
    // this.totalNote = this.tabList[0].children[0].totalNote;
  },
  beforeDestroy() {
    this.cancel();
  }
};
</script>

<style lang="less" scoped>
  @deep: ~">>>";
.hexiao .tab {
  position: relative;
}
.hexiao .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.hexiao .tab.sub-menu {
  min-height: 42px !important;
  margin: 10px 0;
}
.hexiao .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.hexiao .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.hexiao .detail-thead li,
.hexiao .detail-body li {
  width: 50%;
}
.hexiao li .project {
  width: 25%;
}
.hexiao .detail-thead li .num {
  padding-left: 8px;
}
.hexiao li .num {
  width: 70%;
  text-align: center;
}
.hexiao li .num i {
  margin: 0 5px;
  text-align: center;
}
.hexiao .detail-body li .container {
  font-weight: bold;
}
.hexiao .detail-body li .container .num .ball {
  color: @primary-color;
}
.hexiao .detail-body li .project label {
  display: inline-block;
}
.hexiao .detail-body li .project label * {
  float: left;
}
.hexiao .detail-body li .check-price {
  width: 16px;
  height: 16px;
  /* margin-top: 8px; */
  margin-top: -1px;
  margin-right: 3px;
}
.hexiao .operation {
  position: relative;
  height: 35px;
  margin-top: 40px;
}
.hexiao .operation .price {
  /*   border: 1px solid @primary-color; */
  height: 35px;
  overflow: hidden;
}
.hexiao .operation .price .icon-m-p {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  /*   color: @primary-color; */
  cursor: pointer;
}
.hexiao .operation .price .minus {
  /*  border-right: 1px solid @primary-color; */
}
.hexiao .operation .price .plus {
  /*  border-left: 1px solid @primary-color; */
}
.hexiao .operation .company {
  height: 35px;
  margin-left: 10px;
  border-left: 1px solid #d2d0d0;
  /*  border-left: 1px solid @primary-color; */
}
.hexiao .operation .company span {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
  &:not(.active) {
    border-left:none;
  }
  /*    border-left: 0;
   border: 1px solid #d2d0d0;
  color: #949494; */
  /* margin-left:-1px; */
}
.hexiao .operation .company span.active {
  /*   border: 1px solid @primary-color;
  color: @primary-color; */
  z-index: 2;
  margin-left: -1px;
}
.hexiao .operation .odd-compute {
  font-size: 12px;
  height: 35px;
  margin-left: 10px;
}
.hexiao .operation .odd-compute > span {
  display: inline-block;
  float: left;
}
.hexiao .operation .odd-compute span.odds,
.hexiao .operation .odd-compute span.rebate {
  line-height: 18px;
  min-width: 60px;
  max-width: 80px;
  text-align: center;
  color: @primary-color;
}
.hexiao .operation .odd-compute span.slider {
  width: 160px;
  margin: 0 8px;
}
.hexiao .operation .odd-compute span.slider .ivu-slider {
  line-height: 15px;
}
.hexiao .operation .add-note span {
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
.hexiao .operation .total {
  font-size: 16px;
  line-height: 35px;
  margin-left: 10px;
  margin-top: -2px;
}
.hexiao .operation .total strong {
  color: @primary-color;
}
.hexiao .operation .add-note {
  position: absolute;
  left: 990px;
  text-align: center;
  margin-bottom: 20px;

  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /* background: @add-note-add-bg;
  border: 1px solid @add-note-add-border;
  box-shadow: -1px 1px 1px @add-note-add-shadow-insert inset; */
  cursor: pointer;
}
.hexiao .operation .add-note span {
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
.hexiao .operation .add-note b {
  font-weight: normal;
  display: inline-block;
  vertical-align: top;
}
/* 覆盖ivu-input-number样式 */
.hexiao .price-input {
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
.hexiao .price-input .ivu-input-number-handler-wrap {
  display: none;
}
.hexiao .price-input .ivu-input-number {
  border: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
}
.hexiao .price-input .ivu-input-number-input-wrap {
  height: 100%;
}
.hexiao .ivu-input-number-input {
  border: 0;
  outline: none;
  /*  color: @primary-color; */
  text-align: center;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  padding: 0;
}
</style>
<style scoped>
.hexiao .price-input .ivu-input-number >>> .ivu-input-number-input {
  text-align: center;
  height: 33px;
  line-height: 33px;
}
</style>

