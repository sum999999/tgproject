<!--
 * @Description: 数字货币提现
 -->

<template>
  <div class="currency-pay">
    <div v-if="step === Steps.kWithdraw" class="currency-pay-content">
      <div class="currency-pay-tips">
        <div class="currency-pay-tips__header">
          <Icon type="android-bulb" size="30" color="#fec746"></Icon>
          <span class="currency-pay-tips__title">{{ $tex("温馨提示") }}：</span>
        </div>
        <div class="currency-pay-tips__body">
          <ul class="currency-pay-tips__content">
            <template v-if="$configText.withdraw == 'weicai'">
              <li>
                {{
                  $tex("单笔限额：最低{min}{unit}，最高{max}{unit}。", {
                    min: lutfcWeb.feeMin,
                    max: lutfcWeb.feeMax,
                    unit: "元",
                  })
                }}
              </li>
              <li>
                {{
                  $tex("每日限额：最高{money}{unit}。", {
                    money: lutfcWeb.dayFeeMax,
                    unit: "元",
                  })
                }}
              </li>
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
              <li>
                {{
                  $tex("单笔限额：最低{min}{unit}，最高{max}{unit}。", {
                    min: lutfcWeb.feeMin,
                    max: lutfcWeb.feeMax,
                    unit: "元",
                  })
                }}
              </li>
              <li>
                {{
                  $tex("每日限额：最高{money}{unit}。", {
                    money: lutfcWeb.dayFeeMax,
                    unit: "元",
                  })
                }}
              </li>
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
          </ul>
        </div>
      </div>
      <div class="currency-pay-address">
        <div class="currency-pay-title">{{ $tex("提现地址") }}：</div>
        <Select v-model="userBankId" style="width:288px">
          <Option
            v-for="digiccy in lotUserDigiccyList"
            :value="digiccy.userBankId"
            :key="digiccy.userBankId"
          >
            {{ digiccy.bankNo }}
          </Option>
        </Select>

        <Button
          size="small"
          v-show="lotUserDigiccyList.length < userInfo.cryptoMaxnum"
          @click="jump2BindDigiccy()"
          style="color:#333;margin-left:5px; margin-bottom:10px; height: 29px;"
          >{{ $tex("绑定数字货币") }}</Button
        >
      </div>
      <div class="currency-pay-amount">
        <div class="currency-pay-title">{{ $tex("提现数量") }}：</div>
        <zk-input
          v-model="amount"
          type="digit"
          :digitilen="4"
          :min="feeMin"
          :max="curMoneyAmount"
          :placeholder="$tex('请输入提现的数量')"
        >
        </zk-input>
        <span>（{{ digiccyAmount }}{{ $tex("¥") }}）</span>
      </div>
      <div class="currency-pay-amount-text currency-pay-text">
        {{ $tex("可提现金额") }}：<span class="currency-pay-text--primary"
          >{{ balanceWithDraw }}{{ $tex("¥") }}</span
        >
        ≈ {{ $tex("货币数量") }}：<span class="currency-pay-text--primary">{{
          curMoneyAmount
        }}</span>
      </div>
      <div v-if="isPoundage" class="currency-pay-exchange">
        <div class="currency-pay-title">{{ $tex("手续费") }}：</div>
        <div
          class="currency-pay-bg currency-pay-text currency-pay-text--primary"
        >
          {{ poundage }}{{ $tex("¥") }}({{
            (poundagePercent * 100).toFixed(2)
          }}%)
        </div>
      </div>
      <div
        v-if="curDigiccyName && curExchangeRate"
        class="currency-pay-exchange"
      >
        <div class="currency-pay-title">{{ $tex("当前汇率") }}：</div>
        <div
          class="currency-pay-bg currency-pay-text currency-pay-text--primary"
        >
          1{{ curDigiccyName }}={{
            $tex("{money}{unit}", { money: curExchangeRate, unit: "RMB" })
          }}
        </div>
      </div>
      <div class="currency-pay-pwd">
        <div class="currency-pay-title">{{ $tex("资金密码") }}：</div>
        <Input
          v-model="fundPwd"
          autocomplete="off"
          :maxlength="4"
          :placeholder="$tex('请输入资金密码')"
          type="password"
        ></Input>
      </div>
      <p
        class="frequency"
        v-show="
          userInfo.remainingWithdrawalTimes ||
            userInfo.remainingWithdrawalTimes == 0
        "
      >
        您当日提现次数还剩
        <span class="currency-pay-tips__title">
          {{ userInfo.remainingWithdrawalTimes }}
        </span>
        次
      </p>
      <i18n
        v-if="codeQuantityFlag"
        class="withdrawAll"
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
      <div v-else-if="!canTakeFreeTime && lutfcWeb.startTime">
        <p class="code-quantity-flag-tips">{{ $tex("提示信息") }}:</p>
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
      <Button
        v-else
        @click="onWithdrawClick"
        class="currency-pay-button"
        type="primary"
        :disabled="disabledWithDrawBtn"
        >{{ $tex("立即提现") }}
      </Button>
    </div>
    <div v-if="step === Steps.kSuccess" class="currency-pay-suc">
      <div class="currency-pay-suc__confirmicon"></div>
      <div class="currency-pay-suc__confirm1">
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
        @click="jump2TakeFee"
        type="primary"
        size="large"
        class="currency-pay-suc__confirmbutton"
        style="height:36px;line-height:16px;"
        >{{ $tex("查看提现记录") }}
      </Button>
    </div>
    <div v-if="step === Steps.kSetFundPwd">
      <div class="currency-pay-confirm">
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
        @click="showFundPwd = true"
        >{{ $tex("设置资金密码") }}
      </Button>
    </div>
    <modify-fund-pwd
      v-model="showFundPwd"
      @on-end="onFundPwdSubmitSuc"
    ></modify-fund-pwd>
    <modal
      :modalShow="show2BindDigiccy"
      :title="
        lotUserDigiccyList.length > 0
          ? $tex('绑定银行卡')
          : $tex('绑定数字货币')
      "
      @btn-ok="jump2BindDigiccy"
      @btn-cancel="show2BindDigiccy = false"
      :scrollable="true"
    >
      <div slot="content" style="text-align:center">
        {{
          $tex(
            "您还没有绑定数字货币或未实名，暂时无法提现，马上绑定数字货币地址！"
          )
        }}
      </div>
    </modal>
  </div>
