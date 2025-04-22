<template>
  <div class="liangmian">
    <odds></odds>
    <!--玩法中奖提示 -->
    <div class="tips">
      <div class="prize_example">
        <play-example
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
        ></play-example>
      </div>
      <div class="tip-wrap">
        <play-tip
          :playDesc="playTipInfo.playDesc"
          :tip="playTipInfo.layout.tips && playTipInfo.layout.tips"
          :maxOdd="maxOdd"
          :isLiuHe="true"
          :hasLogin="!!user.userId"
        ></play-tip>
      </div>
    </div>
    <!--玩法中奖提示结束 -->
    <!-- 特码 -->
    <div class="special">
      <div class="detail-thead nav-bg">
        <ul>
          <li v-for="item in 4" :key="item" style="width:25%">
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
                  'big-width':
                    $store.getters.sysShowOdds != '1' && !user.userId,
                }"
                >{{ $tex("金额") }}</span
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="detail-body">
        <ul>
          <li v-for="(item, idx) in specialCode" :key="idx" style="width:25%">
            <div class="container">
              <span class="label">
                {{ item.ball }}
              </span>
              <span
                class="odds"
                v-if="$store.getters.sysShowOdds == '1' || user.userId"
                >{{ item.maxOdds }}</span
              >
              <input-value
                ref="speIpt"
                @cc="selectedPrice(specialCode, 'special', idx)"
                v-model="item.bettingMoney"
                v-bind="$attrs"
                :class="{
                  'big-width':
                    $store.getters.sysShowOdds != '1' && !user.userId,
                }"
              ></input-value>
            </div>
          </li>
        </ul>
        <div class="clr"></div>
      </div>
    </div>

    <!-- 正码 -->
    <div v-if="false" class="positive">
      <div class="detail-thead title-tip">
        <ul>
          <li
            v-for="(item, idx) in thead"
            :key="idx"
            :style="{ width: item.width + '%' }"
          >
            <div class="container">{{ item.label }}</div>
          </li>
        </ul>
      </div>
      <div class="detail-thead nav-bg">
        <ul>
          <li
            v-for="(item, idx) in thead"
            :key="idx"
            :style="{ width: item.width + '%' }"
          >
            <div v-if="!item.label" class="container">{{ $tex("号码") }}</div>
            <div v-else class="container">
              <span
                class="odds"
                v-if="$store.getters.sysShowOdds == '1' || user.userId"
                >{{ $tex("赔率") }}</span
              >
              <span
                class="price"
                :class="{
                  'big-width':
                    $store.getters.sysShowOdds != '1' && !user.userId,
                }"
                >{{ $tex("金额") }}</span
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="detail-body">
        <ul>
          <li style="width: 10%">
            <div class="container" v-for="(item, index) in column" :key="index">
              {{ item }}
            </div>
          </li>
          <li v-for="(item, idx) in positiveCode" :key="idx" style="width:15%">
            <div
              class="container"
              v-for="(value, idx2) in item.children[0].layout.rates"
              :key="value.lotteryId"
            >
              <span
                class="odds"
                v-if="$store.getters.sysShowOdds == '1' || user.userId"
                >{{ value.maxOdds }}</span
              >
              <input-value
                :ref="`positive${idx}`"
                v-model="value.bettingMoney"
                v-bind="$attrs"
                :class="{
                  'big-width':
                    $store.getters.sysShowOdds != '1' && !user.userId,
                }"
                @cc="
                  selectedPrice(
                    item.children[0].layout.rates,
                    'positive',
                    idx,
                    idx2
                  )
                "
              ></input-value>
            </div>
          </li>
        </ul>
        <div class="clr"></div>
      </div>
    </div>
    <table class="zhengma-16">
      <thead class="zhengma-16_head">
        <tr class="zhengma-16_play">
          <th
            v-for="(item, idx) in tableThead"
            :key="idx"
            :colspan="idx === 0 ? 2 : 1"
          >
            {{ item.label }}
          </th>
        </tr>
        <tr class="zhengma-16_type">
          <th class="zhengma-16_type-ball">{{ $tex("号码") }}</th>
          <th v-for="item in tableThead.length" :key="item">
            <div class="zhengma-16_type-cp">
              <span
                class="zhengma-16_type-odds"
                v-if="$store.getters.sysShowOdds == '1' || user.userId"
                >{{ $tex("赔率") }}</span
              >
              <span class="zhengma-16_type-price">{{ $tex("金额") }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="zhengma-16_body">
        <tr v-for="(arr, oi) in tableLayoutArr" :key="oi">
          <td class="zhengma-16__ball">{{ column[oi] }}</td>
          <td
            v-for="(rate, ii) in arr"
            :key="rate.lotteryId - ii"
            :class="[`zhengma-16__c${ii}`]"
          >
            <div class="zhengma-16_cell">
              <span
                class="zhengma-16_body-odds"
                v-if="$store.getters.sysShowOdds == '1' || user.userId"
                >{{ rate.maxOdds }}</span
              >
              <input-value
                :ref="`positive${ii}`"
                v-model="rate.bettingMoney"
                v-bind="$attrs"
                class="zhengma-16_body-price"
                @cc="
                  selectedPrice(
                    positiveCode[ii].children[0].layout.rates,
                    'positive',
                    ii,
                    oi
                  )
                "
              ></input-value>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-note lf" @click="add">
      <span>
        <Icon type="plus-round" size="12"></Icon>
      </span>
      <b>{{ $tex("添加注单") }}</b>
    </div>
  </div>
</template>

<script>
// import liuhe from "./common_modal/handle_data.js";
// import popupModal from "./common_modal/popup.vue";
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
      tableThead: [
        { label: this.$tex("正码一"), width: 15 },
        { label: this.$tex("正码二"), width: 15 },
        { label: this.$tex("正码三"), width: 15 },
        { label: this.$tex("正码四"), width: 15 },
        { label: this.$tex("正码五"), width: 15 },
        { label: this.$tex("正码六"), width: 15 },
      ],
      thead: [
        { label: "", width: 10 },
        { label: this.$tex("正一"), width: 15 },
        { label: this.$tex("正二"), width: 15 },
        { label: this.$tex("正三"), width: 15 },
        { label: this.$tex("正四"), width: 15 },
        { label: this.$tex("正五"), width: 15 },
        { label: this.$tex("正六"), width: 15 },
      ],
      column: [],
      totalMoney: 0,
      specialCode: [],
      positiveCode: [],
      showPopup: false,
      orderList: [],
      mixNum: [],
      hasClick: false, //是否多次空投·
      playTipInfo: {},
      maxOdd: null,
      speTotalNote: "1",
      posTotalNote: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    tableLayoutArr() {
      // 变更布局中（需要变更数据结构）
      const ret = [];
      const columnSize = this.positiveCode.length;
      for (let i = 0; i < columnSize; i++) {
        const item = this.positiveCode[i];
        const rates = item.children[0].layout.rates;
        for (let j = 0; j < rates.length; j++) {
          if (!ret[j]) {
            ret[j] = [];
          }
          ret[j][i] = rates[j];
        }
      }
      return ret;
    },
  },
  methods: {
    /**
     * 选择金额后
     */
    selectedPrice(numBalls, param, idx, idx2) {
      // let len = numBalls.filter(item => item.bettingMoney).length;
      // let [iptCom, compareNote] = ['', 0];
      // let totalNote;
      // if (param === 'special') {
      //     iptCom = 'speIpt';
      //     totalNote = this.speTotalNote
      // } else {
      //     iptCom = `positive${idx}`;
      //     totalNote = this.posTotalNote
      // }
      // if (totalNote > 0) {
      //     let iptWrap = this.$parent.getIptsParent(iptCom);
      //     compareNote = totalNote * this.betLimRate;
      //     this.$parent.changeIptDisabled(len, compareNote, iptWrap, idx2 ? idx2 : idx);
      // }
      let [totalNote, flag] = ["", ""];
      if (param === "special") {
        totalNote = this.speTotalNote;
        flag = true;
      } else {
        totalNote = this.posTotalNote;
        flag = false;
      }
      if (totalNote > 0) {
        let len = numBalls.filter((item) => item.bettingMoney).length;
        let iptWrap = this.$parent.getIptsParent(
          flag ? "speIpt" : `positive${idx}`
        );
        let compareNote = totalNote * this.betLimRate;
        this.$parent.changeIptDisabled(
          len,
          compareNote,
          iptWrap,
          idx2 ? idx2 : idx
        );
      }
    },
    add() {
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      //添加注单
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
    clearMoney() {
      this.$parent.clearDisabled(this.$parent.getIptsParent("speIpt"));
      Array(this.positiveCode.length)
        .fill(1)
        .forEach((item, idx) => {
          this.$parent.clearDisabled(
            this.$parent.getIptsParent(`positive${idx}`)
          );
        });
      //清空金额
      this.mixNum = [...this.specialCode, ...this.positiveCode];
      this.specialCode.forEach((item) => {
        item.bettingMoney = null;
      });
      this.positiveCode.forEach((item) => {
        item.children[0].layout.rates.forEach((item) => {
          item.bettingMoney = null;
        });
      });
      this.orderList = [];
    },
    getSelected(clear) {
      let arr = [];
      let vm = this;
      this.totalMoney = 0;
      ["specialCode", "positiveCode"].forEach((value) => {
        vm[value].forEach((item, idx) => {
          if (value === "specialCode") {
            getArr(item);
          } else {
            item.children[0].layout.rates.forEach((vvv) => {
              getArr(vvv);
            });
          }
        });
      });
      function getArr(item) {
        if (item.bettingMoney) {
          if (!clear) {
            vm.orderList.push({
              lotteryId: item.lotteryId,
              lotteryPlayId: item.lotteryPlayId,
              lotteryBettingId: item.lotteryBettingId,
              odds: item.maxOdds,
              lotteryNumber: item.ball,
              singleMoney: item.bettingMoney,
              bettingMoney: item.bettingMoney * 1,
              bettingNum: 1,
              rebate: 0,
            });
            vm.totalMoney += parseInt(item.bettingMoney);
          } else {
            item.bettingMoney = "";
          }
        }
      }
    },
  },
  created() {
    let data = this.data;
    data.forEach((item) => {
      if (item.id === "70201") {
        this.specialCode = item.children[0].layout.rates;
        this.speTotalNote = item.children[0].totalNote;
      } else {
        this.positiveCode.push(item);
        if (!this.posTotalNote) this.posTotalNote = item.children[0].totalNote;
      }
    });
    // 排序防止顺序错乱
    this.positiveCode.sort(function(a, b) {
      return a.id - b.id;
    });
    // 获取列头
    this.positiveCode[0].children[0].layout.rates.forEach((item) => {
      this.column.push(item.ball);
    });
    this.playTipInfo = this.positiveCode[0].children[0];
    let rates = [
      ...this.positiveCode[0].children[0].layout.rates,
      ...this.specialCode,
    ];
    this.maxOdd = Math.max(...rates.map((item) => item.maxOdds));
  },
};
</script>

