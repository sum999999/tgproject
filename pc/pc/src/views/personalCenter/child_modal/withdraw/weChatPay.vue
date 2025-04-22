<!--
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 * 
 * @Author: 
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-21 15:43:50
 * @FilePath: \pc\src\views\personalCenter\child_modal\withdraw\weChatPay.vue
 * @Description: 微信提现
 -->

<template>
  <div class="withdrawAll">
    <div v-if="stepOne && hadPayPwd">
      <div class="tips">
        <div class="tipsa">
          <Icon type="android-bulb" size="30" color="#fec746"></Icon>
          <span class="warning tips1">{{ $tex("温馨提示") }}：</span>
        </div>
        <div class="tipsb">
          <ul class="warning tips2">
            <template v-if="$configText.withdraw == 'weicai'">
              <template v-if="isConvertBalance">
                <i18n
                  path="单笔限额：最低{min}{unit}，最高{max}{unit}。"
                  tag="li"
                >
                  <template slot="min">
                    {{ inputFeeMin }}
                  </template>
                  <template slot="max">
                    {{ inputFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ localApiCoin.scurIcon }}
                  </template>
                </i18n>
                <i18n path="每日限额：最高{money}{unit}。" tag="li">
                  <template slot="money">
                    {{ inputDayFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ localApiCoin.scurIcon }}
                  </template>
                </i18n>
              </template>
              <template v-else>
                <i18n
                  path="单笔限额：最低{min}{unit}，最高{max}{unit}。"
                  tag="li"
                >
                  <template slot="min">
                    {{ sysInputFeeMin }}
                  </template>
                  <template slot="max">
                    {{ sysInputFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ $tex("元") }}
                  </template>
                </i18n>
                <i18n path="每日限额：最高{money}{unit}。" tag="li">
                  <template slot="money">
                    {{ sysInputDayFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ $tex("元") }}
                  </template>
                </i18n>
              </template>
              <li>
                {{
                  $tex("提现次数：每日最高{num}次", {
                    num: lutfcWeb.dayFeeNumberMax,
                  })
                }}(<i18n path="免手续费{num}次" :tag="false">
                  <template slot="num">
                    <template
                      v-if="lutfcWeb.dayFeeNumberMax != lutfcWeb.freeNumber"
                    >
                      {{ lutfcWeb.freeNumber }}
                    </template>
                  </template> </i18n
                >)。
              </li>
              <li>
                {{
                  $tex("到账时间：一般到账时间在10分钟内，最快1分钟内到账。")
                }}
              </li>
              <li>
                {{
                  $tex(
                    "提款时间：早上09:00至次日凌晨03:00；夜间3点后的提款申请统一于早上09:00后优先处理。"
                  )
                }}
              </li>
              <li>
                {{
                  $tex(
                    "安全防范：新绑定的提款银行卡，需要绑定时间超过 1 小时后才能正常提款。"
                  )
                }}
              </li>
            </template>
            <template v-else>
              <!-- 默认显示 -->
              <template v-if="isConvertBalance">
                <i18n
                  path="单笔限额：最低{min}{unit}，最高{max}{unit}。"
                  tag="li"
                >
                  <template slot="min">
                    {{ inputFeeMin }}
                  </template>
                  <template slot="max">
                    {{ inputFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ localApiCoin.scurIcon }}
                  </template>
                </i18n>
                <i18n path="每日限额：最高{money}{unit}。" tag="li">
                  <template slot="money">
                    {{ inputDayFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ localApiCoin.scurIcon }}
                  </template>
                </i18n>
              </template>
              <template v-else>
                <i18n
                  path="单笔限额：最低{min}{unit}，最高{max}{unit}。"
                  tag="li"
                >
                  <template slot="min">
                    {{ sysInputFeeMin }}
                  </template>
                  <template slot="max">
                    {{ sysInputFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ $tex("元") }}
                  </template>
                </i18n>
                <i18n path="每日限额：最高{money}{unit}。" tag="li">
                  <template slot="money">
                    {{ sysInputDayFeeMax }}
                  </template>
                  <template slot="unit">
                    {{ $tex("元") }}
                  </template>
                </i18n>
              </template>
              <li>
                {{
                  $tex("提现次数：每日最高{num}次", {
                    num: lutfcWeb.dayFeeNumberMax,
                  })
                }}(<i18n path="免手续费{num}次" :tag="false">
                  <template slot="num">
                    <template
                      v-if="lutfcWeb.dayFeeNumberMax != lutfcWeb.freeNumber"
                    >
                      {{ lutfcWeb.freeNumber }}
                    </template>
                  </template> </i18n
                >)。
              </li>
              <li>
                {{ $tex("到账时间：一般到账时间在5分钟内，最快2分钟内到账。") }}
              </li>
            </template>
            <!-- <li v-if="codeQuantityFlag" class="withdraw-tip">
                            尊敬的用户，您目前的投注量是22
                            <span class="red-color">{{playCodeQuantity}}</span>元，不足以提现，不便之处敬请原谅! (提现还需投注
                            <span class="red-color">{{diffQuantity}}</span>元)
                        </li> -->
          </ul>
        </div>
      </div>
      <modal
        :modalShow="weChatFlag"
        :title="
          lotUserBankList.length > 0 ? $tex('绑定银行卡') : $tex('绑定微信')
        "
        @btn-ok="toAddBank"
        @btn-cancel="(weChatFlag = false), (hasMoreClick = false)"
      >
        <div slot="content" style="text-align:center">
          {{
            $tex(
              "您还没有绑定微信或未实名，暂时无法提现，马上建立专属个人微信账号！"
            )
          }}
        </div>
      </modal>
      <div class="withdraw">
        <div>
          <div class="withdrawform">
            <span>{{ $tex("可提金额") }}：</span>
            <span style="font-size:22px;font-weight:bold;">
              <template v-if="isConvertBalance">
                {{ localApiCoin.scurIcon }}{{ sysExChangeBalance }}
              </template>
              <template v-else>
                {{ $tex("￥") }}{{ balanceWithDraw | keepDecimalOf2 }}
              </template>
            </span>
            <span
              v-if="hasPermission('element.currencyExchange')"
              class="convert-btn"
              @mouseenter="isConvertBalance = true"
              @mouseleave="isConvertBalance = false"
            >
              <span class="convert-btn__label">{{ $tex("转换") }}</span>
              <span class="convert-btn__icon"></span>
            </span>
          </div>
        </div>
        <div>
          <div class="withdrawform">
            <span>{{ $tex("提现账户") }}：</span>
            <Select style="width:320px" v-model="takeFee.userBankId">
              <Option
                v-for="item in lotUserBankList"
                :value="item.userBankId"
                :key="item.userBankId"
                >{{ item.bankName }}&nbsp; {{ item.accountName }}&nbsp;
                {{ item.bankNo | changeBankNo }}</Option
              >
            </Select>
            <Button
              size="small"
              v-if="!lotUserBankList.length"
              @click="toAddBank()"
              style="color:#333;margin-left:5px;"
              >{{ $tex("绑定账号") }}</Button
            >
          </div>
        </div>
        <div class="withdrawform">
          <span>{{ $tex("提现金额") }}：</span>
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
              v-model="takeFee.totalFee"
              :min="inputFeeMin"
              :max="inputFeeMax"
              :placeholder="$tex('请输入提现金额')"
              @keydown="downIpt($event)"
              @input="handlerIptMoney($event)"
              @blur="blurIpt($event)"
            />
            <span
              v-if="hasPermission('element.currencyExchange')"
              class="input-suffix"
              >{{ localApiCoin.scurIcon }}</span
            >
          </div>
          <!-- <InputNumber v-model="takeFee.totalFee" :formatter="value=>`Math.floor(value*100)/100`" :max="lutfcWeb.feeMax" placeholder="请输入提现金额" style="width: 180px"></InputNumber> -->
          <!-- <InputNumber v-model="takeFee.totalFee" :min="lutfcWeb.feeMin" :max="lutfcWeb.feeMax" :step="1" :precision="0" placeholder="请输入提现金额" style="width:180px;"></InputNumber> -->
          <!-- <Input :number="true" :maxlength="moneyLen" v-model="takeFee.totalFee" @on-keypress="handlerIptMoney" placeholder="请输入提现金额" maxLength="" style="width: 180px" /> -->
          <span class="poundage" v-show="isPoundage && poundage > 0"
            >{{ $tex("手续费") }}: {{ poundage }}
            <span>({{ (poundagePercent * 100).toFixed(2) }}%)</span>
          </span>
          <!-- 元 -->
          <div v-if="showCurrencyExchange" class="currency-exchange">
            <img src="~@/assets/images-v6/jinggao.png" alt="" />
            {{ takeFee.totalFee }}{{ localApiCoin.scur }}={{ sysExChangeMoney
            }}{{ localApiCoin.tcur }}
          </div>
        </div>
        <div>
          <div class="withdrawform">
            <span>{{ $tex("资金密码") }}：</span>
            <Input
              v-model="payWadNo"
              autocomplete="off"
              :maxlength="4"
              :placeholder="$tex('请输入资金密码')"
              type="password"
              style="width: 180px"
            ></Input>
          </div>
        </div>
        <p
          class="frequency"
          v-show="
            userInfo.remainingWithdrawalTimes ||
              userInfo.remainingWithdrawalTimes == 0
          "
        >
          您当日提现次数还剩
          <span class="warning tips1">
            {{ userInfo.remainingWithdrawalTimes }}
          </span>
          次
        </p>
        <!--  <div v-if='!specialCase'> -->
        <div>
          <template v-if="codeQuantityFlag">
            <template v-if="isConvertBalance">
              <i18n
                path="尊敬的用户，您目前的投注量是{money1}{unit}，不足以提现，不便之处敬请原谅! (提现还需投注{money2}{unit})"
                tag="p"
              >
                <template slot="money1">
                  <span class="lee-p">{{ sysPlayCodeQuantity }}</span>
                </template>
                <template slot="money2">
                  <span class="lee-p">{{ sysDiffQuantity }}</span>
                </template>
                <template slot="unit">
                  <span>{{ localApiCoin.scurIcon }}</span>
                </template>
              </i18n>
            </template>
            <template v-else>
              <i18n
                path="尊敬的用户，您目前的投注量是{money1}{unit}，不足以提现，不便之处敬请原谅! (提现还需投注{money2}{unit})"
                tag="p"
              >
                <template slot="money1">
                  <span class="lee-p">{{ playCodeQuantityNew }}</span>
                </template>
                <template slot="money2">
                  <span class="lee-p">{{ diffQuantity }}</span>
                </template>
                <template slot="unit">
                  <span>{{ $tex("元") }}</span>
                </template>
              </i18n>
            </template>
          </template>
          <div class="lee-p" v-else-if="!canTakeFreeTime && lutfcWeb.startTime">
            <p>{{ $tex("提示信息") }}:</p>
            <i18n
              path="提款结算系统例行维护，暂停{start}至{end}之间的出款申请，请您在其它时间内再次发起提款申请，给您带来的不便敬请谅解！"
              tag="p"
            >
              <template slot="start">
                {{ lutfcWeb.startTime | parseTime }}
              </template>
              <template slot="end">
                {{ lutfcWeb.endTime | parseTime }}
              </template>
            </i18n>
          </div>
        </div>
        <div class="withdrawform" v-if="!codeQuantityFlag">
          <span></span>
          <Button
            type="primary"
            style="width:106px;height:36px"
            @click="withdraw"
            :disabled="
              !balanceWithDraw > 0 || codeQuantityFlag > 0 || !canTakeFreeTime
            "
            >{{ $tex("提交申请") }}</Button
          >
        </div>
        <!-- </div>
      -->
        <!--  <div v-else>
          <div>
            <p class="lee-p">
              尊敬的用户，您目前的投注量是
              <span class="red-color">{{playCodeQuantity}}</span>元，不足以提现，不便之处敬请原谅!
            </p>
          </div>
        </div> -->
      </div>
    </div>

    <div v-if="!stepOne" class="confirm">
      <div class="confirmicon"></div>
      <div class="confirm1">
        <span>{{ $tex("提现申请成功") }}</span>
        <p>
          <span>{{
            $tex(
              "根据地区银行的不同，存款后到账时间快2-5分钟，具体以银行到账时间和金额为准，如有疑问，请联系客服."
            )
          }}</span>
        </p>
      </div>
      <Button
        type="primary"
        size="large"
        class="confirmbutton"
        style="height:36px;line-height:16px;"
        @click="toQueryTakeFee"
        >{{ $tex("查看提现记录") }}</Button
      >
    </div>
    <div class="" v-if="showModal2">
      <div class="confirm1">
        <span>{{ $tex("提示") }}</span>
        <br />
        <br />
        <p>
          <span>{{ $tex("您还没有设置过资金密码，请先设置!") }}</span>
        </p>
      </div>
      <div class="clr"></div>
      <Button
        type="primary"
        style="height:36px;line-height:16px;margin-top:30px;margin-left:20px;"
        @click="(showModal1 = true), (showModal2 = false)"
        >{{ $tex("设置资金密码") }}</Button
      >
    </div>
    <ModifyFundPwd
      v-model="showModal1"
      @on-end="resetFormStatus"
      @input="cancelChange"
    ></ModifyFundPwd>
  </div>
