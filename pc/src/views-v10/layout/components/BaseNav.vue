<template>
  <div class="base-nav-wrap">
    <!-- <div class="menu-bg"></div> -->
    <ul
      class="base-nav container"
      :class="{
        'base-nav--show': showContent,
      }"
    >
      <!-- 首页 -->
      <li
        class="base-nav-item"
        :class="{
          'base-nav-item--active': $route.name === 'home',
        }"
        @click="$router.push('/')"
      >
        <div class="base-nav-item__content">
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            src="~@/assets/images-v10/home/Yingyong_icon_Home.png"
            alt=""
          />
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            src="~@/assets/images-v10/home/Yingyong_icon_Home_xz.png"
            alt=""
          />
          <span class="base-nav-item__title">{{ $tex("首页") }}</span>
        </div>
      </li>
      <li
        v-for="(game, index) in gameList"
        :key="index"
        class="base-nav-item"
        :class="[
          game.code,
          $route.name === 'game' &&
            $route.params.id === game.code &&
            'base-nav-item--active',
          $route.name === 'lottery' &&
            game.code === 'LOTTERY' &&
            'base-nav-item--active',
        ]"
        @click="onGameClick(game)"
        @mouseenter="onNavItemMouseEnter(game)"
        @mouseleave="onNavItemMouseLeave"
      >
        <div class="base-nav-item__content">
          <!-- <i class="base-nav-item__icon base-nav-item__icon-light"></i>
          <i class="base-nav-item__icon base-nav-item__icon-night"></i> -->
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            :src="game.pc5icon"
            alt=""
          />
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            :src="game.pc6icon"
            alt=""
          />
          <span class="base-nav-item__title">{{ game.typeName }}</span>
        </div>
        <!-- <div
          v-if="game.code === 'LOTTERY'"
          class="base-nav-tips animate__animated animate__infinite animate__top2bottom"
        >
          <span class="base-nav-tips__text">HOT</span>
        </div> -->
      </li>
      <!-- 聊天室 -->
      <li v-if="isOpenChat" class="base-nav-item" @click="openChat">
        <div class="base-nav-item__content">
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            src="~@/assets/images-v10/home/Yingyong_icon_chat.png"
            alt=""
          />
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            src="~@/assets/images-v10/home/Yingyong_icon_chat_xz.png"
            alt=""
          />
          <vue-loaders-line-scale
            v-if="chatRoomLoading"
            scale="0.5"
            color="#5b3b0e"
            :style="{ height: 0, marginTop: '8px' }"
          ></vue-loaders-line-scale>
          <span v-else class="base-nav-item__title">{{ $tex("聊天室") }}</span>
        </div>
      </li>
      <!-- 优惠活动 -->
      <li
        class="base-nav-item"
        :class="{
          'base-nav-item--active': $route.name === 'active',
        }"
        @click="$router.push('/active')"
      >
        <div class="base-nav-item__content">
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            src="~@/assets/images-v10/home/Yingyong_icon_Promotions.png"
            alt=""
          />
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            src="~@/assets/images-v10/home/Yingyong_icon_Promotions_xz.png"
            alt=""
          />
          <span class="base-nav-item__title">{{ $tex("优惠活动") }}</span>
        </div>
      </li>
      <!-- app下载 -->
      <li
        class="base-nav-item"
        :class="{
          'base-nav-item--active': $route.name === 'phone_buy',
        }"
        @click="$router.push('/phoneBuy')"
      >
        <div class="base-nav-item__content">
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            src="~@/assets/images-v10/home/Yingyong_icon_DownloadAPP.png"
            alt=""
          />
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            src="~@/assets/images-v10/home/Yingyong_icon_DownloadAPP_xz.png"
            alt=""
          />
          <span class="base-nav-item__title">{{ $tex("app下载") }}</span>
        </div>
      </li>
      <!-- 在线客服 -->
      <!-- <li
        v-if="serverUrl.url"
        class="base-nav-item"
        @click.stop.prevent="openService(serverUrl.url)"
      >
        <div class="base-nav-item__content">
          <img
            class="base-nav-item__img base-nav-item__icon-light"
            src="~@/assets/images-v6/home/zaixiankefu.png"
            alt=""
          >
          <img
            class="base-nav-item__img base-nav-item__icon-night"
            src="~@/assets/images-v6/home/zaixiankefu_xz.png"
            alt=""
          >
          <span class="base-nav-item__title">{{$tex("在线客服")}}</span>
        </div>
      </li> -->
    </ul>
    <base-sub-nav
      v-show="showSubNav"
      ref="subNav"
      :list="subNavList"
      :loading="subNavLoading"
      @mouseleave.native="isShowSubNav = false"
    ></base-sub-nav>
  </div>
