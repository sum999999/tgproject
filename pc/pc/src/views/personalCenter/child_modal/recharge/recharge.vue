<!--
 * @Description: 在线充值
 -->

<template>
  <div class="recharge">
    <div class="paylist" v-if="step === Step.DEFAULT">
      <ul v-if="hasPermission('element.coin')" class="recharge-steps">
        <li class="recharge-steps-item">
          <div class="recharge-steps-item__head">
            <div class="recharge-steps-item__head-inner">1</div>
            <div class="recharge-steps-item__head-tail"></div>
          </div>
          <div class="recharge-steps-item__main">
            {{ $tex("选择货币") }}
            <Select
              v-model="scur"
              class="recharge-steps-item__scur"
              filterable
              @on-change="onScurChange"
            >
              <Option
                v-for="coin in sysApiCoinList"
                :value="coin.cur"
                :key="coin.cur"
                >{{ coin.cur }} - {{ coin.icon }}</Option
              >
            </Select>
          </div>
        </li>
        <li class="recharge-steps-item">
          <div class="recharge-steps-item__head">
            <div class="recharge-steps-item__head-inner">2</div>
            <div class="recharge-steps-item__head-tail"></div>
          </div>
          <div class="recharge-steps-item__main">
            {{ $tex("选择第三方支付") }}
          </div>
        </li>
      </ul>
      <div v-if="!list.length" class="recharge-pays-loading">
        <vue-loaders-line-scale
          :color="themeColorList.primaryColor"
        ></vue-loaders-line-scale>
      </div>
      <ul class="recharge-pays clearfix">
        <li
          v-for="item in list"
          :key="item.payTopTypeName"
          class="recharge-item"
          :class="{ active: item.payTopTypeName == name }"
          @mouseenter="changeCss(item.payTopTypeName)"
          @click="enterNext(item)"
        >
          <div class="border">
            <div class="img">
              <img :src="item.payTopTypeIcon" />
            </div>
            <div class="contents">
              <div
                class="w1"
                :class="{ w3: $store.getters.sysPlatformFlag != 'by331' }"
              >
                {{ item.payTopTypeName }}
              </div>
              <div
                class="w2"
                v-html="escapeHtml(item.payTopTypeDescribe)"
              ></div>
            </div>
          </div>
          <div class="pay">
            <p class="gopay">
              <span>{{ $tex("去支付") }}</span>
              <i
                class="i-two-right-arrow"
                v-show="item.payTopTypeName === name"
              ></i>
            </p>
            <div class="right" v-show="item.payTopTypeName === name">
              <Icon
                type="ios-checkmark-empty"
                size="40"
                color="white"
                class="iconright"
              ></Icon>
            </div>
          </div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <!-- <step-one :data="stepOneData" @get-back-status="getBackStatus" v-if="step === 1"></step-one> -->
    <step-two
      :data="stepTowData"
      :local-api-coin="localApiCoin"
      @get-back-status="getBackStatus"
      @show-spin="setLoading"
      @hide-spin="hideLoading"
      v-if="step === Step.ORDER"
    ></step-two>
    <step-three
      :data="resultData"
      :local-api-coin="localApiCoin"
      :parentData="stepTowData"
      @get-back-status="getBackStatus"
      :flag="flag"
      v-if="step === Step.RESULT"
    ></step-three>
    <usdt-auto
      v-if="step === Step.USDT_AUTO"
      :data="resultData"
      :local-api-coin="localApiCoin"
      @get-back-status="getBackStatus"
    >
    </usdt-auto>
  </div>
</template>

<script>
// import stepOne from './step1'
import stepTwo from "./step2";
import stepThree from "./step3";
import UsdtAuto from "./components/UsdtAuto";
import util from "@/utils/utils";
import VueLoadersLineScale from "vue-loaders/dist/loaders/line-scale";
import { mapGetters } from "vuex";
import { getUsablePayType, getWalletInfo } from "@/api/user";
import { hasPermission } from "@/utils/authority-utils";

export const Step = {
  DEFAULT: 0,
  ORDER: 2,
  RESULT: 3,
  USDT_AUTO: 4,
};

