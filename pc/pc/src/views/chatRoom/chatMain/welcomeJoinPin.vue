<template>
    <div class="chat-welcome">
        {{$tex("欢迎{name}加入聊天室", {name: userName})}}
    </div>
</template>

<script>
    export default {
        name: "welcomeJoinPin",
        props: {
            userName: {
                type: String,
                default: ""
            }
        }
    }
</script>

<style scoped lang="less">
    .chat-welcome {
        position: absolute;
        left: 0;
        top: 91px;
        right: 1px;
        height: 46px;
        line-height: 46px;
        z-index: 11;
        padding: 0 10px 0 0px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background-color: rgba(70, 76, 91, .9);
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    }
</style>
