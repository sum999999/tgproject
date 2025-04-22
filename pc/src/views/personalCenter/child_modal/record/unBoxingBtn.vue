<template>
    <div class="unboxing-wrap" v-if="todayBetWin.allowShare">
        <Button type="primary" size="large" @click="onUnBoxingClick">
            <i></i>
            <i18n path="投入{money1}{unit}，中奖{money2}，晒单一下" tag="span">
                <template slot="money1">
                    {{todayBetWin.betMoney}}
                </template>
                <template slot="unit">
                    {{$tex("元")}}
                </template>
                <template slot="money2">
                    {{todayBetWin.prizeMoney}}
                </template>
            </i18n>
        </Button>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import { hasPermission } from "@/utils/authority-utils";

    export default {
        name: "unBoxingBtn",
        computed: {
          ...mapGetters(["todayBetWin"])
        },
        methods: {
          hasPermission,
            onUnBoxingClick() {
                this.$emit("click", {
                    allowShare: this.todayBetWin.allowShare,
                    betMoney: this.todayBetWin.betMoney,
                    prizeMoney: this.todayBetWin.prizeMoney
                });
            },
            getInfo() {
                return {
                    allowShare: this.todayBetWin.allowShare,
                    betMoney: this.todayBetWin.betMoney,
                    prizeMoney: this.todayBetWin.prizeMoney
                };
            }
        }
    }
</script>

<style scoped>
    .unboxing-wrap {
        text-align: center;
        margin-top: 20px;
    }

    .unboxing-wrap i {
        display: inline-block;
        background: url("~@/assets/images/record/dianji.png") no-repeat;
        width: 22px;
        height: 22px;
        background-size: 100% 100%;
        margin-right: 10px;
        vertical-align: middle;
    }

    .unboxing-wrap .ivu-btn {
        height: 36px;
        padding-top: 8px;
    }
</style>
