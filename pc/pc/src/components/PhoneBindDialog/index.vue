<template>
  <!-- 绑定手机号 -->
  <modal
    claName="bind-phone"
    :modalShow="showBindPhoneNum"
    :title="title"
    width="362"
    :hasNoBtn="false"
    :hasOkBtn="false"
    :okText="$tex('绑定')"
    :maskClosable="true"
    @btn-cancel="cancel"
    @btn-ok="submitBind('bindPhone')"
  >
    <div slot="content">
      <Form
        ref="formCustom"
        :model="phoneCustom"
        :rules="ruleInline"
        :label-width="80"
      >
        <FormItem
          prop="phoneNum"
          :label="`${$tex('手机')}：`"
          class="phone-num-item"
          :class="{
            areaCode: hasPermission('element.areaCode'),
          }"
        >
          <Dropdown
            v-if="hasPermission('element.areaCode')"
            class="phone-num-item__area-code"
            @on-click="onAreaCodeClick"
          >
            <span>+{{ curAreaCode }}</span>
            <Icon type="arrow-down-b"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="(code, index) in areaCode"
                :key="index"
                :name="code"
              >
                <span>{{ code }}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input type="text" v-model="phoneCustom.phoneNum"> </Input>
        </FormItem>
        <FormItem prop="veryCode" :label="`${$tex('验证码')}：`">
          <Input
            type="text"
            v-model="phoneCustom.veryCode"
            style="width:130px;"
          >
          </Input>
          <div class="tip">
            <span v-if="hasGetCode">
              <time>{{ timeTxt }}s</time>{{ $tex("重新发送") }}</span
            >
            <Button
              class="get-code"
              type="default"
              :loading="isValidPhoNum"
              :disabled="captchaDisabled"
              v-if="!hasGetCode"
              @click="getVeryCode"
              >{{ $tex("获取验证码") }}
            </Button>
          </div>
        </FormItem>
        <FormItem class="valida" v-if="captchaFlag">
          <div id="addPhoneCaptcha"></div>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="commit-bind"
            @click="submitBind('formCustom')"
            >{{ $tex("提交") }}
          </Button>
        </FormItem>
      </Form>
    </div>
  </modal>
</template>

<script>
import modal from "@/components/modal.vue";
import captcha from "@/mixins/captcha";
import { getConfigList } from "@/utils/getSysConfig";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import { sendCodeForWallet, bindWallet } from "@/api/user.js";

