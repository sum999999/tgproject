<template>
    <div ref="wrap" v-parallax:2="'.game-fish-wugui'" class="game-fish-wrap">
        <canvas-bubbles ref="bubbles" :resize="bubblesResize"></canvas-bubbles>
        <div class="container">
            <div class="game-fish-wugui"></div>
            <div class="game-fish">
                <game-search-input v-model="searchValue"></game-search-input>
                <game-tabs v-model="curTabIndex" :tabs="tabs"  icon-field="pc2Icon" label-field="typeName" @change="onTabChange"></game-tabs>
                <game-list :tab="curAllTab" :games="games" :loading="gameLoading" @game-click="onGameClick"></game-list>
            </div>
        </div>
        <game-amount-convert-dialog v-model="showConvertAmountTips" @login-game="loginGame" @cancel="onGameCancel"></game-amount-convert-dialog>
    </div>
</template>

<script>
  import gameMixin from "./gameMixin";
  import CanvasBubbles from "@/components/CanvasBubbles";

  export default {
    name: "GameFish",
    mixins: [gameMixin],
    components: {
      CanvasBubbles
    },
    mounted() {
      document.addEventListener('mousemove', this.mouseMove);
    },
    beforeDestroy() {
      document.removeEventListener('mousemove', this.mouseMove);
    },
    methods: {
      bubblesResize() {
        return {
          width: document.body.scrollWidth,
          height: this.$refs.wrap.offsetHeight
        }
      },
      mouseMove(event) {
        if (this.$refs.wrap.contains(event.target)) {
          this.$refs.bubbles.updateMouse(event.clientX, event.pageY - this.$refs.wrap.offsetTop);
        }
      }
    }
  }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .game-fish-wrap {
        background: url("~@/assets/images-v6/game/buyubg.png") no-repeat center bottom;
        background-size: cover;
    }
    .container {
        padding: 40px 0;
        position: relative;
        .game-fish-wugui {
            display: block;
            position: absolute;
            left: -230px;
            top: 0;
            width: 280px;
            height: 246px;
            background: url("~@/assets/images-v6/game/haigui.png") no-repeat;
            background-size: contain;
        }
    }
    .game-fish {
        padding: 30px 75px;
        border-radius: 10px;
        background-color: rgba(1,100,176, .5);
        @{deep} {
            .game-search-input {
                display: flex;
                justify-content: flex-end;
                padding-bottom: 15px;
            }
            .search-input {
                ::-webkit-input-placeholder { /* WebKit browsers */
                    color: #00a0e9;
                }
                ::-moz-placeholder { /* Mozilla Firefox 19+ */
                    color: #00a0e9;
                }
                :-ms-input-placeholder { /* Internet Explorer 10+ */
                    color: #00a0e9;
                }
                color: #00a0e9;
                input {
                    background-color: #062c73;
                    border-color: transparent;
                    color: #00a0e9;
                }
            }
            .game-list-scroll {
                &::-webkit-scrollbar-track-piece, ::-webkit-scrollbar-track-piece {
                    background: #062c73;
                }
                &::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb {
                    background: #052868;
                }
            }
            .game-tabs {
                border-color: transparent;
                background-color: #062c73;
            }
            .game-tabs__all {
                color: #00a0e9;
                &.game-tabs__all--active, &:hover {
                    color: #ddc17c;
                }
            }
            .game-tabs-item {
                color: #00a0e9;
                &:hover, &.game-tabs-item--active {
                    color: #ddc17c;
                }
            }
            .game-tabs__icon.game-tabs__icon-left, .game-tabs__icon.game-tabs__icon-right {
                border-color: transparent;
            }
            .game-tabs__icon {
                -webkit-text-fill-color: #00a0e9;
                color: #00a0e9;
            }
            .game-list-item__content {
                border-color: #00a0e9;
                &:hover {
                    border-color: #00ffff;
                }
            }
            .game-list-item__mask {
                background-color: rgba(5,40,104, .7);
                .ivu-btn-primary {
                    color: #0d50a3;
                    background-image: linear-gradient(to top, #00b7ee, #00ffff);
                }
            }
            .ivu-spin--dark {
                background-color: rgba(6,44,115, .5);
            }
        }
    }
</style>
