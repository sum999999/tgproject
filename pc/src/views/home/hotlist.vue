<template>
  <div class="hotlist">
    <div v-for="item in list" :key="item.lotteryId" @click="golottery(item)">
      <img :src="item.lotteryIcon" alt="" />
      <p>{{ item.lotteryName }}</p>
      <span>{{ item.prizeIntervalDesc }}</span>
    </div>
  </div>
</template>

<script>
import { queryLotteryList } from "@/api/lottery";
export default {
  data() {
    return {
      list: [],
    };
  },
  methods: {
    golottery(item) {
      this.$router.push({
        name: "buyLottery",
        params: { id: item.lotteryId },
      });
    },
    getdata() {
      queryLotteryList({ lotteryType: null }).then((response) => {
        if (response.data.code !== 0) return;
        try {
          this.list = response.data.data.lotteryTypeList[0].lotteryList.filter(
            (item) => {
              return item.hotFlag == 1;
            }
          );
        } catch (error) {}
      });
    },
  },
  created() {
    this.getdata();
  },
};
</script>

<style lang="less" scoped>
.hotlist {
  background: #fffdf3;
  border: 1px solid #e6c9a0;
  border-top: 3px solid #e6c9a0;
  height: 500px;
  width: 260px;
  overflow: auto;
  overflow-x: hidden;
  div {
    width: 240px;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px dashed #ddd;
    padding: 0 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: #fff9dd;
      img {
        transform: rotate(360deg);
      }
    }
    img {
      width: 36px;
      height: 36px;
      align-items: center;
      transition: all 0.5s;
      border-radius: 50%;
    }
    p {
      margin: 0 10px;
      font-size: 14px;
      color: #333;
      font-weight: 700;
    }
    span {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
