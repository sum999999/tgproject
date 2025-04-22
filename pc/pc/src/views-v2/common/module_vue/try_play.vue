<template>
    <modal :modalShow="isPlay"
           :width="735"
           :hasFooter="false"
           claName="try_play"
           @btn-cancel="closeModal">
        <div slot="content"
             class="content-slot">
            <b @click="closeModal"
               class='ivu-modal-close'></b>
            <div class='lf lee-free-wrap'>
                <span class="lee-free">
                    {{$store.state.freePlayValue}}
                </span>
            </div>
            <div class='rt'>
                <div class='form'>
                    <form>
                        <div class='name'>
                            <i class='icon-user'></i>
                            <input autocomplete="off"
                                   type="text"
                                   placeholder='账号'
                                   v-model='userName'
                                   readonly>
                        </div>
                        <div class='pwd'>
                            <i class='icon-pwd'></i>
                            <input autocomplete="off"
                                   :type="showPassWord ? 'text' : 'password' "
                                   placeholder='请输入密码'
                                   v-model="pwd"
                                   @blur="playPassWord">
                            <i class='eye'
                               @click='showPassWord=!showPassWord'
                               :class='[showPassWord ? "open-eye":" "]'></i>
                            <span v-html='pwdError'></span>
                        </div>
                        <div class='verify'>
                            <i class='icon-verify'></i>
                            <input autocomplete="off"
                                   type="text"
                                   placeholder='请输入验证码'
                                   @blur='playCode'
                                   @focus='refreshCheckCode()'
                                   v-model.trim='verifyCode'
                                   @keyup.enter='tryPlay'>
                            <img class="valida-code"
                                 :src='ewmUrl'
                                 @click='changeTryPlayCode'>
                            <span class="html" v-html='codeError'></span>
                        </div>
                        <!-- 不要删 -->
                        <!-- <div class="verify" v-else>
                                <div id="tryPlayCaptcha"></div>
                        </div> -->
                    </form>
                </div>
                <div class='btn-play'>
                    <Button type="primary"
                            style='width:100%;height:44px;font-size:16px;'
                            @click='tryPlay'>免费试玩</Button>
                </div>
            </div>
        </div>
    </modal>
