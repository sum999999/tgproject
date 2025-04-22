<template>
  <div class="game-tabs">
    <div class="game-tabs__header">{{ title }}</div>
    <swiper
      ref="mySwiper"
      :options="swiperOption"
      :style="{
                }"
    >
      <swiper-slide
        v-for="(tab, index) in filterTabs"
        :key="tab.platformId"
      >
        <div
          class="game-tabs-item"
          :class="{
                        'game-tabs-item--active': curIndex === index,
                        'game-tabs-item--disabled': slideDisabledIfNeeded(tab)
                    }"
          @click="onTabClick(index, tab)"
        >
          <img
            class="game-tabs-item__icon"
            :src="curIndex === index ? tab[iconActiveField] : tab[iconField]"
            alt=""
          >
          <div class="game-tabs-tips animate__animated animate__infinite animate__top2bottom">
            <span class="game-tabs-tips__text">{{slideTipsText(tab)}}</span>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
export default {
  name: 'GameTabs',
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: -1,
    },
    swiperOption: {
      type: Object,
      default() {
        return {
          spaceBetween: 10,
          slidesPerView: 10,
          direction: 'vertical',
          height: 72,
        }
      },
    },
    tabs: {
      type: Array,
      default() {
        return []
      },
    },
    labelField: {
      type: String,
      default: 'typeName',
    },
    iconField: {
      type: String,
      default: 'pc2Icon',
    },
    iconActiveField: {
      type: String,
      default: 'pc3Icon',
    },
  },
  computed: {
    curIndex: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    allTab() {
      return this.tabs.find((tab) => {
        return tab.platformId === '-1'
      })
    },
    filterTabs() {
      return this.tabs.filter((tab) => {
        return tab.platformId !== '-1'
      })
    },
  },
  watch: {
    swiperOption: {
      deep: true,
      handler(obj = {}, oldObj = {}) {
        const { slidesPerView } = obj
        const { slidesPerView: oldSlidesPerView } = oldObj
        if (slidesPerView !== oldSlidesPerView) {
          this.$nextTick(() => {
            this.$refs.mySwiper.destroySwiper()
            this.$refs.mySwiper.initSwiper()
          })
        }
      },
    },
    allTab: {
      deep: true,
      immediate: true,
      handler(tab) {
        if (this.tabs.length && !tab && this.curIndex === -1) {
          this.curIndex = 0
        }
      },
    },
  },
  methods: {
    onPreClick() {
      this.$refs.mySwiper.swiperInstance.slidePrev()
    },
    onNextClick() {
      this.$refs.mySwiper.swiperInstance.slideNext()
    },
    onTabClick(index, tab) {
      if (this.slideDisabledIfNeeded(tab)) {
        return void 0
      }
      this.curIndex = index
      let mvIdx = index - (Math.ceil(this.swiperOption.slidesPerView / 2) - 1)
      if (mvIdx < 0) {
        mvIdx = 0
      }
      this.$refs.mySwiper.swiperInstance.slideTo(mvIdx, 600, false)
      this.$nextTick(() => {
        this.$emit('change', index)
      })
    },
    onAllClick() {
      this.curIndex = -1
      this.$refs.mySwiper.swiperInstance.slideTo(0, 600, false)
      this.$nextTick(() => {
        this.$emit('change', this.curIndex)
      })
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

<style scoped lang="less">
.game-tabs {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  border-radius: 10px;
  overflow: hidden;
  background: #060606;
  background-image: linear-gradient(180deg, #1a1a1a 0%, #323232 100%);
  width: 200px;
  position: relative;
  &__header {
    text-transform: uppercase;
    background: #282728;
    font-family: PingFang-SC-Heavy;
    font-size: 20px;
    color: #ffd427;
    padding: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 1;
  }
}
.swiper-container {
  flex: 1;
  width: 100%;
  height: 744px;

  z-index: 0;
  position: relative;
  padding: 10px 22px;
  margin-top: 56px;
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
  &:hover:not(.game-tabs-item--disabled),
  &.game-tabs-item--active {
    color: #ddc17c;
    background: #3e3e3e;
    background-image: linear-gradient(0deg, #1a1a1a 0%, #404040 100%);
    box-shadow: 0 0 22px 1px rgba(255, 210, 0, 0.1), inset 0 1px 0 0 #fed136, inset 0 0 20px 0 rgba(254, 209, 54, 0.35);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      right: -16px;
      display: block;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid #efbe16;
    }
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
.game-tabs__all {
  cursor: pointer;
  display: flex;
  align-items: center;
  /*width: 80px;*/
  color: #999999;
  padding: 15px 15px 15px 15px;
  &.game-tabs__all--active,
  &:hover {
    color: #ddc17c;
  }
}
.game-tabs-item__icon {
  float: none;
  object-fit: contain;
  width: 103px;
  height: 30px;
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
  bottom: 66%;
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