</template>

<script>
import encryption from "@/utils/md5";
import ModifyFundPwd from "@/components/modifyFundPwd";
import modal from "@/components/modal";
import formatDate from "@/utils/format_date.js";
import { getUserPayPwd, queryBalance } from "@/api/user";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";
import numeral from "numeral";

export default {
  props: {
    currentTabName: {
      type: String,
    },
    data: {},
    localApiCoin: {
      type: Object,
    },
  },
  data() {
    return {
      weChatFlag: false,
      stepOne: true,
      hadPayPwd: false,
      lotUserBankList: [],
      balanceWithDraw: "",
      a: 100,
      takeFee: {
        totalFee: 0,
        userBankId: "",
        payPwd: "",
        takeType: "01",
      },
      payWadNo: "",
      showModal2: false,
      showModal1: false,
      rechargeCodeQuantity: 0, //要求打码量
      playCodeQuantity: 0, //有效打码量
      playCodeQuantityNew: 0, //有效打码量new
      diffQuantity: 0, //打码量之差
      codeQuantityFlag: false, //
      specialCase: false,
      hasMoreClick: false, //阻止多次点击
      poundageMax: 0,
      poundagePercent: 0,
      isPoundage: false,
      showBandModal: false,
      lutfcWeb: {}, // 提现说明
      isConvertBalance: false,
      currentTime: 0,
      userInfo: "",
    };
  },
  computed: {
    poundage() {
      let po = (this.poundagePercent * this.takeFee.totalFee).toFixed(2);
      // console.log(po > this.poundageMax, po, this.poundageMax)
      if (Number(po) > Number(this.poundageMax)) {
        // console.log(this.poundageMax)
        return Number(this.poundageMax).toFixed(2);
      } else {
        return po;
      }
    },
    user() {
      return this.$store.state.user;
    },
    currentTab() {
      return this.currentTabName;
    },
    canTakeFreeTime() {
      const { startTime, endTime } = this.lutfcWeb;
      return this.currentTime < startTime || this.currentTime > endTime;
    },
    moneyLen() {
      if (!`${this.takeFee.totalFee}`.includes(".")) {
        return `${this.inputFeeMax}`.length;
      } else {
        return `${this.inputFeeMax}`.length + 5;
      }
    },
    showCurrencyExchange() {
      return (
        hasPermission("element.currencyExchange") &&
        this.takeFee.totalFee &&
        this.localApiCoin.scur &&
        this.localApiCoin.tcur
      );
    },
    sysExChangeMoney() {
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      const money = this.takeFee.totalFee || 0;
      return numeral(money)
        .multiply(exchangeRate)
        .format("0.00", Math.floor);
    },
    sysExChangeBalance() {
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      const money = this.balanceWithDraw
        ? Number(
            this.balanceWithDraw.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
          )
        : 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00");
    },
    sysInputFeeMin() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.convert2SysExChange(this.lutfcWeb.feeMin));
      }
      return this.inputFeeMin;
    },
    sysInputFeeMax() {
      if (hasPermission("element.currencyExchange")) {
        return Math.floor(this.convert2SysExChange(this.lutfcWeb.feeMax));
      }
      return this.inputFeeMax;
    },
    sysInputDayFeeMax() {
      if (hasPermission("element.currencyExchange")) {
        return Math.floor(this.convert2SysExChange(this.lutfcWeb.dayFeeMax));
      }
      return this.inputDayFeeMax;
    },
    inputFeeMin() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.lutfcWeb.feeMin);
      }
      return this.lutfcWeb.feeMin;
    },
    inputFeeMax() {
      if (hasPermission("element.currencyExchange")) {
        return Math.floor(this.lutfcWeb.feeMax);
      }
      return this.lutfcWeb.feeMax;
    },
    inputDayFeeMax() {
      if (hasPermission("element.currencyExchange")) {
        return Math.floor(this.lutfcWeb.dayFeeMax);
      }
      return this.lutfcWeb.dayFeeMax;
    },
    sysPlayCodeQuantity() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.convert2UserExChange(this.playCodeQuantityNew));
      }
      return this.playCodeQuantityNew;
    },
    sysDiffQuantity() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.convert2UserExChange(this.diffQuantity));
      }
      return this.diffQuantity;
    },
  },
  components: {
    ModifyFundPwd,
    modal,
  },
  filters: {
    changeBankNo: function(num) {
      let numArray = num.split("");
      for (let i = 0, len = numArray.length; i < len; i++) {
        if (i > numArray.length - 5) {
          break;
        }
        numArray[i] = "*";
      }
      numArray.splice(4, 0, " ");
      numArray.splice(9, 0, " ");
      numArray.splice(14, 0, " ");
      numArray.splice(19, 0, " ");
      return numArray.join("");
    },
    parseTime(v) {
      if (!v) return "";
      return formatDate.getFormatDate2(new Date(+v), "hh:mm:ss"); //M表示月份,m:表示分. 12.26 by xiaojiji
      // return v;
    },
  },
  watch: {
    currentTab(n) {
      if (n === "weChatPay") {
        this.showBandModal = true;
        getUserPayPwd().then((response) => {
          this.$emit("handler-spin", false);
          if (response.data.code !== 0) return;
          if (response.data.data.payPwdFlag != "1") {
            // 没有设置资金密码
            // debugger
            this.showModal2 = true;
          } else {
            //设置了资金密码
            this.showModal2 = false;
            this.init();
          }
        });
      } else {
        this.showBandModal = false;
      }
    },
    data() {
      this.init();
    },
  },
  methods: {
    hasPermission,
    queryLotUser() {
      this.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.userInfo = response.data.data;
        });
    },
    convert2UserExChange(money) {
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      money = money || 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00");
    },
    convert2SysExChange(money) {
      // 用户选择货币 -> 官方货币
      const exchangeRate = this.localApiCoin.exchangeRate || 1;
      money = money || 0;
      return numeral(money)
        .multiply(exchangeRate)
        .format("0.00");
    },
    /**
     * 按下输入框
     */
    downIpt(event) {
      let code = event.keyCode;
      if (code === 190 || code === 110) {
        event.preventDefault();
      }
    },
    /**
     * 提现金额输入框失焦
     */
    blurIpt(event) {
      let val = event.target.value;
      if (val < this.inputFeeMin) {
        this.takeFee.totalFee = this.inputFeeMin;
      }
    },
    /**
     * 按下提现金额输入框
     */
    handlerIptMoney(event) {
      let val = event.target.value;
      if (isNaN(val) || val.startsWith("0")) {
        this.takeFee.totalFee = this.inputFeeMin;
      } else if (val > this.inputFeeMax) {
        this.takeFee.totalFee = this.inputFeeMax;
      }
    },
    cancelChange(val) {
      //取消设置资金密码
      this.showModal2 = !val;
    },
    withdraw() {
      //提现
      if (this.hasMoreClick || !this.canTakeFreeTime) {
        //阻止连续点击
        return;
      }
      this.hasMoreClick = true;
      if (this.lotUserBankList == null || this.lotUserBankList.length <= 0) {
        this.weChatFlag = true;
        return;
      }
      // 强制实名
      if (this.$store.getters.sysRealName == 1 && !this.user.realName) {
        this.weChatFlag = true;
        return;
      }
      this.takeFee.payPwd = encryption.encrypt.md5(this.payWadNo);
      this.$http
        .post("/api/v2/user/takeFee", this.takeFee, {
          userId: true,
          headers: {
            scur: this.localApiCoin.scur,
          },
        })
        .then((response) => {
          this.hasMoreClick = false;
          if (response.data.code !== 0) return;
          this.stepOne = false;
        });
    },
    toAddBank() {
      this.weChatFlag = false;
      let label = "weChatPay";
      if (
        this.lotUserBankList.length &&
        this.$store.getters.sysRealName == 1 &&
        !this.user.realName
      ) {
        label = "bankAccount";
      }
      this.$router.push({
        name: "personalCenter",
        params: { id: "account", label: label },
      });
    },
    toQueryTakeFee() {
      this.$router.push({
        name: "personalCenter",
        params: { id: "trade", label: "trade_recharge" },
      });
    },
    resetFormStatus() {
      this.showModal2 = false;
      this.showModal1 = false;
      this.init();
    },
    init() {
      this.hadPayPwd = true;
      this.isPoundage = false;
      // this.$http
      //   .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
      //   .then(response => {
      // if (response.data.code !== 0) return;
      // debugger;
      // let data = response.data.data;
      let data = this.data;
      this.lotUserBankList = data.lotUserWechatList;
      this.lutfcWeb = data.lutfcWeb;
      // debugger
      // if (this.lutfcWeb.codeQuantityStatus === '1') {//
      this.playCodeQuantity = data.playCodeQuantity.toFixed(2); //有效打码量
      this.playCodeQuantityNew = data.playCodeQuantityNew.toFixed(2); //有效打码量new
      this.rechargeCodeQuantity = data.rechargeCodeQuantity; //要求打码量
      this.currentTime = data.currentTime;
      this.timer = setInterval(() => {
        this.currentTime += 1000;
      }, 1000);

      this.diffQuantity = (
        this.rechargeCodeQuantity - this.playCodeQuantity
      ).toFixed(2);

      // }
      if (this.diffQuantity > 0 && this.lutfcWeb.codeQuantityStatus === "1") {
        this.codeQuantityFlag = true;
      } else {
        this.codeQuantityFlag = false;
      }
      /*   if (this.rechargeCodeQuantity == 0 && this.playCodeQuantity == 0) {
              this.specialCase = true;
            } */
      this.inputFeeMin && (this.takeFee.totalFee = this.inputFeeMin);

      if (
        (this.lotUserBankList == null || this.lotUserBankList.length <= 0) &&
        this.$store.getters.sysRealName == 1
      ) {
        this.weChatFlag = true;
      }

      if (data.isPoundage == "1") {
        this.isPoundage = true;
        this.poundageMax = data.poundageMax;
        this.poundagePercent = data.poundagePercent;
      } else {
        this.isPoundage = false;
      }
      // });
      queryBalance().then((response) => {
        if (response.data.code !== 0) return;
        let data = response.data.data;
        this.balanceWithDraw = data.balanceWithDraw;
      });
    },
  },
  created() {
    this.$emit("handler-spin", true);
    getUserPayPwd().then((response) => {
      this.$emit("handler-spin", false);
      if (response.data.code !== 0) return;
      if (response.data.data.payPwdFlag != "1") {
        // 没有设置资金密码
        this.showModal2 = true;
      } else {
        //设置了资金密码
        this.init();
      }
    });
    // 获取用户信息的提现次数
    this.queryLotUser();

    // this.$http
    //   .post("/api/v2/user/getUserPayPwd", "", { userId: true, unenc: true })
    //   .then(response => {
    //     this.$emit("handler-spin", false);
    //     if (response.data.code !== 0) return;
    //     if (response.data.data.payPwdFlag != "1") {
    //       // 没有设置资金密码
    //       this.showModal2 = true;
    //     } else {
    //       //设置了资金密码
    //       this.init();
    //     }
    //   });
    // this.isPoundage = false
    // this.$http.post("/api/v2/user/queryLotUserBankInfo", '', { userId: true }).then(response => {
    //   //判断能否提现
    //   if (response.data.code !== 0) return;
    //   let data = response.data.data;
    //   this.playCodeQuantity = data.playCodeQuantity.toFixed(2); //有效打码量
    //   this.rechargeCodeQuantity = data.rechargeCodeQuantity; //要求打码量
    //   this.diffQuantity = (
    //     this.rechargeCodeQuantity - this.playCodeQuantity
    //   ).toFixed(2);
    //   if (this.diffQuantity > 0) {
    //     this.codeQuantityFlag = true;
    //   }
    //   if (this.rechargeCodeQuantity == 0 && this.playCodeQuantity == 0) {
    //     this.specialCase = true
    //   }

    //   if (data.isPoundage == '1') {
    //     this.isPoundage = true
    //     this.poundageMax = data.poundageMax
    //     this.poundagePercent = data.poundagePercent
    //   } else {
    //     this.isPoundage = false
    //   }
    // });
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less">
.withdrawAll {
  .lee-p {
    color: @primary-color;
    font-size: 12px;
    padding-bottom: 12px;
  }
  .withdrawform .poundage {
    width: 160px;
    margin-left: 40px;
    display: flex;
    align-items: center;
    color: #ff5252;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    -webkit-text-fill-color: #333;
  }
  .frequency {
    display: flex;
    align-items: center;
    span {
      height: auto;
      margin: 0 5px;
    }
  }
}
</style>

<style lang="less">
.withdrawAll {
  padding-top: 12px;
}
.withdrawAll .tipsa {
  height: 30px;
  font-size: 0;
  overflow: hidden;
}
.withdrawAll .tips1 {
  display: inline-block;
  height: 30px;
  vertical-align: top;
  padding: 6px 0;
  margin-left: 14px;
  font-size: 14px;
  color: @primary-color;
}
.withdrawAll .tips2 {
  padding-top: 10px;
}
.withdrawAll .tips2 li {
  line-height: 20px;
  background: url("/static/images/warn-square.png") no-repeat left center;
  font-size: 12px;
  padding-left: 10px;
  /* color: #be1204; */
}
.withdrawAll .tips2 .withdraw-tip {
  color: #313131;
}
.withdrawAll .tips2 li .red-color {
  color: @primary-color;
}
.withdrawAll .tips {
  padding: 10px 23px;
  border: 1px solid #d5d5d5;
}
.withdrawAll .withdraw {
  margin-top: 28px;
  margin-left: 23px;
}
.withdrawAll .withdrawform {
  display: flex;
  margin-bottom: 20px;
  color: #313131;
  font-size: 0;
}
.withdrawAll .withdrawform > span {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}
.withdrawAll .button {
  width: 106px;
}
.withdrawAll .confirm {
  margin-top: 86px;
}
.withdrawAll .confirmicon {
  float: left;
  width: 60px;
  height: 60px;
  margin-left: 170px;
  background: url("~@/assets/images/icon.png") no-repeat -76px -509px;
}
.withdrawAll .confirm1 {
  float: left;
  margin-left: 20px;
}
.withdrawAll .confirm1 span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}
.withdrawAll .confirm1 p > span {
  font-size: 16px;
  font-weight: normal;
}
.withdrawAll .confirmbutton {
  margin-left: 290px;
  margin-top: 28px;
  width: 162px;
}
.ivu-modal-header-inner {
  height: 12px;
  line-height: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: normal;
}
.ivu-modal-footer {
  border: none;
  text-align: center;
}
.ivu-modal-close .ivu-icon-ios-close-empty {
  color: #fff;
  top: -4px;
}
</style>

<style lang="less" scoped>
.currency-exchange {
  font-size: 14px;
  color: #b2b2b2;
  padding-left: 70px;
  padding-top: 4px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    float: none;
    vertical-align: text-bottom;
  }
}
.convert-btn {
  display: inline-flex !important;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #7f7f7f;
  color: #7f7f7f;
  cursor: pointer;
  flex-wrap: wrap;
  align-items: center;
  position: absolute;
  left: 400px;
  &:hover {
    background: #debf67;
    border-color: transparent;
    color: #fff;
    .convert-btn__icon {
      background-image: url(~@/assets/images/zhuanhuan1.png);
    }
  }
  .convert-btn__label {
    margin-right: 6px;
  }
  .convert-btn__icon {
    width: 18px;
    height: 18px;
    display: block;
    background-image: url(~@/assets/images/zhaunhuan.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
.ivu-input-wrapper.ivu-input-type {
  position: relative;
  &.unit {
    input {
      padding-right: 20px;
    }
    .input-suffix {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
    }
  }
}
</style>
