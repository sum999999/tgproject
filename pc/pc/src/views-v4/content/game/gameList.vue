<template>
  <div class="game-list nice-scroll">
    <ul>
      <li v-for="item in gameList" :key="item.gameId">
        <div class="game-card">
          <img :src="item.gameIcon" alt="" class="games-img" />
          <div class="game-card-bottom">
            <p class="games-name">{{ item.gameName }}</p>
            <span class="games-enter" @click="loginGame(item)">进入游戏</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { UserTypes } from "@/constant/user";

import modal from "@/components/modal.vue";

export default {
  name: "gameList",
  props: {
    dataList: {
      type: Array,
      default: [],
    },
    showLoginGameTip: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      value: "",
      curTypeIndex: 0,
      gameList: [],
      loading: false,
      gameMoneyTipShow: false, //登录前的
      currLoginGameInfo: {}, //准备登录的游戏
    };
  },
  created() {
    this.changeGameList();
  },
  watch: {
    dataList(n) {
      this.changeGameList();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    onTypeItemClick(index) {
      this.curTypeIndex = index;
      this.initGameList();
    },
    changeGameList() {
      if (Array.isArray(this.dataList) && this.dataList.length > 0) {
        this.curTypeIndex = this.dataList.findIndex(
          (item) => item.hotGame == "1"
        );
        this.curTypeIndex = this.curTypeIndex >= 0 ? this.curTypeIndex : 0;
        this.initGameList();
      } else {
        this.gameList = [];
      }
    },
    initGameList() {
      let gameListInfo = this.dataList[this.curTypeIndex];
      if (gameListInfo && gameListInfo.gameList) {
        this.gameList = gameListInfo.gameList;
      } else {
        this.gameList = this.dataList;
      }
    },
    loginGame(info) {
      if (this.user.userType === UserTypes.TRY_PLAY) {
        // 试玩账号
        this.$Message.info("试玩账号不能使用该功能！");
        return;
      }
      if (!this.user.userCode) {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>您还未登入！去登录？</p>",
          onOk: () => {
            this.$router.push("/login");
          },
        });
        return;
      }
      this.currLoginGameInfo = info;
      let hasLoginOtherGame = localStorage.getItem("hasLoginOtherGame");
      // let hasLoginOtherGame = localStorage.getItem('hasLoginOtherGame') === '1' ? true: false;
      if (!hasLoginOtherGame && this.showLoginGameTip) {
        //开启显示登陆游戏的额度转换提示并且是第一个登陆
        this.gameMoneyTipShow = true;
        localStorage.setItem("hasLoginOtherGame", "1");
        return;
      }
      // this.gameMoneyTipShow = true;
      this.goGameLogin();
    },
    goGameLogin() {
      //去登陆游戏
      this.gameMoneyTipShow = false;
      if (this.loading) return;
      let info = this.currLoginGameInfo;
      this.loading = true;
      this.$emit("toggle-loading", this.loading);
      this.$http
        .post(
          "/party/v2/game/loginGame",
          { platformId: info.platformId, gameId: info.gameId },
          { userId: true, unenc: true }
        )
        .then((res) => {
          this.loading = false;
          this.$emit("toggle-loading", this.loading);
          if (res.data.code !== 0) return;
          let url = res.data.data.url;
          let html = res.data.data.html;
          // console.log(url);
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
        });
    },
  },
};
</script>
<style lang="less" scoped>
.game-list {
  width: 1220px;
  height: 980px;
  overflow: auto;
  position: absolute;
  top: 28px;
}
.game-list > ul {
  margin-right: -25px;
}
.game-list > ul > li {
  float: left;
  margin-right: 25px;
  margin-bottom: 26px;
  cursor: pointer;
  & > .game-card {
    position: relative;
    width: 220px;
    height: 300px;
    border-radius: 10px;
    background-color: #fff;
    text-align: center;
    padding-top: 35px;
    & > .game-card-bottom {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 13px;
    }
    img {
      width: 150px;
      margin: auto;
      float: initial;
      position: absolute;
      top: -57px;
      bottom: 0;
      left: 0;
      right: 0;
    }
    p {
      text-align: center;
      font-size: 16px;
      line-height: 16px;
      color: #343434;
    }
    .games-enter {
      margin-top: 8px;
      display: inline-block;
      width: 90px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      border-radius: 15px;
      background-color: #3489ff;
    }
  }
}
</style>
