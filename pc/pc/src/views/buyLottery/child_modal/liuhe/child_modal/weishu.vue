<template>
  <div class="weishu">
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
          :maxOdd="maxOdd"
          :isLiuHe="true"
          :hasLogin="!!user.userId"
        ></play-tip>
      </div>
      <!-- 玩法说明结束 -->
    </div>
    <div class="detail-thead nav-bg">
      <ul>
        <li
          v-for="item in tabContent"
          :key="item"
          :style="{ width: 100 / tabContent + '%' }"
        >
          <div class="container">
            <span class="label">{{ title }}</span>
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
        <li
          v-for="(item, idx) in listData"
          :key="idx"
          :style="{ width: 100 / tabContent + '%' }"
        >
          <div class="container">
            <span class="label">
              <span>{{ item.ball }}</span>
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
    <!-- <div class="operation">
            <button class="btn primary" @click="commit()">确定</button>
            <button class="btn cancel" @click="cancel()">取消</button>
        </div>
        <popup-modal :status="showPopup" :orderList="orderList" @get-result="getResult"></popup-modal> -->
    <div class="add-note lf" @click="add">
      <span>
        <Icon type="plus-round" size="12"></Icon>
      </span>
      <b>{{ $tex("添加注单") }}</b>
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
  },
  data() {
    return {
      totalMoney: 0,
      tabContent: 5,
      title: "",
      tabList: [],
      listData: [],
      // showPopup: false,
      orderList: [],
      hasClick: false, //添加单注判断
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
    limTotalNote() {
      return this.totalNote <= 0 || !this.totalNote
        ? 0
        : this.totalNote * this.betLimRate;
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
      }
      this.$emit("add-note", this.orderList);
      this.clearMoney();
    },
    clearMoney(tab) {
      //清空金额
      this.listData.forEach((item) => (item.bettingMoney = null));
      this.orderList = [];
      if (!this.limTotalNote) return;
      this.$parent.clearDisabled(this.$parent.getIptsParent("iptNum"));
    },
    changeList(item) {
      this.hasClick = false;
      let data = this.tabList.filter((value) => value.id === item.id);
      this.listData = data[0].children[0].layout.rates;
      this.playTipInfo = item.children[0];
      this.totalNote = item.children[0].totalNote;
      this.title = item.name;
      if (item.id === "701401") {
        this.tabContent = 5;
      } else {
        this.tabContent = 2;
      }
      this.clearMoney();
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(clear) {
      let arr = [];
      let vm = this;
      this.totalMoney = 0;
      vm.listData.forEach((item, idx) => {
        if (item.bettingMoney) {
          if (!clear) {
            this.orderList.push({
              lotteryId: item.lotteryId,
              lotteryPlayId: item.lotteryPlayId,
              lotteryBettingId: item.lotteryBettingId,
              odds: item.maxOdds,
              lotteryNumber: item.ball,
              singleMoney: item.bettingMoney, //3.19
              bettingMoney: item.bettingMoney * 1,
              // bettingMoney: item.bettingMoney,
              bettingNum: 1,
              rebate: 0,
            });
            vm.totalMoney += parseInt(item.bettingMoney);
          } else {
            item.bettingMoney = "";
          }
        }
      });
    },
    commit() {
      let vm = this;
      this.orderList = vm.getSelected();
    },
    cancel() {
      this.getSelected("clear");
    },
  },
  created() {
    let data = this.data;
    this.tabList = data;
    this.title = this.tabList[0].name;
    this.listData = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
    this.totalNote = this.tabList[0].children[0].totalNote;
  },
};
</script>

<style lang="less" scoped>
.weishu .tab {
  position: relative;
}
.weishu .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.weishu .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.weishu .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.weishu span.label,
.weishu span.odds {
  width: 25%;
}
.weishu .detail-body span.odds {
  color: @primary-color;
}
.weishu .detail-body span.label,
.weishu .detail-body span.odds {
  font-weight: bold;
}
.weishu span.price {
  width: 50%;
}
.weishu span.price {
  max-width: 130px;
}
/*无赔率时*/
.weishu span.price.big-width {
  width: 75%;
}
.weishu .add-note {
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
.weishu .add-note span {
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
.weishu .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
</style>
