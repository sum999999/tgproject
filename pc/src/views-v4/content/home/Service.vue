<template>
    <div class="service">
        <div class="service-list">
            <ul>
                <li>
                    <span class="service-left-span icon service-icon">
                        <img src="../../images/yzfw.png" alt="">
                    </span>
                    <div class="service-right-div">
                        <h5>优质服务</h5>
                        <p>24小时登录人数</p>
                    </div>
                </li>
                <li>
                    <span class="service-left-span icon service-icon">
                        <img src="../../images/yzfw.png" alt="">
                    </span>
                    <div class="service-right-div">
                        <h5>资金安全</h5>
                        <p>强大的数据加密技术</p>
                    </div>
                </li>
                <li>
                    <span class="service-left-span icon service-icon">
                        <img src="../../images/yzfw.png" alt="">
                    </span>
                    <div class="service-right-div">
                        <h5>极速到账</h5>
                        <p>入款是秒速到达</p>
                    </div>
                </li>
                <li>
                    <span class="service-left-span icon service-icon">
                        <img src="../../images/yzfw.png" alt="">
                    </span>
                    <div class="service-right-div">
                        <h5>平台返水</h5>
                        <p>业界返水无上限</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="less" scoped>
    @boldTextColor: #81685a;
    .service{
        background-color:#f3f7fb;
        padding-bottom: 20px;
        padding-top:98px;
    }
    .service-list{
        width:1120px;
        min-width: 1120px;
        margin:auto;
        overflow: hidden;
        &>ul>li{
            float:left;
            width:205px;
            margin-right: 100px;
            height:60px;
            vertical-align: middle;
            &:last-child{
                margin:0;
            }
        }
    }
    .service-left-span{
        float:left;
    }
    .service-right-div{
        float:right;
        width:127px;
        display: inline-block;
        padding-top:6px;
        h5{
            font-weight: normal;
            color: @boldTextColor;
            font-size: 24px;
            line-height: 24px;
        }
        p{
            font-size: 14px;
            line-height: 14px;
            margin-top:12px;
            color: @boldTextColor;
        }
    }
    .icon{
        width:60px;
        height:60px;
    }
</style>