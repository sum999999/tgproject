<template>
    <ul class="home-lottery-category">
        <li v-for="(typeItem, index) in lotteryTypes" :key="typeItem.lotteryType" class="home-lottery-category-item">
            <div class="home-lottery-category-item__content">
                <h1 class="home-lottery-category-item__title">{{typeItem.lotteryTypeName}}</h1>
                <ul class="home-lottery-category-lottery">
                    <li v-for="lottery in typeItem.lotteryList" :key="lottery.lotteryId" class="home-lottery-category-lottery-item" @click="onLotteryClick(lottery, index)">
                        <div class="home-lottery-category-lottery-item__content">
                            <img class="home-lottery-category-lottery-item__icon" :src="lottery.lotteryIcon" alt="">
                            <span class="home-lottery-category-lottery-item__title">{{lottery.lotteryName}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script>
    import { queryLotteryList } from "@/api/lottery";

  export default {
    name: "HomeLotteryCategory",
    data() {
      return {
        lotteryTypes: [
          {
            lotteryType: 1,
            lotteryList: []
          },
          {
            lotteryType: 2,
            lotteryList: []
          },
          {
            lotteryType: 3,
            lotteryList: []
          },
          {
            lotteryType: 4,
            lotteryList: []
          },
        ]
      }
    },
    created() {
      queryLotteryList().then(res => {
        if (res.data.code !== 0) {
          return;
        }
        const data = res.data.data;
        const { lotteryTypeList = [] } = data;
        this.lotteryTypes = lotteryTypeList.slice(1, 1 + 4);
        this.lotteryTypes.forEach(typeItem => {
          typeItem.lotteryList = typeItem.lotteryList.slice(0, 4);
        });
      })
    },
    methods: {
      onLotteryClick(lottery, index) {
        window.open(`/#/buyLottery/${lottery.lotteryId}`);
      }
    }
  }
</script>

<style scoped lang="less">
    .home-lottery-category {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        color: #ddc17c;
        flex: 1;
    }
    .home-lottery-category-item {
        position: relative;
        border-radius: 10px;
        background-image: linear-gradient(to top, #26252b, #33333a 70%, #40404a);
        width: 396px;
        margin: 10px;
        padding: 20px 0 26px;
        &:before {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: url("~@/assets/images-v6/home/caiqiu_2.png") no-repeat top left;
        }
    }
    .home-lottery-category-item__title {
        font-size: 18px;
        padding-bottom: 33px;
    }
    .home-lottery-category-lottery {
        display: flex;
        font-size: 14px;
        justify-content: center;
    }
    .home-lottery-category-lottery-item {
        margin: 0 8px;
        cursor: pointer;
        &:hover {
            .home-lottery-category-lottery-item__icon {
                transform: scale(1.093);
            }
        }
    }
    .home-lottery-category-lottery-item__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }
    .home-lottery-category-lottery-item__icon {
        width: 75px;
        height: 75px;
        transform-origin: bottom;
        transition: all ease-in-out .2s;
    }
    .home-lottery-category-lottery-item__title {
        margin-top: 16px;
    }
</style>