export default {
  data() {
    return {
      list: [],
      name: "",
      Step,
      step: Step.DEFAULT,
      stepOneData: {},
      stepTowData: {},
      flag: false, //网银充值
      showLoading: false,
      scur: "",
      exchangeRate: 1,
      coinList: [],
      localApiCoin: {},
      resultData: {},
      showWallet: false, // 显示钱包
      walletInfo: {}, // 钱包信息
      channelId: "", // 通道Id
      payTypeCode: "",
      amountType: "0", // USDT通道
    };
  },
  provide() {
    return {
      getAmountAisle: () => this.amountType,
    };
  },
  components: {
    // stepOne,
    stepTwo,
    stepThree,
    UsdtAuto,
    VueLoadersLineScale: VueLoadersLineScale.component,
  },
  computed: {
    ...mapGetters([
      "sysApiCoin",
      "sysApiCoinList",
      "themeColorList",
      "sysExchangeInfo",
    ]),
  },
  created() {
    this.initHandler();
  },
  beforeDestroy() {
    localStorage.removeItem("another");
  },
  methods: {
    hasPermission,
    async initHandler() {
      if (hasPermission("element.coin")) {
        !this.sysApiCoin.cur &&
          (await this.$store.dispatch("querySystemConfig"));
        this.scur = this.sysApiCoin.cur;
        await this.getPayExchangeRate(this.scur);
      }
      await this.getUsablePayType(this.scur);
    },
    async getUsablePayType(scur) {
      const headers = {};
      scur && (headers["scur"] = scur);
      this.list = [];
      const resp = await getUsablePayType({}, { headers });
      if (resp.data.code !== 0) return;
      this.list = resp.data.data;
      // console.log("resp1", this.list);
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
    async onScurChange(scur) {
      await this.getPayExchangeRate(scur);
      await this.getUsablePayType(scur);
    },
    escapeHtml(str) {
      return util.escapeHtml(str);
    },
    changeCss(name) {
      this.name = name;
    },
    async enterNext(item) {
      this.stepTowData = item;
      this.step = Step.ORDER;
      // 判断是否是USDT
      this.amountType = item.onAndOffList[0].amountType;
    },

    getBackStatus(result, type) {
      if (type === "01") {
        this.flag = true;
      } else {
        this.flag = false;
      }
      if (typeof result === "number") {
        return (this.step = result);
      } else if (typeof result === "undefined") {
        return (this.step = Step.DEFAULT);
      }
      if (type === "11") {
        this.step = Step.USDT_AUTO;
      } else {
        this.step = Step.RESULT;
      }
      this.resultData = result;
    },
    /**
     * 显示loading
     */
    setLoading() {
      this.$emit("handler-spin", true);
    },
    /**
     * 隐藏loading
     */
    hideLoading() {
      this.$emit("handler-spin", false);
    },
  },
};
</script>

<style lang="less">
.recharge .paylist {
  padding: 8px 10px;
}
.recharge .paylist .recharge-item {
  float: left;
  width: 325px;
  height: 174px;
  margin: 0 15px 25px;
  border: 1px solid #d5d5d5;
}
.recharge .paylist .recharge-item:hover {
  cursor: pointer;
}

.recharge .paylist .recharge-item .border {
  width: 100%;
  height: 127px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.recharge .paylist .recharge-item .border .img {
  width: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recharge .paylist .recharge-item .border .img img {
  width: 100%;
  max-width: 100%;
}
.recharge .paylist .recharge-item .contents {
  font-size: 16px;
  margin-left: 25px;
  width: 150px;
  height: 100%;
}
.recharge .paylist .recharge-item .contents .w1 {
  font-size: 26px;
  font-weight: bold;
  color: #010101;
  white-space: nowrap;
}
.recharge .paylist .recharge-item .contents .w2 {
  margin-top: 5px;
  color: #313131;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.recharge .paylist .recharge-item .contents .w3 {
  overflow: hidden;
  text-overflow: ellipsis;
}
.recharge .paylist li .contents .w2 img {
  width: auto;
}
.recharge .paylist .recharge-item .pay {
  position: relative;
  background-color: #f1f1f1;
  text-align: center;
  width: 100%;
  height: 45px;
  border-top: 1px solid #d5d5d5;
}
.recharge .paylist .recharge-item.active .gopay {
  /*   color: @primary-color; */
  background: #fbfbfb;
}
.recharge .paylist .recharge-item .gopay {
  width: 323px;
  height: 44px;
  line-height: 44px;
  font-size: 18px;
  text-align: center;
  position: absolute;
}
.recharge .paylist .recharge-item .gopay i {
  display: inline-block;
  vertical-align: top;
  margin-top: 17px;
  margin-left: 12px;
  visibility: visible;
}
.recharge .paylist .recharge-item .right {
  position: absolute;
  right: 0;
  top: 16px;
  width: 28px;
  height: 0;
  /*   border-bottom: 29px solid @primary-color; */
  border-left: 29px solid transparent;
}
.recharge .paylist .recharge-item .right i {
  width: 10px;
  height: 10px;
  position: absolute;
  right: 7px;
  font-size: 40px;
  color: #fff;
}
</style>

<style lang="less" scoped>
.recharge-pays {
  margin-top: 20px;
}
.recharge-steps {
  .recharge-steps-item:nth-child(1) {
    .recharge-steps-item__head {
      padding: 7px 13px 0 0;
    }
  }
  .recharge-steps-item:nth-last-child(1) {
    .recharge-steps-item__main {
      min-height: 0px;
    }
  }
}
.recharge-steps-item {
  display: flex;
}
.recharge-steps-item__head {
  padding: 2px 13px 0 0;
}
.recharge-steps-item__head-tail {
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 23px;
  padding-bottom: 4px;
  margin: -15px 0;
  &:before {
    content: "";
    width: 1px;
    background-color: #e2e2e2;
    height: 100%;
    display: block;
    margin: auto;
  }
}
.recharge-steps-item__head-inner {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  text-align: center;
  line-height: 15px;
  color: #ffffff;
}
.recharge-steps-item__main {
  min-height: 90px;
  flex: 1;
}
.recharge-steps-item__scur {
  width: 200px;
  margin-left: 20px;
}
.recharge-pays-loading {
  text-align: center;
  padding: 100px 0;
}
</style>
