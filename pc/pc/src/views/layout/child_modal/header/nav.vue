<template>
  <div class="nav-menu" :class="`nav-menu-${menu.length}`">
    <ul class="menus">
      <li
        v-for="(item, idx) in menu"
        :key="idx"
        :style="{ width: 100 / menu.length + '%' }"
        :class="{
          active:
            currentMenu === (item.url ? item.url : item.code) ||
            currentMenu === item.code,
          hot: item.hot,
        }"
      >
        <!-- 非游戏菜单 -->
        <template v-if="item.url">
          <router-link
            v-if="!item.url.includes('chatRoom')"
            :to="item.url"
            :target="item.target"
          >
            {{ item.label }}
          </router-link>
          <a
            v-else-if="item.url.includes('chatRoom')"
            @click.stop.prevent="toChatRoom"
          >
            聊天室
          </a>
        </template>
        <!-- 非游戏菜单结束 -->
        <!-- 游戏菜单 -->
        <template v-else>
          <a
            :target="item.target"
            @mouseenter="onGameHover(idx)"
            @mouseleave="onGameLeave(idx)"
            @click.prevent.stop="navGoGamePlat(item.code)"
          >
            <span>{{ item.typeName }}</span
            ><i class="iconfont icon-xiajiantou"></i>
            <div
              class="drop-menu-wp nice-scroll"
              v-show="gameIndex === idx"
              :class="[gameIndex === idx ? 'active' : '']"
            >
              <div class="drop-down-content" v-loading="loading">
                <div
                  class="ui-empty"
                  v-if="item.subMenu && !item.subMenu.length && !loading"
                >
                  暂无游戏
                </div>
                <ul v-else>
                  <li
                    v-for="(list, idx) of item.subMenu"
                    :key="idx"
                    :class="[
                      list.dispType === '1' && list.platformStatus !== '1'
                        ? 'disabled'
                        : '',
                    ]"
                    @click.stop.prevent="goGamePlat(list)"
                  >
                    <div>
                      <img
                        :src="list.typeIcon ? list.typeIcon : list.gameIcon"
                      />
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
                </ul>
              </div>
            </div>
          </a>
        </template>
      </li>
    </ul>
    <!-- 登录游戏前的自动转换提示 -->
    <credit-transform-tip
      :isShowDialog="gameMoneyTipShow"
      @go-game-login="goGameLogin"
      @close-transform-tip="gameMoneyTipShow = false"
    />
    <!-- 登录弹框 -->
    <modal
      :modalShow="showLoginDialog"
      @close-login-modal="showLoginDialog = false"
    >
    </modal>
    <!-- 登录弹框 -->
  </div>
</template>
<script>
import { UserTypes } from "@/constant/user";
import loginDlg from "@/components/login_dlg.vue";
import creditTransformTip from "@/components/creditTransformTip.vue";
import { queryQuickPlayGames } from "@/api/game";

