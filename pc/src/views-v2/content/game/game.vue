<template>
  <div class="game-layout">
    <div class="w">
      <myTitle
        :redTitle="gameInfo.typeName"
        whiteTitle=""
        :subTitle="gameInfo.pc8icon"
        textWidth="340px"
        :text="gameInfo.content"
        :img="currentLogo"
      >
      </myTitle>
      <div v-loading="loading">
        <div
          class="game-content"
          v-if="playForms.length"
        >
          <div class="game-tab">
            <swiper :options="swiperOption">
              <swiper-slide
                v-for="(item, index) in playForms"
                :key="index"
              >
                <div
                  class="game-tab-item"
                  :class="{active: curTabIndex == index,disabled:item.platformStatus !='1'&&item.platformId!=='-1' }"
                  @click="onTabItemClick(item,index)"
                >
                  <div class="name">{{item.code | subName}}</div>
                  <div
                    class="title"
                    :class="{'no-name':!item.code}"
                  >{{item.typeName|tailName}}</div>
                  <span
                    class="jjsx"
                    v-if="item.platformStatus =='2'"
                  ></span>
                  <span
                    class="whz"
                    v-if="item.platformStatus =='3'"
                  ></span>
                </div>

              </swiper-slide>
            </swiper>
            <!--以下看需要添加-->
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>

          <game-list
            :dataList="currentGameList"
            :showLoginGameTip="showLoginGameTip"
            @toggle-loading="toggleLoading"
            v-if="currentPlayForm.platformStatus=='1' || currentPlayForm.platformId==='-1'"
          ></game-list>
          <div
            v-if="currentPlayForm.platformStatus=='2'"
            class="ui-empty"
          >即将上线...</div>
          <div
            v-if="currentPlayForm.platformStatus=='3'"
            class="ui-empty"
          >维护中...</div>
          <div
            v-if="!currentPlayForm.platformStatus && currentPlayForm.platformId!=='-1'"
            class="ui-empty"
          >
            敬请期待...
          </div>

        </div>
        <div
          v-else
          class="ui-empty"
        >
          暂无数据
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import title from "@/views-v2/common/module_vue/title.vue";
import { queryGameListTypes, queryTypePlatforms } from "@/api/game";

