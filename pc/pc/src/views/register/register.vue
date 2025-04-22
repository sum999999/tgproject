<template>
  <div class="register-page">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4>账号注册</h4>
          <div class="">
            <span>已有账号&nbsp;&nbsp;</span>
            <router-link to="/login">立即登录</router-link>
          </div>
        </div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
          <FormItem prop="userCode">
            <Input
              type="text"
              :value="formCustom.userCode"
              @input="formCustom.userCode = arguments[0].replace(/\s+/g, '')"
              placeholder="账号"
            >
              <Icon type="person" slot="prepend"></Icon>
            </Input>
            <p
              v-if="showUserCodeTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;"
            >
              账号: 8-14个字符,字母与数字
            </p>
          </FormItem>
          <FormItem prop="password" style="position:relative;">
            <Input
              type="password"
              :value="formCustom.password"
              @input="formCustom.password = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.password"
              placeholder="密码"
            >
              <Icon type="ios-locked" slot="prepend"></Icon>
            </Input>
            <p
              v-if="showPasswordTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;"
            >
              密码规则: 6-14个字符,字母与数字组合
            </p>
          </FormItem>
          <FormItem prop="passwdCheck">
            <Input
              type="password"
              @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.passwdCheck"
              placeholder="确认密码"
            >
              <Icon type="ios-locked" slot="prepend"></Icon>
            </Input>
          </FormItem>

          <!-- 新增表单 -->
          <FormItem prop="realName" v-if="otherData.realName.show">
            <Input
              type="text"
              v-model="formCustom.realName"
              :placeholder="
                otherData.realName.need
                  ? '请输入真实姓名（必填）'
                  : '请输入真实姓名（选填）'
              "
            >
              <Icon type="person-add" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="idCard" v-if="otherData.idCard.show">
            <Input
              type="text"
              v-model="formCustom.idCard"
              :placeholder="
                otherData.idCard.need
                  ? '请输入身份证号码（必填）'
                  : '请输入身份证号码（选填）'
              "
            >
              <Icon type="card" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="phone" v-if="otherData.phone.show">
            <Input
              type="text"
              v-model="formCustom.phone"
              :placeholder="
                otherData.phone.need
                  ? '请输入手机号码（必填）'
                  : '请输入手机号码（选填）'
              "
            >
              <Icon type="android-phone-portrait" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <div class="form-sms" v-if="otherData.smsPhoneCode">
            <FormItem prop="smsPhoneCode">
              <Input
                type="text"
                :value="formCustom.smsPhoneCode"
                @input="
                  formCustom.smsPhoneCode = arguments[0].replace(/\s+/g, '')
                "
                placeholder="请输入短信验证码"
              >
                <Icon type="android-textsms" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <Button
              type="primary"
              :disabled="smsPhoneCodeDisabled"
              @click="onSendSmsPhoneCodeClick('formCustom')"
              >{{ smsPhoneCodeText }}</Button
            >
          </div>
          <!-- 验证码校验 -->
          <div id="captcha"></div>
          <FormItem prop="wechat" v-if="otherData.wechat.show">
            <Input
              type="text"
              :value="formCustom.wechat"
              @input="formCustom.wechat = arguments[0].replace(/\s+/g, '')"
              :placeholder="
                otherData.wechat.need
                  ? '请输入微信号（必填）'
                  : '请输入微信号（选填）'
              "
            >
              <Icon type="chatbubbles" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="email" v-if="otherData.email.show">
            <Input
              type="text"
              v-model="formCustom.email"
              :placeholder="
                otherData.email.need
                  ? '请输入邮箱（必填）'
                  : '请输入邮箱（选填）'
              "
            >
              <Icon type="ios-email" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="qq" v-if="otherData.qq.show">
            <Input
              type="text"
              v-model="formCustom.qq"
              :placeholder="
                otherData.qq.need
                  ? '请输入QQ号码（必填）'
                  : '请输入QQ号码（选填）'
              "
            >
              <Icon type="social-tux" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <!-- 新增表单结束 -->
          <!-- 邀请码可见不可编辑v-show="!inviteHide" -->
          <FormItem
            v-show="isShowInviteCodeInput"
            prop="expandCode"
            :rules="{
              required: !!otherData.expandCode.need,
              message: '请输入邀请码',
              trigger: 'blur',
            }"
          >
            <Input
              type="text"
              v-model="formCustom.expandCode"
              :placeholder="
                '请输入邀请码' +
                  (!!otherData.expandCode.need ? '（必填）' : '（选填）')
              "
              :disabled="urlExp || urlTTPaste"
            >
              <Icon type="android-drafts" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="checkCode" class="valida" v-if="!captchaFlag">
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="验证码"
              @on-enter="handleSubmit('formCustom')"
              @on-focus="refreshCheckCode()"
            >
              <Icon type="social-snapchat" slot="prepend"></Icon>
            </Input>
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem class="valida" style="height:40px;" v-else>
            <div id="registerCaptcha"></div>
          </FormItem>
          <FormItem class="agree" prop="agree">
            <Checkbox v-model="formCustom.agree"></Checkbox>
            <span>
              <a href="" class="khxy" @click.prevent="modal1 = true"
                >《开户协议》</a
              >
            </span>
            <agree :modal1="modal1" @back="modal1 = false"></agree>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="commit-register"
              long
              v-preventReClick="2000"
              @click="handleSubmit('formCustom')"
              >注册</Button
            >
          </FormItem>
        </Form>
      </div>
      <!-- 右侧图片 -->
      <!-- <div class="rightBanner">
        <img
          :src="loginAvatar"
          alt=""
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import registerMixin from "@/views/register/registerMixin.js";
export default {
  mixins: [registerMixin],
};
</script>

