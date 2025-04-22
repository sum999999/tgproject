<template>
    <div class="game-poker-wrap">
        <div class="game-poker-wrap-bg"></div>
        <div class="container">
            <div class="game-poker">
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

  export default {
    name: "GamePoker",
    mixins: [gameMixin]
  }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .game-poker-wrap {
        position: relative;
        height: 1120px;
        background: url("~@/assets/images-v6/game/qipaibg.png") no-repeat center center;
        background-size: cover;
    }
    .game-poker-wrap-bg {
        position: absolute;
        background: url("~@/assets/images-v6/game/qipaibg_2.png") no-repeat center top;
        background-size: auto 100%;
        height: 100%;
        width: 100%;
    }
    .container {
        position: relative;
        z-index: 1;
    }
    .game-poker {
        padding: 298px 70px 0;
        @{deep} {
            .game-search-input {
                display: flex;
                justify-content: flex-end;
                padding-bottom: 15px;
            }
            .search-input {
                color: #666666;
                input {
                    background-color: #121c23;
                    border-color: transparent;
                }
            }
            .game-list-scroll {
                height: 660px;
                &::-webkit-scrollbar-track-piece, ::-webkit-scrollbar-track-piece {
                    background: #121c23;
                }
                &::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb {
                    background: #20383b;
                }
            }
            .game-tabs {
                border-color: transparent;
                background-color: #121c23;
            }
            .game-tabs__icon.game-tabs__icon-left, .game-tabs__icon.game-tabs__icon-right {
                border-color: #20383b;
            }
            .game-tabs__icon {
                -webkit-text-fill-color: #999999;
                color: #999999;
            }
        }
    }
</style>
