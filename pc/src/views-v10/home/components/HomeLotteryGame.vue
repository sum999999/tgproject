<template>
    <div class="home-lottery-game-wrap">
        <div class="home-lottery-game" :style="{
                transform: `translate3d(${translateX}, 0px, 0px)`
        }">
            <ul v-for="(quicks, index) in quicksList" :key="index" class="home-lottery-game-list">
                <li v-for="(quick, index) in quicks" :key="quick.lotteryId" class="home-lottery-game-list-item">
                    <home-lottery-game-item
                            :lottery-id="quick.lotteryId"
                            :lottery-icon="quick.lotteryIcon"
                            :lottery-name="quick.lotteryName"
                            :count-time="quick.countTime"
                            :balls="quick.nums"
                            @buy-click="onBuyClick(quick)">
                    </home-lottery-game-item>
                </li>
            </ul>
        </div>
        <ul class="home-lottery-game-dot">
            <li v-for="(value, index) in quicksList.length" :key="index" class="home-lottery-game-dot__item" :class="{
                'home-lottery-game-dot__item--active': curIndex === index
            }" @click="onDotClick(index)"></li>
        </ul>
    </div>
</template>

<script>
  import HomeLotteryGameItem from "./HomeLotteryGameItem";
  import { queryIndexQuickBettingList } from "@/api/lottery";
  import chunk from "lodash/chunk";
  import { mapGetters } from "vuex";

  export default {
    name: "HomeLotteryGame",
    components: {
      HomeLotteryGameItem
    },
    data() {
      return {
        curIndex: 0,
        quicksList: []
      };
    },
    computed: {
      ...mapGetters(["user"]),
      isLogin() {
        return !!this.user.userId;
      },
      translateX() {
        return `${this.curIndex * -100}%`
      }
    },
    created() {
      this.handleQuickBettingList();
    },
    methods: {
      onDotClick(index) {
        this.curIndex = index;
      },
      handleQuickBettingList() {
        queryIndexQuickBettingList().then(res => {
          if (res.data.code !== 0) {
            return;
          }
          const data = res.data.data;
          let { quickBettingList = [], sysDate = 0 } = data;
          quickBettingList.forEach(quick => {
            quick.countTime = Math.ceil((quick.endTime - sysDate) / 1000);
            this.handleQuick(quick);
          });
          this.quicksList = chunk(quickBettingList, 2);
        })
      },
      handleQuick(quick) {
        let chaseNum = quick.chaseNum || 1;
        let random = require(`@/utils/random/${
          quick.code
          }.js`);
        const layout = JSON.parse(quick.layout);
        const lotteryNumber = random[quick.lotteryPlayId](layout.optballs);
        let balls = lotteryNumber.split(",");
        if (lotteryNumber.indexOf("|") > -1) {
          balls = lotteryNumber.split("|");
        }
        balls = balls.filter(item => item); // 去掉空的数组
        quick.nums = balls;
        quick.chaseNum = chaseNum;
        quick.balls = lotteryNumber;
      },
      onBuyClick(quick) {
        if (!this.isLogin) {
          return this.$router.push("/login");
        }
        this.$router.push({
          name: "buyLottery",
          params: { id: quick.lotteryId, order: quick }
        });
      }
    }
  }
</script>

<style scoped lang="less">
    .home-lottery-game-wrap {
        overflow: hidden;
    }
    .home-lottery-game {
        display: flex;
        transition-duration: .4s;
        transform: translate3d(0, 0px, 0px);
    }
    .home-lottery-game-list {
        width: 100%;
        flex-shrink: 0;
    }
    .home-lottery-game-dot {
        display: flex;
        justify-content: center;
    }
    .home-lottery-game-dot__item {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #111111;
        cursor: pointer;
        margin: 0 3px;
        &:hover {
            background-color: #ddc17c;
        }
    }
    .home-lottery-game-dot__item--active {
        background-color: #ddc17c;
    }
</style>
