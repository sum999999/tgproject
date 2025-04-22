<template>
    <div class="ui-list-balls ui-ball-6hc clearfix">
        <span v-for="(item, idx) in balls" :key="idx">
            <span v-if="item.symbol"
                  class="symbol">
                <strong>{{item.value}}</strong>
            </span>
            <span v-else
                  class="ball"
                  :class="[`ball-${item.value}`, `ball-${item.color}`]">
                <strong>{{item.value}}</strong>
            </span>
            <div>
                <animal :text="item.zodiac"></animal>
            </div>
        </span>
    </div>
</template>

<script>
  import Animal from '@/components/Animal';
    export default {
        name: "lotteryNumber6hc",
      components: {
        Animal
      },
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
