<template>
  <div class="game-list-layout">
    <ul
      class="tab-type clearfix"
      v-if="dataList.length > 1 && dataList[0].gameList"
    >
      <li
        class="tab-type-item"
        :class="{ active: index == curTypeIndex }"
        @click="onTypeItemClick(index)"
        v-for="(item, index) in dataList"
        :key="index.gameCode"
      >
        {{ item.gameName }}
      </li>
    </ul>
    <div class="rq-nice-scroll game-scroll">
      <div
        class="game-list-wrap"
        :class="{ video: code.includes('VIDEO') || code.includes('BALL') }"
      >
        <ul
          class="game-list clearfix"
          :class="{
            'game-list-2':
              dataList[curTypeIndex] &&
              dataList[curTypeIndex].gameCode == 'video',
          }"
          v-if="gameList.length"
        >
          <li
            class="game-list-item"
            v-for="item in gameList"
            @click="loginGame(item)"
            :key="item.gameId"
          >
            <div
              class="thumb clearfix"
              :style="`background-image:url(${item.gameIcon})`"
            >
              <!-- <img
                :src="item.gameIcon"
                alt=""
              > -->
            </div>
            <p class="dsc">{{ item.gameName }}</p>
          </li>
        </ul>
        <div class="ui-empty" v-else>
          暂无数据
        </div>
      </div>
    </div>
    <!-- 登录游戏前的自动转换提示 -->
    <modal
      :modalShow="gameMoneyTipShow"
      title="棋牌游戏"
      claName="login-game-dlg-wrap"
      width="380"
      @btn-cancel="gameMoneyTipShow = false"
      @btn-ok="goGameLogin"
    >
      <div slot="content" class="gameTipDlg">
        <p>
          首次进入游戏，系统将自动为您进行钱包额度转换，详情请前往钱包查看。
        </p>
      </div>
    </modal>
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
    code: {
      type: String,
      default: "",
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      curTypeIndex: 0,
      gameList: [],
      cacheGameList: [], //缓存游戏列
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
      // if (Array.isArray(this.dataList) && this.dataList.length > 0) {
      //   this.curTypeIndex = this.dataList.findIndex(item => item.hotGame == '1')
      //   this.curTypeIndex = this.curTypeIndex >= 0 ? this.curTypeIndex : 0;
      //   this.initGameList()
      // }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    /**
     * 本地搜索
     */
    localSearch(gameName) {
      if (!gameName) {
        this.gameList = JSON.parse(JSON.stringify(this.cacheGameList));
        return;
      }
      let lowerName = this.wordToLowerCase(gameName);
      this.gameList = JSON.parse(
        JSON.stringify(
          this.cacheGameList.filter((item) =>
            this.wordToLowerCase(item.gameName).includes(lowerName)
          )
        )
      );
    },
    wordToLowerCase(char) {
      //大写转小写
      return char.replace(/[A-Z]/g, (match) => {
        return match.toLowerCase();
      });
    },
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
        this.cacheGameList = [];
      }
    },
    initGameList() {
      let gameListInfo = this.dataList[this.curTypeIndex];
      if (gameListInfo && gameListInfo.gameList) {
        this.gameList = gameListInfo.gameList;
        this.cacheGameList = JSON.parse(JSON.stringify(gameListInfo.gameList));
      } else {
        this.gameList = this.dataList;
        this.cacheGameList = JSON.parse(JSON.stringify(this.dataList));
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

      // if (this.loading) { // 2019.5.31
      //   event.preventDefault();
      //   return;
      // }
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
      // debugger;
      // this.loading = true;
      // this.$http
      //   .post(
      //     "/party/v2/game/loginGame",
      //     { platformId: info.platformId, gameId: info.gameId },
      //     { userId: true, unenc: true }
      //   )
      //   .then(res => {
      //     this.loading = false;
      //     if (res.data.code !== 0) return;
      //     let url = res.data.data.url;
      //     this.$Modal.confirm({
      //       title: "提示",
      //       content: "为更好的进行游戏娱乐，将为您打开新的窗口",
      //       onOk: () => {
      //         if (url) {
      //           window.open(url, "_blank");
      //         }
      //       }
      //     });
      //   });
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
<style scoped lang="less">
@deep: ~">>>";
.game-list-layout {
  background-color: #ffffff;
  border-radius: 10px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  padding-right: 4px;
}
.tab-type {
  padding: 24px 40px;
  min-height: 32px;
  .tab-type-item {
    cursor: pointer;
    width: 100px;
    display: block;
    height: 32px;
    float: left;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    border-radius: 20px;
  }
  .tab-type-item.active {
    /*    background-color: #be1204; */
    color: #fff;
  }
}
.game-list-wrap {
  min-height: 770px;
  max-height: 880px;
  // min-height: 400px;
  padding: 0 40px 20px 40px;
  // overflow-y: auto;
  // overflow-x: hidden;
  &.video {
    padding-left: 25px;
    padding-right: 25px;
    .game-list {
      width: 1120px;
      .game-list-item {
        margin-left: 30px;
        margin-right: 30px;
        .thumb {
          width: 220px;
          height: 142px;
          margin-bottom: 20px;
          background-size: 150px auto;
        }
      }
    }
  }
}
.game-list {
  // margin: 0 -12px;
  width: 1090px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  // padding: 0 40px;
  .game-list-item {
    // width: 20%;
    cursor: pointer;
    // padding-left: 12px;
    // padding-right: 12px;
    // width: 190px;
    // width: 20%;
    float: left;
    height: 210px;
    margin: 20px 14px 20px 14px;
    border-radius: 5px;
    // margin-bottom: 10px;
    .thumb {
      width: 190px;
      height: 128px;
      margin-top: 15px;
      margin-bottom: 28px;
      // line-height: 190px;
      background-repeat: no-repeat;
      background-size: 124px auto;
      background-position: center;
      text-align: center;
      overflow: hidden;
      // img {
      //   // height: 100%;
      //   display: block;
      //   float: none;
      //   width: 100%;
      //   height: 100%;
      //   // vertical-align: middle;
      // }
    }
    .dsc {
      text-align: center;
      color: #898989;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
.game-list-2 {
  .game-list-item {
    width: 33.333%;
    .thumb {
      height: 180px;
      line-height: 180px;
      img {
        width: auto;
        height: 146px;
      }
    }
  }
}
.game-scroll {
  max-height: 800px;
  overflow: auto;
  @{deep} .ivu-scroll-container {
    overflow-x: hidden;
  }
  @{deep} .ivu-scroll-content:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  @{deep} .ivu-scroll-content:before,
  @{deep} .ivu-scroll-content:after {
    box-sizing: border-box;
  }
  @{deep} .ivu-scroll-content + .ivu-scroll-loader {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
  }
}
</style>
