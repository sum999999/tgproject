<template>
    <span v-if="isInternational" class="example example-play" @click="togglePlayRule">
        <Icon type="ios-tennisball-outline"></Icon>&nbsp;&nbsp;{{$tex("游戏玩法")}}
        <div v-show="lotteryBuyLotteryShowPlayRule" class="example-play__content" @click.stop>
            <div class="example-play__header">
                <div v-for="(item, index) in lotteryTypeRuleList" :key="item.lotteryTypeRuleId" class="example-play__item" :class="{
                        active: index === curRuleIndex
                    }" @click="onPlayRuleItem(item.lotteryTypeRuleId)">{{item.name}}</div>
            </div>
            <div class="example-play__body" v-html="lotteryTypeRuleList[curRuleIndex] && lotteryTypeRuleList[curRuleIndex].ruleDesc"></div>
        </div>
    </span>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "playRuleButton",
    data() {
      return {
        lotteryTypeRuleList: []
      };
    },
    computed: {
      ...mapGetters(["lotteryBuyLotteryType", "lotteryBuyLotteryShowPlayRule", "isInternational"]),
      curRuleIndex() {
        for (let index = 0; index < this.lotteryTypeRuleList.length; index++) {
          if (this.lotteryTypeRuleList[index].lotteryTypeRuleId === this.lotteryBuyLotteryType) {
            return index;
          }
        }
        return 0;
      }
    },
    created() {
      this.queryLotteryTypeRuleList();
    },
    beforeDestroy() {
      this.$store.commit("SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE", false);
    },
    methods: {
      async queryLotteryTypeRuleList() {
        this.lotteryTypeRuleList = await this.$store.dispatch("queryLotteryTypeRuleList");
      },
      onPlayRuleItem(lotteryTypeRuleId) {
        this.$store.commit("SET_LOTTERY_BUY_LOTTERY_TYPE", `${lotteryTypeRuleId}`);
      },
      togglePlayRule() {
        this.$store.commit("SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE", !this.lotteryBuyLotteryShowPlayRule);
      }
    }
  }
</script>

<style scoped lang="less">
    .example-play {
        position: relative;
        cursor: pointer;
        display: block;
    }
    .example-play__content {
        position: absolute;
        width: 400px;
        border: 1px solid @primary-color;
        top: 100%;
        right: 0;
        background-color: #ffffff;
        border-radius: 6px;
        overflow: hidden;
        font-size: 14px;
        cursor: auto;
        margin-top: 12px;
    }
    .example-play__header {
        background-color: @primary-color;
        display: flex;
        flex-wrap: wrap;
        padding: 6px;
        min-height: 90px;
    }
    .example-play__item {
        padding: 4px 12px;
        color: @buy-lottery-example-color;
        border-radius: 18px;
        margin: 4px 6px;
        cursor: pointer;
        &.active {
            color: #ffffff;
            background-color: @buy-lottery-example-bg;
        }
    }
    .example-play__body {
        padding: 20px;
        height: 500px;
        overflow: auto;
    }
</style>
