<template>
  <div class="card-contaner">
    <div class="w  clearfix">
      <ul class="game-card clearfix">
        <li
          v-for="(item, index) in gameList"
          :key="index"
          @click="$router.push(`/game/${item.code}`)"
        >
          <div class="img-wrap">
            <img class="img" :src="item.pcicon" alt="" />
          </div>

          <div class="name">
            <p class="cn" v-html="escapeHtml(item.typeName)"></p>
            <p class="en" v-html="escapeHtml(item.typeEnName)"></p>
          </div>
        </li>
      </ul>
      <ul class="game-vCard">
        <li
          v-for="(item, index) in vData"
          :key="index"
          @click="loginGame(item)"
        >
          <img class="img" :src="item.gameIcon" alt="" />
        </li>
      </ul>
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
import { mapGetters } from "vuex";
import util from "@/utils/utils";
import { UserTypes } from "@/constant/user";

export default {
  props: {
    gameList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      vData: [],
      showLoginGameTip: false,
      gameMoneyTipShow: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  async created() {
    this.$http
      .post("/party/v2/game/queryGameSearch", { code: null }, { unenc: true })
      .then((res) => {
        const { data, code } = res.data;
        if (code !== 0) return;
        const { list } = data;
        for (const item of list) {
          if (item.platformsRsps.length > 0 && this.vData.length <= 3) {
            this.vData.push(item.platformsRsps[0]);
          }
        }
      });
    const sysData = await this.$store.dispatch("querySystemConfig");
    this.showLoginGameTip =
      sysData["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
  },
  methods: {
    escapeHtml(str) {
      if (str) {
        return util.escapeHtml(str);
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
      if (!hasLoginOtherGame && this.showLoginGameTip) {
        //开启显示登陆游戏的额度转换提示并且是第一个登陆
        this.gameMoneyTipShow = true;
        localStorage.setItem("hasLoginOtherGame", "1");
        return;
      }
      this.goGameLogin();
    },
    goGameLogin() {
      //去登陆游戏
      this.gameMoneyTipShow = false;
      if (this.loading) return;
      this.loading = true;
      let info = this.currLoginGameInfo;
      this.$http
        .post(
          "/party/v2/game/loginGame",
          { platformId: info.platformId, gameId: info.gameId },
          { userId: true, unenc: true }
        )
        .then((res) => {
          this.loading = false;
          if (res.data.code !== 0) return;
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
        });
    },
  },
};
</script>

<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";
.card-contaner {
  background: url("@{imgSrc}/index-card-bg.png");
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 300px;
  padding-top: 100px;
  padding-bottom: 339px;
}
.game-card {
  width: 850px;
  float: left;
  & > li {
    float: left;
    width: 240px;
    margin-right: 60px;
    margin-bottom: 20px;
    cursor: pointer;
    .img-wrap {
      position: relative;
      margin-bottom: 15px;
      &::before {
        content: "";
        position: absolute;
        border-radius: 10px;
        left: 0;
        top: 0;
        width: 100%;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
      }
      &:hover {
        &::before {
          display: none;
        }
      }
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    .img {
      width: 100%;
      height: 360px;
      float: none;
      display: block;
    }
    .name {
      color: #fff;
      .cn {
        font-size: 20px;
      }
      .en {
        font-size: 12px;
      }
    }
  }
}
.game-vCard {
  float: left;
  width: 300px;
  margin-left: 30px;
  li {
    cursor: pointer;
    position: relative;
    width: 300px;
    height: 200px;
    margin-bottom: 20px;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
      border-radius: 10px;
    }
    &:hover {
      &::before {
        display: none;
      }
    }
  }
  .img {
    max-width: 300px;
    max-height: 200px;
    min-width: 200px;
    width: auto;
    float: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>
