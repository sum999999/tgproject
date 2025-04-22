<template>
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
      >
        <img
          @click="goUrl(item)"
          :src="item.netUrl"
          alt=""
        >
      </swiper-slide>
    </swiper>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>

    <div
      class="swiper-button button-prev"
      id="button-prev"
    >

      <Icon
        type="ios-arrow-back"
        size="60"
        color="#fff"
      ></Icon>
    </div>
    <div
      class="swiper-button button-next"
      id="button-next"
    >
      <Icon
        type="ios-arrow-forward"
        size="60"
        color="#fff"
      ></Icon>
    </div>
  </div>
</template>
<script>
import headerMixin from "@/views/layout/child_modal/banner.js";
export default {
  mixins: [headerMixin],
  data() {
    return {
      swiperOption: {
        init: false,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        slidesPerView: "auto",
        slideToClickedSlide: true,
        navigation: {
          nextEl: "#button-next",
          prevEl: "#button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function(index, className) {
            return '<span class="' + className + '"></span>';
          }
        }
      }
    };
  },
  updated() {
    if (this.list.length > 0) {
      this.$refs.mySwiper2.$swiper.init();
    }
  },
  methods: {
    goUrl(banner) {
      let { targetUrl, contentType, resourceId } = banner;
      if (contentType === -1) {
        if (targetUrl) {
          if (targetUrl.indexOf("http") > -1) {
            window.open(targetUrl.trim(), "_blank");
            return true;
          } else {
            this.$router.push(targetUrl.trim());
          }
        }
      } else if (contentType === 1 || contentType === 2) {
        this.$router.push({
          path: "/active",
          query: { resourceId: resourceId }
        });
      } else if (contentType === 3) {
        this.$router.push("/active");
      }
    }
  }
};
</script>
<style scoped  lang="less" scoped>
.wrapper {
  position: relative;
  z-index: 3;
  overflow: hidden;
  height: 315px;
  &:hover {
    .swiper-button {
      opacity: 0.4;
    }
  }
}
/deep/.swiper-slide {
  width: 780px;
  height: 315px;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  & > img {
    width: 780px;
    height: 315px;
  }
}
.swiper-button {
  position: absolute;
  top: 40%;
  padding: 5px;
  background-color: #000;
  border-radius: 4px;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
}
.button-prev {
  left: 0;
}
.button-next {
  right: 0;
}
.swiper-pagination {
  bottom: 10px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  /deep/ .swiper-pagination-bullet {
    margin: 0 5px;
    background-color: #fff;
    opacity: 1;
    outline: none;
  }
  /deep/ .swiper-pagination-bullet-active {
    background-color: #ff7614;
  }
}
</style>