<style lang="less" scoped>
@import "~@/mixins/captcha.less";
@deep: ~">>>";
.register-page {
  background: url(/static/images/register.png) no-repeat 0 0;
  background-size: 100% 100%;
  min-height: 800px;
  @{deep}.cont-title {
    width: 73%;
    border-bottom: 2px solid #f1f1f1;
    line-height: 30px;
    height: 40px;
    margin-bottom: 20px;
    h4 {
      float: left;
      font-size: 16px;
      color: @primary-color;
    }
    > div {
      float: right;
      span {
        color: #8b8c8d;
      }
      a {
        color: @primary-color;
      }
    }
  }
  @{deep}.container {
    width: 521px;
    height: 765px;
    // min-height: 560px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    padding: 10px;
    position: relative;
    top: 20px;
    box-shadow: 0 0 13px rgba(190, 18, 4, 0.2);
    .cont {
      height: 100%;
      width: 100%;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.7);
      padding: 20px 0px 23px 90px;
      // margin: 5px 0px;
      .ivu-form-item {
        .ivu-input {
          width: 71%;
          height: 36px;
        }
      }
      .ivu-input-group-prepend {
        padding: 4px 10px;
        font-size: 18px;
      }
      .valida {
        .valida-code {
          position: absolute;
          top: 2px;
          right: 141px;
          height: 34px;
          width: auto;
          cursor: pointer;
          z-index: 2;
        }
      }
      .commit-register {
        height: 44px;
        font-size: 18px;
      }
      .agree {
        .ivu-form-item-error-tip {
          padding-top: 0;
        }
        .ivu-modal {
          p {
            width: 100%;
          }
        }
        p {
          font-weight: 600;
          color: @register-agree-content-color;
          font-size: 14px;
        }
        .content {
          color: @register-agree-content-color;
        }
      }
    }
  }
  @{deep}.ivu-btn-long {
    width: 73%;
  }
  @{deep}.rightBanner {
    float: right;
    position: absolute;
    top: 69px;
    right: 22px;
  }
  .form-sms {
    display: flex;
    width: 71%;
    .ivu-form-item {
      flex: 1;
      margin-right: 10px;
      @{deep} input {
        width: 100% !important;
      }
    }
    > button {
      margin-right: -9px;
      height: 36px;
      margin-top: 1px;
    }
  }
}
.register-page .rightBanner {
  float: right;
  position: absolute;
  top: 69px;
  right: 22px;
}
</style>
