<template>
  <div
    v-parallax="'.game-video-info__img'"
    class="game-video"
  >
    <div class="container">
      <div class="game-video-info">
        <div class="game-video-info__l">
          <h1 class="text-title text-title--repeat-gradient">{{curTab.typeName}}</h1>
          <p class="text-title-secondary">{{content}}</p>
          <div
            v-if="showPlayNow"
            class="game-video-info__btn animate__animated animate__fast"
          >
            <h1
              class="text-title text-title--gradient"
              @click="onGameClick(0)"
            >
              <span v-if="curGameIndex === 0 && gameLoading">{{$tex("加载中")}}...</span>
              <span v-else>{{$tex("立即游戏")}}</span>
            </h1>
          </div>
          <ul
            v-else
            class="game-text-list"
          >
            <li
              v-for="(game, index) in games"
              :key="index"
              @click="onGameClick(index)"
            >
              <span v-if="curGameIndex === index && gameLoading">{{$tex("加载中")}}...</span>
              <span v-else>{{game.gameName}}</span>
            </li>
          </ul>
        </div>
        <div class="game-video-info__r">
          <img
            class="game-video-info__img"
            :src="curTab.pc4Icon"
            alt=""
          >
        </div>
      </div>
      <game-navs
        v-model="curTabIndex"
        :navs="tabs"
        light-icon-field="pc2Icon"
        night-icon-field="pc3Icon"
        label-field="typeName"
        @change="onTabChange"
      ></game-navs>
    </div>
    <game-amount-convert-dialog
      v-model="showConvertAmountTips"
      @login-game="loginGame"
      @cancel="onGameCancel"
    ></game-amount-convert-dialog>
  </div>
</template>

<script>
import GameNavs from './GameNavs'
import gameMixin from './gameMixin'

export default {
  name: 'GameVideo',
  mixins: [gameMixin],
  components: {
    GameNavs,
  },
  data() {
    return {
      curTabIndex: 0,
    }
  },
  computed: {
    title() {
      const game = this.games[0] || {
        gameName: '',
      }
      return game.gameName
    },
    content() {
      return this.gameType.content
    },
    showPlayNow() {
      return this.games.length === 1
    },
  },
  created() {
    this.handleGameType()
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.container {
  position: relative;
}
.game-video {
  background: url('~@/assets/images-v6/game/zhenrenbg.png') no-repeat center bottom;
  background-size: cover;
  position: relative;
}
.game-video-info {
  display: flex;
  .text-title-secondary {
    color: #ffffff;
    font-size: 20px;
  }
  .text-title {
    margin-bottom: 40px;
    font-size: 72px;
  }
}
.game-video-info__l {
  padding-top: 180px;
  text-align: center;
}
.game-video-info__r {
  padding-top: 30px;
  font-size: 0;
}
.game-video-info__l,
.game-video-info__r {
  flex: 1;
}
.game-video-info__btn {
  width: 340px;
  height: 80px;
  line-height: 80px;
  margin: 60px auto 342px;
  cursor: pointer;
  background: url('~@/assets/images-v6/game/zhenrenbtn.png') no-repeat center center;
  background-size: 100% 100%;
  &:hover {
    animation-name: pulse;
    animation-timing-function: ease-in-out;
  }
  .text-title {
    font-size: 32px;
  }
}
.game-video-info__img {
  width: 100%;
  height: 870px;
  object-fit: contain;
  float: none;
}
.game-navs {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 60px;
  @{deep} {
    .game-navs-item__content {
      background: url('~@/assets/images-v6/game/btn2.png') no-repeat center center;
      background-size: contain;
    }
  }
}
.game-text-list {
  display: flex;
  flex-wrap: wrap;
  color: #ffffff;
  margin: 60px auto 326px;
  justify-content: center;
  li {
    margin: 0 5px 5px 5px;
    cursor: pointer;
    &:hover {
      color: #ddc17c;
    }
  }
}
</style>
