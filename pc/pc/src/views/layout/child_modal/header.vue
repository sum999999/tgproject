<template>
  <div class="home-header">
    <!-- 顶部栏菜单 -->
    <head-menu :arrowFree="arrowFree"> </head-menu>
    <!-- 顶部栏菜单结束 -->
    <!-- logo及登录区-->
    <div class="head-info" :class="{ bg: $configText.headBg }">
      <!--广告位 -->
      <transition name="slide-hidden">
        <div
          class="advs-wp"
          v-if="$route.name === 'home' && hasAds === '1' && showAds"
        >
          <adver></adver>
        </div>
      </transition>
      <!-- 广告位结束 -->
      <!-- logo及登录 -->
      <div class="content">
        <!-- 广告关闭图标 -->
        <div
          v-if="$route.name === 'home' && hasAds === '1' && showAds"
          class="close"
        >
          <close-icon @close-ads="closeAds"></close-icon>
        </div>
        <!-- 关闭图标结束 -->
        <!-- 灯泡区 -->
        <transition name="bulb-slide">
          <div
            class="bulb"
            v-show="$route.name === 'home' && hasBuld && hasAds === '1'"
          >
            <bulb @open-ads="openAds"></bulb>
          </div>
        </transition>
        <!-- 灯泡区 -->
        <!-- logo -->
        <div class="logo-wrap clearfix">
          <logo></logo>
        </div>
        <!--logo结束-->
        <div class="logo-side"></div>
        <!--登录注册-->
        <div
          v-if="!userInfo.userCode && $route.name != 'login'"
          class="account-info"
          id="loginInfo"
        >
          <login-register v-if="ydConfig" :utils="utils" :ydConfig="ydConfig" />
        </div>
        <!-- 登录注册结束-->
        <!-- 登录后的UI -->
        <div class="logined-wp" v-if="userInfo.userCode">
          <logined :user="userInfo" />
        </div>
        <!-- 登录注册结束 -->
      </div>
    </div>
    <!-- logo区域结束 -->
    <div
      class="head-menu"
      :class="[
        $route.name === 'home' && hasAds === '1' && showAds ? 'no-bg' : '',
      ]"
    >
      <div class="content">
        <!-- 热门彩种及列表 -->
        <div
          class="lottery-title"
          @mouseover="showAsideMenu"
          @mouseleave="hideAsideMenu"
        >
          <span class="icon"> <i class="i-icon i-three"></i>&nbsp;</span>
          <span>热门彩种</span>
          <lottery v-show="currentMenu === '/home' || hasAsideMenu"></lottery>
        </div>
        <!-- 导航菜单 -->
        <div class="nav-menu-wp">
          <header-nav
            :user="userInfo"
            :menu="menu"
            :showLoginGameTip="showLoginGameTip"
            @toggle-loading="toggleLoading"
            @send-current-path="setCurrentPath"
            @go-chat-room="goChatRoom"
          ></header-nav>
        </div>
        <!-- 导航菜单结束 -->
      </div>
    </div>
  </div>
</template>

<script>
// import Util from '@/utils/dom.js'
import utils from "@/utils/utils";
import headerMixin from "@/views/layout/child_modal/headerMixin.js";
import headMenu from "./header/headMenu";
import adver from "@/components/advertise.vue";
import closeIcon from "./header/closeIcon.vue";
import bulb from "./header/bulb.vue";
import logo from "@/components/logo.vue";
import loginRegister from "./header/loginRegister.vue";
import logined from "./header/logined.vue";
import headerNav from "./header/nav.vue";
export default {
  mixins: [headerMixin],
  components: {
    headMenu,
    adver,
    closeIcon,
    bulb,
    logo,
    loginRegister,
    logined,
    headerNav,
  },
  data() {
    return {
      util: "",
      utils: "",
      ydConfig: "",
    };
  },
  methods: {
    /**
     * 发送来当前的路由后缀
     */
    setCurrentPath(path) {
      this.currentMenu = path;
    },
    toggleLoading(flag) {
      this.$emit("toggle-loading", flag);
    },
    /**
     * 去聊天室
     */
    goChatRoom(flag) {
      this.$emit("go-chat-room", flag);
    },
  },
  created() {
    //传到loginRegister中
    this.utils = utils;
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@configUrl: "/configstatic/pc/images";
.home-header {
  @{deep} img {
    float: initial;
  }
  .head-info {
    &.bg {
      background: url("@{configUrl}/header_bg.png") no-repeat center;
    }
    //关闭广告图标
    .close {
      width: 1000px;
      margin: 0 auto;
    }
    //广告容器
    .advs-wp {
      height: 80px;
      visibility: visible;
      z-index: 3;
      &.slide-hidden-leave-to {
        opacity: 0;
        height: 0;
      }
      &.slide-hidden-enter {
        &:extend(.home-header .head-info .advs-wp.slide-hidden-leave-to);
      }
      &.slide-hidden-enter-active {
        &:extend(.home-header .head-info .advs-wp.slide-hidden-leave-active);
      }
      &.slide-hidden-leave-active {
        transition: all 0.3s;
      }
    }
    .content {
      position: relative;
      height: 90px;
      width: 1000px;
      margin: 0 auto;
      z-index: 102;
      .bulb {
        position: absolute;
        right: -60px;
        top: 0;
        &.bulb-slide-leave-to {
          transform: translateY(-45px);
        }
        &.bulb-side-leave-active {
          transition: all 0.3s;
        }
      }
      //登录前的部分
      .logo-wrap {
        float: left;
        height: 100%;
        overflow: hidden;
      }
      //登录后的状态
      .logined-wp {
        float: right;
        max-width: 620px;
        margin-top: 15px;
      }
      //logo右边图片
      .logo-side {
        float: left;
        margin-top: 35px;
        width: 200px;
        height: 55px;
        background: url("~@/assets/images/icon.png") no-repeat;
        background-position: -9px -444px;
      }
      //登录部分
      .account-info {
        float: right;
        margin-top: 26px;
      }
    }
  }
  //导航菜单
  .head-menu {
    min-width: 1000px;
    line-height: 44px;
    color: #fff;
    position: relative;
    z-index: 101;
    &.no-bg {
      background: none;
    }
    .content {
      width: 1000px;
      height: 44px;
      margin: 0 auto;
      position: relative;
      .lottery-title {
        float: left;
        width: 220px;
        position: relative;
        border-right: none;
        .icon {
          float: left;
          display: block;
          height: 44px;
          overflow: hidden;
          i {
            margin-top: 13px;
          }
        }
      }
      .nav-menu-wp {
        width: 780px;
        float: right;
      }
    }
  }
}
</style>
