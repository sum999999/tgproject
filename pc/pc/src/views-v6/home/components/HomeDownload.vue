<template>
  <div class="home-download-wrap">
    <div class="container">
      <h1 class="text-title text-title--gradient animate__animated animate__delay-600ms">{{$tex("APP下载")}}</h1>
      <p class="text-title-secondary animate__animated animate__delay-600ms">{{$tex("真实的赌场环境、稳定的高端设备、专业的技术支持，给予玩家仿佛置身于现场的绝妙体验，随时可尽情享受游戏乐趣。")}}</p>
      <div class="container home-download">
        <div class="home-download-l">
          <h1 class="home-download-l__title text-title--repeat-gradient animate__animated animate__delay-600ms">{{$tex("娱乐手游的领导者")}}</h1>
          <p class="home-download-l__dsc animate__animated animate__delay-600ms">{{$tex("全网最顶尖的手机投注app，最丰富的游戏种类，最卓越的用户体验，新颖快捷投注模式自由切换，稳定陪伴您畅享游戏，随时可尽情享受游戏的乐趣！财富一键在手！")}}</p>
          <home-qrcode class="animate__animated animate__delay-600ms"></home-qrcode>
        </div>
        <div class="home-download-r animate__animated animate__delay-600ms">
          <img
            src="~@/assets/images-v6/home/xzimage.png"
            alt=""
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeQrcode from './HomeQrcode'
import ScrollReveal from 'scrollreveal'

export default {
  name: 'HomeDownload',
  components: {
    HomeQrcode,
  },
  mounted() {
    this.handleScrollReveal()
  },
  methods: {
    handleScrollReveal() {
      this.$nextTick(() => {
        ScrollReveal().reveal('.home-download-wrap .text-title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInDown')
          },
        })
        ScrollReveal().reveal('.home-download-wrap .text-title-secondary', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInLeft')
          },
        })
        ScrollReveal().reveal('.home-download-wrap .home-download-l__title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__swing')
          },
        })
        ScrollReveal().reveal('.home-download-wrap .home-download-l__dsc', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__wobble')
          },
        })
        ScrollReveal().reveal('.home-download-wrap .home-qrcode', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInUp')
          },
        })
        ScrollReveal().reveal('.home-download-wrap .home-download-r', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInRight')
          },
        })
      })
    },
  },
}
</script>

<style scoped lang="less">
.home-download-wrap {
  background: url('~@/assets/images-v6/home/bgappxiazai.png') no-repeat center top;
  background-size: cover;
  padding: 40px 0 60px;
  overflow: hidden;
}
.text-title,
.text-title-secondary {
  text-align: center;
}
.text-title-secondary {
  padding: 20px 0 40px;
}
.home-download {
  display: flex;
}
.home-download-l {
  flex: 1;
  text-align: center;
  overflow: hidden;
}
.home-download-l__title {
  color: #aa8743;
  font-size: 40px;
  margin: 60px 0 0;
  visibility: hidden;
  word-break: break-all;
}
.home-download-l__dsc {
  font-size: 18px;
  color: #ffffff;
  margin: 30px 0 0;
  padding: 0 74px;
  visibility: hidden;
}
.home-download-r {
  img {
    width: 557px;
    height: 481px;
    float: none;
    margin: 55px 0 0;
  }
}
.home-qrcode {
  margin: 40px 0 0;
  visibility: hidden;
}
</style>
