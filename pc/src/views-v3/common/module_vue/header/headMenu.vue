<template>
  <div class="home-menu-nav">
    <ul class="nav-menu" :class="['nav-menu-' + menu.length]">
      <li v-for="(item, idx) in menu" :key="idx" class="nav-item">
        <!-- 非游戏菜单 -->
        <template v-if="item.url">
          <router-link
            v-if="!item.url.includes('chatRoom')"
            :to="item.url"
            :target="item.target"
          >
            {{ item.label }}
          </router-link>
          <a v-else @click.stop="toChatRoom">{{ $tex("聊天室") }}</a>
        </template>
        <!-- 非游戏菜单结束 -->
        <!-- 游戏菜单 -->
        <template v-else>
          <a
            :target="item.target"
            @mouseenter="onGameHover(idx)"
            @mouseleave="onGameLeave(idx)"
            @click.prevent="navGoGamePlat(item.code)"
          >
            <span>{{ item.typeName }}</span>
            <div class="drop-down-wrapper" v-show="gameIndex === idx">
              <div
                class="drop-down-content"
                :class="[`${dropGameClass ? dropGameClass : ''}`]"
                v-loading="loading"
              >
                <div
                  class="ui-empty"
                  v-if="item.subMenu && !item.subMenu.length && !loading"
                >
                  暂无游戏
                </div>
                <ol v-else>
                  <li
                    v-for="(list, idx) of item.subMenu"
                    :key="idx"
                    :class="[
                      list.dispType === '1' && list.platformStatus !== '1'
                        ? 'disabled'
                        : '',
                    ]"
                    @click.stop="goGamePlat(list)"
                  >
                    <div class="avater">
                      <img :src="list.typeIcon" />
                    </div>
                    <div class="name">
                      <span>{{
                        list.typeName ? list.typeName : list.gameName
                      }}</span>
                    </div>
                    <div class="start-game">
                      <template v-if="list.dispType === '2'">
                        <span>{{ $tex("立即游戏") }}</span>
                      </template>
                      <template v-if="list.dispType === '1'">
                        <span v-if="list.platformStatus === '1'">{{
                          $tex("立即游戏")
                        }}</span>
                        <span v-else-if="list.platformStatus === '2'"
                          >即将上线</span
                        >
                        <span v-else-if="list.platformStatus === '3'"
                          >维护中</span
                        >
                        <span v-else-if="!list.platformStatus">敬请期待</span>
                      </template>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </a>
        </template>
      </li>
    </ul>
    <!-- 登录弹框 -->
    <component
      :is="loginDialog"
      :isShow="showLoginDialog"
      @close-login-modal="showLoginDialog = false"
    >
    </component>
    <!-- 额度转换提示 -->
    <!-- 登录游戏前的自动转换提示 -->
    <credit-transform-tip
      :isShowDialog="gameMoneyTipShow"
      @go-game-login="goGameLogin"
      @close-transform-tip="gameMoneyTipShow = false"
    />
  </div>
</template>

<script>
import loginDlg from "@/components/login_dlg.vue";
import creditTransformTip from "@/components/creditTransformTip.vue";
import { queryQuickPlayGames } from "@/api/game";

