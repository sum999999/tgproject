export default function(width = 375) {
    return {
        data() {
            return {
                captchaInstance: '',
                verifyData: {},
                captchaId: '',
                antiCheatFlag: false, //是否开启反作弊
                businessId: '', //
                captchaFlag: false //是否开启行为验证
            }
        },
        beforeDestroy() {
            this.releaveCaptchaInstance()
        },
        methods: {
            //刷新行为验证(其它条件验证失败时，且行为验证失败)
            specialRefreshCaptcha() {
                // Object.keys(this.verifyData).length &&
                //     !this.verifyData.validate &&
                //     this.verifyData.err &&
                Object.keys(this.verifyData).length &&this.captchaInstance.refresh()
                // this.c
            },
            //刷新行为验证(无条件)
            refreshCaptchaValidate() {
                this.captchaInstance && this.captchaInstance.refresh()
            },
            //释放资源
            releaveCaptchaInstance() {
                this.captchaInstance &&
                    this.captchaInstance.destroy &&
                    this.captchaInstance.destroy()
            },

            async initCapthca() {
                this.isLoadCaptcha = true
                this.initGtCapthca()
            },
            initGtCapthca() {
                let vm = this
                initNECaptcha(
                    {
                        captchaId: vm.captchaId,
                        element: '#tryPlayCaptcha',
                        mode: 'float',
                        width: width,
                        protocol: 'https',
                        onReady: function(instance) {
                            //验证码一切准备就绪，此时可正常使用验证码的相关功能
                        },
                        onVerify: function(err, data) {
                            //验证失败时,内部会自动refresh方法，无须手动再调用一次
                            /**
                             * 第一个参数为err,验证失败才有err对象
                             * 第二个参数为data,验证成功后的相关信息，data数据结构：
                             * {
                             *      validate:'xxxxx'  //二次验证信息
                             * }
                             */
                            if (err) {
                                vm.verifyData = err
                            } else {
                                vm.verifyData = data
                            }
                        }
                    },
                    function onload(instance) {
                        //初始化成功后，用户输入对应的账号和密码
                        vm.captchaInstance = instance
                        vm.capthcaSuccess()
                        // console.log(this.ca);
                    },
                    function onerror(err) {
                        // 验证码初始化失败处理逻辑，例如：提示用户点击按钮重新初始化
                    }
                )
            },
            capthcaValidate() {
                //register.vue行为验证部分
                let verifyData = null
                let loading = () => {}
                if (this.captchaFlag) {
                    verifyData = this.verifyData
                    if (!this.verifyData.validate) {
                        this.$Message.error('请完成验证')
                        return false
                    }
                    loading = this.$Message.loading({
                        content: '加载中...',
                        duration: 0
                    })
                }
                return {
                    loading,
                    ...verifyData
                }
            }
        }
    }
}
