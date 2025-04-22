<template>
  <div class="home-hotgames">

    <div class="home-hotgames__title">
      <img
        class="animate__animated animate__tada animate__infinite"
        src="~@/assets/images-v8/home/hot-games.png"
      />
      <span>{{ $tex('热门') }}</span>
    </div>
    <div class="home-hotgames__card">
      <div class="home-hotgames__content">
        <swiper
          ref="mySwiper"
          :options="swiperOption"
        >
          <swiper-slide
            v-for="(brand) in brands"
            :key="brand.platformId"
          >
            <div class="home-hotgames__item">
              <div class="home-hotgames__img">
                <img :src="brand.platformIcon">
              </div>
              <span>{{brand.platformName}}</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="home-hotgames__bullets"></div>
    </div>
  </div>
</template>

<script>
import GameItem from '@/views-v8/game/components/GameItem.vue'
export default {
  name: 'HomeHotGames',
  components: {
    GameItem,
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 7,
        slidesPerColumn: 2,
        slidesPerColumnFill: 'row',
        pagination: {
          el: '.home-hotgames__bullets',
          clickable: true,
        },
      },
      games: [],
      sysConfig: {},
      brands: [],
    }
  },
  computed: {
    showLoginGameTip() {
      return this.sysConfig['GAME_ACCOUNT_AUTO_TRANSFORM'] !== '0'
    },
  },
  created() {
    this.$store.dispatch('querySystemConfig').then((sysConfig) => {
      this.sysConfig = sysConfig
    })
    this.$store.dispatch('queryPlayForm', { isMain: '' }).then((data) => {
      this.brands = data || []
      console.log(data)
    })
  },
  methods: {},
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-hotgames {
  .swiper-container {
    height: 400px;
    cursor: grab;
  }
  .swiper-slide {
    height: 50%;
  }
  padding: 0 20px;
  &__title {
    display: flex;
    align-items: center;
    margin: 15px 0;
    img {
      width: 30px;
      height: 35px;
      margin-right: 10px;
    }
    span {
      font-family: PingFang-SC-Heavy;
      font-size: 20px;
      color: #ffd427;
      letter-spacing: 0;
      line-height: 20px;
    }
  }
  &__card {
    background: #323232;
    border-radius: 16px;
  }
  &__content {
    background: #282728;
    border-radius: 16px;
    padding: 22px 30px;
  }
  &__bullets {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    @{deep} {
      .swiper-pagination-bullet-active {
        background: #ffd427;
      }
      span {
        width: 14px;
        height: 14px;
        margin: 0 7px;
      }
    }
  }
  &__img {
    position: relative;

    > img:nth-child(1) {
      width: 150px;
      height: 150px;
      border-radius: 20px;
      object-fit: contain;
    }
    > .home-hotgames__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom, #f7d139, #efbe16);
      display: none;
      opacity: 0.5;
      border-radius: 20px;
    }
    > .home-hotgames__mask2 {
      position: absolute;
      width: 100%;
      height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
    }
  }
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      margin-top: 15px;
    }
    &:hover {
      .home-hotgames__img > .home-hotgames__mask {
        display: block;
      }
      .home-hotgames__img > .home-hotgames__mask2 {
        display: flex;
      }
    }
  }
  &__collect {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 32px;
    height: 32px;
    > img {
      position: absolute;
      width: 100%;
      height: 100%;
      float: none;
    }
    > img:nth-child(1) {
      opacity: 1;
    }
    > img:nth-child(2) {
      opacity: 0;
    }
    &:hover {
      > img:nth-child(1) {
        opacity: 0;
      }
      > img:nth-child(2) {
        opacity: 1;
      }
    }
  }
  &__play {
    background: #212121;
    border: 1px solid #ffffff;
    color: #ffffff;
    &:hover {
      background-color: #0f1f2f;
    }
  }
}
</style>