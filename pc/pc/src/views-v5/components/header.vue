<template>
  <div class="header">
    <div class="header-content clearfix">
      <div class="header-left-logo">
        <!-- logo -->
        <div class="logo">
          <router-link to="/"
            ><img class="w-full" :src="picture" :title="$configText.main + ''"
          /></router-link>
        </div>
        <!-- end -->
        <div class="suspend-logo"></div>
      </div>
      <div class="header-right-nav">
        <div class="header-nav-wrapper">
          <ul class="nav-menu" :class="['nav-menu-' + menu.length]">
            <li
              v-for="(item, idx) in menu"
              :key="idx"
              :class="{
                active:
                  currentMenu === (item.url ? item.url : item.code) ||
                  currentMenu === item.code,
                hot: item.hot,
              }"
            >
              <router-link
                v-if="item.url && !item.url.includes('chatRoom')"
                :to="item.url"
                class="link-a"
                :target="item.target"
              >
                <div>{{ item.label }}</div>
                <div class="en">{{ item.en }}</div>
              </router-link>
              <a
                v-else-if="item.url && item.url.includes('chatRoom')"
                @click.stop="toChatRoom"
                >聊天室</a
              >
              <a
                v-else
                :target="item.target"
                class="game-box"
                @mouseenter="onGameHover(idx)"
                @mouseleave="onGameLeave(idx)"
                @click.prevent="navGoGamePlat(item.code)"
              >
                <div class="typename">{{ item.typeName }}</div>
                <div class="en">{{ item.en }}</div>
                <i class="icon-select"></i>
                <div
                  class="drop-down-wrapper toggle"
                  v-show="gameIndex === idx"
                  :class="[gameIndex === idx ? 'active' : '']"
                >
                  <div
                    class="drop-down-content nav-drop lottery-drop"
                    :class="{ toggleBar: item.subMenu }"
                    v-loading="loading"
                  >
                    <div
                      class="ui-empty"
                      v-if="item.subMenu && !item.subMenu.length && !loading"
                    >
                      暂无游戏
                    </div>
                    <div class="layout" v-else>
                      <dl class="right">
                        <dd
                          class="lottery-vr"
                          v-for="(list, idx) of item.subMenu"
                          :key="idx"
                          :class="[
                            list.dispType === '1' && list.platformStatus !== '1'
                              ? 'disabled'
                              : '',
                            idx === item.subMenu.length - 1 ? 'last' : '',
                          ]"
                        >
                          <a
                            href="javascript:void(0)"
                            @click.stop="goGamePlat(list, $event)"
                          >
                            <span class="hd">
                              <img
                                :src="
                                  list.typeIcon ? list.typeIcon : list.gameIcon
                                "
                                alt=""
                              />
                              <h4>
                                {{
                                  list.typeName ? list.typeName : list.gameName
                                }}
                              </h4>
                            </span>
                            <template v-if="list.dispType === '2'">
                              <span class="bd">{{ $tex("立即游戏") }}</span>
                            </template>
                            <template v-if="list.dispType === '1'">
                              <span
                                class="bd"
                                v-if="list.platformStatus === '1'"
                                >{{ $tex("立即游戏") }}</span
                              >
                              <span
                                class="bd"
                                v-else-if="list.platformStatus === '2'"
                                >即将上线</span
                              >
                              <span
                                class="bd"
                                v-else-if="list.platformStatus === '3'"
                                >维护中</span
                              >
                              <span class="bd" v-else-if="!list.platformStatus"
                                >敬请期待</span
                              >
                            </template>
                          </a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="header-login-nav"
        v-if="!userInfo.userCode && $route.name != 'login'"
      >
        <div class="login-btn-wrap" v-click-out-slide="onLoginBtnOutClick">
          <span class="btn" @click="onLoginBtnClick">
            登陆
          </span>
          <header-login-box v-if="tplv5LoginBoxVisible" />
        </div>
        <span class="btn" @click="$router.push({ name: 'register' })"
          >注册</span
        >
        <span class="btn" @click="freePlay">免费试玩</span>
      </div>
      <header-user-info v-if="userInfo.userCode && $route.name != 'login'" />
    </div>
    <!-- 免费试玩谈框 -->
    <try-play :isShowTryPlay="isShowPlay" @close-try-play="closeTryPlay">
    </try-play>
  </div>
</template>
<script>
import tryPlay from "@/components/tryPlay.vue";

import headerMixin from "./headerMixin.js";
import headerLoginBox from "./headerLoginBox";
import headerUserInfo from "./headerUserInfo";
import { mapGetters } from "vuex";

