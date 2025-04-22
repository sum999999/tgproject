<template>
  <div
    class="home-logined clearfix"
    :class="{
            'home-logined--fluid': isInternational
            }"
  >
    <ul class="logined-btn">
      <li
        class="login-out"
        :class="{'lone': !isShowCashIn}"
        @click="signOut()"
      >
        <Button
          v-preventReClick="2000"
          type='primary'
          :icon='isShowIcon? "power" : ""'
        >{{$tex("退出登录")}}</Button>
      </li>
      <template>
        <li
          class="btns"
          v-if="isShowCashIn"
        >
          <Button
            v-preventReClick="2000"
            type="default"
            class="deposit"
            @click="goPerCenter('recharge')"
          >
            <i
              v-if="isShowIcon"
              class="iconfont icon-qianbao1"
            ></i>
            <span class="text">{{$tex("充值")}}</span>
          </Button>
          <Button
            v-preventReClick="2000"
            class="withdrawl"
            type="default"
            @click="goPerCenter('withdraw')"
          >
            <i
              v-if="isShowIcon"
              class="iconfont icon-qianbao"
            ></i> <span class="text">{{$tex("提现")}}</span>
          </Button>
        </li>
      </template>

    </ul>
    <dl>
      <dt class="avatar-section">
        <div
          class="avatar-wp"
          @mouseenter="showPopup = true"
          @mouseleave="showPopup = false"
        >
          <img
            class="avatar"
            :src='avatarUrl'
            @click="$router.push('/personalCenter/account')"
          >
          <!-- 下拉菜单 -->
          <div
            v-show="showPopup"
            class="menu"
          >
            <ul>
              <li
                v-for="itm of dropMenus"
                :key="itm.routerName"
              >
                <router-link :to="`/personalCenter/${itm.routerName}`">
                  {{itm.txt}}
                </router-link>
              </li>
            </ul>
          </div>
          <!-- 下拉菜单结束 -->
        </div>
      </dt>
      <dd class="account-detail">
        <p>
          <span class="lab">{{$tex("账号")}}&nbsp;:&nbsp;</span>
          <span
            class="font-red"
            :class="{'free-play-txt' : isFreePlayer}"
            :title="user.userCode"
          >{{user.userCode}}&nbsp;&nbsp;</span><img
            v-if="isShowLevel"
            :src="user.userLevelIcon"
          >
        </p>
        <p class="balance">
          <span class="lab">{{$tex("余额")}}&nbsp;:&nbsp;</span>
          <span
            class="font-red"
            :class="{'free-play-txt' : isFreePlayer}"
          >{{user.balance | keepDecimalOf2}}{{$tex("元")}}</span>
          <template v-if="hasPermission('element.coin')">
            <span class="font-red">≈ </span>
            <span class="font-red">{{localBalance}}{{sysExchangeInfo.scurIcon}}</span>
          </template>
          <i
            class="iconfont icon-refresh"
            @mouseenter="showPopup = false"
            @mouseleave="showPopup = false"
            @click='refreshBalance'
            :class="{'turn-round':turnRound}"
          ></i>
        </p>
      </dd>
    </dl>
  </div>
</template>
<script>
import numeral from 'numeral'
import { hasPermission } from '@/utils/authority-utils'
import { mapGetters } from 'vuex'

const USER_AVATAR = '/static/images/account.png'

