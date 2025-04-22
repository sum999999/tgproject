<template>
    <div>
        <Spin size="large" fix v-if="loading"></Spin>
        <div class="drawALottery-card clearfix">
            <div class="drawALottery-card__l">
                <img class="logo" :src="logo" :alt="defaultLotterySelect.lotteryName">
                <span class="lotteryName">{{defaultLotterySelect.lotteryName | defaultStr}}</span>
            </div>
            <div class="drawALottery-card__r">
                <p>{{$tex("距离投注截止时间还有")}}</p>
                <div class="countdown">
                    <span v-for="(item, idx) in lotTimeArr" :key="idx" :class="{ml: idx === 0}">{{item}}</span>
                </div>
            </div>
        </div>
        <div class="drawALottery-lottery">
            <p>
                <i18n path="第{num}期" :tag="false">
                    <template slot="num">
                        <span class="period">{{prize.periodNo | defaultStr}}</span>
                    </template>
                </i18n>
            </p>
            <LotteryNumber :code="defaultLotterySelect.code" :lotNumber="prize.lotteryNumber"
                           :lastPrizeTime="prize.endTime"/>
        </div>
        <LotteryTab/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import countdown from "@/utils/countdown";
    import LotteryNumber from "./lotteryNumber";
    import LotteryTab from "./lotteryTab";
    import isEmpty from "lodash/isEmpty";
    import EventBus from "@/utils/eventBus";

    const defaultLogo = require("@/assets/images/chat/lot-default.png");

    export default {
        name: "drawALottery",
        components: {
            LotteryNumber,
            LotteryTab
        },
        data() {
            return {
                countdownTimer: null,
                lotTimeArr: ["00", "00", "00"],
                loading: false,
                prize: {}, // 最新一期开奖信息
                record: {}, // 下期开奖信息
                failReConnectTime: 5000, // 失败重新请求的倒计时时间
                lotQueryTime: 5000,
                lotQueryTimer: null
            };
        },
        computed: {
            ...mapGetters(["defaultLotterySelect", "lotteryInfo", "historyList"]),
            logo() {
                return this.defaultLotterySelect.lotteryIcon || defaultLogo;
            },
        },
        watch: {
            defaultLotterySelect: {
                deep: true,
                handler(newValue = {}, oldValue = {}) {
                    if (!isEmpty(newValue)) {
                        if (newValue.lotteryId !== oldValue.lotteryId) {
                            this.$store.dispatch("deleteLotInfo");
                            this.lotTimeArr = ["00", "00", "00"];
                            this.prize = {};
                            this.record = {};
                            this.destoryCountDown();
                            this.destoryLotQueryTimer();
                            this.queryLotInfo();
                        }
                    }
                }
            },
            lotteryInfo(newValue = {}, oldValue = {}) {
                if (!isEmpty(newValue)) {
                    const {prize, record} = newValue;
                    this.prize = prize;
                    this.record = record;
                    this.destoryCountDown();
                    const time = this.getCountDownTime();
                    this.startCountDown(time, this.onCountDownEnd);
                }
            },
        },
        mounted() {
            EventBus.addEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
            this.queryLotterySelectList();
        },
        beforeDestroy() {
            EventBus.removeEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
            this.destoryCountDown();
            this.destoryLotQueryTimer();
            this.$store.dispatch("deleteLotterySelectList");
            this.$store.dispatch("deleteDefaultLotterySelect");
            this.$store.dispatch("deleteLotInfo");
        },
        methods: {
            updatePrizeHistory(event) {
                let extra = event.target;
                if (typeof extra === 'string') {
                    extra = JSON.parse(extra);
                }
                const lotteryInfo = extra;
                const {lotteryId, lotteryNumber, periodNo} = lotteryInfo;
                if (
                    periodNo === this.prize.periodNo &&
                    this.defaultLotterySelect.lotteryId === lotteryId
                ) {
                    this.prize.lotteryNumber = lotteryNumber;
                }
            },
            async onCountDownEnd() {
                await this.queryLotInfo(false);
                const {prize, record} = this.lotteryInfo;
                // prize
                // endTime: "1572510600000"
                // lotteryId: "41"
                // lotteryNumber: "01,05,09,06,02,04,03,08,10,07"
                // periodNo: "20191031192"
                // prizeTime: "1572510603000"

                // history
                // "lotteryId": "41",
                // "endTime": 1572510600000,
                // "periodNo": "1031192",
                // "lotteryNumber": "01,05,09,06,02,04,03,08,10,07"
                const historyItem = this.$store.getters.findHistoryItemByPeriodNo(prize.periodNo);
                if (isEmpty(historyItem)) {
                    this.$store.dispatch("addLotHistoryItem", {
                        lotteryId: prize.lotteryId,
                        endTime: prize.endTime,
                        periodNo: prize.periodNo,
                        lotteryNumber: prize.lotteryNumber,
                    });
                }
            },
            startLotQueryTimer() {
                if (this.lotQueryTimer) {
                    return;
                }
                this.lotQueryTimer = setTimeout(() => {
                    this.queryLotInfo(false);
                    this.lotQueryTimer = null;
                }, this.lotQueryTime);
            },
            destoryLotQueryTimer() {
                clearInterval(this.lotQueryTimer);
                this.lotQueryTimer = null;
            },
            startCountDown(time, endCallback) {
                if (this.countdownTimer) {
                    return;
                }
                this.countdownTimer = countdown(time, (_, ms) => {
                    const {h, m, s} = this.defaultFormat(ms);
                    this.lotTimeArr = [this.fixedZero(h), this.fixedZero(m), this.fixedZero(s)];
                    if (!ms) {
                        this.destoryCountDown();
                        endCallback && endCallback();
                    }
                });
            },
            destoryCountDown() {
                clearInterval(this.countdownTimer);
                this.countdownTimer = null;
            },
            getCountDownTime() {
                const {sysDate, endTime} = this.record;
                const time = endTime - sysDate;
                let result = 0;
                if (!!time) {
                    result = time / 1000;
                }
                return result;
            },
            async queryLotterySelectList() {
                this.loading = true;
                await this.$store.dispatch("queryLotterySelectList");
            },
            async queryLotInfo(valiLoading = true) {
                if (valiLoading) {
                    this.loading = true;
                }
                try {
                    await this.$store.dispatch("queryLotInfo", {lotteryId: this.defaultLotterySelect.lotteryId});
                } catch (e) {
                    setTimeout(() => {
                        this.queryLotInfo(valiLoading)
                    }, this.failReConnectTime);
                }
                if (valiLoading) {
                    this.loading = false;
                }
            },
            fixedZero(val) {
                return val * 1 < 10 ? `0${val}` : val;
            },
            defaultFormat(time) {
                const hours = 60 * 60 * 1000;
                const minutes = 60 * 1000;

                const h = Math.floor(time / hours);
                const m = Math.floor((time - h * hours) / minutes);
                const s = Math.floor((time - h * hours - m * minutes) / 1000);
                return {
                    h,
                    m,
                    s
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .drawALottery-card {
        padding: 20px;
    }

    .drawALottery-card__l {
        float: left;

        .logo {
            width: 80px;
            height: 80px;
            vertical-align: middle;
        }

        .lotteryName {
            font-size: 20px;
            padding-left: 12px;
            display: inline-block;
            width: 190px;
        }
    }

    .drawALottery-card__r {
        font-size: 12px;
        text-align: center;

        p {
            margin-bottom: 20px;
        }

        .countdown span {
            background: #323c4b;
            color: #ffffff;
            width: 34px;
            height: 40px;
            font-size: 16px;
            border-radius: 4px;
            display: inline-block;
            line-height: 40px;
            margin-left: 10px;

            &.ml {
                margin-left: 0;
            }
        }
    }

    .drawALottery-lottery {
        margin: 0 20px 20px;
        padding: 14px;
        background: #eef1f5;
        border-radius: 4px;
        text-align: center;

        p {
            margin-bottom: 10px;
        }

        .period {
            color: #1f81f6
        }
    }
</style>
