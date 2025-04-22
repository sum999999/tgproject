<template>
  <modal
    :title="title"
    :ok-text="okText"
    cla-name="currency-validate-modal"
    :modalShow="showValidate"
    :width="392"
    :has-no-btn="false"
    @btn-ok="onValidateClick"
    @btn-cancel="onValidateCancel"
  >
    <div slot="content" style="text-align:center">
      <Form
        class="currency-validate-modal-form"
        ref="bindFormValidate"
        :model="bindFormValidate"
        :rules="bindRuleValidate"
        :label-width="62"
      >
        <FormItem
          class="currency-validate-modal-form__item"
          :class="{
            areaCode: hasPermission('element.areaCode'),
          }"
          :label="$tex('手机号码')"
          prop="phone"
        >
          <span
            v-if="hasPermission('element.areaCode')"
            class="currency-validate-modal-form__item-area-code"
            >+{{ parseInt(areaCode) }}</span
          >
          <Input
            v-model="phoneNumber"
            :placeholder="$tex('请输入手机号码')"
            readonly
          ></Input>
        </FormItem>
        <FormItem
          class="currency-validate-modal-form__item"
          :label="$tex('短信验证')"
          prop="code"
        >
          <Input
            v-model="bindFormValidate.code"
            :placeholder="$tex('请输入短信验证码')"
          ></Input>
          <Button
            class="currency-validate-modal-form-sms-button"
            type="primary"
            :disabled="smsPhoneCodeDisabled"
            @click="onGetSmsClick"
            >{{ smsPhoneCodeText }}
          </Button>
        </FormItem>
      </Form>
    </div>
  </modal>
</template>

<script>
import modal from "@/components/modal";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import { getConfigList } from "@/utils/getSysConfig";

export default {
  name: "index",
  components: {
    modal,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    okText: {
      type: String,
      default: "",
    },
    submit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      validLoading: false,
      smsPhoneCodeText: this.$tex("发送验证码"),
      smsPhoneCodeTime: 300,
      smsPhoneCodeDisabled: false,
      bindFormValidate: {
        code: "",
      },
      bindRuleValidate: {
        code: [
          {
            required: true,
            message: this.$tex("请输入短信验证码"),
            trigger: "blur",
          },
        ],
      },
      areaCode: "",
      curAreaCode: "",
    };
  },
  computed: {
    ...mapGetters(["user", "userAreaCode"]),
    phoneNumber() {
      const phoneNum = this.user.phone;
      if (!phoneNum) return;
      return phoneNum.slice(0, 3) + "****" + phoneNum.slice(-4);
    },
    showValidate: {
      set(value) {
        this.$emit("input", value);
      },
      get() {
        return this.value;
      },
    },
    // areaCode () {
    //   return this.user.areaCode
    // }
  },
  created() {
    this.initConfig();
  },
  methods: {
    hasPermission,
    initConfig() {
      getConfigList().then((res) => {
        this.$store.commit("getConfigList", res); //获取全局配置文件
        res.forEach((item) => {
          if (hasPermission("element.areaCode")) {
            if (item.key === "AREA_CODE") {
              this.areaCode = JSON.parse(item.value).areaCode || [];
              if (this.areaCode.length) {
                this.curAreaCode = this.areaCode[0];
              }
            }
          } else {
            this.curAreaCode = this.userAreaCode;
          }
          if (item.key === "YI_DUN_VAILD_CONFIG") {
            let {
              captchaFlag,
              antiCheatFlag,
              businessId,
              captchaId,
            } = JSON.parse(item.value).bindPhone;
            this.captchaFlag = captchaFlag;
            this.antiCheatFlag = antiCheatFlag;
            this.businessId = businessId;
            this.captchaId = captchaId;
            this.$nextTick(() => {
              if (this.captchaFlag) {
                this.initCapthca();
              }
            });
          }
        });
      });
    },
    async onValidateClick() {
      const validateFlag = await this.$refs["bindFormValidate"].validate();
      if (!validateFlag) {
        return;
      }
      if (this.validLoading) {
        return;
      }
      this.validLoading = true;
      const response = await this.submit({
        smsPhoneCode: this.bindFormValidate.code,
      });
      this.validLoading = false;
      if (response.data.code !== 0) {
        return;
      }
      this.showValidate = false;
      this.$emit("success");
    },
    onValidateCancel() {
      this.showValidate = false;
      this.$emit("cancel");
    },
    async onGetSmsClick() {
      if (this.smsPhoneCodeDisabled) {
        return;
      }
      const err = await new Promise((r) => {
        this.$refs["bindFormValidate"].validateField("phone", r);
      });
      if (err) {
        return console.log("err", err);
      }
      const smsPhoneCodeTimeBackUp = this.smsPhoneCodeTime;
      const smsPhoneCodeTextBackUp = this.smsPhoneCodeText;
      this.smsPhoneCodeDisabled = true;

      const resetSmsPhoneCode = () => {
        this.smsPhoneCodeDisabled = false;
        this.smsPhoneCodeTime = smsPhoneCodeTimeBackUp;
        this.smsPhoneCodeText = smsPhoneCodeTextBackUp;
        clearInterval(this.countTimer);
      };

      const response = await this.$http.post(
        "/api/v2/user/smsYunXinPhone",
        {
          areaCode: this.curAreaCode,
          type: this.type,
          phoneNumber: this.user.phone,
          userId: this.user.userId,
        },
        {}
      );
      if (response.data.code !== 0) {
        return resetSmsPhoneCode();
      }
      this.countTimer = setInterval(() => {
        this.smsPhoneCodeText = `${this.$tex("倒计时")}：${
          this.smsPhoneCodeTime
        }s`;
        if (this.smsPhoneCodeTime < 0) {
          return resetSmsPhoneCode();
        }
        this.smsPhoneCodeTime--;
      }, 1000);
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.currency-validate-modal-form {
  @{deep} {
    .ivu-form-item-label:before {
      display: none;
    }

    .ivu-form-item-content {
      position: relative;
    }
  }

  .ivu-form-item:nth-last-child(1) {
    margin-bottom: 0;
  }
}

.currency-validate-modal-form-sms-button {
  position: absolute;
  right: 0;
  top: 3px;
}
.currency-validate-modal-form__item {
  &.areaCode {
    position: relative;
    @{deep} {
      input {
        padding-left: 35px;
        cursor: not-allowed;
      }
    }
  }
}
.currency-validate-modal-form__item-area-code {
  position: absolute;
  left: 5px;
  top: 1px;
  color: #313131;
  z-index: 1;
}
</style>
