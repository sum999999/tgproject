<template>
    <div class="home-board-menu-wrap">
        <div class="home-board-menu-pre" @click="onPreClick">
            <Icon type="chevron-up"></Icon>
        </div>
        <swiper ref="mySwiper"
                class="home-board-menu"
                :options="swiperOption"
                :style="{
                }">
            <swiper-slide v-for="(menu, index) in filterMenus"
                          :key="index">
                <div class="home-board-menu-item" :class="{
                        'home-board-menu-item--active': curIndex === index
                    }" @click="onMenuClick(index)">
                    <div class="home-board-menu-item__content" :title="menu[labelField]">
                        <img class="home-board-menu-item__icon home-board-menu-item__icon-light" :src="menu[lightIconField]" alt="">
                        <img class="home-board-menu-item__icon home-board-menu-item__icon-night" :src="menu[nightIconField]" alt="">
                        <span class="home-board-menu-item__title">{{menu[labelField]}}</span>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <div class="home-board-menu-next" @click="onNextClick">
            <Icon type="chevron-down"></Icon>
        </div>
    </div>
</template>

<script>
  export default {
    name: "HomeBoardMenu",
    props: {
      value: {
        type: [Number, String],
        default: 0
      },
      swiperOption: {
        type: Object,
        default() {
          return {
            slidesPerView: 7,
            direction : 'vertical'
          }
        }
      },
      menus: {
        type: Array,
        default() {
          return [];
        }
      },
      lightIconField: {
        type: String,
        default: "lightIcon"
      },
      nightIconField: {
        type: String,
        default: "lightIcon"
      },
      labelField: {
        type: String,
        default: "name"
      }
    },
    data() {
      return {
      };
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
      filterMenus() {
        return this.menus.filter(nav => {
          return nav.platformId !== "-1";
        });
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
      }
    },
    methods: {
      onPreClick() {
        this.$refs.mySwiper.swiperInstance.slidePrev();
      },
      onNextClick() {
        this.$refs.mySwiper.swiperInstance.slideNext();
      },
      onMenuClick(index) {
        this.curIndex = index;
        let mvIdx = index - (Math.ceil(this.swiperOption.slidesPerView / 2) - 1);
        if (mvIdx < 0) {
          mvIdx = 0;
        }
        this.$refs.mySwiper.swiperInstance.slideTo(mvIdx, 600, false);
        this.$nextTick(() => {
          this.$emit("change", index);
        })
      }
    }
  }
</script>

<style scoped lang="less">
    .home-board-menu-wrap {
        width: 200px;
        background-color: #26252b;
        display: flex;
        flex-direction: column;
        border-radius: 10px 0 0 10px;
    }
    .home-board-menu {
        overflow: hidden;
        flex: 1;
        width: 100%;
        height: 100%;
        .swiper-wrapper .swiper-slide:nth-last-child(1) .home-board-menu-item{
            border-bottom: none;
        }
    }
    .home-board-menu-item {
        border-bottom: 1px solid #1f1c1c;
        cursor: pointer;
        color: #ddc17c;
        .home-board-menu-item__icon-light {
            display: inline-block;
        }
        .home-board-menu-item__icon-night {
            display: none;
        }
        &:hover, &.home-board-menu-item--active {
            color: #5b3e0b;
            background-image: linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99);
            .home-board-menu-item__icon-light {
                display: none;
            }
            .home-board-menu-item__icon-night {
                display: inline-block;
            }
        }
    }
    .home-board-menu-pre {
        border-bottom: 1px solid #1f1c1c;
    }
    .home-board-menu-next {
        border-top: 1px solid #1f1c1c;
    }
    .home-board-menu-next, .home-board-menu-pre {
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        color: #ddc17c;
        font-size: 14px;
        text-align: center;
        &:hover {
            background-color: #1e1d24;
        }
    }
    .home-board-menu-item__content {
        padding: 15px 0;
        display: flex;
        align-items: center;
    }
    .home-board-menu-item__icon {
        height: 26px;
        width: 76px;
        object-fit: contain;
    }
    .home-board-menu-item__title {
        flex: 1;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        font-size: 16px;
    }
</style>
