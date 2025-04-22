<template>
  <div class="currency">
    <Form v-if="Steps.kOrder === step" class="currency-order" :label-width="82">
      <!--            <div>-->
      <!--                <span>{{$tex("数字货币")}}：</span>-->
      <!--                <Select v-model="rechargeTypeIndex">-->
      <!--                    <Option v-for="(rechargeType, index) in payTopType.onAndOffList"-->
      <!--                            :value="index" :key="index">{{ rechargeType.bankName || rechargeType.channelName }}</Option>-->
      <!--                </Select>-->
      <!--            </div>-->
      <div class="currency-container" v-if="showInputMoney">
        <span>{{ bankName }}</span>
        <zk-input
          v-model="inputAmount"
          class="currency-container__input"
          type="digit"
          :min="0"
          :placeholder="$tex('请输入货币数量')"
          digitilen="4"
        >
        </zk-input>
      </div>
      <div class="currency-order__exchange">
        {{ $tex("当前汇率") }}：
        <div class="currency-order__bg">{{ exchangeRate }}</div>
        &nbsp;&nbsp;≈
        {{ $tex(hasPermission("element.unit") ? "元" : "人民币") }}：
        <div class="currency-order__bg">{{ conversionAmount }}</div>
        <template
          v-if="
            hasPermission('element.currencyExchange') &&
              sysExchangeInfo.scur !== sysExchangeInfo.tcur
          "
        >
          &nbsp;&nbsp;≈ {{ sysExchangeInfo.scurIcon }}：
          <div class="currency-order__bg">{{ languageConvAmount }}</div>
        </template>
      </div>
      <div class="currency-order-tab-wrap">
        <ul class="currency-order-tab clearfix">
          <li
            v-for="(item, index) in quickMoneyList"
            :key="index"
            class="currency-order-tab__item"
            :class="{
              'currency-order-tab__item--active': item.selected,
            }"
            @click="onAmountClick(index)"
          >
            <div class="currency-order-tab__content">{{ item.money }}</div>
          </li>
        </ul>
      </div>
      <div class="currency-content" v-if="showHelpContent">
        <div class="currency-content__title" v-if="showBourse">
          {{ $tex("如何快速建立货币账户") }}?
        </div>
        <ul class="currency-content__bourse" v-if="showBourse">
          <li
            v-if="rechargeType.fastCreateName"
            class="currency-content__bourse-item"
            @click="jump2Bourse(rechargeType.fastCreateAddress)"
          >
            <img :src="accountIcon" alt="" />
            <span>{{ rechargeType.fastCreateName }}</span>
          </li>
          <li
            v-if="rechargeType.fastCreateName2"
            class="currency-content__bourse-item"
            @click="jump2Bourse(rechargeType.fastCreateAddress2)"
          >
            <img :src="accountIcon" alt="" />
            <span>{{ rechargeType.fastCreateName2 }}</span>
          </li>
        </ul>
        <div class="currency-content__dsc" v-html="escapeHtml(remark)"></div>
        <span class="currency-content__help" v-if="useTutorialLink">
          <a :href="useTutorialLink" target="_blank"
            ><span class="currency-content__primary">*</span>【{{
              $tex("点击查看帮助")
            }}】</a
          >
        </span>
      </div>
      <!--            <div class="currency-order__conversion">-->
      <!--                货币换算-->
      <!--            </div>-->
      <!--            <div class="currency-order-tool">-->
      <!--                <img-->
      <!--                        class="currency-order__img"-->
      <!--                        src="~@/assets/images/currency/small_btb.png"-->
      <!--                        alt=""-->
      <!--                />-->
      <!--                <span class="currency-order__symbol">x</span>-->
      <!--                <span>{{ currencyNum }}</span>-->
      <!--                <span class="currency-order__symbol">=</span>-->
      <!--                <div class="currency-order__input">{{ conversionAmount }}¥</div>-->
      <!--            </div>-->
      <div
        class="currency-order__back-button currency-button"
        @click="onBackClick"
      >
        {{ $tex("返回") }}
      </div>
      <div
        v-if="isPreCreateOrder"
        class="currency-order__order-button currency-button"
        @click="onPreCreateOrderClick"
      >
        {{ $tex("创建订单") }}
      </div>
      <div
        v-else
        class="currency-order__next-button currency-button"
        @click="onNextClick"
      >
        {{ $tex("下一步") }}
      </div>
    </Form>
    <div v-else-if="Steps.kRecharge === step" class="currency-recharge">
      <div class="currency-recharge__box">
        <div class="currency-recharge__title">
          {{ bankName }}{{ $tex("存入金额") }}：
          <span>{{ inputAmount }}</span>
        </div>
        <div class="currency-recharge-copy">
          <span style="color: #db4343;"
            >{{ $tex("提示") }}:{{
              $tex("需严格按照实际金额+小数点金额转账，否则无法正常到账")
            }}</span
          >
        </div>
      </div>
      <div class="currency-recharge__box">
        <div class="currency-recharge__title">
          {{ bankName }}{{ $tex("充值地址") }}：
        </div>
        <div class="currency-recharge-copy">
          <div
            class="currency-recharge-copy__input currency-recharge-copy__outline"
          >
            {{ receivingAddress }}
          </div>
          <div
            class="currency-button currency-button--size-m"
            v-clipboard="receivingAddress"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
          >
            {{ $tex("复制") }}
          </div>
        </div>
      </div>
      <div class="currency-recharge__box" v-if="accountImgUrl">
        <div class="currency-recharge__title">
          {{ bankName }}{{ $tex("充值二维码") }}：
        </div>
        <div class="currency-recharge-scan">
          <img :src="accountImgUrl" alt="" />
        </div>
        <!--                <div class="currency-recharge__save currency-button currency-button&#45;&#45;size-m" @click="onQRCodeSaveClick">保存</div>-->
      </div>
      <div class="currency-recharge__box" v-if="!isPreCreateOrder">
        <div class="currency-recharge__title">
          {{
            businesses == "by321" ? $tex("区块链交易ID") : $tex("存款人地址")
          }}：
        </div>
        <div class="currency-recharge-copy">
          <Input
            v-model="rechargeUsername"
            class="currency-recharge-copy__input"
            :placeholder="
              businesses == 'by321'
                ? $tex('区块链交易ID详细信息')
                : $tex('存款人地址详细信息')
            "
            @on-change="onRechargeUsernameInput"
          ></Input>
          <div class="currency-button" @click="onOrderSubmitClick">
            {{ $tex("提交订单") }}
          </div>
        </div>
      </div>
      <!--            <div class="currency-recharge__remark">{{ remark }}</div>-->
      <div class="currency-button" @click="onBackClick">{{ $tex("返回") }}</div>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { saveAs } from "file-saver";
