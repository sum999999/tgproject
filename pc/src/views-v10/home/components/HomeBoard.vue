<template>
  <div class="home-board-wrap">
    <div class="container">
      <h1 class="text-title text-title--gradient animate__animated animate__delay-600ms">{{$tex("棋牌游戏")}}</h1>
      <p class="text-title-secondary animate__animated animate__delay-600ms">{{$tex("真实的赌场环境、稳定的高端设备、专业的技术支持，给予玩家仿佛置身于现场的绝妙体验，随时可尽情享受游戏乐趣。")}}</p>
      <div class="home-board">
        <img
          class="home-board-xiongmao"
          src="~@/assets/images-v6/home/xiongmao.png"
          alt=""
        >
        <img
          class="home-board-meinv"
          src="~@/assets/images-v6/home/qpmeinu.png"
          alt=""
        >
        <home-board-menu
          v-model="curTabIndex"
          :menus="tabs"
          light-icon-field="pc4Icon"
          night-icon-field="pc5Icon"
          label-field="typeName"
          @change="onTabChange"
        ></home-board-menu>
        <div class="home-board-grid-wrap">
          <ul class="home-board-grid">
            <li
              v-for="(game, index) in limitGames"
              :key="game.gameId"
              class="home-board-grid-item"
              @click="onGameClick(index)"
            >
              <div class="home-board-grid-item__content">
                <img
                  class="home-board-grid-item__icon"
                  :src="game.gameIcon"
                  alt=""
                >
                <span class="home-board-grid-item__title">{{game.gameName}}</span>
              </div>
            </li>
          </ul>
          <Spin
            v-if="gameLoading"
            class="ivu-spin--dark"
            fix
          ></Spin>
          <span
            v-if="tipsText"
            class="glitch"
            :data-text="tipsText"
          >{{tipsText}}</span>
        </div>
      </div>
      <game-amount-convert-dialog
        v-model="showConvertAmountTips"
        @login-game="loginGame"
        @cancel="onGameCancel"
      ></game-amount-convert-dialog>
    </div>
  </div>
</template>

<script>
import HomeBoardMenu from './HomeBoardMenu'
import gameMixin from '@/views-v6/game/components/gameMixin'
import ScrollReveal from 'scrollreveal'

export default {
  name: 'HomeBoard',
  mixins: [gameMixin],
  components: { HomeBoardMenu },
  computed: {
    limitGames() {
      return this.games.slice(0, 10)
    },
    tipsText() {
      if (this.gameLoading) {
        return false
      }
      if (this.curAllTab.platformStatus === '2') {
        return this.$tex('即将上线')
      } else if (this.curAllTab.platformStatus === '3') {
        return this.$tex('维护中')
      } else if (!this.limitGames.length) {
        return this.$tex('暂无数据')
      }
    },
  },
  mounted() {
    this.handleScrollReveal()
  },
  methods: {
    handleScrollReveal() {
      this.$nextTick(() => {
        ScrollReveal().reveal('.home-board-wrap .text-title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInDown')
          },
        })
        ScrollReveal().reveal('.home-board-wrap .text-title-secondary', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInLeft')
          },
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
.home-board-wrap {
  background: url('~@/assets/images-v6/home/bgqp.png') no-repeat center top;
  background-size: cover;
  padding: 40px 0 32px;
  overflow: hidden;
}
.text-title-secondary {
  padding: 20px 0 40px;
}
.text-title,
.text-title-secondary {
  text-align: center;
  visibility: hidden;
}
.home-board {
  position: relative;
  width: 1180px;
  margin: auto;
  display: flex;
  height: 440px;
}
.home-board-xiongmao,
.home-board-meinv {
  position: absolute;
  float: none;
  width: auto;
  height: auto;
  z-index: 9;
}
.home-board-xiongmao {
  left: -310px;
  width: 320px;
  height: 399px;
}
.home-board-meinv {
  top: -60px;
  right: -370px;
  width: 484px;
  height: 535px;
}
.home-board-grid-wrap {
  position: relative;
  flex: 1;
}
.home-board-grid {
  display: flex;
  flex-wrap: wrap;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px 120px 20px 20px;
  overflow: auto;
  height: 100%;
}
.home-board-grid-item {
  padding: 15px 25px;
  cursor: pointer;
  width: 20%;
  overflow: hidden;
  text-align: center;
  &:hover {
    .home-board-grid-item__icon {
      transform: scale(1.083);
    }
  }
}
.home-board-grid-item__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home-board-grid-item__icon {
  width: 120px;
  height: 120px;
  transform-origin: bottom;
  transition: all ease-in-out 0.2s;
  object-fit: contain;
}
.home-board-grid-item__title {
  font-size: 16px;
  color: #eadf91;
  margin-top: 26px;
  /*white-space: nowrap;*/
  /*text-overflow: ellipsis;*/
  width: 100%;
  /*overflow: hidden;*/
}
.glitch {
  position: absolute;
  top: 50%;
  margin-top: -30px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 34px;
  font-weight: 700;
}
</style>
