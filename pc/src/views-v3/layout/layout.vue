<template>
  <div class="pc-layout3">
    <!-- 全局qrcode,不能删 -->
    <div
      id="ios"
      style="display:none"
    ></div>
    <div
      id="android"
      style="display:none"
    ></div>
    <div
      class="header"
      v-if="!isShowHead"
    >
      <head-content
        @toggle-loading="toggleLoading"
        @go-chat-room="toggleLoading"
      ></head-content>

    </div>
    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <!-- 结束 -->
    <div
      class="bodyer"
      :class="{'v3': $route.path.includes('game')}"
      v-loading="loginGameloading"
    >
      <keep-alive :include="['chatRoom']">
        <router-view />
      </keep-alive>
    </div>
    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <!-- 结束 -->

    <div
      class="footer"
      v-if="!isShowFoot"
    >
      <foot-content
        :androidQrCode='qrcodes[1]'
        :iosQrCode='qrcodes[0]'
      ></foot-content>
    </div>
    <!-- 红包 -->
    <!-- 右边栏 -->
    <slide-quick />
  </div>
</template>

<script>
import headContent from '../common/module_vue/header.vue'
import footContent from '../common/module_vue/footer.vue'
import QRCode from '@/utils/qrcode' // import QRCode from "qrcodejs2"; 不使用网站太长会报错
import modal from '@/components/modal'
import { getConfigList } from '@/utils/getSysConfig'
import { mapGetters } from 'vuex'
import { queryQrcodesAndServicer } from '@/api/cms'
import { hasPermission } from '@/utils/authority-utils'
import SlideQuick from './SlideQuick.vue'

export default {
  components: {
    headContent,
    footContent,
    modal,
    SlideQuick,
  },
  data() {
    return {
      rightUrl: [],
      isShowHead: false,
      isShowFoot: false,
      showLogin: false, //弹框
      arrowFree: true, // 允许免费试玩
      redPackDetail: {},
      initWmCount: 0,
      productNumber: '', //产品编号
      loginGameloading: false,
      isShowRoomPwdModal: false, //是否显示房间密码弹框
      roomPwdFlag: -1,
      roomRwd: '', //房间密码
      hasClickSubMitPwd: false, //是否点击了提交房间密码
    }
  },
  computed: {
    ...mapGetters(['isInternational']),
    user() {
      return this.$store.state.user
    },
    isLogin() {
      return !!this.user.userId
    },
    qrcodes() {
      return this.$store.state.qrcodes
    },

    showDiffLoginDialog() {
      //是否提示异地登录异常
      // console.log();
      return this.$store.state.diffPlaceLogin
    }, //异地登录异常弹框
    roomPwdDialogInfo() {
      //进入聊天室相关的信息
      return this.$store.state.roomPwdDialogInfo
    },
    serverUrl() {
      if (!this.$store.state.servicer) {
        return
      }
      return this.$store.state.servicer
    },

    showLongqueue() {
      return hasPermission('longqueue') && this.showSysDragon
    },
  },
  watch: {
    $route(n) {
      this.routeStatus(n.name)
      // debugger;
    },
    // user: {
    //   deep: true,
    //   immediate: true,
    //   handler(newUser = {}, oldUser = {}) {
    //     if (newUser.userId && newUser.userId !== oldUser.userId) {
    //       this.handleExChangeRate()
    //     }
    //   }
    // }
  },
  methods: {
    hasPermission,
    handleExChangeRate() {
      this.isInternational && this.$store.dispatch('querySysExChangeInfo')
    },
    handleLanguage() {
      this.isInternational && this.$store.dispatch('queryLanguageConfig')
    },
    /**
     * 切换登录游戏的loading
     */
    toggleLoading(flag) {
      this.loginGameloading = flag
    },
    removeScrollTop(index) {
      this.$set(this.suspendFlag, index, true)
      for (let i = 0; i < this.suspendFlag.length; i++) {
        if (!this.suspendFlag[i]) {
          return
        }
        if (i === this.suspendFlag.length - 1) {
          this.showSuspend = false
          window.removeEventListener('scroll', this.verticalScroll)
        }
      }
    },
    calcuService(servicer) {
      let vm = this
      vm.$store.dispatch('querySystemConfig').then((data) => {
        if (data['ALLOW_PLAY_FOR_FREE'] === '0') {
          vm.arrowFree = false
        } else {
          vm.arrowFree = true
        }
      })

      //在线客服
      vm.rightUrl.push(servicer.url)
      //帮助中心
      vm.rightUrl.push('#/helpCenter/register')
    },
    routeStatus(name) {
      if (name === 'buyLottery' || name === 'redPacket' || name === 'chatRoom' || name === 'feedbackActive') {
        this.isShowHead = true
        this.isShowFoot = true
        this.showSuspend = false
      } else if (name === 'lottery') {
        this.isShowHead = false
        this.isShowFoot = true
        this.showSuspend = false
      } else {
        this.isShowHead = false
        this.isShowFoot = false
        this.showSuspend = true
        if (name === 'phone_buy') this.showSuspend = false
      }
    },
    getQrCode(data) {
      // 注册全局的二维码
      let img = ''
      let value = ''
      let vm = this
      let arr = []
      ;['ios', 'android'].forEach((item, idx) => {
        let code = new QRCode(item, data[idx].targetUrl)
        let timer = setTimeout(function () {
          img = document.getElementById(item).querySelector('img')
          if (img) {
            value = img.getAttribute('src')
            if (value) {
              clearInterval(timer)
              arr.push({ img: value, icon: item })
              if (item === 'android') {
                vm.$store.commit('getQrcodes', arr)
              }
            }
          }
        }, 100)
      })
    },
  },
  async created() {
    let vm = this
    this.handleExChangeRate()
    this.handleLanguage()
    this.routeStatus(this.$route.name)
    await queryQrcodesAndServicer().then((response) => {
      let data = response.data.data
      this.calcuService(data.servicer)
      this.$store.commit('getServicer', data.servicer)
      this.getQrCode(data.qrcodes)
      document.title = data.servicer.name
    })
    getConfigList().then((res) => {
      vm.$store.commit('getConfigList', res) //获取全局配置文件
      res.forEach((item) => {
        if (item.key == 'TEST_PLAY_MONEY') {
          vm.$store.commit('freePlay', item.value)
        }
      })
    })
  },
}
</script>

