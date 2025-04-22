<template>
    <div class="sebo-order">
        <div class="ball-table-wrap">
            <div v-for="(layout, oIndex) in layouts" :key="oIndex">
                <div v-for="(ball, iIndex) in layout.balls" :key="iIndex" class="ball-table-box">
                    <ball-table v-model="ball.value" :show-title="iIndex  < 3" :label="ball.ball" :odds="ball.disDoubleOdds" @focus="onFocus(ball, iIndex)" @blur="onBlur(ball, iIndex)">
                        <div slot="label" class="label-block">
                            <div class="label-block__color" :style="{
                                'background': ball.color
                            }"></div>
                            <span class="label-block__text">{{ ball.ball }}</span>
                        </div>
                    </ball-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import orderMixins from "./orderMixins";

  export default {
    name: "SeBoOrder",
    mixins: [orderMixins],
  }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .ball-table-wrap {
        font-size: 0;
    }
    .ball-table-box {
        display: inline-block;
        width: 33.3333%;
        @{deep} {
            .ball-table:nth-child(n + 1) {
                .ball-table__label-title, .ball-table__odds-title, .ball-table__price-title, .ball-table__label, .ball-table__odds, .ball-table__price {
                    border-left: none;
                }
            }
        }
    }
    .label-block {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .label-block__color {
        width: 20px;
        height: 20px;
        display: inline-block;
        border-radius: 3px;
    }
    .label-block__text {
        margin-left: 5px;
    }
</style>
