<template>
  <div class="payAccount">
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
        <!--                <Icon type="card"></Icon>-->
        <img class="bank-card-add-list__logo" :src="bank.universalUrl" alt="" />
        <Icon type="android-done"></Icon>
        <div class="bank-card-bank__content">
          <p class="bank-card-bank__title">
            <span>{{ bank.bankName }}</span>
            <span>{{ bank.accountName | formatName }}</span>
          </p>
          <p class="bank-card-bank__text">{{ bank.accountMsg }}</p>
          <p class="bank-card-bank__text">{{ bank.bankNo | formatBankNo }}</p>
        </div>
      </div>
      <div
        v-if="canAddBankCard"
        class="bank-card-add-list__item bank-card-add"
        @click="onBankAddClick"
      >
        <i class="bank-icon-add"></i>
        <p>{{ $tex("添加") }}</p>
      </div>
    </div>
    <template v-if="bankCardSelected">
      <accountCard>
        <img :src="curBankCard.universalUrl" alt="" slot="cardImg" />
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
              <FormItem :label="`${$tex('平台账号')} :`">
                <Input
                  type="text"
                  :placeholder="$tex('平台账号')"
                  :value="curBankCard.bankNo | formatBankNo"
                  disabled
                >
                </Input>
              </FormItem>
              <FormItem :label="`${$tex('平台选择')} :`">
                <Input
                  type="text"
                  :value="curBankCard.bankName"
                  disabled
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('账户信息')} :`">
                <Input
                  type="text"
                  :value="curBankCard.accountMsg"
                  disabled
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('二维码')} :`">
                <Input
                  type="text"
                  disabled
                  v-if="curBankCard.imgUrl"
                  :value="$tex('已上传')"
                ></Input>
                <Input
                  type="text"
                  disabled
                  v-else
                  :value="$tex('未上传')"
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
        ><span>{{ $tex("解绑支付卡") }}</span>
      </button>
    </template>
    <template v-if="!bankCardSelected">
      <div class="payAccount-content">
        <Form
          :model="card"
          ref="addCard"
          :label-width="90"
          :rules="addCardRule"
        >
          <FormItem :label="`${$tex('真实姓名')}:`" prop="accountName">
            <Input
              type="text"
              v-model="card.accountName"
              :placeholder="$tex('真实姓名')"
            ></Input>
          </FormItem>
          <FormItem :label="`${$tex('平台账号')} :`" prop="bankNo">
            <Input
              type="text"
              :placeholder="$tex('平台账号')"
              :value="card.bankNo"
              :maxlength="19"
              @on-change="onBankChange"
              @input="card.bankNo = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
          </FormItem>
          <FormItem :label="`${$tex('平台选择')} :`" prop="bankName">
            <Select
              v-model="card.bankName"
              class="bank-select"
              :placeholder="$tex('平台选择')"
              @on-change="onBankNameChange"
            >
              <Option
                v-for="universal in universalList"
                :key="universal.bankName"
                class="bank-select__item"
                :value="universal.bankName"
                :label="universal.bankName"
              >
                <img :src="universal.universalUrl" alt="" />
                <span>{{ universal.bankName }}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="`${$tex('账户信息')} :`" prop="accountMsg">
            <Input
              type="text"
              v-model="card.accountMsg"
              :placeholder="$tex('非必填')"
            ></Input>
          </FormItem>
          <FormItem :label="`${$tex('存款二维码')} :`" prop="imgUrl">
            <div
              class="payAccount-content__upload"
              :class="{
                'payAccount-content__upload--exist': qrcodeFile,
              }"
            >
              <Button
                class="payAccount-content__upload-btn"
                type="primary"
                @click="onQRClick"
              >
                {{ $tex("点击上传") }}
              </Button>
              <input
                ref="qrInput"
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                placeholder="存款二维码"
                @change="onQRChange"
              />
              <i class="payAccount-content__upload-suffix"></i>
            </div>
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
            class="ivu-btn ivu-btn-primary bind-btn"
            @click="cardSaveSubmit"
          >
            <i class="ivu-icon iconfont icon-bank"></i
            ><span>{{ $tex("添加支付卡") }}</span>
          </button>
        </div>
      </div>
    </template>
    <phone-bind-dialog
      v-model="isShowPhoneValidate"
      type="11"
      :title="$tex('解绑支付卡')"
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
  name: "PayAccount",
  components: {
    accountCard,
    PhoneBindDialog,
  },
  data() {
    //姓名验证规则
    const accountNameCheck = (rule, value, callback) => {
      if (!value && this.$store.getters.sysRealName != 1) {
        callback();
        return;
      } else if (!value) {
        callback(new Error(this.$tex("请输入账户名")));
      } else if (
        /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
          value
        )
      ) {
        callback(new Error(this.$tex("请输入有效字符")));
      } else if (value.length < 2 || value.length > 30) {
        callback(
          new Error(
            this.$tex("请输入{min}-{max}位的字符", {
              min: 2,
              max: 30,
            })
          )
        );
      } else {
        callback();
      }
    };

    const bankNoCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入平台账号")));
      } else if (
        /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
          value
        )
      ) {
        callback(new Error(this.$tex("请输入有效字符")));
      } else if (value.length < 1 || value.length > 24) {
        callback(
          new Error(
            this.$tex("请输入{min}-{max}位的字符", {
              min: 1,
              max: 24,
            })
          )
        );
      } else {
        callback();
      }
    };

    return {
      curIndex: -1,
      unBindBank: "0",
      isShowPhoneValidate: false,
      card: {
        accountName: "",
        bankName: "",
        bankNo: "",
        universalType: "",
        type: "04",
        accountMsg: "",
        imgUrl: "",
      },
      qrcodeFile: null,
      realName: "",
      list: [],
      //卡号验证
      addCardRule: {
        accountName: [
          // {
          //   message: this.$tex("账户名不能为空"),
          //   required: true,
          //   trigger: "blur",
          // },
          { validator: accountNameCheck, trigger: "blur" },
        ],
        bankNo: [
          {
            message: this.$tex("平台账号不能为空"),
            required: true,
            trigger: "blur",
          },
          { validator: bankNoCheck, trigger: "blur" },
        ],
        bankName: [
          {
            message: this.$tex("平台选择不能为空"),
            required: true,
            trigger: "blur",
          },
        ],
      },
      sysDict: {},
      universalList: [],
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
          universalType: "",
          accountName: "",
          accountMsg: "",
          certNo: null,
          status: "",
          type: "",
          imgUrl: "",
          universalUrl: "",
        }
      );
    },
    isSupportMultiBank() {
      return false;
    },
    canAddBankCard() {
      return this.list.length < this.USER_BANK_MAXNUM;
    },
    /**
     * @return {number}
     */
    USER_BANK_MAXNUM() {
      return this.universalList.length || 1;
    },
  },
  filters: {
    formatBankNo(bankNo) {
      let output = bankNo;
      if (!output) {
        return output;
      }
      output = bankNo.trim();
      if (output.length > 4) {
        output = output.substr(0, 2) + "***" + output.substr(output.length - 2);
      } else if (output.length > 0) {
        output = output.substr(0, 1) + "***";
      }
      return output;
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
    checkChineseKey,
    onBankNameChange(bankName) {
      const universal =
        this.universalList.find((universal) => {
          return universal.bankName === bankName;
        }) || {};
      this.card.universalType = universal.universalType;
    },
    onQRClick() {
      this.$refs.qrInput.click();
    },
    onQRChange(e) {
      const files = e.target.files;
      this.qrcodeFile = null;
      this.card.imgUrl = "";
      if (!files || files.length <= 0) {
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      postFiles = postFiles.slice(0, 1);

      for (let i = 0; i < postFiles.length; i++) {
        const file = postFiles[i];
        if (!/\.(jpg|jpeg|png)$/gim.test(file.name)) {
          return void 0;
        }
        if (file.size > 1024 * 1204 * 4) {
          this.$Message.info(this.$tex("图片不能超过{num}M", { num: 4 }));
          return;
        }
        this.qrcodeFile = file;
      }
    },
    onBankAddClick() {
      this.curIndex = -1;
    },
    onBankCardSelected(index) {
      this.curIndex = index;
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
          type: "2",
          bankId: userBankId,
          smsPhoneCode: smsPhoneCode,
        },
        {
          userId: true,
        }
      );
    },
    onPhoneValidateSuccess() {
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
      this.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.$emit("handler-spin", false);
          let data = response.data.data;
          this.universalList = data.universalList || [];
          const lotUserUniversalList = data.lotUserUniversalList || [];
          this.list = lotUserUniversalList.map((lotUserUniversal) => {
            const curUniversal =
              this.universalList.find((universal) => {
                return (
                  universal.universalType === lotUserUniversal.universalType
                );
              }) || {};
            lotUserUniversal.universalUrl = curUniversal.universalUrl;
            return lotUserUniversal;
          });
          this.unBindBank = data.unBindBank;
          this.switchBankCardView();
        });
    },
    switchBankCardView() {
      if (this.list.length) {
        this.curIndex = 0;
      } else {
        this.curIndex = -1;
      }
    },
    resetFormStatus() {
      //重置添加银行卡表单的状态
      this.$refs.addCard.resetFields();
    },
    cardSaveSubmit() {
      this.$refs.addCard.validate(async (valid) => {
        if (valid) {
          if (this.isSubmit) return;
          this.isSubmit = true;
          if (this.qrcodeFile && !this.card.imgUrl) {
            const sysConfig = await this.$store.dispatch("querySystemConfig");
            const form = new FormData();
            form.append("flag", sysConfig["PLATFORM_FLAG"]);
            form.append("imagefiles", this.qrcodeFile);
            const qiniuRes = await this.$http.post(
              "/api/v2/cms/qiniuUpload",
              form,
              { contentType: "multipart/form-data", unenc: true }
            );
            if (qiniuRes.data.code !== 0) {
              this.isSubmit = false;
            }
            this.card.imgUrl = qiniuRes.data.data[0].url;
          }
          const bankRes = await this.$http.post(
            "/api/v2/user/bandingBankInfo",
            this.card,
            { userId: true }
          );
          this.isSubmit = false;
          if (bankRes.data.code !== 0) return;
          this.$Message.success(this.$tex("添加支付卡成功"));
          this.$refs.addCard.resetFields();
          this.qrcodeFile = null;
          this.onBankCardSelected(0);
          this.getBankList();
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

.payAccount {
  margin-top: 10px;

  @{deep} {
    .unbind-btn,
    .bind-btn {
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

.payAccount-content {
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
  .bank-card-add-list__logo {
    width: 48px;
    height: 48px;
    float: none;
    margin-right: 20px;
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

.payAccount-content__upload {
  input {
    display: none;
  }
}

.payAccount-content__upload--exist {
  .payAccount-content__upload-suffix {
    background-image: url("~@/assets/images/qrcode.png");
  }
}

.payAccount-content__upload-suffix {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  width: 18px;
  height: 18px;
  background: url("~@/assets/images/scqrcode.png") center center no-repeat;
  background-size: 100% 100%;
}
</style>
