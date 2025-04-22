<template>
    <div class="chat-pin">
        <span class="tt">{{$tex("置顶信息")}}：</span>
        <div class="text" v-html="text"></div>
        <i class="iconfont icon-close" @click.stop="onPinClose"></i>
    </div>
</template>

<script>
    export default {
        name: "stickPin",
        props: {
            text: {
                type: String,
                default: ""
            }
        },
        methods: {
            onPinClose() {
                this.$emit("on-pin-close");
            }
        }
    }
</script>

<style scoped lang="less">
    .chat-pin {
        position: absolute;
        left: 0;
        top: 91px;
        right: 1px;
        height: 46px;
        line-height: 46px;
        z-index: 10;
        padding: 0 10px 0 115px;
        background-color: #fff;
        color: #666;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;

        .text {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .tt {
            position: absolute;
            left: 40px;
            width: 85px;
            top: -1px;
            /*     color: @primary-color; */
            font-weight: bold;
            font-size: 15px;
        }

        .icon-close {
            position: absolute;
            left: 10px;
            top: 0px;
            font-size: 21px;
            cursor: pointer;
        }
    }
</style>
