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
    <div class="nice-scroll game-scroll">
      <div class="game-list-wrap">
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
            :key="item.gameId"
          >
            <div class="inner">
              <div class="thumb clearfix">
                <img :src="item.gameIcon" alt="" />
              </div>
              <p class="dsc">{{ item.gameName }}</p>

              <div class="hover-show">
                <span class="go" @click="loginGame(item)">进入游戏</span>
              </div>
            </div>
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
        <!-- <div class="btn-wrap"> <Button type='primary'
                            >转换额度</Button></div> -->
      </div>
    </modal>
  </div>
</template>
<script>
import modal from "@/components/modal.vue";
import { UserTypes } from "@/constant/user";

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
  max-height: 880px;
  min-height: 400px;
  // overflow-y: auto;
  // overflow-x: hidden;
}
.game-list {
  margin: 0 -12px;
  padding: 40px;
  .game-list-item {
    cursor: pointer;
    padding-left: 12px;
    padding-right: 12px;
    width: 25%;
    float: left;
    margin-bottom: 10px;
    .inner {
      position: relative;
      border: 1px solid #3f4d67;
      border-radius: 5px;
      padding-bottom: 20px;
      margin: 20px;
      &:hover {
        border: 1px solid transparent;
        .hover-show {
          display: block;
        }
      }
    }
    .hover-show {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: none;
      background-color: rgba(34, 37, 54, 0.8);
      .go {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -17px;
        margin-left: -65px;
        text-align: center;
        background-color: #ed1459;
        width: 130px;
        height: 35px;
        line-height: 35px;
        color: #fff;
        border-radius: 5px;
      }
    }
    .thumb {
      height: 190px;
      line-height: 190px;
      text-align: center;
      img {
        // height: 100%;
        float: none;
        width: 150px;
        vertical-align: middle;
      }
    }
    .dsc {
      text-align: center;
      font-size: 14px;
      color: #fff;
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
  // overflow: scroll;
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

.nice-scroll::-webkit-scrollbar {
  /*滚动条两端的按钮，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置2）*/
  background: #3f4767;
  width: 6px;
  height: 0;
}
.nice-scroll::-webkit-scrollbar-track {
  /*外层轨道，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置3）*/
  background: #3f4767;
  border-radius: 3px;
}
.nice-scroll::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分（位置4）*/
  background: #3f4767;
  border-radius: 3px;
}
.nice-scroll::-webkit-scrollbar-thumb {
  /*滚动条里面可以拖动的那部分（位置5）*/
  background: #1f213b;
  border-radius: 3px;
}
.nice-scroll::-webkit-scrollbar-corner {
  /*边角（位置6）*/
  background: transparent;
}
.nice-scroll::-webkit-scrollbar-resizer {
  /*定义右下角拖动块的样式（位置7）*/
  background: #ff0bee;
}
</style>