<style lang="less">
@import '../../styles/mixin.less';
.pc-layout3 {
}
// @deep: ~'>>>';
/*模板的全局滚动条样式*/
.rq-nice-scroll::-webkit-scrollbar {
  width: 8px;
  background: #2a2a2a;
}
.rq-nice-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.rq-nice-scroll::-webkit-scrollbar-track-piece {
  background: #2a2a2a;
}
.rq-nice-scroll::-webkit-scrollbar-thumb {
  background: #222;
  border-radius: 4px;
}
.pc-layout3 {
  // padding-bottom: 75px;
  font-family: 'PingFang SC Regular', 'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans GB', 'Arial',
    'sans-serif';
  background: @wholeBg;
  .bodyer {
    padding-bottom: 20px;
  }
  .v3 {
    //game3
    height: 1456px;
    background: url('~@/assets/images-v3/game/bg.png') no-repeat;
    background-position: bottom center;
    background-size: contain;
  }
  .help-center .nav li {
    border-right: none;
  }
  .notice .lottery-list {
    border: none;
    border-bottom: 1px solid;
  }

  .active-page .title {
    display: none;
  }
  .personal-center {
    .information-member {
      .ivu-select-dropdown {
        left: -232px !important;
      }
    }
    .information-system {
      .ivu-select-dropdown {
        left: -232px !important;
      }
    }

    .description-tpl {
      width: 730px;
      margin: 0 auto;
    }
    .information-system {
      width: initial;
    }
    .personal-content {
      width: 950px !important;
    }
    .recharge {
      .paylist {
        > ul:nth-child(2) {
          width: 100%;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    }
  }
  .record {
    .ivu-select-item-selected {
      color: #fff !important;
    }
  }
  .report-wrap {
    .ivu-select-selected-value {
      text-align: center;
      padding-left: 25px;
    }
    .ivu-select-dropdown-list {
      text-align: center;
    }
    .ivu-date-picker .ivu-select-dropdown {
      left: 100px !important;
    }
  }
  .borrow-content {
    .borrow-qr-code {
      left: 110px !important;
    }
    .borrow-content {
      .borrow-qr-code {
        left: 110px !important;
      }
      .borrow-iphonex {
        right: 110px !important;
      }
    }
  }

  .role-center {
    .navList {
      li {
        span {
          &:hover {
            background: initial;
          }
        }
      }
    }
  }

  .help-center {
    width: 1172px;
    .help-content {
      width: 974px;
    }
  }
  .notice-detail .lottery-result {
    background-color: #fff;
  }
  .ivu-form-item-error .ivu-input:focus {
    box-shadow: none;
  }
  .content {
    width: 1172px;
    margin: 0 auto;
  }
  .lee-globaloading {
    .load-3 {
      top: 25%;
    }
  }
}
.v-transfer-dom {
  .pie-modal {
    .ivu-modal-header {
      height: 0 !important;
      padding: 0;
      span {
        display: none;
      }
    }
    .ivu-modal-body {
      p {
        &.title {
          font-weight: bold;
        }
      }
      .content {
        position: relative;
        padding: 22px 0 0 48px;
        margin-top: 6px;
        font-size: 12px;
        i {
          position: absolute;
          left: 0;
          top: 10px;
          color: #ed3f14;
          font-size: 36px;
        }
      }
    }
    .ivu-modal-footer {
      text-align: right;
      button {
        width: 60px !important;
        height: 36px !important;
      }
    }
  }
  .rooms-modal {
    .ivu-modal-body {
      height: 86px;
      padding: 28px 40px 8px;
      text-align: center;
    }
    .pwd-wp {
      height: 50px;
      display: inline-block;
    }
    .pwd-ipt {
      width: 170px;
      height: 30px;
    }
    .error-tip {
      height: 20px;
      text-align: left;
      font-size: 12px;
      line-height: 20px;
    }
    .ivu-modal-footer {
      padding: 0 40px 22px;
      font-size: 0;
    }
  }
  .v3-home-feed-back,
  .v3-home-add-feed-back {
    .ivu-modal-header {
      color: @buttonColor;
    }
    .ivu-modal-body {
      .icon-zxkf {
        color: @inputBg!important;
      }
      .feed {
        color: @inputBg!important;
      }
      .ivu-btn-primary {
        background-color: @buttonColor;
        border: none;
        color: #2a2a2a;
        &:hover {
          background: @buttonColor*.95;
        }
      }
    }
  }
}
</style>


