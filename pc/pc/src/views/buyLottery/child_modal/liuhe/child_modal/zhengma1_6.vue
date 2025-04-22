<template>
  <div class="zhengma_16">
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
          :isLiuHe="true"
          :maxOdd="maxOdd"
          :hasLogin="!!user.userId"
        ></play-tip>
      </div>
    </div>
    <!--玩法中奖提示 -->
    <div v-if="false" class="positive">
      <div class="detail-thead title-tip" style="margin-top:0;">
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
        <ul class="clearfix">
          <li
            v-for="(item, idx) in thead"
            :key="idx"
            :style="{ width: item.width + '%' }"
          >
            <div v-if="!item.label" class="container clearfix">
              {{ $tex("号码") }}
            </div>
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
        <ul class="detail-body-wrap clearfix">
          <li class="detail-body-item" style="width: 10%">
            <div class="container clearfix" v-for="item in column" :key="item">
              {{ item }}
            </div>
          </li>
          <li
            v-for="(item, idx) in positiveCode"
            :key="idx"
            class="detail-body-item"
            style="width:15%"
          >
            <div
              class="container clearfix"
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
  data() {
    return {
      playTipInfo: {},
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
        { label: this.$tex("正码一"), width: 15 },
        { label: this.$tex("正码二"), width: 15 },
        { label: this.$tex("正码三"), width: 15 },
        { label: this.$tex("正码四"), width: 15 },
        { label: this.$tex("正码五"), width: 15 },
        { label: this.$tex("正码六"), width: 15 },
      ],
      column: [
        "大",
        "小",
        "单",
        "双",
        "合单",
        "合双",
        "合大",
        "合小",
        "尾大",
        "尾小",
        "红波",
        "绿波",
        "蓝波",
      ],
      totalMoney: 0,
      positiveCode: [],
      // showPopup: false,
      orderList: [],
      hasClick: false, //是否多次空投·
      totalNote: 0,
    };
  },
  methods: {
    /**
     * 选择金额后
     */
    selectedPrice(numBalls, param, idx, idx2) {
      if (this.totalNote && this.totalNote > 0) {
        let len = numBalls.filter((item) => item.bettingMoney).length;
        let compareNote = this.totalNote * this.betLimRate;
        let iptWrap = this.$parent.getIptsParent(`positive${idx}`);
        this.$parent.changeIptDisabled(
          len,
          compareNote,
          iptWrap,
          idx2 ? idx2 : idx
        );
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
      this.positiveCode.forEach((item) => {
        item.children[0].layout.rates.forEach((item) => {
          item.bettingMoney = null;
        });
      });
      this.orderList = [];
      if (this.totalNote && this.totalNote > 0) {
        Array(this.positiveCode.length)
          .fill(1)
          .forEach((item, idx) => {
            this.$parent.clearDisabled(
              this.$parent.getIptsParent(`positive${idx}`)
            );
          });
      }
    },
    getSelected(clear) {
      let arr = [];
      let vm = this;
      this.totalMoney = 0;
      vm.positiveCode.forEach((item, idx) => {
        item.children[0].layout.rates.forEach((vvv) => {
          getArr(vvv);
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
              singleMoney: item.bettingMoney, //3.19
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
    let positiveCode = this.data;
    // 防止顺序错乱
    positiveCode.sort(function(a, b) {
      return a.id - b.id;
    });
    // 对rates排序
    positiveCode.forEach((item) => {
      let rates = item.children[0].layout.rates;
      let arr = [];
      this.column.forEach((value) => {
        arr.push(rates.filter((vvv) => vvv.ball === value)[0]);
      });
      item.children[0].layout.rates = arr;
    });
    this.positiveCode = JSON.parse(JSON.stringify(positiveCode));
    this.playTipInfo = positiveCode[0].children[0];
    this.totalNote = this.playTipInfo.totalNote;
    let odds = this.positiveCode
      .reduce((val, item) => {
        //最大赔率
        return val.concat(item.children[0].layout.rates);
      }, [])
      .map((item) => item.maxOdds);
    this.maxOdd = Math.max(...odds);
  },
};
</script>

<style lang="less" scoped>
.zhengma_16 .tips {
  position: relative;
  padding: 5px 0;
}
.zhengma_16 .prize_example {
  display: inline-block;
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.zhengma_16 .tip-wrap {
  display: inline-block;
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.positive li .odds {
  width: 30%;
}
.positive li .price {
  width: 70%;
}
/* 无赔率时 */
.zhengma_16 .positive li .price.big-width {
  width: 100%;
}
/* 无赔率时 */
.positive .detail-body li .odds,
.positive .detail-body li:first-child .container {
  font-weight: bold;
}
.positive .detail-body li .odds {
  color: @primary-color;
}
.zhengma_16 .add-note {
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
.zhengma_16 .add-note span {
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
</style>