export default {
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showLoginGameTip: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    loginDlg,
    creditTransformTip,
  },
  data() {
    return {
      loading: false,
      hasClickGoChatRoom: false,
      gameIndex: -1,
      showLoginDialog: false,
      loginDlg: null,
      loginGameLoading: false,
      currGameInfo: {}, //当前准备登录的游戏,
      gameMoneyTipShow: false, //登录游戏前的自动额度转换提示弹框flag
    };
  },
  computed: {
    currentMenu: {
      get() {
        let path = this.$route.path;
        if (this.$route.path.includes("game")) {
          //非游戏菜单
          path = this.$route.path.split("/").slice(-1)[0];
          if (path.includes("_")) {
            path = path.split("_")[1];
          }
        }
        this.$emit("send-current-path", path);
        return path;
      },
      set() {},
    },
  },
  methods: {
    /**
     * 点击导航菜单跳到游戏页
     */
    navGoGamePlat(code) {
      if (this.currentMenu === code) {
        return;
      }
      this.$router.push({ name: "game", params: { id: code } });
    },
    /**
     * 停留在游戏菜单上
     */
    async onGameHover(idx) {
      this.gameIndex = idx;
      const currentGame = this.menu[idx];
      if (currentGame.subMenu || this.loading) return;
      this.loading = true;
      const res = await this.getSubGames(currentGame.code);
      this.loading = false;
      if (res.data.code !== 0) return;
      currentGame.subMenu = res.data.data.list;
    },
    onGameLeave() {
      this.gameIndex = -1;
    },
    /**
     * 去游戏
     */
    async goGamePlat(info) {
      if (info.dispType === "1" && info.platformStatus !== "1") {
        return;
      }
      if (info.dispType === "2") {
        //游戏类型直接跳到第三方页面
        if (this.user.userType == UserTypes.TRY_PLAY) {
          // 试玩账号
          this.$Message.info("试玩账号不能使用该功能！");
          return;
        }
        if (!this.user.userCode) {
          this.$Modal.confirm({
            title: "提示",
            content: `<p>${this.$tex("您还未登入！去登录？")}</p>`,
            onOk: () => {
              this.showLoginDialog = true;
              this.loginDialog = loginDlg;
            },
          });
          return;
        }
        this.currGameInfo = info;
        //弹出自动转换额度的提示
        let hasLoginOtherGame =
          localStorage.getItem("hasLoginOtherGame") === "1" ? true : false;
        if (!hasLoginOtherGame && this.showLoginGameTip) {
          //第一次登陆游戏并且配置了要显示额度转换提示,则弹出自动额度转换的提示
          this.gameMoneyTipShow = true;
          localStorage.setItem("hasLoginOtherGame", "1");
          return;
        }
        this.goGameLogin();
      } else {
        //去游戏大厅
        this.$router.push({ name: "game", params: { id: info.code } });
      }
    },
    /**
     * 登陆游戏
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
      if (this.hasClickGoChatRoom) return;
      let vm = this;
      this.hasClickGoChatRoom = true;
      this.$emit("go-chat-room", this.hasClickGoChatRoom);
      this.$http
        .post(
          "/api/v2/chat/queryChatRooms",
          { current: 1, roomNo: "", size: 1, userId: this.user.userId || "" },
          { unenc: true }
        )
        .then(async (res) => {
          this.hasClickGoChatRoom = false;
          this.$emit("go-chat-room", this.hasClickGoChatRoom);
          if (res.data.code !== 0) return;
          const { speakStatus } = res.data.data;
          if (speakStatus === "3") {
            return this.$Modal.info({
              title: this.$tex("系统提示"),
              content: this.$tex("您当前无法进入此聊天室,请联系管理员！"),
            });
          }
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
              if (this.user.userId) {
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
          return !(!vm.user.userId || vm.user.userType === "09");
        }
        let levelArr = getLevel(levelStr);
        if (!isFormatUser()) {
          return levelArr.includes("-1");
        }
        return levelArr.includes(vm.user.userLevel);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.nav-menu {
  .menus {
    > li {
      float: left;
      text-align: center;
      a {
        display: block;
        color: #fff;
        width: 100%;
        transition: background 0.3s ease-in;
        height: 44px;
        i {
          position: relative;
          top: 2px;
        }
        .drop-menu-wp {
          position: absolute;
          top: 44px;
          left: 0;
          width: 1000px;
          max-height: 300px;
          overflow-y: auto;
          background-color: #fff;
          opacity: 0.9;
          z-index: 101;
          padding: 0 10px;
          cursor: initial;
          .drop-menu-content {
            margin: 0 auto;
            height: 190px;
            // color: red;
            cursor: initial;
            &.posRel {
              position: relative;
            }
          }
          ul {
            display: flex;
            align-items: top;
            width: 100%;
            overflow: hidden;
            flex-wrap: wrap;
            height: 100%;
            li {
              margin: 11px 12px 0;
              cursor: pointer;
              transition: opacity 0.3s;
              width: 10%;
              &:hover {
                opacity: 0.85;
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
          }
          img {
            float: inherit;
            width: auto;
            height: 70px;
          }
          .name {
            margin-top: -26px;
            color: #000;
            font-size: 16px;
            height: 44px;
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
          .start-game {
            text-align: center;
            margin-top: -14px;
            span {
              display: inline-block;
              width: 86px;
              height: 22px;
              line-height: 22px;
              border-radius: 22px;
              color: #fff;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  &.nav-menu-7 {
    li {
      &.hot {
        &::before {
          right: 8%;
        }
      }
    }
  }
  &.nav-menu-8 {
    li {
      &.hot {
        &::before {
          right: 1%;
        }
      }
    }
  }
}
</style>