const GetComponent = function(index) {
  return () => import(`./${index}`);
};
export default {
  name: "game",
  data() {
    return {
      curTabIndex: 0,
      playForms: [],
      currentGameList: [],
      loading: false,
      gameCode: "",
      showLoginGameTip: false, //是否显示登录游戏的额度转换提示
      swiperOption: {
        slidesPerView: 5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      gameInfo: {},
      gameImages: {
        BALL: {
          icon: require("@/assets/images/template-v2/game_bg_BALL.png")
        },
        FISH: {
          icon: require("@/assets/images/template-v2/game_bg_FISH.png")
        },
        POKER: {
          icon: require("@/assets/images/template-v2/game_bg_POKER.png")
        },
        SLOT: {
          icon: require("@/assets/images/template-v2/game_bg_SLOT.png")
        },
        SPORTS: {
          icon: require("@/assets/images/template-v2/game_bg_SPORTS.png")
        },
        VIDEO: {
          icon: require("@/assets/images/template-v2/game_bg_VIDEO.png")
        }
      }
    };
  },
  computed: {
    currentPlayForm() {
      return (this.curTabIndex >= 0 && this.playForms[this.curTabIndex]) || {};
    },
    currentLogo() {
      const gameImage = this.gameImages[this.gameCode];
      if (gameImage) {
        return gameImage.icon;
      } else {
        return "";
      }
    }
  },
  filters: {
    subName(v) {
      if (!v) return "";
      let subName = v.split("_")[0];
      return subName;
    },
    tailName(v) {
      if (!v) return "";
      return v.replace(/^([a-zA-Z0-9])+(.*)$/, (match, p1, p2) => {
        return p2;
      });
      // return v.slice(v.length - 2, v.length)
    }
  },
  watch: {
    $route: {
      handler(n) {
        this.handlerData(n.params.id);
        this.getGameInfo(n.params.id);
      },
      deep: true
    }
  },
  mounted() {},
  async created() {
    this.gameList = {};
    let code = this.$route.params.id;
    let sysData = await this.$store.dispatch("querySystemConfig");
    this.showLoginGameTip =
      sysData["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
    this.handlerData(code);
    this.getGameInfo(code);
  },
  methods: {
    getGameInfo(code) {
      let newCode = code.includes("_") ? code.split("_")[1] : code;
      queryGameListTypes({ code: newCode }).then(res => {
          const { code, data } = res.data;
          if (code !== 0) return;
          const { list } = data;
          if (list.length > 0) {
            this.gameInfo = list[0];
          }
        });
    },
    toggleLoading(val) {
      this.loading = val;
    },
    handlerData(code) {
      if (code) {
        let newCode = code.includes("_") ? code.split("_")[1] : code;
        this.loading = true;
        this.gameCode = newCode;
        queryTypePlatforms({ code: newCode }).then(res => {
            this.loading = false;
            if (res.data.code !== 0) return;
            this.playForms = res.data.data.list.filter(
              item => item.platformStatus != "0"
            );
            // let normalStatusItemIndex = 0
            // for (let i = 0; i < this.playForms.length; i++) {
            //   if (this.playForms[i] == '1') {
            //     normalStatusItemIndex = i
            //   }
            // }
            if (this.playForms.length) {
              if (code === "FISH") {
                //点击捕鱼按钮进来
                this.curTabIndex = 0;
                this.currentGameList = this.playForms[0].children;
              } else {
                this.curTabIndex = this.playForms.findIndex(
                  item => item.code === code && item.platformStatus !== "2"
                );
                if (this.curTabIndex == -1) {
                  //可能不存在
                  this.curTabIndex = 0;
                  code = this.playForms[0].code;
                } else {
                  code = this.playForms[this.curTabIndex].code;
                }
                if (code) {
                  this.fetchGameList(code);
                } else {
                  this.currentGameList = this.playForms[0].children;
                }
              }
            } else {
              this.curTabIndex = 0;
              this.currentGameList = [];
            }
          });
      }
    },
    fetchGameList(code) {
      if (!this.gameList[code]) {
        this.loading = true;
        this.$http
          .post(
            "/party/v2/game/queryPlatformGames",
            { code: code },
            { unenc: true }
          )
          .then(res => {
            this.loading = false;
            if (res.data.code !== 0) return;
            let data = res.data.data.list;
            this.currentGameList = this.gameList[code] = data;
          });
      } else {
        this.fetchCurrentGameList(code);
      }
    },
    fetchCurrentGameList(code) {
      let { playForms, gameList, curTabIndex } = this;
      if (playForms.length) {
        this.currentGameList = this.gameList[code];
      } else {
        this.currentGameList = [];
      }
    },
    onTabItemClick(info, index) {
      if (info.platformStatus !== "1" && info.platformId !== "-1") return;
      this.curTabIndex = index;
      if (info.platformId === "-1") {
        this.currentGameList = info.children;
      } else {
        this.fetchGameList(info.code);
      }
    }
  },
  components: {
    gameList: GetComponent("gameList"),
    myTitle: title
  }
};
</script>
<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";
@deep: ~">>>";
.game-layout {
  background-image: url("@{imgSrc}/bg.png");
  background-position: center -216px;
  background-repeat: repeat no-repeat;
  min-height: 900px;
  padding-bottom: 300px;
}
.game-content {
  background-color: #141522;
  box-shadow: 0 0 10px 2px #11121d;
  border: none;
  position: relative;
  z-index: 2;
  .ui-empty {
    padding: 150px 0;
  }
}
.game-tab {
  padding: 0 60px;
  height: 110px;
  background-color: #0f111d;
  position: relative;
  .swiper-button-next,
  .swiper-button-prev {
    background: none;
    line-height: 44px;
    outline: none;
    &.swiper-button-disabled {
      opacity: 0.1;
    }
    &:after {
      content: "";
      display: inline-block;
      border: 10px solid transparent;
    }
  }
  .swiper-button-prev {
    &:after {
      border-right-color: #ed1459;
    }
  }
  .swiper-button-next {
    &:after {
      border-left-color: #ed1459;
    }
  }
  .game-tab-item {
    cursor: pointer;
    display: block;
    height: 110px;
    padding-top: 20px;
    width: 100%;
    text-align: center;
    color: #3f4767;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      right: -2px;
      top: 50%;
      margin-top: -20px;
      width: 2px;
      height: 40px;
      background-color: #242738;
    }
    &.disabled {
      cursor: not-allowed;
    }
    .jjsx,
    .whz {
      position: absolute;
      right: -10px;
      top: -3px;
      width: 63px;
      height: 31px;
      z-index: 1;
    }
    .jjsx {
      background: url("../../../assets/images/jjsx.gif");
    }
    .whz {
      background: url("../../../assets/images/whz.gif");
    }
    .name {
      line-height: 30px;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .title {
      font-size: 15px;
    }
    .no-name {
      line-height: 55px;
      font-size: 30px;
      font-weight: bold;
    }
    .en {
      font-size: 12px;
    }
    &.active,
    &:hover {
      background-color: #ed1459;
      .title,
      .name {
        color: #fff;
      }
    }
  }
}

.middle:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
.game-btn {
  margin: -200px auto 0;
  color: #fff;
  height: 34px;
  line-height: 34px;
  width: 220px;
  text-align: center;
  font-size: 16px;
  border-radius: 40px;
  background-color: #ed1459;
  letter-spacing: 3px;
  box-shadow: inset 0px 0px 8px 5px #f25876;
}
</style>
