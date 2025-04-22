<template>
    <div class="v3-login-register-area">
    <div class="ipt-wp">
        <Input
            type="text"
            v-model="userName"
            :placeholder="$tex('账号')"
            @on-enter="doLogin()"/>
            <i class="ipt-icon yhm"></i>
    </div>
    <div class="ipt-wp">
        <Input
            type="password"
            id="loginPwd"
            name="loginPwd"
            v-model="password"
            :placeholder="$tex('密码')"
            @on-enter="doLogin()"/>
        <i class="ipt-icon mm"></i>
        <span
            class="for-pwd"
            @click.stop="$router.push('/password')"
        >{{$tex("忘记密码")}}?</span>
    </div>
        <div
            class="ipt-wp validate"
            v-if="!captchaFlag"
          >
        <Input
            type="text"
            v-model="checkCode"
            :placeholder="$tex('验证码')"
            @on-enter="doLogin()"
            @on-focus='refreshCheckCode'/>
        <img
            :src="ewmUrl"
            @click="refreshCheckCode"
            style='cursor:pointer'
        >
    </div>
    <div
        class="ipt-wp valida"
        v-if="captchaFlag"
        style="width:0;height:0;overflow:hidden;margin-left:0;"
        >
        <div id="captcha"></div>
    </div>
      <!-- 登录注册按钮 -->
    <iview-button
        :onClick="doLogin"
        :btnText="$tex('用户登录')"/>
    <iview-button
        btnType="warning"
        :onClick="goRegister"
        :btnText="$tex('免费注册')"/>
    </div>
</template>

