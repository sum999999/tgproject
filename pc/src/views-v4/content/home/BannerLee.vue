<template>
  <div class="banner">
    <div class="wrapper">
      <swiper
        ref="mySwiper2"
        class="swiper-contanier swiper-contanier2"
        :options="swiperOption"
      >
        <swiper-slide
          class="swiper-slide"
          v-for="(item,index) in list"
          :key="index"
          :style="`background-image:url(${item.netUrl})`"
        >
          <div
            class="inner"
            @click="goUrl(item)"
          ></div>
        </swiper-slide>
      </swiper>
      <div
        class="swiper-button-prev button-prev"
        id="button-prev"
      ></div>
      <div
        class="swiper-button-next button-next"
        id="button-next"
      ></div>
      <div class="swiper-pagination"></div><!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
    </div>
  </div>
</template>
<script>
import headerMixin from '@/views/layout/child_modal/banner.js'
import { mapGetters } from 'vuex'

export default {
  mixins: [headerMixin],
  data() {
    return {
      winWidth: 0,
      swiperOption: {
        init: false,
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        // initialSlide: 1,
        slideToClickedSlide: true,
        spaceBetween: 0,
        coverflowEffect: {
          rotate: 0,
          stretch: 300, // slide左右距离
          modifier: 2,
          depth: 105,
          slideShadows: true, // 滑块遮罩层
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '#button-next',
          prevEl: '#button-prev',
        },
      },
    }
  },
  computed: {
    ...mapGetters(['sysCarouselDelay']),
  },
  watch: {
    sysCarouselDelay: {
      immediate: true,
      handler(value) {
        this.swiperOption.autoplay.delay = value * 1000
      },
    },
  },
  created() {
    this.onResize()
  },
  mounted() {},
  updated() {
    if (this.list.length > 0) {
      this.$refs.mySwiper2.$swiper.init()
    }
  },
  methods: {
    onResize() {
      this.winWidth = window.document.body.clientWidth
    },
    goUrl(banner) {
      let { targetUrl, contentType, resourceId } = banner
      if (contentType === -1) {
        if (targetUrl) {
          if (targetUrl.indexOf('http') > -1) {
            window.open(targetUrl.trim(), '_blank')
            return true
          } else {
            this.$router.push(targetUrl.trim())
          }
        }
      } else if (contentType === 1 || contentType === 2) {
        this.$router.push({
          path: '/active',
          query: { resourceId: resourceId },
        })
      } else if (contentType === 3) {
        this.$router.push('/active')
      }
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>
<style scoped  lang="less">
.wrapper {
  width: 970px;
  height: 420px;
  overflow: hidden;
  margin: auto;
  position: relative;
}
.banner {
  position: relative;
  height: 436px;
  background: url('../../images/banner_bg.png') no-repeat center top;
  .banner-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 84px;
    z-index: 9;
    background: url('../../images/slider_mask.png') no-repeat center bottom;
  }
}
/deep/.swiper-contanier {
  padding-top: 54px;
}
.game-swiper {
  padding-top: 200px;
  padding-bottom: 50px;
  //   background: url("@{imgSrc}/slide-bg.png");
  background-position: center -216px;
  background-repeat: repeat;
}
.swiper-inner {
  width: 100%;
  height: 360px;
  // padding-top: 50px;
  // padding-bottom: 50px;
}
.inner {
  height: 100%;
}
/deep/.swiper-slide {
  width: 780px;
  height: 310px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  & > img {
    width: 100%;
  }
}
.swiper-cont {
  margin-top: 50px;
  position: relative;
  //   background-image: url("@{imgSrc}/slide-item-bg.png");
  background-position: center right;
  background-color: #181a29;
  background-repeat: no-repeat;
  border-radius: 10px;
  height: 400px;
  padding-left: 400px;
  padding-top: 50px;
}
/deep/.swiper-button-prev,
/deep/.swiper-container-rtl .swiper-button-next {
  background-image: url('../../images/banner_left.png');
  background-size: contain;
  background-repeat: no-repeat;
  left: 40px;
  width: 20px;
  height: 25px;
}
/deep/.swiper-button-prev:after,
/deep/.swiper-button-next:after {
  display: none;
}
/deep/.swiper-button-next,
/deep/.swiper-container-rtl .swiper-button-prev {
  background-image: url('../../images/banner_right.png');
  background-size: contain;
  background-repeat: no-repeat;
  right: 40px;
  width: 20px;
  height: 25px;
}
/deep/.swiper-container-3d .swiper-slide-shadow-left,
/deep/.swiper-container-3d .swiper-slide-shadow-right {
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
}
/deep/.swiper-button-prev,
.swiper-button-next {
  outline: none;
}
/deep/.swiper-pagination {
  margin: auto;
  left: 0;
  right: 0;
  bottom: 73px;
}
/deep/.swiper-pagination-bullet {
  margin: 0 6px;
  background: #fffcba;
  opacity: 1;
  outline: none;
}
/deep/.swiper-pagination-bullet.swiper-pagination-bullet-active {
  width: 10px;
  height: 10px;
  background: #ffae35;
}
</style>
