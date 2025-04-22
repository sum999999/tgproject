<template>
  <div class="home-slots">

    <div class="home-slots__title">
      <img src="~@/assets/images-v8/home/slotsicom.png" />
      <span>{{ $tex('电子') }}</span>
    </div>

    <div class="home-slots__card">
      <div class="home-slots__content">
        <span
          v-if="tipsText"
          class="glitch"
          :data-text="tipsText"
        >{{tipsText}}</span>
        <div class="home-slots-tabs">
          <Button
            class="ivu-btn-style--1"
            shape="circle"
            icon="arrow-left-b"
            @click="onTabsPreClick"
          ></Button>
          <div class="home-slots-tabs__content">
            <swiper
              ref="tabsSwiper"
              class="home-slots__tabsswiper"
              :options="tabsSwiperOption"
            >
              <swiper-slide
                v-for="(tab, index) in filterTabs"
                :key="tab.platformId"
              >
                <div
                  class="game-tabs-item"
                  :class="{
                            'game-tabs-item--active': curTabIndex === index,
                            'game-tabs-item--disabled': slideDisabledIfNeeded(tab)
                        }"
                >
                  <img
                    class="game-tabs-item__icon"
                    :src="curTabIndex === index ? tab[iconActiveField] : tab[iconField]"
                    alt=""
                  >
                  <div class="game-tabs-tips animate__animated animate__infinite animate__top2bottom">
                    <span class="game-tabs-tips__text">{{slideTipsText(tab)}}</span>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
          <Button
            class="ivu-btn-style--1"
            shape="circle"
            icon="arrow-right-b"
            @click="onTabsNextClick"
          ></Button>
        </div>
        <swiper
          ref="mySwiper"
          class="home-slots__myswiper"
          :options="swiperOption"
        >
          <swiper-slide
            v-for="(game) in games"
            :key="game.gameId"
          >
            <game-item
              :name="game.gameName"
              :icon="game.gameIcon"
              :platformId="game.platformId"
              :gameId="game.gameId"
              :platformCode="game.platformCode"
              :show-login-game-tip="showLoginGameTip"
            />
          </swiper-slide>
        </swiper>
        <Spin
          v-if="gameLoading"
          class="ivu-spin--dark"
          fix
        ></Spin>
      </div>
      <div class="home-slots__bullets"></div>
    </div>
  </div>
</template>

<script>
import gameMixin from '@/views-v8/game/components/gameMixin.js'
import { mapGetters } from 'vuex'
import GameItem from '@/views-v8/game/components/GameItem.vue'

