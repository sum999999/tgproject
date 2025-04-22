<template>
  <div class="register-page">
    <myTitle
      redTitle="欢迎"
      whiteTitle="光临"
      subTitle="国际品牌真挚所在"
      :text="title"
      :img="require('@/assets/images/template-v2/login-meizi.png')"
    ></myTitle>
    <div class="container" ref="registerBox">
      <div class="cont">
        <div class="cont-title">
          <h4>会员注册</h4>
          <p class="en">registered</p>
        </div>
        <Form
          ref="formCustom"
          :model="formCustom"
          :rules="ruleInline"
          :label-width="100"
        >
          <FormItem prop="userCode" label="会员账号">
            <Input
              type="text"
              :value="formCustom.userCode"
              @input="formCustom.userCode = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
            <p class="input-tip">8-14个字符,字母与数字</p>
          </FormItem>
          <FormItem prop="password" style="position:relative;" label="会员密码">
            <Input
              type="password"
              :value="formCustom.password"
              @input="formCustom.password = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.password"
            >
            </Input>
            <p class="input-tip">6-14个字符,字母与数字组合</p>
          </FormItem>
          <FormItem prop="passwdCheck" label="确认密码">
            <Input
              type="password"
              v-model="formCustom.passwdCheck"
              @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
            <p class="input-tip">6-14个字符,字母与数字组合</p>
          </FormItem>

          <!-- 新增表单 -->
          <FormItem
            prop="realName"
            v-if="otherData.realName.show"
            label="真实姓名"
          >
            <Input type="text" v-model="formCustom.realName"> </Input>
            <p class="input-tip">
              {{
                otherData.realName.need
                  ? "请输入真实姓名（必填）"
                  : "请输入真实姓名（选填）"
              }}
            </p>
          </FormItem>
          <FormItem
            prop="idCard"
            v-if="otherData.idCard.show"
            label="身份证号码"
          >
            <Input type="text" v-model="formCustom.idCard"> </Input>
            <p class="input-tip">
              {{
                otherData.idCard.need
                  ? "请输入身份证号码（必填）"
                  : "请输入身份证号码（选填）"
              }}
            </p>
          </FormItem>
          <FormItem prop="phone" v-if="otherData.phone.show" label="手机号码">
            <Input type="text" v-model="formCustom.phone"> </Input>
            <p class="input-tip">
              {{
                otherData.phone.need
                  ? "请输入手机号码（必填）"
                  : "请输入手机号码（选填）"
              }}
            </p>
          </FormItem>
          <div class="form-sms" v-if="otherData.smsPhoneCode">
            <FormItem prop="smsPhoneCode" label="短信验证码">
              <Input
                type="text"
                :value="formCustom.smsPhoneCode"
                @input="
                  formCustom.smsPhoneCode = arguments[0].replace(/\s+/g, '')
                "
              >
              </Input>
            </FormItem>
            <Button
              type="primary"
              :disabled="smsPhoneCodeDisabled"
              @click="onSendSmsPhoneCodeClick('formCustom')"
              >{{ smsPhoneCodeText }}</Button
            >
          </div>
          <FormItem prop="wechat" v-if="otherData.wechat.show" label="微 信 号">
            <Input
              type="text"
              :value="formCustom.wechat"
              @input="formCustom.wechat = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
            <p class="input-tip">
              {{
                otherData.wechat.need
                  ? "请输入微信号（必填）"
                  : "请输入微信号（选填）"
              }}
            </p>
          </FormItem>
          <FormItem prop="email" v-if="otherData.email.show" label="邮箱号码">
            <Input type="text" v-model="formCustom.email"> </Input>
            <p class="input-tip">
              {{
                otherData.email.need
                  ? "请输入邮箱（必填）"
                  : "请输入邮箱（选填）"
              }}
            </p>
          </FormItem>
          <FormItem prop="qq" v-if="otherData.qq.show" label="QQ号码">
            <Input type="text" v-model="formCustom.qq"> </Input>
            <p class="input-tip">
              {{
                otherData.qq.need
                  ? "请输入QQ号码（必填）"
                  : "请输入QQ号码（选填）"
              }}
            </p>
          </FormItem>
          <!-- 新增表单结束 -->
          <!-- 展示且不可编辑v-show="!inviteHide" -->
          <FormItem
            prop="expandCode"
            label="邀 请 码"
            :rules="{
              required: !!otherData.expandCode.need,
              message: '请输入邀请码',
              trigger: 'blur',
            }"
          >
            <Input
              type="text"
              v-model="formCustom.expandCode"
              :disabled="urlExp || urlTTPaste"
            >
            </Input>
            <p class="input-tip">
              {{
                "请输入邀请码" +
                  (!!otherData.expandCode.need ? "（必填）" : "（选填）")
              }}
            </p>
          </FormItem>
          <FormItem
            prop="checkCode"
            class="valida"
            label="验 证 码"
            v-if="!captchaFlag"
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              @on-enter="handleSubmit('formCustom')"
              @on-focus="refreshCheckCode()"
            >
            </Input>
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem class="valida" style="height:40px;" v-else>
            <div id="registerCaptcha"></div>
          </FormItem>

          <FormItem class="agree" prop="agree" :label-width="0">
            <Checkbox v-model="formCustom.agree"></Checkbox>
            <span>
              我已同意各项开户协议
              <a href="" class="khxy" @click.prevent="modal1 = true"
                >《开户协议》</a
              >
            </span>
            <agree :modal1="modal1" @back="modal1 = false"></agree>
          </FormItem>
        </Form>
      </div>
      <div class="btn-wrap">
        <Button
          type="primary"
          class="login-btn"
          long
          @click="handleSubmit('formCustom')"
          >立即注册</Button
        >

        <Button
          type="primary"
          class="login-btn btn-register"
          @click="$router.push('/login')"
          >已有账号,去登录</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import registerMixin from "@/views/register/registerMixin.js";
