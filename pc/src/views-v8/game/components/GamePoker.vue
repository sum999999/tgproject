<template>
  <div class="game-poker">
    <div class="game-poker__mask"></div>
    <div class="game-poker__content container">
      <game-tabs
        v-model="curTabIndex"
        :title="$tex('棋牌')"
        :tabs="tabs"
        @change="onTabChange"
      ></game-tabs>
      <game-list
        v-model="searchValue"
        :tab="curAllTab"
        :games="games"
        :loading="gameLoading"
        @game-click="onGameClick"
      ></game-list>
    </div>
    <game-amount-convert-dialog
      v-model="showConvertAmountTips"
      @login-game="loginGame"
      @cancel="onGameCancel"
    ></game-amount-convert-dialog>
  </div>
</template>

<script>
import gameMixin from './gameMixin'

export default {
  name: 'GamePoker',
  mixins: [gameMixin],
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.game-poker {
  position: relative;
  &__mask {
    position: absolute;
    width: 100%;
    max-height: 1360px;
    background: url('~@/assets/images-v8/home/bg.png') no-repeat;
    background-size: cover;
    top: -20px;
    bottom: 0;
    left: 0;
    right: 0;
    background-position: center top;
    filter: brightness(0.4);
  }
  &__content {
    display: flex;
    position: relative;
    z-index: 1;
    height: 800px;
    padding: 30px 0;
  }
}
.game-tabs {
  flex-shrink: 0;
  margin-right: 20px;
}
</style>
