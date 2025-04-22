<template>
    <div class="zhengma-order">
        <div class="ball-table-wrap">
            <div v-for="(layout, oIndex) in layouts" :key="oIndex">
                <div v-for="(ball, iIndex) in layout.balls" :key="iIndex" class="ball-table-box">
                    <ball-table v-model="ball.value" :show-title="iIndex  < 4" :label="ball.ball" :odds="ball.disDoubleOdds" @focus="onFocus(ball, iIndex)" @blur="onBlur(ball, iIndex)">
                    </ball-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import orderMixins from "./orderMixins";

  export default {
    name: "ZhengMaOrder",
    mixins: [orderMixins]
  }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .ball-table-wrap {
        font-size: 0;
    }
    .ball-table-box {
        display: inline-block;
        width: 25%;
        @{deep} {
            .ball-table:nth-child(n + 1) {
                .ball-table__label-title, .ball-table__odds-title, .ball-table__price-title, .ball-table__label, .ball-table__odds, .ball-table__price {
                    border-left: none;
                }
            }
        }
    }
</style>
