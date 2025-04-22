<template>
    <div class="lottery-act flex">
        <div class="lottery bor-rad" :style="`backgroundImage:url(${lotteryInfo.pc3icon})`">
            <dl class="intro">
                <dt>
                    <h3>{{lotteryInfo.typeName}}</h3>
                    <div class="lottery-item">
                        <div class="pie">
                             <span v-for="item in lotteryInfo.platformsRsps.slice(0,3)" :key="item.platformId" @click="goBet(item)">{{item.typeName}}</span>
                        </div>
                        <div class="pie">
                            <span v-for="item in lotteryInfo.platformsRsps.slice(3,6)" :key="item.platformId" @click="goBet(item)">{{item.typeName}}</span>
                        </div>
                        <div class="pie">
                            <span v-for="item in lotteryInfo.platformsRsps.slice(6,9)" :key="item.platformId" @click="goBet(item)">{{item.typeName}}</span>
                        </div>
                    </div>
                </dt>
                <dd>
                    <Button type="primary" @click="getMore(lotteryInfo.code)">{{$tex("了解更多")}}</Button>
                </dd>
            </dl>
        </div>
        <div class="act bor-rad" @click="goAct">
            <div class="intro">
                <h3>{{$tex("优惠活动")}}</h3>
                <div>PROMOTIONS</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['lotteryInfo'],
    methods: {
        goBet(item) {
           this.$router.push(`/lottery?fromHomeCode=${item.platformId}`);
        },
        getMore(code) {
            this.$emit('get-more',code);
        },
        goAct() {
            this.$router.push('/active');
        }
    }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
    .lottery-act {
        color: #fff;
        .lottery {
            position: relative;
            width: 772px;
            height: 300px;
            .intro {
                right: 22px;
                top: 49px;
            }
        }
        .act {
            position: relative;
            width: 384px;
            height: 300px;
            background:url('~@/assets/images-v3/index/yhhd.png') no-repeat;
            background-size: 384px 300px;
            &:hover {
                cursor: pointer;
            }
            h3 {
                margin-bottom: 2px;
            }
            .intro {
                top: 102px;
                left: 51px;
            }
            h3 + div {
                font-size: 16px;
            }
        }
        .lottery-item {
            font-size: 14px;
            line-height: 26px;
            span {
                &:hover {
                    color: @textLightColor;
                    cursor: pointer;
                    transition: all .3s;
                }
            }
        }
        dd {
            margin-top: 27px;
        }
}

</style>
