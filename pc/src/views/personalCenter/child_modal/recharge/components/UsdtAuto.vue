<template>
    <div class="currency-recharge11">
        <div class="currency-recharge11__status-bar">
            <i></i>
            <span>{{ $tex("订单已生成") }}</span>
        </div>
        <div class="currency-recharge11__logo">
            <img src="~@/assets/images/currency/usdt.png">
        </div>
        <Form v-model="recharge11Form" label-position="right" :label-width="100">
            <FormItem :label="`${$tex('订单号')}：`" prop="orderId">
                <Input readonly v-model="recharge11Form.orderId"></Input>
            </FormItem>
            <FormItem :label="`${$tex('订单金额')}：`" prop="orderMoney">
                <Input readonly v-model="recharge11Form.orderMoney" class="currency-recharge11__money">
                    
                </Input>
                <div class="currency-exchange">
                    <img src="~@/assets/images-v6/jinggao.png" alt="">
                    {{ recharge11Form.usdtMoney }} * {{ recharge11Form.exchangeRate }} = {{ recharge11Form.orderMoney }}
                </div>
            </FormItem>
            <FormItem :label="`${$tex('USDT数量')}：`" prop="usdtMoney">
                <Input readonly v-model="recharge11Form.usdtMoney" class="currency-recharge11__amount currency-recharge11__append">
                    <span v-clipboard="recharge11Form.usdtMoney"
                        v-clipboard:success="onCopySuccess"
                        v-clipboard:error="onCopyError" slot="append" class="copy"></span>
                </Input>
            </FormItem>
            <FormItem readonly :label="`${$tex('存款地址')}：`" prop="address">
                <Input readonly v-model="recharge11Form.address" class="currency-recharge11__append">
                    <span v-clipboard="recharge11Form.address"
                        v-clipboard:success="onCopySuccess"
                        v-clipboard:error="onCopyError" slot="append" class="copy"></span>
                </Input>
            </FormItem>
        </Form>
        <div v-if="!orderFailure" class="currency-recharge11__scan">
            <img :src="recharge11Form.addressImgUrl" alt="">
        </div>
        <div v-if="!orderFailure" class="currency-recharge11__expire">
            <span>
                {{ recharge11Countdown }}
            </span>
        </div>
        <div v-if="!orderFailure" class="currency-recharge11__tips">
            <i></i>
            <div>
                <p>
                    1.<i18n path="请确保实际转账{money}USDT,否则无法自动到账。" :tag="false">
                        <template slot="money">
                           <span style="font-size: 18px;"> {{recharge11Form.usdtMoney}} </span>
                        </template>
                    </i18n>
                </p>
                <p>2.{{ $tex("超时请重新下单。") }}</p>
            </div>
        </div>
        <div v-if="orderFailure" class="currency-recharge11__failure">
             <img src="~@/assets/images/currency/shixiao.png" alt="">
             <p>{{ $tex('订单已失效，请重新下单') }}</p>
        </div>
        <div class="currency-content">
                <div class="currency-content__title">{{$tex("如何快速建立货币账户")}}?</div>
                <ul class="currency-content__bourse">
                    <li class="currency-content__bourse-item"
                        @click="jump2Bourse(recharge11Form.tutorialUrl1)">
                        <img src="~@/assets/images/currency/usdt.png" alt="">
                        <span>{{recharge11Form.tutorialName1}}</span>
                    </li>
                    <li class="currency-content__bourse-item"
                        @click="jump2Bourse(recharge11Form.tutorialUrl2)">
                        <img src="~@/assets/images/currency/usdt.png" alt="">
                        <span>{{recharge11Form.tutorialName2}}</span>
                    </li>
                </ul>
            </div>
        <div class="currency-recharge11__actions">
            <div class="currency-recharge11__back" @click="onBackClick">{{$tex("返回上一级")}}</div>
            <div class="currency-recharge11__record" @click="$router.push({ name: 'personalCenter', params: { id: 'trade' } })">{{ $tex('查看充值记录') }}</div>
        </div>
    </div>
</template>

<script>
import countdown, { zeroPad } from '@/utils/countdown.js';
import { hasPermission } from "@/utils/authority-utils";
import {mapGetters} from "vuex";

