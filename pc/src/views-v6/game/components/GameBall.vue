<template>
  <div class="game-ball">
    <div class="container">
      <div class="game-ball-info">
        <div class="game-ball-info__l">
          <h1 class="text-title text-title--repeat-gradient">{{title}}</h1>
          <p class="text-title-secondary">{{content}}</p>
          <div
            v-if="showPlayNow"
            class="game-ball-info__btn  animate__animated animate__fast"
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
        <div class="game-ball-info__r">
          <img
            class="game-ball-info__img animate__animated animate__pulse animate__headShake animate__infinite"
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
  name: 'GameBall',
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
.container {
  position: relative;
  z-index: 1;
}
.game-ball {
  background: url('~@/assets/images-v6/game/tiyubg.png') no-repeat center bottom;
  background-size: cover;
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 342px;
    background: url('~@/assets/images-v6/game/renwu_zhezhao.png') no-repeat center bottom;
  }
}
.game-ball-info {
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
.game-ball-info__l {
  padding-top: 180px;
  text-align: center;
}
.game-ball-info__r {
  padding-top: 90px;
  font-size: 0;
}
.game-ball-info__l,
.game-ball-info__r {
  flex: 1;
}
.game-ball-info__btn {
  width: 340px;
  height: 80px;
  line-height: 80px;
  border: 1px solid #a6833f;
  background-color: rgba(20, 41, 65, 0.8);
  margin: 60px auto;
  cursor: pointer;
  &:hover {
    animation-name: pulse;
    animation-timing-function: ease-in-out;
  }
  .text-title {
    font-size: 32px;
  }
}
.game-ball-info__img {
  width: 100%;
  height: 620px;
  object-fit: contain;
  float: none;
}
.game-navs {
  padding-bottom: 60px;
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