<script>
import encryption from '@/utils/md5'
import popupCaptcha from '@/mixins/popupCaptcha';
import iviewButton from '@/components/iviewButton.vue';
export default {
     mixins: [popupCaptcha()],
     props:{
        utils: {
            type: Object
        },
        ydConfig: {
            type: Object
        }
    },
    components: {
        iviewButton
    },
    computed: {
        wmInstance() {
            return this.$store.state.wmInstance
        }
    },
    created() {
        this.refreshCheckCode();
        this.handleCaptchaData();
    },
    data(){
        return {
            userName: '',
            password: '',
            checkCode: '',
            ewmUrl: '',
            kaptchaFlag: '',
            hasRefreshChode: false, //是否刷新了验证码
            cacheLoginInfo: '' //暂存的登录信息
        }
    },
    methods: {
        handleCaptchaData() {
            const {
                captchaFlag,
                antiCheatFlag,
                businessId,
                captchaId
            } = this.ydConfig.loginFilter
            this.captchaFlag = captchaFlag
            this.antiCheatFlag = antiCheatFlag
            this.businessId = businessId
            this.captchaId = captchaId
            if (this.captchaFlag) {
                this.$nextTick(() => {
                    this.initCapthca()
                })
            } else {
                this.refreshCheckCode()
            }
        },
        goRegister() {
             this.$router.push({
                name: 'register'
            })
        },
        /**
         * 聚焦刷新获取验证码
         */
        focusRefreshCheckCode() {
            //获取焦点刷新验证码
            if (this.hasRefreshChode) {
                return
            }
            this.refreshCheckCode();
            this.hasRefreshChode = true;
        },
        /**
         * 验证失败的回调
         */
        valiFailCallBack() {
            if(!this.captchaFlag) { //验证码验证的方式
                this.checkCode && (this.checkCode = '');
                this.refreshCheckCode();
                return;
            }
            // 行为验证验证的方式
            this.specialRefreshCaptcha();
            this.verifyData = {}
        },
        /**
         * 登录前的判断
         */
          async doLogin() {
            let user = localStorage.getItem('user');
            if(user) {
                user = JSON.parse(user);
                if(user.userId) {
                    this.$Modal.info({
                      title: this.$tex("不能连续登陆"),
                      content: this.$tex("现在为您跳转"),
                        onOk: () => {
                            this.$store.commit('getUser', user)
                        }
                    })
                    return
                }
            }
            if(!this.userName) {
                this.$Modal.error({
                    title: this.$tex('请求失败'),
                    content: `<p>${this.$tex('账号不能为空')}</p>`,
                    onOk: () => {
                        this.valiFailCallBack();
                    }
                })
                return
            }
            if (!this.password) {
                this.$Modal.error({
                    title: this.$tex('请求失败'),
                    content: `<p>${this.$tex('密码不能为空')}</p>`,
                    onOk: () => {
                       this.valiFailCallBack();
                    }
                })
                return
            }
            //未开启行为验证
            if (!this.captchaFlag) {
                if (!this.checkCode) {
                    this.$Modal.error({
                        title: this.$tex('请求失败'),
                        content: `<p>${this.$tex('验证码不能为空')}</p>`,
                        onOk: () =>{
                            this.valiFailCallBack();
                        }
                    })
                    return
                }
            }
             let obj = {
                userCode: this.userName,
                password: encryption.encrypt.md5(this.password)
            }
            //开启了反作弊
            if(this.antiCheatFlag) {
                const token = await this.getWxToken();
                obj = {
                    ydtoken: token,
                    ...obj
                }
            }

            if(!this.captchaFlag) {
                obj.checkCode = this.checkCode;
                if(this.antiCheatFlag) {
                    let loading = this.$Message.loading({
                        content: `${this.$tex('加载中')}...`,
                        duration: 0
                    })
                    this.login(obj, loading);
                    return;
                }
                this.login(obj);
                return;
            }
            this.cacheLoginInfo = obj;
            //进行行为验证
            this.capthcaValidate();
        },
        ValidateCapthca() {
            if (!this.verifyDataInfo) {
                // this.loginStatus = false
                return
            }
            const { validate, loading } = this.verifyDataInfo;
             this.cacheLoginInfo = {
                ydNECaptchaValidate: validate,
                ...this.cacheLoginInfo
            }
            this.login(this.cacheLoginInfo, loading)
        },
        /**
         * 刷新验证码
         */
        async refreshCheckCode() {
            const data = await this.utils.loadEwmUrl();
            this.ewmUrl = data.url;
            this.kaptchaFlag = data.kaptchaFlag
            return data.kaptchaFlag
        },
        capthcaSuccess() {},
          /**
         * 获取易顿验证的token
         */
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
        /**
         * 登录
         */
        login(obj,loading) {
            const curKaptchaFlag = this.kaptchaFlag;
            this.$http
            .post('/api/v2/user/login', obj, {
                kaptchaFlag: curKaptchaFlag
            }).then(async res => {
                loading && loading();
                this.refreshCheckCode();
                let data = res.data;
                let code = data.code;
                if (code !== 0) {
                    this.password = '';
                    if(this.captchaFlag) {
                        this.refreshCaptchaValidate()
                    }
                    if(code === 256) {
                        this.$store.commit('getCacheLoginUserInfo',JSON.stringify(obj));
                        this.$store.commit('getKaptchaFlag', curKaptchaFlag)
                    }
                    return;
                }
                ['userName', 'password', 'checkCode'].forEach(item => (this[item] = ''));
                const {data: resData} = data;
                localStorage.setItem('user',JSON.stringify(resData));
                this.$store.commit('getUser', resData);
                const routerName = this.$route.name;
                if(routerName === 'login' || routerName === 'register') {
                    this.$router.push('/');
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
@imgUrl: '~@/assets/images-v3/index';
@deep: ~'>>>';
.v3-login-register-area {
    font-size: 0;
   .ipt-wp{
        position: relative;
        display: inline-block;
        margin-left: 16px;
        &:first-child {
          margin-left: 0;
        }
        .ipt-icon {
          position: absolute;
          top: 8px;
          left: 8px;
          display: block;
          width: 13px;
          height: 14px;
        }
        .yhm {
          background: url("@{imgUrl}/yhm.png") no-repeat;
        }
        .mm {
          height: 14px;
          background: url("@{imgUrl}/mm.png") no-repeat;
        }
        .for-pwd {
          display: block;
          position: absolute;
          right: 10px;
          top: 5px;
          font-size: 13px;
          color: @textLightColor;
          cursor: pointer;
          &:hover {
            opacity: 0.9;
          }
        }
        @{deep}#loginPwd {
            .ivu-input {
              padding-right: 75px;
            }
        }
        @{deep}.ivu-input {
          line-height: 30px;
          padding: 10px 10px 10px 28px;
          background-color: @inputBg;
          border: none;
          font-size: 13px;
          caret-color: #fff;
          color: @textColor;
        }
        @{deep}&.validate{
          .ivu-input {
            padding-left: 10px;
          }
        }
        .ivu-input-wrapper {
          width: 164px;
          height: 30px;
          .ivu-input-icon {
            left: 0;
            font-size: 20px;
            &.ivu-icon-ios-person-outline {
              font-size: 20px;
            }
          }
        }
        &.validate {
          img {
            position: absolute;
            width: 67px;
            left: auto;
            right: 0;
            top: 0;
            height: 100%;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
          }
          .ivu-input {
            padding-left: 8px;
          }
        }
      }
       //按钮
    .btn-wp {
        display: inline-block;
        margin-left: 16px;
        @{deep}.ivu-btn {
            height: 30px;
          background: @buttonChangeColor;
          color: @btnTxtColor;
          font-size: 15px;
          border: none;
          transition: all 0.3s;
          &:hover {
            // opacity: 0.9;
            background: @button-hover-change-color;
          }
        }
    }
}
</style>
