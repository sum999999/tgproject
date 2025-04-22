/**
 * 悬浮式行为验证
 * width: tab的宽度
 */
export default function(width = 375) {
    return {
        data() {
            return {
                captchaInstance: '',
                verifyData: {},
                captchaId: '',
                antiCheatFlag: false, //是否开启反作弊
                businessId: '', //
                captchaFlag: false, //是否开启行为验证
                verifyDataInfo: {}
            }
        },
        beforeDestroy() {
            this.releaveCaptchaInstance()
        },
        methods: {
            //刷新行为验证(其它条件验证失败时，且行为验证失败)
            specialRefreshCaptcha() {
                Object.keys(this.verifyData).length &&
                    !this.verifyData.validate &&
                    this.verifyData.err &&
                    this.captchaInstance.refresh()
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
                // this.isLoadCaptcha = true
                this.initGtCapthca()
            },
            initGtCapthca() {
                let vm = this
                initNECaptcha(
                    {
                        captchaId: vm.captchaId,
                        element: '#captcha',
                        mode: 'popup',
                        width: width,
                        protocol: 'https',
                        onClose() {
                            let verifyData = null
                            let loading = () => {}
                            if (vm.captchaFlag) {
                                verifyData = vm.verifyData
                                if (!vm.verifyData.validate) {
                                    vm.$Message.error('请完成验证')
                                    vm.password = ''
                                    vm.specialRefreshCaptcha()
                                    vm.loginStatus = false
                                    return false
                                }
                                loading = vm.$Message.loading({
                                    content: '加载中...',
                                    duration: 0
                                })
                            }
                            vm.verifyDataInfo = {
                                loading,
                                ...verifyData
                            }
                            vm.refreshCaptchaValidate() //刷新ui状态
                            vm.ValidateCapthca() //触发进一步验证
                        },
                        onVerify: function(err, data) {
                            if (err) {
                                vm.verifyData = err
                            } else {
                                vm.verifyData = data
                            }
                        }
                    },
                    function(instance) {
                        vm.captchaInstance = instance
                    },
                    function(err) {}
                )
            },
            capthcaValidate() {
                this.captchaInstance.popUp()
            }
        }
    }
}
