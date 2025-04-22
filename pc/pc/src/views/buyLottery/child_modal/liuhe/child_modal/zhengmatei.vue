<template>
  <div class="zhengmatei">
    <odds></odds>
    <!-- 玩法说明 -->
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item)"
          :class="{ active: item.id === tabId }"
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
      <!-- 中奖提示结束-->
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
    </div>
    <div class="fast-menu-wp" :class="{ active: isShowFastBetMenu }">
      <fast-menu ref="fastMenuWp" @select-bet-type="selectBetType"></fast-menu>
    </div>
    <!-- 玩法说明结束 -->
    <div class="detail-thead nav-bg">
      <ul>
        <li v-for="item in 5" :key="item" style="width:20%">
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
        <li v-for="(item, idx) in numBalls" :key="idx" style="width:20%">
          <div class="container" :class="{ active: item.bettingMoney }">
            <span class="label">
              <i :style="{ background: item.clr }" class="ball">{{
                item.ball
              }}</i>
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
// import liuhe from './common_modal/handle_data.js'
// import popupModal from './common_modal/popup.vue'
import fastBet from "./mixins/fastBet.js";
import inputValue from "./common_modal/input_modal.vue";
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import fastMenu from "./common_modal/fastMenu";
import defaultSet from "./common_modal/defaultSet.vue";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

export default {
  inheritAttrs: false,
  props: {
    data: {
      type: [Array, Object],
    },
    betLimRate: {
      type: [String, Number],
      default: "1",
    },
    selfFlag: {
      type: String,
    },
  },
  mixins: [fastBet],
  components: {
    inputValue,
    // popupModal,
    odds,
    playTip,
    playExample,
    fastMenu,
    defaultSet,
  },
  data() {
    return {
      totalMoney: 0,
      tabList: [],
      tabId: "",
      numBalls: [],
      // showPopup: false,
      orderList: [],
      hasClick: false, //是否多次空投·
      playTipInfo: {},
      totalNote: 0,
      isShowFastBetMenu: false, //是否显示快捷投注菜单
      singleLimit: 0, //单注最大限额
      setBetMoney: 10, //统一的输入金额
      maxBetNum: 0, //最大投注注数
    };
  },
  computed: {
    ...mapGetters(["getSysUserAmountBySelfFlag"]),
    maxOdd() {
      //最大赔率
      return Math.max(...this.numBalls.map((item) => item.maxOdds));
    },
    user() {
      return this.$store.state.user;
    },
    limTotalNote() {
      return this.totalNote * this.betLimRate;
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
  methods: {
    /**
     * 输入金额时
     */
    slectedPrice(numBalls, param, index) {
      if (this.totalNote && this.totalNote > 0) {
        let len = numBalls.filter((item) => item.bettingMoney).length;
        let iptWrap = this.$parent.getIptsParent("numIpt");
        this.$parent.changeIptDisabled(len, this.limTotalNote, iptWrap, index);
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
      this.numBalls.forEach((item) => {
        item.bettingMoney = null;
      });
      if (!tab) this.orderList = [];
      if (this.totalNote && this.totalNote > 0)
        this.$parent.clearDisabled(this.$parent.getIptsParent("numIpt"));
    },
    changeList(item) {
      this.hasClick = false;
      this.playTipInfo = item.children[0];
      this.totalNote = this.playTipInfo.totalNote;
      let data = this.tabList.filter((value) => value.id === item.id);
      this.numBalls = data[0].children[0].layout.rates;
      this.tabId = item.id;
      this.clearMoney("tab");
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    getSelected(clear) {
      let arr = [];
      this.totalMoney = 0;
      this.numBalls.forEach((item, idx) => {
        if (item.bettingMoney) {
          if (!clear) {
            this.orderList.push({
              lotteryId: item.lotteryId,
              lotteryPlayId: item.lotteryPlayId,
              lotteryBettingId: item.lotteryBettingId,
              odds: item.maxOdds,
              lotteryNumber: item.ball,
              singleMoney: item.bettingMoney,
              bettingMoney: item.bettingMoney * 1,
              bettingNum: 1,
              rebate: item.rebate,
            });
            this.totalMoney += parseInt(item.bettingMoney);
          } else {
            item.bettingMoney = "";
          }
        }
      });
      return arr;
    },
    commit() {
      this.orderList = this.getSelected();
    },
    cancel() {
      this.getSelected("clear");
    },
  },
  created() {
    this.tabList = this.data;
    this.tabId = this.tabList[0].id;
    this.numBalls = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
    this.totalNote = this.tabList[0].children[0].totalNote;
    this.singleLimit = this.playTipInfo.singleLimit;
    this.maxBetNum = parseInt(this.totalNote * this.betLimRate);
  },
};
</script>

<style lang="less" scoped>
.liuhe .zhengmatei {
  position: relative;
  width: 900px;
}
.zhengmatei .tab {
  position: relative;
  width: 1180px;
  border-bottom: none;
}
.zhengmatei .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.zhengmatei .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  // -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  margin-top: -5px;
  z-index: 10;
}
.liuhe .zhengmatei .fast-menu-wp {
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
.zhengmatei .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.zhengmatei .detail-thead {
  border-top: 1px solid #d2d0d0;
}
.zhengmatei .detail-thead li,
.zhengmatei .detail-body li {
  width: 20%;
}
.zhengmatei li .label,
.zhengmatei li .odds {
  width: 25%;
}
.zhengmatei li .price {
  width: 50%;
}
/*不显示赔率时*/
.zhengmatei .price.big-width {
  width: 68%;
}
.zhengmatei .detail-body .container.active {
  background-color: #e79898;
}
.zhengmatei .detail-body li .odds,
.zhengmatei .detail-body li .container .odds,
.zhengmatei .detail-body li:first-child .container .odds {
  font-weight: bold;
}
.zhengmatei .detail-body li .odds {
  color: @primary-color;
}
.zhengmatei .add-note-wp {
  width: 1200px;
  margin-top: 135px;
  & > div {
    display: inline-flex;
    vertical-align: top;
    &:first-child {
      margin-left: 150px;
      margin-top: -50px;
    }
    &.add-note {
      width: 100px;
    }
  }
}
.zhengmatei .add-note {
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
.zhengmatei .add-note span {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #fff;
  width: 18px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  margin-right: 4px;
}
.zhengmatei .add-note b {
  font-weight: normal;
  display: inline-block;
  flex: 1;
  word-break: break-all;
}
</style>
