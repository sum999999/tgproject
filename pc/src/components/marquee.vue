<template>
    <div class="marquee-wp">
        <dl class="clearfix">
            <dt>
                <i class="i-icon i-notice"></i>
            </dt>
            <dd v-if="notice" @click.stop="goMarqueeNews">
                <marquee scrolldelay="100" scrollamount="6">
                    <div class="mar-content" v-html="notice"></div>
                </marquee>
            </dd>
        </dl>
    </div>
</template>
<script>
import utils from '@/utils/utils';
export default {
    data() {
        return {
            notice:''
        }
    },
    methods: {
         /**
         * 去跑马灯的新闻
         */
        goMarqueeNews() {
            this.$router.push({path:'/newsList/announce'});
        },
        /**
         * 获取轮播内容
         */
        getNotice() {
          this.$store.dispatch("queryAnnounceEssayList", { current: 1,
            size: 100,
            type: '02' }).then(response => {
                    if (response.data.code !== 0) return
                    let n = response.data.data.list
                    let txt = ''
                    n.forEach(item => {
                        txt +=
                            utils.escapeHtml(item.content) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    })
                    this.notice = txt
                })
        },
    },
    created() {
        this.getNotice();
    }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
    .marquee-wp {
        width: 100%;
        height: 100%;
        &:hover {
            cursor: pointer;
        }
        dt {
            float:left;
            height: 36px;
            i {
                width: 25px;
                height: 20px;
                margin-top: 8px;
                background-position: -10px -11px;
            }
        }
        dd {
            float:left;
            width: 330px;
            height: 36px;
            marquee {
                height: 36px;
                line-height: 36px;
            }
            .mar-content {
                display: inline-block;
                height: 36px;
                vertical-align: top;
                white-space: nowrap;
                margin: 0;
                @{deep} * {
                    display: inline-block;
                    height: 100%;
                    vertical-align: middle;
                    font-size: 12px !important;
                    background: none !important;
                    * {
                        display: inline-block;
                        vertical-align: top;
                        height: 36px;
                        line-height: 36px;
                        font-size: 12px !important;
                        background: none !important;
                    }
                }
            }
        }
    }
</style>
