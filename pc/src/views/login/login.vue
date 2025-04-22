<template>
  <div class="login-page">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4>账号登录</h4>
        </div>
        <Form
          ref="formCustom"
          :model="formCustom"
          :rules="ruleInline"
        >
          <FormItem prop="userCode">
            <Input
              type="text"
              v-model="formCustom.userCode"
              placeholder="账号"
            >
            <Icon
              type="person"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="formCustom.password"
              placeholder="密码"
            >
            <Icon
              type="ios-locked"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="checkCode"
            class="valida"
            v-if="!captchaFlag"
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="验证码"
              @on-enter="handleSubmit('formCustom')"
              @on-focus='refreshCheckCode()'
            >
            <Icon
              type="social-snapchat"
              slot="prepend"
            ></Icon>
            </Input>
            <img
              class="valida-code"
              :src='ewmUrl'
              @click='getImageCode'
            >
          </FormItem>
          <FormItem
            class="valida"
            v-else
          >
            <div id="captcha">
            </div>
          </FormItem>
          <div class="other-operation">
            <a
              class="foget-password"
              @click="forgetPass"
            >忘记密码</a>
            <router-link
              to="/register"
              class="go-register"
            >立即注册</router-link>
          </div>
          <FormItem>
            <Button
              type="primary"
              class="commit-register"
              long
              v-preventReClick="2000"
              @click="handleSubmit('formCustom')"
            >登录</Button>
          </FormItem>
        </Form>
      </div>
      <div class="login-img">
        <img
          :src="loginAvatar"
          alt="封面图"
        >
      </div>
    </div>
  </div>
</template>

<script>
import loginMixin from "@/views/login/loginMixin.js";
export default {
  mixins: [loginMixin]
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.login-page {
  margin: 50px 0;
}
.login-page .container {
  width: 1000px;
  height: 458px;
  margin: 0 auto;
  background: @login-container-border;
  border-radius: 6px;
  padding: 10px;
}
.login-page .login-img {
  float: right;
}
.login-page .container .cont {
  height: 100%;
  width: 495px;
  padding: 25px 60px;
  background: #fff;
  float: left;
}
.login-page .cont-title {
  border-bottom: 2px solid #f1f1f1;
  line-height: 30px;
  height: 45px;
  margin-bottom: 20px;
}
.login-page .cont-title h4 {
  float: left;
  font-size: 16px;
  color: @primary-color;
}
.login-page .cont @{deep} .ivu-form-item .ivu-input {
  height: 45px;
}
.login-page .cont @{deep} .ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 18px;
}
.login-page .cont .valida .valida-code {
  position: absolute;
  top: 2px;
  right: 2px;
  height: 43px;
  width: auto;
  cursor: pointer;
  z-index: 2;
}
.login-page .cont .commit-register {
  height: 44px;
  font-size: 18px;
}
.other-operation {
  padding: 10px;
  font-size: 14px;
}
.login-page .foget-password {
  color: @primary-color;
}
.login-page .go-register {
  color: #8b8c8d;
  float: right;
}
</style>

