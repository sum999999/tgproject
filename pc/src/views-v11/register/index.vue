<template>
  <div class="register-pagen">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4>账号注册</h4>
          <!-- <div class="">
            <span>已有账号&nbsp;&nbsp;</span>
            <router-link to="/login">立即登录</router-link>
          </div> -->
        </div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
          <FormItem prop="userCode">
            <span class="stitle">账号</span>
            <Input
              type="text"
              :value="formCustom.userCode"
              @input="formCustom.userCode = arguments[0].replace(/\s+/g, '')"
              placeholder="账号"
            />
            <p v-if="showUserCodeTip">账号: 8-14个字符,字母与数字</p>
          </FormItem>
          <FormItem prop="password" style="position: relative">
            <span class="stitle">密码</span>
            <Input
              type="password"
              :value="formCustom.password"
              @input="formCustom.password = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.password"
              placeholder="密码"
            />
            <p v-if="showPasswordTip">密码规则: 6-14个字符,字母与数字组合</p>
          </FormItem>
          <FormItem prop="passwdCheck">
            <span class="stitle">确认密码</span>
            <Input
              type="password"
              @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.passwdCheck"
              placeholder="确认密码"
            />
          </FormItem>

          <!-- 新增表单 -->
          <FormItem prop="realName" v-if="otherData.realName.show">
            <span class="stitle">姓名</span>
            <Input
              type="text"
              v-model="formCustom.realName"
              :placeholder="
                otherData.realName.need
                  ? '请输入真实姓名（必填）'
                  : '请输入真实姓名（选填）'
              "
            />
          </FormItem>
          <FormItem prop="idCard" v-if="otherData.idCard.show">
            <span class="stitle">证件号</span>
            <Input
              type="text"
              v-model="formCustom.idCard"
              :placeholder="
                otherData.idCard.need
                  ? '请输入身份证号码（必填）'
                  : '请输入身份证号码（选填）'
              "
            />
          </FormItem>
          <FormItem prop="phone" v-if="otherData.phone.show">
            <span class="stitle">手机号</span>
            <Input
              type="text"
              v-model="formCustom.phone"
              :placeholder="
                otherData.phone.need
                  ? '请输入手机号码（必填）'
                  : '请输入手机号码（选填）'
              "
            />
          </FormItem>
          <div class="form-sms" v-if="otherData.smsPhoneCode">
            <FormItem prop="smsPhoneCode">
              <span class="stitle">验证码</span>
              <Input
                type="text"
                :value="formCustom.smsPhoneCode"
                @input="
                  formCustom.smsPhoneCode = arguments[0].replace(/\s+/g, '')
                "
                placeholder="请输入短信验证码"
              />
            </FormItem>
            <Button
              type="primary"
              :class="{
                'ivu-btn-style--11': $store.getters.pageTemplate.index === 11,
              }"
              :disabled="smsPhoneCodeDisabled"
              @click="onSendSmsPhoneCodeClick('formCustom')"
              >{{ smsPhoneCodeText }}</Button
            >
          </div>
          <div id="captcha"></div>
          <FormItem prop="wechat" v-if="otherData.wechat.show">
            <span class="stitle">微信号</span>
            <Input
              type="text"
              :value="formCustom.wechat"
              @input="formCustom.wechat = arguments[0].replace(/\s+/g, '')"
              :placeholder="
                otherData.wechat.need
                  ? '请输入微信号（必填）'
                  : '请输入微信号（选填）'
              "
            />
          </FormItem>
          <FormItem prop="email" v-if="otherData.email.show">
            <span class="stitle">邮箱</span>
            <Input
              type="text"
              v-model="formCustom.email"
              :placeholder="
                otherData.email.need
                  ? '请输入邮箱（必填）'
                  : '请输入邮箱（选填）'
              "
            />
          </FormItem>
          <FormItem prop="qq" v-if="otherData.qq.show">
            <span class="stitle">QQ号</span>
            <Input
              type="text"
              v-model="formCustom.qq"
              :placeholder="
                otherData.qq.need
                  ? '请输入QQ号码（必填）'
                  : '请输入QQ号码（选填）'
              "
            />
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
            <span class="stitle">邀请码</span>
            <Input
              type="text"
              v-model="formCustom.expandCode"
              :placeholder="
                '请输入邀请码' +
                  (!!otherData.expandCode.need ? '（必填）' : '（选填）')
              "
              :disabled="urlExp || urlTTPaste"
            />
          </FormItem>
          <FormItem prop="checkCode" class="valida" v-if="!captchaFlag">
            <span class="stitle">验证码</span>
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="验证码"
              @on-enter="handleSubmit('formCustom')"
              @on-focus="refreshCheckCode()"
            />
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem class="valida" style="height: 40px" v-else>
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
              :class="{
                'ivu-btn-style--11': $store.getters.pageTemplate.index === 11,
              }"
              long
              v-preventReClick="2000"
              @click="handleSubmit('formCustom')"
              >注册</Button
            >
            <Button
              type="primary"
              class="commit-register "
              id="reset"
              long
              v-preventReClick="2000"
              @click="handleReset"
              >重置</Button
            >
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import registerMixin from "@/views-v11/register/registerMixin.js";
export default {
  mixins: [registerMixin],
};
</script>