export default {
  mixins: [headerMixin],
  components: {
    tryPlay,
    headerLoginBox,
    headerUserInfo,
  },
  data() {
    return {
      isShowPlay: false,
    };
  },
  computed: {
    ...mapGetters(["tplv5LoginBoxVisible"]),
    userInfo() {
      return this.$store.state.user;
    },
  },
  watch: {
    menu: {
      deep: true,
      immediate: true,
      handler(value) {
        console.log(value);
        for (let i in value) {
          const { typeName, url } = value[i];
          if (url === "/home") {
            value[i].en = "HOME";
          }
          if (url === "/lottery") {
            value[i].en = "LOTTERY GAME";
          }
          if (typeName === "棋牌") {
            value[i].typeName = "棋牌游戏";
            value[i].en = "CHESS & CARD";
          }
          if (typeName === "捕鱼") {
            value[i].typeName = "捕鱼游戏";
            value[i].en = "FISH GAME";
          }
          if (typeName === "视讯") {
            value[i].typeName = "真人视讯";
            value[i].en = "LIVE CASINO";
          }
          if (typeName === "电子") {
            value[i].typeName = "电子游艺";
            value[i].en = "SLOTS CASINO";
          }
          if (typeName === "电竞") {
            value[i].typeName = "电子竞技";
            value[i].en = "E-SPORTS GAME";
          }
          if (typeName === "体育") {
            value[i].typeName = "体育赛事";
            value[i].en = "SPORTS EVENT";
          }
          if (url === "/chatRoom") {
            value.splice(i, 1);
          }
          if (url === "/phoneBuy") {
            value.splice(i, 1);
          }
          if (url === "/active") {
            value.splice(i, 1);
          }
        }
      },
    },
  },
  mounted() {},
  methods: {
    onLoginBtnClick() {
      this.$store.commit("setTplv5LoginBoxVisible", !this.tplv5LoginBoxVisible);
    },
    onLoginBtnOutClick() {
      this.$store.commit("setTplv5LoginBoxVisible", false);
    },
    freePlay() {
      const { userType } = this.userInfo;
      if (!userType) {
        this.isShowPlay = true;
      }
    },
    closeTryPlay() {
      this.isShowPlay = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "./style.less";

.header {
  position: relative;
  height: 46px;
  line-height: 46px;
  background-color: @primaryTextColor;
}

.header-content {
  width: 1566px;
  margin: 0 auto;
  position: relative;
}

.header-left-logo {
  float: left;
  height: 46px;
}

.header-right-nav {
  float: left;
  margin-left: 70px;

  & > ul > li {
    float: left;

    & > a {
      position: relative;
      display: inline-block;
    }
  }
}
.header-login-nav {
  position: relative;
  display: inline-block;
  .login-btn-wrap {
    position: relative;
    display: inline-block;
    .login-box {
      position: absolute;
      left: -108px;
      top: 60px;
    }
  }
  .btn {
    padding: 4px 22px;
    color: #ffffff;
    font-size: 18px;
    border: 2px solid #ffffff;
    border-radius: 20px;
    margin-left: 15px;
    margin-right: 15px;
    cursor: pointer;
  }
}
.logo {
  height: 37px;

  & > a {
    display: inline-block;
    vertical-align: middle;
    height: 100%;

    img {
      float: none;
      width: auto;
      height: 100%;
    }
  }
}

.suspend-logo {
  width: 90px;
  height: 42px;
}

.header-nav-wrapper {
  width: 950px;

  .nav-menu > li {
    float: left;
    text-align: center;

    &.active,
    &:hover {
      border-radius: 21px;
      background-color: @backGroundColor;

      & > a {
        color: #fff;
        /*font-size: 18px;*/
      }
    }

    & > a {
      display: block;
      line-height: normal;
      color: @boldTextColor;
      font-size: @normalFontSize;
      box-sizing: border-box;
    }
  }
}

.nav-drop {
  background: url(~@/assets/images-v4/nav_drop_bg.png) repeat-x;
  position: absolute;
  width: 100%;
  height: 0;
  left: 0;
  top: 100%;
  z-index: 999;
  overflow: hidden;

  &.toggleBar {
    height: 145px;
    transition: height 0.6s;
  }

  .layout {
    display: inline-block;
    max-width: 1200px;
    width: 1200px;
    margin: auto;
    overflow: auto;
  }
}

.nav-drop .nav-promotion {
  width: 170px;
  height: 145px;
  background: url(~@/assets/images-v4/drop_pro_bg.png) repeat;
}

.nav-drop dl dd {
  text-align: center;
  display: inline-block;
}

.nav-drop dl dd a {
  background: url(~@/assets/images-v4/nav_drop_line.png) no-repeat right 37px;
}

.nav-drop dl dd.last a {
  background: none;
}

.nav-drop dl dd.sports-bb a,
.nav-drop dl dd.l-c-allbet a,
.nav-drop dl dd.lottery-sgwin a {
  background: none;
}

.nav-drop a {
  display: block;
  width: 100%;
  height: 145px;
  text-align: center;
}

.nav-drop a em {
  color: #626262;
}

.nav-drop .hd {
  width: 200px;
  height: 95px;
  padding-top: 10px;
  line-height: initial;
  display: block;
  overflow: hidden;

  & > img {
    height: 74%;
    width: auto;
    float: initial;
  }

  & > h4 {
    font-size: 12px;
    line-height: 12px;
    font-weight: normal;
  }
}

.nav-drop .bd {
  display: block;
  width: 90px;
  height: 27px;
  line-height: 27px;
  margin: 10px auto 0;
  border: 1px solid #ff464b;
  color: #ff464b;
  border-radius: 14px;
  font-size: 12px;
  -webkit-transition: background 0.3s ease-in-out;
  -moz-transition: background 0.3s ease-in-out;
  -ms-transition: background 0.3s ease-in-out;
  -o-transition: background 0.3s ease-in-out;
  transition: background 0.3s ease-in-out;
}

.nav-drop a:hover .bd {
  background: #f0a638;
  border-color: #f0a638;
  color: #fff;
}

.nav-drop i {
  display: block;
  background: url(~@/assets/images-v4/nav_hd_spirits.png) no-repeat;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.nav-menu li > a > i {
  display: block;
  /*background: url(~@/assets/images-v4/ico_triangle.png) no-repeat;*/
  height: 14px;
  line-height: 14px;
  width: 14px;
  margin: auto;
  margin-top: -14px;
}
.nav-menu li > a > .en {
  font-size: 12px;
}
.nav-menu > li {
  padding: 4px 15px;
}
.nav-menu > li:hover {
  padding: 4px 15px;
}
</style>
