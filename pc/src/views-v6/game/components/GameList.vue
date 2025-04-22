<template>
    <div class="game-list-wrap">
        <div class="game-list-scroll">
            <ul class="game-list">
                <li v-for="(game, index) in games" :key="game.gameId" class="game-list-item">
                    <div class="game-list-item__content">
                        <img class="game-list-item__img" :src="game.gameIcon" alt="">
                        <span class="game-list-item__title">{{game.gameName}}</span>
                        <div class="game-list-item__mask">
                            <Button class="game-list-item__btn animate__animated animate__fast" type="primary" shape="circle" @click="onPlayClick(index)">{{$tex("立即游戏")}}</Button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <Spin v-if="loading" class="ivu-spin--dark" fix></Spin>
        <span v-if="tipsText" class="glitch" :data-text="tipsText">{{tipsText}}</span>
    </div>
</template>

<script>
  import GameTabs from "./GameTabs";

  export default {
    name: "GameList",
    props: {
      tab: {
        type: Object,
        default() {
          return {};
        }
      },
      games: {
        type: Array,
        default() {
          return [];
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    components: {
      GameTabs
    },
    computed: {
      tipsText() {
        if (this.loading) {
          return false;
        }
        if (this.tab.platformStatus ==='2') {
          return this.$tex('即将上线');
        } else if (this.tab.platformStatus ==='3') {
          return this.$tex('维护中');
        } else if (!this.games.length) {
          return this.$tex("暂无数据");
        }
      }
    },
    methods: {
      onPlayClick(index) {
        this.$emit("game-click", index);
      }
    }
  }
</script>

<style scoped lang="less">
    .game-list-wrap {
        position: relative;
        margin: 20px -10px 0;
    }
    .game-list-scroll {
        height: 760px;
        overflow: auto;
    }
    .game-list {
        display: flex;
        flex-wrap: wrap;
        color: #ffffff;
        font-size: 14px;
    }
    .game-list-item {
        padding: 10px;
        width: 20%;
    }
    .game-list-item__content {
        height: 230px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #666666;
        border-radius: 10px;
        cursor: pointer;
        padding-top: 30px;
        position: relative;
        overflow: hidden;
        &:hover {
            border-color: #a6833f;
            .game-list-item__mask {
                opacity: 1;
            }
        }
    }
    .game-list-item__mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity .4s ease-in-out;
    }
    .game-list-item__img {
        width: 130px;
        height: 110px;
        object-fit: contain;
    }
    .game-list-item__title {
        margin-top: 40px;
        text-align: center;
    }
    .game-list-item__btn {
        min-width: 130px;
        height: 36px;
        font-size: 16px;
        &:hover {
            color: #ffffff;
            animation-name: pulse;
            animation-timing-function: ease-in-out;
        }
    }
    .glitch {
        position: absolute;
        top: 50%;
        margin-top: -60px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 60px;
        font-weight: 700;
    }
</style>