</template>
<script>
import modal from '@/components/modal.vue';
import encryption from '@/utils/md5'
import utils from '@/utils/utils';
// import captcha from '@/mixins/tryPlayCaptch.js'
export default {
    components: { modal },
    // mixins: [captcha(250)],
    props: {
        hasOpen: {
            type: Boolean,
            default: false
        },
        tryPlayCaptchaInfo:''
    },
    data () {
        return {
            ewmUrl:'',
            showPassWord: false,//试玩密码是否可见
            userName: '', //试玩账号
            pwd: '',  //试玩密码
            pwdError: '', //试玩密码错误提示
            verifyCode: '', //试玩验证码
            codeError: '', //试玩验证码错误提示
            isShow: false,   //是否显示弹框
            registerStatus: false
        }
    },
    computed: {
        isPlay: {
            get () {
                if (this.hasOpen && !this.isCreated) {  // 减少首页多余的请求
                    this.init();
                    this.initData = true;
                } else {
                    this.isCreated = false;
                }
                return this.hasOpen;
            },
            set (newVal) {

            }
        },
        wmInstance() {
            return this.$store.state.wmInstance;
        },
    },
    methods: {

        async loadEwmUrl () {
            const data = await utils.loadEwmUrl()
            this.ewmUrl = data.url;
            this.kaptchaFlag = data.kaptchaFlag
            return this.kaptchaFlag;
        },
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
                return Promise.reject("");
            }
        },
        async tryPlay () { //注册试玩
            if(this.registerStatus) return;
            // debugger;
            if(!this.captchaFlag) { //验证码验证
                if (!this.playPassWord() || !this.playCode()) {
                    return
                }
                this.handleTryPlayReg();
                return;
            }
            //行为验证
            if(!this.playPassWord()) {
                this.specialRefreshCaptcha();
                this.verifyData = {};
                return;
            }
            this.handleTryPlayReg();
        },
        async handleTryPlayReg() { //操作注册前
            this.registerStatus = true;
            let pwd = encryption.encrypt.md5(this.pwd);
            let obj = { userCode: this.userName, password: pwd, userType: '09'}
            if(this.antiCheatFlag) { //开启了反作弊
                let token = await this.getWxToken();
                obj = {
                    ydtoken: token,
                    ...obj,
                }
            }
            if(!this.captchaFlag) { //非开启行为验证
                obj.checkCode = this.verifyCode
                if(this.antiCheatFlag) {
                    let loading = this.$Message.loading({
                        content: "加载中...",
                        duration: 0
                    });
                    this.tryPlayReg(obj,loading);
                    return;
                }
                this.tryPlayReg(obj);
                return;
            }
            // debugger;
           const capObj = this.capthcaValidate(); //行为验证
           if (!capObj) {
                this.registerStatus = false;
                return;
            }
            var { validate, loading } = capObj;
            obj = {
                ydNECaptchaValidate: validate,
                ...obj
            };
            this.tryPlayReg(obj,loading);
        },
        tryPlayReg(obj,loading) { //提交注册
            this.$http.post('/api/v2/user/register', obj,{kaptchaFlag:this.kaptchaFlag}).then(response => {
                this.registerStatus = false;
                this.verifyData = {};
                loading && loading();
                if (response.data.code !== 0) {
                    if(!this.captchaFlag){
                        this.changeTryPlayCode();
                    }
                    if (this.captchaFlag) {
                        this.refreshCaptchaValidate();
                    }
                    ['pwd', 'verifyCode'].forEach(item => this[item] = '');
                    return;
                }
                localStorage.setItem('user', JSON.stringify(response.data.data));
                this.$store.commit('getUser', response.data.data);

                this.$emit('closeTryModal');
                this.$router.push('/');
            })
        },
        refreshCheckCode () {
            //获取焦点刷新验证码
            if (this.hasRefreshChode) {
                return
            }
            this.changeTryPlayCode()
            this.hasRefreshChode = true
        },
        changeTryPlayCode () {
            this.loadEwmUrl()
        },
        closeModal () { //关闭Modal
            ['pwd', 'pwdError', 'verifyCode', 'codeError'].forEach(item => this[item] = '');
            if(this.captchaFlag) {
                this.refreshCaptchaValidate();
            }
            this.$emit('closeTryModal');
        },
        playPassWord () { //检查密码
            this.pwd = this.pwd.replace(/\s+/g, '');
            if (!this.pwd) {
                this.pwdError = '请输入密码';
                return false
            }
            if (this.pwd.length < 6 || this.pwd.length > 14) {
                this.pwdError = '密码六至十四位';
                return false
            } else {
                this.pwdError = '';
                return true
            }
        },
        playCode () {  //检查验证码
            if (!this.verifyCode) {
                this.codeError = '请输入验证码';
                this.changeTryPlayCode();
                return false
            }
            this.codeError = '';
            return true
        },
        //切换验证码
        changeCaptcha: function () {
            this.loadEwmUrl();
        },
        init () { //初始化弹窗
            this.changeTryPlayCode();
            this.$http.post('/api/v2/user/getPlayAccount', {}, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                this.userName = response.data.data.playAccount;
            })
        },
        // initCaptchSet(){ //不要删
        //      let {captchaFlag,antiCheatFlag,businessId,captchaId} = this.tryPlayCaptchaInfo;
        //         this.captchaFlag = captchaFlag;
        //         this.antiCheatFlag = antiCheatFlag;
        //         this.businessId = businessId;
        //         this.captchaId = captchaId;
        //         // console.log(captchaFlag);
        //         if (this.captchaFlag) {
        //             this.initCapthca();
        //         }
        // },
        capthcaSuccess() {}
    },
    created () {
        this.isCreated = true;
        // this.initCaptchSet(); //不要删
    }
}
</script>
<style lang="less">
@import '../../../styles/mixin.less';
@import "~@/mixins/captcha.less";
.v-transfer-dom {
    .try_play {
        .ivu-modal {
            .ivu-modal-content {
                border: none;
                .ivu-modal-header {
                    height: 0;
                    padding: 0;
                    border-bottom: none;
                }
                .ivu-modal-body {
                    width: 735px;
                    padding: 68px 49px 59px 26px;
                    background: #fffde7;
                    border-radius: 4px;
                    -webkit-border-radius: 4px;
                    .content-slot {
                        display: inline-block;
                        width: 660px;
                    }
                    b {
                        display: block;
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        background: url('~@/assets/images/icon.png')
                            no-repeat -522px -337px;
                        right: -20px;
                        top: -20px !important;
                    }
                    .lf {
                        width: 333px;
                        height: 265px;
                        background: url('/static/images/freeTry.png') no-repeat;
                        &.lee-free-wrap {
                            position: relative;
                            .lee-free {
                                position: absolute;
                                top: 88px;
                                width: 100%;
                                color: #f4f9f4;
                                font-size: 24px !important;
                                text-align: center;
                            }
                        }
                    }
                    .rt {
                        width: 270px;
                        float: right;
                        .form {
                            padding: 0 10px;
                            margin-bottom: 30px;
                            .name {
                                float: left;
                                position: relative;
                                width: 250px;
                                height: 28px;
                                margin-bottom: 42px;
                                border-bottom: 1px solid #c3c3c3;
                            }
                            .pwd {
                                &:extend(.v-transfer-dom
                                        .try_play
                                        .ivu-modal
                                        .ivu-modal-content
                                        .ivu-modal-body
                                        .rt
                                        .form
                                        .name);
                                height: 30px;
                                margin-bottom: 36px;
                                .input {
                                    height: 22px;
                                }
                                span {
                                    position: absolute;
                                    top: 100%;
                                    left: 0;
                                    padding-top: 6px;
                                    color: #ed3f14;
                                    font-size: 12px;
                                }
                            }
                            .verify {
                                &:extend(.v-transfer-dom
                                        .try_play
                                        .ivu-modal
                                        .ivu-modal-content
                                        .ivu-modal-body
                                        .rt
                                        .form
                                        .name);
                                height: 35px;
                                margin-bottom: 0;
                                input {
                                    height: 20px;
                                    margin-top: 5px;
                                }
                                .valida-code { //2019.7.2
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    width: 85px;
                                    height: 28px;
                                    cursor: pointer;
                                }
                                .html { //2019.7.2
                                    position: absolute;
                                    top: 100%;
                                    left: 0;
                                    padding-top: 6px;
                                    color: #ed3f14;
                                    font-size: 12px;
                                }
                            }
                            input {
                                float: left;
                                height: 18px;
                                margin-left: 10px;
                                color: #282828;
                                font-size: 12px;
                                background: none;
                                border: none;
                                &:focus {
                                    border: none;
                                    outline: none;
                                    -webkit-outline: none;
                                }
                            }
                            i {
                                float: left;
                                width: 16px;
                                height: 18px;
                                margin-left: 4px;
                                background: url('~@/assets/images/icon.png')
                                    no-repeat -399px -348px;
                                &.icon-pwd {
                                    width: 16px;
                                    height: 22px;
                                    background-position: -429px -348px;
                                }
                                &.icon-verify {
                                    width: 16px;
                                    height: 20px;
                                    margin-top: 5px;
                                    background-position: -457px -348px;
                                }
                                &.eye {
                                    float: right;
                                    width: 18px;
                                    height: 14px;
                                    margin-top: 5px;
                                    cursor: pointer;
                                    background: url('~@/assets/images/icon.png')
                                        no-repeat -487px -351px;
                                }
                                &.open-eye {
                                    margin-top: 11px;
                                    background: url('~@/assets/images/icon.png')
                                        no-repeat -148px -519px;
                                }
                            }
                            &:after {
                                .clearfix();
                            }
                        }
                        .btn-play {
                            width: 100%;
                            height: 44px;
                        }
                    }
                }
                .ivu-modal-footer {
                    height: 0;
                    padding: 0;
                    border-top: none;
                }
            }
        }
    }
}
</style>




