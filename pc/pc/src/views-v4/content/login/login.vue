<template>
  <div class="template3 login-page">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4 :class="{active:currentPage==='login'}"  @click="handleSubmit('formCustom')">账号登录</h4>
          <h4 :class="{active:currentPage==='register'}" class="fr" @click="$router.push('/register')">账号注册</h4>
        </div>
        <Form
            ref="formCustom"
            :model="formCustom"
            :rules="ruleInline">
            <FormItem prop="userCode">
              <Input
                type="text"
                v-model="formCustom.userCode"
                placeholder="请输入登录账号"
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
                placeholder="请输入登录密码"
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
              v-if="!captchaFlag">
              <Input
                type="text"
                v-model="formCustom.checkCode"
                placeholder="请输入验证码(必填)"
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
              v-else>
              <div id="captcha">
              </div>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                class="commit-register"
                long
                @click="handleSubmit('formCustom')"
              >登录</Button>
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
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import loginMixin from "@/views/login/loginMixin.js";
export default {
  mixins: [loginMixin],
  data() {
    return {
      currentPage:'login'
    }
  }
};
</script>

<style lang="less" scoped>
.template3.login-page {
  position: relative;
  top:0;
  width:100%;
  height:100%;
  background: url('../../images/4_bg.png') no-repeat center top;
}
.template3.login-page .footer{
  background: rgba(0,0,0,0) url(../../images/bottom.png) no-repeat center bottom !important;
    background-size: cover;
}
.template3.login-page .container {
  position: relative;
  width: 616px;
  padding-top:20px;
  top:78px;
  margin: auto;
  border-radius: 18px;
  background-size: 100%;
  box-shadow: 0px 0px 3px 3px rgba(226, 226, 226, 1);
  background-color: #fff;
  margin-bottom: 106px;
  overflow: hidden;
}
.template3.login-page .login-img {
  float: left;
  margin-top:63px;
  margin-left:-2px;
}
.template3.login-page .container .cont {
  // height: 100%;
  width: 100%;
  border-radius: 18px;
  margin-top:30px;
  background-color: #fff;
  margin:auto;
}
.template3.login-page .cont-title {
  width:320px;
  line-height: 60px;
  height: 60px;
  margin-bottom: 20px;
  margin:auto;
}
.template3.login-page /deep/.ivu-input-group{
  width:444px;
  left:0;
  right:0;
  margin:auto;
}
.template3.login-page /deep/.ivu-form-item-error-tip{
  // left:initial;
  // top:0;
  // right:0;
  // width:130px;
  // height:40px;
  // font-size: 12px;
  color:#ae291a;
}
.template3.login-page .other-operation{
  width:444px;
  margin:auto;
  margin-bottom: 194px;
}
.template3.login-page .cont-title h4 {
  width:96px;
  float: left;
  height:60px;
  font-size: 20px;
  color: @primary-color;
  text-align: center;
  font-weight: normal;
  margin-bottom: 30px;
  cursor: pointer;
  &.fr{
    float:right;
  }
  &.active{
    border-bottom: 2px solid #2d72ff;
  }
}
.template3.login-page .cont /deep/.ivu-form-item .ivu-input {
  height: 45px;
  border-radius: 33px;
  border-left-width: 0;
  background-color:#eee;
  font-size: 16px;
  border:none;
  outline: none;
  padding:0;
}
.template3.login-page .cont /deep/.ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 27px;
  border-radius: 33px;
  background-color:#eeeeee;
  border:none;
  padding-left:24px;
  color:#a7b4cd;
}
.template3.login-page .cont .valida .valida-code {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  height: 28px;
  width: auto;
  cursor: pointer;
  margin: auto;
  z-index: 2;
}
.template3.login-page /deep/.ivu-form-item-content{
  width:444px;
  margin:auto;

}

.template3.login-page .cont .commit-register {
  width:444px;
  height: 45px;
  font-size: 18px;
  border-radius: 33px;
  padding:0;
  margin:auto;
}
.template3 .other-operation {
  font-size: 14px;
}
.template3.login-page .foget-password {
  font-size: 16px;
  color: #3b72ff;
}
.template3.login-page .go-register {
  font-size: 16px;
  color: #a36dff;
  float: right;
}
.template3 .myPhone{
  position: absolute;
  left:10px;
  top:-10px;
}
.template3.login-page /deep/.ivu-btn-primary{
  background-image: linear-gradient(to right, #3b72ff, #a36dff);
  border:none;
}
.template3 .valida-wrap{
  position: relative;
}
</style>

