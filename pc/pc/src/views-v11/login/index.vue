<template>
  <div class="login-pagen">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4>用户登录</h4>
        </div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
          <FormItem prop="userCode">
            <span>账号</span>
            <Input
              type="text"
              v-model="formCustom.userCode"
              placeholder="请填写账号"
            />
          </FormItem>
          <FormItem prop="password">
            <span>密码</span>
            <Input
              type="password"
              v-model="formCustom.password"
              placeholder="请填写密码"
            />
          </FormItem>
          <FormItem prop="checkCode" class="valida" v-if="!captchaFlag">
            <span>验证码</span>
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="验证码"
              @on-enter="handleSubmit('formCustom')"
              @on-focus="refreshCheckCode()"
            />
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem class="valida" v-else>
            <div id="captcha"></div>
          </FormItem>
          <FormItem class="Save">
            <div class="SavePassword">
              <input v-model="saveAccount" type="checkbox"></input>
              <span style="margin-left: 5px;">记住我</span>
            </div>
            <div class="other-operation">
              <a class="foget-password" @click="forgetPass">忘记密码?</a>
              <!-- <router-link to="/register" class="go-register"
                >立即注册</router-link
              > -->
            </div>
          </FormItem>
          <div class="nlogin">
            <FormItem>
              
              <div
                type="primary"
                class="commit-register"
                long
                v-preventReClick="2000"
                @click="handleSubmit('formCustom')"
              >
                登录
              </div>
            </FormItem>
            
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import loginMixin from "@/views-v11/login/loginMixin.js";
export default {
  mixins: [loginMixin],
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.login-pagen {
  margin: 30px 0;
}
.login-pagen .container {
  width: 870px;
  height: 458px;
  margin: 0 auto;
  // background: #fff;
  background: url("~@/assets/images-v11/loginBg.png") no-repeat 490px 180px #fff;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e1e1e2;
}

.login-pagen .container .cont {
  height: 100%;
  width: 855px;
  padding: 25px 60px;
}
.login-pagen .cont-title {
  border-bottom: 2px dashed #f1f1f1;
  line-height: 30px;
  height: 36px;
  margin-bottom: 20px;
}
.login-pagen .cont-title h4 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #ff2c55;
}
.login-pagen .cont @{deep} .ivu-form-item .ivu-input {
  height: 36px;
}
.login-pagen .cont @{deep} .ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 18px;
}
.login-pagen .cont .valida .valida-code {
  position: absolute;
  top: 0.4px;
  right: 2px;
  height: 34px;
  width: auto;
  cursor: pointer;
  z-index: 2;
}
.login-pagen .cont .commit-register {
  padding: 0 15px;
  border-radius: 3px;
  font-size: 14px;
  width: 320px;
  text-align: center;
  cursor: pointer;
  background: #e4393c;
  font-size: 14px;
  color: #fff;
  margin: -12px 50px
}
.login-pagen .cont .commit-register:hover {
  background-color: #ce1c1f;
}
.other-operation {
  padding: 0px;
  font-size: 14px;
}
.login-pagen .foget-password {
  color: #ff2c55;
}
.login-pagen .go-register {
  color: #8b8c8d;
  float: right;
}
</style>
<style lang="less">
.login-pagen {
  .ivu-form-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      width: 55px;
    }
  }
  .ivu-form-label-right {
    width: 375px;
  }
}
.Save {
  // display: flex;
  // justify-content: space-between;
  
  .SavePassword{
  display: flex;
  padding-left: 50px;
}
}

.nlogin {
  display: flex;
  align-items: center;
  .ivu-form-item {
    margin: 0;
  }
}
</style>
