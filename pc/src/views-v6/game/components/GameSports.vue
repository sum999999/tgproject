<template>
  <div
    v-parallax="'.game-sports-header__img'"
    class="game-sports-wrap"
  >
    <div class="game-sports-wrap-flash"></div>
    <img
      class="game-sports-wrap-flash1"
      src="~@/assets/images-v6/game/shandianl.png"
      alt=""
    >
    <img
      class="game-sports-wrap-flash2"
      src="~@/assets/images-v6/game/shandianr.png"
      alt=""
    >
    <div class="container">
      <div class="game-sports-header">
        <div class="game-sports-header__l">
          <img
            class="game-sports-header__img"
            :src="curTab.pc4Icon"
            alt=""
          >
        </div>
        <div class="game-sports-header__r">
          <h1 class="text-title text-title--gradient game-sports-header__title">{{title}}</h1>
          <p class="game-sports-header__dsc">{{content}}</p>
          <div
            v-if="showPlayNow"
            class="game-sports-header__btn animate__animated animate__fast"
          >
            <h1
              class="text-title text-title--gradient"
              @click="onGameClick(0)"
            >
              <span v-if="curGameIndex === 0 && gameLoading">{{$tex("加载中")}}...</span>
              <span v-else>{{$tex("立即游戏")}}</span>
            </h1>
          </div>
        </div>
      </div>
      <game-sports-tabs
        v-show="tabs.length"
        v-model="curTabIndex"
        :tabs="tabs"
        light-icon-field="pc6Icon"
        night-icon-field="pc5Icon"
        light-bg-icon-field="pc3Icon"
        night-bg-icon-field="pc2Icon"
        label-field="typeName"
        @change="onTabChange"
      >
      </game-sports-tabs>
      <game-list
        class="game-list-wrap-sport"
        :tab="curAllTab"
        :games="games"
        :loading="gameLoading"
        @game-click="onGameClick"
      ></game-list>
    </div>
  </div>
</template>

<script>
import GameSportsTabs from './GameSportsTabs'
import gameMixin from './gameMixin'

export default {
  name: 'GameSports',
  mixins: [gameMixin],
  components: {
    GameSportsTabs,
  },
  computed: {
    title() {
      return this.curTab.typeName
    },
    content() {
      return this.gameType.content
    },
    showPlayNow() {
      return this.games.length
    },
  },
  created() {
    this.handleGameType()
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.game-sports-wrap {
  position: relative;
}
.game-sports-wrap,
.game-sports-wrap-flash {
  background: url('~@/assets/images-v6/game/dianjingbg.png') no-repeat center top;
}
.game-sports-wrap-flash1,
.game-sports-wrap-flash2 {
  position: absolute;
  z-index: 3;
  float: none;
  filter: brightness(3);
  opacity: 0;
  animation: flash ease-out 4s infinite;
  animation-delay: 2s;
}
.game-sports-wrap-flash1 {
  width: 282px;
  right: 0;
  top: 755px;
}
.game-sports-wrap-flash2 {
  width: 293px;
  left: 0;
  top: 800px;
}
@keyframes flash {
  from {
    opacity: 0;
  }
  92% {
    opacity: 0;
  }
  93% {
    opacity: 0.6;
  }
  94% {
    opacity: 0.2;
  }
  96% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.game-sports-wrap-flash {
  position: absolute;
  top: 0;
  z-index: 1;
  animation: flash ease-out 4s infinite;
  animation-delay: 2s;
  width: 100%;
  height: 100%;
  filter: brightness(3);
  opacity: 0;
}
.container {
  position: relative;
  z-index: 2;
}
.game-sports-header {
  display: flex;
}
.game-sports-header__l,
.game-sports-header__r {
  flex: 1;
  text-align: center;
  position: relative;
  padding: 200px 0;
  min-height: 792px;
}
.game-sports-header__img {
  height: 650px;
  width: 991px;
  object-fit: contain;
  position: absolute;
  left: -230px;
  top: 30px;
}
.game-sports-header__title {
  font-size: 72px;
  line-height: 1;
}
.game-sports-header__dsc {
  margin-top: 40px;
  color: #ffffff;
  padding: 0 70px;
  font-size: 20px;
}
.game-sports-header__btn {
  width: 360px;
  height: 112.5px;
  line-height: 112.5px;
  overflow: hidden;
  text-align: center;
  background: url('~@/assets/images-v6/game/lijiyouxi.png') no-repeat center center;
  background-size: 100% 100%;
  cursor: pointer;
  margin: 60px auto 0;
  &:hover {
    animation-name: pulse;
    animation-timing-function: ease-in-out;
  }
  .text-title {
    font-size: 32px;
  }
}
.game-sports-tabs {
  padding-bottom: 40px;
}
.game-list-wrap.game-list-wrap-sport {
  margin: -10px 36px 0 46px;
  @{deep} {
    .game-list {
      margin-top: 0;
    }
    .game-list-item__content {
      background-color: #171717;
      border: none;
      border-radius: 4px;
    }
  }
}
</style>
