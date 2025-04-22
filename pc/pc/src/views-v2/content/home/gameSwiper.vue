<template>
  <div class="game-swiper">
    <swiper
      ref="mySwiper"
      :style="{ width: winWidth + 'px' }"
      class="swiper-contanier"
      :options="swiperOption"
    >
      <swiper-slide
        class="swiper-slide"
        v-for="(item, index) in lotteryList"
        :key="index"
      >
        <div
          class="swiper-cont clearfix"
          :style="{ backgroundImage: `url(${item.pc2icon})` }"
        >
          <div class="title">
            <p class="cn">{{ item.typeName }}</p>
            <p class="en" v-html="escapeHtml(item.typeEnName)"></p>
          </div>
          <div class="text">{{ item.content }}</div>
          <div class="go" @click="goPage(item)">点击查看</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import util from "@/utils/utils";
export default {
  props: {
    gameList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      winWidth: 0,
      lotteryList: [],
      swiperOption: {
        effect: "coverflow",
        grabCursor: true,
        init: false,
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
        initialSlide: 1,
        slideToClickedSlide: true,
        spaceBetween: 0,
        coverflowEffect: {
          rotate: 50,
          stretch: -200, // slide左右距离
          modifier: 1, //
          slideShadows: false, // 滑块遮罩层
        },
      },
    };
  },
  computed: {},
  created() {
    this.onResize();
  },
  watch: {
    gameList: {
      handler(v) {
        const lotteryIndex = v.findIndex((item) => item.code == "LOTTERY");
        this.lotteryList = [...v];
        if (lotteryIndex > -1 && v.length > 1) {
          this.lotteryList.splice(lotteryIndex, 1);
          this.lotteryList.splice(1, 0, v[lotteryIndex]);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
  },

  updated() {
    if (this.lotteryList.length > 1) {
      this.$refs.mySwiper.$swiper.init();
    }
  },
  methods: {
    escapeHtml(str) {
      if (str) {
        return util.escapeHtml(str);
      }
    },
    onResize() {
      this.winWidth = window.document.body.clientWidth - 25;
      // console.log("width", this.winWidth);
    },
    goPage(item) {
      if (item.code == "LOTTERY") {
        window.open("/#/lottery", "_blank");
      } else {
        this.$router.push(`/game/${item.code}`);
      }
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";
.game-swiper {
  padding-top: 145px;
  // padding-bottom: 50px;
  background: url("@{imgSrc}/slide-bg.png");
  background-position: center -216px;
  background-repeat: repeat;
  height: 770px;
}
.swiper-inner {
  width: 100%;
  height: 500px;
  padding-top: 50px;
  padding-bottom: 50px;
}
.swiper-slide {
  width: 1270px;
  position: relative;
  .logo {
    width: auto;
    position: absolute;
    left: -10px;
    top: 0;
    height: 400px;
    z-index: 10;
  }
}
.swiper-cont {
  // margin-top: 50px;
  position: relative;
  background-position: top right;
  // background-color: #181a29;
  background-image: url("@{imgSrc}/index-slide-bg.png");
  background-repeat: no-repeat;
  border-radius: 10px;
  height: 627px;
  background-size: 100% 100%;
  padding-left: 560px;
  padding-top: 163px;
  .title {
    width: auto;
    display: block;
    float: none;
    margin-bottom: 20px;

    &::after {
      content: "";
      width: 45px;
      height: 3px;
      background-color: #fff;
      border-radius: 10px;
      display: block;
      margin-top: 7px;
    }
    .cn {
      font-size: 34px;
      color: #ed1459;
      font-weight: bold;
    }
    .en {
      font-size: 14px;
      color: #fff;
    }
  }
  .text {
    color: #e1e0e2;
    width: 640px;
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 3px;
    margin-bottom: 50px;
  }
  .go {
    cursor: pointer;
    margin-left: 150px;
    color: #fff;
    height: 45px;
    line-height: 45px;
    width: 220px;
    text-align: center;
    font-size: 14px;
    border-radius: 40px;
    background-color: #ed1459;
    letter-spacing: 3px;
    box-shadow: inset 0px 0px 8px 5px #f25876;
  }
}
</style>
