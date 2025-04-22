<template>
  <div class="step-two">
    <!-- <div class="pay-logo">
                温馨提示
                转账存款前请核实，以免误存。
                存款限额：单笔存款最低1元。
                存款到账时间：最快秒到，一般3-5分钟。若超过30分钟未到账，请联系24小时在线客服。
            </div> -->
    <div class="tips" v-if="!tkey && data.payTopTypeCode !== 'kmzf'">
      <div class="tipsa">
        <Icon type="android-bulb" size="30" color="#fec746"></Icon>
        <span class="warning tips1">{{ $tex("温馨提示") }}：</span>
      </div>
      <div class="tipsb">
        <ul class="warning tips2">
          <li>{{ $tex("转账存款前请核实，以免误存。") }}</li>
          <li>{{ $tex("充值时，部分支付渠道充值金额随机1位小数") }}</li>
          <li>
            {{
              $tex(
                "充值到账时间：最快秒到，一般3-5分钟。若超过30分钟未到账，请联系在线客服。"
              )
            }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 卡密支付 3.21-->
    <div class="tips" v-else-if="!tkey && data.payTopTypeCode === 'kmzf'">
      <div class="tipsa">
        <Icon type="android-bulb" size="30" color="#fec746"></Icon>
        <span class="warning tips1">{{ $tex("温馨提示") }}：</span>
      </div>
      <div class="tipsb">
        <p style="padding-top:10px">
          {{
            $tex(
              "卡密是一种充值预付卡，通过第三方平台轻松购买，简单易用，快捷方便。"
            )
          }}
          {{ $tex("依照以下3个简单的步即可存上") }}：
        </p>
        <ul class="warning tips2">
          <li>{{ $tex("从平台指定合作伙伴购买卡密。") }}</li>
          <li>{{ $tex("输入正确的卡密。") }}</li>
          <li>{{ $tex("卡密支付可以秒到账。") }}</li>
        </ul>
      </div>
    </div>
    <div class="tips" v-else>
      <div class="tipsa">
        <Icon type="android-bulb" size="30" color="#fec746"></Icon>
        <span class="warning tips1">{{ $tex("温馨提示") }}：</span>
      </div>
      <div class="tipsb">
        <ul class="warning tips2">
          <li>{{ $tex("金额范围{min}-{max}", { min: 1, max: 1000000 }) }}</li>
          <li>{{ $tex("充值时，部分支付渠道充值金额随机1位小数") }}</li>
          <li>
            {{
              $tex(
                "充值到账时间：最快秒到，一般3-5分钟。若超过30分钟未到账，请联系在线客服。"
              )
            }}
          </li>
        </ul>
      </div>
    </div>
    <div class="info" v-if="currentData">
      <!-- 包括银行卡等的支付 -->
      <div class="other-recharge">
        <!-- <ul v-if="data.payTopTypeCode !== 'kmzf'" class="recharge-list"> -->
        <ul class="recharge-list">
          <li
            v-for="(item, idx) in otherList"
            :key="idx"
            :class="{
              active: selectIndex === idx,
              bankLi: item.accountType === '0' && item.onOrOff === '01',
            }"
            @click="getIndex(item, idx)"
          >
            <div class="list-h">
              <img :src="item.channelIcon || item.accountIcon" alt="" />
              <p class="title">{{ item.channelName || item.bankName }}</p>
            </div>
            <div
              class="lee-describe"
              :class="{
                ' nice-scroll': item.accountType !== '0',
                overflow: item.accountType == '0',
              }"
            >
              <div
                class="bank"
                v-if="item.accountType === '0' && item.onOrOff === '01'"
              >
                <p>
                  {{ $tex("收款人") }}：
                  <br />
                  <span>
                    {{ item.accountName | elp }}
                  </span>
                  <span
                    class="copy-icon"
                    :class="{
                      dsb: selectIndex === idx,
                      dsn: selectIndex != idx,
                    }"
                    @click="copyWords(item.accountName)"
                  >
                    {{ $tex("复制") }}
                  </span>
                </p>
                <p>
                  {{ $tex("银行卡号") }}： <br />
                  {{ item.bankNo }}
                  <span
                    class="copy-icon"
                    :class="{
                      dsb: selectIndex === idx,
                      dsn: selectIndex != idx,
                    }"
                    @click="copyWords(item.bankNo)"
                  >
                    {{ $tex("复制") }}
                  </span>
                </p>
                <p>
                  {{ $tex("开户行") }}：
                  <br />
                  <span>
                    {{ item.openBankName | elp }}
                  </span>
                  <span
                    class="copy-icon"
                    :class="{
                      dsb: selectIndex === idx,
                      dsn: selectIndex != idx,
                    }"
                    @click="copyWords(item.openBankName)"
                  >
                    {{ $tex("复制") }}
                  </span>
                </p>
              </div>
              <div
                v-else
                v-html="escapeHtml(item.remark || item.channelDescribe)"
              ></div>
            </div>

            <div class="right" v-show="selectIndex === idx">
              <Icon
                type="ios-checkmark-empty"
                size="24"
                color="white"
                class="iconright"
              ></Icon>
            </div>
          </li>
        </ul>
        <!--卡密支付 -->
        <!-- <dl v-else class="ipt-km-wrapper">
          <dt>{{ $tex("粘贴卡密") }}</dt>
          <dd>
            <Input
              v-model="kmNumber"
              type="textarea"
              :placeholder="$tex('请粘贴卡密')"
            ></Input>
          </dd>
        </dl> -->
        <div class="clr"></div>
      </div>
      <div class="lee-online-bank" v-if="flagForOnlineBank">
        <div class="lee-online-bank-top">
          <p>
            {{ $tex("选择银行") }}
            <i class="lee-online-bank-bottom"></i>
          </p>
        </div>
        <ul>
          <li
            v-for="(itm, idx) in onLineBankList"
            :key="itm.itemKey"
            :class="{ 'lee-bankList-itm': idx == bankListIndex }"
            @click="bankChoice(idx, itm.itemKey)"
          >
            <img v-if="itm.remark" :src="itm.remark" />
            <div class="after-bank-bottom" v-show="bankListIndex == idx">
              <Icon
                type="ios-checkmark-empty"
                size="18"
                color="white"
                class="iconright"
              ></Icon>
            </div>
          </li>
        </ul>
      </div>
      <template v-if="isCompanyDIGICCY">
        <digital-currency
          :pay-top-type="data"
          :recharge-type-index="selectIndex"
          @show-spin="showSpin"
          @hide-spin="hideSpin"
          @get-back-status="getBackStatus"
        ></digital-currency>
      </template>
      <template v-else>
        <!-- 输入充值金额 -->
        <div class="list-detail">
          <!-- <div class="qr" v-if="currentData.accountImgUrl">
                                <div>
                                    <img :src="currentData.accountImgUrl" alt="">
                                    <div class="clr"></div>
                                </div>
                                <p>打开相关APP扫描二维码<br/>输入充值金额,扫码完成支付</p>
                            </div> -->
          <!-- <div v-if="data.payTopTypeCode !== 'kmzf'" class="input-info"> -->
          <div v-if="showWallet" class="wallet">
            <div v-if="walletInfo && walletInfo.isBind === 1">
              <p style="margin: 3px">
                钱包地址: {{ walletInfo.walletAddress }}
              </p>
              <p style="margin: 3px">钱包余额:{{ walletInfo.walletBalance }}</p>
              <button
                style="margin: 3px"
                class="wallet-bind"
                @click="walletBindOrUnbind(0)"
              >
                进入钱包
              </button>
              <button
                v-show="walletInfo.supportUnbind"
                style="margin: 3px"
                class="wallet-bind"
                @click="walletBindOrUnbind(1)"
              >
                解绑钱包
              </button>
            </div>
            <div v-else="walletInfo && walletInfo.isBind !== 1">
              <button class="wallet-bind" @click="walletBindOrUnbind(0)">
                立即绑定
              </button>
            </div>
          </div>
          <div class="input-info">
            <div v-if="currentData.showInputMoney === '1'" class="info-list">
              <span>{{ $tex("充值金额") }}&nbsp;</span>
              <div
                class="ivu-input-wrapper ivu-input-type"
                :class="{
                  unit: hasPermission('element.currencyExchange'),
                }"
                style="width:180px;"
              >
                <input
                  class="ivu-input"
                  type="number"
                  v-model="money"
                  :min="inputFeeMin"
                  :max="inputFeeMax"
                  :placeholder="$tex('请输入充值金额')"
                  @input="handlerIptMoney($event)"
                  @blur="blurIpt($event)"
                />
                <span
                  v-if="hasPermission('element.currencyExchange')"
                  class="input-suffix"
                  >{{ localApiCoin.icon }}</span
                >
              </div>
              <!-- <Input type="number" v-model="money" :min="minMoney" :max="maxMoney"></Input> -->
              <!-- <InputNumber v-model="money" :min="1"></InputNumber> -->
              <div v-if="showCurrencyExchange" class="currency-exchange">
                <img src="~@/assets/images-v6/jinggao.png" alt="" />
                {{ money }}{{ localApiCoin.scur }}={{ sysExChangeMoney
                }}{{ sysExchangeInfo.tcur }}
              </div>
            </div>
            <div
              class="info-list"
              v-if="
                (currentData.onOrOff === '01' &&
                  currentData.companyType === '1' &&
                  currentData.accountType !== '0') ||
                  (data.payTopTypeCode === 'yhkzz' &&
                    currentData.onOrOff === '00')
              "
            >
              <span>{{ $tex("存款人信息") }}&nbsp;</span>
              <div
                class="ivu-input-wrapper ivu-input-type"
                style="width:180px;"
              >
                <input
                  class="ivu-input"
                  type="text"
                  v-model="name"
                  @input="nameChange"
                  :placeholder="
                    `请填写${
                      handicap.includes(this.$store.getters.sysPlatformFlag)
                        ? '存款人姓名'
                        : '真实姓名、微信、支付宝用户名'
                    }`
                  "
                />
              </div>
            </div>
            <!-- 快捷选金额 -->
            <div class="info-list quick-select-money">
              <ul class="list">
                <li
                  v-for="moneyAccount of quickMoneyList"
                  :key="moneyAccount"
                  :class="{ active: moneyAccount === currQuickMoney }"
                  @click="clickQuickMoneyTab(moneyAccount)"
                >
                  {{ moneyAccount }}
                </li>
              </ul>
            </div>
            <!-- 至少包含银行卡支付 -->
            <div
              v-if="
                currentData.onOrOff === '01' && currentData.accountType === '0'
              "
            >
              <div class="info-list">
                <span>{{ $tex("充值时间") }}&nbsp;</span>
                <!-- <Input type="text" v-model="rechargeDate" readonly></Input> -->
                <DatePicker
                  type="datetime"
                  v-model="rechargeDate"
                  format="MM-dd HH:mm:ss"
                  :editable="false"
                ></DatePicker>
              </div>
              <div class="info-list">
                <span>{{ $tex("充值类型") }}&nbsp;</span>
                <Select v-model="selectValue">
                  <Option
                    v-for="item in selectList"
                    :value="item.itemValue"
                    :key="item.itemValue"
                    >{{ item.itemKey }}
                  </Option>
                </Select>
              </div>
              <div class="info-list">
                <span>{{ $tex("存款人信息") }}&nbsp;</span>
                <div class="ivu-input-number">
                  <div class="ivu-input-number-input-wrap">
                    <input
                      class="ivu-input-number-input"
                      type="text"
                      :placeholder="
                        `请填写${
                          handicap.includes(this.$store.getters.sysPlatformFlag)
                            ? '存款人姓名'
                            : '真实姓名、微信、支付宝用户名'
                        }`
                      "
                      v-model="name"
                      @input="nameChange"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="yhk-button">
              <Button class="buttonback" size="large" @click="enteryhkback()"
                >{{ $tex("返回") }}
              </Button>
              <Button
                type="error"
                :disabled="
                  (flagForOnlineBank && bankListIndex == -1) ||
                    (payTypeCode === '93' && walletInfo.isBind !== 1)
                "
                class="buttonnext"
                size="large"
                @click="enteryhkNext()"
                >{{ $tex("确认") }}
              </Button>
            </div>
          </div>
          <!-- <div v-else class="input-info kmzf">
            <div class="yhk-button">
              <Button
                class="buttonback"
                size="large"
                type="primary"
                @click="enteryhkback()"
                >{{ $tex("返回") }}
              </Button>
              <Button
                type="error"
                :disabled="!isCanSubmitKm"
                class="buttonnext"
                @click="enteryhkNext()"
                >{{ $tex("确认充值") }}
              </Button>
            </div>
          </div> -->
          <div class="clr"></div>
        </div>
        <!-- 卡密支付 -->
        <div v-if="data.payTopTypeCode === 'kmzf'" class="kmzf-ways">
          <ul class="header">
            <li>{{ $tex("获取卡密") }}</li>
          </ul>
          <div class="other-recharge">
            <ul class="recharge-list">
              <li
                v-for="(item, idx) in otherList"
                :key="idx"
                :class="{
                  active: selectIndex === idx,
                  bankLi: item.accountType === '0' && item.onOrOff === '01',
                }"
                @click="getIndex(item, idx)"
              >
                <div class="list-h">
                  <img :src="item.channelIcon || item.accountIcon" alt="" />
                  <p class="title">{{ item.channelName || item.bankName }}</p>
                </div>
                <div
                  class="lee-describe"
                  :class="{
                    ' nice-scroll': item.accountType !== '0',
                    overflow: item.accountType == '0',
                  }"
                >
                  <div
                    v-html="escapeHtml(item.remark || item.channelDescribe)"
                  ></div>
                </div>
                <div class="right" v-show="selectIndex === idx">
                  <Icon
                    type="ios-checkmark-empty"
                    size="24"
                    color="white"
                    class="iconright"
                  ></Icon>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
    <div v-else class="no-data">
      {{ $tex("暂无开放接口，请选择其他支付方式") }}
      <div class="yhk-button">
        <Button
          type="primary"
          class="buttonback"
          size="large"
          @click="enteryhkback()"
          >{{ $tex("返回") }}
        </Button>
      </div>
    </div>
    <phone-bind-dialog
      v-model="showBindFirstDialog"
      type="2"
      title="绑定钱包"
      :channelId="channelId"
      @success="onPhoneFirstSuccess"
      @cancel="onPhoneFirstCancel"
    ></phone-bind-dialog>
  </div>
