<template>
  <div class="home-banner">
    <Carousel
      v-model="curIndex"
      autoplay
      loop
      arrow="never"
      :autoplay-speed="sysCarouselDelay * 1000"
      :radius-dot="true"
    >
      <CarouselItem
        class="animate__animated animate__zoomIn"
        v-for="banner in banners"
        :key="banner.resourceId"
      >
        <div class="carousel-item" @click="onBannerClick(banner)">
          <div
            class="carousel-item__bg"
            :style="{
              'background-image': `url(${banner.netUrl})`,
            }"
          ></div>
        </div>
      </CarouselItem>
    </Carousel>
    <div v-if="showLoading" class="home-banner-loading">
      <vue-loaders-pacman
        :color="themeColorList.primaryColor"
        scale="1"
      ></vue-loaders-pacman>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueLoadersPacman from "vue-loaders/dist/loaders/pacman";

export default {
  name: "Banner",
  components: {
    VueLoadersPacman: VueLoadersPacman.component,
  },
  data() {
    return {
      curIndex: 0,
      banners: [],
    };
  },
  computed: {
    ...mapGetters(["themeColorList", "sysCarouselDelay"]),
    hasBanners() {
      return !!this.banners.length;
    },
    showLoading() {
      return !this.hasBanners;
    },
  },
  created() {
    this.handleBanners();
  },
  methods: {
    handleBanners() {
      this.$http
        .post("/api/v2/cms/queryBanners", { frontType: "pc" }, { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.banners = response.data.data || [];
        });
    },
    onBannerClick(banner) {
      const { contentType, targetUrl, resourceId } = banner;
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
          query: { resourceId: resourceId },
        });
      } else if (contentType === 3) {
        this.$router.push("/active");
      }
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.home-banner {
  position: relative;
}
.home-banner-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 1;
}
.ivu-carousel {
  @{deep} {
    .ivu-carousel-dots {
      height: auto;
    }
    .ivu-carousel-dots li button.radius {
      width: 10px;
      height: 10px;
    }
    .ivu-carousel-dots li button {
      background: #ffffff;
      opacity: 1;
    }
    .ivu-carousel-dots li.ivu-carousel-active > button {
      background: rgb(var(--tg-accent));
    }
  }
}
.ivu-carousel {
  height: 500px;
}
.carousel-item {
  cursor: pointer;
  height: 500px;
  text-align: center;
  color: #fff;
  font-size: 0;
  .carousel-item__bg {
    max-width: 1920px;
    margin: 0 auto;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center bottom;
  }
}
</style>