</template>

<script>
import { ZkInput } from "@/components/ZkInput";
import ModifyFundPwd from "@/components/modifyFundPwd";
import { mapGetters } from "vuex";
import numeral from "numeral";
import { getUserPayPwd, queryBalance } from "@/api/user";
import modal from "@/components/modal";
import formatDate from "@/utils/format_date.js";
import encryption from "@/utils/md5";

const Steps = {
  kSetFundPwd: "kSetFundPwd",
  kWithdraw: "kWithdraw",
  kSuccess: "kSuccess",
};

export default {
  name: "currencyPay",
  components: {
    ZkInput,
    ModifyFundPwd,
    modal,
  },
  props: {
    currentTabName: {
      type: String,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    localApiCoin: {
      type: Object,
    },
  },
  data() {
    return {
      Steps,
      step: "",
      showFundPwd: false,
      show2BindDigiccy: false,
      fundPwd: "",
      amount: "",
      userBankId: "",
      curTimeTimer: null,
      currentTime: 0,
      withdrawLoading: false,
      userInfo: {}, // 获取现在data
      balanceWithDraw: 0, // 可提金额
    };
  },
  filters: {
    parseTime(v) {
      if (!v) return "";
      return formatDate.getFormatDate2(new Date(+v), "hh:mm:ss");
    },
  },
  computed: {
    ...mapGetters(["user"]),
    lotUserDigiccyList() {
      return this.data.lotUserDigiccyList || [];
    },
    user() {
      return this.$store.state.user;
    },
    curLotUserDigiccy() {
      return (
        this.data.lotUserDigiccyList.find((item) => {
          return item.userBankId === this.userBankId;
        }) || {}
      );
    },
    curExchangeRate() {
      return this.curLotUserDigiccy.exchangeRate || 0;
    },
    curDigiccyName() {
      return this.curLotUserDigiccy.digiccyName || "";
    },
    curMoneyAmount() {
      const money = numeral(this.balanceWithDraw)
        .divide(this.curExchangeRate)
        .format("0.0000", Math.floor);
      if (money === "NaN") {
        return 0;
      }
      return money;
    },
    lutfcWeb() {
      return this.data.lutfcWeb;
    },
    feeMin() {
      const money = numeral(this.lutfcWeb.feeMin)
        .divide(this.curExchangeRate)
        .format("0.0000", Math.floor);
      if (money === "NaN") {
        return 0;
      }
      return money;
    },
    feeMax() {
      const money = numeral(this.lutfcWeb.feeMax)
        .divide(this.curExchangeRate)
        .format("0.0000", Math.floor);
      if (money === "NaN") {
        return 0;
      }
      return money;
    },
    rechargeCodeQuantity() {
      return this.data.rechargeCodeQuantity;
    },
    playCodeQuantity() {
      return this.data.playCodeQuantity.toFixed(2);
    },
    playCodeQuantityNew() {
      return this.data.playCodeQuantityNew.toFixed(2);
    },
    diffQuantity() {
      return (this.rechargeCodeQuantity - this.playCodeQuantity).toFixed(2);
    },
    codeQuantityFlag() {
      return this.diffQuantity > 0 && this.lutfcWeb.codeQuantityStatus === "1";
    },
    currentTab() {
      return this.currentTabName;
    },
    // balance() {
    //   return numeral(this.user.balance).format("0.00", Math.floor);
    // },
    canTakeFreeTime() {
      const { startTime, endTime } = this.lutfcWeb;
      return this.currentTime < startTime || this.currentTime > endTime;
    },
    poundageMax() {
      return this.data.poundageMax;
    },
    poundagePercent() {
      return this.data.poundagePercent;
    },
    isPoundage() {
      return this.data.isPoundage === "1" && this.poundage > 0;
    },
    poundage() {
      let money = numeral(this.poundagePercent)
        .multiply(this.digiccyAmount)
        .format("0.00", Math.floor);
      if (money === "NaN") {
        money = 0;
      }
      if (Number(money) > Number(this.poundageMax)) {
        return numeral(this.poundageMax).format("0.00", Math.floor);
      } else {
        return money;
      }
    },
    disabledWithDrawBtn() {
      return (
        !this.fundPwd ||
        !this.amount ||
        !this.userBankId ||
        this.withdrawLoading
      );
    },
    digiccyAmount() {
      const amount = this.amount || 0;
      const money = numeral(amount)
        .multiply(this.curExchangeRate)
        .format("0.00", Math.floor);
      if (money === "NaN") {
        return 0;
      }
      return money;
    },
  },
  watch: {
    currentTab: {
      immediate: true,
      handler(n) {
        if (n === "currencyPay") {
          this.$emit("handler-spin", true);
          getUserPayPwd()
            .then((response) => {
              this.$emit("handler-spin", false);
              if (response.data.code !== 0) return;
              if (response.data.data.payPwdFlag !== "1") {
                this.step = Steps.kSetFundPwd;
              } else {
                this.init();
              }
            })
            .catch((e) => {
              this.$emit("handler-spin", false);
            });
        }
      },
    },
    data() {
      this.init();
    },
  },
  created() {
    this.queryLotUser();
    this.queryBalance();
  },
  beforeDestroy() {
    clearInterval(this.curTimeTimer);
  },
  methods: {
    init() {
      this.step = Steps.kWithdraw;
      if (this.lotUserDigiccyList.length) {
        this.userBankId = this.lotUserDigiccyList[0].userBankId;
        this.amount = this.feeMin;
      } else {
        if (this.$store.getters.sysRealName == 1) {
          this.show2BindDigiccy = true;
        }
      }
      this.currentTime = this.data.currentTime;
      this.curTimeTimer = setInterval(() => {
        this.currentTime += 1000;
      }, 1000);
    },
    queryLotUser() {
      this.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.userInfo = response.data.data;
        });
    },
    async queryBalance() {
      const response = await queryBalance();
      if (response.data.code !== 0) return;
      let data = response.data.data;
      this.balanceWithDraw = data.balanceWithDraw;
    },
    onFundPwdSubmitSuc() {
      this.showFundPwd = false;
      this.init();
    },
    async onWithdrawClick() {
      if (this.withdrawLoading) {
        return;
      }
      this.withdrawLoading = true;
      // 强制实名
      if (this.$store.getters.sysRealName == 1 && !this.user.realName) {
        this.show2BindDigiccy = true;
        return;
      }
      const response = await this.$http.post(
        "/api/v2/user/takeFee",
        {
          totalFee: this.digiccyAmount,
          digiccyNum: this.amount,
          userBankId: this.userBankId,
          payPwd: encryption.encrypt.md5(this.fundPwd),
          type: "03",
          takeType: "03",
        },
        { userId: true }
      );
      this.withdrawLoading = false;
      if (response.data.code !== 0) {
        return;
      }
      this.step = Steps.kSuccess;
    },
    jump2TakeFee() {
      this.$router.push({
        name: "personalCenter",
        params: { id: "trade", label: "trade_recharge" },
      });
    },
    jump2BindDigiccy() {
      this.show2BindDigiccy = false;
      let label = "currency";
      if (
        this.lotUserDigiccyList.length &&
        this.$store.getters.sysRealName == 1 &&
        !this.user.realName
      ) {
        label = "bankAccount";
      }
      this.$router.push({
        name: "personalCenter",
        params: {
          id: "account",
          label: label,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.currency-pay {
  padding-top: 12px;
}

.currency-pay-tips {
  padding: 10px 23px;
  border: 1px solid #d5d5d5;
}

.currency-pay-tips__header {
  height: 30px;
  font-size: 0;
  overflow: hidden;
}

.currency-pay-tips__title {
  display: inline-block;
  height: 30px;
  vertical-align: top;
  padding: 6px 0;
  margin-left: 14px;
  font-size: 14px;
  color: @primary-color;
}

.currency-pay-tips__content {
  padding-top: 10px;
}

.currency-pay-tips__content li {
  line-height: 20px;
  background: url("/static/images/warn-square.png") no-repeat left center;
  font-size: 12px;
  padding-left: 10px;
}

.currency-pay-tips__content li .red-color {
  color: @primary-color;
}

.currency-pay-title {
  font-size: 14px;
}

.currency-pay-text {
  font-size: 12px;
  color: #b2b2b2;
}

.currency-pay-text--primary {
  color: #ff5252;
}

.currency-pay-bg {
  background-color: #f6f6f6;
  padding: 10px 14px;
}

.currency-pay-amount {
  display: flex;
  width: 300px;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  padding: 5px 0;
  margin-bottom: 10px;

  .zk-input-wrap {
    flex: 1;

    @{deep} {
      .zk-input__inner {
        width: 100%;
        border: none;
        text-align: right;
        font-size: 14px;

        &:hover,
        &:focus {
          border-color: transparent;
          box-shadow: none;
        }
      }
    }
  }
}

.currency-pay-exchange {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  .currency-pay-title {
    margin-bottom: 10px;
  }

  .currency-pay-bg {
    display: inline-block;
  }
}

.currency-pay-amount-text {
  margin-bottom: 20px;
}

.currency-pay-address {
  display: flex;
  padding: 18px 0 0px;

  .currency-pay-title {
    margin-bottom: 10px;
  }

  .ivu-select {
    margin-bottom: 10px;
  }
}

.currency-pay-button {
  padding: 10px 25px;
  height: auto;
  margin-left: 50px;
}

.currency-pay-confirm {
  float: left;
  margin-left: 20px;
}

.currency-pay-confirm span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}

.currency-pay-confirm p > span {
  font-size: 16px;
  font-weight: normal;
}

.currency-pay-pwd {
  .currency-pay-title {
    margin-bottom: 10px;
  }

  .ivu-input-wrapper {
    margin-bottom: 24px;
    width: 180px;
  }
}
.frequency {
  display: flex;
  align-items: center;
  span {
    height: auto;
    margin: 0 5px;
  }
}
.currency-pay-suc {
  margin-top: 86px;
}

.currency-pay-suc__confirmicon {
  float: left;
  width: 60px;
  height: 60px;
  margin-left: 170px;
  background: url("~@/assets/images/icon.png") no-repeat -76px -509px;
}

.currency-pay-suc__confirm1 {
  float: left;
  margin-left: 20px;
}

.currency-pay-suc__confirm1 span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}

.currency-pay-suc__confirm1 p > span {
  font-size: 16px;
  font-weight: normal;
}

.currency-pay-suc__confirmbutton {
  margin-left: 290px;
  margin-top: 28px;
  width: 162px;
}

.code-quantity-flag-tips {
  font-size: 12px;
}
</style>
