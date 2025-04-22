<template>
    <ul class="drawALottery-select clearfix">
        <Spin size="large" fix v-if="loading"></Spin>
        <li
                v-for="(lottery, idx) in lotterySelectList"
                :key="idx"
                @click="onLotteryClick(lottery)">
            <img :src="lottery.lotteryIcon" :alt="lottery.lotteryName">
            <p>{{lottery.lotteryName}}</p>
        </li>
    </ul>
</template>

<script>
    import {mapGetters} from "vuex";
    import isEmpty from "lodash/isEmpty";

    export default {
        name: "lotterySelect",
        data() {
            return {
                loading: false
            }
        },
        computed: {
            ...mapGetters(["lotterySelectList", "defaultLotterySelect"]),
        },
        mounted() {
            this.queryLotterySelectList();
        },
        methods: {
            onLotteryClick(lottery) {
                this.$emit("on-tab-click", 0);
                this.$store.dispatch("queryDefaultLotSelectById", {lotteryId: lottery.lotteryId});
            },
            async queryLotterySelectList() {
                if (!isEmpty(this.lotterySelectList)) {
                    return;
                }
                this.loading = true;
                await this.$store.dispatch("queryLotterySelectList");
                this.loading = false;
            }
        }
    }
</script>

<style scoped lang="less">
    .drawALottery-select {
        padding: 20px 0 0;
        min-height: 100px;
        position: relative;
        li {
            width: 25%;
            float: left;
            text-align: center;
            cursor: pointer;
            margin-bottom: 20px;
        }
        img {
            width: 60px;
            height: 60px;
        }
    }
</style>
