<template>
    <div class="commom-announce-wp">
        <div class="announce">
            <dl>
                <dt>
                    <span>最新公告</span>
                </dt>
                <dd>
                    <div class="marquee-wp">
                         <marquee scrolldelay=100 scrollAmount=6 class="marquee">
                            <div class="notice-content" v-html="notice" @click="jump"></div>
                        </marquee>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
   data() {
       return {
           notice: ''
       }
   },
    methods: {
        getNotice() { //获取跑马灯
          this.$store.dispatch("queryAnnounceEssayList", { current: 1,
            size: 100,
            type: '02' }).then(response => {
                if (response.data.code !== 0) return;
                let n = response.data.data.list;
                let txt = "";
                n.forEach(item => {
                    txt +=
                    utils.escapeHtml(item.content) +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                });
                this.notice = txt;
            });
        },
        jump() {
            this.$router.push({path:'/newsList/announce'});
        }
    },
    created() {
        this.getNotice();
    }
}
</script>

<style lang="less">
    .commom-announce-wp {
        padding: 20px 0;
        .announce {
            height: 50px;
            padding: 10px 20px;
            border-radius: 10px;
            background-color: @baseColor;
        }
        dl {
            line-height: 30px;
        }
        dt {
            position: relative;
            float: left;
            width: 100px;
            height: 30px;
            padding-left: 26px;
            font-size: 16px;
            font-family: 'PingFang SC Medium';
            color: @textLightColor;
            background:url('~@/assets/images-v4/index/ggao.png') no-repeat left center;
            &:after{
                position: absolute;
                right: 0;
                top: 0;
                display: block;
                content: '';
                width: 1px;
                height: 100%;
                background-color: #444;
            }
        }
        dd {
           float:left;
           width: 1030px;
           height: 30px;
           padding-left: 10px;
        }
        .marquee-wp {
            width: 1030px;
            padding-right: 10px;
            .notice-content {
                width: 1000000px;
                height: 30px;
                margin: 0;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                word-break: normal;
                &:hover {
                    cursor:pointer;
                }
                p {
                    display: inline-block;
                    height: 100%;
                    font-size: 16px !important;
                    background: none !important;
                    color: #d2d2d2!important;
                    * {
                        display: inline-block;
                        vertical-align: top;
                        height: 100%;
                        font-size: 16px !important;
                        background: none !important;
                        color: #d2d2d2!important;
                    }
                }
            }
        }
    }
</style>
