<template>
    <div class="game-suspend-wp">
       <div class="game-suspend">
           <h1 class="en-title">{{typeEnName}}</h1>
           <div>
               <h1 class="title">{{currGameIntro.typeName}}</h1>
           </div>
           <div>
               <p class="dsc-content">{{currGameIntro.content}}</p>
           </div>
           <div class="ply-game-btn">
               {{$tex("立即游戏")}}&nbsp;！
           </div>
<!--           <dl>-->
<!--               <dt>-->
<!--                   <div class="txt">-->
<!--                        <h2>{{currGameIntro.typeName}}</h2>-->
<!--                        <p>{{typeEnName}}</p>-->
<!--                        &lt;!&ndash; <P>{{typeEnName[1]}}</P> &ndash;&gt;-->
<!--                   </div>-->
<!--               </dt>-->
<!--               <dd>-->
<!--                   <div class="intro">-->
<!--                        <span>{{currGameIntro.content}}</span>-->
<!--                   </div>-->
<!--               </dd>-->
<!--           </dl>-->
       </div>
    </div>
</template>

<script>
export default {
    props:['currGameIntro'],
    computed: {
        typeEnName() {
            if(!this.currGameIntro.typeEnName) return '';
            return this.currGameIntro.typeEnName;
        }
    }
}
</script>

<style lang="less" scoped>
.game-suspend-wp {
    color: #ffffff;
    .ply-game-btn {
        width: 210px;
        line-height: 56px;
        color: #ffffff;
        background-color: #ff464b;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
        border-radius: 8px;
        padding-left: 16px;
        cursor: pointer;
        margin-top: 17px;
    }
    .en-title {
        margin-top: 35px;
        font-size: 40px;
        width: 679px;
        border-left: 6px solid #ff464b;
        background-color: #404040;
        letter-spacing: 13px;
        padding-left: 10px;
    }
    .title {
        font-size: 50px;
        border-left: 6px solid #ff464b;
        padding-right: 38px;
        background-color: #404040;
        letter-spacing: 10px;
        padding-left: 10px;
        display: inline-block;
    }
    .dsc-content {
        font-size: 23px;
        background-color: #404040;
        min-width: 445px;
        padding: 10px 24px 10px 24px;
        margin-top: 6px;
        display: inline-block;
    }
}
</style>
