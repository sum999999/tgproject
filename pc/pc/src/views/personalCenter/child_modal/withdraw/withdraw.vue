<template>
  <div class="withdraw">
    <div
      v-if="hasPermission('element.coin')"
      class="selelct-currency"
    >
      {{$tex("选择货币")}}
      <Select
        v-model="scur"
        filterable
        @on-change="onScurChange"
      >
        <Option
          v-for="coin in sysApiCoinList"
          :value="coin.cur"
          :key="coin.cur"
        >{{ coin.cur }} - {{ coin.icon }}</Option>
      </Select>
    </div>
    <div
      v-if="loading"
      class="recharge-pays-loading"
    >
      <vue-loaders-line-scale :color="themeColorList.primaryColor"></vue-loaders-line-scale>
    </div>
    <ul
      v-if="!loading"
      class="tabs-nav"
    >
      <li
        v-if="isBank"
        class="tabs-nav-item bankPay"
        :class="[currentTabName === 'bankPay' ? 'active' : '']"
        @click="currentTabChange('bankPay')"
      >
        {{$tex("银行卡")}}
      </li>
      <li
        v-if="isAlipay"
        class="tabs-nav-item aliPay"
        :class="[currentTabName === 'aliPay' ? 'active' : '']"
        @click="currentTabChange('aliPay')"
      >
        {{$tex("支付宝")}}
      </li>
      <li
        v-if="isWechat"
        class="tabs-nav-item weChatPay"
        :class="[currentTabName === 'weChatPay' ? 'active' : '']"
        @click="currentTabChange('weChatPay')"
      >
        {{$tex("微信")}}
      </li>
      <li
        v-if="isDigiccy"
        class="tabs-nav-item currencyPay"
        :class="[currentTabName === 'currencyPay' ? 'active' : '']"
        @click="currentTabChange('currencyPay')"
      >
        {{checkChineseKey() ? '数字货币' : 'DIGICCY'}}
      </li>
      <li
        v-if="isUniversal"
        class="tabs-nav-item cardPay"
        :class="[currentTabName === 'cardPay' ? 'active' : '']"
        @click="currentTabChange('cardPay')"
      >
        {{$tex("支付卡")}}
      </li>
    </ul>
    <component
      v-if="userBankInfo && !loading"
      :is="currentTabName"
      :currentTabName="currentTabName"
      :data="userBankInfo"
      :local-api-coin="localApiCoin"
    ></component>
  </div>
</template>
<script>
import bankPay from './bankPay'
import aliPay from './aliPay'
import weChatPay from './weChatPay'
import currencyPay from './currencyPay'
import cardPay from './cardPay'
import { queryLotUserBankInfo } from '@/api/user'
import { mapGetters } from 'vuex'
import { checkChineseKey } from '@/lang'
import { hasPermission } from '@/utils/authority-utils'
import VueLoadersLineScale from 'vue-loaders/dist/loaders/line-scale'

