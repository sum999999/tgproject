<template>
    <div>
        <span class="stop-period" v-if="stopPeriod">已停期</span>
    <span class="ui-downTime" v-else>
      <span v-if="timeTxt.length">{{timeTxt[0]}}时 {{timeTxt[1]}}分 {{timeTxt[2]}}秒后截止</span>
      <span v-else>开奖中...</span>
    </span>
    </div>
</template>

<script>
    import debounce from "lodash/debounce";
    import isEmpty from "lodash/isEmpty";
    import { mapGetters } from "vuex";

    export default {
        props: {
            id: {
                type: String
            },
            routeName: {
                type: String
            }
        },
        data() {
            return {
                totalRecordList: {
                    beginTime: "",
                    endTime: "",
                    lotteryRecordId: "",
                    openBalls: null,
                    openBallsCount: null,
                    periodNo: "",
                    preLotteryNumber: null,
                    preLotteryTime: null,
                    prePeriodNo: "",
                    prizeTime: "",
                    sysDate: null
                },
                timer: null,
                surplusTime: 0,
                timeTxt: ["00", "00", "00"],
                downNum: 0,
            };
        },
        computed: {
            stopPeriod() {
                return isEmpty(this.totalRecordList);
            }
        },
        watch: {
            id() {
                this.getData();
            }
        },
        methods: {
            getData: debounce(function () {
                let vm = this;
                if (this.routeName !== this.$route.name) {
                    if (this.timer) {
                        clearInterval(this.timer);
                        return;
                    }
                }
                vm.$http
                    .post(
                        "/api/v2/lottery/queryLotteryRecordList",
                        {lotteryId: this.id, num: 1},
                        {unenc: true}
                    )
                    .then(response => {
                        if (response.data.code !== 0) {
                            vm.getData();
                            return;
                        }
                        let info = response.data;
                        vm.totalRecordList = info.data.recordList[0];
                        vm.$emit("get-period", vm.totalRecordList);
                        vm.downNum = 0;
                        if (vm.totalRecordList) {
                            if (vm.timer) clearInterval(vm.timer);
                            vm.setFirstTime();
                        }
                    });
            }, 300),
            setFirstTime() {
                let vm = this;
                let startTime = vm.totalRecordList.sysDate;
                vm.surplusTime = vm.totalRecordList.endTime - startTime;

                // 得到计算结果
                this.countDown();

                this.timer = setInterval(function () {
                    vm.surplusTime = vm.surplusTime - 1000;
                    vm.downNum++;
                    // (vm.id === 17 && vm.downNum >= 10) 判断如果是六合彩就一个小时发一次请求
                    if (
                        vm.surplusTime <= 0 ||
                        (parseInt(vm.id) === 17 && vm.downNum >= 3600)
                    ) {
                        clearInterval(vm.timer);
                        // 停留5秒为开奖时间
                        this.timeTxt = [];
                        setTimeout(vm.getData, 1000);
                    } else {
                        vm.countDown();
                    }
                }, 1000);
            },
            //  倒计时结束
            countDown() {
                let vm = this;
                let obj = {};
                let days = Math.floor(vm.surplusTime / (24 * 3600 * 1000));
                //计算出小时数
                let leave1 = vm.surplusTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
                obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24;
                //计算相差分钟数
                let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
                obj.minutes = Math.floor(leave2 / (60 * 1000));
                //计算相差秒数
                let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
                obj.seconds = Math.round(leave3 / 1000);

                ["hours", "minutes", "seconds"].forEach(item => {
                    if (obj[item] < 10) obj[item] = "0" + obj[item];
                });
                this.timeTxt = [obj.hours, obj.minutes, obj.seconds];
            }
        },
        created() {
            this.getData();
        },
        beforeDestroy() {
            if (this.timer) clearInterval(this.timer);
        }
    };
</script>
<style scoped lang="less">
    .stop-period {
        color: #ae291a;
    }
</style>

