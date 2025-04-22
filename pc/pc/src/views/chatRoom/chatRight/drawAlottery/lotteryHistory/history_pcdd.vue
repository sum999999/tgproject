<template>
    <table class="history-table">
        <tr>
            <th class="period">{{$tex("期数")}}</th>
            <th class="num">{{$tex("开奖号")}}</th>
            <th class="bose">{{$tex("波色")}}</th>
            <th class="daxiao">{{$tex("大小")}} </th>
            <th class="danshuang">{{$tex("单双")}}</th>
        </tr>
        <tr v-for="(lottery, idx) in prizes">
            <td class="period">{{lottery.periodNo | cutStrByLength}}</td>
            <td class="num">
                <lotteryNumber class="lotteryNumber" :auto="false" code="pcdd" :lotNumber="lottery.lotteryNumber" :lastPrizeTime="lottery.endTime">
                    <template slot="default" slot-scope="{ balls }">
                        <lotteryNumberPcdd :balls="balls"/>
                    </template>
                </lotteryNumber>
            </td>
            <td class="bose"><span :style="{background: lottery.color}">{{$tex(lottery.colorText)}}</span></td>
            <td class="daxiao"><span :style="{background: lottery.bigSmall ? lottery.bigSmall === '大' ? '#f4b976' : '#6895eb' : ''}">{{$tex(lottery.bigSmall)}}</span></td>
            <td class="danshuang"><span :style="{background: lottery.singleDouble ? lottery.singleDouble === '双' ? '#f4b976' : '#6895eb' : ''}">{{$tex(lottery.singleDouble)}}</span></td>
        </tr>
    </table>
</template>

<script>
    import lotteryNumber from "../lotteryNumber";
    import lotteryNumberPcdd from "../lotteryNumber/lotteryNumberPcdd";
    import * as Algorithm from "@/utils/algorithm";

    export default {
        name: "history_pcdd",
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
            lotteryNumberPcdd
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
                    const {BIG_SMALL_COMPARE_NUM} = Algorithm.getConstantByName("pcdd");
                    const nums = Algorithm.lotNumStr2Arr(lotteryNumber);
                    const {total, singleDouble, bigSmall} = Algorithm.getNumsTotal(nums, BIG_SMALL_COMPARE_NUM);
                    let color, colorText;
                    for (let key in Algorithm.PCDD_COLOR) {
                        if (Algorithm.PCDD_COLOR[key].indexOf(String(total)) > -1) {
                            color = key;
                        }
                    }
                    colorText = this.convertColor2Text(color);
                    result.push({
                        lotteryNumber,
                        periodNo,
                        endTime,
                        bigSmall,
                        singleDouble,
                        color,
                        colorText
                    });
                }
                this.prizes = result;
            },
            convertColor2Text(color) {
                switch(color) {
                    case 'red':
                        return "红";
                    case 'blue':
                        return "蓝";
                    case 'green':
                        return "绿";
                    case 'gray':
                        return "灰";
                }
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
            padding: 18px 0;
            color: #4e4e4e;
            font-size: 12px;
            text-align: center;
        }
        .period {
            /*width: 90px;*/
            text-align: center;
        }
        .bose{
           span {
               border-radius: 100%;
               display: inline-block;
               width: 25px;
               height: 25px;
               color: #ffffff;
               line-height: 25px;
           }
        }
        .daxiao,.danshuang {
            span {
                border-radius: 4px;
                display: inline-block;
                width: 25px;
                height: 25px;
                line-height: 25px;
                color: #ffffff;
            }
        }
    }
</style>
