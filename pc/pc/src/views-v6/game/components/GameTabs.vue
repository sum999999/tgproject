<template>
    <div class="game-tabs">
        <Icon class="game-tabs__icon game-tabs__icon-left" type="chevron-left" @click.native="onPreClick"></Icon>
        <span v-if="allTab" class="game-tabs__all" :class="{
                'game-tabs__all--active': curIndex === -1
            }" @click="onAllClick">{{$tex("全部")}}</span>
        <swiper ref="mySwiper"
                :options="swiperOption"
                :style="{
                }">
            <swiper-slide v-for="(tab, index) in filterTabs"
                          :key="tab.platformId">
                <div class="game-tabs-item" :class="{
                        'game-tabs-item--active': curIndex === index,
                        'game-tabs-item--disabled': slideDisabledIfNeeded(tab)
                    }" @click="onTabClick(index, tab)">
                    <img class="game-tabs-item__icon" :src="tab[iconField]" alt="">
                    <span class="game-tabs-item__title">{{tab[labelField]}}</span>
                    <div class="game-tabs-tips animate__animated animate__infinite animate__top2bottom">
                        <span class="game-tabs-tips__text">{{slideTipsText(tab)}}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <Icon class="game-tabs__icon game-tabs__icon-right" type="chevron-right" @click.native="onNextClick"></Icon>
    </div>
</template>

<script>
  export default {
    name: "GameTabs",
    props: {
      value: {
        type: [Number, String],
        default: -1
      },
      swiperOption: {
        type: Object,
        default() {
          return {
            slidesPerView: 6,
            spaceBetween : 10,
          }
        }
      },
      tabs: {
        type: Array,
        default() {
          return [];
        }
      },
      labelField: {
        type: String,
        default: "label"
      },
      iconField: {
        type: String,
        default: "icon"
      }
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
      onAllClick() {
        this.curIndex = -1;
        this.$refs.mySwiper.swiperInstance.slideTo(0, 600, false);
        this.$nextTick(() => {
          this.$emit("change", this.curIndex);
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
    .game-tabs {
        display: flex;
        font-size: 18px;
        background-color: #000000;
        border-radius: 10px;
        border: 1px solid #a6833f;
    }
    .game-tabs__icon {
        width: 28px;
        padding: 19px 0;
        background-image: -webkit-gradient(linear, 0 bottom, 0 top, color-stop(0%, #b48132), color-stop(50%, #fae0af), color-stop(100%, #b48132));
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &.game-tabs__icon-left {
            border-right: 1px solid #a6833f;
        }
        &.game-tabs__icon-right {
            border-left: 1px solid #a6833f;
        }
    }
    .swiper-container {
        flex: 1;
        width: 100%;
        overflow-y: visible;
        overflow-x: clip;
    }
    .game-tabs-item {
        position: relative;
        cursor: pointer;
        color: #999999;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        &:hover, &.game-tabs-item--active {
            color: #ddc17c;
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
    .game-tabs__all {
        cursor: pointer;
        display: flex;
        align-items: center;
        /*width: 80px;*/
        color: #999999;
        padding: 15px 15px 15px 15px;
        &.game-tabs__all--active, &:hover {
            color: #ddc17c;
        }
    }
    .game-tabs-item__icon {
        height: 26px;
        float: none;
        object-fit: contain;
        width: 60px;
        margin-right: 8px;
    }
    .game-tabs-item__title {
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
        word-break: break-all;
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
