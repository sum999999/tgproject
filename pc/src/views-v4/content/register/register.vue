<template>
  <div class="template3 login-page">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4
            :class="{active:currentPage==='login'}"
            @click="$router.push('/login')"
          >账号登录</h4>
          <h4
            :class="{active:currentPage==='register'}"
            class="fr"
            @click="handleSubmit('formCustom')"
          >账号注册</h4>
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
              placeholder="请输入登录账号"
              @input="formCustom.userCode = arguments[0].replace(/\s+/g,'')"
            >
            <Icon
              type="person"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="password"
            style='position:relative;'
          >
            <Input
              type="password"
              placeholder="请输入登录密码"
              v-model="formCustom.password"
              @input="formCustom.password = arguments[0].replace(/\s+/g,'')"
            >
            <Icon
              type="ios-locked"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem prop="passwdCheck">
            <Input
              type="password"
              v-model="formCustom.passwdCheck"
              @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g,'')"
              placeholder="请输入登录密码"
            >
            <Icon
              type="ios-locked"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <!-- 新增表单 -->
          <FormItem
            prop="realName"
            v-if="otherData.realName.show"
          >
            <Input
              type="text"
              v-model="formCustom.realName"
              :placeholder="otherData.realName.need? '请输入真实姓名（必填）' : '请输入真实姓名（选填）'"
            >
            <Icon
              type="person-add"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="idCard"
            v-if="otherData.idCard.show"
          >
            <Input
              type="text"
              v-model="formCustom.idCard"
              :placeholder="otherData.idCard.need? '请输入身份证号码（必填）' : '请输入身份证号码（选填）'"
            >
            <Icon
              type="card"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="phone"
            v-if="otherData.phone.show"
          >
            <Input
              type="text"
              v-model="formCustom.phone"
              :placeholder="otherData.phone.need? '请输入手机号码（必填）' : '请输入手机号码（选填）'"
            >
            <Icon
              type="android-phone-portrait"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <div class="form-sms" v-if="otherData.smsPhoneCode">
            <FormItem
                    prop="smsPhoneCode"
            >
              <Input
                      type="text"
                      :value="formCustom.smsPhoneCode"
                      @input="formCustom.smsPhoneCode=arguments[0].replace(/\s+/g,'')"
                      placeholder="请输入短信验证码"
              >
                <Icon
                        type="android-textsms"
                        slot="prepend"
                ></Icon>
              </Input>
            </FormItem>
            <Button type="primary" :disabled="smsPhoneCodeDisabled" @click="onSendSmsPhoneCodeClick('formCustom')">{{smsPhoneCodeText}}</Button>
          </div>
          <FormItem
            prop="wechat"
            v-if="otherData.wechat.show"
          >
            <Input
              type="text"
              v-model="formCustom.wechat"
              :placeholder="otherData.wechat.need? '请输入微信号（必填）' : '请输入微信号（选填）'"
              @input="formCustom.wechat=arguments[0].replace(/\s+/g,'')"
            >
            <Icon
              type="chatbubbles"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="email"
            v-if="otherData.email.show"
          >
            <Input
              type="text"
              v-model="formCustom.email"
              :placeholder="otherData.email.need? '请输入邮箱（必填）' : '请输入邮箱（选填）'"
            >
            <Icon
              type="ios-email"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="qq"
            v-if="otherData.qq.show"
          >
            <Input
              type="text"
              v-model="formCustom.qq"
              :placeholder="otherData.qq.need? '请输入QQ号码（必填）' : '请输入QQ号码（选填）'"
            >
            <Icon
              type="social-tux"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <!-- 新增表单结束 -->
          <FormItem
            prop="expandCode"
            v-show="!inviteHide"
            :rules="{required: !!otherData.expandCode.need , message: '请输入邀请码', trigger: 'blur'}"
          >
            <Input
              type="text"
              v-model="formCustom.expandCode"
              :placeholder="'请输入邀请码'+ (!!otherData.expandCode.need ? '（必填）' : '（选填）')"
              :disabled="urlExp || urlTTPaste"
            >
            <Icon
              type="android-drafts"
              slot="prepend"
            ></Icon>
            </Input>
          </FormItem>
          <FormItem
            prop="checkCode"
            class="valida"
            v-if='!captchaFlag'
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="请输入验证码"
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
            style="height:40px;"
            v-else
          >
            <div id="registerCaptcha">
            </div>
          </FormItem>
          <FormItem
            class="agree"
            prop="agree"
            :label-width="0"
          >
            <Checkbox v-model="formCustom.agree"></Checkbox>
            <span class="agreement">
              我已同意各项开户协议
              <a
                href=""
                class="khxy"
                @click.prevent="modal1 = true"
              >《开户协议》</a>
            </span>
            <agree
              :modal1="modal1"
              @back="modal1=false;"
            ></agree>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="commit-register"
              long
              @click="handleSubmit('formCustom')"
            >注册</Button>
          </FormItem>
          <div class="other-operation">
            <router-link
              to="/login"
              class="go-register"
            >已有账号,去登录</router-link>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import registerMixin from "@/views/register/registerMixin.js";