export default {
  name: 'HomeSlots',
  mixins: [gameMixin],
  components: {
    GameItem,
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 7,
        slidesPerColumn: 3,
        slidesPerColumnFill: 'row',
        pagination: {
          el: '.home-slots__bullets',
          clickable: true,
        },
      },
      tabsSwiperOption: {
        slidesPerView: 6,
        spaceBetween: 10,
        loop: true,
        autoplay: false,
        slideToClickedSlide: true,
        on: {
          init: (swiper) => {
            swiper.slideToLoop(swiper.params.slidesPerView)
          },
          click: (swiper) => {
            console.log(swiper.realIndex, this.filterTabs[swiper.realIndex].typeName)
            this.onTabClick(swiper.realIndex, this.filterTabs[swiper.realIndex])
          },
        },
      },
      labelField: 'typeName',
      iconField: 'pc2Icon',
      iconActiveField: 'pc3Icon',
    }
  },
  computed: {
    ...mapGetters(['user']),
    tipsText() {
      if (this.gameLoading) {
        return
      }
      if (this.curAllTab.platformStatus === '2') {
        return this.$tex('即将上线')
      } else if (this.curAllTab.platformStatus === '3') {
        return this.$tex('维护中')
      }
    },
  },
  methods: {
    stopTabsSwiperAutoplay() {
      this.$refs.tabsSwiper.swiperInstance.params.speed = 300
      this.$refs.tabsSwiper.swiperInstance.autoplay.stop()
      clearTimeout(this._tabsSwiperTimer)
      this._tabsSwiperTimer = setTimeout(() => {
        this.resumeTabsSwiperAutoplay()
      }, 3000)
    },
    resumeTabsSwiperAutoplay() {
      this.$refs.tabsSwiper.swiperInstance.params.speed = 2000
      this.$refs.tabsSwiper.swiperInstance.autoplay.start()
    },
    onTabsPreClick() {
      // this.stopTabsSwiperAutoplay()
      this.$refs.tabsSwiper.swiperInstance.slidePrev()
    },
    onTabsNextClick() {
      // this.stopTabsSwiperAutoplay()
      this.$refs.tabsSwiper.swiperInstance.slideNext()
    },
    onTabClick(index, tab) {
      if (this.slideDisabledIfNeeded(tab)) {
        return void 0
      }
      this.curTabIndex = index
      this.onTabChange(index)
    },
    slideDisabledIfNeeded(tab) {
      return tab.platformStatus !== '1'
    },
    slideTipsText(tab) {
      if (tab.platformStatus === '2') {
        return this.$tex('即将上线')
      } else if (tab.platformStatus === '3') {
        return this.$tex('维护中')
      }
    },
  },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-slots {
  &__myswiper {
    &.swiper-container {
      padding-top: 40px;
      height: 620px;
    }
    .swiper-slide {
      height: 33.3333%;
    }
  }
  &__tabsswiper {
    img {
      height: 50px;
      object-fit: contain;
    }
  }
  padding: 0 20px;
  &__title {
    display: flex;
    align-items: center;
    margin: 15px 0;
    img {
      width: 38px;
      height: 28px;
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
  .ivu-spin {
    border-radius: 16px;
  }
  &__card {
    background: #323232;
    border-radius: 16px;
  }
  &__content {
    background: #282728;
    border-radius: 16px;
    padding: 22px 30px;
    position: relative;
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
      object-fit: cover;
    }
    > .home-slots__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom, #f7d139, #efbe16);
      display: none;
      opacity: 0.5;
      border-radius: 20px;
    }
    > .home-slots__mask2 {
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
    cursor: pointer;
    span {
      margin-top: 15px;
    }
    &:hover {
      .home-slots__img > .home-slots__mask {
        display: block;
      }
      .home-slots__img > .home-slots__mask2 {
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
  &-tabs {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    button {
      position: absolute;
      font-size: 21px;
      flex-shrink: 0;
      z-index: 1;
    }
    button:nth-of-type(1) {
      left: 0;
    }
    button:nth-of-type(2) {
      right: 0;
    }
    &__content {
      width: 100%;
      padding: 0 70px;
      .swiper-container {
        border-radius: 20px;
        width: 100%;
        min-height: 140px;
        padding: 20px;
        background: #ffffff;
        background-image: linear-gradient(0deg, #1a1a1a 0%, #404040 100%);
        display: flex;
        align-items: center;
      }
      @{deep} {
        .swiper-wrapper {
        }
      }
    }
  }
}
.game-tabs-item {
  position: relative;
  cursor: pointer;
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: auto;
  border-radius: 20px;
  padding: 25px 10px;
  &:hover:not(.game-tabs-item--disabled) {
  }

  &:hover:not(.game-tabs-item--disabled),
  &.game-tabs-item--active {
    color: #ddc17c;
    background: #3e3e3e;
    background-image: linear-gradient(0deg, #1a1a1a 0%, #404040 100%);
    box-shadow: 0 0 22px 1px rgba(255, 210, 0, 0.1), inset 0 1px 0 0 #fed136, inset 0 0 20px 0 rgba(254, 209, 54, 0.35);
  }
  &.game-tabs-item--disabled {
    > img {
      filter: grayscale(1);
    }
  }
  &:not(.game-tabs-item--disabled) {
    .game-tabs-tips {
      visibility: hidden;
    }
  }
  .game-tabs-tips {
    visibility: visible;
  }
}
.glitch {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.game-tabs-tips {
  position: absolute;
  bottom: 96%;
  right: 8px;
  padding: 0 8px;
  line-height: 20px;
  color: #ffffff;
  font-size: 14px;
  background-image: linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99);
  span {
    vertical-align: bottom;
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &:after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid #795d1b;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    right: 8px;
    bottom: -5px;
  }
}
</style>