<!-- 免提直冲页 -->
<template>
  <div class="free-charge">
    <div v-if="step === Steps.kSetFundPwd" class="fund-pass">
      <div class="fund-pass__confirm">
        <!--                <span>{{$tex("提示")}}</span>-->
        <!--                <br/>-->
        <!--                <br/>-->
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
    <Form
      v-if="step === Steps.kFreeCharge"
      :model="freeCharge"
      class="free-charge-form"
    >
      <FormItem class="free-charge-form__item" :label="`${$tex('可用余额')}：`">
        <div class="free-charge-form__money">
          <span
            >{{ $tex("￥") }}{{ user.balanceWithDraw | keepDecimalOf2 }}</span
          >
          <span
            v-if="hasPermission('element.coin')"
            class="balanceWithDraw-rate"
          >
            ≈ {{ localBalance }}{{ sysExchangeInfo.scurIcon }}
            <Icon
              type="ios-loop-strong"
              class="animate__animated animate__infinite"
              :class="{
                animate__rotate: turnRoundBalance,
              }"
              @click.native="refreshBalance"
            ></Icon>
          </span>
        </div>
        <Row>
          <Col span="12">
            <i18n
              v-if="codeQuantityFlag"
              class="free-charge-form__tips"
              path="尊敬的用户，您目前的投注是{money1}{unit}，不达成充值条件，不便之处敬请原谅！（还需投注{money2}{unit}）如有疑问，清联系在线客服"
              tag="p"
            >
              <template slot="money1">
                {{ sysPlayCodeQuantity }}
              </template>
              <template slot="money2">
                {{ sysDiffQuantity }}
              </template>
              <template slot="unit">
                {{
                  hasPermission("element.unit") ? sysExchangeInfo.scurIcon : "¥"
                }}
              </template>
            </i18n>
            <p
              class="frequency"
              v-show="
                userInfo.remainingHandsFreeTimes ||
                  userInfo.remainingHandsFreeTimes == 0
              "
            >
              您当日剩余免提直充次数
              <span class="free-charge-form__tips" style="color:#e4393c ">
                {{ userInfo.remainingHandsFreeTimes }}
              </span>
              次
            </p>
          </Col>
        </Row>
      </FormItem>
      <FormItem
        class="free-charge-form__item unit"
        :label="`${$tex('充值金额')}：`"
      >
        <Row>
          <Col span="6">
            <zk-input
              v-model="freeCharge.totalFee"
              type="digit"
              :digitilen="2"
              :min="0"
              :max="maxAmount"
              :placeholder="$tex('请输入充值金额')"
            >
            </zk-input>
            <span class="input-suffix">{{ $tex("¥") }}</span>
          </Col>
        </Row>
        <!--                <div v-if="showCurrencyExchange" class="currency-exchange">-->
        <!--                    <img src="~@/assets/images-v6/jinggao.png" alt="">-->
        <!--                    {{ freeCharge.totalFee }}{{sysExchangeInfo.scur}}={{ sysExChangeMoney }}{{sysExchangeInfo.tcur}}-->
        <!--                </div>-->
        <!-- 免提直充描述 -->
        {{ $store.getters.sysSystemConfig.HANDSFEE_RECHARGE_DESC }}
      </FormItem>
      <FormItem class="free-charge-form__item" :label="`${$tex('资金密码')}：`">
        <Col span="6">
          <Input
            v-model="freeCharge.payPwd"
            :maxlength="4"
            type="password"
            autocomplete="off"
            :placeholder="$tex('请输入资金密码')"
          ></Input>
        </Col>
      </FormItem>
      <FormItem class="free-charge-form__item">
        <Button
          type="primary"
          @click="onSubmit"
          :loading="submitFlag"
          :disabled="submitDisabled"
          >{{ $tex("提交申请") }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import numeral from "numeral";
import encryption from "@/utils/md5";
import { getUserPayPwd } from "@/api/user";
import ModifyFundPwd from "@/components/modifyFundPwd";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";
import { ZkInput } from "@/components/ZkInput";
import { queryLotUserBankInfo, handsfeeRecharge } from "@/api/user";

const Steps = {
  kSetFundPwd: "kSetFundPwd",
  kFreeCharge: "kFreeCharge",
};

export default {
  name: "freeCharge",
  components: {
    ModifyFundPwd,
    ZkInput,
  },
  data() {
    return {
      Steps,
      step: "",
      showFundPwd: false,
      freeCharge: {
        totalFee: "",
        payPwd: "",
      },
      userBankInfo: {},
      submitFlag: false,
      turnRoundBalance: false,
      userInfo: "",
    };
  },
  computed: {
    ...mapGetters(["user", "sysExchangeInfo"]),
    showCurrencyExchange() {
      return (
        hasPermission("element.currencyExchange") &&
        this.freeCharge.totalFee &&
        this.sysExchangeInfo.scur &&
        this.sysExchangeInfo.tcur
      );
    },
    sysExChangeMoney() {
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      const money = this.freeCharge.totalFee || 0;
      return numeral(money)
        .multiply(exchangeRate)
        .format("0.00", Math.floor);
    },
    maxAmount() {
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      const money = this.user.balanceWithDraw || 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00", Math.floor);
    },
    lutfcWeb() {
      return this.userBankInfo.lutfcWeb || {};
    },
    playCodeQuantity() {
      return (
        this.userBankInfo.playCodeQuantity &&
        this.userBankInfo.playCodeQuantity.toFixed(2)
      );
    },
    rechargeCodeQuantity() {
      return this.userBankInfo.rechargeCodeQuantity;
    },
    diffQuantity() {
      return (this.rechargeCodeQuantity - this.playCodeQuantity || 0).toFixed(
        2
      );
    },
    sysPlayCodeQuantity() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.convert2UserExChange(this.playCodeQuantity));
      }
      return this.playCodeQuantity;
    },
    sysDiffQuantity() {
      if (hasPermission("element.currencyExchange")) {
        return Math.ceil(this.convert2UserExChange(this.diffQuantity));
      }
      return this.diffQuantity;
    },
    codeQuantityFlag() {
      if (this.diffQuantity > 0 && this.lutfcWeb.codeQuantityStatus === "1") {
        return true;
      } else {
        return false;
      }
    },
    submitDisabled() {
      return (
        this.user.balanceWithDraw < 0 ||
        this.codeQuantityFlag > 0 ||
        !(this.freeCharge.totalFee > 0) ||
        this.freeCharge.payPwd.length !== 4
      );
    },
    localBalance() {
      return +numeral(this.user.balanceWithDraw)
        .divide(this.sysExchangeInfo.exchangeRate || 1)
        .format("0.00", Math.floor);
    },
  },
  mounted() {
    this.$emit("handler-spin", true);
    this.getUserPayPwd();
    this.refreshBalance();
    // 获取用户信息的免提直充次数
    this.queryLotUser();
  },
  methods: {
    hasPermission,
    queryLotUser() {
      this.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.userInfo = response.data.data;
          console.log("this.userInfo", this.userInfo);
        });
    },
    refreshBalance() {
      if (this.turnRoundBalance) {
        return;
      }
      this.turnRoundBalance = true;
      this.$http
        .post("/api/v2/user/balanceAdnSign", {}, { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          let { balanceWithDraw, levelId } = response.data.data;
          let user = Object.assign({}, this.user, {
            balanceWithDraw: balanceWithDraw,
            levelId: levelId,
          });
          this.$store.commit("getUser", user);
          this.turnRoundBalance = false;
        });
    },
    convert2UserExChange(money) {
      // 当前货币money -> 官方货币
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      money = money || 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00");
    },
    async getUserPayPwd() {
      const pwdResp = await getUserPayPwd();
      if (pwdResp.data.code !== 0) return;
      if (pwdResp.data.data.payPwdFlag !== "1") {
        this.$emit("handler-spin", false);
        return (this.step = Steps.kSetFundPwd);
      }
      this.freeChargeHandler();
    },
    async freeChargeHandler() {
      const userBankInfoResp = await queryLotUserBankInfo();
      this.userBankInfo = userBankInfoResp.data.data;
      this.$emit("handler-spin", false);
      this.step = Steps.kFreeCharge;
    },
    onFundPwdSubmitSuc() {
      this.showFundPwd = false;
      this.freeChargeHandler();
    },
    async onSubmit() {
      if (this.submitFlag) {
        return void 0;
      }
      this.submitFlag = true;

      const resp = await handsfeeRecharge({
        ...this.freeCharge,
        payPwd: encryption.encrypt.md5(this.freeCharge.payPwd),
      });
      this.submitFlag = false;
      if (resp.data.code !== 0) return;
      this.freeCharge.totalFee = "";
      this.freeCharge.payPwd = "";
      this.$Message.success(this.$tex("充值申请成功"));
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.free-charge {
  padding: 30px;
  .balanceWithDraw-rate {
    margin-left: 60px;
    font-size: 12px;
    vertical-align: bottom;
  }
}
.currency-exchange {
  font-size: 14px;
  color: #b2b2b2;
  padding-left: 60px;
  padding-top: 4px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    float: none;
    vertical-align: text-bottom;
  }
}
.currency-detail-form {
  @{deep} {
    .ivu-form-item-label:before {
      display: none;
    }

    .ivu-form-item-content {
      position: relative;
    }
  }
}

.fund-pass__confirm {
  float: left;
  margin-left: 20px;
}

.fund-pass__confirm span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}

.fund-pass__confirm p > span {
  font-size: 16px;
  font-weight: normal;
}

.free-charge-form {
  position: relative;
  @{deep} {
    .ivu-form-item-label {
      padding-right: 0;
    }
  }
  .free-charge-form__money {
    font-size: 20px;
    font-weight: bold;
  }
  .free-charge-form__tips {
    color: #ddc17c;
    line-height: 1.5;
  }
  .frequency {
    display: flex;
    align-items: center;
    span {
      height: auto;
      margin: 0 5px;
    }
  }
  .unit {
    @{deep} {
      input {
        padding-right: 16px;
      }
      .zk-input__inner {
        width: 100%;
      }
    }
    .input-suffix {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      padding-top: 2px;
    }
  }
}
.ivu-icon-ios-loop-strong {
  cursor: pointer;
}
</style>
