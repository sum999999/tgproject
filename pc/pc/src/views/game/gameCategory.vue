<template>
  <ul
    class="base-nav container"
    v-show="$route.name === 'game'"
    style="width: 100%;"
  >
    <li
      v-for="(game, index) in gameList"
      :key="index"
      class="base-nav-item"
      :class="[
        game.code,
        $route.name === 'game' &&
          $route.params.id === game.code &&
          'base-nav-item--active',
      ]"
      @click="onGameClick(game)"
    >
      <div class="base-nav-item__content">
        <span class="base-nav-item__title">{{ game.typeName }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import { queryGameListTypes } from "@/api/game";
export default {
  name: "GameCategory",
  data() {
    return {
      gameList: [],
    };
  },
  methods: {
    onGameClick(game) {
      // if (game.code === "LOTTERY") {
      //   const { href } = this.$router.resolve({ name: "lottery" });
      //   window.open(href, "_blank");
      // } else {
      //   this.$router.push({ name: "game", params: { id: game.code } });
      // }
      if (game.code == this.$route.params.id) return;
      this.$router.push({ name: "game", params: { id: game.code } });
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
        } else {
          gameLists = gameLists.filter((menu) => {
            return menu.code !== "LOTTERY";
          });
        }
      } catch (e) {
        gameLists = [];
      }
      this.gameList = gameLists;
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((sysConfig) => {
      this.handleMenu(sysConfig);
    });
    // console.log("模板", this.$store.getters.pageTemplate);
  },
};
</script>

<style scoped lang="less">
.base-nav {
  display: flex;
  font-size: 19px;
  height: 40px;
  line-height: 50px;
  justify-content: center;
  top: 100px;
  justify-content: center;
  .base-nav-item {
    padding: 0 26px;
    cursor: pointer;
    color: gray;
    &--active,
    &:hover {
      // color: rgb(var(--tg-accent) e("/") var(--tg-text-opacity));
      //   color: @primary-color;
      color: #1f6efe;
    }
  }
}
</style>
