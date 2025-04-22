<template>
  <div
    class="prize-tip wrap"
    :class="[!hasLogin ? 'no-login' : '']"
  >
    <div class="top">
      <span>{{$tex("注数")}}&nbsp;</span>
      <i18n path="{num}注" :tag="false">
        <template slot="num">
          <strong>{{count}}</strong>&nbsp;
        </template>
      </i18n>
      <span>{{$tex("金额")}}&nbsp;</span>
      <strong>{{totalmoney}}</strong>
      <span>&nbsp;{{ $scur("元") }}&nbsp;</span>
      <i18n v-if="!verticalLayout && hasLogin" path="若中奖,单注最高中{num}{unit}" tag="span">
        <template slot="num">
          <strong class="red-font"> {{prizeMoney}} </strong>
        </template>
        <template slot="unit">
          {{ $scur("元") }}
        </template>
      </i18n>
      <span v-if="showTotalExpenditure">
        {{ $tex("总支出") }}:
        <strong class="red-font"> {{totalExpenditure}} </strong>
        {{sysExchangeInfo.tcurIcon}}
      </span>
    </div>
    <div
      class="bottom"
      v-if="verticalLayout"
    >
      <i18n path="若中奖,单注最高中{num}{unit}" :tag="false">
        <template slot="num">
          <strong class="red-font"> {{prizeMoney}} </strong>
        </template>
        <template slot="unit">
          {{ $scur("元") }}
        </template>
      </i18n>
    </div>
  </div>
</template>
<script>
import numeral from "numeral";
import Utils from '@/utils/utils'
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

export default {
  props: {
    code: {
      type: String,
      default: ""
    },
    count: {
      default: 0,
      type: Number
    },
    money: {
      default: 0,
      type: [Number, String]
    },
    singlePrizeMoney: {
      default: 0,
      type: [Number, String]
    },
    verticalLayout: {
      default: true,
      type: Boolean
    },
    hasLogin: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['sysExchangeInfo']),
    totalmoney() {
      return (+this.money).toFixed(2);
    },
    prizeMoney() {
      return numeral(this.singlePrizeMoney).format("0.00");
    },
    exchangeRate() {
      return this.sysExchangeInfo.exchangeRate || 1
    },
    totalExpenditure() {
      return numeral(Number(this.totalmoney))
              .multiply(this.exchangeRate).format("0.00");
    },
    showTotalExpenditure() {
      return (this.code === 'liuhe' || this.code === 'pcdd') && hasPermission('element.currencyExchange')
    }
  },
  methods: {
    hasPermission
  }
};
</script>

<style lang="less"scoped>
.prize-tip {
  /*height: 35px;*/
  font-size: 14px;
  margin-top: 2px;
}
.prize-tip .top,
.prize-tip .bottom {
  line-height: 18px;
}
.prize-tip.no-login .top {
  line-height: 35px;
}
.prize-tip.no-login .bottom {
  display: none;
}
.prize-tip strong {
  color: #ae291a;
}
</style>



