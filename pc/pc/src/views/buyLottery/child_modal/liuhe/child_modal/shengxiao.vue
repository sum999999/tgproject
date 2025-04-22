<template>
  <div class="shengxiao">
    <odds></odds>
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item)"
          :class="{ active: title === item.name }"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class="prize_example">
        <play-example
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
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
            <span class="project">{{ title }}</span>
            <span class="num" v-show="title !== '总肖'">{{
              $tex("号码")
            }}</span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ $tex("赔率") }}</span
            >
            <span
              class="price"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              >{{ $tex("金额") }}</span
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li v-for="(item, idx) in listData" :key="idx" style="width: 50%">
          <div class="container">
            <animal class="project" :text="item.ball"></animal>
            <span class="num" v-if="item.zodiac">
              <span>
                <i
                  class="ball"
                  v-for="value in item.zodiac"
                  :key="value.ball"
                  :style="{ background: value.clr }"
                >
                  {{ value.ball }}
                </i>
              </span>
            </span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ item.maxOdds }}</span
            >
            <input-value
              ref="iptNum"
              v-model="item.bettingMoney"
              v-bind="$attrs"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              @cc="slectedPrice(listData, 'num', idx)"
            ></input-value>
          </div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="add-note lf" @click="add">
      <span>
        <Icon type="plus-round" size="12"></Icon>
      </span>
      <b>{{ $tex("添加注单") }}</b>
    </div>
    <!-- <div class="operation">
            <button class="btn primary" @click="commit()">确定</button>
            <button class="btn cancel" @click="cancel()">取消</button>
        </div>
        <popup-modal :status="showPopup" :orderList="orderList" @get-result="getResult"></popup-modal> -->
  </div>
</template>

<script>
import liuhe from "./common_modal/handle_data.js";
// import popupModal from './common_modal/popup.vue'
import inputValue from "./common_modal/input_modal.vue";
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import Animal from "@/components/Animal";

export default {
  inheritAttrs: false,
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
    inputValue,
    // popupModal,
    odds,
    playTip,
    playExample,
    Animal,
  },
  data() {
    return {
      totalMoney: 0,
      tabList: [],
      listData: [],
      title: "",
      // showPopup: false,
      orderList: [],
      hasClick: false, //是否多次空投
      playTipInfo: {},
      totalNote: 0, //总注数
    };
  },
  computed: {
    maxOdd() {
      return Math.max(...this.listData.map((item) => item.maxOdds));
    },
    user() {
      return this.$store.state.user;
    },
    prizeEndTime() {
      return this.$store.state.prizeEndTime;
    },
    limTotalNote() {
      return this.totalNote <= 0 || !this.totalNote
        ? 0
        : this.totalNote * this.betLimRate;
    },
  },
  watch: {
    prizeEndTime(newVal) {
      //endTime计算生肖
      this.init(newVal);
    },
  },
  methods: {
    slectedPrice(numBalls, param, index) {
      if (!this.limTotalNote) return;
      let len = numBalls.filter((item) => item.bettingMoney).length;
      let compareNote = this.totalNote * this.betLimRate;
      let iptWrap = this.$parent.getIptsParent("iptNum");
      this.$parent.changeIptDisabled(len, compareNote, iptWrap, index);
    },
    add() {
      //添加注单
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      this.getSelected();
      if (!this.orderList.length) {
        if (!this.hasClick) {
          this.$Message.error(this.$tex("请先投注"));
          this.hasClick = true;
        }
        return;
      }
      this.$emit("add-note", this.orderList);
      this.clearMoney();
    },
    clearMoney(tab) {
      //清空金额
      this.listData.forEach((item) => {
        item.bettingMoney = null;
      });
      this.orderList = [];
      if (!this.limTotalNote) return;
      this.$parent.clearDisabled(this.$parent.getIptsParent("iptNum"));
    },
    changeList(item) {
      // console.log(item.children[0]);
      this.playTipInfo = item.children[0];
      this.hasClick = false;
      // let data = this.tabList.filter(value => value.id === item.id);
      this.listData = item.children[0].layout.rates;
      this.title = item.name;
      this.totalNote = item.children[0].totalNote;
      this.clearMoney("tab");
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(clear) {
      let arr = [];
      let vm = this;
      this.totalMoney = 0;
      vm.listData.forEach((item, idx) => {
        if (item.bettingMoney) {
          if (!clear) {
            vm.orderList.push({
              lotteryId: item.lotteryId,
              lotteryPlayId: item.lotteryPlayId,
              lotteryBettingId: item.lotteryBettingId,
              odds: item.maxOdds,
              lotteryNumber: item.ball,
              singleMoney: item.bettingMoney, //3.19
              bettingMoney: item.bettingMoney * 1,
              // bettingMoney: item.bettingMoney,
              bettingNum: 1,
              rebate: Number(item.rebate) * 100,
            });
            vm.totalMoney += parseInt(item.bettingMoney);
          } else {
            item.bettingMoney = "";
          }
        }
      });
    },
    commit() {
      this.orderList = this.getSelected();
    },
    cancel() {
      this.getSelected("clear");
    },
    init(endTime) {
      let data = this.data;
      data.forEach((item) => {
        if (item.id !== "701104") {
          item.children[0].layout.rates.forEach((value) => {
            value.zodiac = (
              liuhe
                .zodiac(endTime)
                .filter((vvv) => vvv.label === this.$tex(value.ball))[0] || {}
            ).data;
          });
        }
      });
      this.tabList = JSON.parse(JSON.stringify(data));
      this.title = this.tabList[0].name;
      this.listData = this.tabList[0].children[0].layout.rates;
      this.playTipInfo = this.tabList[0].children[0];
      this.totalNote = this.tabList[0].children[0].totalNote;
    },
  },
  created() {
    this.init("");
  },
};
</script>

<style lang="less" scoped>
.shengxiao .tab {
  position: relative;
}
.shengxiao .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.shengxiao .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.shengxiao .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.shengxiao .detail-thead li,
.shengxiao .detail-body li {
  width: 50%;
}
.container > span {
  width: 25%;
}
.shengxiao li .num span {
  display: inline-block;
}
/* 无赔率时 */
.shengxiao li .price.big-width {
  width: 50%;
}
.shengxiao li .num i {
  text-align: center;
  margin: 0 2px;
}
.shengxiao .detail-body li .container {
  font-weight: bold;
}
.shengxiao .detail-body li .container .num,
.shengxiao .detail-body li .container .price {
  font-weight: normal;
}
.shengxiao .detail-body li .container .odds {
  color: @primary-color;
}
.shengxiao .add-note {
  text-align: center;
  margin-left: 990px;
  margin-top: 20px;
  margin-bottom: 20px;

  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /* background: @result-page-chase-num-bg;
  border: 1px solid @result-page-order-border;
  box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset; */
  cursor: pointer;
}
.shengxiao .add-note span {
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
.shengxiao .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
</style>
