<template>
  <div class="home-header3">
    <div class="notice-wrap">
      <div class="content">
        <!-- 当前日期 -->
        <div class="time">
          <date />
        </div>
        <!-- 当前日期结束 -->
        <!-- 头部右侧菜单 -->
        <div class="menu">
          <home-head-fast-nav
            :arrowFree="arrowFree"
            :isShowChangeTheme="false"
            :isShowSerIcon="false"
            :isShowGamePlay="false"
            :isShowHotPhone="true"
          />
          <language-switch
            v-if="hasPermission('element.language')"
          ></language-switch>
          <currency-switch
            v-if="hasPermission('element.coin')"
          ></currency-switch>
        </div>
        <!-- 头部右侧菜单结束 -->
      </div>
    </div>
    <!-- logo登录区-->
    <div class="head-info">
      <div class="content">
        <div class="logo-wrap">
          <logo />
        </div>
        <!--logo结束-->
        <!--登录注册-->
        <div
          class="account-info"
          v-if="!userInfo.userCode && $route.name != 'login'"
          id="loginInfo"
        >
          <login-register v-if="ydConfig" :utils="utils" :ydConfig="ydConfig" />
        </div>
        <!--  登录注册结束-->
        <!-- 用户信息结束-->
        <div class="logined" v-if="!!userInfo.userCode">
          <!-- <div
            class="red-packet-wp"
            @click="goRedPacket"
          ></div> -->
          <div class="logined-wp">
            <logined
              :user="userInfo"
              :isShowIcon="false"
              :isShowLevel="false"
            />
          </div>
        </div>
        <!-- 登录注册结束 -->
      </div>
    </div>
    <!-- logo区域结束 -->
    <div class="head-menu">
      <div class="content">
        <head-menu
          :menu="menu"
          @toggle-loading="toggleLoading"
          @go-chat-room="setGoChatRoom"
        ></head-menu>
      </div>
    </div>
    <try-play :isShowTryPlay="play" @close-try-play="play = false"> </try-play>
  </div>
</template>

<script>
import date from "./header/date.vue";
import tryPlay from "@/components/tryPlay.vue";
import homeHeadFastNav from "@/components/headMenu.vue";
import logo from "@/components/logo.vue";
import loginRegister from "./header/loginRegister.vue";
import logined from "@/views/layout/child_modal/header/logined.vue";
import headMenu from "./header/headMenu.vue";
import utils from "@/utils/utils";
import popupCaptcha from "@/mixins/popupCaptcha";
import LanguageSwitch from "@/components/LanguageSwitch";
import CurrencySwitch from "@/components/CurrencySwitch";
import context from "@/main";
import { hasPermission } from "@/utils/authority-utils";

function getDefaultMenu() {
  return [
    { label: context.$tex("首页"), url: "/home" },
    // { label: "购彩大厅", url: "/lottery", target: "_blank" },
    { label: context.$tex("app下载"), url: "/phoneBuy" },
    { label: context.$tex("优惠活动"), url: "/active" },
  ];
}