</template>

<script>
import util from "@/utils/utils";
import DigitalCurrency from "./components/DigitalCurrency";
import { hasPermission } from "@/utils/authority-utils";
import { convert2ServerDateTime } from "@/filters";
import { mapGetters } from "vuex";
import numeral from "numeral";
import { getWalletInfo, unbindWallet } from "@/api/user";
import PhoneBindDialog from "@/components/PhoneBindDialog";

export default {
  components: {
    DigitalCurrency,
    PhoneBindDialog,
  },
  props: {
    tkey: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    localApiCoin: {
      type: Object,
    },
    // showWallet: {
    //   type: Boolean,
    // },
    // walletInfo: {
    //   type: Object,
    // },
    // channelId: {
    //   type: String,
    // },
    // payTypeCode: {
    //   type: String,
    // },
  },
  data() {
    return {
      // bankOffLine: true,
      otherList: [],
      money: null,
      maxMoney: 100,
      minMoney: 1,
      name: "",
      rechargeDate: new Date(), //formatDate.getFormatDate(new Date().getTime()),
      selectList: [],
      selectValue: "",
      selectIndex: 0,
      currentData: {},
      flagForOnlineBank: false, //网银支付
      onLineBankList: [], //线上支付银行列表
      bankListIndex: -1,
      bankId: 0,
      hasMoreClick: false,
      kmNumber: "", //卡密
      currQuickMoney: 0, //选择的快捷金额
      showWallet: false, // 显示钱包
      walletInfo: {}, // 钱包信息
      channelId: "", // 通道Id
      payTypeCode: "",
      showBindFirstDialog: false,
      handicap: ["by317", "by321"], // 存款人姓名必填的盘口
    };
  },
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
    isCompanyDIGICCY() {
      return (
        this.currentData.accountType === "7" &&
        this.currentData.onOrOff === "01"
      );
    },
    isCanSubmitKm() {
      return /^[a-zA-Z\d]{64,64}$/.test(this.kmNumber);
    },
    //快捷金额列表
    quickMoneyList() {
      let quickMoney = this.currentData.quickMoney;
      if (!quickMoney) return [];
      return quickMoney.split(",");
    },
    showCurrencyExchange() {
      return (
        hasPermission("element.currencyExchange") &&
        this.money &&
        this.localApiCoin.scur &&
        this.sysExchangeInfo.tcur
      );
    },
    sysExChangeMoney() {
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      const money = this.money || 0;
      return numeral(money)
        .multiply(exchangeRate)
        .format("0.00", Math.floor);
    },
    inputFeeMin() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.currentData.incomeAmountMin);
      }
      return Math.ceil(this.currentData.incomeAmountMin * 100) / 100;
    },
    inputFeeMax() {
      if (hasPermission("element.currencyExchange")) {
        return Math.floor(this.currentData.incomeAmountMax);
      }
      return Math.floor(this.currentData.incomeAmountMax * 100) / 100;
    },
  },
  watch: {
    // flagForOnlineBank (newVal) {
    //     this.setOnLineList(newVal);
    // }
  },
  filters: {
    elp: function(val) {
      if (!val) return "";
      let length = val.length;
      if (length > 34) {
        return val.substring(0, 33) + "...";
      } else {
        return val;
      }
    },
  },
  methods: {
    hasPermission,
    convert2UserExChange(money) {
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      money = money || 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00");
    },
    getBackStatus(result, type) {
      if (typeof result === "number") {
        this.$emit("get-back-status", 0);
      } else {
        this.$emit("get-back-status", result, type);
      }
    },
    showSpin() {
      this.$emit("show-spin");
    },
    hideSpin() {
      this.$emit("hide-spin");
    },
    /**
     * 点击快捷金额
     */
    clickQuickMoneyTab(item) {
      if (this.currQuickMoney === item) return;
      this.currQuickMoney = item;
      this.money = +item;
    },
    /**
     * 充值金额输入框失焦
     */
    blurIpt(event) {
      let val = event.target.value;
      if (val < this.inputFeeMin) {
        this.money = this.inputFeeMin;
      }
    },
    /**
     * 按下充值金额输入框
     */
    handlerIptMoney(event) {
      let val = event.target.value;
      this.currQuickMoney = 0;
      if (isNaN(val) || val.startsWith("0")) {
        this.money = this.inputFeeMin;
      } else if (val > this.inputFeeMax) {
        this.money = this.inputFeeMax;
      } else if (val.includes(".") && val.length > val.indexOf(".") + 2) {
        this.money = +val.slice(0, val.indexOf(".") + 3);
      }
    },
    copyWords(text) {
      //复制文本
      let copyInput = document.createElement("input");
      copyInput.value = text;
      document.body.appendChild(copyInput);
      copyInput.select(); //选择对象
      document.execCommand("copy");
      document.body.removeChild(copyInput);
      this.$Message.success(this.$tex("复制成功"));
    },
    enteryhkNext() {
      // let isKmzf = this.data.payTopTypeCode === "kmzf" ? true : false;

      // 支付通道为93 但未绑定第三方
      if (this.payTypeCode === "93" && this.walletInfo.isBind !== 1) return;
      let isKmzf = false;

      if (this.hasMoreClick) {
        //阻止连续点击
        return;
      }
      this.hasMoreClick = true;
      let params = {
        //卡密支付为0
        totalFee: isKmzf ? 0 : this.money,
      };
      if (isKmzf && !this.isCanSubmitKm) {
        // 卡密支付验证码校验
        return;
      }
      if (
        (!isKmzf && this.money > this.inputFeeMax) ||
        this.money < this.inputFeeMin
      ) {
        //卡密充值不判断
        this.$Message.error(
          this.$tex("金额范围{min}-{max}", {
            min: this.inputFeeMin,
            max: this.inputFeeMax,
          })
        );
        this.hasMoreClick = false;
        return;
      }

      if (
        this.currentData.onOrOff == "01" &&
        this.currentData.companyType == 0 &&
        this.currentData.accountType !== "0"
      ) {
        // 不生成订单号
        this.$emit("get-back-status", {
          currentData: this.currentData,
          money: this.money,
        });
        this.hasMoreClick = false;
        return;
      }
      if (
        this.currentData.accountType === "0" &&
        this.currentData.onOrOff === "01"
      ) {
        // 银行卡&线下
        if (!this.name) {
          this.$Message.error(
            `请填写存款人${
              this.handicap.includes(this.$store.getters.sysPlatformFlag)
                ? "姓名"
                : "信息"
            }`
          );
          this.hasMoreClick = false;
          return;
        }
        params.rechargeUsername = this.name;
        params.rechargeTime = convert2ServerDateTime(
          new Date(this.rechargeDate).getTime()
        );
        params.rechargeUserType = this.selectValue;
        params.companyAccountId = this.currentData.companyAccountId;
        params.rechargeType = this.currentData.onOrOff;
        params.rechargeTime = params.rechargeTime.slice(5); // add by xiaojiji 2019.10.1
        this.currentData.rechargeTime = params.rechargeTime;
        this.currentData.rechargeUserType = this.selectList.filter(
          (item) => item.itemValue === this.selectValue
        )[0].itemKey;
      } else if (this.currentData.onOrOff === "01") {
        // 非银行卡&线下
        if (this.currentData.companyType === "1") {
          if (!this.name) {
            this.$Message.error(this.$tex("请填写存款人信息"));
            this.hasMoreClick = false;
            return;
          }
        }
        params.companyAccountId = this.currentData.companyAccountId;
        params.rechargeType = this.currentData.onOrOff;
      } else {
        params.channelId = this.currentData.channelId; //
        params.rechargeType = this.currentData.onOrOff; //
      }
      var newWindow = null;
      if (this.flagForOnlineBank) {
        params.bankCode = this.bankId;
        var newWindow = window.open();
      }
      if (isKmzf) {
        //卡密支付则为卡密
        params.bankCode = this.kmNumber;
      }
      if (this.walletInfo && this.walletInfo.isBind === 1) {
        params.token = this.walletInfo.token;
      }
      // 银行卡充值 && 线上
      if (
        this.data.payTopTypeCode === "yhkzz" &&
        this.currentData.onOrOff === "00"
      ) {
        if (
          !this.name &&
          this.handicap.includes(this.$store.getters.sysPlatformFlag)
        ) {
          this.$Message.error(this.$tex("请填写存款人姓名"));
          this.hasMoreClick = false;
          return;
        }
        params.rechargeUsername = this.name;
      }

      this.showSpin();
      this.$http
        .post("/api/v2/user/recharge", params, {
          userId: true,
          timeoutDialog: true,
          timeout: 30 * 1000,
          headers: {
            scur: this.localApiCoin.scur,
          },
        })
        .then((response) => {
          this.$emit("hide-spin");
          this.hasMoreClick = false;
          if (response.data.code !== 0) return;
          if (isKmzf) {
            this.$Modal.confirm({
              title: this.$tex("提示"),
              content: `<p>${this.$tex("已支付成功，点击确认返回!")}</p>`,
              onOk: () => {
                this.enteryhkback();
              },
            });
            return;
          }
          const { orderMoney, type, content } = response.data.data;
          response.data.currentData = this.currentData;
          if (type === "93") {
            this.$Message.success(content);
            this.getWalletInfo(this.channelId);
            return;
          }
          if (
            orderMoney &&
            orderMoney != this.money &&
            this.currentData.onOrOff === "01"
          ) {
            //线下
            response.data.money = orderMoney;
          } else {
            response.data.money = this.money;
          }

          if (isKmzf) {
            this.$Modal.confirm({
              title: this.$tex("提示"),
              content: `<p>${this.$tex("已支付成功，点击确认返回!")}</p>`,
              onOk: () => {
                this.enteryhkback();
              },
            });
            return;
          }
          // 如果是线下手动修改类型
          if (this.currentData.onOrOff === "01") {
            response.data.data.type = "1";
            response.data.data.content = this.currentData.accountImgUrl;
          }
          if (this.flagForOnlineBank) {
            if (
              response.data.data.type === "2" ||
              response.data.data.type === "5"
            ) {
              newWindow.location.href = response.data.data.content;
            } else if (
              response.data.data.type === "3" ||
              response.data.data.type === "6"
            ) {
              newWindow.document.write(response.data.data.content);
            }
            this.$emit("get-back-status", response.data, "01");
          } else {
            this.$emit(
              "get-back-status",
              response.data,
              response.data.data.type
            );
          }
        })
        .catch(() => {
          this.$emit("hide-spin");
          this.hasMoreClick = false;
        });
    },
    onPhoneFirstSuccess(channelId) {
      this.showBindFirstDialog = false;
      this.getWalletInfo(channelId);
    },
    onPhoneFirstCancel() {
      this.$emit("jump-base-info");
    },
    escapeHtml(str) {
      if (!str) return "";
      return util.escapeHtml(str);
    },
    nameChange() {
      let value = null;
      if (hasPermission("validator.chinese")) {
        value = this.name.match(/([\u4e00-\u9fa5\w]*)/gi).join("");
      } else {
        value = (
          this.name.match(
            /[^.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/gi
          ) || []
        ).join("");
      }
      this.name = value;
    },
    enteryhkback() {
      let num = 0;
      // if (this.data.payTopTypeCode === "kmzf") {
      //   this.kmNumber = 0;
      //   this.selectIndex = -1;
      // }
      // if (this.bankOffLine) num = 1;
      this.$emit("get-back-status", num);
    },
    getIndex(item, idx) {
      this.selectIndex = idx;
      this.currentData = item;
      this.setMoney();
      this.confirmOnlinkBank();
      this.payTypeCode = item.payTypeCode;
      this.showWallet = false;
      if (item.payTypeCode == "93") {
        this.getWalletInfo(item.channelId);
      }
    },
    getSelect() {
      this.$http
        .post(
          "/api/v2/sysDict/queryItemList",
          {
            dictName: "RECHARGE_USER_TYPE",
          },
          {
            headers: {
              scur: this.localApiCoin.scur,
            },
          }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          this.selectList = response.data.data.itemList;
          this.selectValue = this.selectList[0].itemValue;
        });
    },
    setMoney() {
      // this.money = this.inputFeeMin
      this.maxMoney = parseInt(this.currentData.inputFeeMax);
      this.minMoney = parseInt(this.currentData.inputFeeMin);
      this.currQuickMoney = 0;
    },
    confirmOnlinkBank() {
      let item = this.data.onAndOffList[this.selectIndex];
      if (item.payTypeCode == "01") {
        this.flagForOnlineBank = true;
      } else {
        //非网银
        this.flagForOnlineBank = false;
      }
      this.setOnLineList(this.flagForOnlineBank);
      // if (this.data.payTopTypeCode === "kmzf") {
      //   //卡密支付
      //   window.open(item.rechargeCardLink, "_blank");
      // }
    },
    // 获取钱包信息接口 payTypeCode == 93时调用
    async getWalletInfo(channelId) {
      const res = await getWalletInfo({ channelId: channelId }, {});
      // res.data.msgCode 需要获取验证码
      if (res.data.code !== 0) return;
      this.channelId = channelId;
      if (res.data.data.msgCode) {
        this.showBindFirstDialog = true;
      } else {
        this.walletInfo = res.data.data;
        this.showWallet = true;
      }
    },
    async walletBindOrUnbind(id) {
      // location.href = this.walletUrl;
      if (id) {
        // 解绑内嵌钱包
        const res = await unbindWallet({ channelId: this.channelId });
        if (res.data.code != 0) return;
        this.$Message.success(res.data.data.msg);
        this.getIndex(this.otherList[0], 0);
      } else {
        // 绑定钱包
        window.open(this.walletInfo.walletUrl);
      }
    },
    setOnLineList(bool) {
      if (bool) {
        let data = JSON.parse(
          JSON.stringify(this.data.onAndOffList[this.selectIndex].bankList)
        );
        this.onLineBankList = data;
      } else {
        //非网银
        this.onLineBankList = [];
        this.bankListIndex = -1;
      }
    },
    bankChoice(idx, id) {
      this.bankListIndex = idx;
      this.bankId = id;
    },
  },

  created() {
    // 过滤线下银行卡
    // localStorage.removeItem('another')
    let bankOffLine = this.data.onAndOffList.some((item) => {
      return item.accountType === "0" && item.onOrOff === "01";
    });
    if (bankOffLine) {
      this.getSelect();
    }
    // if (this.data.payTopTypeCode === "kmzf") {
    //   //卡密支付默认不选中
    //   this.selectIndex = -1;
    // }
    this.otherList = this.data.onAndOffList;
    console.log("otherList", this.otherList);
    this.currentData = this.otherList[0];
    if (this.currentData) {
      this.setMoney();
    }
    //判断是否为网银支付
    if (this.data.onAndOffList[0].payTypeCode == "01") {
      this.flagForOnlineBank = true;
      this.setOnLineList(true);
    }

    this.channelId = this.otherList[0].channelId;
    this.payTypeCode = this.otherList[0].payTypeCode;
    this.showWallet = false;
    if (this.payTypeCode === "93") {
      this.getWalletInfo(this.channelId);
    }
    // 判断类型
    // accountType 类型 0:表示银行,1:QQ,2:支付宝,3:微信,4:京东,5:百度,6:银联
    // 判断线上线下
    // onoroff
    // 00 线上
    // 01 线下
    // 参数
    // totalFee	String	true	    充值金额（元）
    // rechargeType	String	true	充值类型（00：线上，01:线下）
    // rechargeUsername	String	false	线下必传，充值人姓名
    // rechargeTime	String	false	线下必传，充值时间
    // rechargeUserType	String	false	充值方式
    // companyAccountId	String	false	线下充值账户ID  接口自带

    // 线上
    // totalFee	String	true	    充值金额（元）
    // channelId	String	false	     线上充值类型（见后台配置） 接口自带  channelId
    // rechargeType	String	true	充值类型（00：线上，01:线下）
  },
};
</script>
<style lang="less">
.lee-elp {
  position: absolute;
  right: 10px;
  bottom: 5px;
}

