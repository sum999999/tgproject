<template>
  <div class="home">
    <img
      class="home__bg"
      src="~@/assets/images-v8/home/bg.png"
    >
    <div class="container">
      <banner></banner>
      <home-notice />
      <!-- <home-collection /> -->
      <home-hot-games />
      <home-quick />
      <home-slots
        code="slot"
        plat-code="slot"
      />
      <!-- <home-board code="POKER"></home-board>
      <home-reality></home-reality>
      <home-lottery></home-lottery>
      <home-game-theme></home-game-theme>
      <home-download></home-download> -->
    </div>
  </div>
</template>

<script>
import Banner from './components/Banner'
import HomeNotice from './components/HomeNotice'
import HomeCollection from './components/HomeCollection'
import HomeHotGames from './components/HomeHotGames'
import HomeQuick from './components/HomeQuick'
import HomeSlots from './components/HomeSlots'
import HomeBoard from './components/HomeBoard'
import HomeReality from './components/HomeReality'
import HomeLottery from './components/HomeLottery'
import HomeGameTheme from './components/HomeGameTheme'
import HomeDownload from './components/HomeDownload'

export default {
  name: 'home',
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
}
</script>

<style scoped lang="less">
.home {
  color: #ffffff;
  position: relative;
  .home__bg {
    position: absolute;
    width: 100%;
    height: 1360px;
    z-index: -1;
    object-position: 50% -20px;
  }
  > .container {
    background: #212121;
    padding-bottom: 78px;
  }
}
.home-notice {
  margin-top: 10px;
}
</style>