export default {
    name: "UsdtAuto",
    props: {
        data: {
            type: Object
        },
        localApiCoin: {
            type: Object
        }
    },
    data() {
        return {
            recharge11Form: {
                orderId: "",
                orderMoney: "",
                usdtMoney: "",
                address: "",
                addressImgUrl: "",
                tutorialName1: "",
                tutorialName2: "",
                tutorialUrl1: "",
                tutorialUrl2: "",
                exchangeRate: ''
            },
            recharge11Countdown: '',
            countdownTimer: -1,
            orderFailure: false
        }
    },
    computed: {
        ...mapGetters(["sysExchangeInfo"]),
        showCurrencyExchange() {
            return hasPermission('element.currencyExchange') && this.localApiCoin.scur && this.sysExchangeInfo.tcur;
        },
    },
    watch: {
        data: {
            immediate: true,
            handler(data) {
                if (data) {
                    clearInterval(this.countdownTimer)
                    const content = JSON.parse(data.data.content);
                    this.recharge11Form.orderId = data.data.orderId;
                    if (this.showCurrencyExchange) {
                        this.recharge11Form.orderMoney = `${data.data.orderMoney}${this.localApiCoin.icon}`;
                    } else {
                        this.recharge11Form.orderMoney = data.data.orderMoney;
                    }
                    this.recharge11Form.usdtMoney = content.usdtMoney;
                    this.recharge11Form.address = content.address;
                    this.recharge11Form.addressImgUrl = content.addressImgUrl;
                    this.recharge11Form.tutorialName1 = content.tutorialName1;
                    this.recharge11Form.tutorialName2 = content.tutorialName2;
                    this.recharge11Form.tutorialUrl1 = content.tutorialUrl1;
                    this.recharge11Form.tutorialUrl2 = content.tutorialUrl2;
                    this.recharge11Form.exchangeRate = content.exchangeRate;
                    this.countdownTimer = countdown(content.overtime / 1000, (s) => {
                        this.recharge11Countdown =
                        zeroPad(Math.floor((s / 60) % 60)) +
                        ':' +
                        zeroPad(s % 60);
                        if (s <= 0) {
                            this.orderFailure = true;
                        }
                    });
                }
            }
        }
    },
    methods: {
        jump2Bourse(url) {
            window.open(url)
        },
        onCopySuccess(el) {
            this.$Message.success(this.$tex("复制成功"));
        },
        onCopyError(el) {
            this.$Message.success(this.$tex("复制失败"));
        },
        onBackClick() {
            this.$emit("get-back-status");
        },
    }
}
</script>

<style scoped lang="less">
@deep: ~">>>";
.currency-recharge11 {
    width: 100%;
    min-height: 100%;
    padding: 15px 25px;
    &__status-bar {
        background: #12b886;
        padding: 12px;
        font-size: 16px;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        margin-bottom: 38px;
        > * {
            vertical-align: middle;
        }
        i {
            display: inline-block;
            width: 22px;
            height: 22px;
            background: url("~@/assets/images/currency/cp.png") no-repeat;
            background-size: contain;
            margin-right: 10px;
        }
    }
    &__logo {
        text-align: center;
        margin-bottom: 40px;
        img {
            width: 60px;
            height: 60px;
            float: none;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        @{deep} .ivu-input-wrapper {
            min-width: 170px;
            .ivu-input-group-append {
                position: absolute;
                height: 100%;
                top: 0;
                bottom: 0;
                right: 0;
                background: transparent;
                border: none;
                padding: 0;
                width: auto;
                z-index: 2;
                display: flex;
                align-items: center;
            }
            .copy {
                display: inline-block;
                width: 12px;
                height: 12px;
                cursor: pointer;
                background-image: url("~@/assets/images/currency/copy.png");
                background-repeat: no-repeat;
                background-size: contain;
                margin: 0 10px;
                &:hover {
                    background-image: url("~@/assets/images/currency/copy-hover.png");
                }
            }
        }
    }
    &__amount {
        @{deep} .ivu-input {
            color: #ed9711;
        }
        
    }
    &__append {
        @{deep} input {
            padding-right: 30px;
        }
    }
    &__scan {
        background-image: url("~@/assets/images/currency/sijiao.png");
                background-repeat: no-repeat;
                background-size: contain;
                width: 116px;
                height: 116px;
                margin: auto;
                padding: 4px;
                img {
                    float: none;
                    width: 100%;
                    height: 100%;
                }
    }
    &__expire {
        text-align: center;
        margin: 10px 0 26px;
        font-size: 12px;
        font-weight: bold;
        span {
            display: inline-block;
            padding: 6px 24px;
            color: #be1204;
            border-radius: 9999px;
            background-color: #fbf1f0;
        }
    }
    &__failure {
        color: #be1204;
        text-align: center;
        img {
            float: none;
            width: 60px;
            height: 60px;
        }
        p {
            margin-top: 25px;
        }
    }
    &__actions {
        margin-top: 40px;
        text-align: center;
    }
    &__record {
        color: #be1204;
        margin-top: 10px;
        text-decoration: underline;
        cursor: pointer;
    }
    &__back {
        width: 110px;
        padding: 6px;
        text-align: center;
        border-radius: 4px;
        color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        background: #be1204;
    }
    &__tips {
        display: flex;
        justify-content: center;
        color: #be1204 ;
        > i {
            background: url('~@/assets/images/currency/zyts.png') no-repeat;
            background-size: contain;
            width: 14px;
            height: 14px;
            margin-right: 5px;
            margin-top: 7px;
        }
        span {
            color: #ed9711;
        }
    }
}
 .currency-content {
    width: 300px;
    margin: 0 auto 10px;
}
    .currency-content__title {
        font-size: 14px;
        margin-top: 40px;
        color: #333333;
    }
    .currency-content__bourse {
        display: flex;
        margin-top: 16px;
        margin-bottom: 16px;
        .currency-content__bourse-item:nth-child(2n + 1) {
            margin-right: 14px;
        }
    }
    .currency-content__bourse-item {
        cursor: pointer;
        flex: 1;
        height: 40px;
        border-radius: 6px;
        background-color: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
            padding: 0 16px;
        img {
            width: 21px;
            height: 21px;
            float: none;
            margin-right: 8px;
        }
    }
    .currency-content__dsc {
        font-size: 12px;
        color: #999999;
    }
    .currency-content__help {
        font-size: 12px;
        color: #ff4646;
        text-align: center;
        text-decoration: underline;
    }
    .currency-exchange {
        color: #b2b2b2;
        img {
            width: 15px;
            height: 15px;
            margin-right: 4px;
            float: none;
            vertical-align: text-top;
        }
    }
</style>