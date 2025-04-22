<template>
    <table class="history-table">
        <tr>
            <th class="period">{{$tex("期数")}}</th>
            <th class="num">{{$tex("开奖号")}}</th>
        </tr>
        <tr v-for="(lottery, idx) in prizes">
            <td class="period">{{lottery.periodNo | cutStrByLength}}</td>
            <td class="num">
                <lotteryNumber class="lotteryNumber" :auto="false" code="pk10" :lotNumber="lottery.lotteryNumber" :lastPrizeTime="lottery.endTime">
                    <template slot="default" slot-scope="{ balls }">
                        <lotteryNumberPk10 :balls="balls"/>
                    </template>
                </lotteryNumber>
                <p class="alg-content" v-if="lottery.lotteryNumber">
                    <span class="guanyahe">
                        <span class="guanyahe__label">{{$tex("冠亚和")}}：</span>
                        <span class="guanyahe__label">
                          <span class="total">{{lottery.total | fixedZero}}</span>
                          &nbsp;
                          {{$tex(lottery.singleDouble)}}
                          &nbsp;
                          <span :style="{color: lottery.bigSmall === '小' ? '#1111ff' : '#f24024'}">{{$tex(lottery.bigSmall)}}</span>
                        </span>
                    </span>
                   <span class="longhu">
                       {{$tex("1-5龙虎")}}：
                       <span v-for="(item, idx) in lottery.longhuArr" :style="{color: item === '虎' ? '#1111ff' : '#f24024'}">{{$tex(item)}}&nbsp;&nbsp;</span>
                   </span>
                </p>
            </td>
        </tr>
    </table>
</template>

<script>

    import lotteryNumber from "../lotteryNumber";
    import lotteryNumberPk10 from "../lotteryNumber/lotteryNumberPk10";
    import * as Algorithm from "@/utils/algorithm";

    export default {
        name: "history_pk10",
        data() {
          return {
              prizes: [] // 存储类型为 {periodNo lotteryNumber endTime total, singleDouble, bigSmall longhuArr}
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
                }
            }
        },
        watch: {
            list: {
                deep: true,
                immediate: true,
                handler(newValue, oldValue) {
                    this.listHandler(newValue);
                }
            }
        },
        components: {
            lotteryNumber,
            lotteryNumberPk10
        },
        methods: {
            listHandler(list) {
                const result = [];
                for (let idx in list) {
                    const lottery = list[idx];
                    const {lotteryNumber, periodNo, endTime} = lottery;
                    if (!lotteryNumber) {
                        result.push({
                            lotteryNumber,
                            periodNo,
                            endTime,
                        });
                        continue;
                    }
                    const {BIG_SMALL_COMPARE_NUM} = Algorithm.getConstantByName("pk10");
                    const nums = Algorithm.lotNumStr2Arr(lotteryNumber);
                    const {total, singleDouble, bigSmall} = Algorithm.guanyaSumInfo(nums, BIG_SMALL_COMPARE_NUM);
                    const longhuArr = Algorithm.getNums1to5LongHu(nums);
                    result.push({
                        lotteryNumber,
                        periodNo,
                        endTime,
                        total,
                        singleDouble,
                        bigSmall,
                        longhuArr
                    });
                }
                this.prizes = result;
            }
        }
    }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .lotteryNumber {
        @{deep} .ui-list-balls > span {
            margin-right: 0.2rem;
        }
    }
    .history-table {
        width: 100%;
        border-collapse: collapse;
        >tr {
            border-bottom: 1px solid #dddddd;
        }
        >tr:nth-child(1) {
            height: 43px;
        }
        td {
            padding: 18px;
            color: #4e4e4e;
            font-size: 12px;
        }
        td.period {
            width: 90px;
            text-align: center;
        }
        .loading {
            display: block;
            margin: auto;
        }
    }
    .alg-content {
        margin-top: 16px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        .guanyahe {
            margin-right: 26px;
        }
        .guanyahe .total {
            color: #f24024;
        }
      .guanyahe__label {
        white-space: nowrap;
      }
        .longhu {
            float: right;
        }
    }
</style>
