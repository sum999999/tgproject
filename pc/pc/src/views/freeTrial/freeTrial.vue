<template>
  <div class="register-page">
    <div class="container">
      <div class="cont">
        <div class="cont-title">
          <h4>{{$configText.main}}平台免费试玩</h4>
          <!-- <div class="">
                        <span>已有账号&nbsp;&nbsp;</span>
                        <router-link to="/login">立即登录</router-link>
                    </div> -->
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
              :placeholder="$tex('账号')"
              disabled
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
              :placeholder="$tex('密码')"
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
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              :placeholder="$tex('验证码')"
            >
            <Icon
              type="social-snapchat"
              slot="prepend"
            ></Icon>
            </Input>
            <img
              class="valida-code"
              :src="ewmUrl"
              @click="getFreeTrialCode"
            >
          </FormItem>
          <!-- <FormItem prop="passwdCheck">
                        <Input type="password" v-model="formCustom.passwdCheck" placeholder="确认密码">
                            <Icon type="ios-locked" slot="prepend"></Icon>
                        </Input>
                    </FormItem> -->
          <!-- <FormItem prop="expandCode">
                        <Input type="text" v-model="formCustom.expandCode" placeholder="邀请码">
                            <Icon type="person-add" slot="prepend"></Icon>
                        </Input>
                    </FormItem> -->
          <!-- <FormItem prop="checkCode" class="valida">
                        <Input type="text" v-model="formCustom.checkCode" placeholder="验证码">
                            <Icon type="social-snapchat" slot="prepend"></Icon>
                        </Input>
                        <img class="valida-code" :src="'/api/v2/user/captcha.jpg?d='+ timeInter" @click="timeInter = new Date().getTime()">
                    </FormItem> -->
          <!-- <FormItem class="agree" prop="agree">
                        <Checkbox v-model="formCustom.agree"></Checkbox>
                        <span>我同意<a href="" style="color: #be1204">《166彩票网服务协议》</a></span>
                    </FormItem> -->
          <FormItem>
            <Button
              type="primary"
              class="commit-register"
              long
              v-preventReClick="2000"
              @click="handleSubmit('formCustom')"
            >{{$tex("注册")}}</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import encryption from "@/utils/md5";
import utils from "@/utils/utils";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$tex("请输入密码")));
      } else {
        callback();
      }
    };
    return {
      // timeInter: new Date().getTime(),
      ewmUrl: "",
      formCustom: {
        userCode: "",
        password: "",
        userType: "09", // 判断是不是试玩
        checkCode: ""
      },
      ruleInline: {
        password: [
          { validator: validatePass, trigger: "blur" },
          { type: "string", min: 6, message: this.$tex("最少六位数"), trigger: "blur" },
          {
            type: "string",
            max: 16,
            message: this.$tex("最多只能{num}位数", { num: 16 }),
            trigger: "blur"
          }
        ],
        checkCode: [
          { required: true, message: this.$tex("请输入验证码"), trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getFreeTrialCode() {
      const data = await utils.loadEwmUrl();
      this.ewmUrl = data.url;
      this.kaptchaFlag = data.kaptchaFlag;
    },
    handleSubmit(name) {
      let vm = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          var obj = Object.assign({}, vm[name]);
          obj.password = encryption.encrypt.md5(obj.password);
          vm.$http
            .post("/api/v2/user/register", obj, {
              kaptchaFlag: this.kaptchaFlag
            })
            .then(response => {
              if (response.data.code !== 0) {
                vm.getFreeTrialCode();
                return;
              }
              localStorage.setItem("user", JSON.stringify(response.data.data));
              this.$store.commit("getUser", response.data.data);
              vm.userInfo = response.data.data;
              vm.$router.push("/");
            });
        }
      });
    }
  },
  created() {
    let vm = this;
    this.getFreeTrialCode();
    vm.$http
      .post("/api/v2/user/getPlayAccount", "", { unenc: true })
      .then(response => {
        if (response.data.code !== 0) return;
        vm.$set(vm.formCustom, "userCode", response.data.data.playAccount);
      });
  }
};
</script>

<style>
.register-page {
  background: url("/static/images/register.png") no-repeat center;
  height: 800px;
  padding: 120px 0;
}
.register-page .cont-title {
  border-bottom: 2px solid #f1f1f1;
  line-height: 30px;
  height: 40px;
  margin-bottom: 20px;
}
.register-page .cont-title h4 {
  float: left;
  font-size: 16px;
  /*  color: #be1204; */
}
.register-page .cont-title > div {
  float: right;
}
.register-page .cont-title > div span {
  color: #8b8c8d;
}
.register-page .cont-title > div a {
  /*  color: #be1204; */
}
.register-page .container {
  width: 900px;
  height: 560px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 0 13px rgba(190, 18, 4, 0.2);
}
.register-page .container .cont {
  height: 100%;
  width: 100%;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
  padding: 50px 230px;
}
.register-page .cont .ivu-form-item .ivu-input {
  height: 36px;
}
.register-page .cont .ivu-input-group-prepend {
  /* width: 50%; */
  padding: 4px 10px;
  font-size: 18px;
}
.register-page .cont .valida .valida-code {
  position: absolute;
  top: 2px;
  right: 2px;
  height: 34px;
  width: auto;
  cursor: pointer;
  z-index: 1000;
}

.register-page .cont .agree .ivu-form-item-error-tip {
  padding-top: 0;
}
</style>