import util from "@/utils/utils";
import { ZkInput } from "@/components/ZkInput";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

const Steps = {
  kOrder: "kOrder",
  kRecharge: "kRecharge",
};

export default {
  name: "DigitalCurrency",
  components: {
    VueQr,
    ZkInput,
  },
  inject: ["getAmountAisle"],
  props: {
    payTopType: {
      type: Object,
      default() {
        return {
          payTopTypeId: "",
          payTopTypeIcon: "",
          payTopTypeDescribe: "",
          payTopTypeName: "",
          payTopTypeCode: "",
          onlinePayTypeList: [],
          offlineAccountList: [],
          onAndOffList: [],
        };
      },
    },
    rechargeTypeIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      Steps,
      step: Steps.kOrder,
      lastQuickMoneyIndex: -1,
      quickMoneyList: [],
      rechargeUsername: "",
      qrCodeDataUrl: "",
      inputAmount: "",
      businesses: "",
    };
  },
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
    accountImgUrl() {
      return this.rechargeType.accountImgUrl;
    },
    rechargeType() {
      return this.payTopType.onAndOffList[this.rechargeTypeIndex] || {};
    },
    exchangeRate() {
      return this.rechargeType.exchangeRate;
    },
    bankName() {
      return this.rechargeType.bankName;
    },
    currencyNum() {
      const amount = this.quickMoneyList[this.lastQuickMoneyIndex] || {};
      const amountAisle = this.getAmountAisle();
      let money = 0;
      if (amount.selected) {
        money = amount.money;
        if (amountAisle == 1) money = parseFloat(this.inputAmount) || 0;
      } else {
        money = parseFloat(this.inputAmount) || 0;
      }
      return money;
    },
    conversionAmount() {
      return +numeral(this.currencyNum)
        .multiply(this.rechargeType.exchangeRate)
        .format("0.00", Math.floor);
    },
    languageConvAmount() {
      return +numeral(this.conversionAmount)
        .divide(this.sysExchangeInfo.exchangeRate || 1)
        .format("0.00", Math.floor);
    },
    isPreCreateOrder() {
      return this.rechargeType.companyType === "1";
    },
    receivingAddress() {
      return this.rechargeType.receivingAddress;
    },
    remark() {
      return this.rechargeType.remark;
    },
    showInputMoney() {
      return this.rechargeType.showInputMoney === "1";
    },
    showBourse() {
      return (
        this.rechargeType.fastCreateName || this.rechargeType.fastCreateName2
      );
    },
    useTutorialLink() {
      return this.rechargeType.useTutorialLink;
    },
    showHelpContent() {
      return this.showBourse || this.remark || this.useTutorialLink;
    },
    accountIcon() {
      return this.rechargeType.accountIcon;
    },
  },
  watch: {
    rechargeType: {
      immediate: true,
      deep: true,
      handler() {
        this.quickMoneyListHandler();
      },
    },
    inputAmount(value) {
      const amount = this.quickMoneyList[this.lastQuickMoneyIndex] || {};
      amount.selected = false;
      for (let i = 0; i < this.quickMoneyList.length; i++) {
        const amount = this.quickMoneyList[i] || {};
        if (Number(value) === Number(amount.money)) {
          this.onAmountClick(i);
          break;
        }
      }
    },
  },
  methods: {
    hasPermission,
    jump2Bourse(url) {
      window.open(url);
    },
    escapeHtml(str) {
      if (!str) return "";
      return util.escapeHtml(str);
    },
    onBackClick() {
      this.$emit("get-back-status");
    },
    onCopySuccess(el) {
      this.$Message.success(this.$tex("复制成功"));
    },
    onCopyError(el) {
      this.$Message.success(this.$tex("复制失败"));
    },
    onQRCodeSaveClick() {
      // const blob = dataURLtoBlob(this.accountImgUrl);
      saveAs(this.accountImgUrl, "pay-address.png");
    },
    onQRCodeCallBack(dataUrl) {
      this.qrCodeDataUrl = dataUrl;
    },
    onRechargeUsernameInput() {
      const value = this.rechargeUsername
        .match(/([\u4e00-\u9fa5\w]*)/gi)
        .join("");
      this.$nextTick(() => {
        this.rechargeUsername = value;
      });
    },
    quickMoneyListHandler() {
      if (!this.rechargeType.quickMoney) {
        this.quickMoneyList = [];
      } else {
        this.quickMoneyList = this.rechargeType.quickMoney
          .split(",")
          .map((money) => {
            return {
              money,
              selected: false,
            };
          });
      }
    },
    onAmountClick(index) {
      if (this.lastQuickMoneyIndex !== index) {
        const lastAmount = this.quickMoneyList[this.lastQuickMoneyIndex] || {};
        lastAmount.selected = false;
      }
      const amount = this.quickMoneyList[index] || {};
      amount.selected = !amount.selected;
      if (!amount.selected) {
        this.inputAmount = "";
      } else {
        this.inputAmount = amount.money;
      }
      this.lastQuickMoneyIndex = index;
    },
    verifyOrder() {
      if (
        this.conversionAmount >= this.rechargeType.incomeAmountMin &&
        this.conversionAmount <= this.rechargeType.incomeAmountMax
      ) {
        return "";
      }
      return this.$tex("充值金额范围在{min}{unit}到{max}{unit}之间", {
        min: this.rechargeType.incomeAmountMin,
        max: this.rechargeType.incomeAmountMax,
        unit: "元",
      });
    },
    verifyDepositorAddress() {
      if (!this.rechargeUsername) {
        return this.$tex("存款人地址不能为空");
      }
      return "";
    },
    // 支付携带小数
    paymentAmount() {
      // this.inputAmount = Math.floor(this.inputAmount);
      const amountAisle = this.getAmountAisle();
      if (amountAisle != 1) return;
      let randomNum = Math.random().toFixed(3);
      if (randomNum.length < 4) {
        randomNum += "0".repeat(4 - randomNum.length);
      }
      this.inputAmount =
        parseInt(this.inputAmount) +
        parseFloat(randomNum)
          .toFixed(3)
          .substring(1);
    },
    onPreCreateOrderClick() {
      const errMsg = this.verifyOrder();
      if (errMsg) {
        return this.$Message.error(errMsg);
      }
      if (this.$_orderSubmitFlag) {
        return;
      }
      this.paymentAmount();
      this.$_orderSubmitFlag = true;
      this.$emit("show-spin");
      this.$http
        .post(
          "/api/v2/user/recharge",
          {
            totalFee: this.conversionAmount,
            rechargeType: this.rechargeType.onOrOff,
            companyAccountId: this.rechargeType.companyAccountId,
            currencyNum: this.currencyNum,
          },
          {
            userId: true,
            timeoutDialog: true,
            timeout: 30 * 1000,
          }
        )
        .then((response) => {
          this.$_orderSubmitFlag = false;
          this.$emit("hide-spin");
          if (response.data.code !== 0) return;
          if (response.data.data.type === "11") {
            this.$emit(
              "get-back-status",
              response.data,
              response.data.data.type
            );
          } else {
            this.jump2Recharge();
          }
        })
        .catch(() => {
          this.inputAmount = Math.floor(this.inputAmount);
          this.$_orderSubmitFlag = false;
          this.$emit("hide-spin");
        });
    },
    onNextClick() {
      if (this.inputAmount == "") {
        this.inputAmount = "";
        return;
      }
      this.paymentAmount();
      const errMsg = this.verifyOrder();
      if (errMsg) {
        return this.$Message.error(errMsg);
      }
      // if() {}
      this.jump2Recharge();
    },
    onOrderSubmitClick() {
      const errMsg = this.verifyDepositorAddress();
      if (errMsg) {
        return this.$Message.error(errMsg);
      }
      if (this.$_orderSubmitFlag) {
        return;
      }
      this.$_orderSubmitFlag = true;
      this.$emit("show-spin");
      this.$http
        .post(
          "/api/v2/user/recharge",
          {
            totalFee: this.conversionAmount,
            rechargeType: this.rechargeType.onOrOff,
            companyAccountId: this.rechargeType.companyAccountId,
            rechargeUsername: this.rechargeUsername,
            currencyNum: this.currencyNum,
          },
          {
            userId: true,
            timeoutDialog: true,
            timeout: 30 * 1000,
          }
        )
        .then((response) => {
          this.$_orderSubmitFlag = false;
          this.$emit("hide-spin");
          if (response.data.code !== 0) return;
          this.$router.push("/personalCenter/trade");
        })
        .catch(() => {
          this.$_orderSubmitFlag = false;
          this.$emit("hide-spin");
        });
    },
    jump2Order() {
      this.step = this.Steps.kOrder;
    },
    jump2Recharge() {
      this.step = this.Steps.kRecharge;
    },
    // 商户标识
    async businessNber() {
      const { PLATFORM_FLAG } = await this.$store.dispatch("querySystemConfig");
      this.businesses = PLATFORM_FLAG;
    },
  },
  created() {
    this.businessNber();
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.currency-order {
  font-size: 14px;
  color: #333333;
  @{deep} .ivu-form-item-label,
  @{deep} .ivu-select-selected-value,
  @{deep} .ivu-select-item,
  @{deep} .ivu-form-item-content {
    font-size: 14px !important;
  }
  .ivu-select {
    width: 240px;
  }
}
.currency-order__text--middle {
  vertical-align: middle;
}
.currency-order__exchange {
  margin: 24px 0 16px;
}
.currency-order__conversion {
  margin: 14px 0 14px;
}
.currency-order-tool {
  display: flex;
  font-size: 12px;
  color: #333333;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
}
.currency-order__img {
  width: 30px;
  height: 30px;
  float: none;
}
.currency-order__symbol {
  margin: 0 16px;
}
.currency-order__input {
  flex: 1;
  color: #ff4646;
  font-size: 16px;
  width: 100%;
}
.currency-order-tab {
  margin: 0 -3px;
  font-size: 0;
}
.currency-order-tab__item {
  padding: 0 3px;
  display: inline-block;
  font-size: 12px;
  color: #848484;
  width: 20%;
  margin-bottom: 6px;
  float: left;
  cursor: pointer;
}
.currency-order-tab__item--active {
  .currency-order-tab__content {
    color: #ffffff;
  }
}
.currency-order-tab__content {
  background-color: #f6f6f6;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  border-radius: 4px;
  padding: 0 6px;
}
.currency-order-tab-wrap {
  width: 500px;
  margin-bottom: 16px;
}
.currency-order-dsc {
  color: #999999;
  font-size: 12px;
  margin: 10px 0 40px;
}
.currency-button {
  width: 110px;
  padding: 6px;
  text-align: center;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
}
.currency-order__button {
}
.currency-order__order-button,
.currency-order__next-button {
  margin-left: 20px;
}
.currency-recharge__box {
  margin-bottom: 26px;
}
.currency-recharge__title {
  margin-bottom: 14px;
}
.currency-button--size-m {
  width: 70px;
}
.currency-recharge-copy {
  display: flex;
  padding-bottom: 26px;
  border-bottom: 1px solid #f2f2f2;
}
.currency-recharge-copy__input {
  width: 520px;
  margin-right: 20px;
  word-break: break-word;

  @{deep} .ivu-input {
    height: 36px;
    font-size: 14px;
  }
}
.currency-recharge-copy__outline {
  border: 1px solid #dddee1;
  line-height: 36px;
  padding: 0 7px;
  border-radius: 4px;
  overflow: hidden;
}
.currency-recharge__remark {
  margin-top: 10px;
  color: #999999;
}
.currency-recharge-scan {
  // width: 100px;
  // height: 100px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #f2f2f2;
}
.currency-recharge__save {
  margin: 20px 0 0 16px;
}
.currency-container {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  font-size: 14px;
  width: 324px;
  border-bottom: 1px solid #f2f2f2;
  padding: 0 0 10px;
}
.currency-container__input {
  @{deep} input {
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    font-size: 14px;
    padding: 12px 10px;
  }
}
.currency-order__bg {
  height: 28px;
  border-radius: 6px;
  background-color: #f6f6f6;
  text-align: center;
  line-height: 28px;
  display: inline-block;
  color: #ff4646;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  word-break: keep-all;
  padding: 0 10px;
  vertical-align: middle;
}
.currency-content {
  width: 500px;
  margin-bottom: 10px;
}
.currency-content__title {
  font-size: 14px;
  margin-top: 30px;
}
.currency-content__bourse {
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
  .currency-content__bourse-item:nth-child(2n + 1) {
    margin-right: 14px;
  }
}
.currency-content__bourse-item {
  cursor: pointer;
  flex: 1;
  height: 40px;
  border-radius: 6px;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  img {
    width: 21px;
    height: 21px;
    float: none;
    margin-right: 8px;
  }
}
.currency-content__dsc {
  font-size: 12px;
  color: #999999;
}
.currency-content__help {
  font-size: 12px;
  color: #ff4646;
  text-align: center;
  text-decoration: underline;
}
</style>