.step-two .tips {
  margin-bottom: 20px;
}

.step-two .tipsa {
  height: 30px;
  font-size: 0;
  overflow: hidden;
}

.step-two .tips1 {
  display: inline-block;
  height: 30px;
  vertical-align: top;
  padding: 6px 0;
  margin-left: 14px;
  font-size: 14px;
  /*   color: @primary-color; */
}

.step-two .tips2 {
  padding-top: 10px;
}

.step-two .tips2 li {
  line-height: 20px;
  background: url("/static/images/warn-square.png") no-repeat left center;
  font-size: 12px;
  padding-left: 10px;
  /* color: #be1204; */
}

.step-two .tips {
  padding: 10px 23px;
  border: 1px solid #d5d5d5;
}

.step-two .other-recharge .recharge-list {
  max-height: 390px;
  margin-left: -10px;
  // overflow: hidden;
  overflow: auto;
}

.step-two .other-recharge .recharge-list li {
  width: 175px;
  min-height: 70px;
  height: 93px;
  overflow: hidden;
  border: 1px dashed #eee;
  float: left;
  position: relative;
  margin-bottom: 16px;
  margin-left: 10px;
  flex-wrap: wrap;
  overflow: hidden;
  cursor: pointer;
}

.step-two .other-recharge .recharge-list .list-h {
  width: 100%;
  height: 43px;
  border-bottom: 1px dashed #ccc;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.step-two .other-recharge .recharge-list li .list-h img {
  width: 30px;
  max-height: 30px;
}

