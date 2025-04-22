<template>
  <div class="v3 login-page">
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
import encryption from '@/utils/md5'
import captcha from './captcha.js'
import utils from '@/utils/utils'
// import loginMixin from "./loginMixin.js";
export default {
  mixins: [captcha(375,'#captcha')],
   data() {
        return {
            loginStatus: false, //防止连续登录
            loginAvatar: '',
            formCustom: {
                userCode: '',
                password: '',
                checkCode: ''
            },
            ewmUrl: '', //图形验证码
            ruleInline: {
                userCode: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                checkCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            }
        }
    },
     computed: {
        configList() {
            return this.$store.state.configList
        },
        wmInstance() {
            return this.$store.state.wmInstance
        }
    },
    watch: {
        configList: {
            handler(newVal) {
                this.initConfig(newVal)
            },
            deep: true
        }
    },
     methods: {
        initConfig(configList) {
            for (let content of configList) {
                if (content.key === 'PC_LOGIN_IMG_URL') {
                    this.loginAvatar = content.value
                } else if (content.key === 'YI_DUN_VAILD_CONFIG') {
                    let {
                        captchaFlag,
                        antiCheatFlag,
                        businessId,
                        captchaId
                    } = JSON.parse(content.value).loginFilter
                    this.captchaFlag = captchaFlag
                    this.antiCheatFlag = antiCheatFlag
                    this.businessId = businessId
                    this.captchaId = captchaId
                    // debugger;
                    if (this.captchaFlag) {
                        this.$nextTick(() => {
                          this.initCapthca()
                        })
                    } else {
                        this.getImageCode()
                    }
                }
            }
        },
        capthcaSuccess() {},
        forgetPass() {
            this.$router.push('/password')
        },
        refreshCheckCode() {
            //获取焦点刷新验证码
            if (this.hasRefreshChode) {
                return
            }
            this.getImageCode()
            this.hasRefreshChode = true
        },
        async getImageCode() {
            const data = await utils.loadEwmUrl()
            this.ewmUrl = data.url
            this.kaptchaFlag = data.kaptchaFlag
            return this.kaptchaFlag
        },
        getWxToken() {
            //获取易盾验证的token
            let vm = this
            if (this.wmInstance) {
                return new Promise((resolve, reject) => {
                    this.wmInstance.getToken(vm.businessId, function(token) {
                        resolve(token)
                    })
                })
            } else {
                return Promise.reject('')
            }
        },
        async goLogin(name) {
            //判断登录前的验证方式
            let vm = this
            if (localStorage.getItem('user')) {
                let user = JSON.parse(localStorage.getItem('user'))
                let userId = user.userId
                if (userId) {
                    this.$Modal.info({
                        title: '不能连续登陆',
                        content: '现在为您跳转',
                        onOk: () => {
                            this.$store.commit('getUser', user)
                        }
                    })
                    return
                }
            }
            if (this.loginStatus) return
            const valid = await this.$refs[name].validate()
            if (!valid) {
                this.specialRefreshCaptcha()
                this.verifyData = {}
                if (!this.captchaFlag) {
                    this.getImageCode()
                }
                return
            }
            this.loginStatus = true
            let obj = Object.assign({}, vm[name])
            obj.password = encryption.encrypt.md5(obj.password)

            if (this.antiCheatFlag) {
                //如果开启了反作弊
                let token = await this.getWxToken()
                console.log('开启了反作弊')
                obj = {
                    ydtoken: token,
                    ...obj
                }
            }

            if (!this.captchaFlag) {
                //未开启行为验证
                console.log('验证码验证')
                if (this.antiCheatFlag) {
                    let loading = this.$Message.loading({
                        content: '加载中...',
                        duration: 0
                    })
                    this.loginSubmit(obj, loading)
                    return
                }
                this.loginSubmit(obj)
                return
            }

            const capObj = this.capthcaValidate() //行为验证
            if (!capObj) {
                vm.loginStatus = false
                return
            }
            var { validate, loading } = capObj
            obj = {
                ydNECaptchaValidate: validate,
                ...obj
            }
            this.loginSubmit(obj, loading)
            // this.$refs[name].validate((valid) => {
            //   if (valid) {
            //     this.loginStatus = true;
            //     let obj = Object.assign({}, vm[name]);
            //     obj.password = encryption.encrypt.md5(obj.password);
            //     vm.$http.post('/api/v2/user/login', obj, { kaptchaFlag: this.kaptchaFlag }).then(async response => {
            //       vm.loginStatus = false;
            //       if (response.data.code !== 0) {
            //         let kaptchaFlag = await this.getImageCode(); // 2019.5.9
            //         if(response.data.code===256){ //异地登录异常
            //           this.$store.commit('getCacheLoginUserInfo',JSON.stringify(obj)); //存储临时的登录信息
            //           this.$store.commit('getKaptchaFlag',kaptchaFlag);
            //         }
            //         return;
            //       }

            //       localStorage.setItem('user', JSON.stringify(response.data.data));
            //       this.$store.commit('getUser', response.data.data);
            //       let path = sessionStorage.getItem('path');
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
            let vm = this
            const curKaptchaFlag = this.kaptchaFlag;
            vm.$http
                .post('/api/v2/user/login', obj, {
                    kaptchaFlag: this.kaptchaFlag
                })
                .then(async response => {
                    vm.loginStatus = false
                    if (response.data.code !== 0) {
                        loading && loading()
                        if (vm.captchaFlag) {
                            vm.refreshCaptchaValidate()
                        }
                        if (response.data.code === 256) {
                            //异地登录异常
                            this.$store.commit(
                                'getCacheLoginUserInfo',
                                JSON.stringify(obj)
                            ) //存储临时的登录信息
                            this.$store.commit('getKaptchaFlag', curKaptchaFlag)
                        }
                        return
                    }
                    loading && loading()
                    localStorage.setItem(
                        'user',
                        JSON.stringify(response.data.data)
                    )
                    this.$store.commit('getUser', response.data.data)
                    let path = sessionStorage.getItem('path')
                    if (path) {
                        //调转到之前要跳到的页面
                        let strArr = path.split('&')
                        vm.$router.push({
                            name: strArr[0],
                            params: {
                                id: strArr[1],
                                order: strArr[2]
                                    ? JSON.parse(strArr[2])
                                    : undefined
                            }
                        })
                        return
                    }
                    vm.$router.push('/home')
                })
        },
        handleSubmit(name) {
            let vm = this
            if (this.$store.state.user.userCode) {
                this.$Modal.confirm({
                    title: this.$tex("温馨提示"),
                    content: '当前已登录，是否切换账号？',
                    onOk: () => {
                        vm.$http
                            .post('/api/v2/user/loginOut', '', { userId: true })
                            .then(response => {
                                if (response.data.code !== 0) return
                                localStorage.setItem('user', '')
                                vm.$store.commit('getUser', '')
                                vm.goLogin(name)
                            })
                    }
                })
            } else {
                this.goLogin(name)
            }
        }
    },
        created() {
        this.initConfig(this.configList)
        this.getImageCode()
        let user = localStorage.getItem('user')
        let redirect = decodeURIComponent(this.$route.query.redirect)
        if (
            user &&
            user !== '{}' &&
            redirect !== '/bankValid' &&
            redirect !== '/phoneValid'
        ) {
            // debugger;
            this.$router.push('/home')
        }
    }
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';
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
  @{deep} .yidun_control{
    height: 30px!important;
  }
  @{deep} .yidun_slide_indicator {
    height: 30px!important;
  }
  @{deep} .yidun_slider {
    height: 28px!important;
    line-height: 28px!important;
  }
  @{deep} .yidun_tips {
    height: 30px!important;
    line-height: 28px!important;
  }
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
.login-page .cont .ivu-form-item .ivu-input {
  height: 45px;
}
.login-page .cont .ivu-input-group-prepend {
  padding: 4px 10px;
  font-size: 18px;
}
.login-page.v3 .cont .valida .valida-code {
  position: absolute;
  top: 2px;
  right: 2px;
  height: 28px;
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

