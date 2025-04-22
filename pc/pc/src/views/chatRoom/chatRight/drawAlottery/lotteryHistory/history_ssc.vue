<template>
  <table class="history-table">
    <tr>
      <th class="period">{{ $tex("期数") }}</th>
      <th class="num">{{ $tex("开奖号") }}</th>
      <th class="total">{{ $tex("总和") }}</th>
      <th class="longhu">{{ $tex("1-5龙虎") }}</th>
    </tr>
    <tr v-for="(lottery, idx) in prizes">
      <td class="period">{{ lottery.periodNo | cutStrByLength }}</td>
      <td class="num">
        <lotteryNumber
          class="lotteryNumber"
          :auto="false"
          code="ssc"
          :lotNumber="lottery.lotteryNumber"
          :lastPrizeTime="lottery.endTime"
        >
          <template slot="default" slot-scope="{ balls }">
            <lotteryNumberSsc :balls="balls" />
          </template>
        </lotteryNumber>
      </td>
      <td class="total" style="width: 100px;">
        <span>{{ lottery.total }}</span>
        <span
          :style="{ color: lottery.singleDouble === '双' ? '#f12d35' : '' }"
          >{{ $tex(lottery.singleDouble) }}</span
        >
        <span :style="{ color: lottery.bigSmall === '大' ? '#f12d35' : '' }">{{
          $tex(lottery.bigSmall)
        }}</span>
      </td>
      <td class="longhu" style="width: 60px;">
        <span
          :style="{ color: lottery.longhu === '龙' ? '#f12d35' : 'blue' }"
          >{{ $tex(lottery.longhu) }}</span
        >
      </td>
    </tr>
  </table>
</template>

<script>
import LotteryNumber from "../lotteryNumber";
import lotteryNumberSsc from "../lotteryNumber/lotteryNumberSsc";
import * as Algorithm from "@/utils/algorithm";

export default {
  name: "history_ssc",
  components: {
    LotteryNumber,
    lotteryNumberSsc,
  },
  data() {
    return {
      prizes: [], // 存储类型为 {periodNo lotteryNumber endTime total, singleDouble, bigSmall longhuArr}
    };
  },
  props: {
    // list 包含字段如下
    // {
    //      endTime: "1572589800000"
    //      lotteryId: "41"
    //      lotteryNumber: "02,01,05,04,10,09,08,06,07,03"
    //      periodNo: "20191101168"
    //      prizeTime: "1572589803000"
    // }
    // periodNo lotteryNumber endTime  为必须存在的字段
    list: {
      type: Array,
      required: true,
      default: function() {
        return [];
      },
    },
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.listHandler(newValue);
      },
    },
  },
  methods: {
    listHandler(list) {
      const result = [];
      for (let idx in list) {
        const lottery = list[idx];
        const { lotteryNumber, periodNo, endTime } = lottery;
        if (!lotteryNumber) {
          result.push({
            lotteryNumber,
            periodNo,
            endTime,
          });
          continue;
        }
        const { BIG_SMALL_COMPARE_NUM } = Algorithm.getConstantByName("ssc");
        const nums = Algorithm.lotNumStr2Arr(lotteryNumber);
        let longhu = "";
        if (nums.length) {
          longhu = Algorithm.get1to5LongHu(nums[0], nums[nums.length - 1]);
        }
        const { total, singleDouble, bigSmall } = Algorithm.getNumsTotal(
          nums,
          BIG_SMALL_COMPARE_NUM
        );
        result.push({
          lotteryNumber,
          periodNo,
          endTime,
          total,
          bigSmall,
          singleDouble,
          longhu,
        });
      }
      this.prizes = result;
    },
    convertColor2Text(color) {
      switch (color) {
        case "red":
          return "红";
        case "blue":
          return "蓝";
        case "green":
          return "绿";
        case "gray":
          return "灰";
      }
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.lotteryNumber {
}
.history-table {
  width: 100%;
  border-collapse: collapse;
  > tr {
    border-bottom: 1px solid #dddddd;
  }
  > tr:nth-child(1) {
    height: 43px;
  }
  td {
    padding: 18px 0;
    color: #4e4e4e;
    font-size: 12px;
    text-align: center;
  }
  td.period {
    /*width: 90px;*/
    text-align: center;
  }
  td.total {
    span {
      margin: 0 3px;
    }
  }
  th.num {
    width: 190px;
  }
  th.total {
    width: 70px;
  }
}
</style>
