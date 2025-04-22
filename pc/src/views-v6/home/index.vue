<template>
    <div class="home">
        <banner></banner>
        <home-board code="POKER"></home-board>
        <home-reality></home-reality>
        <home-lottery></home-lottery>
        <home-game-theme></home-game-theme>
        <home-download></home-download>
    </div>
</template>

<script>
    import Banner from "./components/Banner";
    import HomeBoard from "./components/HomeBoard";
    import HomeReality from "./components/HomeReality";
    import HomeLottery from "./components/HomeLottery";
    import HomeGameTheme from "./components/HomeGameTheme";
    import HomeDownload from "./components/HomeDownload";

  export default {
    name: "home",
    components: {
      Banner,
      HomeBoard,
      HomeReality,
      HomeLottery,
      HomeGameTheme,
      HomeDownload
    }
  }
</script>

<style scoped>

</style>