export default {
  props: {
    isShowIcon: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
    isShowLevel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      turnRound: false,
      showPopup: false, //是否显示下拉菜单
      initDropMenus: [
        {
          routerName: 'account',
          txt: this.$tex('会员中心'),
        },
        {
          routerName: 'trade',
          txt: this.$tex('交易明细'),
        },
        {
          routerName: 'record',
          txt: this.$tex('投注记录'),
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['sysExchangeInfo', 'isInternational']),
    //是否为试玩用户
    isFreePlayer() {
      return this.user.userType === '09'
    },
    //头像
    avatarUrl() {
      return this.user.imgUrl || USER_AVATAR
    },
    //余额
    userLoad() {
      return this.user.balance ? numeral(Number(this.user.balance)).format('0.00', Math.floor) : '0.00'
    },
    //是否显示充值体现
    isShowCashIn() {
      return this.user.userType !== '09' && this.user.userType !== '08'
    },
    //下拉菜单
    dropMenus() {
      if (hasPermission('personalCenter.link') && this.user.userType === '10') {
        return this.initDropMenus.concat([
          {
            routerName: 'userManage',
            txt: this.$tex('代理中心'),
          },
        ])
      }
      return this.initDropMenus
    },
    localBalance() {
      return +numeral(this.user.balance)
        .divide(this.sysExchangeInfo.exchangeRate || 1)
        .format('0.00', Math.floor)
    },
  },
  methods: {
    hasPermission,
    /**
     * 去充值或提现
     */
    goPerCenter(routerName) {
      this.$router.push({ path: `/personalCenter/${routerName}` })
    },
    /**
     * 刷新资金
     */
    refreshBalance() {
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
    /**
     * 退出登录
     */
    //退出登录(子组件公用)
    signOut() {
      this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then((response) => {
        this.loginOutStatus = false
        if (response.data.code !== 0) return
        this.$store.commit('getUser', '')
        localStorage.setItem('user', '')
        if (this.$route.name === 'personalCenter') this.$router.push('/')
      })
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.home-logined {
  &.home-logined--fluid {
    dl {
      max-width: none;
    }
    .account-detail .font-red {
      max-width: none;
    }
  }
  dl {
    float: right;
    max-width: 290px;
  }
  //头像及下拉菜单部分
  .avatar-section {
    float: left;
    .avatar-wp {
      position: relative;
      width: 60px;
      height: 60px;
      .avatar {
        display: block;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      .menu {
        position: absolute;
        top: 70px;
        left: -15px;
        width: 90px;
        background: #fff;
        border: 1px solid #ebebeb;
        padding: 0 15px;
        font-size: 12px;
        color: #7f7f7f;
        z-index: 100000;
        animation: fade-in 0.6s 1 ease;
        &:before,
        &:after {
          position: absolute;
          left: 50%;
          top: -11px;
          transform: translate(-50%, 0);
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
          font-size: 14px;
          border-width: 0 10px 12px 10px;
          border-color: transparent;
        }
        &:before {
          border-bottom-color: #ebebeb;
        }
        &:after {
          border-bottom: 12px solid #fff;
          top: -10px;
        }
        li {
          width: 100%;
          padding: 4px 5px;
          a {
            color: #7f7f7f;
          }
          &:not(:last-child) {
            border-bottom: 1px solid #ebebeb;
          }
        }
      }
    }
  }
  //账号及余额部分
  .account-detail {
    float: left;
    padding: 4px 0 4px 10px;
    img {
      width: 70px;
      height: 16px;
    }
    > p {
      span {
        display: inline-block;
        vertical-align: middle;
        height: 22px;
      }
      img,
      i {
        vertical-align: middle;
      }
    }
    .balance {
      margin-top: 6px;
      .icon-refresh {
        display: inline-block;
        margin-left: 7px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      }
      .turn-round {
        animation: rotating 5s infinite linear;
      }
    }

    .lab {
      color: #7f7f7f;
    }
    .font-red {
      &.free-play-txt {
        max-width: 150px;
      }
      // max-width: 85px;
      // max-width: 95px;
      max-width: 88px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .logined-btn {
    float: right;
    max-width: 340px;
    margin-left: 19px;
    margin-top: 11px;
    li {
      float: right;
      font-size: 14px;
      &.btns {
        font-size: 0;
      }
    }
    .ivu-btn {
      width: 97px;
      height: 38px;
      &:not(:first-child) {
        margin-left: 19px;
      }
      .iconfont {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 16px;
        margin: 0 4px;
        font-size: 18px;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .login-out {
    margin-left: 19px;
    &.lone {
      margin-left: 0;
    }
    .ivu-btn {
      padding: 0;
    }
    .ivu-icon + span {
      margin-left: 0;
    }
  }
}
</style>
