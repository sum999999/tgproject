<template>
  <div>
    <component :is="view"></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const game = () => import(/* webpackChunkName: "game" */ "@/views/game/game");
const game2 = () =>
  import(/* webpackChunkName: "game2" */ "@/views-v2/content/game/game");
const game3 = () =>
  import(/* webpackChunkName: "game3" */ "@/views-v3/content/game/game");
const game4 = () =>
  import(/* webpackChunkName: "game4" */ "@/views-v4/content/game/game");
const game5 = () =>
  import(/* webpackChunkName: "game5" */ "@/views-v5/game/game");
const game6 = () => import(/* webpackChunkName: "game6" */ "@/views-v6/game");
const game7 = game3;
const game8 = () => import(/* webpackChunkName: "game8" */ "@/views-v8/game");
const game9 = game8;
const game10 = () =>
  import(/* webpackChunkName: "game10" */ "@/views-v10/game");
const game11 = game10;

export default {
  components: {
    game,
    game2,
    game3,
    game4,
    game5,
    game6,
    game7,
    game8,
    game9,
    game10,
    game11,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["pageTemplate"]),
    view() {
      let verseion = this.pageTemplate.index || "";
      return "game" + verseion;
    },
  },
  created() {},
};
</script>

<style lang="less"></style>
