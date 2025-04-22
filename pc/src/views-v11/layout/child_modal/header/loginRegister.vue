
<template>
   <div class="logo-register-area">
        <Input
            type="text"
            size="large"
            icon="ios-person-outline"
            :placeholder="$tex('账号')"
            v-model="userName"
            @on-enter="goLogin" />
        <Input
            class="left-margin"
            type="password"
            size="large"
            icon="ios-locked-outline"
            :placeholder="$tex('密码')"
            v-model="password"
            @on-enter="goLogin"/>
        <div class="left-margin validate-code" v-if="!captchaFlag">
            <Input
                type="text"
                size="large"
                :placeholder="$tex('验证码')"
                v-model="checkCode"
                @on-enter="goLogin"
                @on-focus="focusRefreshCheckCode"/>
            <img
              :src="ewmUrl"
              @click="refreshCheckCode"
              style='cursor:pointer'
            >
        </div>
        <!-- 行为验证 -->
        <div class="captcha-wp" v-else
            style="width:0;height:0;overflow:hidden;"
          >
          <div id="captcha"></div>
        </div>
        <!-- 行为验证结束 -->
        <!-- 登录注册按钮 -->
        <iview-button
            :onClick="goLogin"
            :btnText="$tex('用户登录')"/>
        <iview-button
            btnType="warning"
            :onClick="goRegister"
            :btnText="$tex('免费注册')"/>
        <!-- 登录注册按钮结束 -->
    </div>
</template>

<script>
// 悬浮行为验证
import popupCaptcha from '@/mixins/popupCaptcha';
import iviewButton from '@/components/iviewButton.vue';
import encryption from '@/utils/md5'
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
    data() {
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
    computed: {
        wmInstance() {
            return this.$store.state.wmInstance
        }
    },
    created() {
        this.refreshCheckCode();
        this.handleCaptchaData();
    },
    methods: {
        goRegister() {
             this.$router.push({
                name: 'register'
            })
        },
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
            // 行为验证的方式
            this.specialRefreshCaptcha();
            this.verifyData = {}
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
         * 登录前的判断
         */
          async goLogin() {
            let user = localStorage.getItem('user');
            if(user) {
                user = JSON.parse(user);
                if(user.userId) {
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
            if(!this.userName) {
                this.$Modal.error({
                    title: '请求失败',
                    content: '<p>账号不能为空</p>',
                    onOk: () => {
                        this.valiFailCallBack();
                    }
                })
                return
            }
            if (!this.password) {
                this.$Modal.error({
                    title: '请求失败',
                    content: '<p>密码不能为空</p>',
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
                        title: '请求失败',
                        content: '<p>验证码不能为空</p>',
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
                        content: '加载中...',
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
@deep: ~'>>>';
.logo-register-area {
    position: relative;
    font-size: 0;
    //输入框
    .ivu-input-wrapper {
        display: inline-block;
        width: 132px;
        @{deep}.ivu-input {
            height: 38px;
        }
        @{deep}.ivu-input-icon {
            line-height: 38px;
        }
    }
    //验证码
    .validate-code {
        display: inline-block;
        position: relative;
        img {
            position: absolute;
            width: 67px;
            left: auto;
            right: 1px;
            top: 1px;
            height: 36px;
        }
    }
    //行为验证
    .captcha-wp {
        display: inline-block;
        width: 0px;
        height: 0px;
        overflow: hidden;
    }
    //按钮
    .btn-wp {
        display: inline-block;
        margin-left: 19px;
        @{deep}.ivu-btn {
            width: 84px;
            height: 38px;
        }
    }
    .left-margin {
        margin-left: 7px;
    }
}
</style>