import title from "@/views-v2/common/module_vue/title.vue";
import Util from "@/utils/dom.js";
export default {
  mixins: [registerMixin],
  components: {
    myTitle: title,
  },
  data() {
    return {
      title: ` 欢迎光临-国际品牌真挚所在 ${configText.main}，专注于博彩行业发展、洞悉趋势变化、分析市场需求。作为彩票顶级专家、专业娱乐顾问，并不断创新及优化，全行领先首创新产品及功能。全方位满足客户需求，彩种包括分分彩，时时彩，11选5.福彩3D，六合彩，幸运飞艇，北京pk10等，亚洲顶尖级技术团队与市场团队强强联合并根据市场变化不断更新产品，市场独无仅有！~`,
    };
  },
  mounted() {
    this.$nextTick(() => {
      Util.setScrollTop(this.$refs.registerBox.offsetTop - 100);
    });
  },
};
</script>

<style lang="less" scoped>
@imgSrc: "../../../assets/images/template-v2";
@deep: ~">>>";
.register-page {
  background-image: url("@{imgSrc}/bg.png");
  min-height: 900px;
  padding-bottom: 300px;
  background-position: center -216px;
  background-repeat: repeat no-repeat;
  @{deep} .right-logo {
    bottom: -100px !important;
  }
}
.register-page .cont-title {
  width: 140px;
  position: absolute;
  left: 30px;
  top: -35px;
  line-height: 30px;
  height: 45px;
  margin-bottom: 20px;
  background-color: #131522;
  text-align: center;
  h4 {
    font-size: 30px;
    margin-bottom: 5px;
    color: #ed1459;
  }
  .en {
    color: #ed1459;
  }
}

.register-page .container {
  width: 1200px;
  margin: 0 auto;
  border-radius: 6px;
  padding-top: 120px;
  padding-bottom: 120px;
  background-color: #141522;
  box-shadow: 0 0 10px 2px #11121d;
}
.register-page .container .cont {
  height: 100%;
  width: 851px;
  margin: 0 auto;
  padding: 90px 160px;
  position: relative;
  border: 1px solid #484a63;
  border-radius: 10px;
}
/* .register-page .cont .ivu-form-item .ivu-input {
  width: 71%;
  height: 36px;
} */

.register-page {
  @{deep} .ivu-form-item {
    .ivu-input {
      height: 45px;
      background-color: #212335;
      border: none;
      color: #ed1459;
      font-size: 14px;
    }
    .ivu-input-wrapper {
      width: 320px;
    }
    .ivu-form-item-label {
      color: #fff;
      letter-spacing: 2px;
      font-size: 15px;
    }
    .ivu-form-item-error-tip {
      color: #ed1459;
    }
  }
  @{deep} .ivu-form-item-content {
    position: relative;
    .input-tip {
      height: 24px;
      line-height: 24px;
      position: absolute;
      white-space: nowrap;
      left: 340px;
      top: 10px;
      color: #fff;
    }
  }
  @{deep} .ivu-form-item-required .ivu-form-item-label:before {
    color: #ed1459;
  }
  .agree {
    @{deep} .ivu-form-item-content {
      color: #fff;
      font-size: 14px;
      padding-left: 40px;
      .khxy {
        color: #ed1459;
        text-decoration: underline;
      }
      .ivu-form-item-error-tip {
        padding-left: 40px;
      }
    }
  }
  @{deep} .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: #ed1459;
    background-color: #ed1459;
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
      height: 44px;
      margin-top: 1px;
    }
  }
}

.register-page .cont .ivu-input-group-prepend {
  /* width: 50%; */
  padding: 4px 10px;
  font-size: 18px;
}
.register-page .cont .valida .valida-code {
  position: absolute;
  top: 6px;
  right: 115px;
  height: 34px;
  width: auto;
  cursor: pointer;
  z-index: 2;
}
.register-page .cont .commit-register {
  height: 44px;
  font-size: 18px;
}

.register-page .cont .agree .ivu-form-item-error-tip {
  padding-top: 0;
}
.register-page .agree .ivu-modal p {
  width: 100%;
}
.register-page .agree p {
  font-weight: 600;
  color: @register-agree-content-color;
  font-size: 14px;
}
.register-page .agree .content {
  color: @register-agree-content-color;
}
.register-page .ivu-btn-long {
  width: 73%;
}
.btn-wrap {
  margin-top: 140px;
  text-align: center;
  .login-btn {
    display: inline-block;
    width: 160px;
    height: 42px;
    border: 1px solid #ed1459;
    background-color: #ed1459;
  }
  .btn-register {
    margin-left: 40px;
    background-color: transparent;
    color: #ed1459;
  }
}
</style>

<style lang="less">
@import "~@/mixins/captcha.less";
#registerCaptcha {
}
</style>