export default {
  props: ["menu", "showLoginGameTip"],
  components: {
    loginDlg,
    creditTransformTip,
  },
  data() {
    return {
      currentMenu: this.$route.path,
      gameIndex: -1,
      dropGameClass: "",
      loading: "",
      loginDialog: "",
      showLoginDialog: false,
      gameMoneyTipShow: false,
      loginGameLoading: false,
      hasClickGoChatRoom: false,
      currentMenu: "",
      currGameInfo: {}, //当前准备登录的游戏,
    };
  },
  watch: {
    $route(n, o) {
      let id = n.params.id;
      if (id) {
        id = id.includes("_") ? id.split("_")[1] : id;
        this.currentMenu = id;
      } else {
        this.currentMenu = n.path;
      }
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
  },
  created() {
    let route = this.$route;
    if (route.name === "game") {
      let id = route.params.id;
      id = id.includes("_") ? id.split("_")[1] : id;
      this.currentMenu = id;
    }
  },
  methods: {
    async onGameHover(idx) {
      this.gameIndex = idx;
      const currentGame = this.menu[idx];
      this.dropGameClass = currentGame.code.toLowerCase();
      if (currentGame.subMenu || this.loading) return;
      this.loading = true;
      const res = await this.getSubGames(currentGame.code);
      this.loading = false;
      if (res.data.code !== 0) return;
      currentGame.subMenu = res.data.data.list;
    },
    onGameLeave() {
      this.gameIndex = -1;
      // this.dropGameClass = "";
    },
    /**
     * 点击导航菜单跳到游戏页
     */
    navGoGamePlat(code) {
      this.currentMenu = code;
      this.$router.push({ name: "game", params: { id: code } });
    },
    async goGamePlat(info) {
      if (info.dispType === "1" && info.platformStatus !== "1") {
        return;
      }
      if (info.dispType === "2") {
        //游戏类型直接跳到第三方页面
        if (this.userInfo.userType == "09") {
          // 试玩账号
          this.$Message.info("试玩账号不能使用该功能！");
          return;
        }
        if (!this.userInfo.userCode) {
          this.$Modal.confirm({
            title: "提示",
            content: "<p>您还未登入！去登录？</p>",
            onOk: () => {
              this.showLoginDialog = true;
              this.loginDialog = loginDlg;
            },
          });
          return;
        }
        // if (this.gameLoading) {
        // event.preventDefault();
        // return;
        // }
        this.currGameInfo = info;
        //弹出自动转换额度的提示
        let hasLoginOtherGame =
          localStorage.getItem("hasLoginOtherGame") === "1" ? true : false;
        // debugger;
        if (!hasLoginOtherGame && this.showLoginGameTip) {
          //第一次登陆游戏并且配置了要显示额度转换提示
          this.gameMoneyTipShow = true;
          localStorage.setItem("hasLoginOtherGame", "1");
          return;
        }
        this.goGameLogin();
      } else {
        //去游戏大厅
        this.$router.push({ name: "game", params: { id: info.code } });
      }
      // event.preventDefault();
    },
    /**
     * 开始登陆游戏
     */
    goGameLogin() {
      this.gameMoneyTipShow = false;
      if (this.loginGameLoading) return;
      this.loginGameLoading = true;
      this.$emit("toggle-loading", this.loginGameLoading);
      let info = this.currGameInfo;
      this.$http
        .post(
          "/party/v2/game/loginGame",
          { platformId: info.platformId, gameId: info.gameId },
          { unenc: true, userId: true }
        )
        .then((response) => {
          this.loginGameLoading = false;
          this.$emit("toggle-loading", false);
          if (response.data.code !== 0) return;
          let url = response.data.data.url;
          let html = response.data.data.html;
          if (url) {
            this.$Modal.confirm({
              title: this.$tex("提示"),
              content: this.$tex("为更好的进行游戏娱乐，将为您打开新的窗口"),
              onOk: () => {
                window.open(url, "_blank");
              },
            });
          } else {
            var newPage = window.open("", "_blank");
            newPage.document.open();
            newPage.document.write(html); //运行 HTML 代码
            newPage.document.close();
          }
        });
    },
    /**
     * 获取第三方游戏快捷投注列表
     */
    getSubGames(code) {
      return new Promise((resolve, reject) => {
        queryQuickPlayGames({ code: code }).then((res) => {
          resolve(res);
        });
      });
    },
    /**
     * 去聊天室
     */
    toChatRoom() {
      let vm = this;
      if (this.hasClickGoChatRoom) return;
      this.hasClickGoChatRoom = true;
      this.$emit("go-chat-room", this.hasClickGoChatRoom);
      this.$http
        .post(
          "/api/v2/chat/queryChatRooms",
          {
            current: 1,
            roomNo: "",
            size: 1,
            userId: this.userInfo.userId || "",
          },
          { unenc: true }
        )
        .then(async (res) => {
          this.hasClickGoChatRoom = false;
          this.$emit("go-chat-room", this.hasClickGoChatRoom);
          if (res.data.code !== 0) return;
          if (
            !res.data.data.chatRooms[0] &&
            !res.data.data.systemChatRooms[0]
          ) {
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
          } = res.data.data.systemChatRooms.length
            ? res.data.data.systemChatRooms[0]
            : res.data.data.chatRooms[0];
          let hasOpenRight = hasRight(openLevel);
          // debugger;
          if (!hasOpenRight) {
            //如果等级达标等级
            this.$Message.error("用户等级不够不能进入聊天室");
            return;
          }
          if (roomPassword) {
            //有密码要求的话
            if (hasRight(passwordLevel)) {
              let userNeedPwd = true;
              this.$store.commit("SET_CHATROOM_ID", roomId);
              if (this.userInfo.userId) {
                let res = await this.$http.post(
                  "/api/v2/chat/queryCheckChatRoomPwd",
                  { roomId: roomId },
                  {
                    userId: true,
                    unenc: true,
                  }
                );
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
          // this.$router.push("/chatRoom");
          const { href } = this.$router.resolve({
            name: "chatRoom",
            path: "/chatRoom",
          });
          window.open(href, "_blank");
        });

      //判断登录游戏的权限
      function hasRight(levelStr) {
        function getLevel(levelStr) {
          if (!levelStr) return [];
          return levelStr.split("|");
        }

        function isFormatUser() {
          return !(!vm.userInfo.userId || vm.userInfo.userType === "09");
        }

        let levelArr = getLevel(levelStr);
        if (!isFormatUser()) {
          return levelArr.includes("-1");
        }
        return levelArr.includes(vm.userInfo.userLevel);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home-menu-nav {
  width: 1172px;
  margin: 0 auto;
  position: relative;
  text-align: center;

  .nav-menu {
    display: flex;
    justify-content: center;
    .nav-item {
      float: left;
      text-align: center;
      margin: 0 20px;
      padding: 11px 0;
      &:hover {
        a {
          color: @textLightColor;

          &:after {
            visibility: visible;
          }
        }
      }

      a {
        color: #fff;
        width: 100%;
        font-size: 16px;
        transition: all 0.3s;
        i {
          position: relative;
          top: 1px;
        }
        &:after {
          position: relative;
          bottom: -10px;
          left: 0;
          display: block;
          content: "";
          width: 100%;
          height: 4px;
          background: @textLightColor;
          visibility: hidden;
        }
      }
    }

    li {
      a:hover {
        background: transparent !important;
        color: @textLightColor;
      }
    }
  }

  .drop-down-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0.9;
    z-index: 101;
    cursor: initial;
  }

  .drop-down-content {
    width: 1172px;
    color: red;
    cursor: initial;
    padding: 10px;
    min-height: 185px;
    ol {
      width: 100%;
      height: 100%;
      font-size: 0;
      text-align: center;
      overflow: hidden;
    }

    li {
      display: inline-block;
      width: 10%;
      height: 100%;
      padding: 4px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        // opacity: .85;
        .start-game {
          span {
            background-color: #fed136;
            color: #000;
          }
        }
      }

      &.disabled {
        cursor: not-allowed;

        img {
          filter: grayscale(100%);
          filter: gray;
        }

        .name {
          color: gray;
        }

        .start-game {
          span {
            cursor: not-allowed;
            background-color: gray;
          }
        }
      }
    }

    .avater {
      height: 70px;
      overflow: hidden;
    }

    img {
      float: inherit;
      width: auto;
      height: 100%;
    }

    .name {
      width: 100%;

      span {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        line-height: 26px;
        color: #fff;
      }
    }

    .start-game {
      width: 100%;

      span {
        display: block;
        margin: 0 auto;
        width: 86px;
        margin-top: 5px;
        line-height: 22px;
        border-radius: 22px;
        color: #fff;
        color: #fed136;
        border: 1px solid #fed136;
        background-color: #2a2a2a;
        transition: all 0.3s;
      }
    }
  }

  .nav-menu-7 {
    li {
      &.hot {
        &::before {
          right: 8%;
        }
      }
    }
  }

  .nav-menu-8 {
    li {
      &.hot {
        &::before {
          right: 1%;
        }
      }
    }
  }

  .ui-empty {
    position: absolute;
    left: -135%;
    top: 55px;
    width: 120px;
    padding-top: 40px;
  }
}
</style>
