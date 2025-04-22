<template>
    <table class="history-table">
        <tr>
            <th class="period">{{$tex("期数")}}</th>
            <th class="num">{{$tex("开奖号")}}</th>
        </tr>
        <tr v-for="(lottery, idx) in prizes">
            <td class="period">{{lottery.periodNo | cutStrByLength}}</td>
            <td class="num">
                <lotteryNumber class="lotteryNumber" :auto="false" code="6hc" :lotNumber="lottery.lotteryNumber" :lastPrizeTime="lottery.endTime">
                    <template slot="default" slot-scope="{ balls }">
                        <lotteryNumber6hc :balls="balls"/>
                    </template>
                </lotteryNumber>
                <p v-if="lottery.lotteryNumber" class="alg-content" :class="{
                    'alg-content--inter': isInternational
                }">
                    <span>
                        <span class="label">{{$tex("总和")}}：</span>
                        <span class="value total">{{lottery.total}}</span>
                        <span class="value singleDouble" :style="{color: lottery.singleDouble === '双' ? '#ff7f24' : ''}">{{$tex(lottery.singleDouble)}}</span>
                        <span class="value bigSmall" :style="{color: lottery.bigSmall === '大' ? '#f12d35' : ''}">{{$tex(lottery.bigSmall)}}</span>
                        <span class="value bose" :style="lottery.numsTotalColorStyle">{{$tex(lottery.numsTotalColor)}}</span>
                    </span>
                    <span>
                        <span class="label">{{$tex("特码")}}：</span>
                        <span class="value specialNum" :style="{color: '#f12d35'}">{{lottery.specialNum}}</span>
                        <span class="value spSingleDouble" :style="{color: lottery.spSingleDouble === '双' ? '#ff7f24' : ''}">{{$tex(lottery.spSingleDouble)}}</span>
                        <span class="value spBigSmall" :style="{color: lottery.spBigSmall === '大' ? '#f12d35' : ''}">{{$tex(lottery.spBigSmall)}}</span>
                        <animal :text="lottery.spZodiac" class="value spZodiac"></animal>
                        <span class="value spbose" :style="lottery.spColorStyle">{{$tex(lottery.specialClrTxt)}}</span>
                    </span>
                </p>
            </td>
        </tr>
    </table>
</template>

<script>

    import lotteryNumber from "../lotteryNumber";
    import lotteryNumber6hc from "../lotteryNumber/lotteryNumber6hc";
    import * as Algorithm from "@/utils/algorithm";
    import Animal from '@/components/Animal';
    import { mapGetters } from "vuex";

    export default {
        name: "history_6hc",
        components: {
            lotteryNumber,
            lotteryNumber6hc,
          Animal
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
                    const {BIG_SMALL_COMPARE_NUM, SPECIAL_COMPARE_NUM} = Algorithm.getConstantByName("6hc");
                    const nums = Algorithm.lotNumStr2Arr(lotteryNumber);
                    const ballInfos = Algorithm.getLiuheColor(lotteryNumber.split(","), `${endTime}`); //["49", "24", "17", "30", "40", "01+48"]
                    const {total, singleDouble, bigSmall} = Algorithm.getNumsTotal(nums, BIG_SMALL_COMPARE_NUM);
                    const numsTotalColor = Algorithm.getNumsTotalColor(ballInfos);
                    const numsTotalColorStyle = {
                        color: numsTotalColor.color === 'equal' ? '#999' : numsTotalColor.color,
                    };

                    const zeroLotNums = Algorithm.nums2Zero(nums);
                    const specialNum = zeroLotNums[zeroLotNums.length - 1];
                    const {total: spTotal, singleDouble: spSingleDouble, bigSmall: spBigSmall} = Algorithm.getNumsTotal([specialNum], SPECIAL_COMPARE_NUM);

                    const specialClr = ballInfos[ballInfos.length - 1].color;
                    const specialClrTxt = Algorithm.getBallColorToTxt(specialClr); // 波色
                    const specialInfo = Algorithm.getZodiacByNum(specialNum, `${endTime}`);
                    const spZodiac = specialInfo.zodiac;
                    const spColorStyle = {
                        color: specialClr
                    };

                    result.push({
                        lotteryNumber,
                        periodNo,
                        endTime,
                        total,
                        singleDouble,
                        bigSmall,
                        numsTotalColorStyle,
                        numsTotalColor: numsTotalColor.value,
                        specialNum,
                        spSingleDouble,
                        spBigSmall,
                        spZodiac,
                        spColorStyle,
                        specialClrTxt
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
        &.alg-content--inter {
            display: flex;
            flex-direction: column;
        }
        .value {
            margin-right: 2.6px;
        }
    }
</style>
