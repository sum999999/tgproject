<template>
  <div class="zhengma">
    <odds></odds>
    <!--玩法中奖提示 -->
    <div class="tips">
      <div class="prize_example">
        <play-example
          :showFastBtn="true"
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
          @toggle-fast-menu="toggleFstMenu"
        ></play-example>
      </div>
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
    <!-- 快捷菜单 -->
    <div class="fast-menu-wp" :class="{ active: isShowFastBetMenu }">
      <fast-menu ref="fastMenuWp" @select-bet-type="selectBetType"></fast-menu>
    </div>
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
              :class="{
                'big-width': $store.getters.sysShowOdds != '1' && !user.userId,
              }"
              v-bind="$attrs"
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
import defaultSet from "./common_modal/defaultSet.vue";
import fastMenu from "./common_modal/fastMenu";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

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
      numBalls: [],
      showPopup: false,
      orderList: [],
      hasClick: false, //是否多次空投·
      maxOdd: null,
      totalNote: "1",
      isShowFastBetMenu: false, //是否显示快捷投注菜单
      singleLimit: 0, //单注最大限额
      setBetMoney: 10, //统一的输入金额
      maxBetNum: 0, //最大投注注数
    };
  },
  computed: {
    ...mapGetters(["getSysUserAmountBySelfFlag"]),
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
  methods: {
    /**
     * 选择金额
     */
    slectedPrice(numBalls, param, index) {
      if (!this.totalNote || this.totalNote <= 0) return;
      let len = numBalls.filter((item) => item.bettingMoney).length;
      let compareNote = this.totalNote * this.betLimRate;
      let iptWrap = this.$parent.getIptsParent("numIpt");
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
      this.setBetMoney = 10;
      this.$refs["defaultSet"].reset && this.$refs["defaultSet"].reset();
      let fastMenuWp = this.$refs["fastMenuWp"];
      fastMenuWp.trIndex = -1;
      fastMenuWp.tdIndex = -1;
      if (this.totalNote && this.totalNote > 0) {
        let iptCom = this.$parent.getIptsParent("numIpt");
        this.$parent.clearDisabled(iptCom);
      }
      this.numBalls.forEach((item) => {
        item.bettingMoney = null;
      });
      this.orderList = [];
    },
    getSelected(clear) {
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
              singleMoney: item.bettingMoney, //3.19
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
    },
  },
  created() {
    let data = this.data;
    let child = data[0].children[0];
    this.playTipInfo = data[0].children[0];
    this.singleLimit = this.playTipInfo.singleLimit;
    this.totalNote = child.totalNote;
    this.maxBetNum = parseInt(this.totalNote * this.betLimRate);
    this.numBalls = data[0].children[0].layout.rates;
    this.maxOdd = Math.max(...this.numBalls.map((item) => item.maxOdds)); //最大赔率
  },
};
</script>

<style lang="less" scoped>
.zhengma {
  position: relative;
  width: 900px;
}
.zhengma .tips {
  position: relative;
  width: 1180px;
  padding: 5px 0;
  // margin-bottom: 10px;
  // border-bottom: 1px solid #dddee1;
  border-bottom: none;
}
.zhengma .prize_example {
  display: inline-block;
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.zhengma .tip-wrap {
  display: inline-block;
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.zhengma .detail-thead {
  border-top: 1px solid #d2d0d0;
}
.zhengma .detail-thead li,
.zhengma .detail-body li {
  width: 20%;
}
.zhengma li .label,
.zhengma li .odds {
  width: 25%;
}
.zhengma li .price {
  width: 50%;
}
.zhengma li .price.big-width {
  width: 66%;
}
.zhengma .detail-body li .odds,
.zhengma .detail-body li .container .odds,
.zhengma .detail-body li:first-child .container .odds {
  font-weight: bold;
}
.zhengma .detail-body .container.active {
  background-color: #e79898;
}
.zhengma .detail-body li .odds {
  color: @primary-color;
}
.zhengma .fast-menu-wp {
  position: absolute;
  top: 46px;
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
.zhengma .add-note-wp {
  width: 1200px;
  margin-top: 123px;
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
.zhengma .add-note {
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
.zhengma .add-note span {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #fff;
  width: 18px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  margin-right: 4px;
}
.zhengma .add-note b {
  font-weight: normal;
  display: inline-block;
  flex: 1;
  word-break: break-all;
}
</style>