export default {
  components: {
    bankPay,
    aliPay,
    weChatPay,
    currencyPay,
    cardPay,
    VueLoadersLineScale: VueLoadersLineScale.component,
  },
  data() {
    return {
      currentTabName: "",
      isBank: "",
      isAlipay: "",
      isWechat: "",
      isDigiccy: "",
      isUniversal: "",
      userBankInfo: "",
      loading: false,
      scur: "",
      localApiCoin: {},
    };
  },
  computed: {
    ...mapGetters([
      "sysApiCoin",
      "sysApiCoinList",
      "sysExchangeInfo",
      "themeColorList",
    ]),
  },
  created() {
    this.initHandler();
  },
  methods: {
    checkChineseKey,
    hasPermission,
    currentTabChange(name) {
      this.currentTabName = name;
    },
    async initHandler() {
      if (hasPermission("element.coin")) {
        !this.sysApiCoin.cur &&
          (await this.$store.dispatch("querySystemConfig"));
        this.scur = this.sysApiCoin.cur;
        await this.getPayExchangeRate(this.scur);
      }
      this.loading = true;
      await this.queryLotUserBankInfo(this.scur);
      this.loading = false;
    },
    async getPayExchangeRate(scur) {
      if (scur) {
        const exchangeInfo = await this.$store.dispatch(
          "queryApiCoinExChangeInfo",
          {
            headers: {
              scur,
            },
          }
        );
        this.localApiCoin = {
          ...exchangeInfo,
          scur,
        };
      }
    },
    async queryLotUserBankInfo(scur) {
      const headers = {};
      scur && (headers["scur"] = scur);
      const response = await queryLotUserBankInfo({}, { headers });
      if (response.data.code !== 0) return;
      let {
        isBank,
        isAlipay,
        isWechat,
        isDigiccy,
        isUniversal,
      } = response.data.data;
      console.log("response.data.data", response.data.data);
      this.userBankInfo = response.data.data;
      this.isBank = isBank === "1";
      this.isAlipay = isAlipay === "1";
      this.isWechat = isWechat === "1";
      this.isDigiccy = isDigiccy === "1";
      this.isUniversal = isUniversal === "1";
      if (!this.currentTabName) {
        if (this.isBank) {
          this.currentTabName = "bankPay";
        } else if (this.isAlipay) {
          this.currentTabName = "aliPay";
        } else if (this.isWechat) {
          this.currentTabName = "weChatPay";
        } else if (this.isDigiccy) {
          this.currentTabName = "currencyPay";
        } else if (this.isUniversal) {
          this.currentTabName = "cardPay";
        }
      }
    },
    async onScurChange(scur) {
      this.loading = true;
      await this.getPayExchangeRate(scur);
      await this.queryLotUserBankInfo(scur);
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.withdraw {
  margin-top: 20px;
  @{deep} .ivu-tabs-nav .ivu-tabs-tab {
    padding: 0;
    width: 235px;
    height: 88px;
    filter: grayscale(99%);
  }
  @{deep} .ivu-tabs-nav-prev,
  @{deep} .ivu-tabs-nav-next {
    display: none;
  }
  @{deep} .ivu-tabs-nav .ivu-tabs-tab {
    margin-right: 0;
  }
  @{deep} .ivu-tabs-nav .ivu-tabs-tab-active {
    filter: grayscale(0);
  }
  @{deep} .ivu-tabs-nav {
    float: initial;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    :nth-child(2) {
      margin-right: 15px;
      background: url(/static/images/txdyhk.png) center center no-repeat;
      background-size: contain;
    }
    :nth-child(3) {
      margin-right: 15px;
      background: url(/static/images/txdzfb.png) center center no-repeat;
      background-size: contain;
    }
    :nth-child(4) {
      background: url(/static/images/txdwx.png) center center no-repeat;
      background-size: contain;
    }
    :nth-child(5) {
      background: url(/static/images/szhb.png) center center no-repeat;
      background-size: contain;
    }
  }
  .showWechat @{deep} .ivu-tabs-nav {
    float: initial;
    :nth-child(2) {
      margin-right: 15px;
      background: url(/static/images/txdyhk.png) center center no-repeat;
      background-size: contain;
    }
    :nth-child(3) {
      margin-right: 15px;
      background: url(/static/images/txdwx.png) center center no-repeat;
      background-size: contain;
    }
    :nth-child(4) {
      margin-right: 15px;
      background: url(/static/images/szhb.png) center center no-repeat;
      background-size: contain;
    }
  }
  @{deep} .ivu-tabs-ink-bar {
    visibility: hidden;
  }
  @{deep} .ivu-tabs-nav-wrap {
    margin-bottom: 5px;
  }
  @{deep} .ivu-tabs-bar {
    /*     border-bottom: 3px solid #be1204; */
  }
  .tabs-nav {
    display: flex;
    flex-wrap: wrap;
  }
  .tabs-nav-item {
    flex-basis: 33.3333%;
    height: 88px;
    cursor: pointer;
    filter: grayscale(100%);
    line-height: 72px;
    padding-left: 56px;
    color: #ffffff;
  }
  .tabs-nav-item.active {
    filter: grayscale(0);
  }
  .tabs-nav-item.bankPay {
    background: url(/static/images/txdyhk.png) left center no-repeat;
    background-size: contain;
  }
  .tabs-nav-item.aliPay {
    background: url(/static/images/txdzfb.png) left center no-repeat;
    background-size: contain;
  }
  .tabs-nav-item.weChatPay {
    background: url(/static/images/txdwx.png) left center no-repeat;
    background-size: contain;
  }
  .tabs-nav-item.currencyPay {
    background: url(/static/images/szhb.png) left center no-repeat;
    background-size: contain;
  }
  .tabs-nav-item.cardPay {
    background: url(/static/images/zhifuka.png) left center no-repeat;
    background-size: contain;
  }
  .selelct-currency {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .ivu-select {
      width: 200px;
      margin-left: 20px;
    }
  }
  .recharge-pays-loading {
    text-align: center;
    padding: 100px 0;
  }
}
</style>
