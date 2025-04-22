<template>
  <div class="carousel">
    <div class="swiper-content">
      <swiper
        ref="mySwiper1"
        id="mySwiper1"
        class="swiper-contanier swiper-contanier1"
        :options="swiperOption"
      >
        <div
          class="swiper-slide"
          v-for="(item,index) in  dataList"
          :key="index"
        >
          <a
            href="javascript:void(0)"
            :class="{'small':showNum===4}"
            class="panel-relative"
            :style="{'background-image':`url(${item.pc5icon})`}"
            @click="navGoGamePlat(item.code)"
          >
            <div
              class="panel-over panel-over1"
              :class="{'small':showNum===4}"
            ></div>
            <div
              class="panel-over panel-over2"
              :class="{'small':showNum===4}"
            ></div>
            <em :class="{'small':showNum===4}">{{item.typeName}}</em>
            <span :class="{'small':showNum===4}">{{item.pc8icon}}</span>
          </a>
        </div>
      </swiper>
      <div
        class="swiper-button-next button-next"
        id="button-next2"
        v-if="showNum === 3"
      ></div>
      <div
        class="swiper-button-prev button-prev"
        id="button-prev2"
        v-if="showNum === 3"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "carousel",
  props: {
    dataList: {
      type: Array
    },
    showNum: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      swiperOption: {
        autoplay: true,
        init: false,
        loop: true,
        autoplay: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        slidesPerView: this.showNum,
        spaceBetween: 30,
        slidesPerGroup: 3,
        slideToClickedSlide: true,
        disableOnInteraction: false,
        loop: true,
        navigation: {
          nextEl: "#button-next2",
          prevEl: "#button-prev2"
        }
      }
    };
  },
  updated() {
    if (this.dataList.length > 0) {
      this.$refs.mySwiper1.$swiper.init();
    }
  },
  methods: {
    navGoGamePlat(code) {
      if (!code) return;
      if (code == "LOTTERY") {
        this.$router.push("/lottery");
        return;
      }
      this.currentMenu = code;
      // debugger;
      this.$router.push({ name: "game", params: { id: code } });
      // }
    }
  }
};
</script>
<style lang="less" scoped>
@boldTextColor: #81685a;
.carousel {
  position: relative;
  width: 100%;
  height: 542px;
  background: url("../../images/center_bg.png") no-repeat center bottom;
  margin-top: 20px;
}
.swiper-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 1120px;
  height: 333px;
  line-height: 333px;
  margin: auto;
}
/deep/ .swiper-contanier {
  width: 100%;
}
/deep/ .swiper-slide {
  height: 333px;
  border-radius: 20px;
  overflow: hidden;
  & > img {
    height: 100%;
    width: auto;
  }
}
/deep/ .swiper-button-prev,
.swiper-button-next {
  width: 16px;
  height: 25px;
}
/deep/ .swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
  background: url("../../images/white_right.png") no-repeat center bottom;
  right: -40px;
  outline: none;
}
/deep/ .swiper-button-next:after, /deep/ .swiper-button-prev:after {
  display: none;
}
/deep/ .swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
  background: url("../../images/white_left.png") no-repeat center bottom;
  left: initial;
  left: -40px;
  outline: none;
}
.swiper-slide a {
  display: block;
  color: @boldTextColor;
  width: 344px;
  height: 332px;
  &.small {
    width: 260px;
    height: 290px;
  }
}

.swiper-slide .panel-relative {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background-repeat: no-repeat;
}

.swiper-slide .panel-relative em,
.swiper-slide .panel-relative span {
  position: relative;
  z-index: 9;
}

.swiper-slide .panel-over {
  position: absolute;
  width: 350px;
  height: 150px;
  bottom: 0;
  background: url(../../images/home_platform_hover.png) no-repeat;
  &.small {
    background-size: 533px 100px;
    width: 260px;
  }
}

.swiper-slide .panel-over1 {
  background-position: -6px bottom;
}
.swiper-slide a:hover {
  .panel-over2 {
    bottom: -8px;
    transition: all 0.3s ease;
  }
  .panel-over1 {
    bottom: -100px;
    transition: all 0.3s ease;
  }
  em {
    color: #fff;
    animation: fadeInUp 0.5s;
  }
  span {
    color: #fff;
    animation: fadeInUp 0.5s 0.2s;
  }
}
.swiper-slide .panel-over2 {
  background-position: -362px bottom;
  bottom: -150px;
  &.small {
    background-position: -273px bottom;
  }
}

.swiper-slide a span {
  padding-top: 8px;
  &.small {
    font-size: 12px;
  }
}
.swiper-slide a em,
.swiper-slide a span {
  display: block;
  text-align: center;
  font-size: 13px;
  line-height: 13px;
}
.swiper-slide a em {
  &.small {
    padding-top: 241px;
  }
  font-size: 16px;
  padding-top: 274px;
  line-height: 16px;
}
em,
i {
  font-style: normal;
}
@-webkit-keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@-moz-keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@-o-keyframes fadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
