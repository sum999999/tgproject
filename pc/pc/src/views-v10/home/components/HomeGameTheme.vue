<template>
  <div class="home-game-theme-wrap">
    <div class="container">
      <h1 class="text-title text-title--gradient animate__animated animate__delay-600ms">{{$tex("七大游戏主题")}}</h1>
      <p class="text-title-secondary animate__animated animate__delay-600ms">{{$tex("真实的赌场环境、稳定的高端设备、专业的技术支持，给予玩家仿佛置身于现场的绝妙体验，随时可尽情享受游戏乐趣。")}}</p>
      <div class="home-game-theme">
        <transition name="component-fade">
          <div
            class="home-game-theme-area"
            :class="[curCode]"
            :key="curCode"
          >
            <div
              v-if="curCode"
              class="home-game-theme-area__content"
            >
              <h1 class="home-game-theme-area__title">{{curTitle}}</h1>
              <div class="home-game-theme-area__dsc">
                <p class="home-game-theme-area__text">{{curContent}}</p>
              </div>
              <ul class="home-game-theme-area-list">
                <li
                  v-for="(plat, index) in plats"
                  :key="index"
                  class="home-game-theme-area-list__item"
                  @click="onGameClick(plat)"
                >
                  <img
                    :src="plat.pcIcon"
                    alt=""
                  >
                  <span>{{plat.typeName}}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <ul class="home-game-theme-nav">
          <li
            v-for="(gameTheme, index) in gameThemes"
            :key="index"
            class="home-game-theme-nav-item"
            :class="{
                    [gameTheme.code]: true,
                    'home-game-theme-nav-item--active': isNavDisabled(gameTheme.status) ? false : curIndex === index,
                    'home-game-theme-nav-item--disabled': isNavDisabled(gameTheme.status),
                }"
            @click="onNavClick(gameTheme, index)"
          >
            <i></i>
            <span>{{gameTheme.typeName}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { queryGameListTypes } from '@/api/game'
import ScrollReveal from 'scrollreveal'

export default {
  name: 'HomeGameTheme',
  data() {
    return {
      curIndex: 0,
      gameThemes: [],
    }
  },
  computed: {
    curCode() {
      return this.gameThemes[this.curIndex] && this.gameThemes[this.curIndex].code
    },
    curTitle() {
      return this.gameThemes[this.curIndex] && this.gameThemes[this.curIndex].typeName
    },
    curContent() {
      return this.gameThemes[this.curIndex] && this.gameThemes[this.curIndex].content
    },
    plats() {
      const gameTheme = this.gameThemes[this.curIndex] || {}
      const code = gameTheme.code
      const platformsRsps = gameTheme.platformsRsps || []
      return platformsRsps.slice(0, 4).map((plat) => {
        if (code === 'LOTTERY') {
          plat.pcIcon = plat.pc6Icon
        }
        return plat
      })
    },
  },
  created() {
    this.handleGameThemes()
  },
  mounted() {
    this.handleScrollReveal()
  },
  methods: {
    handleScrollReveal() {
      this.$nextTick(() => {
        ScrollReveal().reveal('.home-game-theme-wrap .text-title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInDown')
          },
        })
        ScrollReveal().reveal('.home-game-theme-wrap .text-title-secondary', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInRight')
          },
        })
      })
    },
    handleGameThemes() {
      queryGameListTypes({ code: null }).then((res) => {
        if (res.data.code !== 0) {
          return
        }
        this.gameThemes = res.data.data.list
      })
    },
    onNavClick(gameTheme, index) {
      if (this.isNavDisabled(gameTheme.status)) {
        return
      }
      this.curIndex = index
    },
    isNavDisabled(status) {
      return status !== '1'
    },
    onGameClick(plat) {
      if (this.curCode === 'LOTTERY') {
        return this.$router.push(`/lottery?fromHomeCode=${plat.platformId}`)
      }
      this.$router.push(`/game/${plat.code}`)
    },
  },
}
</script>

