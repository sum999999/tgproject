<template>
    <table class="history-table">
        <tr>
            <th class="period">{{$tex("期数")}}</th>
            <th class="num">{{$tex("开奖号")}}</th>
        </tr>
        <tr v-for="(lottery, idx) in prizes">
            <td class="period">{{lottery.periodNo | cutStrByLength}}</td>
            <td class="num">
                <lotteryNumber class="lotteryNumber" :auto="false" code="default" :lotNumber="lottery.lotteryNumber" :lastPrizeTime="lottery.endTime">
                    <template slot="default" slot-scope="{ balls }">
                        <lotteryNumberDefault :balls="balls"/>
                    </template>
                </lotteryNumber>
            </td>
        </tr>
    </table>
</template>

<script>
    import LotteryNumber from "../lotteryNumber";
    import lotteryNumberDefault from "../lotteryNumber/lotteryNumberDefault";
    import * as Algorithm from "@/utils/algorithm";

    export default {
        name: "history_ssc",
        components: {
            LotteryNumber,
            lotteryNumberDefault
        },
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
                    result.push({
                        lotteryNumber,
                        periodNo,
                        endTime
                    });
                }
                this.prizes = result;
            },
        }
    }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .lotteryNumber {

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
                margin: 0 5px;
            }
        }
    }
</style>
