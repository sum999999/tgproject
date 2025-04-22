<template>
  <div class="top">
    <div class="top-content">
      <div class="fl top-left-div">
        <span class="addFavorite" @click="addCollection">加入收藏</span>
        <span v-if="arrowFree" class="setHome" @click="freePlay">免费试玩</span>
        <span class="loaclTime">{{ currDate }}&nbsp;&nbsp;{{ currTime }}</span>
      </div>
      <div
        class="rt top-right-div"
        v-if="!userInfo.userCode && $route.name != 'login'"
      >
        <a href="javascript:void(0)" class="top-a-btn top-a-blue top-a-login">
          <i class="iconfont icon-per"></i>
          <span class="top-span-txt" @click="$router.push('/login')">登录</span>
        </a>
        <a
          href="javascript:void(0)"
          class="top-a-btn top-a-yellow top-a-register"
        >
          <i class="iconfont icon-xiugai"></i>
          <router-link tag="span" class="top-span-txt" to="/register"
            >注册</router-link
          >
        </a>
        <a
          href="javascript:void(0)"
          class="top-a-btn top-a-green top-a-service"
        >
          <i class="iconfont icon-online"></i>
          <span class="top-span-txt" @click="openWin(servicer.url)"
            >在线客服</span
          >
        </a>
      </div>
      <div class="rt top-right-div" v-if="!!userInfo.userCode">
        <ul>
          <li class="userInfo">
            <template v-if="userInfo && userInfo.imgUrl">
              <img
                class="avatar"
                :src="userInfo && userInfo.imgUrl"
                @click="$router.push('/personalCenter/account')"
              />
            </template>
            <template v-else-if="userInfo && !userInfo.imgUrl">
              <img
                class="avatar"
                src="/static/images/account.png"
                @click="$router.push('/personalCenter/account')"
              />
            </template>
            <span class="user-name">{{ userInfo.userCode }}</span>
          </li>
          <li>
            <span class="text"
              >{{ $tex("¥") }}{{ Number(userInfo.balance).toFixed(2) }}
              <i
                class="iconfont icon-refresh"
                @mouseenter="showPopup = false"
                @mouseleave="showPopup = false"
                @click="refreshBalance()"
                :class="{ 'turn-round': turnRound }"
              ></i
            ></span>
          </li>
          <li>
            <Button
              type="warning"
              class="recharge"
              @click="$router.push({ path: '/personalCenter/recharge' })"
              >充值</Button
            >
          </li>
          <li>
            <Button
              type="primary"
              class="deposit"
              @click="$router.push({ path: '/personalCenter/withdraw' })"
              >提现</Button
            >
          </li>
          <!-- <li>
                    <span class="text"  @click="$router.push({path:'/personalCenter/account'})">会员中心</span>
                  </li>
                  <li>
                    <span class="text"  @click="$router.push({path:'/helpCenter/register'})">帮助中心</span>
                  </li>
                  <li>
                    <span class="text"  @click="$router.push({path:'/personalCenter/trade'})">交易明细</span>
                  </li>
                  <li>
                    <span class="text"  @click="$router.push({path:'/personalCenter/record'})">投注记录</span>
                  </li> -->
          <li>
            <Button type="error" class="deposit" @click="signOut()"
              >退出</Button
            >
            <!-- <span class="text"  @click="signOut()">退出</span> -->
          </li>
        </ul>
      </div>
    </div>
    <!-- 试玩弹窗 -->
    <component
      :is="tryPlay"
      :hasOpen="play"
      :tryPlayCaptchaInfo="tryPlayCaptchaInfo"
      @closeTryModal="play = false"
    >
    </component>
    <!-- 试玩弹框结束 -->
    <confirm-free
      :modalShow="confirmDialog"
      :title="$tex('温馨提示')"
      @btn-ok="handConfirm"
      :maskClosable="true"
      @btn-cancel="handForClear"
    >
      <div slot="content">
        <p class="confirm-free-modal-p">
          {{ $tex("当前使用的是正式账号，确定要切换到试玩模式吗") }}
        </p>
      </div>
    </confirm-free>
  </div>
</template>
<script>
import headerMixin from "./headerMixin.js";
import Util from "@/utils/dom.js";
import DateUtil from "@/utils/format_date.js";
export default {
  mixins: [headerMixin],
  data() {
    return {
      timer: null,
      currDate: "",
      currDay: "",
      currTime: "",
    };
  },
  mounted() {},
  created() {
    this.timer = setInterval(() => {
      this.chatFormateDate();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  computed: {
    servicer() {
      return this.$store.state.servicer;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    openWin(path) {
      const url = this.user.userCode
        ? this.serverUrl.url + `?id=${this.user.userCode}`
        : this.serverUrl.url;
      Util.openWin(path);
    },
    chatFormateDate() {
      let date = new Date();
      this.currDate = DateUtil.getFormatDate2(date, "yyyy-MM-dd hh:mm:ss");
    },
    addCollection() {
      this.$Modal.info({
        title: this.$tex("加入收藏"),
        content: this.$tex("请按Ctrl+D加入收藏"),
        onOk: () => {},
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "./style.less";
.clear() {
  content: "";
  display: block;
  clear: both;
}
.top-left-div {
  font-size: @smallFontSize;
}
.top {
  height: 44px;
  line-height: 44px;
  background-color: #424141;
  .clear();
}
.top-content {
  width: 1200px;
  margin: 0 auto;
}
.fl {
  float: left;
  & > span {
    color: @topLeftTextColor;
    float: left;
    &.addFavorite {
      margin-right: 12px;
      cursor: pointer;
    }
    &.setHome {
      margin-right: 16px;
      cursor: pointer;
    }
  }
}
.rt {
  float: right;
}
.top-right-div {
  font-size: 0;
  height: 44px;
  margin-right: -23px;
  & > ul {
    & > li {
      float: left;
      position: relative;
      cursor: pointer;
      & > span.text {
        display: inline-block;
        font-size: 14px;
        color: #fff;
        margin-right: 43px;
        .icon-refresh {
          display: inline-block;
          margin-left: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          margin-top: -8px;
          color: #fff;
          &.turn-round {
            animation: rotating 5s infinite linear;
          }
        }
      }
      & > .ivu-btn {
        margin-right: 18px;
        padding: 6px 27px;
      }
      &.userInfo {
        min-width: 116px;
        overflow: hidden;
        margin-right: 46px;
      }
      .avatar {
        float: initial;
        vertical-align: middle;
        margin: auto;
        width: 32px;
        line-height: 44px;
      }
      .user-name {
        display: inline-block;
        text-align: right;
        float: right;
        font-size: 14px;
        text-align: right;
        color: #fff;
        margin-left: 10px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  & > a {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
    color: #fff;
    .iconfont {
      font-size: 13px;
      vertical-align: middle;
      display: inline-block;
      &.icon-xiugai,
      &.icon-per {
        font-size: 10px;
      }
    }
    &.top-a-login {
      width: 84px;
      margin-right: 20px;
    }
    &.top-a-register {
      width: 84px;
      margin-right: 20px;
    }
    &.top-a-service {
      width: 106px;
    }
    &.top-a-blue {
      background-color: #2c73ff;
    }
    &.top-a-yellow {
      background-color: #fe9d18;
    }
    &.top-a-green {
      background-color: #47c451;
    }
  }
}
.logined-opt {
  & > li {
    float: right;
  }
}
</style>
