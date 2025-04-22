<template>
    <div></div>
</template>

<script>
  import { mapGetters } from "vuex";

export default {
    props: {
        id: {
            type: String
        }
    },
    data () {
        return {
            totalRecordList: [],
            timer: null,
            surplusTime: 0,
            downTime: {},
            downNum: 0
        }
    },
    watch: {
        id (n, o) {
            this.getData();
        }
    },
    methods: {
        getData () {
            let vm = this;
            let num = this.$route.path === '/' ? 1 : 100;
            vm.$http.post('/api/v2/lottery/queryLotteryRecordList', { lotteryId: this.id, num: 1 }, { unenc: true }).then(response => {
                if (response.data.code !== 0) return;
                let info = response.data;
                vm.totalRecordList = info.data.recordList;
                vm.downTime.over = false;
                vm.downTime.record = info;
                vm.downNum = 0;
                if (vm.totalRecordList.length) {
                    if (vm.timer) clearInterval(vm.timer);
                    vm.setFirstTime();
                }
            })
        },
        setFirstTime () {
            let vm = this;
            let startTime = vm.totalRecordList[0].sysDate;
            vm.surplusTime = vm.totalRecordList[0].endTime - startTime;

            // 得到计算结果
            this.countDown();

            this.timer = setInterval(function () {
                vm.surplusTime = vm.surplusTime - 1000;
                vm.downNum++;
                // (vm.id === 17 && vm.downNum >= 10) 判断如果是六合彩就一个小时发一次请求
                if (vm.surplusTime <= 0 || (parseInt(vm.id) === 17 && vm.downNum >= 3600) || (parseInt(vm.id) === 20 && vm.downNum >= 3600)) {
                    vm.downTime.over = true;
                    clearInterval(vm.timer);
                    // 停留5秒为开奖时间
                    setTimeout(vm.getData, 5000);
                } else {
                    vm.countDown()
                }
            }, 1000)
        },
        //  倒计时结束
        countDown () {
            let vm = this;
            let days = Math.floor(vm.surplusTime / (24 * 3600 * 1000));
            //计算出小时数
            let leave1 = vm.surplusTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000)) + (days * 24);
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000));
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000);   //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);

            vm.downTime.hours = hours;
            vm.downTime.minutes = minutes;
            vm.downTime.seconds = seconds;
            ['hours', 'minutes', 'seconds'].forEach(item => {
                if (vm.downTime[item] < 10) vm.downTime[item] = '0' + vm.downTime[item];
            })
            this.$emit('on-change', vm.downTime);
        }
    },
    created () {
        this.getData()
    },
    beforeDestroy () {
        if (this.timer) clearInterval(this.timer);
    }
}
</script>
