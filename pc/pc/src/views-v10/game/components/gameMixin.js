import GameSearchInput from "./GameSearchInput";
import GameTabs from "./GameTabs";
import GameList from "./GameList";

import {
  queryGameListTypes,
  queryTypePlatforms,
  queryPlatformGames,
  loginGame,
  queryGameSearch,
} from "@/api/game";
import { UserTypes } from "@/constant/user";
import { mapGetters } from "vuex";
import GameAmountConvertDialog from "./GameAmountConvertDialog";

export default {
  components: {
    GameSearchInput,
    GameTabs,
    GameList,
    GameAmountConvertDialog,
  },
  props: {
    code: {
      type: String,
      required: true,
    },
    platCode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabs: [],
      curTabIndex: -1,
      games: [],
      curGameIndex: -1,
      gamesMap: {},
      sysConfig: {},
      showConvertAmountTips: false,
      gameLoading: false,
      searchValue: "",
      gameType: {},
      searchTimeout: null,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    allTab() {
      return this.tabs.find((tab) => {
        return tab.platformId === "-1";
      });
    },
    filterTabs() {
      return this.tabs.filter((tab) => {
        return tab.platformId !== "-1";
      });
    },
    curAllTab() {
      if (this.curTabIndex === -1) {
        return this.allTab || {};
      }
      return this.filterTabs[this.curTabIndex] || {};
    },
    curTab() {
      return this.filterTabs[this.curTabIndex] || {};
    },
    curGame() {
      return this.games[this.curGameIndex] || {};
    },
    isLogin() {
      return !!this.user.userId;
    },
    isTryPlay() {
      return this.user.userType === UserTypes.TRY_PLAY;
    },
    showLoginGameTip() {
      return this.sysConfig["GAME_ACCOUNT_AUTO_TRANSFORM"] !== "0";
    },
  },
  watch: {
    platCode: {
      immediate: true,
      handler(platCode, oldPlatCode) {
        this.handlePlatCode();
        if (platCode && platCode !== oldPlatCode) {
          this.handleGames();
        }
      },
    },
    searchValue(value) {
      if (value) {
        const code = this.curTabIndex === -1 ? "all" : this.curTab.code;
        this.games =
          this.gamesMap[code] &&
          this.gamesMap[code].filter((game) => {
            return game.gameName.includes(value);
          });

        // 搜索全部游戏 跳过三方限制 保留旧代码,让页面及时给出回应
        queryGameSearch(value).then((res) => {
          //  判断接口返回时的 value 是否还是最新的
          if (this.searchValue === value) {
            this.games = res.data;
          }
        });
      } else {
        const code = this.curTabIndex === -1 ? "all" : this.curTab.code;
        if (this.gamesMap[code] && this.gamesMap[code].length) {
          this.games = this.gamesMap[code];
        }
      }
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((sysConfig) => {
      this.sysConfig = sysConfig;
      this.handleTabs();
    });
  },
  methods: {
    handlePlatCode() {
      if (this.tabs.length && this.platCode) {
        const index = this.tabs.findIndex((tab) => {
          return tab.code === this.platCode;
        });
        if (index !== -1) {
          if (this.allTab) {
            this.curTabIndex = index - 1;
          } else {
            this.curTabIndex = index;
          }
        }
      }
    },
    // 切换三方调用
    handleTabs() {
      queryTypePlatforms({ code: this.code }).then((res) => {
        if (res.data.code !== 0) {
          return;
        }
        this.tabs = res.data.data.list || [];
        if (!this.allTab) {
          this.curTabIndex = 0;
        }
        this.handlePlatCode();
        this.handleGames(this.allTab);
      });
    },
    handleGames(allGame = false) {
      const curTabCode = this.curTab.code;
      if (this.allTab && allGame && this.curTabIndex === -1) {
        return (this.games = this.gamesMap["all"] = this.allTab.children);
      }
      if (this.gamesMap[curTabCode]) {
        return (this.games = this.gamesMap[curTabCode]);
      }
      this.gameLoading = true;
      curTabCode &&
        queryPlatformGames({ code: curTabCode })
          .then((res) => {
            if (res.data.code !== 0) return;
            const list = res.data.data.list;
            this.gamesMap[curTabCode] = this.games = list;
            this.gameLoading = false;
          })
          .catch((e) => {
            this.gameLoading = false;
            console.log(e);
          });
    },
    // 切换三方下一级分类
    onTabChange(index) {
      this.curTabIndex = index;
      this.searchValue = "";
      this.handleGames(index === -1);
    },
    onGameClick(index) {
      if (this.isTryPlay) {
        return this.$Message.info(this.$tex("试玩账号不能使用该功能！"));
      }
      if (!this.isLogin) {
        return this.$router.push("/login");
      }
      this.curGameIndex = index;
      const hasLoginOtherGame = localStorage.getItem("hasLoginOtherGame");
      if (!hasLoginOtherGame && this.showLoginGameTip) {
        this.showConvertAmountTips = true;
        return localStorage.setItem("hasLoginOtherGame", "1");
      }
      this.loginGame();
    },
    onGameCancel() {
      this.curGameIndex = -1;
    },
    loginGame() {
      this.showConvertAmountTips = false;
      if (this.gameLoading) return;
      this.gameLoading = true;
      const curTabIndex = this.curTabIndex;
      loginGame({
        platformId: this.curGame.platformId,
        gameId: this.curGame.gameId,
      })
        .then((res) => {
          this.onGameCancel();
          this.gameLoading = false;
          if (res.data.code !== 0 || curTabIndex !== this.curTabIndex) return;
          let url = res.data.data.url;
          let html = res.data.data.html;
          this.$Modal.confirm({
            title: this.$tex("提示"),
            content: this.$tex("为更好的进行游戏娱乐，将为您打开新的窗口"),
            onOk: () => {
              if (url) {
                window.open(url, "_blank");
              } else {
                var newPage = window.open("", "_blank");
                newPage.document.open();
                newPage.document.write(html); //运行 HTML 代码
                newPage.document.close();
              }
            },
          });
        })
        .catch((e) => {
          console.log(e);
          this.onGameCancel();
          this.gameLoading = false;
        });
    },
    handleGameType() {
      queryGameListTypes({ code: this.code }).then((res) => {
        if (res.data.code !== 0) {
          return;
        }
        const list = res.data.data.list;
        if (list.length === 1) {
          this.gameType = list[0];
        }
      });
    },
  },
};
