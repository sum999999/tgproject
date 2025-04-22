<template>
  <div class="borrow">
    <div class="borrow-content">
      <div class="borrow-qr-code"
           id="qrcode"
           ref="qrcode"></div>
      <div class="borrow-iphonex">
        <swiper class="my-swipe"
                ref="mySwiper"
                :options="swiperOption"
                @mouseleave.native="swiper.autoplay.start()"
                @mouseenter.native="swiper.autoplay.stop()">
          <swiper-slide v-for="(item, idx) in swipeImgs"
                        :key="idx">
            <img :src="`/static/images/${item}`"
                 alt="">
          </swiper-slide>
          <div class="swiper-pagination "
               slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>

import QRCode from "@/utils/qrcode"; // import QRCode from "qrcodejs2"; 不使用网站太长会报错";
export default {
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  data () {
    return {
      swipeImgs: ['jieb-swiper-one.png', 'jieb-swiper-two.png'],
      codeUrl: '',
      swiperOption: {
        notNextTick: true,
        loop: true,
        initialSlide: 0,
        autoplay: true,
        speed: 600,
        delay: 3000,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  methods: {
    //生成二维码
    createCode () {
      new QRCode('qrcode', {
        text: this.codeUrl,
        colorDark: "#ff2923",
        colorLight: "#ffffff",
      })
    }
  },
  created () {
    this.$store.dispatch("querySystemConfig").then(data => {
      this.codeUrl = data['CONFIG_WEB_SITE_URL'] //app端推广链接
      this.$nextTick(() => {
        this.createCode();
      })
    })
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.borrow {
  .borrow-content {
    position: relative;
    height: 584px;
    border-radius: 4px;
    background: url("/static/images/borrow-bg.png") no-repeat center;
    .borrow-qr-code {
      position: absolute;
      left: 25px;
      bottom: 79px;
      width: 113px;
      height: 113px;
      padding: 6px;
    }
    .borrow-iphonex {
      position: absolute;
      right: 36px;
      top: 30px;
      width: 264px;
      height: 526px;
      background: url("/static/images/iphonex.png") no-repeat center;
      .swiper-container {
        position: absolute;
        left: 16px;
        top: 15px;
        width: 232px;
        height: 497px;
        overflow: hidden;
      }
      @{deep} .swiper-pagination-bullet {
        background-color: #ffd7d8;
        opacity: 1;
      }
      @{deep} .swiper-container-horizontal > .swiper-pagination-bullets {
        bottom: 8px;
      }
      @{deep} .swiper-pagination-bullet-active {
        background: #ff6b00;
      }
    }
  }
}
</style>