<style lang="less" scoped>
@import "~@/mixins/captcha.less";
@deep: ~">>>";
.register-pagen {
  // background:  url(/static/images/register.png) no-repeat 0 0;
  // background-size: 100% 100%;
  //min-height: 800px;
  @{deep}.cont-title {
    border-bottom: 2px dashed #f1f1f1;
    line-height: 30px;
    height: 45px;
    margin-bottom: 20px;
    h4 {
      font-size: 24px;
      margin-bottom: 5px;
      color: #ff2c55;
    }
  }
  @{deep}.container {
    border: 1px solid #e1e1e2;
    width: 870px;
    margin: 30px auto;
    background: url("~@/assets/images-v11/loginBg.png") no-repeat 490px bottom
      #fff;
    border-radius: 6px;
    padding: 10px;
    .cont {
      height: 100%;
      width: 90%;
      border-radius: 6px;
      padding: 20px 0px 23px 90px;
      // margin: 5px 0px;
      .ivu-form-item {
        .ivu-input {
          width: 95%;
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
          top: 0.54px;
          left: 237px;
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
      .ivu-btn-style--11 {
        background: #e4393c;
        border: 1px solid #e4393c;
      }

      #reset {
        background: #717074;
        border: #717074;
        margin-left: 65px;
      }
      .ivu-btn-primary {
        color: #fff;
        background-color: #e4393c;
        border-color: #e4393c;
      }
      .ivu-btn-primary:hover {
        background-color: #ce1c1f;
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
    height: 36px;
    .ivu-form-item {
      flex: 1;
      margin-right: 10px;
      @{deep} input {
        width: 100% !important;
      }
    }
    .ivu-btn-style--11 {
      background: #e4393c;
      border: 1px solid #e4393c;
    }
    > button {
      margin-right: -9px;
      height: 36px;
      margin-top: 1px;
    }
  }
}
.register-pagen .rightBanner {
  float: right;
  position: absolute;
  top: 69px;
  right: 22px;
}
</style>
<style lang="less">
.register-pagen {
  .ivu-form-item-content {
    display: flex;
    align-items: center;
    .stitle {
      width: 60px;
    }
    p {
      height: 24px;
      line-height: 24px;
      color: #313131;
    }
  }
  .ivu-input-wrapper {
    width: 280px;
  }
  .ivu-form-label-right {
    width: 620px;
  }
  .commit-register {
    width: 130px !important;
    height: 36px !important;
  }
  .nlogin {
    display: flex;
    align-items: center;
    .ivu-form-item {
      margin: 0;
    }
  }
}
</style>
