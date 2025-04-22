<template>
  <div class="base-header">
    <div class="container">
      <!-- <div class="base-header__bar">
        <Icon
          class="base-header__icon-notice"
          type="volume-medium"
        ></Icon>
        <span class="base-header__notice-label">{{$tex("最新公告")}}</span>
        <div class="base-header__notice">
          <marquee
            v-if="notice"
            class="base-header__notice-marquee"
            scrolldelay="100"
            scrollamount="6"
          >
            <div
              class="base-header__notice-content"
              v-html="notice"
              @click="$router.push({path:'/newsList/announce'})"
            ></div>
          </marquee>
        </div>
        <language-switch v-if="hasPermission('element.language')"></language-switch>
        <currency-switch v-if="hasPermission('element.coin')"></currency-switch>
        <base-contact></base-contact>
      </div> -->
      <div class="base-header__content">
        <router-link
          class="base-header-logo"
          to="/"
        >
          <img
            src="/configstatic/pc/images/logo.gif"
            alt=""
          >
        </router-link>
        <div
          v-if="showUnLogin"
          class="base-header-unlogin"
        >
          <Input
            v-model="formData.userCode"
            class="header-input header-input--icon-prepend header-input--no-padding-right"
            icon="android-person"
            :placeholder="$tex('用户名')"
          ></Input>
          <div class="base-header-unlogin-item base-header-unlogin-password">
            <Input
              v-model="formData.password"
              class="header-input header-input--icon-prepend"
              icon="android-lock"
              type="password"
              :placeholder="$tex('密码')"
            ></Input>
            <div
              class="base-header-unlogin-password__tips"
              @click="$router.push('password')"
            >{{$tex("忘记密码")}}?</div>
          </div>
          <div
            v-if="isYzm"
            class="base-header-unlogin-item base-header-unlogin-sms"
          >
            <Input
              v-model="formData.checkCode"
              class="header-input"
              :placeholder="$tex('验证码')"
              @on-focus='refreshCheckCode'
            ></Input>
            <img
              :src="ewmUrl"
              @click="refreshCheckCode"
            >
          </div>
          <yi-dun
            ref="yidun"
            moduleName="loginFilter"
            mode="popup"
            width="375px"
            @verify="onYiDunVerify"
            @popup-close="onYiDunPopupClose"
          ></yi-dun>
          <Button
            class="ivu-btn-style--1"
            shape="circle"
            :loading="loginLoading"
            @click="login"
          >
            <span v-if="!loginLoading">{{$tex("用户登录")}}</span>
            <span v-else>{{$tex("登录中")}}</span>
            <!-- <Poptip
              trigger="hover"
              class="quick-login-panel"
            >
              <Icon
                type="arrow-down-b"
                style="    font-size: 20px;
                margin-left: 10px;
                margin-top: 2px;"
              ></Icon>
              <div
                slot="content"
                @click.stop
              >
                <div class="quick-login-panel__btns">
                  <img
                    class="quick-login-panel__btn"
                    src="~@/assets/images-v8/register/icon_facebook.png"
                  >
                  <img
                    class="quick-login-panel__btn"
                    src="~@/assets/images-v8/register/icon_twitter.png"
                  >
                  <img
                    class="quick-login-panel__btn"
                    src="~@/assets/images-v8/register/icon_telegram.png"
                  >
                  <img
                    class="quick-login-panel__btn"
                    src="~@/assets/images-v8/register/icon_google.png"
                  >
                </div>
              </div>
            </Poptip> -->
          </Button>
          <Button
            class="ivu-btn-style--2"
            type="primary"
            shape="circle"
            @click="$router.push('/register')"
          >{{$tex("免费注册")}}</Button>
          <Button
            class="ivu-btn-style--3"
            type="primary"
            shape="circle"
            @click="play = true"
          >{{$tex("免费试玩")}}</Button>
        </div>
        <div
          v-if="showLogin"
          class="base-header-login"
        >
          <Button
            class="ivu-btn-style--3"
            shape="circle"
          >
            {{balance | keepDecimalOf2}}
            <span
              v-if="hasPermission('element.unit')"
              style="margin-left:20px;"
            >{{$tex("元")}}</span>
            <img
              src="~@/assets/images-v8/home/icon-refresh.png"
              style="margin-left:9px;"
              :class="{'turn-round':turnRound}"
              @click="refreshBalance"
            />
          </Button>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            @click="$router.push({name: 'personalCenter', params: {id: 'account'}})"
          >
            <img
              src="~@/assets/images-v8/home/icon-user.png"
              style="margin-right:9px;width:20px;"
            />
            {{userCode}}
          </Button>
          <div class="base-header-login__separator"></div>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            @click="$router.push({name: 'personalCenter', params: {id: 'recharge'}})"
          >
            <img
              src="~@/assets/images-v8/home/icon-deposit.png"
              style="margin-right:9px;width:20px;"
            />
            {{$tex("充值")}}
          </Button>
          <div class="base-header-login__separator"></div>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            @click="$router.push({name: 'personalCenter', params: {id: 'withdraw'}})"
          >
            <img
              src="~@/assets/images-v8/home/icon-withdrawal.png"
              style="margin-right:9px;width:20px;"
            />
            {{$tex("提现")}}
          </Button>
          <div class="base-header-login__separator"></div>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            @click="$router.push({name: 'personalCenter', params: {id: 'account'}})"
          >
            <img
              src="~@/assets/images-v8/home/icon-center.png"
              style="margin-right:9px;width:20px;"
            />
            {{$tex("个人中心")}}
          </Button>
          <div class="base-header-login__separator"></div>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            @click="$router.push({name: 'personalCenter', params: {id: 'record'}})"
          >
            <img
              src="~@/assets/images-v8/home/icon-record.png"
              style="margin-right:9px;width:20px;"
            />
            {{$tex("投注记录")}}
          </Button>
          <div class="base-header-login__separator"></div>
          <Button
            class="ivu-btn-style--4"
            shape="circle"
            :loading="singOutLoading"
            @click="signOut"
          >
            <img
              v-if="!singOutLoading"
              src="~@/assets/images-v8/home/icon-logout.png"
              style="margin-right:9px;width:20px;"
            />
            <span v-if="!singOutLoading">{{$tex("退出登入")}}</span>
            <span v-else>{{$tex("退出中")}}</span>
          </Button>
        </div>
        <language-switch v-if="hasPermission('element.language')"></language-switch>
        <currency-switch v-if="hasPermission('element.coin')"></currency-switch>
      </div>
    </div>
    <try-play
      :is-show-try-play="play"
      @close-try-play="play = false"
    >
    </try-play>
  </div>
