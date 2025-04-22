<template>
    <div class="ui-list-balls ui-ball-pk10 clearfix">
        <span v-for="(item, idx) in balls" :key="idx">
            <span class="ball"
                  :class="[`ball-${fillZero(item.value)}`]">
                <strong>{{fillZero(item.value)}}</strong>
            </span>
        </span>
    </div>
</template>

<script>
    export default {
        name: "lotteryNumberPk10",
        props: {
            balls: {
                type: Array,
                default: function() {
                    // {symbol, value, color}
                    return [];
                }
            }
        },
        methods: {
            fillZero(num) {
                num = parseInt(num);
                return num < 10 ? `0${num}` : num;
            },
        }
    }
</script>

<style scoped lang="less">
    @import './ball.less';
</style>
