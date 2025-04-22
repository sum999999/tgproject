<template>
  <modal
    :modalShow="isShow"
    :title="$tex('登录')"
    claName="login-dlg-wrap"
    width="380"
    :hasFooter="false"
    @btn-cancel="closeDlg"
  >
    <div slot="content">
      <div class="login-dlg">
        <!-- <i class="seft-close ivu-modal-close" @click="closeDlg">
                        <i class="ivu-icon ivu-icon-ios-close-empty"></i>
                </i> -->
        <div class="">
          <div class="cont">
            <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
              <FormItem prop="userCode">
                <Input
                  type="text"
                  v-model="formCustom.userCode"
                  :placeholder="$tex('账号')"
                >
                  <Icon type="person" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input
                  type="password"
                  v-model="formCustom.password"
                  :placeholder="$tex('密码')"
                >
                  <Icon type="ios-locked" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="checkCode" class="valida" v-if="!captchaFlag">
                <Input
                  type="text"
                  v-model="formCustom.checkCode"
                  :placeholder="$tex('验证码')"
                  @on-enter="handleSubmit('formCustom')"
                  @on-focus="refreshCheckCode()"
                >
                  <Icon type="social-snapchat" slot="prepend"></Icon>
                </Input>
                <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
                <div class="refresh-code" @click="getImageCode">
                  <Icon type="refresh"></Icon>
                </div>
              </FormItem>
              <FormItem prop="" class="valida" v-else>
                <div id="fastLoginCaptcha"></div>
              </FormItem>
              <div class="other-operation">
                <a class="foget-password" @click="forgetPass()">{{
                  $tex("忘记密码")
                }}</a>
                <a href="#" class="go-register" @click.stop="goRegister">{{
                  $tex("立即注册")
                }}</a>
              </div>
              <FormItem style="margin-bottom:0">
                <Button
                  type="primary"
                  class="commit-register"
                  long
                  v-preventReClick="2000"
                  @click="handleSubmit('formCustom')"
                  >{{ $tex("立即登录") }}</Button
                >
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import encryption from "@/utils/md5";
import modal from "@/components/modal.vue";
import utils from "@/utils/utils";
import captcha from "@/mixins/captcha";
export default {
  components: { modal },
  mixins: [captcha(326, "#fastLoginCaptcha")],
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeInter: new Date().getTime(),
      formCustom: {
        userCode: "",
        password: "",
        checkCode: "",
      },
      ewmUrl: "", //图形验证码
      ruleInline: {
        userCode: [
          { required: true, message: this.$tex("请输入账号"), trigger: "blur" },
        ],
        password: [
          { required: true, message: this.$tex("请输入密码"), trigger: "blur" },
        ],
        checkCode: [
          {
            required: true,
            message: this.$tex("请输入验证码"),
            trigger: "blur",
          },
        ],
      },
      loginStatus: false,
    };
  },
  created() {
    this.getSysData();
    this.getImageCode();
  },
  computed: {
    wmInstance() {
      return this.$store.state.wmInstance;
    },
  },
  methods: {
    getWxToken() {
      //获取易盾验证的token
      let vm = this;
      if (this.wmInstance) {
        return new Promise((resolve, reject) => {
          this.wmInstance.getToken(vm.businessId, function(token) {
            resolve(token);
          });
        });
      } else {
        return Promise.reject("this.wmInstance is false");
      }
    },
    capthcaSuccess() {},
    async getSysData() {
      let sysData = await this.$store.dispatch("querySystemConfig");
      let ydConfig = sysData["YI_DUN_VAILD_CONFIG"];
      if (ydConfig) {
        let { captchaFlag, antiCheatFlag, businessId, captchaId } = JSON.parse(
          ydConfig
        ).loginFilter;
        this.captchaFlag = captchaFlag;
        this.antiCheatFlag = antiCheatFlag;
        this.businessId = businessId;
        this.captchaId = captchaId;
        // debugger;
        if (this.captchaFlag) {
          this.$nextTick(() => {
            this.initCapthca();
          });
        } else {
          this.getImageCode();
        }
      }
    },
    forgetPass() {
      this.$router.push("/password");
    },
    closeDlg() {
      //   this.$store.commit('getShowLoginDialog',false);
      this.$refs.formCustom.resetFields();
      this.refreshCaptchaValidate();
      this.$emit("close-login-modal");
    },
    goRegister() {
      this.closeDlg();
      this.$router.push("/register");
      return;
    },
    refreshCheckCode() {
      //获取焦点刷新验证码
      // this.isActive = 3
      if (this.hasRefreshChode) {
        return;
      }
      this.getImageCode();
      this.hasRefreshChode = true;
    },
    async getImageCode() {
      const data = await utils.loadEwmUrl();
      this.ewmUrl = data.url;
      this.kaptchaFlag = data.kaptchaFlag;
      return this.kaptchaFlag;
    },
    async handleSubmit(name) {
      let vm = this;
      if (localStorage.getItem("user")) {
        let user = JSON.parse(localStorage.getItem("user"));
        let userId = user.userId;
        if (userId) {
          this.$Modal.info({
            title: this.$tex("不能连续登陆"),
            content: this.$tex("现在为您跳转"),
            onOk: () => {
              this.$store.commit("getUser", user);
              this.$emit("close-login-modal", true);
            },
          });
          return;
        }
      }
      const valid = await this.$refs[name].validate();
      if (!valid) {
        this.refreshCaptchaValidate();
        this.verifyData = {};
        if (!this.captchaFlag) {
          this.getImageCode();
        }
        return;
      }
      if (this.isLogining) return;
      this.isLogining = true;
      let obj = Object.assign({}, vm[name]);
      obj.password = encryption.encrypt.md5(obj.password);

      if (this.antiCheatFlag) {
        //如果开启了反作弊
        let token = await this.getWxToken();
        console.log("开启了反作弊");
        obj = {
          ydtoken: token,
          ...obj,
        };
      }

      if (!this.captchaFlag) {
        //未开启行为验证
        console.log("验证码验证");
        if (this.antiCheatFlag) {
          let loading = this.$Message.loading({
            content: `${this.$tex("加载中")}...`,
            duration: 0,
          });
          this.loginSubmit(obj, loading);
          return;
        }
        this.loginSubmit(obj);
        return;
      }

      const capObj = this.capthcaValidate(); //行为验证
      if (!capObj) {
        vm.isLogining = false;
        return;
      }
      var { validate, loading } = capObj;
      obj = {
        ydNECaptchaValidate: validate,
        ...obj,
      };
      this.loginSubmit(obj, loading);

      // this.$refs[name].validate((valid) => {
      //   if (valid) {
      //     if (this.isLogining) return
      //     this.isLogining = true
      //     let obj = Object.assign({}, vm[name]);
      //     obj.password = encryption.encrypt.md5(obj.password);
      //     console.log('我是登录弹框页，马上登陆了...');
      //     vm.$http.post('/api/v2/user/login', obj ,{ kaptchaFlag: this.kaptchaFlag}).then(response => {
      //       this.isLogining = false
      //       if (response.data.code !== 0) {
      //         vm.timeInter = new Date().getTime();
      //         if(response.data.code === 256){
      //           vm.$store.commit('getCacheLoginUserInfo',JSON.stringify(obj)); //存储临时的登录信息
      //           vm.$store.commit('getKaptchaFlag',vm.kaptchaFlag);
      //           vm.$emit('close-login-modal', true);
      //           vm.$store.commit('getDiffLogin',true);
      //         }
      //         return;
      //       }
      //       localStorage.setItem('user', JSON.stringify(response.data.data));
      //       this.$store.commit('getUser', response.data.data);
      //       this.$emit('close-login-modal', true);
      //       if(this.$route.name==='chatRoom') return;
      //       let path = sessionStorage.getItem('path'); // 2019.5.18
      //       if (path) { //调转到之前要跳到的页面
      //         let strArr = path.split('&');
      //         vm.$router.push({
      //           name: strArr[0],
      //           params: {
      //             id: strArr[1],
      //             order: strArr[2] ? JSON.parse(strArr[2]) : undefined
      //           }
      //         });
      //         return
      //       }
      //       vm.$router.push('/home');
      //     });
      //   }
      // })
    },
    loginSubmit(obj, loading) {
      let vm = this;
      const curKaptchaFlag = vm.kaptchaFlag;
      vm.$http
        .post("/api/v2/user/login", obj, { kaptchaFlag: curKaptchaFlag })
        .then((response) => {
          this.isLogining = false;
          if (response.data.code !== 0) {
            loading && loading();
            this.formCustom.password = "";
            if (this.captchaFlag) {
              this.refreshCaptchaValidate();
            }
            vm.timeInter = new Date().getTime();
            if (response.data.code === 256) {
              vm.$store.commit("getCacheLoginUserInfo", JSON.stringify(obj)); //存储临时的登录信息
              vm.$store.commit("getKaptchaFlag", curKaptchaFlag);
              vm.$emit("close-login-modal", true);
              vm.$store.commit("getDiffLogin", true);
            }
            return;
          }
          loading && loading();
          localStorage.setItem("user", JSON.stringify(response.data.data));
          this.$store.commit("getUser", response.data.data);
          this.$emit("close-login-modal", true);
          if (this.$route.name === "chatRoom") return;
          let path = sessionStorage.getItem("path"); // 2019.5.18
          if (path) {
            //调转到之前要跳到的页面
            let strArr = path.split("&");
            vm.$router.push({
              name: strArr[0],
              params: {
                id: strArr[1],
                order: strArr[2] ? JSON.parse(strArr[2]) : undefined,
              },
            });
            return;
          }
          vm.$router.push("/home");
        });
    },
  },
};
</script>

