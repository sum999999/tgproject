<template>
  <div class="game-list">
    <div class="game-list__card">

      <div class="game-list__content">
        <span
          v-if="tipsText"
          class="glitch"
          :data-text="tipsText"
        >{{tipsText}}</span>
        <game-search-input v-model="searchValue"></game-search-input>
        <swiper
          ref="mySwiper"
          class="home-board-menu"
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
      </div>
      <div class="game-list__bullets"></div>
    </div>
    <Spin
      v-if="loading"
      class="ivu-spin--dark"
      fix
    ></Spin>

  </div>
</template>

<script>
import GameTabs from './GameTabs'
import GameSearchInput from './GameSearchInput'
import GameItem from '@/views-v10/game/components/GameItem.vue'

export default {
  name: 'GameList',
  components: {
    GameTabs,
    GameSearchInput,
    GameItem,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    tab: {
      type: Object,
      default() {
        return {}
      },
    },
    games: {
      type: Array,
      default() {
        return []
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 8,
        slidesPerColumn: 3,
        slidesPerColumnFill: 'row',
        pagination: {
          el: '.game-list__bullets',
          clickable: true,
        },
        sysConfig: {},
      },
    }
  },
  computed: {
    searchValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
    tipsText() {
      if (this.loading) {
        return
      }
      if (this.tab.platformStatus === '2') {
        return this.$tex('即将上线')
      } else if (this.tab.platformStatus === '3') {
        return this.$tex('维护中')
      }
    },
    showLoginGameTip() {
      return this.sysConfig['GAME_ACCOUNT_AUTO_TRANSFORM'] !== '0'
    },
  },
  created() {
    this.$store.dispatch('querySystemConfig').then((sysConfig) => {
      this.sysConfig = sysConfig
    })
  },
  methods: {
    onPlayClick(index) {
      this.$emit('game-click', index)
    },
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.game-search-input {
  display: flex;
  justify-content: end;
}
.game-list {
  .swiper-container {
    padding-top: 20px;
    height: 606px;
  }
  .swiper-slide {
    height: 33.3333%;
  }
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
    border-radius: 16px;
  }
  &__content {
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
        background: rgb(--tg-accent);
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
    > .game-list__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom, #f7d139, #efbe16);
      display: none;
      opacity: 0.5;
      border-radius: 20px;
    }
    > .game-list__mask2 {
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
      .game-list__img > .game-list__mask {
        display: block;
      }
      .game-list__img > .game-list__mask2 {
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
.glitch {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>