export default {
  components: {
    tryPlay,
    homeHeadFastNav,
    logo,
    loginRegister,
    logined,
    headMenu,
    date,
    LanguageSwitch,
    CurrencySwitch,
  },
  data() {
    return {
      menu: [...getDefaultMenu()],
      play: false,
      arrowFree: false, // 允许免费试玩
      showLoginGameTip: "", // 是否提示登陆第三方游戏弹框
      ydConfig: "",
      utils: utils,
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  methods: {
    hasPermission,
    //抢红包
    // goRedPacket() {
    //   //  this.$emit('home-go-red-packet');
    // },
    setGoChatRoom(flag) {
      this.$emit("go-chat-room", flag);
    },
    toggleLoading(flag) {
      this.$emit("toggle-loading", flag);
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((data) => {
      let gameLists = data["lotCcGameTypeConfig"];
      let ydConfig = data["YI_DUN_VAILD_CONFIG"];
      let GAME_SWITCH = data["GAME_SWITCH"];
      if (ydConfig) {
        ydConfig = JSON.parse(ydConfig);
        this.ydConfig = ydConfig;
      }
      try {
        gameLists =
          JSON.parse(gameLists).filter((item) => item.status === "1") || [];
        if (GAME_SWITCH !== "1") {
          gameLists = gameLists.filter((menu) => {
            return menu.code === "LOTTERY";
          });
        }
      } catch (e) {
        gameLists = [];
      }
      const lotItem = gameLists.find((menu) => {
        return menu.code === "LOTTERY";
      });
      if (lotItem) {
        lotItem.url = "/lottery";
        lotItem.target = "_blank";
        lotItem.label = lotItem.typeName;
      }
      localStorage.setItem("GAME_SWITCH", GAME_SWITCH);
      localStorage.setItem("GAME_LIST", JSON.stringify(gameLists));
      this.menu = [...getDefaultMenu()];
      this.menu.splice(this.menu.length - 2, 0, ...gameLists);
      if (data["CHAT_SWITCH"] === "1") {
        this.menu.splice(this.menu.length - 2, 0, {
          label: "聊天室",
          url: "/chatRoom",
          target: "_blank",
          hot: true,
        });
      }
      if (!gameLists || !gameLists.length || GAME_SWITCH == "0") {
        this.menu = this.menu.concat([
          { label: this.$tex("开奖公告"), url: "/notice" },
          { label: this.$tex("走势图表"), url: "/trend" },
        ]);
      }
      //是否开启第三方游戏第一个登录的弹框提示, 2019.6.2 by xiaojiji
      this.showLoginGameTip =
        data["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
      if (data["ALLOW_PLAY_FOR_FREE"] === "0") {
        this.arrowFree = false;
      } else {
        this.arrowFree = true;
      }
    });
  },
};
</script>
<style>
.confirm-free-modal-p {
  padding: 5%;
  text-align: center;
  font-size: 14px;
}
</style>
<style lang="less" scoped>
@deep: ~">>>";
.home-header3 {
  .notice-wrap {
    height: 35px;
    background: @baseColor;
    font-size: 14px;
    min-width: 1000px;
    overflow: hidden;
    .content {
      margin: 0 auto;
      .time {
        float: left;
        margin-left: 15px;
        line-height: 35px;
      }
      .menu {
        display: flex;
        align-items: center;
        float: right;
        height: 35px;
        @{deep} .language-dropdown,
        @{deep} .coin-dropdown {
          .ivu-dropdown-item {
            &:hover {
              color: #fed136;
            }
          }
          a {
            color: #999;
            &:hover {
              color: #fed136;
            }
          }
        }
        @{deep}.head-fast-nav {
          //快捷菜单
          li {
            padding: 0 15px;
            font-size: 14px;
            color: #999;
            &:last-child {
              padding-right: 10px;
              // >div {
              //   padding-right: 0;
              // }
              .i-telephone2 {
                background-image: url("~@/assets/images-v3/index/hot-phone.png");
                background-position: initial;
              }
            }
            &:not(:last-child):hover {
              color: #fed136;
            }
            .online-service {
              color: #999;
              &:hover {
                color: #fed136;
              }
            }
            // .hot-line-phone {
            //   color: #fff;
            //    @{deep} .i-telephone2 {
            //       background-image:url('~@/views-v3/images/index/hot-phone.png');
            //     }
            // }
          }
        }
      }
    }
  }
}

//logo、登录搜索区
.head-info {
  background: @headerBg;
  .content {
    position: relative;
    height: 110px;
    width: 1172px;
    margin: 0 auto;
    z-index: 102;
    background: @headerBg;
    .logo-wrap {
      float: left;
      height: 100%;
      overflow: hidden;
      @{deep} .logo {
        width: 242px;
        height: 100%;
        // top: 20px;
      }
    }
    //登录部分
    .account-info {
      float: right;
      margin-top: 42px;
      font-size: 0;
      // margin-right: 26px;
      .input-wrapper {
        position: relative;
        display: inline-block;
        margin-left: 16px;
        &:first-child {
          margin-left: 0;
        }
        .ipt-icon {
          position: absolute;
          top: 8px;
          left: 8px;
          display: block;
          width: 13px;
          height: 14px;
        }
        .yhm {
          background: url("~@/assets/images-v3/index/yhm.png") no-repeat;
        }
        .mm {
          height: 14px;
          background: url("~@/assets/images-v3/index/mm.png") no-repeat;
        }
        .for-pwd {
          display: block;
          position: absolute;
          right: 10px;
          top: 5px;
          font-size: 13px;
          color: @textLightColor;
          cursor: pointer;
          &:hover {
            opacity: 0.9;
          }
        }
        @{deep}#loginPwd {
          .ivu-input {
            padding-right: 75px;
          }
        }
        @{deep}.ivu-input {
          line-height: 30px;
          padding: 10px 10px 10px 28px;
          background-color: @inputBg;
          border: none;
          font-size: 13px;
          caret-color: #fff;
          color: @textColor;
        }
        @{deep}&.validate {
          .ivu-input {
            padding-left: 10px;
          }
        }
        @{deep}.ivu-btn {
          width: 84px;
          height: 30px;
          background: @buttonChangeColor;
          color: @btnTxtColor;
          font-size: 15px;
          border: none;
          transition: all 0.3s;
          &:hover {
            background: @button-hover-change-color;
          }
        }
        .ivu-input-wrapper {
          width: 160px;
          height: 30px;
          .ivu-input-icon {
            left: 0;
            font-size: 20px;
            &.ivu-icon-ios-person-outline {
              font-size: 20px;
            }
          }
        }
        &.validate {
          img {
            position: absolute;
            width: 67px;
            left: auto;
            right: 0;
            top: 0;
            height: 100%;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
          }
          .ivu-input {
            padding-left: 8px;
          }
        }
      }
    }
    .logined {
      float: right;
      margin-top: 26px;
      .logined-wp {
        float: left;
        font-size: 15px;
        margin-left: 16px;
        @{deep}.avatar-section {
          .menu {
            li {
              a:hover {
                color: @textColor;
              }
            }
          }
        }
        @{deep} .font-red {
          color: @textColor;
        }
        @{deep} .icon-refresh {
          color: @textColor;
        }
        @{deep}.ivu-btn {
          color: @btnTxtColor;
          font-size: 15px;
          height: 30px;
          border: none;
          background: @buttonChangeColor;
          font-family: "PingFang SC Medium";
          transition: all 0.3s;
          width: auto;
          padding: 0 10px;
          &.withdrawl {
            background: @buttonChangeColorTwo;
            &:hover {
              background: @button-hover-change-color-two;
            }
          }
          &:hover {
            background: @button-hover-change-color;
          }
          span {
            vertical-align: initial;
          }
        }
        @{deep} .login-out {
          font-size: 14px;
          .ivu-btn-primary {
            color: @btnTxtColor;
            background: @buttonChangeColorTwo;
            &:hover {
              background: @button-hover-change-color-two;
            }
            i {
              vertical-align: 0;
              background: none;
            }
          }
          span {
            margin-left: 0;
          }
        }
        .ivu-btn {
          border: none;
          transition: all 0.3s linear;
        }
      }
    }
  }
}
.head-menu {
  min-width: 1172px;
  color: #fff;
  position: relative;
  z-index: 101;
  background: @baseColor;
}
</style>
