<template>
  <div class="teima">
    <div class="tab">
      <ul>
        <li
          v-for="(item, index) in data"
          :key="index"
          @click="changeTab(index)"
          :class="{ active: tabIndex === index }"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class="prize_example">
        <play-example
          :showFastBtn="true"
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
          @toggle-fast-menu="toggleFstMenu"
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
    <!-- 快捷菜单 -->
    <div class="fast-menu-wp" :class="{ active: isShowFastBetMenu }">
      <fast-menu ref="fastMenuWp" @select-bet-type="selectBetType"></fast-menu>
    </div>
    <div class="detail-thead nav-bg">
      <ul>
        <li v-for="item in 5" :key="item">
          <div class="container">
            <span class="label">{{ $tex("号码") }}</span>
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
        <li v-for="(item, idx) in numBalls" :key="idx">
          <div class="container" :class="{ active: item.bettingMoney }">
            <span class="label">
              <i
                :style="{ background: item.clr }"
                :class="[item.clr && 'ball']"
                >{{ item.ball }}</i
              >
            </span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ item.maxOdds }}</span
            >
            <input-value
              ref="numIpt"
              v-model="item.bettingMoney"
              v-bind="$attrs"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              @cc="slectedPrice(numBalls, 'num', idx)"
            ></input-value>
          </div>
        </li>
        <!-- 作为布局使用 -->
        <li>
          <div class="container"></div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="detail-body">
      <ul>
        <li v-for="(item, idx2) in other" :key="idx2">
          <div class="container">
            <span class="label">{{ item.ball }}</span>
            <span
              class="odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ item.maxOdds }}</span
            >
            <input-value
              ref="otherIpt"
              v-model="item.bettingMoney"
              v-bind="$attrs"
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              @cc="slectedPrice(other, 'other', idx2)"
            ></input-value>
          </div>
        </li>
        <!-- 作为布局使用 -->
        <li>
          <div class="container"></div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <!-- 金额-重置等 -->
    <!-- <div class="defalut-set-wp">
    </div> -->
    <div class="add-note-wp lf">
      <div>
        <default-set
          ref="defaultSet"
          :max="maxSingleLimit"
          :min="minSingleLimit"
          @reset="changeSingleMoney"
          @send-single-money="changeSingleMoney"
        ></default-set>
      </div>
      <div class="add-note" @click.stop="add">
        <span>
          <Icon type="plus-round" size="12"></Icon>
        </span>
        <b>{{ $tex("添加注单") }}</b>
      </div>
    </div>
  </div>
</template>