<style lang="less" scoped>
.liangmian .tips {
  position: relative;
  padding: 5px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #dddee1;
}
.liangmian .prize_example {
  display: inline-block;
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.liangmian .tip-wrap {
  display: inline-block;
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.special li .label,
.special li .odds {
  width: 25%;
}
.special li .price {
  width: 50%;
}
.positive li .odds {
  width: 30%;
}
.positive li .price {
  width: 70%;
}
/* 无赔率情况 */
.liangmian .special .price.big-width {
  width: 65%;
}
.liangmian .positive .nav-bg .price.big-width {
  width: 100%;
}
.liangmian .positive .price.big-width {
  width: 100%;
}
/*  */
.liangmian .special .detail-body li .label,
.liangmian .special .detail-body li .odds,
.liangmian .positive .detail-body li .label,
.liangmian .positive .detail-body li .odds,
.liangmian .positive .detail-body li .container .odds,
.liangmian .positive .detail-body li:first-child .container {
  font-weight: bold;
}
.liangmian .special .detail-body li .odds,
.liangmian .positive .detail-body li .odds {
  /*   color: @primary-color; */
}
.liangmian .add-note {
  text-align: center;
  margin-left: 990px;
  margin-top: 20px;
  margin-bottom: 20px;

  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /*  background: @result-page-chase-num-bg;
  border: 1px solid @result-page-order-border;
  box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset; */
  cursor: pointer;
}
.liangmian .add-note span {
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
.liangmian .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
</style>