.step-two .other-recharge .recharge-list li .list-h .title {
  width: 115px;
  height: 100%;
  font-size: 18px;
  line-height: 42px;
  margin-left: 8px;
}

.step-two .other-recharge .recharge-list .describe {
  font-size: 12px;
  padding: 5px 10px;
  height: 46px;
  width: 100%;
}

.step-two .other-recharge .recharge-list .describe > div {
  text-overflow: ellipsis;
  overflow: hidden;
  height: 100%;
}

.step-two .other-recharge .recharge-list .describe > div img {
  width: auto;
  float: none;
}

/* 银行卡 */
.step-two .other-recharge .recharge-list li.bankLi {
  // width: 236px;
  height: 217px;
}

.step-two .other-recharge .recharge-list li.bankLi .describe {
  background: #f6f6f6;
  height: 150px;
  line-height: 20px;
}

.step-two .other-recharge .recharge-list li.bankLi .describe .bank span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-two .other-recharge li.active {
  /*   border: 1px solid #be1204; */
}

.step-two .other-recharge li .right {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 0;
  /*  border-bottom: 20px solid #be1204; */
  border-left: 20px solid transparent;
  text-align: center;
}

.step-two .other-recharge li .right i {
  width: 10px;
  height: 10px;
  position: absolute;
  right: 7px;
  font-size: 20px;
  color: #fff;
  left: -11px;
  top: 1px;
}

