<template>
    <div class="page404">
        <div class="content404">
            <img src="/static/images/404.png" alt="">
            <div class="clr"></div>
            <p>{{$tex("抱歉，你访问的页面不存在")}}</p>
            <p class="tip">{{$tex("你输入的网址有误或者链接已经过期。")}}</p>
            <div class="back-home">
                <Button type="warning" v-preventReClick="2000" @click="$router.push('/')">{{$tex("返回首页")}}</Button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.content404 {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 560px;
    margin: 0 auto;
}
.content404 p {
    font-size: 30px;
    color: #3a3a3a;
    text-align: center;
}
.content404 img {
    margin-bottom: 10px;
}
.content404 .tip {
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 20px;
}
.content404 .back-home {
    text-align: center;
}
.content404 .back-home button {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    width: 135px;
    height: 40px;
    line-height: 38px;
    border-radius: 3px;
}
</style>

