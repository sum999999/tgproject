<template>
  <div class="home">
    <banner></banner>
    <home-notice class="container" />
    <!-- <home-collection /> -->
    <!-- 热门游戏 -->
    <home-hot-games />
    <!-- APP下载 -->
    <home-download class="container "></home-download>
    <!-- 最佳支持 -->
    <home-quick class="mt-20 pb-40" />

    <!-- <home-board code="POKER"></home-board>
    <home-reality></home-reality>
    <home-lottery></home-lottery>
    <home-game-theme></home-game-theme>
    <home-download></home-download> -->
  </div>
</template>

<script>
import Banner from "./components/Banner";
import HomeNotice from "./components/HomeNotice";
import HomeCollection from "./components/HomeCollection";
import HomeHotGames from "./components/HomeHotGames";
import HomeQuick from "./components/HomeQuick";
import HomeSlots from "./components/HomeSlots";
import HomeBoard from "./components/HomeBoard";
import HomeReality from "./components/HomeReality";
import HomeLottery from "./components/HomeLottery";
import HomeGameTheme from "./components/HomeGameTheme";
import HomeDownload from "./components/HomeDownload";

export default {
  name: "home",
  components: {
    Banner,
    HomeNotice,
    HomeCollection,
    HomeHotGames,
    HomeQuick,
    HomeSlots,
    HomeBoard,
    HomeReality,
    HomeLottery,
    HomeGameTheme,
    HomeDownload,
  },
};
</script>

<style scoped lang="less">
.home {
  position: relative;
}
.home-banner {
  margin-bottom: 20px;
}
</style>
