<template>
    <div class="home-lottery-game-item">
        <div class="home-lottery-game-item__content">
            <img class="home-lottery-game-item__icon"
                 :src="lotteryIcon" alt="">
            <div class="home-lottery-game-item__buy">
                <div class="home-lottery-game-item__header">
                    <span class="home-lottery-game-item__title">{{lotteryName}}</span>
                    <Button class="home-lottery-game-item__link animate__animated animate__fast" type="primary" shape="circle" @click="onBuyClick">{{$tex("立即投注")}}</Button>
                </div>
                <home-lottery-countdown v-model="value" @end="onCountTimeEnd"></home-lottery-countdown>
            </div>
        </div>
        <ul class="home-lottery-game-balls">
            <li v-for="(ball, index) in balls" :key="index" class="home-lottery-game-balls-item">{{ball}}</li>
        </ul>
    </div>
</template>

<script>
  import HomeLotteryCountdown from "./HomeLotteryCountdown";
  import { queryLotteryRecordListV2 } from "@/api/lottery";

  export default {
    name: "HomeLotteryGameItem",
    components: {
      HomeLotteryCountdown
    },
    props: {
      lotteryId: {
        type: String,
        default: ""
      },
      lotteryIcon: {
        type: String,
        default: ""
      },
      lotteryName: {
        type: String,
        default: ""
      },
      balls: {
        type: Array,
        default: []
      },
      countTime: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        value: this.countTime
      };
    },
    watch: {
      countTime: {
        immediate: true,
        handler(value = 0) {
          this.value = value;
        }
      }
    },
    methods: {
      onBuyClick() {
        this.$emit("buy-click");
      },
      onCountTimeEnd() {
        queryLotteryRecordListV2({
          lotteryId: this.lotteryId,
          num: 1
        }).then(res => {
          if (res.data.code !== 0) {
            return;
          }
          const data = res.data.data;
          const { recordList = [] } = data;
          const record = recordList[0] || {
            endTime: 0,
            sysDate: 0
          };
          const { endTime, sysDate } = record;
          this.value = Math.ceil((endTime - sysDate) / 1000);
        })
      }
    }
  }
</script>

<style scoped lang="less">
    .home-lottery-game-item {
        margin: 28px 20px;
    }

    .home-lottery-game-item__content {
        display: flex;
    }

    .home-lottery-game-item__icon {
        width: 75px;
        height: 75px;
        margin: 0 16px 16px 0;
    }

    .home-lottery-game-item__buy {
        flex: 1;
    }

    .home-lottery-game-item__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
    }

    .home-lottery-game-item__title {
        font-size: 18px;
        color: #ddc17c;
    }

    .home-lottery-game-item__link {
        width: 90px;
        height: 26px;
        &:hover {
            animation-name: pulse;
            animation-timing-function: ease-in-out;
        }
    }

    .home-lottery-game-balls {
        display: flex;
        font-size: 14px;
    }

    .home-lottery-game-balls-item {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        color: #ffffff;
        background-color: #111111;
    }

    .home-lottery-game-balls-item {
        margin-right: 8px;
    }
</style>
