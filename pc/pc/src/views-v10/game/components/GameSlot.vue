<template>
  <div class="game-slot my-12">
    <div class="game-slot__content container flex flex-col">
      <game-tabs
        v-model="curTabIndex"
        :title="$tex('电子')"
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
import gameMixin from "./gameMixin";

export default {
  name: "GameSlot",
  mixins: [gameMixin],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.game-slot {
  position: relative;
  .container {
    width: 1320px;
    margin: auto;
  }
  &__mask {
    position: absolute;
    width: 100%;
    max-height: 1360px;
    background: url("~@/assets/images-v8/home/bg.png") no-repeat;
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
    padding: 30px 0;
    background: #f5f9ff;
    border: 2px solid #ffffff;
    box-shadow: 0 0 18px 1px rgba(107, 168, 220, 0.1), inset 0 0 10px 0 #ebf2fb;
    border-radius: 16px;
  }
}
.game-tabs {
  flex-shrink: 0;
  margin-right: 20px;
}
</style>