.step-two .list-detail {
  margin-top: 16px;
}

.step-two .list-detail .qr {
  float: right;
  width: 365px;
  border-left: 1px solid #ccc;
  padding: 20px 0;
  text-align: center;
}

.step-two .list-detail .qr img {
  max-width: 160px;
  width: auto;
  float: none;
}

.step-two .list-detail .wallet-bind {
  width: 150px;
  height: 30px;
  color: blue;
  border: 1px solid blue;
  border-radius: 3px;
  cursor: pointer;
}
.step-two .list-detail .qr > p {
  margin-top: 20px;
  text-align: left;
  height: 40px;
  padding-left: 40px;
  margin-left: 90px;
  background: url("/static/images/shaomiao.png") no-repeat;
  font-size: 14px;
  line-height: 16px;
}

.step-two .list-detail .input-info {
  float: left;
  width: 365px;
  padding: 20px 0;

  &.kmzf {
    padding: 6px 0 30px 0;

    .yhk-button {
      display: flex;
      margin: 0;
    }

    .ivu-btn-error {
      &:disabled {
        background-color: #a9a9a9;
        color: #fff;
      }
    }

    // button {
    //   &:last-child {
    //     background-color: #a9a9a9;
    //     border-color: #a9a9a9;
    //     &:hover {
    //       opacity: 0.8;
    //     }
    //   }
    // }
  }
}

