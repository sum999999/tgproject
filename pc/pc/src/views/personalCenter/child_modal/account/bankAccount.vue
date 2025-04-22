<template>
  <div class="bankAccount">
    <div class="bank-card-add-list">
      <div
        v-for="(bank, index) in list"
        :key="index"
        class="bank-card-add-list__item bank-card-bank"
        :class="{
          active: curIndex === index,
        }"
        @click="onBankCardSelected(index)"
      >
        <Icon type="card"></Icon>
        <Icon type="android-done"></Icon>
        <div class="bank-card-bank__content">
          <p class="bank-card-bank__title">
            <span>{{ bank.bankName }}</span>
            <span>{{ bank.accountName | formatName }}</span>
          </p>
          <p class="bank-card-bank__text">{{ bank.openBankName }}</p>
          <p class="bank-card-bank__text">{{ bank.bankNo | formatBankNo }}</p>
        </div>
      </div>
      <div
        v-if="canAddBankCard"
        class="bank-card-add-list__item bank-card-add"
        @click="onBankAddClick"
      >
        <i class="bank-icon-add"></i>
        <p>{{ $tex("添加银行卡号") }}</p>
      </div>
    </div>
    <template v-if="!showBindBankCard && bankCardSelected">
      <accountCard>
        <img src="/static/images/yinlian.png" alt="" slot="cardImg" />
        <div slot="cardContent">
          <div class="addContent">
            <Form :label-width="100">
              <FormItem :label="`${$tex('真实姓名')} :`">
                <Input
                  type="text"
                  :value="curBankCard.accountName | formatName"
                  disabled
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('银行账户')} :`">
                <Input
                  type="text"
                  :placeholder="$tex('请输入银行卡号')"
                  :value="curBankCard.bankNo | formatBankNo"
                  disabled
                >
                </Input>
              </FormItem>
              <FormItem :label="`${$tex('银行名称')} :`">
                <Input
                  type="text"
                  :value="curBankCard.bankName"
                  disabled
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('开户行')} :`">
                <Input
                  type="text"
                  :value="curBankCard.openBankName"
                  disabled
                ></Input>
              </FormItem>
              <FormItem v-if="showAccountMsg" :label="`${$tex('账户信息')} :`">
                <Input
                  type="text"
                  :value="curBankCard.accountMsg"
                  disabled
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('状态')} :`">
                <Input
                  type="text"
                  disabled
                  v-if="curBankCard.status == 1"
                  :value="$tex('正常')"
                ></Input>
                <Input
                  type="text"
                  disabled
                  v-else
                  :value="$tex('异常')"
                ></Input>
              </FormItem>
            </Form>
          </div>
        </div>
      </accountCard>
      <button
        v-if="unBindBank === '1' && sysApiPhoneOpen"
        type="button"
        class="ivu-btn ivu-btn-primary unbind-btn"
        @click="onBankUnBind"
      >
        <i class="ivu-icon iconfont icon-bank"></i
        ><span>{{ $tex("解绑银行账户") }}</span>
      </button>
    </template>
    <template v-if="showBindBankCard && !bankCardSelected">
      <div class="bankAccount-content">
        <Form
          :model="card"
          ref="addCard"
          :label-width="90"
          :rules="addCardRule"
        >
          <FormItem :label="`${$tex('真实姓名')}:`" prop="accountName">
            <Input
              v-if="this.user.realName"
              type="text"
              :value="this.user.realName | formatName"
              :placeholder="$tex('真实姓名')"
              :disabled="!!this.user.realName"
            ></Input>
            <Input
              v-else
              type="text"
              v-model="card.accountName"
              :placeholder="$tex('真实姓名')"
            ></Input>
          </FormItem>
          <FormItem :label="`${$tex('银行账号')} :`" prop="bankNo">
            <Input
              type="text"
              :placeholder="$tex('请输入银行卡号')"
              :value="card.bankNo"
              :maxlength="19"
              @on-change="onBankChange"
              @input="card.bankNo = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
          </FormItem>
          <FormItem :label="`${$tex('银行名称')} :`" prop="bankName">
            <Input
              v-if="checkChineseKey()"
              type="text"
              v-model="card.bankName"
              :placeholder="$tex('银行名称')"
            ></Input>
            <Select
              v-else
              v-model="card.bankName"
              class="bank-select"
              :placeholder="$tex('银行名称')"
            >
              <Option
                v-for="internat in internatBankList"
                :key="internat.bankCode"
                class="bank-select__item"
                :value="internat.bankName"
                :label="internat.bankName"
              >
                <img :src="internat.imgUrl" alt="" />
                <span>{{ internat.bankName }}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="`${$tex('开户行')} :`" prop="openBankName">
            <Input
              type="text"
              v-model="card.openBankName"
              :placeholder="$tex('请输入开户行')"
            ></Input>
          </FormItem>
          <FormItem
            v-if="showAccountMsg"
            :label="`${$tex('账户信息')} :`"
            prop="accountMsg"
          >
            <Input
              type="text"
              v-model="card.accountMsg"
              :placeholder="$tex('IFSC信息必填')"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div class="card-submit">
        <p style="color:#be1204;margin-bottom: 60px; overflow:hidden">
          <i class="iconfont icon-warn"></i
          ><span class="warn-word">{{
            $tex(
              "尊敬的用户，为了保障您的资金安全，请您绑定您的真实姓名和设置取款密码。如果姓名与开户名不一致，将无法取款"
            )
          }}</span>
        </p>
        <div class="addBtn">
          <button
            type="button"
            class="ivu-btn ivu-btn-primary"
            @click="cardSaveSubmit"
          >
            <i class="ivu-icon iconfont icon-bank"></i
            ><span>{{ $tex("添加银行账户") }}</span>
          </button>
        </div>
      </div>
    </template>
    <phone-bind-dialog
      v-model="isShowPhoneValidate"
      type="6"
      :title="$tex('解绑银行账户')"
      :submit="phoneValidateSubmit"
      @cancel="onPhoneValidateCancel"
      @success="onPhoneValidateSuccess"
    ></phone-bind-dialog>
  </div>
</template>
<script>
import accountCard from "./accountCard";
import PhoneBindDialog from "@/components/PhoneBindDialog";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";
import { checkChineseKey } from "@/lang";

export default {
  components: {
    accountCard,
    PhoneBindDialog,
  },
  data() {
    //姓名验证规则
    let addChineseCheck = null;
    if (hasPermission("validator.chinese")) {
      addChineseCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        } else if (!/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的中文字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else if (value.length < 2 || value.length > 16) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的中文字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else {
          callback();
        }
      };
    } else {
      addChineseCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        } else if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
            value
          )
        ) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else if (value.length < 2 || value.length > 16) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else {
          callback();
        }
      };
    }
    //银行名称、开户行验证规则
    let addBankNameCheck = null;
    if (hasPermission("validator.chinese")) {
      addBankNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入银行名称")));
        }
        if (!/^[^\u0000-\u00FF]*$/.test(value)) {
          callback(new Error(this.$tex("请输入中文")));
        } else {
          callback();
        }
      };
    } else {
      addBankNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入银行名称")));
        }
        if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
            value
          )
        ) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else {
          callback();
        }
      };
    }
    let addOPenNameCheck = null;
    if (hasPermission("validator.chinese")) {
      addOPenNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入开户名称")));
        }
        if (!/^[^\u0000-\u00FF]*$/.test(value)) {
          callback(new Error(this.$tex("请输入中文")));
        } else {
          callback();
        }
      };
    } else {
      addOPenNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入开户名称")));
        }
        if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
            value
          )
        ) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else {
          callback();
        }
      };
    }

    const bankNum = (rule, value, callback) => {
      let vm = this;
      if (!value) {
        callback(new Error(this.$tex("请输入银行账号")));
      }
      let role = /^[0-9]*$/;

      if (!role.test(value) && !this.isInternational) {
        callback(new Error(this.$tex("只能输入数字")));
      } else if (!this.isInternational && `${value}`.length < 16) {
        callback(new Error(this.$tex("请输入正确的银行卡号")));
      } else {
        this.$http
          .post(
            "/api/v2/user/queryBankFrom",
            { bankNo: value },
            { userId: true, stopDialog: true, unenc: true }
          )
          .then((response) => {
            if (response.data.code !== 0) {
              callback();
              return;
            }
            let data = response.data.data;
            vm.card.bankName = data.bankName;
            callback();
          });
      }
    };
    return {
      curIndex: -1,
      unBindBank: "0",
      accountMsgConfig: "0",
      showBindBankCard: false,
      isShowPhoneValidate: false,
      card: {
        accountName: "",
        bankName: "",
        bankNo: "",
        type: "00",
        openBankName: "" /*,certNo:''*/,
        accountMsg: "",
      },
      realName: "",
      list: [],
      //卡号验证
      addCardRule: {
        accountName: [
          { message: this.$tex("真实姓名不能为空"), trigger: "blur" },
          { validator: addChineseCheck, trigger: "blur" },
        ],
        bankNo: [
          { message: this.$tex("银行卡号不能为空"), trigger: "blur" },
          { validator: bankNum, trigger: "blur" },
        ],
        bankName: [
          { message: this.$tex("银行卡名称不能为空"), trigger: "blur" },
          { validator: addBankNameCheck, trigger: "blur" },
        ],
        openBankName: [
          { message: this.$tex("开户行不能为空"), trigger: "blur" },
          { validator: addOPenNameCheck, trigger: "blur" },
        ],
        accountMsg: [
          { message: this.$tex("账户信息不能为空"), trigger: "blur" },
        ],
      },
      sysDict: {},
      internatBankList: [],
    };
  },
  computed: {
    ...mapGetters(["sysApiPhoneOpen", "isInternational"]),
    user() {
      return this.$store.state.user;
    },
    servicer() {
      return this.$store.state.servicer;
    },
    bankCardSelected() {
      return this.curIndex !== -1;
    },
    curBankCard() {
      return (
        this.list[this.curIndex] || {
          userBankId: "",
          userId: "",
          bankName: "",
          bankNo: "",
          accountName: "",
          openBankName: "",
          accountMsg: "",
          certNo: null,
          status: "",
          type: "",
          imgUrl: null,
        }
      );
    },
    isSupportMultiBank() {
      return false;
    },
    canAddBankCard() {
      return this.list.length < this.USER_BANK_MAXNUM;
    },
    USER_BANK_MAXNUM() {
      return +this.sysDict["USER_BANK_MAXNUM"] || 1;
    },
    showAccountMsg() {
      return this.accountMsgConfig === "1";
    },
  },
  filters: {
    formatBankNo(bankNo) {
      return (
        bankNo.slice(0, 4) +
        bankNo.slice(4, bankNo.length - 4).replace(/\d/g, "*") +
        bankNo.slice(bankNo.length - 4)
      );
    },
    formatName(name) {
      let newStr;
      if (name.length === 2) {
        newStr = name.substr(0, 1) + "*";
      } else if (name.length > 2) {
        var char = "";
        for (var i = 0, len = name.length - 2; i < len; i++) {
          char += "*";
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }
      return newStr;
    },
  },
  methods: {
    hasPermission,
    checkChineseKey,
    onBankAddClick() {
      this.showBindBankCard = true;
      this.curIndex = -1;
    },
    onBankCardSelected(index) {
      this.curIndex = index;
      this.showBindBankCard = false;
    },
    onBankChange(event) {
      this.$nextTick(() => {
        event.target.value = this.card.bankNo = event.target.value.replace(
          /\s+/g,
          ""
        );
      });
    },
    phoneValidateSubmit(obj) {
      const { smsPhoneCode } = obj;
      const { userBankId } = this.curBankCard || {};
      return this.$http.post(
        "/api/v2/user/unBindBank",
        {
          type: "0",
          bankId: userBankId,
          smsPhoneCode: smsPhoneCode,
        },
        {
          userId: true,
        }
      );
    },
    onPhoneValidateSuccess() {
      this.showBindBankCard = true;
      this.getBankList();
    },
    onPhoneValidateCancel() {
      this.isShowPhoneValidate = false;
    },
    onBankUnBind() {
      if (!this.user.phone) {
        this.$Modal.confirm({
          title: this.$tex("操作提示"),
          content: this.$tex("当前用户未绑定手机号,请联系在线客服进行解绑!"),
          okText: this.$tex("联系客服"),
          onOk: () => {
            window.open(this.servicer.url, "_blank");
          },
        });
        return;
      }
      this.isShowPhoneValidate = true;
    },
    getBankList() {
      this.$emit("handler-spin", true);
      let vm = this;
      vm.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.$emit("handler-spin", false);
          let data = response.data.data;
          vm.internatBankList = data.internatBankList || [];
          vm.list = data.lotUserBankList || [];
          vm.unBindBank = data.unBindBank;
          vm.accountMsgConfig = data.accountMsgConfig;
          vm.switchBankCardView();
        });
    },
    switchBankCardView() {
      if (this.list.length) {
        this.curIndex = 0;
      } else {
        this.showBindBankCard = true;
      }
    },
    resetFormStatus() {
      //重置添加银行卡表单的状态
      this.$refs.addCard.resetFields();
    },
    cardSaveSubmit() {
      this.$refs.addCard.validate((valid) => {
        if (valid) {
          if (this.isSubmit) return;
          this.isSubmit = true;
          this.$http
            .post("/api/v2/user/bandingBankInfo", this.card, { userId: true })
            .then((response) => {
              this.isSubmit = false;
              if (response.data.code !== 0) return;
              this.$Message.success(this.$tex("添加银行卡成功"));
              this.getBankList();
              this.user.realName = this.card.accountName;
              localStorage.setItem("user", JSON.stringify(this.user));
              this.$store.commit("getUser", this.user);
              this.$refs.addCard.resetFields();
              this.onBankCardSelected(0);
              this.getBankList();
            });
        }
      });
    },
    getRealName() {
      if (!this.user.realName) return;
      let name = this.user.realName;
      this.card.accountName = name;
      let str = "";
      for (let i = 0; i < name.length; i++) {
        if (i !== name.length - 1) {
          str += "*";
        } else {
          str += name[i];
        }
      }
      this.realName = str;
    },
  },
  created() {
    let vm = this;
    this.getBankList();
    this.getRealName();
    this.$store.dispatch("querySystemConfig").then((data) => {
      this.sysDict = data;
    });
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@{deep} .ivu-input[disabled],
@{deep} fieldset[disabled] .ivu-input {
  color: #313131;
  background-color: #fff;
}

.unbind-btn {
  display: block;
  margin: 40px auto 0;
}

.bankAccount {
  margin-top: 10px;

  @{deep} .ivu-btn {
    height: 44px;
    line-height: 44px !important;
    padding: 0 27px;

    & > span {
      display: inline-block;
      font-size: 16px;
      margin-left: 10px;
      line-height: 44px;
      float: right;
    }
  }

  @{deep} .icon-warn {
    font-size: 16px;
    float: left;
  }

  .warn-word {
    width: 298px;
    float: left;
    margin-left: 10px;
  }

  @{deep} .icon-bank {
    font-size: 36px;
    line-height: 44px !important;
  }

  .card-submit {
    width: 324px;
    margin: auto;

    .addBtn {
      text-align: center;
    }
  }
}

.bankAccount-content {
  width: 280px;
  margin: auto;

  @{deep} .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
}

@{deep} .ivu-form .ivu-form-item-label {
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines;
}

@{deep} .ivu-input:hover {
  box-shadow: none;
  border-color: #dddee1;
}

@{deep} .ivu-input:focus {
  box-shadow: none;
  border-color: #dddee1;
}

.addContent {
  width: 280px;
  margin: auto;

  @{deep} .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }

  @{deep} .ivu-form-item {
    margin-bottom: 20px;
  }
}
.bank-icon-add {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: url("~@/assets/images/bank-add.png") center center no-repeat;
  background-size: contain;
}
.bank-card-add-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .bank-card-add-list__item:nth-child(2n + 1) {
    margin-right: 2%;
  }
}
.bank-card-add,
.bank-card-bank {
  border: 1px solid #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  height: 80px;
  width: 48%;
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 4px 12px 0px #f3f3f3;
  .ivu-icon-android-done {
    display: none;
  }
  &.active {
    border: 1px solid #ec0022;
    .ivu-icon-android-done {
      position: absolute;
      right: 5px;
      bottom: -2px;
      color: #fff;
      z-index: 1;
      font-size: 20px;
      display: inline;
    }
    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-bottom: 30px solid #ec0022;
      border-left: 40px solid transparent;
    }
  }
  p {
    margin-top: 6px;
  }
}
.bank-card-bank {
  flex-direction: row;
  padding: 20px;
  color: #333333;
  .ivu-icon-card {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    padding-right: 20px;
    font-size: 28px;
    color: #d62629;
  }
  p {
    margin-top: 0px;
  }
}
.bank-card-bank__content {
  flex: 1;
}
.bank-card-bank__text {
  color: #999999;
  font-size: 12px;
}
.bank-card-bank__title {
  display: flex;
  justify-content: space-between;
}
.bank-select {
  .bank-select__item {
    display: flex;
    align-items: center;
    img {
      float: none;
      width: 40px;
    }
    span {
      white-space: normal;
      padding-left: 10px;
    }
  }
}
</style>
