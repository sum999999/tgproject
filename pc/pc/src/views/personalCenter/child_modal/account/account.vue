<template>
  <div class="my-account">
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.label"
          @click="clkLabel(item)"
          :class="{ active: label === item.label }"
        >
          <span>{{ item.name }}</span>
          <i v-if="item.interval"></i>
        </li>
      </ul>
    </div>
    <div class="account-content">
      <material
        v-if="label === 'material'"
        @realNameReg="realNameReg"
        v-on="$listeners"
      ></material>
      <modify-password
        v-else-if="label === 'modifyPassword'"
        v-on="$listeners"
      ></modify-password>
      <bank-account
        v-if="label === 'bankAccount'"
        v-on="$listeners"
      ></bank-account>
      <ali-pay-account
        v-if="label === 'aliPay'"
        v-on="$listeners"
        @realNameReg="realNameReg"
      ></ali-pay-account>
      <we-chat-account
        v-if="label === 'weChatPay'"
        v-on="$listeners"
        @weChatRealNameReg="weChatRealNameReg"
        @returnsHomepage="returnsHomepage"
      ></we-chat-account>
      <currency-account
        v-if="label === 'currency' && userBankInfo"
        :user-bank-info="userBankInfo"
        @update="updateBankInfo"
        @jump-bank="label = 'bankAccount'"
        @jump-base-info="label = 'material'"
      />
      <pay-account
        v-if="label === 'payAccount'"
        v-on="$listeners"
      ></pay-account>
    </div>
  </div>
</template>

<script>
import { UserTypes } from "@/constant/user";

import material from "./material";
import modifyPassword from "./modify_password";
import bankAccount from "./bankAccount";
import aliPayAccount from "./aliPayAccount";
import weChatAccount from "./weChatAccount";
import currencyAccount from "./currencyAccount";
import payAccount from "./payAccount";

export default {
  inheritAttrs: false,
  components: {
    material,
    modifyPassword,
    bankAccount,
    aliPayAccount,
    weChatAccount,
    currencyAccount,
    payAccount,
  },
  data() {
    return {
      label: this.$route.params.label || "material",
      tabList: [
        { name: this.$tex("基本资料"), label: "material" },
        { name: this.$tex("修改密码"), label: "modifyPassword" },
      ],
      userBankInfo: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    returnsHomepage(bol) {
      if (bol) {
        this.label = "material";
      }
    },
    realNameReg(bol) {
      if (bol) {
        this.label = "bankAccount";
      }
    },
    weChatRealNameReg(bol) {
      if (bol) {
        this.label = "bankAccount";
      }
    },
    clkLabel(item) {
      if (!this.user.userCode || this.user.userType === UserTypes.TRY_PLAY) {
        this.$Modal.error({
          title: this.$tex("温馨提示"),
          content: `<p>${this.$tex("您没有权限操作")}</p>`,
          onOk: function() {},
        });
        return;
      }
      this.label = item.label;
    },
    init() {
      this.handleUserBankInfo();
    },
    async updateBankInfo() {
      this.$emit("handler-spin", true);
      await this.handleUserBankInfo();
      this.$emit("handler-spin", false);
    },
    async handleUserBankInfo() {
      let response = await this.$http.post(
        "/api/v2/user/queryLotUserBankInfo",
        "",
        { userId: true }
      );
      if (response.data.code !== 0) return;
      this.userBankInfo = response.data.data;
      let {
        isBank,
        isAlipay,
        isWechat,
        isDigiccy,
        isUniversal,
      } = response.data.data;
      this.tabList.splice(2);
      if (isBank === "1") {
        this.tabList.splice(this.tabList.length, 1, {
          name: this.$tex("银行账号"),
          label: "bankAccount",
        });
      }
      if (isAlipay === "1") {
        this.tabList.splice(this.tabList.length, 1, {
          name: this.$tex("支付宝账号"),
          label: "aliPay",
        });
      }
      if (isWechat === "1") {
        this.tabList.splice(this.tabList.length, 1, {
          name: this.$tex("微信账号"),
          label: "weChatPay",
        });
      }
      if (isDigiccy === "1") {
        this.tabList.splice(this.tabList.length, 1, {
          name: this.$tex("数字货币"),
          label: "currency",
        });
      }
      if (isUniversal === "1") {
        this.tabList.splice(this.tabList.length, 1, {
          name: this.$tex("支付卡"),
          label: "payAccount",
        });
      }
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.tab {
  font-size: 16px;
  text-align: center;
  ul {
    display: flex;
  }
}
.tab li {
  padding: 0 10px 10px;
  cursor: pointer;
  position: relative;
  width: 100%;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab li.active {
  /*   border-bottom: 2px solid @primary-color;
  color: @primary-color; */
}
.tab li i {
  position: absolute;
  right: 0;
  top: 14px;
  height: 12px;
  width: 1px;
  background: #c0c0c0;
}
.account-content {
  padding-top: 38px;
}
</style>
