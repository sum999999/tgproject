<template>
    <div class="game-suspend-wp">
       <div class="game-suspend">
           <dl>
               <dt>
                   <div class="txt">
                        <h2>{{currGameIntro.typeName}}</h2>
                        <p>{{typeEnName}}</p>
                        <!-- <P>{{typeEnName[1]}}</P> -->
                   </div>
               </dt>
               <dd>
                   <div class="intro">
                        <span>{{currGameIntro.content}}</span>
                   </div>
               </dd>
           </dl>
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
    width: 266px;
    height: 294px;
    dt{
        // height: 173px;
        // padding: 40px;
        // height: 140px;
        // padding-bottom: 40px;
        background:rgba(0, 0, 0, 0.8);
        color: #fff;
        &:before{
            position: absolute;
            left: 40px;
            top:36px;
            display: block;
            content: '';
            width: 1px;
            height: 68px;
            background-color: @textLightColor;
        }
        .txt {
            // padding: 40px;
            height: 140px;
            padding: 36px 14px 36px 40px;
            padding-left: 60px;
            h2 {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: -13px;
                font-weight: normal;
                font-family: 'PingFangSC Semibold';
                font-size: 40px;
                color: @textLightColor;
            }
            p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 16px;
                margin-top: 3px;
            }
        }
    }
    .intro {
        // height: 170px;
        background: rgba(254, 209, 54, .85);
        padding: 28px 30px;
        max-height: 223px;
        span {
            display:block;
            width: 100%;
            height: 100%;
            display:-webkit-box;
            overflow:hidden;
            text-overflow:ellipsis;
            -webkit-line-clamp: 7;
            -webkit-box-orient:vertical;
            color: #000;
        }
    }
}
</style>