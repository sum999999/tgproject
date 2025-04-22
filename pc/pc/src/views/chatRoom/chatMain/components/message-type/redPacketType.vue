<template>
    <!-- 红包 -->
    <div class="msg-redpacket" @click="getRedpacket">
        <div class="txt" :class="{
            'en': !checkChineseKey()
        }">
            <p class="tit1">{{remark}}</p>
            <p class="tip">{{$tex("领取红包")}}</p>
        </div>
        <div class="bottom">{{$tex("快来抢吧")}}！</div>
    </div>
</template>

<script>
  import { checkChineseKey } from "@/lang";

    export default {
        name: "redPacketType",
        props: {
            message: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        computed: {
          remark() {
              return this.message.content.extra.remark;
          }
        },
        methods: {
          checkChineseKey,
            getRedpacket() {
                this.$emit('on-get-redpacket');
            }
        }
    }
</script>

<style scoped lang="less">
@imgSrc: '~@/assets/images/chat';
.msg-redpacket {
    background: transparent;
    cursor: pointer;
    .txt {
        background: url('@{imgSrc}/hb-fuli.png') 10px 10px #fa9e3b
        no-repeat;
        color: #fff;
        height: 88px;
        padding: 20px 20px 20px 74px;
        border-top-right-radius: 10px;
        width: 300px;
        &.en {
            background: url('@{imgSrc}/hb-fuli-en.png') 10px 10px #fa9e3b
        }
        .tit1 {
            font-size: 16px;
            max-width: 500px;
            overflow: hidden;
            height: 25px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .bottom {
        background-color: #eeeeee;
        color: #999;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }
}
</style>