export default {
  name: "index",
  mixins: [captcha(224, "#addPhoneCaptcha")],
  components: {
    modal,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default() {
        return this.$tex("绑定手机号码");
      },
    },
    type: {
      type: String,
      required: true,
    },
    submit: {
      type: Function,
    },
    channelId: {
      type: String,
      default: "",
    },
  },
  data() {
    const validaPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入您的手机号码")));
      } else if (
        hasPermission("validator.phone.length") &&
        value &&
        !/^1(\d){10}$/.test(value)
      ) {
        callback(new Error(this.$tex("手机号码输入有误")));
      } else {
        callback();
      }
    };
    const validaCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入验证码")));
      } else {
        callback();
      }
    };
    return {
      phoneCustom: {
        //绑定手机号
        phoneNum: "",
        veryCode: "",
      },
      ruleInline: {
        phoneNum: [{ validator: validaPhone, trigger: "blur" }],
        veryCode: [{ validator: validaCode, trigger: "blur" }],
      },
      countTimer: "",
      timeTxt: 300,
      hasClickVery: false, //阻止多次点击
      isValidPhoNum: false, //是否为合法号码
      hasGetCode: false,
      captchaDis: true,
      areaCode: "",
      curAreaCode: "",
    };
  },
  computed: {
    ...mapGetters(["user", "userAreaCode"]),
    showBindPhoneNum: {
      set(value) {
        this.$emit("input", value);
      },
      get() {
        return this.value;
      },
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    captchaDisabled() {
      return this.captchaDis && this.captchaFlag;
    },
  },
  watch: {
    showBindPhoneNum(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.captchaFlag) {
            this.initCapthca();
          }
        });
      }
    },
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
    cancel() {
      this.$emit("cancel");
      this.cancelBindPhone();
    },
    cancelBindPhone() {
      this.refreshCaptchaValidate();
      this.showBindPhoneNum = false;
      this.$refs["formCustom"].resetFields();
      this.verifyData = {};
      if (this.countTimer) clearInterval(this.countTimer);
      if (this.hasGetCode) this.hasGetCode = false;
      if (this.hasClickVery) this.hasClickVery = false;
      if (this.isValidPhoNum) this.isValidPhoNum = false;
    },
    async submitBind(name) {
      let phone = this.phoneCustom.phoneNum;
      // if (this.bindNum !== phone) {
      //   this.$Message.error(this.$tex("验证码对应手机号不一致"));
      //   return;
      // }
      const valid = await this.$refs[name].validate();
      if (!valid) {
        this.specialRefreshCaptcha();
        this.verifyData = {};
        return;
      }
      let obj = { phoneNumber: phone, smsPhoneCode: this.phoneCustom.veryCode };

      // 绑定钱包
      if (this.channelId) {
        const parameter = {
          channelId: this.channelId,
          mobile: phone,
          msgCode: this.phoneCustom.veryCode,
        };
        const res = await bindWallet(parameter);
        if (res.data.code == 0) {
          this.$Message.success(this.$tex("绑定成功"));
          this.$emit("success", this.channelId);
        }
        return;
      }
      if (this.antiCheatFlag) {
        //如果开启了反作弊
        let token = await this.getWxToken();
        console.log("开启了反作弊");
        obj = {
          ydtoken: token,
          ...obj,
        };
      }

      if (!this.captchaFlag) {
        //未开启行为验证
        console.log("验证码验证");
        this.subMitEditPhoneNumber(obj);
        return;
      }

      const capObj = this.capthcaValidate(); //行为验证

      console.log("开启了行为验证");
      if (!capObj) {
        this.registerStatus = false;
        return;
      }
      var { validate, loading } = capObj;
      obj = {
        ydNECaptchaValidate: validate,
        ...obj,
      };
      if (!this.antiCheatFlag) {
        this.subMitEditPhoneNumber(obj, loading);
        return;
      }
      this.subMitEditPhoneNumber(obj, loading);
    },
    // 倒计时
    Countdown(res, vm) {
      this.hasClickVery = false;
      if (res.data.code !== 0) return;
      // this.$Message.success(res.data.data.msg);
      this.isValidPhoNum = true;
      this.hasGetCode = true;
      this.bindNum = this.phoneCustom.phoneNum;
      let diffTime = 120;
      this.countTimer = setInterval(() => {
        diffTime -= 1;
        if (diffTime < 0) {
          clearInterval(vm.countTimer);
          vm.hasGetCode = false;
          vm.hasClickVery = false;
          vm.isValidPhoNum = false;
          return;
        }
        vm.timeTxt = diffTime;
      }, 1000);
    },
    async getVeryCode() {
      let phone = this.phoneCustom.phoneNum;
      if (
        !phone ||
        (hasPermission("validator.phone.length") && !/^1(\d){10}$/.test(phone))
      ) {
        this.$Message.error(this.$tex("请输入正确的手机号码"));
        return;
      }
      if (this.hasClickVery) return;
      this.timeTxt = 300;
      this.hasClickVery = true;
      let vm = this;
      if (this.channelId) {
        const res = await sendCodeForWallet({
          channelId: this.channelId,
          mobile: this.phoneCustom.phoneNum,
        });
        this.Countdown(res, vm);
      } else {
        this.$http
          .post(
            "/api/v2/user/smsYunXinPhone",
            {
              areaCode: this.curAreaCode,
              type: this.type,
              phoneNumber: this.phoneCustom.phoneNum,
              userId: this.user.userId,
            },
            {}
          )
          .then((res) => {
            this.Countdown(res, vm);
          });
      }
    },
    capthcaSuccess() {
      this.captchaDis = false;
    },
    getWxToken() {
      //获取行为验证的token
      let vm = this;
      if (this.wmInstance) {
        return new Promise((resolve, reject) => {
          this.wmInstance.getToken(vm.businessId, function(token) {
            resolve(token);
          });
        });
      } else {
        return Promise.reject("");
      }
    },
    async subMitEditPhoneNumber(obj, loading) {
      let response = null;
      if (this.submit) {
        response = await this.submit(obj);
      } else {
        response = await this.$http.post(
          "/api/v2/user/updatePhone",
          {
            areaCode: this.curAreaCode,
            ...obj,
          },
          { userId: true }
        );
      }
      loading && loading();
      this.verifyData = {};
      if (response.data.code !== 0) {
        this.phoneCustom.veryCode = "";
        if (this.captchaFlag) {
          this.refreshCaptchaValidate();
        }
        return;
      }
      this.$Message.success(this.$tex("成功"));
      this.user.phone = this.phoneCustom.phoneNum;
      this.user.areaCode = this.curAreaCode;
      this.$store.commit("getUser", this.user);
      this.cancelBindPhone();
      this.$emit("success");
    },
    onAreaCodeClick(name) {
      this.curAreaCode = name;
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
/* 绑定手机号码 */
.v-transfer-dom {
  @{deep} {
    .bind-phone {
      .ivu-modal-body {
        padding: 28px 40px 28px 16px;
        position: relative;
      }

      .phone-num-item {
        margin-bottom: 20px;
        position: relative;
        &.areaCode {
          input {
            padding-left: 40px;
          }
        }
      }
      .phone-num-item__area-code {
        position: absolute;
        left: 5px;
        top: 1px;
        color: #313131;
        z-index: 1;
        cursor: pointer;
      }
      .ivu-form-item:last-child {
        margin-bottom: 0;
      }

      .ivu-modal-body .tip {
        position: absolute;
        left: 130px;
        top: 3px;
        display: inline-block;
        width: 93px;
        padding-left: 5px;
        color: #b7b7b7;
        white-space: nowrap;
      }

      .ivu-modal-body .tip .ivu-btn {
        padding: 6px 4px;
        vertical-align: top;
      }

      .ivu-modal-body .tip .ivu-btn:disabled {
        cursor: not-allowed;
      }

      .ivu-modal-body time {
        color: #e1040b;
        margin-right: 2px;
      }

      .ivu-modal-body .get-code {
        width: 88px;
        padding: 0;
        cursor: pointer;
        font-size: 12px;
      }

      .ivu-form-item-label {
        padding-right: 5px;
        font-size: 14px;
      }

      .ivu-input-wrapper {
        width: 224px;
      }

      .yidun_tips__text {
        margin-left: 40px;
      }

      .yidun.yidun--light {
        margin: inherit;
      }

      .commit-bind {
        width: 80px;
        height: 32px;
        padding: 0;
        margin-left: 44px;
      }

      .ivu-modal-footer {
        padding: 0;
      }
    }
  }
}
</style>
