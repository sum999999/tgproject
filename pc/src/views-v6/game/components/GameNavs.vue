<template>
    <ul class="game-navs">
        <li v-for="(nav, index) in filterNavs" :key="index" class="game-navs-item">
            <div class="game-navs-item__content" :class="{
            'game-navs-item__content--active': curIndex === index,
            'game-navs-item--disabled': slideDisabledIfNeeded(nav)
        }" @click="onNavClick(index, nav)">
                <img class="game-navs-item__img game-navs-item__light" :src="nav[lightIconField]" alt="">
                <img class="game-navs-item__img game-navs-item__night" :src="nav[nightIconField]" alt="">
                <span class="game-navs-item__title">{{nav[labelField]}}</span>
                <div class="game-navs-tips animate__animated animate__infinite animate__top2bottom">
                    <span class="game-navs-tips__text">{{slideTipsText(nav)}}</span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
  export default {
    name: "GameNavs",
    props: {
      value: {
        type: [Number, String],
        default: 0
      },
      navs: {
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
      },
    },
    data() {
      return {
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
      filterNavs() {
        return this.navs.filter(nav => {
          return nav.platformId !== "-1";
        }).slice(0, 6)
      }
    },
    methods: {
      onNavClick(index, nav) {
        if (this.slideDisabledIfNeeded(nav)) {
          return void 0;
        }
        this.curIndex = index;
        this.$nextTick(() => {
          this.$emit("change", index);
        })
      },
      slideDisabledIfNeeded(nav) {
        return nav.platformStatus !=='1';
      },
      slideTipsText(nav) {
        if (nav.platformStatus ==='2') {
          return this.$tex('即将上线');
        } else if (nav.platformStatus ==='3') {
          return this.$tex('维护中');
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .game-navs {
        display: flex;
        margin: 0 -10px;
    }
    .game-navs-item {
        padding: 10px;
        width: 16.6667%;
        .game-navs-item__content {
            &.game-navs-item__content--active, &:hover {
                background: url("~@/assets/images-v6/game/btn_xz.png") no-repeat center center;
                background-size: contain;
                transform: translate3d(0, -20px, 0);
                .game-navs-item__title {
                    color: #3a170c;
                }
                .game-navs-item__light {
                    display: none;
                }
                .game-navs-item__night {
                    display: block;
                }
            }
        }
    }
    .game-navs-item__content {
        position: relative;
        padding: 16px;
        height: 136px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: url("~@/assets/images-v6/game/btn.png") no-repeat center center;
        background-size: contain;
        cursor: pointer;
        transition: transform .4s ease-in-out;
        &:not(.game-navs-item--disabled) {
            .game-navs-tips {
                visibility: hidden;
            }
        }
        .game-navs-tips {
            visibility: visible;
        }
    }
    .game-navs-item__img {
        height: 38px;
        object-fit: contain;
        float: none;
        &.game-navs-item__light {
            display: block;
        }
        &.game-navs-item__night {
            display: none;
        }
    }
    .game-navs-item__title {
        margin-top: 8px;
        font-size: 16px;
        color: #ddc17c;
        transition: color .4s ease-in-out;
        text-align: center;
        display: inline-block;
        max-width: 114px;
        word-break: break-word;
    }
    .game-navs-tips {
        position: absolute;
        bottom: 140px;
        right: 0;
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
