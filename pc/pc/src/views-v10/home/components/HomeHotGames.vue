<template>
  <div class="home-hotgames">
    <div class="flex justify-center items-end gap-12 mt-20">
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_l.png"
      />
      <span
        class="text-5xl font-bold leading-11 border border-white/50 drop-shadow-[0_8px_8px_rgba(52,130,197,0.2)] bg-clip-text text-transparent bg-gradient-to-b from-[#208BFF] to-[#2FD4F6]"
        >{{ $tex("热门游戏") }}</span
      >
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_r.png"
      />
    </div>
    <p class="my-7 text-center text-base">
      {{ $tex("您想要的我们都有，带给您丰富的游戏体验") }}
    </p>
    <div class="flex justify-center gap-5 mb-12 h-10">
      <Button
        v-for="(tab, index) in tabs"
        :key="tab.code"
        shape="circle"
        class="px-9 py-4"
        :class="[tabIndex === index ? 'ivu-btn-style--2' : 'ivu-btn-style--4']"
        @click="tabIndex = index"
        >{{ tab.typeName }}</Button
      >
    </div>
    <div class="container flex justify-center">
      <div class="basis-1/2 flex justify-center items-center">
        <img
          class="absolute w-auto"
          src="~@/assets/images-v10/home/topgames_bg_1.png"
        />
        <img class="relative z-10 w-9/12" :src="curPic" />
      </div>
      <div
        class="basis-1/2 bg-[#F5F9FF] rounded-3xl border-2 border-white border-solid shadow-lg shadow-[rgba(107,168,220,0.10)]"
      >
        <div
          class="w-full h-full rounded-3xl shadow-inner shadow-[#EBF2FB] py-10 px-16"
        >
          <template v-if="curTab">
            <h2 class="font-bold text-4xl text-center pb-5">
              {{ curTab.typeName }}
            </h2>
            <p class="mb-7 text-lg font-medium text-font-accent">
              {{ curTab.content }}
            </p>
            <div class="grid grid-cols-5 gap-5">
              <game-item
                v-for="(game, index) in curTab.platformsRsps.slice(0, 10)"
                :key="index"
                :route="true"
                :name="game.typeName"
                :icon="curTab.code === 'LOTTERY' ? game.pc6Icon : game.pcIcon"
                :platformId="game.platformId"
                :gameId="game.gameId"
                :show-login-game-tip="showLoginGameTip"
                :platfromCode="curTab.code"
                :code="game.code"
                :size="'80px'"
                :panel="true"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameItem from "@/views-v10/game/components/GameItem.vue";
import { queryGameListTypes } from "@/api/game";

export default {
  name: "HomeHotGames",
  components: {
    GameItem,
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 7,
        slidesPerColumn: 2,
        slidesPerColumnFill: "row",
        pagination: {
          el: ".home-hotgames__bullets",
          clickable: true,
        },
      },
      tabs: [],
      tabIndex: 0,
      sysConfig: {},
      pics: {
        DEFAULT: require("@/assets/images-v10/home/topgames_image_Lottery.png"),
        LOTTERY: require("@/assets/images-v10/home/topgames_image_Lottery.png"),
        POKER: require("@/assets/images-v10/home/topgames_image_Arcade.png"),
        FISH: require("@/assets/images-v10/home/topgames_image_Fishing.png"),
        SLOT: require("@/assets/images-v10/home/topgames_image_Slots.png"),
        VIDEO: require("@/assets/images-v10/home/topgames_image_LiveCasino.png"),
        SPORTS: require("@/assets/images-v10/home/topgames_image_eSports.png"),
        BALL: require("@/assets/images-v10/home/topgames_image_Sports.png"),
      },
    };
  },
  computed: {
    showLoginGameTip() {
      return this.sysConfig["GAME_ACCOUNT_AUTO_TRANSFORM"] !== "0";
    },
    curTab() {
      return this.tabs[this.tabIndex];
    },
    curPic() {
      if (this.curTab) {
        return this.pics[this.curTab.code] || this.pics["DEFAULT"];
      }
      return this.pics["DEFAULT"];
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((sysConfig) => {
      this.sysConfig = sysConfig;
    });
    queryGameListTypes({ code: null }).then((res) => {
      if (res.data.code !== 0) return;
      let data = res.data.data;
      this.tabs = data.list;
      // if(data.list.length ===3) {
      //     this.gameList = data.list;
      //     return;
      // }
      // if(data.list.length === 6) {
      //     this.gameList = data.list;
      //     return;
      // }
      // for (let i = 0; i < data.list.length;i++) {
      //   const item = data.list[i] || {};
      //   const code = item.code;
      //   if ("LOTTERY" === code) {
      //     this.lotteryIntro = data.list.splice(i, 1)[0];
      //     break;
      //   }
      // }
      // this.gameList = data.list;
    });
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.home-hotgames {
  .swiper-container {
    height: 400px;
    cursor: grab;
  }
  .swiper-slide {
    height: 50%;
  }
  padding: 0 20px;
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