<script>
// import popupModal from './common_modal/popup.vue'
import fastBet from "./mixins/fastBet.js";
import inputValue from "./common_modal/input_modal.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import fastMenu from "./common_modal/fastMenu";
import defaultSet from "./common_modal/defaultSet.vue";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: [Array, Object],
    },
    betLimRate: {
      type: String,
      default: "1",
    },
    selfFlag: {
      type: String,
    },
  },
  mixins: [fastBet],
  inheritAttrs: false,
  components: {
    inputValue,
    // popupModal,
    playTip,
    playExample,
    fastMenu,
    defaultSet,
  },
  data() {
    return {
      tabIndex: 0,
      totalMoney: 0,
      teimaA: [],
      teimaB: [],
      // totalNoteA: 0,
      // totalNoteB: 0,
      totalNoteOther: 0,
      other: [],
      numBalls: [],
      orderList: [],
      mixNum: [],
      hasClick: false, //是否多次空投·
      playTipInfo: {},
      totalNote: 49, //总注数
      isShowFastBetMenu: false, //是否显示快捷投注菜单
      singleLimit: 0, //单注最大限额
      setBetMoney: 10, //统一的输入金额
      maxBetNum: 0, //最大投注注数
    };
  },
  computed: {
    ...mapGetters(["getSysUserAmountBySelfFlag"]),
    maxOdd() {
      let mixBalls = [...this.numBalls, ...this.other];
      return Math.max(...mixBalls.map((item) => item.maxOdds));
    },
    user() {
      return this.$store.state.user;
    },
    minSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { min } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return min;
      } else {
        return 10;
      }
    },
    maxSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { max } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return max;
      } else {
        return +this.singleLimit;
      }
    },
  },
  watch: {
    data(newVal, oldVal) {
      this.handleDataItem(0);
    },
  },
  methods: {
    /**
     * 选择金额后
     */
    slectedPrice(numBalls, param, index) {
      let [totalNote, flag] = ["", ""];
      if (param === "other") {
        totalNote = this.totalNoteOther;
        flag = true;
      } else {
        totalNote = this.totalNote;
        flag = false;
      }
      if (totalNote > 0) {
        let len = numBalls.filter((item) => item.bettingMoney).length;
        let compareNote = this.totalNote * this.betLimRate;
        let iptWrap = this.$parent.getIptsParent(flag ? "otherIpt" : "numIpt");
        this.$parent.changeIptDisabled(len, compareNote, iptWrap, index);
      }
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
      this.setBetMoney = 10;
      this.$refs["defaultSet"].reset && this.$refs["defaultSet"].reset();
      let fastMenuWp = this.$refs["fastMenuWp"];
      fastMenuWp.trIndex = -1;
      fastMenuWp.tdIndex = -1;
      // console.log('this.$parent', this.$parent)
      // let iptCom = this.$parent.getIptsParent('numIpt')
      // let otherIptCom = this.$parent.getIptsParent('otherIpt')
      this.mixNum = [...this.numBalls, ...this.other];
      this.mixNum.forEach((item) => (item.bettingMoney = null));
      if (!tab) {
        this.orderList = [];
      }
      // this.$parent.clearDisabled(iptCom)
      // this.$parent.clearDisabled(otherIptCom)
    },
    handleDataItem(index) {
      const child = this.data[index].children[0];
      // console.log(child)
      this.numBalls = child.layout.rates;
      this.totalNote = child.totalNote;
      this.playTipInfo = this.data[index].children[0];
      this.singleLimit = this.playTipInfo.singleLimit;
      this.maxBetNum = parseInt(this.totalNote * this.betLimRate);
    },
    changeTab(index) {
      this.hasClick = false;
      this.tabIndex = index;
      this.handleDataItem(index);
      this.clearMoney("tab");
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(clear) {
      let arr = [];
      let vm = this;
      this.totalMoney = 0;
      ["numBalls", "other"].forEach((value) => {
        vm[value].forEach((item, idx) => {
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
                bettingNum: 1,
                rebate: item.rebate * 100 || 0,
              });
              vm.totalMoney += parseInt(item.bettingMoney);
            } else {
              item.bettingMoney = "";
            }
          }
        });
      });
    },
  },
  created() {
    this.handleDataItem(0);
  },
};
</script>

<style lang="less" scoped>
/* 开奖提示 */
.liuhe .tab {
  position: relative;
  width: 1180px;
  border-bottom: none;
}
.liuhe .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.liuhe .teima {
  position: relative;
  width: 900px;
}
.liuhe .teima .fast-menu-wp {
  position: absolute;
  top: 65px;
  right: -265px;
  width: 180px;
  height: 0;
  overflow: auto;
  transition: all 0.3s;
  &.active {
    // height: 485px;
    height: 466px;
    // overflow:inherit;
  }
}
.teima .tab .prize_example {
  position: absolute;
  right: 75px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  margin-top: -5px;
  z-index: 10;
}
.teima .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
/* 开奖提示结束 */
.teima .detail-thead {
  border-top: 1px solid #d2d0d0;
}
.teima .detail-thead li,
.teima .detail-body li {
  width: 20%;
}
.teima li .label,
.teima li .odds {
  width: 25%;
}
.teima .detail-body li .label,
.teima .detail-body li .odds {
  font-weight: bold;
}
.teima .detail-body li .label .ball {
  font-weight: normal;
}
.teima .detail-body li .odds {
  color: #ae291a;
}
.teima li .price {
  width: 50%;
}
.teima li .price.big-width {
  width: 68%;
}
.teima .detail-body li span.price.big-width {
  width: 68%;
}
.teima .detail-body .container.active {
  background-color: #e79898;
}
.teima .add-note-wp {
  width: 1200px;
  margin-top: 23px;
  & > div {
    display: inline-flex;
    vertical-align: top;
    &:first-child {
      margin-left: 150px;
    }
    &.add-note {
      width: 100px;
    }
  }
}
.teima .add-note {
  width: 100px;
  line-height: 1;
  text-align: center;
  margin-left: 391px;
  margin-bottom: 20px;
  color: #fff;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.teima .add-note span {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #fff;
  width: 18px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  margin-right: 4px;
}
.teima .add-note b {
  font-weight: normal;
  display: inline-block;
  flex: 1;
  word-break: break-all;
}
</style>
