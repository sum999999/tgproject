<template>
    <div class="accountCard">
        <div class="card-top">
            <div class="card-logo">
                <slot name="cardImg">
                </slot>
            </div>
        </div>
        <div class="card-line">
            <span class="circle circle-left"></span>
            <span class="circle circle-right"></span>
        </div>
        <div class="card-bottom">
            <slot name="cardContent">
            </slot>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.accountCard {
    width:348px;
    border:1px solid #f3f3f3;
    box-shadow: 0px 4px 12px 0px #f3f3f3;
    border-radius: 4px;
    margin:auto;
    position: relative;
}
.card-line {
    position: absolute;
    width:350px;
    left:-2px;
    right:0;
    overflow: hidden;
    margin-top:-12px;
    &>span{
        display:inline-block;
        width:25px;
        height:25px;
        border-radius: 100%;
        border:1px solid #f3f3f3;
        box-shadow: 0px 4px 12px 0px #f3f3f3;
        background-color:#fcfcfc;
        &.circle-left {
            float:left;
            margin-left:-12px;
        }
        &.circle-right {
            float:right;
            margin-right:-12px;
        }
    }
}
.card-top {
    height:100px;
    line-height: 100px;
    border-bottom: 3px dashed #eee;
    padding-top:20px;
    .card-logo {
        width:60px;
        height:60px;
        border-radius: 100%;
        vertical-align: middle;
        margin:auto;
        &>img{
            width:100%;
            float:initial;
        }
    }
}
.card-bottom {
    margin-top:30px;
}
</style>


