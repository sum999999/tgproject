import lottery from './left_lottery';
import modal from '@/components/modal.vue'
import loginDlg from '@/components/login_dlg.vue'
import popupCaptcha from '@/mixins/popupCaptcha'
import { mapGetters } from 'vuex'

let defaultMenu = [
    { label: '首页', url: '/home' },
    // { label: '购彩大厅', url: '/lottery', target: '_blank' },
    { label: 'app下载', url: '/phoneBuy' },
    { label: '优惠活动', url: '/active' }
]

export default {
    components: {
        lottery,
        modal,
        loginDlg
    },
    mixins: [popupCaptcha()],
    data() {
        return {
            currentMenu: this.$route.path,
            defaultMenu: defaultMenu,
            menu: [...defaultMenu],
            insertPos: 2,
            userCode: '',
            password: '',
            checkCode: '',
            hasAsideMenu: false,
            hasAds: '0', //是否有广告图
            showAds: false, //是否显示广告图
            hasBuld: false, //是否显示灯泡
            arrowFree: false, // 允许免费试玩
            showLoginGameTip: '', // 是否提示登陆第三方游戏弹框
        }
    },
    computed: {
        ...mapGetters(['pageTemplate']),

        userInfo() {
            return this.$store.state.user
        },
        configList() {
            return this.$store.state.configList
        },
        wmInstance() {
            return this.$store.state.wmInstance
        }
    },
    methods: {
        openAds() {
            //打开广告图
            this.showAds = true
            this.hasBuld = false
        },
        closeAds() {
            //关闭广告
            this.showAds = false
            setTimeout(() => {
                this.hasBuld = true
            }, 500)
        },
        showAsideMenu() {
            //显示快速导航
            if (this.$route.name === 'lottery') {
                return
            }
            this.hasAsideMenu = true
        },
        hideAsideMenu() {
            //隐藏快速导航
            if (this.$route.name === 'lottery') {
                return
            }
            this.hasAsideMenu = false
        },
        // //退出登录(子组件公用)
        // signOut() {
        //     let vm = this
        //     if (this.loginOutStatus) return
        //     this.loginOutStatus = true
        //     this.$http
        //         .post('/api/v2/user/loginOut', '', { userId: true })
        //         .then(response => {
        //             this.loginOutStatus = false
        //             if (response.data.code !== 0) return
        //             vm.$store.commit('getUser', '')
        //             localStorage.setItem('user', '')
        //             if (this.$route.name === 'personalCenter')
        //                 this.$router.push('/')
        //         })
        // },
        //共用
        addCollection() {
            this.$Modal.info({
                title: this.$tex('加入收藏'),
                content: this.$tex('请按Ctrl+D加入收藏'),
                onOk: () => {}
            })
        },
        capthcaSuccess() {}
    },
    mounted() {
        let GAME_SWITCH = localStorage.getItem('GAME_SWITCH')
        if (GAME_SWITCH) {
            let GAME_LIST = localStorage.getItem('GAME_LIST')
            if (GAME_LIST) {
                this.menu.splice(
                    this.menu.length - this.insertPos,
                    0,
                    ...JSON.parse(GAME_LIST)
                )
            }
        }

        this.$store.dispatch("querySystemConfig").then(data => {
            let gameLists = data['lotCcGameTypeConfig'];
            let ydConfig = data['YI_DUN_VAILD_CONFIG'];
            let GAME_SWITCH = data['GAME_SWITCH'];
            if (ydConfig) {
                ydConfig = JSON.parse(ydConfig);
                this.ydConfig = ydConfig;
            }
            try {
                gameLists = JSON.parse(gameLists).filter(
                  item => item.status === '1'
                ) || [];
                if (GAME_SWITCH !== '1') {
                    gameLists = gameLists.filter(menu => {
                        return menu.code === "LOTTERY";
                    });
                }
            } catch(e) {
                gameLists = [];
            }
            const lotItem = gameLists.find(menu => {
                return menu.code === "LOTTERY";
            });
            if (lotItem) {
                lotItem.url = '/lottery';
                lotItem.target = '_blank';
                lotItem.label = lotItem.typeName;
            }
            if (data['PC_HOME_MAIN_ACTIVITY'] === '1') {
                this.showAds = true
            }
            localStorage.setItem('GAME_SWITCH', GAME_SWITCH);
            localStorage.setItem('GAME_LIST', JSON.stringify(gameLists));
            this.menu = [...this.defaultMenu];
            this.menu.splice(
              this.menu.length - this.insertPos,
              0,
              ...gameLists
            );
            if (data['CHAT_SWITCH'] === '1') {
                this.menu.splice(this.menu.length - this.insertPos, 0, {
                    label: '聊天室',
                    url: '/chatRoom',
                    target: '_blank',
                    hot: true
                })
            }
            if (!gameLists || !gameLists.length || GAME_SWITCH == '0') {
                this.menu = this.menu.concat([
                    { label: '开奖公告', url: '/notice' },
                    { label: '走势图表', url: '/trend' }
                ])
            }
            //是否开启第三方游戏第一个登录的弹框提示, 2019.6.2 by xiaojiji
            this.showLoginGameTip =
                data['GAME_ACCOUNT_AUTO_TRANSFORM'] === '0' ? false : true;
            //广告位配置
            if (data['PC_HOME_MAIN_ACTIVITY'] == '1') {
                this.hasAds = '1'
                this.showAds = true
            }
            if (data['ALLOW_PLAY_FOR_FREE'] === '0') {
                this.arrowFree = false
            } else {
                this.arrowFree = true
            }
        })
    }
}
