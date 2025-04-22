<template>
  <div class="game-list-item" @click="route && onPlayClick()">
    <div
      class="game-list-item__img"
      :style="
        panel &&
          `background-image: linear-gradient(90deg, #b8c8f5 0%, #f8faff 100%, #e7ecff 200%, #f8faff 300%, #b8c8f5 400%);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);`
      "
    >
      <img
        :src="icon"
        :style="{
          width: size,
          height: size,
          background: panel && `#ffffff`,
        }"
      />
      <div
        v-if="!route"
        class="game-list-item__mask"
        :style="{
          width: size,
          height: size,
        }"
      ></div>
      <div
        v-if="!route"
        class="game-list-item__mask2"
        :style="{
          width: size,
          height: size,
        }"
      >
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
    showLoginGameTip: {
      type: Boolean,
    },
    platfromCode: {
      type: String,
    },
    code: {
      type: String,
    },
    route: {
      type: Boolean,
    },
    size: {
      type: String,
      default: "128px",
    },
    panel: {
      type: Boolean,
    },
  },
  data() {
    return {
      showConvertAmountTips: false,
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
    onPlayClick() {
      if (this.platfromCode === "LOTTERY") {
        this.$router.push(`/lottery?fromHomeCode=${this.platformId}`);
        return;
      }
      if (this.route) {
        this.$router.push(`/game/${this.code}`);
      }
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
    color: rgb(var(--tg-text-primary));
    .game-list-item__img > .game-list-item__mask {
      display: block;
    }
    .game-list-item__img > .game-list-item__mask2 {
      display: flex;
    }
  }
  &__img {
    position: relative;
    border-radius: 20px;
    padding-bottom: 4px;
    > img:nth-child(1) {
      object-fit: cover;
      border-radius: 20px;
      padding-bottom: 2px;
    }
    > .game-list-item__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.7;
      background-image: linear-gradient(180deg, #030000 0%, #030000 100%);
      display: none;
      border-radius: 20px;
      top: 0;
    }
    > .game-list-item__mask2 {
      position: absolute;
      width: 100%;
      height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      top: 0;
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
