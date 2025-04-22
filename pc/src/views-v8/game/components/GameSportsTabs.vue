<template>
    <div class="game-sports-tabs">
        <i class="game-sports-tabs__icon game-sports-tabs__icon-left" @click="onPreClick"></i>
        <swiper ref="mySwiper"
                :options="swiperOption"
                :style="{
                }">
            <swiper-slide v-for="(tab, index) in tabs"
                          :key="tab.platformId">
                <div class="game-sports-tabs-item" :class="{
                        'game-sports-tabs-item--active': curIndex === index,
                        'game-sports-tabs-item--disabled': slideDisabledIfNeeded(tab)
                    }" @click="onTabClick(index, tab)">
                    <div class="game-sports-tabs-item__content">
                        <img class="game-sports-tabs-item__icon game-sports-tabs-item__icon-night" :src="tab[nightIconField]" alt="">
                        <img class="game-sports-tabs-item__icon game-sports-tabs-item__icon-light" :src="tab[lightIconField]" alt="">
                        <span class="game-sports-tabs-item__title">{{tab[labelField]}}</span>
                    </div>
                    <img class="game-sports-tabs-item__bg game-sports-tabs-item__bg-night" :src="tab[nightBgIconField]" alt="">
                    <img class="game-sports-tabs-item__bg game-sports-tabs-item__bg-light" :src="tab[lightBgIconField]" alt="">
                    <div class="game-sports-tabs-tips animate__animated animate__infinite animate__top2bottom">
                        <span class="game-sports-tabs-tips__text">{{slideTipsText(tab)}}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <i class="game-sports-tabs__icon game-sports-tabs__icon-right" @click="onNextClick"></i>
    </div>
</template>

<script>
  export default {
    name: "GameSportsTabs",
    props: {
      value: {
        type: [Number, String],
        default: -1
      },
      swiperOption: {
        type: Object,
        default() {
          return {
            slidesPerView: 4,
            spaceBetween : 20,
          }
        }
      },
      tabs: {
        type: Array,
        default() {
          return [];
        }
      },
      lightIconField: {
        type: String,
        default: "lightBgIcon"
      },
      nightIconField: {
        type: String,
        default: "lightBgIcon"
      },
      lightBgIconField: {
        type: String,
        default: "lightBgIcon"
      },
      nightBgIconField: {
        type: String,
        default: "lightBgIcon"
      },
      labelField: {
        type: String,
        default: "label"
      },
    },
    computed: {
      curIndex: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        }
      },
      allTab() {
        return this.tabs.find(tab => {
          return tab.platformId === "-1";
        })
      },
      filterTabs() {
        return this.tabs.filter(tab => {
          return tab.platformId !== "-1";
        })
      }
    },
    watch: {
      swiperOption: {
        deep: true,
        handler(obj = {}, oldObj = {}) {
          const { slidesPerView } = obj;
          const { slidesPerView: oldSlidesPerView } = oldObj;
          if (slidesPerView !== oldSlidesPerView) {
            this.$nextTick(() => {
              this.$refs.mySwiper.destroySwiper();
              this.$refs.mySwiper.initSwiper()
            })
          }
        }
      },
      allTab: {
        deep: true,
        immediate: true,
        handler(tab) {
          if (this.tabs.length && !tab && this.curIndex === -1) {
            this.curIndex = 0;
          }
        }
      }
    },
    methods: {
      onPreClick() {
        this.$refs.mySwiper.swiperInstance.slidePrev();
      },
      onNextClick() {
        this.$refs.mySwiper.swiperInstance.slideNext();
      },
      onTabClick(index, tab) {
        if (this.slideDisabledIfNeeded(tab)) {
          return void 0;
        }
        this.curIndex = index;
        let mvIdx = index - (Math.ceil(this.swiperOption.slidesPerView / 2) - 1);
        if (mvIdx < 0) {
          mvIdx = 0;
        }
        this.$refs.mySwiper.swiperInstance.slideTo(mvIdx, 600, false);
        this.$nextTick(() => {
          this.$emit("change", index);
        })
      },
      slideDisabledIfNeeded(tab) {
        return tab.platformStatus !=='1';
      },
      slideTipsText(tab) {
        if (tab.platformStatus ==='2') {
          return this.$tex('即将上线');
        } else if (tab.platformStatus ==='3') {
          return this.$tex('维护中');
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .game-sports-tabs {
        display: flex;
        font-size: 20px;
        align-items: center;
    }
    .game-sports-tabs__icon {
        display: inline-block;
        width: 36px;
        height: 47px;
        cursor: pointer;
        background-image: url("~@/assets/images-v6/game/left.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &.game-sports-tabs__icon-right {
            background-image: url("~@/assets/images-v6/game/right.png");
        }
    }
    .swiper-container {
        flex: 1;
        width: 100%;
        margin: 0 20px;
        overflow-y: visible;
        overflow-x: clip;
    }
    .game-sports-tabs-item {
        position: relative;
        .game-sports-tabs-item__bg-night {
            visibility: visible;
        }
        .game-sports-tabs-item__bg-light {
            visibility: hidden;
        }
        .game-sports-tabs-item__icon-night {
            display: inline-block;
        }
        .game-sports-tabs-item__icon-light {
            display: none;
        }
        .game-sports-tabs-item__bg {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: contain;
            top: 0;
            left: 0;
        }
        .game-sports-tabs-item__content {
            position: relative;
            z-index: 1;
            cursor: pointer;
            color: #ddc17c;
            display: flex;
            align-items: center;
            height: 80px;
            padding-left: 30px;
        }
        &:hover, &.game-sports-tabs-item--active {
            .game-sports-tabs-item__content {
                color: #5b3e0b;
            }
            .game-sports-tabs-item__bg-night {
                visibility: hidden;
            }
            .game-sports-tabs-item__bg-light {
                visibility: visible;
            }
            .game-sports-tabs-item__icon-night {
                display: none;
            }
            .game-sports-tabs-item__icon-light {
                display: inline-block;
            }
        }
        &:not(.game-sports-tabs-item--disabled) {
            .game-sports-tabs-tips {
                visibility: hidden;
            }
        }
        .game-sports-tabs-tips {
            visibility: visible;
        }
    }
    .game-sports-tabs-item__icon {
        height: 56px;
        float: none;
        object-fit: contain;
        width: 60px;
        margin-right: 8px;
    }
    .game-sports-tabs-item__title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .game-sports-tabs-tips {
        position: absolute;
        bottom: 80px;
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
            content: "";
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
