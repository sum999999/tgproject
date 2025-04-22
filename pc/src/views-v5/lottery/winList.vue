<template>
    <div class="win-list-wrap">
        <div class="win-list ranking">
            <div
                    class="rowup"
                    @mouseenter="leeScorllStop()"
                    @mouseleave="leeScorllStart()"
            >
                <ul
                        ref="rowup"
                        :style="{top: rankTop + 'px'}"
                        class="scroll-ul lee-scroll-ul"
                >
                    <li
                            class="clearfix"
                            v-for="(item, idx) in ranking"
                            :class="{level: idx < 3}"
                            :key="idx"
                    >
                        <span>{{item.userCode}}</span>
                        <span>
                  喜中&nbsp;{{item.prizeTotal}}&nbsp;元
                </span>
                        <span>{{item.lotteryName}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "winList",
        data() {
          return {
              rankTop: 0,
              ranking: [],
              scrollObj: null,
              scrollObjLeft: null
          };
        },
        created() {
            this.requestForqueryIndexLotteryPrizeList();
            this.loop = setInterval(() => {
                this.requestForqueryIndexLotteryPrizeList();
            }, 1000 * 60 * 5);
        },
        mounted() {
            this.leeScorllStart();
        },
        beforeDestroy() {
            clearInterval(this.scrollObj);
            clearInterval(this.scrollObjLeft);
            clearInterval(this.loop);
        },
        methods: {
            leeScorllStart() {
                this.scrollObj = setInterval(() => {
                    if (!$(".lee-scroll-ul")[0].childNodes.length) {
                        return;
                    }
                    this.rankTop--;
                    if (this.rankTop == -81) {
                        this.rankTop = 0;
                        let dom = $(".lee-scroll-ul")[0].childNodes[0];
                        let dom2 = $(".lee-scroll-ul")[0].childNodes[1];
                        $(".lee-scroll-ul")[0].appendChild(dom);
                        $(".lee-scroll-ul")[0].appendChild(dom2);
                    }
                }, 40);
            },
            leeScorllStop() {
                clearInterval(this.scrollObj);
            },
            requestForqueryIndexLotteryPrizeList() {
                this.$http
                    .post("/api/v2/lottery/queryPrizeRankingList", "", { unenc: true })
                    .then(response => {
                        if (response.data.code !== 0) {
                            $(".ranking")[0].style.opacity = 0;
                            return;
                        }
                        $(".ranking")[0].style.opacity = 1;
                        this.ranking = response.data.data.prizeRankingList;
                    });
            },
        }
    }
</script>

<style scoped lang="less">
    .win-list-wrap {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
        width: 1200px;
        .win-list {
            width: 606px;
            height: 384px;
            background-image: url(~@/assets/images-v5/zhongjiang-bang.png);
            background-size: cover;
            background-repeat: no-repeat;
            margin-top: 35px;
            margin-left: 40px;
            position: relative;
        }
    }
    .rowup {
        position: absolute;
        height: 200px;
        overflow: hidden;
        bottom: 32px;
        left: 32px;
        right: 32px;
        > ul {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            > li {
                height: 40px;
                border-bottom: 1px solid #ffffff;
                line-height: 40px;
                box-sizing: border-box;
                color: #ffffff;
                font-size: 16px;
                text-align: center;
            }
            > li span:nth-child(1) {
                width: 30%;
                float: left;
            }
            > li span:nth-child(2) {
                width: 40%;
                text-align: center;
                color: #fbea8f;
            }
            > li span:nth-child(3) {
                width: 30%;
                float: right;
            }
        }
    }
</style>
