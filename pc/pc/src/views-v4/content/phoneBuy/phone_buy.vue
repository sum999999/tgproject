<template>
    <div class="phoneBuy">
        <div class="banner"></div>
        <div class="download">
            <div class="download-wrapper">
                <div class="download-left">
                    <div class="tg-left-words">
                        <div class="tgImg">
                            <img src="/configstatic/pc/images/logo-icon.png" alt="">
                        </div>
                        <div class="tgAds">
                            <div class="TGtypeName">{{$configText.main}}</div>
                            <div class="TGwords">把快乐装入口袋 整合所有游戏，快乐随心所欲！APP让会员更方便游戏，全屏的视觉享受</div>
                        </div>
                    </div>
                    <div class="downloadApp">
                        <div class="download-types">安卓/苹果 客户端下载</div>
                        <div class="arcode">
                            <img :src="qrcodes[1]&&qrcodes[1].img" alt=""/>
                            <span class="download-icon">
                                <img src="/static/images/android.png" alt="">
                            </span>
                        </div>
                        <div class="arcode">
                            <img :src="qrcodes[0]&&qrcodes[0].img" alt=""/>
                            <span class="download-icon">
                                <img src="/static/images/ios.png" alt="">
                            </span>
                        </div>
                    </div>
                </div>
                <div class="download-right">
                    <img src="../../images/cai.png" alt="">
                </div>
            </div>
        </div>
        <carousel :dataList="gameInfo"
                  :showNum="showNum"></carousel>
        <div class="features">
            <p class="features-words">6大优势成就极致体验</p>
            <div class="feature-imgs"><img src="../../images/jzty.png" alt=""></div>
            <div class="features-bottom-words">
                <ul>
                    <li><a href="javascript:void(0)">兼容性强</a></li>
                    <li><a href="javascript:void(0)">安全快捷</a></li>
                    <li><a href="javascript:void(0)">灵活存提</a></li>
                    <li><a href="javascript:void(0)">手机支付宝</a></li>
                    <li><a href="javascript:void(0)">随心互动</a></li>
                    <li><a href="javascript:void(0)">语言丰富</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import carousel from "../home/Carousel";
import { queryGameListTypes } from "@/api/game";

export default {
     components:{
        carousel
    },
    computed: {
        qrcodes() {
            return this.$store.state.qrcodes;
        },
        servicer() {
        return this.$store.state.servicer;
        }
   },
    data() {
        return {
            gameInfo: [],
            showNum:4
        }
    },
    async created() {
        let code = this.$route.params.id;
        this.getGameInfo();
    },
    methods: {
        getGameInfo(code=null) {
          queryGameListTypes({ code: code }).then(res => {
                    const { code, data } = res.data;
                if (code !== 0) return;
                    const { list } = data;
                if (list.length > 0) {
                    this.gameInfo = list.slice(1,list.length);
                }
            });
        },
    },
}
</script>
<style lang="less" scoped>
   .banner{
       width:100%;
       height:501px;
       background: url(../../images/TG_dowload.png) no-repeat center center;
       background-size: cover;
   }
   .download{
       width:100%;
       height:490px;
       background-color: #fff;
   }
   .TGtypeName{
       font-size: 24px;
       line-height: 24px;
       color:#040304;
   }
   .TGwords{
       font-size: 14px;
       line-height: 14px;
       margin-top:24px;
       color:#969696;
   }
   .download-wrapper{
       width:1200px;
       margin:auto;
       padding-top:82px;
       overflow: hidden;
   }
   .download-left{
       width:624px;
       float:left;
   }
   .tgImg{
       width:54px;
       height:57px;
       float:left;
       &>img{
           width:100%;
       }
   }
   .tgAds{
       float:left;
       margin-left: 14px;
   }
   .download-right{
       float:right;
       width:416px;
       height:387px;
   }
   .tg-left-words{
       overflow: hidden;
   }
   .downloadApp{
       margin-top:54px;
       margin-left: 70px;
   }
   .download-types{
       font-size: 16px;
       line-height: 16px;
       color: #040304;
   }
   .features{
       width:100%;
       height:350px;
       background-color:#fff;
   }
   .phoneBuy /deep/.footer{
       background-color:#fff;
   }
   .features-words{
       font-size: 20px;
       line-height: 20px;
       color:#86635a;
       text-align: center;
       padding-top:92px;
   }
   .feature-imgs{
       width:873px;
       margin:auto;
       margin-top:52px;
       overflow: hidden;
       &>img{
           width:100%;
       }
   }
   .features-bottom-words{
       width:874px;
       margin:auto;
       margin-top:24px;
   }
   .features-bottom-words{
       width:853px;
       margin:auto;
       margin-top:24px;
       overflow: hidden;
   }
   .features-bottom-words>ul>li{
       float:left;
       margin-right: 90px;
       &:nth-child(6){
            margin: 0;
       }
       &>a{
           font-size: 16px;
           line-height: 16px;
           color:#866e5a;
       }
   }
   .downloadApp{
       .arcode{
           position: relative;
           margin-top:32px;
           margin-right: 32px;
           width:120px;
           height:120px;
           float:left;
           border:8px solid #2e73ff;
           border-radius: 10px;
           padding: 5px;
           &>img{
               float: initial;
           }
           .download-icon{
               display:inline-block;
               width:28px;
               height:28px;
               position: absolute;
               top:0;
               left:0;
               right:0;
               bottom:0;
               margin:auto;
               &>img{
                   width:100%;
                   float: initial;
               }
           }
       }
   }
   .phoneBuy /deep/.swiper-content{
       top:40px;
   }
</style>