</template>

<script>
import utils from '@/utils/utils'
import { mapGetters } from 'vuex'
import encryption from '@/utils/md5'
import YiDun from '@/components/YiDun'
import { hasPermission } from '@/utils/authority-utils'
import tryPlay from '@/components/tryPlay.vue'
import LanguageSwitch from '@/components/LanguageSwitch'
import CurrencySwitch from '@/components/CurrencySwitch'
import BaseContact from './BaseContact'
import numeral from 'numeral'

export default {
  name: 'BaseHeader',
  components: {
    YiDun,
    tryPlay,
    LanguageSwitch,
    CurrencySwitch,
    BaseContact,
  },
  data() {
    return {
      formData: {
        userCode: '',
        password: '',
        checkCode: '',
      },
      ewmUrl: '',
      kaptchaFlag: '',
      turnRound: false,
      singOutLoading: false,
      yidunRef: null,
      cacheLoginInfo: null,
      loginLoading: false,
      notice: '',
      play: false,
    }
  },
  computed: {
    ...mapGetters(['user', 'sysExchangeInfo']),
    isLogin() {
      return !!this.user.userId
    },
    showUnLogin() {
      return this.$route.name !== 'login' && !this.isLogin
    },
    showLogin() {
      return this.$route.name !== 'login' && this.isLogin
    },
    userCode() {
      return this.user.userCode
    },
    balance() {
      return this.user.balance
    },
    localBalance() {
      return +numeral(this.balance)
        .divide(this.sysExchangeInfo.exchangeRate || 1)
        .format('0.00', Math.floor)
    },
    avatar() {
      return this.user.imgUrl || '/static/images/account.png'
    },
    isYzm() {
      return !this.isOpenBehavior
    },
    isOpenBehavior() {
      return this.yidunRef && this.yidunRef.isOpenBehavior
    },
    behaviorValidate() {
      return this.yidunRef && this.yidunRef.behaviorValidate
    },
    isOpenSXE() {
      return this.yidunRef && this.yidunRef.isOpenSXE
    },
  },
  created() {
    this.$nextTick(() => {
      this.yidunRef = this.$refs.yidun
    })
    this.refreshCheckCode()
    this.handleNotice()
  },
  methods: {
    hasPermission,
    handleNotice() {
      this.$store.dispatch('queryAnnounceEssayList', { current: 1, size: 100, type: '02' }).then((response) => {
        if (response.data.code !== 0) return
        let n = response.data.data.list
        let txt = ''
        n.forEach((item) => {
          txt += utils.escapeHtml(item.content)
        })
        this.notice = txt
      })
    },
    async refreshCheckCode() {
      const data = await utils.loadEwmUrl()
      this.ewmUrl = data.url
      this.kaptchaFlag = data.kaptchaFlag
      return data.kaptchaFlag
    },
    refreshBalance() {
      if (this.turnRound) {
        return
      }
      this.turnRound = true
      this.$http.post('/api/v2/user/balanceAdnSign', {}, { userId: true, unenc: true }).then((response) => {
        if (response.data.code !== 0) return
        let { balance, levelId } = response.data.data
        let user = Object.assign({}, this.user, {
          balance: balance,
          levelId: levelId,
        })
        this.$store.commit('getUser', user)
        this.turnRound = false
      })
    },
    async login() {
      if (this.isLogin) {
        return this.$Modal.info({
          title: this.$tex('不能连续登陆'),
          content: this.$tex('现在为您跳转'),
          onOk: () => {
            this.$store.commit('getUser', {})
          },
        })
      }
      if (!this.formData.userCode) {
        return this.$Modal.error({
          title: this.$tex('请求失败'),
          content: `<p>${this.$tex('账号不能为空')}</p>`,
          onOk: () => {
            this.handleVerifyFieldFail()
          },
        })
      }
      if (!this.formData.password) {
        return this.$Modal.error({
          title: this.$tex('请求失败'),
          content: `<p>${this.$tex('密码不能为空')}</p>`,
          onOk: () => {
            this.handleVerifyFieldFail()
          },
        })
      }
      //未开启行为验证
      if (!this.isOpenBehavior) {
        if (!this.formData.checkCode) {
          this.$Modal.error({
            title: this.$tex('请求失败'),
            content: `<p>${this.$tex('验证码不能为空')}</p>`,
            onOk: () => {
              this.handleVerifyFieldFail()
            },
          })
          return
        }
      }
      if (this.loginLoading) {
        return
      }
      this.loginLoading = true
      const obj = {
        userCode: this.formData.userCode,
        password: encryption.encrypt.md5(this.formData.password),
      }
      if (this.isYzm) {
        obj.checkCode = this.formData.checkCode
      }
      //开启了反作弊
      if (this.isOpenSXE) {
        const token = await this.yidunRef.getSXEToken()
        obj.ydtoken = token
      }
      this.cacheLoginInfo = obj
      if (this.isOpenBehavior) {
        this.yidunRef.handleBehaviorPopup()
      } else {
        this.handleLogin(obj)
      }
    },
    handleVerifyFieldFail() {
      if (this.isYzm) {
        this.formData.checkCode && (this.checkCode = '')
        this.refreshCheckCode()
        return
      }
      this.yidunRef.refreshBehavior()
    },
    onYiDunVerify() {
      if (!this.behaviorValidate) {
        return
      }
      this.cacheLoginInfo.ydNECaptchaValidate = this.behaviorValidate
      this.handleLogin(this.cacheLoginInfo)
    },
    onYiDunPopupClose() {
      if (!this.behaviorValidate) {
        this.loginLoading = false
      }
    },
    handleLogin(obj) {
      const curKaptchaFlag = this.kaptchaFlag
      this.$http
        .post('/api/v2/user/login', obj, {
          kaptchaFlag: curKaptchaFlag,
        })
        .then(async (res) => {
          this.loginLoading = false
          this.refreshCheckCode()
          let data = res.data
          let code = data.code
          if (code !== 0) {
            this.formData.password = ''
            this.yidunRef.refreshBehavior()
            if (code === 256) {
              this.$store.commit('getCacheLoginUserInfo', JSON.stringify(obj))
              this.$store.commit('getKaptchaFlag', curKaptchaFlag)
            }
            return
          }
          ;['userCode', 'password', 'checkCode'].forEach((item) => (this.formData[item] = ''))
          const { data: resData } = data
          this.$store.commit('getUser', resData)
          const routerName = this.$route.name
          if (routerName === 'login' || routerName === 'register') {
            this.$router.push('/')
          }
        })
    },
    signOut() {
      if (this.singOutLoading) {
        return
      }
      this.singOutLoading = true
      this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then((response) => {
        this.singOutLoading = false
        if (response.data.code !== 0) return
        this.$store.commit('getUser', '')
        localStorage.setItem('user', '')
        if (this.$route.name === 'personalCenter') this.$router.push('/')
      })
    },
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.base-header {
  background-image: linear-gradient(to top, #323232, #292929, #323232);
  padding: 12px;
}
.base-header__bar {
  padding-left: 220px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ddc17c;
}
.base-header__notice {
  flex: 1;
  margin-right: 20px;
  height: 30px;
  position: relative;
}
.base-header__notice-marquee {
  height: 100%;
}
.base-header__notice-content {
  overflow: hidden;
  display: inline;
  line-height: 30px;
  &:hover {
    cursor: pointer;
  }
  @{deep} {
    * {
      display: inline-block;
      vertical-align: top;
      height: 100%;
      background: none !important;
      color: #ddc17c !important;
    }
    img {
      float: none;
      max-width: none !important;
      width: auto;
    }
  }
}
.base-header__notice-label {
  margin: 0 8px;
}
.base-header__icon-notice {
  font-size: 24px;
}
.base-header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.base-header-logo {
  display: inline-block;
  font-size: 0;
  @keyframes hvr-pop {
    6% {
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }

    10% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    to {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  img {
    float: none;
    width: 200px;
    height: 65px;
    object-fit: contain;
    animation: hvr-pop 5s linear 0s infinite;
  }
}
.base-header-login {
  display: flex;
  align-items: center;
  > * {
    margin: 0 8px;
  }
  &__separator {
    height: 30px;
    width: 2px;
    background: #fed136;
  }
}
.base-header-login-user {
  border-radius: 15px;
  background-color: #1c1b22;
  font-size: 12px;
  color: #ddc17c;
  padding: 6px 16px 6px 36px;
  position: relative;
}
.base-header-login-user__avatar {
  position: absolute;
  left: -20px;
  width: 41px;
  height: 41px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  background-image: linear-gradient(to top, #b48132, #fae0af, #b48132);
  border-radius: 50%;
  padding: 1px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    float: none;
  }
}
.base-header-login-user__text.usercode {
  margin-right: 20px;
}
.base-header-login-user__text.balance {
  margin-right: 8px;
}
.base-header-unlogin {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
  .header-input {
    width: 160px;
  }
  > button {
    margin: 0 10px;
    padding: 4px 20px;
  }
  > button:nth-of-type(1) {
    margin-left: 20px;
  }
}
.base-header-unlogin-item,
.base-header-login-item {
  margin-left: 16px;
}
.base-header-unlogin-sms {
  position: relative;
  .ivu-input-wrapper {
    width: 180px;
  }
  img {
    position: absolute;
    width: 78px;
    left: auto;
    right: 0;
    top: 0;
    height: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    cursor: pointer;
  }
  @{deep} {
    .ivu-input {
      padding-right: 88px;
    }
  }
}
.base-header-unlogin-password {
  position: relative;
  @{deep} {
    .ivu-input-icon-normal + .ivu-input {
      padding-right: 70px;
    }
  }
}
.base-header-unlogin-password__tips {
  position: absolute;
  color: #ff0000;
  right: 10px;
  top: 7px;
  font-size: 12px;
  cursor: pointer;
}
.ivu-icon-ios-loop-strong {
  cursor: pointer;
}
.yi-dun {
  width: 0;
  height: 0;
  opacity: 0;
}
.quick-login-panel {
  @{deep} {
    .ivu-poptip-popper {
      margin-top: 10px;
    }
    .ivu-poptip-popper[x-placement^='bottom'] .ivu-poptip-arrow:after,
    .ivu-poptip-popper[x-placement^='bottom'] .ivu-poptip-arrow {
      border-bottom-color: #434343;
    }
    .ivu-poptip-inner {
      background: #434343;
    }
  }
  &__btns {
    padding: 30px 0px;
    display: flex;
    justify-content: center;
  }
  &__btn {
    width: 35px;
    height: 35px;
    margin: 0 11px;
    cursor: pointer;
  }
}
</style>
