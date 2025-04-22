<template>
  <div class="login-page">
    <myTitle
      redTitle="欢迎"
      whiteTitle="光临"
      subTitle="国际品牌真挚所在"
      :text="title"
      :img="require('@/assets/images/template-v2/login-meizi.png')"
    ></myTitle>
    <div
      class="container"
      ref="loginBox"
    >
      <div class="cont">
        <div class="cont-title">
          <h4>会员登录</h4>
          <p class="en">Loading</p>
        </div>
        <Form
          ref="formCustom"
          :model="formCustom"
          :rules="ruleInline"
          :label-width="100"
        >
          <FormItem
            prop="userCode"
            label="会员账号"
          >
            <Input
              type="text"
              v-model="formCustom.userCode"
            >
            </Input>
          </FormItem>
          <FormItem
            prop="password"
            label="会员密码"
          >
            <Input
              type="password"
              v-model="formCustom.password"
            >
            </Input>
            <span
              class="for-pwd"
              @click.stop="$router.push('/password')"
            >忘记密码?</span>
          </FormItem>
          <FormItem
            prop="checkCode"
            class="valida"
            v-if="!captchaFlag"
            label="验 证 码"
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              @on-enter="handleSubmit('formCustom')"
              @on-focus='refreshCheckCode()'
            >
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
        </Form>
      </div>
      <div class="btn-wrap">
        <Button
          type="primary"
          class="login-btn"
          long
          @click="handleSubmit('formCustom')"
        >立即登录</Button>

        <Button
          type="primary"
          class="login-btn btn-register"
          @click="$router.push('/register')"
        >快速注册</Button>
      </div>
    </div>
  </div>
</template>

<script>
import loginMixin from "@/views/login/loginMixin.js";
import title from "@/views-v2/common/module_vue/title.vue";
import Util from "@/utils/dom.js";
export default {
  mixins: [loginMixin],
  components: {
    myTitle: title
  },
  data() {
    return {
      title: ` 欢迎光临-国际品牌真挚所在 ${
        configText.main
      }，专注于博彩行业发展、洞悉趋势变化、分析市场需求。作为彩票顶级专家、专业娱乐顾问，并不断创新及优化，全行领先首创新产品及功能。全方位满足客户需求，彩种包括分分彩，时时彩，11选5.福彩3D，六合彩，幸运飞艇，北京pk10等，亚洲顶尖级技术团队与市场团队强强联合并根据市场变化不断更新产品，市场独无仅有！~`
    };
  },
  mounted() {
    this.$nextTick(() => {
      Util.setScrollTop(this.$refs.loginBox.offsetTop - 100);
    });
  }
};
</script>

<style  lang="less" scoped>
@imgSrc: "../../../assets/images/template-v2";
@deep: ~">>>";
.login-page {
  background-image: url("@{imgSrc}/bg.png");
  min-height: 900px;
  padding-bottom: 300px;
  background-position: center -216px;
  background-repeat: repeat no-repeat;
  @{deep} .right-logo {
    bottom: -100px !important;
  }
}
.login-page .container {
  width: 1200px;
  margin: 0 auto;
  border-radius: 6px;
  padding-top: 120px;
  padding-bottom: 120px;
  background-color: #141522;
  box-shadow: 0 0 10px 2px #11121d;
}
.login-page .login-img {
  float: right;
}
.login-page .container .cont {
  height: 100%;
  width: 851px;
  margin: 0 auto;
  padding: 90px 160px;
  position: relative;
  border: 1px solid #484a63;
  border-radius: 10px;
}
.login-page .cont-title {
  width: 140px;
  position: absolute;
  left: 30px;
  top: -35px;
  line-height: 30px;
  height: 45px;
  margin-bottom: 20px;
  background-color: #131522;
  color: #ed1459;
  text-align: center;
  h4 {
    font-size: 30px;
    margin-bottom: 5px;
  }
  .en {
    color: #ed1459;
  }
}

.login-page {
  @{deep} .ivu-form-item {
    .ivu-input {
      height: 45px;
      font-size: 14px;
      background-color: #212335;
      border: none;
      color: #ed1459;
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

  @{deep} .ivu-form-item-required .ivu-form-item-label:before {
    color: #ed1459;
  }
}

.login-page .cont .ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 18px;
}
.login-page .cont .valida .valida-code {
  position: absolute;
  top: 6px;
  right: 7px;
  height: 32px;
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
.for-pwd {
  position: absolute;
  color: #ed1459;
  right: -80px;
  top: 10px;
  font-size: 15px;
  cursor: pointer;
}
</style>