export default {
  mixins: [registerMixin],
  data() {
    return {
      currentPage: "register"
    };
  }
};
</script>

<style lang="less" scoped>
  @deep: ~">>>";
.template3.login-page {
  position: relative;
  top: 0;
  width: 100%;
  height: 100%;
  background: url("../../images/4_bg.png") repeat-y center top;
  background-size: contain;
}
.template3.login-page .footer {
  background: rgba(0, 0, 0, 0) url(../../images/bottom.png) no-repeat center
    bottom !important;
  background-size: cover;
}
.template3.login-page .container {
  position: relative;
  width: 616px;
  top: 78px;
  margin: auto;
  padding-top: 20px;
  border-radius: 18px;
  margin-bottom: 180px;
  background-size: 100%;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0px 0px 3px 3px rgba(226, 226, 226, 1);
}
.template3.login-page .login-img {
  float: left;
  margin-top: 63px;
  margin-left: -2px;
}
.template3.login-page .container .cont {
  // height: 100%;
  width: 100%;
  margin-top: 30px;
  margin: auto;
}
.template3.login-page .cont-title {
  width: 320px;
  line-height: 60px;
  height: 60px;
  margin-bottom: 20px;
  margin: auto;
}
.template3.login-page /deep/.ivu-input-group {
  width: 444px;
  left: 0;
  right: 0;
  margin: auto;
}
.template3.login-page /deep/.ivu-form-item-error-tip {
  // left: initial;
  // top: 0;
  // right: 0;
  // width: 130px;
  // height: 40px;
  // font-size: 12px;
  color: #ae291a;
}
.template3.login-page .other-operation {
  width: 444px;
  margin: auto;
  margin-bottom: 20px;
}
.template3.login-page .cont-title h4 {
  width: 96px;
  float: left;
  height: 60px;
  font-size: 20px;
  color: @primary-color;
  text-align: center;
  font-weight: normal;
  margin-bottom: 30px;
  cursor: pointer;
  &.fr {
    float: right;
  }
  &.active {
    border-bottom: 2px solid #2d72ff;
  }
}
.template3.login-page .cont /deep/.ivu-form-item .ivu-input {
  height: 45px;
  border-radius: 33px;
  border-left-width: 0;
  background-color: #eee;
  font-size: 16px;
  border: none;
  outline: none;
  padding: 0;
}
.template3.login-page .cont /deep/.ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 27px;
  border-radius: 33px;
  background-color: #eeeeee;
  border: none;
  padding-left: 24px;
  color: #a7b4cd;
}
.template3.login-page .cont .valida .valida-code {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 19px;
  height: 28px;
  width: auto;
  cursor: pointer;
  margin: auto;
  z-index: 2;
}
.template3.login-page /deep/.ivu-form-item-content {
  width: 444px;
  margin: auto;
}
.template3.login-page .cont .commit-register {
  width: 444px;
  height: 45px;
  font-size: 18px;
  border-radius: 33px;
  padding: 0;
  margin: auto;
}
.template3 .other-operation {
  padding: 10px;
  font-size: 14px;
}
.login-page .foget-password {
  color: @primary-color;
}
.template3.login-page .go-register {
  color: #2d72ff;
}
.template3 .myPhone {
  position: absolute;
  left: 10px;
  top: -10px;
}
.template3.login-page /deep/.ivu-btn-primary {
  background-color: #999;
  border-color: #999;
}
.template3.valida-wrap {
  position: relative;
}
.template3 .agreement {
  font-size: 16px;
  color: #2d72ff;
}
.template3 .khxy {
  font-size: 16px;
  color: #a36dff;
}
.template3.login-page /deep/.ivu-checkbox-wrapper {
  font-size: 16px;
  color: #2d72ff;
}
.template3.login-page /deep/.ivu-checkbox-checked .ivu-checkbox-inner {
  background-color: #2d72ff;
  border-color: #2d72ff;
}
.template3.login-page /deep/.ivu-btn-primary {
  background-image: linear-gradient(to right, #3b72ff, #a36dff);
  border: none;
}
.template3.login-page {
  .form-sms {
    display: flex;
    width: 444px;
    margin: auto;
    .ivu-form-item {
      flex: 1;
      margin-right: 10px;
      @{deep} input {
        width: 100% !important;
      }
      @{deep} .ivu-form-item-content {
        width: auto;
      }
      @{deep} .ivu-input-group {
        width: 100%;
      }
    }
    > button {
      height: 44px;
      margin-top: 1px;
    }
  }
}

</style>

