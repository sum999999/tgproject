<template>
  <div class="home-lottery-wrap">
    <div class="container">
      <h1 class="text-title text-title--gradient animate__animated animate__delay-600ms">{{$tex("彩票娱乐")}}</h1>
      <p class="text-title-secondary animate__animated animate__delay-600ms">{{$tex("真实的赌场环境、稳定的高端设备、专业的技术支持，给予玩家仿佛置身于现场的绝妙体验，随时可尽情享受游戏乐趣。")}}</p>
      <div class="container home-lottery animate__animated animate__delay-600ms">
        <div class="home-lottery-draw">
          <h1 class="text-title text-title--repeat-gradient home-lottery-draw-title">{{$tex("开奖公告")}}</h1>
          <home-lottery-game></home-lottery-game>
        </div>
        <home-lottery-category></home-lottery-category>
      </div>
    </div>
  </div>
</template>

<script>
import HomeLotteryGame from './HomeLotteryGame'
import HomeLotteryCategory from './HomeLotteryCategory'
import ScrollReveal from 'scrollreveal'

export default {
  name: 'HomeLottery',
  components: {
    HomeLotteryGame,
    HomeLotteryCategory,
  },
  mounted() {
    this.handleScrollReveal()
  },
  methods: {
    handleScrollReveal() {
      this.$nextTick(() => {
        ScrollReveal().reveal('.home-lottery-wrap .text-title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInDown')
          },
        })
        ScrollReveal().reveal('.home-lottery-wrap .text-title-secondary', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInLeft')
          },
        })
        ScrollReveal().reveal('.home-lottery-wrap .home-lottery', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInUp')
          },
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
.home-lottery-wrap {
  background: url('~@/assets/images-v6/home/bgcaipiao.png') no-repeat center top;
  background-size: cover;
  border: none;
  padding: 40px 0 48px;
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
.home-lottery {
  border: none;
  background-color: transparent;
  display: flex;
  flex-wrap: nowrap;
  visibility: hidden;
}
.home-lottery-draw {
  position: relative;
  background-image: linear-gradient(to top, #26252b, #33333a 70%, #40404a);
  width: 348px;
  margin: 10px 10px 10px 0;
  border-radius: 10px;
  padding-bottom: 20px;
  min-height: 456px;
  &:before {
    content: '';
    display: block;
    width: 199px;
    height: 151px;
    position: absolute;
    background: url('~@/assets/images-v6/home/caiqiu.png') no-repeat;
    background-size: cover;
    left: -10px;
    top: -44px;
    z-index: 2;
  }
  &:after {
    content: '';
    display: block;
    width: 320px;
    height: 234px;
    position: absolute;
    right: 14px;
    top: 0;
    background: url('~@/assets/images-v6/home/caiqiu_1.png') no-repeat;
    background-size: cover;
    z-index: 1;
  }
}
.text-title.home-lottery-draw-title {
  text-align: right;
  font-size: 24px;
  padding: 20px 20px;
  position: relative;
  z-index: 3;
  width: 166px;
  margin: 0 0 0 auto;
  word-break: break-all;
}
.home-lottery-game-wrap {
  position: relative;
  margin-top: 36px;
  z-index: 3;
}
</style>
