<template>
    <table class="history-table">
        <tr>
            <th class="period">{{$tex("期数")}}</th>
            <th class="num">{{$tex("开奖号")}}</th>
            <th class="total">{{$tex("总和")}}</th>
        </tr>
        <tr v-for="(lottery, idx) in prizes">
            <td class="period">{{lottery.periodNo | cutStrByLength}}</td>
            <td class="num" colspan="2">
                <div class="row-1 clearfix">
                    <lotteryNumber class="lotteryNumber" :auto="false" code="11x5" :lotNumber="lottery.lotteryNumber" :lastPrizeTime="lottery.endTime">
                        <template slot="default" slot-scope="{ balls }">
                            <lotteryNumber11x5 :balls="balls"/>
                        </template>
                    </lotteryNumber>
                    <div class="nums-total">
                        <span>{{lottery.total}}</span>
                        <span :style="{color: lottery.singleDouble === '双' ? '#f12d35' : ''}">{{$tex(lottery.singleDouble)}}</span>
                        <span :style="{color: lottery.bigSmall === '大' ? '#f12d35' : 'blue'}">{{$tex(lottery.bigSmall)}}</span>
                    </div>
                </div>
                <p v-if="lottery.lotteryNumber" class="alg-content" :class="{
                    'alg-content--inter': isInternational
                }">
                    <span>
                        <span class="label">{{$tex("龙虎")}}：</span><span class="value" :style="{color: lottery.longhu === '龙' ? '#f12d35' : 'blue'}">{{$tex(lottery.longhu)}}</span>
                        <span class="label">{{$tex("前三")}}：</span><span class="value">{{$tex(lottery.qiansan)}}</span>
                    </span>
                    <span>
                        <span class="label">{{$tex("中三")}}：</span><span class="value">{{$tex(lottery.zhongsan)}}</span>
                        <span class="label">{{$tex("后三")}}：</span><span class="value">{{$tex(lottery.housan)}}</span>
                    </span>
                </p>
            </td>
        </tr>
    </table>
</template>

<script>

    import lotteryNumber from "../lotteryNumber";
    import lotteryNumber11x5 from "../lotteryNumber/lotteryNumber11x5";
    import * as Algorithm from "@/utils/algorithm";
    import { mapGetters } from "vuex";

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
      computed: {
        ...mapGetters(["isInternational"])
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
            lotteryNumber11x5
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
                    const {BIG_SMALL_COMPARE_NUM} = Algorithm.getConstantByName("11x5");
                    const nums = Algorithm.lotNumStr2Arr(lotteryNumber);
                    const {total, singleDouble, bigSmall} = Algorithm.getNumsTotal(nums, BIG_SMALL_COMPARE_NUM);
                    let longhu = "", qiansan = "", zhongsan = "", housan = "";
                    if (nums.length) {
                        longhu = Algorithm.get1to5LongHu(nums[0], nums[nums.length - 1]);
                        qiansan = Algorithm.getThreeUtil([nums[0], nums[1], nums[2]]);
                        zhongsan = Algorithm.getThreeUtil([nums[1], nums[2], nums[3]]);
                        housan = Algorithm.getThreeUtil([nums[2], nums[3], nums[4]]);
                    }
                    result.push({
                        lotteryNumber,
                        periodNo,
                        endTime,
                        total,
                        singleDouble,
                        bigSmall,
                        longhu,
                        qiansan,
                        zhongsan,
                        housan
                    });
                }
                this.prizes = result;
            }
        }
    }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .row-1 {
        > span {
            vertical-align: middle;
        }
        .nums-total {
            float: right;
            margin-right: 14px;
            line-height: 25px;
            > span {
                margin: 0 5px;
            }
        }
    }
    .lotteryNumber {
        float: left;
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
        &.alg-content--inter {
            display: flex;
            flex-direction: column;
        }
        .guanyahe {
            margin-right: 26px;
        }
        .guanyahe .total {
            color: #f24024;
        }
        .longhu {
            float: right;
        }
        .label {
            font-weight: bold;
        }
        .value {
            margin-right: 14px;
        }
        .value:nth-last-child(1) {
            margin-right: 0;
        }
    }
</style>
