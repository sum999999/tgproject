<template>
  <modal
    claName="diff-loign-dialog"
    :title="$tex('安全校验')"
    width="362"
    :modalShow="showDiffLoginDialog"
    :hasNoBtn="false"
    :hasOkBtn="false"
    :hasFooter="false"
    :okText="$tex('提交')"
    :maskClosable="true"
    @btn-cancel="closeDiffLoginDialog"
    @btn-ok="subMitCheckDiffLogin"
  >
    <div slot="content">
      <div style="margin-bottom:24px;">
        {{loginExtraInfo.msg}}
      </div>
      <Form
        ref="formCustom"
        :label-width="60"
        v-if="loginExtraInfo.phone"
      >
        <FormItem :label="`${$tex('手机')}：`">
          <span>{{loginExtraInfo.phone|formatPhoNumber}}</span>
        </FormItem>
        <FormItem
          prop="veryCode"
          :label="`${$tex('验证码')}：`"
        >
          <Input
            type="text"
            :maxlength="14"
            v-model="diffLoginCode"
            style="width:130px;"
          >
          </Input>
          <div class="tip">
            <span v-if="hasGetCode"><time>{{countDownTime}}s</time>{{$tex("重新发送")}}</span>
            <Button
              v-else
              type="default"
              size="large"
              v-preventReClick="2000"
              @click="getCode"
            >{{$tex("获取验证码")}}</Button>
          </div>
        </FormItem>
        <FormItem style="margin-left:54px;">
          <Button
            type="primary"
            :disabled="!diffLoginCode"
            class="commit-bind"
            @click="subMitCheckDiffLogin"
          >{{$tex("提交")}}</Button>
        </FormItem>
      </Form>
      <Form v-else>
        <FormItem style="text-align:center;"><Button
            type="primary"
            v-preventReClick="200"
            @click="connectServicer"
          >{{$tex("联系客服")}}</Button></FormItem>
      </Form>
    </div>
  </modal>
</template>

<script>
import modal from "@/components/modal";
import { setInterval, clearInterval } from "timers";
export default {
  props: ["showDiffLoginDialog"],
  data() {
    return {
      diffLoginCode: "", //验证码
      countDownTime: 300, //倒计时时长
      hasClick: false,
      countTimer: "", //倒计时计时器
      hasGetCode: false, //是否得到了验证码
      // hasLogin: false //是否点击了登录
    };
  },
  components: {
    modal
  },
  computed: {
    //异地登录异常弹框
    loginExtraInfo() {
      return JSON.parse(this.$store.state.diffLoginExtraInfo);
    },
    user() {
      return this.$store.state.user;
    },
    diffLoginKaptchaFlag() {
      //登录需要的kaptchaFlag
      return this.$store.state.diffLoginKaptchaFlag;
    },
    cacheLoginUserInfo() {
      //登录时存储的用户信息
      return JSON.parse(this.$store.state.cacheLoginUserInfo);
    },
    servicer() {
      return this.$store.state.servicer;
    }
  },
  filters: {
    formatPhoNumber(val) {
      if (!val) return;
      return val.slice(0, 3) + "****" + val.slice(7, 11);
    }
  },
  methods: {
    connectServicer() {
      //联系客服
      window.open(this.servicer.url, "_blank");
    },
    subMitCheckDiffLogin() {
      //提交异地登录验证
      // if (this.hasLogin) return;
      // this.hasLogin = true;
      //请求
      this.cacheLoginUserInfo.phoneCode = this.diffLoginCode;
      this.$http
        .post("/api/v2/user/login", this.cacheLoginUserInfo, {
          kaptchaFlag: this.diffLoginKaptchaFlag
        })
        .then(res => {
          // this.hasLogin = false;
          this.diffLoginCode = "";
          if (res.data.code !== 0) return;
          this.closeDiffLoginDialog();
          localStorage.setItem("user", JSON.stringify(res.data.data));
          this.$store.commit("getUser", res.data.data);
          if (this.$route.name === "login" || this.$route.name === "register") {
            this.$router.push("/");
          }
        });
    },
    closeDiffLoginDialog() {
      //关闭异地登录弹框提示
      this.diffLoginCode = "";
      if (this.countTimer) clearInterval(this.countTimer);
      this.countDownTime = 300;
      this.hasGetCode = false;
      this.hasClick = false;
      this.$store.commit("getDiffLogin", false);
    },
    getCode() {
      //获取验证码
      if (this.hasClick) return;
      this.hasClick = true;
      this.$http
        .post(
          "/api/v2/user/smsYunXinPhone",
          {
            type: "3",
            phoneNumber: this.loginExtraInfo.phone,
            userId: this.loginExtraInfo.userId
          },
          {}
        )
        .then(res => {
          this.hasClick = false;
          if (res.data.code !== 0) return;
          let diffTime = 300;
          this.hasGetCode = true;
          this.countTimer = setInterval(() => {
            diffTime -= 1;
            if (diffTime < 0) {
              clearInterval(this.countTimer);
              this.hasGetCode = false;
              return;
            }
            this.countDownTime = diffTime;
          }, 1000);
        });
    }
  }
};
</script>

<style lang="less">
.diff-loign-dialog {
  //异地登录弹框
  .ivu-modal-body {
    padding-left: 35px;
    padding-right: 35px;
  }
  .ivu-form-item {
    margin-bottom: 18px;
  }
  .ivu-form-item-label {
    padding-right: 5px;
  }
  .phone-num {
    margin-left: 16px;
    margin-bottom: 24px;
  }
  .ivu-modal-footer {
    padding: 0;
  }
  .tip {
    position: absolute;
    left: 130px;
    top: 0px;
    display: inline-block;
    width: 92px;
    padding-left: 5px;
    color: #b7b7b7;
    white-space: nowrap;
    text-align: center;
    button {
      padding: 0;
      width: 100px;
      text-align: center;
      line-height: 30px;
      height: 30px;
    }
  }
}
</style>
