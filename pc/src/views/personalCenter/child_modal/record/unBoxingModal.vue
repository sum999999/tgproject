<template>
    <modal :modalShow='isShow'
           claName="unBoxingModal"
           :width="296"
           :hasHeader="false"
           :hasFooter="false"
           :maskClosable="true"
           :hasOkBtn="false"
           @btn-cancel="onCancel">
        <template slot="content">
            <i class="close" @click="onCancel"></i>
            <div>{{$tex("恭喜恭贺，您的今日收益")}}</div>
            <div class="clearfix">
                <div class="lottery">
                    <div>{{$tex("游戏投注")}}</div>
                    <div>{{$tex("￥")}}{{todayBetWin.betMoney}}</div>
                </div>
                <div class="win">
                    <div>{{$tex("游戏中奖")}}</div>
                    <div>{{$tex("￥")}}{{todayBetWin.prizeMoney}}</div>
                </div>
            </div>
            <div class="shared" @click="onSharedClick">{{$tex("聊天室分享")}}</div>
        </template>
    </modal>
</template>

<script>
    import {mapGetters} from "vuex";

    import modal from "@/components/modal.vue";

    export default {
        name: "unBoxingModal",
        components: { modal },
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
          return {
              isShow: this.value
          }
        },
        computed: {
            ...mapGetters(["todayBetWin"])
        },
        watch: {
            value(value) {
                this.isShow = value;
            },
            isShow(value) {
                if (value !== this.value) {
                    this.$emit("input", value);
                }
            }
        },
        methods: {
            onSharedClick() {
              this.$emit("shared-click");
            },
            onCancel() {
                this.isShow = false;
            }
        }
    }
</script>

<style>
</style>
<style scoped>
    .shared {
        border-radius: 12px;
        line-height: 36px;
        width: 200px;
        margin: auto;
        background-image: linear-gradient(to bottom, #ffec7f, #ffbf39);
        color: #ff0003;
        cursor: pointer;
    }
    .lottery {
        float: left;
        width: 50%;
    }
    .win {
        float: right;
        width: 50%;
    }
    .lottery, .win {
        display: inline-block;
        margin: 30px 0px 10px;
        div:nth-child(2) {
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }

    .lottery div:nth-child(2), .win div:nth-child(2) {
        color: #ffec7f;
    }

    .close {
        position: absolute;
        background: url("~@/assets/images/record/close.png") no-repeat;
        display: inline-block;
        width: 36px;
        height: 36px;
        top: -30px;
        right: -36px;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .v-transfer-dom >>> .unBoxingModal .ivu-modal-content {
        border: none;
        background: url("~@/assets/images/record/hb_bg.png") no-repeat;
        background-size: 100%;
        height: 330px;
    }
    .v-transfer-dom >>> .unBoxingModal .ivu-modal-body {
        padding-top: 156px;
        text-align: center;
        color: #ffffff;
        font-size: 16px;
    }
    .v-transfer-dom >>> .unBoxingModal .ivu-modal-footer {
        display: none;
    }
</style>
