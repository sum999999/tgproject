<template>
  <div class="game-list-item">
    <div class="game-list-item__img">
      <img :src="icon" />
      <div class="game-list-item__mask"></div>
      <div class="game-list-item__mask2">
        <div class="game-list-item__collect" @click="onCollectClick">
          <img src="~@/assets/images-v8/home/collect.png" />
          <img src="~@/assets/images-v8/home/collect-active.png" />
        </div>
        <Button
          class="game-list-item__play"
          shape="circle"
          @click="onPlayClick()"
          >{{ $tex("立即游戏") }}</Button
        >
      </div>
    </div>
    <span>{{ name }}</span>
    <game-amount-convert-dialog
      v-model="showConvertAmountTips"
      @login-game="loginGame"
    ></game-amount-convert-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GameAmountConvertDialog from "@/views-v8/game/components/GameAmountConvertDialog.vue";
import { loginGame } from "@/api/game";
import { UserTypes } from "@/constant/user";

export default {
  name: "GameItem",
  components: {
    GameAmountConvertDialog,
  },
  props: {
    name: {
      type: String,
    },
    icon: {
      type: String,
    },
    platformId: { type: String },
    gameId: { type: String },
    platformCode: { type: String },
    userFavoritesId: { type: [String, Number] },
    showLoginGameTip: {
      type: Boolean,
    },
  },
  data() {
    return {
      showConvertAmountTips: false,
      collected: true,
      gameLoading: false,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    isLogin() {
      return !!this.user.userId;
    },
    isTryPlay() {
      return this.user.userType === UserTypes.TRY_PLAY;
    },
  },
  methods: {
    saveFavoritesList() {
      this.$store
        .dispatch("saveFavoritesList", {
          userId: this.user.userId,
          parentId: 0,
          linkName: this.name,
          link: `${this.platformId},${this.gameId},${this.platformCode}`,
          linkIcon: this.icon,
          sort: "",
          productType: "1",
        })
        .then((res) => {
          this.$Message.success(this.$tex("收藏成功"));
        });
    },
    deleteFavoritesList() {
      if (this.deleteLoading) return;
      this.deleteLoading = true;
      this.$store
        .dispatch("deleteFavoritesList", {
          userFavoritesId: this.userFavoritesId,
        })
        .then((response) => {
          this.deleteLoading = false;
          if (response.data.code !== 0) return;
          this.collected = false;
        })
        .catch((e) => {
          this.deleteLoading = false;
        });
    },
    trueOnRestricted() {
      if (this.isTryPlay) {
        this.$Message.info(this.$tex("试玩账号不能使用该功能！"));
        return true;
      }
      if (!this.isLogin) {
        this.$router.push("/login");
        return true;
      }
    },
    onCollectClick() {
      if (this.trueOnRestricted()) {
        return false;
      }
      if (this.userFavoritesId && this.collected) {
        this.deleteFavoritesList();
      } else {
        this.saveFavoritesList();
      }
    },
    onPlayClick() {
      if (this.trueOnRestricted()) {
        return false;
      }
      if (this.showLoginGameTip) {
        this.showConvertAmountTips = true;
        return;
      }
      this.loginGame();
    },
    loginGame() {
      this.showConvertAmountTips = false;
      if (this.gameLoading) return;
      this.gameLoading = true;
      loginGame({
        platformId: this.platformId,
        gameId: this.gameId,
      })
        .then((res) => {
          this.gameLoading = false;
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
        })
        .catch((e) => {
          this.gameLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.game-list-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  span {
    margin-top: 15px;
  }
  &:hover {
    color: #ffd427;
    .game-list-item__img > .game-list-item__mask {
      display: block;
    }
    .game-list-item__img > .game-list-item__mask2 {
      display: flex;
    }
  }
  &__img {
    position: relative;

    > img:nth-child(1) {
      width: 150px;
      height: 150px;
      border-radius: 20px;
      object-fit: cover;
    }
    > .game-list-item__mask {
      position: absolute;
      width: 150px;
      height: 150px;
      background-image: linear-gradient(to bottom, #f7d139, #efbe16);
      display: none;
      opacity: 0.5;
      border-radius: 20px;
      top: 0;
    }
    > .game-list-item__mask2 {
      position: absolute;
      width: 150px;
      height: 150px;
      display: none;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      border: 1px solid #efbe16;
      box-shadow: 0 0px 24px 6px rgba(255, 210, 0, 0.1);
      top: 0;
    }
  }
  &__collect {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 32px;
    height: 32px;
    > img {
      position: absolute;
      width: 100%;
      height: 100%;
      float: none;
    }
    > img:nth-child(1) {
      opacity: 1;
    }
    > img:nth-child(2) {
      opacity: 0;
    }
    &:hover {
      > img:nth-child(1) {
        opacity: 0;
      }
      > img:nth-child(2) {
        opacity: 1;
      }
    }
  }
  &__play {
    background: #212121;
    border: 1px solid #ffffff;
    color: #ffffff;
    &:hover {
      background-color: #0f1f2f;
    }
  }
}
</style>