<style scoped lang="less">
.component-fade-enter-active,
.component-fade-leave-active {
  transition: all 1s ease-in-out;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
  position: absolute;
}
.component-fade-enter {
  transform: translate3d(0, 50px, 0);
  z-index: 1;
}
.component-fade-leave-to {
  transform: translate3d(-100%, 0, 0);
}
.home-game-theme-wrap {
  background: url('~@/assets/images-v6/home/bgyouxizhuti.png') no-repeat center top;
  background-size: cover;
  padding: 40px 0 48px;
  color: #ffffff;
  overflow: hidden;
}
.text-title,
.text-title-secondary {
  text-align: center;
  visibility: hidden;
}
.text-title-secondary {
  padding: 20px 0 40px;
}
.home-game-theme {
  width: 1231px;
  margin: auto;
}
.home-game-theme-nav {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  min-height: 184px;
}
.home-game-theme-area {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  width: 1231px;
  height: 534px;
  padding: 58px 40px 60px 565px;
  &.LOTTERY {
    background-image: url('~@/assets/images-v6/home/caipaio_7.png');
  }
  &.SLOT {
    background-image: url('~@/assets/images-v6/home/dianzi_7.png');
  }
  &.VIDEO {
    background-image: url('~@/assets/images-v6/home/zhenren_7.png');
  }
  &.POKER {
    background-image: url('~@/assets/images-v6/home/qipai_7.png');
  }
  &.FISH {
    background-image: url('~@/assets/images-v6/home/buyu_7.png');
  }
  &.SPORTS {
    background-image: url('~@/assets/images-v6/home/dianjing_7.png');
  }
  &.BALL {
    background-image: url('~@/assets/images-v6/home/tiyu_7.png');
  }
}
.home-game-theme-area__title {
  font-size: 30px;
  padding: 50px 0 20px;
}
.home-game-theme-area__dsc {
  font-size: 18px;
  max-height: 90px;
  line-height: 30px;
  overflow: hidden;
  &:before {
    float: left;
    content: '';
    height: 90px;
    width: 22px;
  }
  .home-game-theme-area__text {
    float: right;
    width: 100%;
    margin-left: -22px;
  }
  &:after {
    float: right;
    content: '...';
    width: 22px;
    height: 20px;
    position: relative;
    left: 100%;
    transform: translate(-100%, -100%);
    padding-left: 8px;
    line-height: 15px;
  }
}
.home-game-theme-nav-item {
  width: 137px;
  margin: 0 25px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  i {
    display: inline-block;
    width: 137px;
    height: 137px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center center;
    transition: all ease-in-out 0.4s;
    transform-origin: bottom;
  }
  span {
    margin-top: 20px;
    font-size: 18px;
    color: #eadf91;
    width: 100%;
  }
  &:hover,
  &.home-game-theme-nav-item--active {
    i {
      transform: translate3d(0, -16px, 0);
    }
  }
  &.home-game-theme-nav-item--disabled {
    filter: grayscale(1);
    i {
      transform: translate3d(0, 0, 0);
    }
  }
  &.LOTTERY {
    i {
      background-image: url('~@/assets/images-v6/home/icon_caipaio.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_caipaio_xz.png');
      }
    }
  }
  &.SLOT {
    i {
      background-image: url('~@/assets/images-v6/home/icon_dianzi.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_dianzi_xz.png');
      }
    }
  }
  &.VIDEO {
    i {
      background-image: url('~@/assets/images-v6/home/icon_zhenren.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_zhenren_xz.png');
      }
    }
  }
  &.POKER {
    i {
      background-image: url('~@/assets/images-v6/home/icon_qipai.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_qipai_xz.png');
      }
    }
  }
  &.FISH {
    i {
      background-image: url('~@/assets/images-v6/home/icon_buyu.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_buyu_xz.png');
      }
    }
  }
  &.SPORTS {
    i {
      background-image: url('~@/assets/images-v6/home/icon_dianjing.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_dianjing_xz.png');
      }
    }
  }
  &.BALL {
    i {
      background-image: url('~@/assets/images-v6/home/icon_tiyu.png');
      &:hover,
      &.home-game-theme-nav-item--active {
        background-image: url('~@/assets/images-v6/home/icon_tiyu_xz.png');
      }
    }
  }
}
.home-game-theme-area-list {
  display: flex;
  margin-top: 25px;
  font-size: 16px;
  .home-game-theme-area-list__item:nth-last-child(1) {
    margin-right: 0;
  }
}
.home-game-theme-area-list__item {
  width: 120px;
  height: 120px;
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  &:hover {
    img {
      transform: scale(1.083);
    }
  }
  img {
    width: 100%;
    height: 100%;
    transition: transform ease-in-out 0.3s;
    transform-origin: bottom;
    object-fit: contain;
  }
  span {
    margin-top: 10px;
  }
}
</style>