</template>

<script>
import Util from "@/utils/dom.js";
import BaseSubNav from "./BaseSubNav";
import { getRelatedTarget } from "@/utils/domEx";
import { queryChatRooms, queryCheckChatRoomPwd } from "@/api/chat";
import goChatRoom from "@/mixins/goChatRoom";
import VueLoadersLineScale from "vue-loaders/dist/loaders/line-scale";
import { queryGameListTypes } from "@/api/game";

export default {
  name: "BaseNav",
  mixins: [goChatRoom],
  components: {
    BaseSubNav,
    VueLoadersLineScale: VueLoadersLineScale.component,
  },
  data() {
    return {
      gameList: [],
      showContent: false,
      isShowSubNav: false,
      subNavListStore: {},
      curSubNavCode: "",
      sysConfig: {},
      chatRoomLoading: false,
      subNavLoading: true,
    };
  },
  computed: {
    serverUrl() {
      return this.$store.state.servicer;
    },
    showSubNav() {
      return this.showContent && this.isShowSubNav;
    },
    subNavList() {
      return this.subNavListStore[this.curSubNavCode] || [];
    },
    isOpenChat() {
      return this.sysConfig["CHAT_SWITCH"] === "1";
    },
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((sysConfig) => {
      this.sysConfig = sysConfig;
      this.handleMenu(sysConfig);
      this.showContent = true;
    });
  },
  methods: {
    openService(url) {
      //打开客服
      Util.openWin(url);
    },
    async handleMenu(sysConfig) {
      const isOpenGame = sysConfig["GAME_SWITCH"] === "1";
      const res = await queryGameListTypes({ code: null });
      const { code, data } = res.data;
      if (code !== 0) return;
      const { list } = data;
      let gameLists = null;
      try {
        gameLists = list.filter((item) => item.status === "1") || [];
        if (!isOpenGame) {
          gameLists = gameLists.filter((menu) => {
            return menu.code === "LOTTERY";
          });
        }
      } catch (e) {
        gameLists = [];
      }
      this.gameList = gameLists;
    },
    onGameClick(game) {
      if (game.code === "LOTTERY") {
        const { href } = this.$router.resolve({ name: "lottery" });
        window.open(href, "_blank");
      } else {
        this.$router.push({ name: "game", params: { id: game.code } });
      }
    },
    async onNavItemMouseEnter(game) {
      if (game.code === "LOTTERY") {
        return;
      }
      this.curSubNavCode = game.code;
      this.isShowSubNav = true;
      if (this.subNavListStore[game.code]) {
        return;
      }
      this.subNavLoading = true;
      const gameData = await this.$store.dispatch("queryQuickPlayGames", {
        code: game.code,
      });
      this.subNavLoading = false;
      if (!gameData) {
        return;
      }
      const list = gameData.list.splice(0, 7);
      this.$set(this.subNavListStore, game.code, list);
    },
    onNavItemMouseLeave(e) {
      const relatedTarget = getRelatedTarget(e);
      const isContains = this.$refs.subNav.$el.contains(relatedTarget);
      if (!isContains) {
        this.isShowSubNav = false;
      }
    },
    openChat() {
      if (this.chatRoomLoading) {
        return void 0;
      }
      this.chatRoomLoading = true;
      queryChatRooms({
        current: 1,
        roomNo: "",
        size: 1,
        userId: this.userInfo.userId || "",
      }).then(async (res) => {
        const { data, code } = res.data;
        if (code !== 0) return;
        const { chatRooms = [], systemChatRooms = [] } = data;
        if (!chatRooms[0] && !systemChatRooms[0]) {
          this.chatRoomLoading = false;
          return this.$Modal.error({
            title: this.$tex("温馨提示"),
            content: `<p>${this.$tex("未设置聊天室房间")}！</p>`,
            onOk: function() {},
          });
        }
        let {
          bankLevel,
          openLevel,
          passwordLevel,
          roomPassword,
          roomId,
        } = systemChatRooms.length ? systemChatRooms[0] : chatRooms[0];
        let hasOpenRight = this.hasRight(openLevel);
        if (!hasOpenRight) {
          this.chatRoomLoading = false;
          //如果等级达标等级
          this.$Message.error(this.$tex("用户等级不够不能进入聊天室"));
          return;
        }
        if (roomPassword) {
          //有密码要求的话
          if (this.hasRight(passwordLevel)) {
            let userNeedPwd = true;
            this.$store.commit("SET_CHATROOM_ID", roomId);
            if (this.userInfo.userId) {
              const res = await queryCheckChatRoomPwd({ roomId: roomId });
              const { data, code } = res.data;
              if (code === 0) {
                if (data.result) {
                  userNeedPwd = true;
                } else {
                  userNeedPwd = false;
                }
              }
            }
            if (userNeedPwd) {
              this.chatRoomLoading = false;
              this.$store.commit("getRoomPwdDialogInfo", {
                isShow: true,
                roomId: roomId,
              });
              return;
            }
          }
        }
        //等级达标不需要密码
        localStorage.setItem("isOtherToChatRoom", true);
        const { href } = this.$router.resolve({
          name: "chatRoom",
          path: "/chatRoom",
        });
        window.open(href, "_blank");
        this.chatRoomLoading = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.base-nav-wrap {
  position: relative;
  z-index: 899;
  background: #f5f8fe;
  border: 1px solid #d1d4f6;
  border-left-width: 0;
  border-right-width: 0;
  box-shadow: 0 2px 4px 0 #c6d3f3, inset 0 0 16px 0 rgba(255, 255, 255, 0.5);
}

.menu-bg {
  position: absolute;
  height: 46px;
  width: 100%;
  background: url("~@/assets/images-v6/home/menu_bg.png") no-repeat;
}

.base-nav {
  display: flex;
  justify-content: center;

  overflow-x: clip;
  overflow-y: visible;

  .base-nav-item:nth-child(1) {
    &:before,
    &:after {
      display: none;
    }
  }

  .base-nav-item {
    visibility: hidden;
  }

  &.base-nav--show {
    .base-nav-item {
      visibility: visible;
    }
  }
}

.base-nav-item {
  width: 124px;
  text-align: center;
  position: relative;
  cursor: pointer;

  .base-nav-item__icon-light {
    display: inline-block;
  }

  .base-nav-item__icon-night {
    display: none;
  }

  &--active,
  &:hover {
    color: rgb(var(--tg-accent) e("/") var(--tg-text-opacity));

    .base-nav-item-shadow {
      display: block;
    }
    &:before,
    &:after {
      display: none;
    }

    + .base-nav-item {
      &:before,
      &:after {
        display: none;
      }
    }

    .base-nav-item__icon-light {
      display: none;
    }

    .base-nav-item__icon-night {
      display: inline-block;
    }
  }
}

.base-nav-item__content {
  position: relative;
  padding: 14px 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.base-nav-tips {
  position: absolute;
  top: -12px;
  right: 8px;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
  color: #ffffff;
  font-size: 14px;
  background-image: linear-gradient(to top, #670016, #ff5400);
  &:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid #670016;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    right: 8px;
    bottom: -5px;
  }
}

.base-nav-item__img {
  width: auto;
  height: 30px;
  float: none;
  object-fit: contain;
}

.base-nav-item__icon {
  width: 100%;
  height: 30px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  float: none;
}

.base-nav-item__title {
  margin-top: 8px;
  font-size: 16px;
  line-height: 16px;
  word-break: break-all;
}
</style>