<style>
.login-dlg .ivu-form-item-content .ivu-icon {
  color: #8b8c8d;
}
/* .login-dlg .ivu-form-item-content .ivu-input{
       border-left: 0
   } */
.login-dlg .container {
  margin: 0 auto;
  border-radius: 6px;
  padding: 10px;
}
.login-dlg .login-img {
  float: right;
}
.login-dlg .cont-title {
  border-bottom: 2px solid #f1f1f1;
  line-height: 30px;
  height: 45px;
  margin-bottom: 20px;
}
.login-dlg .cont-title h4 {
  float: left;
  font-size: 16px;
  /*  color: #be1204; */
}
.login-dlg .cont .ivu-form-item .ivu-input {
  height: 45px;
}
.login-dlg .cont .ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 18px;
}
.login-dlg .cont .valida .ivu-input {
  width: 120px;
}
.login-dlg .cont .valida .valida-code {
  position: absolute;
  top: 2px;
  left: 170px;
  height: 43px;
  width: auto;
  cursor: pointer;
  z-index: 1000;
}
.login-dlg .refresh-code {
  position: absolute;
  right: 7px;
  top: 15px;
  cursor: pointer;
}
.login-dlg .ivu-icon-refresh {
  font-size: 25px;
}
.login-dlg .cont .commit-register {
  height: 44px;
  margin-bottom: 10px;
  font-size: 18px;
}

.other-operation {
  padding: 10px;
  font-size: 14px;
}
.login-dlg .foget-password {
  /*   color: #be1204; */
}
.login-dlg .go-register {
  color: #8b8c8d;
  float: right;
}
.v-transfer-dom .ivu-modal-wrap.login-dlg-wrap .ivu-modal-footer {
  padding: 0;
}
</style>