.step-two .list-detail .info-list {
  margin-bottom: 16px;

  &.quick-select-money {
    ul {
      width: 296px;
      max-height: 186px;
      overflow: auto;
      margin-left: -5px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    li {
      width: 64px;
      height: 26px;
      margin-left: 5px;
      margin-bottom: 5px;
      line-height: 26px;
      text-align: center;
      background-color: rgb(246, 246, 246);
      border-radius: 4px;
      color: rgb(127, 127, 127);
      cursor: pointer;

      &.active {
        color: #fff;
      }
    }
  }
}

.step-two .list-detail .info-list > span {
  width: 90px;
  display: inline-block;
}

.step-two .list-detail .info-list .ivu-input-number,
.step-two .list-detail .info-list .ivu-input-wrapper,
.step-two .list-detail .info-list .ivu-select {
  width: 172px;
}

/*.step-two .other-recharge{
            margin-bottom: 20px;
        }
        .step-two .other-recharge .qr{
            width: 49%;
            float: right;
            display: flex;
            align-content: center;
            justify-content: center;
            flex-wrap: wrap;
            padding-top: 15px;
            border-left: 1px solid #eee;
        }
        .step-two .other-recharge .qr p{
            width: 200px;
            text-align: center;
            font-size: 16px;
            color: #be1204;
        }
        .step-two .other-recharge .qr img{
            width: 200px;
            height: 200px;
            padding: 10px;
            border: 1px solid #eee;
        }*/
/* .step-two .other-recharge .input-info{
            float: left;
            width: 50%;
            padding: 20px 0;
        }  */

.step-two .yhk-button {
  display: flex;
  margin-top: 30px;
  margin-left: 60px;
}

.step-two .yhk-button button {
  margin-right: 12px;
  height: 30px;
  line-height: 18px;
  // width: 76px;
}

.step-two .no-data {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
</style>

<style lang="less">
/*  Lee cover  */
.lee-describe {
  .bank p:nth-child(2) {
    height: 45px;
  }

  .bank p {
    height: 65px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    padding: 5px 10px;
    position: relative;

    .copy-icon {
      position: absolute;
      top: 4px;
      right: 5px;
      color: #989899;
      border: 1px solid #989899;
      padding: 0px 4px;
      border-radius: 4px;
    }

    .copy-icon:hover {
      color: #ff7614;
      border-color: #ff7614;
    }
  }
}

.bank p:last-child {
  border: none;
}

.step-two .other-recharge .recharge-list .lee-describe {
  font-size: 12px;
  background: #f6f6f6;

  & > div > p {
    word-wrap: break-word;
  }
}

.step-two .other-recharge .recharge-list li .list-h .title {
  font-size: 14px;
}

.step-two .other-recharge .recharge-list li {
  // width: 240px;
  width: 236px;
}

.step-two .other-recharge .recharge-list li .list-h .title {
  width: 190px;
  overflow: hidden;
}

.recharge-list li {
  overflow: hidden;
}

.lee-describe {
  height: 62px;
  overflow: auto;
  padding: 2px 10px;
  box-sizing: border-box;
}

.overflow {
  overflow: initial;
}

.lee-describe > div {
  height: 100%;
}

.lee-describe > div > p {
}

.step-two .other-recharge .recharge-list li {
  height: 106px;
}

//卡密支付
.step-two .other-recharge {
  .ipt-km-wrapper {
    dt {
      color: #ec0022;
      height: 34px;
      padding-top: 6px;
    }

    textarea {
      width: 280px;
      height: 88px;
      padding: 12px 14px;
    }
  }
}

.step-two .kmzf-ways {
  .header {
    height: 29px;
    border-bottom: 1px solid #cccccc;
    font-size: 16px;
    margin-bottom: 20px;

    li {
      width: 116px;
      height: 29px;
      padding-left: 25px;
      /*  border-bottom: 1px solid #be1204; */
    }
  }
}
</style>

<style lang="less">
.lee-online-bank {
  ul {
    padding: 10px 10px 2px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    justify-content: flex-start;

    li {
      width: 107px;
      height: 29px;
      margin-bottom: 8px;
      margin-left: 15px;
      border: 1px solid #ccc;
      overflow: hidden;
      position: relative;

      img {
        height: 100%;
        width: 100%;
      }

      .after-bank-bottom {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 0;
        /*   border-bottom: 12px solid #be1204; */
        border-left: 11px solid transparent;

        i {
          width: 10px;
          height: 10px;
          position: absolute;
          right: -3px;
          font-size: 20px;
          color: #fff;
          top: -1px;
        }
      }
    }

    li:nth-child(6n + 1) {
      margin-left: 0px;
    }

    .lee-bankList-itm {
      /*    border-color: #be1204; */
    }
  }

  .lee-online-bank-top {
    border: 1px solid #ccc;

    p {
      font-size: 16px;
      /*     color: #be1204; */
      padding-left: 25px;
      line-height: 40px;
      position: relative;

      .lee-online-bank-bottom {
        position: absolute;
        width: 115px;
        height: 2px;
        /*    background-color: #be1204; */
        bottom: -2px;
        left: 0;
        z-index: 2;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.ivu-input-number {
  padding: 0;
  width: 222px;
}

.currency-exchange {
  font-size: 14px;
  color: #b2b2b2;
  padding-left: 96px;
  padding-top: 4px;

  img {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    float: none;
    vertical-align: text-bottom;
  }
}

.info-list {
  .ivu-input-wrapper.ivu-input-type {
    position: relative;

    &.unit {
      input {
        padding-right: 10px;
      }

      .input-suffix {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
