<template>
  <div class="home-collection">

    <div class="home-collection__title">
      <img src="~@/assets/images-v8/home/my-collection.png" />
      <span>{{ $tex('我的收藏') }}</span>
    </div>
    <div
      v-show="collectGames.length"
      class="home-collection__card"
    >
      <div class="home-collection__content">
        <swiper
          ref="mySwiper"
          class="home-board-menu"
          :options="swiperOption"
        >
          <swiper-slide
            v-for="(game) in collectGames"
            :key="game.userFavoritesId"
          >
            <game-item
              :name="game.linkName"
              :icon="game.linkIcon"
              :platform-id="parseGameLink(game.link).platformId"
              :game-id="parseGameLink(game.link).gameId"
              :platform-code="parseGameLink(game.link).platformCode"
              :show-login-game-tip="showLoginGameTip"
              :user-favorites-id="game.userFavoritesId"
            />
          </swiper-slide>
        </swiper>
      </div>
      <div
        class="home-collection__bullets"
        v-show="collectGames.length"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GameItem from '@/views-v8/game/components/GameItem.vue'

export default {
  name: 'HomeCollection',
  components: {
    GameItem,
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 7,
        pagination: {
          el: '.home-collection__bullets',
          clickable: true,
        },
      },
      sysConfig: {},
    }
  },
  computed: {
    ...mapGetters(['user', 'collectGames']),
    showLoginGameTip() {
      return this.sysConfig['GAME_ACCOUNT_AUTO_TRANSFORM'] !== '0'
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(n, o) {
        if (n.userId) {
          this.$store.dispatch('queryFavoritesList', {
            userId: this.user.userId,
            parentId: 0,
          })
        }
      },
    },
  },
  created() {
    this.$store.dispatch('querySystemConfig').then((sysConfig) => {
      this.sysConfig = sysConfig
    })
  },
  methods: {
    parseGameLink(link) {
      const arr = (link || '').split(',')
      return {
        platformId: arr[0],
        gameId: arr[1],
        platformCode: arr[1],
      }
    },
  },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-collection {
  padding: 0 20px;
  .swiper-container {
    min-height: 186px;
  }
  &__title {
    display: flex;
    align-items: center;
    margin: 15px 0;
    img {
      width: 35px;
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
    > .home-collection__mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom, #f7d139, #efbe16);
      display: none;
      opacity: 0.5;
      border-radius: 20px;
    }
    > .home-collection__mask2 {
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
      .home-collection__img > .home-collection__mask {
        display: block;
      }
      .home-collection__img > .home-collection__mask2 {
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