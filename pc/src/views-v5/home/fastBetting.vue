<template>
    <div class="fast-betting">
        <ul class="lottery" v-for="(quickItem, quickIdx) in quickList" :key="quickIdx" :class="{active: curIndex === quickIdx}">
            <li v-for="(lottery, lotIdx) in quickItem" :key="lotIdx">
                <div class="clearfix">
                    <span class="fl title">{{lottery.lotteryName}}</span>
                    <span class="fr betting-btn" @click="goLottery(lottery)">立即投注</span>
                </div>
                <div class="clearfix row-2">
                    <down-time
                            :id="lottery.lotteryId"
                            :routeName="$route.name"
                    ></down-time>
                    <span class="change-one fr" @click="setRandom(lottery)">
                        <Icon type="loop"></Icon>
                        换一注
                    </span>
                    <span class="fr jump-trend" @click="$router.push({name: 'trend_detail', params: {id: lottery.lotteryId},query:{code:lottery.code}})">走势图</span>
                </div>
                <ul class="balls">
                    <li v-for="(num, numIdx) in lottery.nums" :key="numIdx">{{num}}</li>
                </ul>
            </li>
        </ul>
        <ul class="pagination-dot">
            <li v-for="(item, idx) in quickList" :key="idx" :class="{active: curIndex === idx}" @mouseenter="onDotClick(idx)"></li>
        </ul>
    </div>
<!--    <div class="fast-betting lf">-->
<!--        <ul class="detail-hot">-->
<!--            <li-->
<!--                    class="color-hover"-->
<!--                    v-for="(item, idx) in quickList"-->
<!--                    @mouseenter="changeHotLettery(item)"-->
<!--                    :key="idx"-->
<!--                    :style="{width: 100 / quickList.length + '%'}"-->
<!--                    :class="{active: item.lotteryId === selectedId}"-->
<!--            >-->
<!--                <span>{{item.lotteryName}}</span>-->
<!--            </li>-->
<!--        </ul>-->
<!--        <div class="selected-lottery">-->
<!--            <div class="lf">-->
<!--                <img :src="currentQuick.lotteryIcon">-->
<!--                &lt;!&ndash; count-down获取倒计时组件 只用到getTimePerido方法获取的数据&ndash;&gt;-->
<!--                &lt;!&ndash; <count-down :id="selectedId" v-if="quickList.length" @on-change="getTimePerido" style="display:none"></count-down> &ndash;&gt;-->
<!--                <div class="txt">-->
<!--                    <h5>-->
<!--                        <span>{{currentQuick.lotteryName}}&nbsp;&nbsp;</span>-->
<!--                        <span v-if="downTime.record.data">第-->
<!--              <i>{{downTime.record.data.recordList[0].periodNo}}</i>期</span>-->
<!--                    </h5>-->
<!--                    &lt;!&ndash; <p>{{downTime.hours}}时 {{downTime.minutes}}分 {{downTime.seconds}}秒后截止</p> &ndash;&gt;-->
<!--                    <down-time-->
<!--                            :id="selectedId"-->
<!--                            v-if="quickList.length"-->
<!--                            :routeName="$route.name"-->
<!--                    ></down-time>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="rf">-->
<!--                <p>-->
<!--          <span>-->
<!--            <router-link-->
<!--                    :to="{name: 'trend_detail', params: {id: currentQuick.lotteryId},query:{code:currentQuick.code}}"-->
<!--                    v-if="currentQuick.lotteryId"-->
<!--            >走势图</router-link>-->
<!--          </span>-->
<!--                    &lt;!&ndash; <span class="interval">&nbsp;|&nbsp;</span> &ndash;&gt;-->
<!--                    &lt;!&ndash; <span><router-link :to="''">手动自选</router-link></span> &ndash;&gt;-->
<!--                </p>-->
<!--                <span-->
<!--                        class="change-one"-->
<!--                        @click="setQuick()"-->
<!--                >-->
<!--          <i class="i-icon i-refresh"></i>换一注</span>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="clr"></div>-->
<!--        <div class="award-number">-->
<!--            <ul>-->
<!--                <li-->
<!--                        v-for="item in currentQuick.nums"-->
<!--                        :key="item"-->
<!--                >-->
<!--                    <i class="i-icon i-main-code"></i>-->
<!--                    <span>{{item}}</span>-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
<!--        <div class="multiple">-->
<!--            <div class="lf fill">-->
<!--        <span-->
<!--                class="btn sign"-->
<!--                @click="setOdds(-1)"-->
<!--        >¯</span>-->
<!--                <input-->
<!--                        type="number"-->
<!--                        v-model="currentQuick.chaseNum"-->
<!--                        @blur="changeInput()"-->
<!--                        @input="changeMoney($event)"-->
<!--                >-->
<!--                <span-->
<!--                        class="btn plus"-->
<!--                        @click="setOdds(1)"-->
<!--                >+</span>-->
<!--            </div>-->
<!--            <div class="txt lf">-->
<!--                &nbsp;&nbsp;倍，共&nbsp;-->
<!--                <span>{{totalOdds}}</span>&nbsp;元-->
<!--            </div>-->
<!--            <div class="input-wrapper rf">-->
<!--                &lt;!&ndash; <a class="btn primary" @click="goLottery()">立即投注</a> &ndash;&gt;-->
<!--                <Button-->
<!--                        type='primary'-->
<!--                        v-preventReClick="2000"-->
<!--                        @click="goLottery()"-->
<!--                        style='width:152px;height:40px;line-height:20px;font-size:18px;text-align:center;border:none;'-->
<!--                >立即投注</Button>-->
<!--            </div>-->
<!--        </div>-->
<!--        &lt;!&ndash; 登录弹框 &ndash;&gt;-->
<!--        <loginDlg-->
<!--                :isShow="showLoginDialog"-->
<!--                @close-login-modal="closeLoginModal"-->
<!--        ></loginDlg>-->
<!--        &lt;!&ndash; 登录弹框 &ndash;&gt;-->
<!--    </div>-->
</template>

<script>
    import downTime from "./downTime.vue";
    import loginDlg from "@/components/login_dlg.vue";
    import chunk from "lodash/chunk";

    export default {
        data() {
            return {
                showLoginDialog: false,
                selectedId: "",
                quickSplitNumber: 2,
                quickList: [],
                curIndex: 0,
                currentQuick: [],
                downTime: {
                    record: {},
                    hours: "",
                    minutes: "",
                    seconds: ""
                },
                totalOdds: 2,
            };
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        components: {
            downTime,
            loginDlg
        },
        methods: {
            onDotClick(index) {
                if (this.curIndex === index) {
                    return;
                }
                this.currentQuick = this.quickList[index];
                for (let idx = 0;idx < this.quickSplitNumber;idx++) {
                    let chaseNum = this.currentQuick[idx].chaseNum || 1;
                    this.currentQuick[idx].chaseNum = chaseNum;
                }
                this.curIndex = index;
                this.setQuick();
            },
            // 下单
            goLottery(lottery) {
                if (!this.user.userId) {
                    this.showLoginDialog = true;
                    return;
                }
                this.$router.push({
                    name: "buyLottery",
                    params: { id: lottery.lotteryId, order: lottery }
                });
            },
            setRandom(lottery) {
                let chaseNum = lottery.chaseNum || 1;
                let random = require(`@/utils/random/${
                    lottery.code
                    }.js`);
                let layout = JSON.parse(lottery.layout);
                let balls = random[lottery.lotteryPlayId](layout.optballs);
                let arr = balls.split(",");
                if (balls.indexOf("|") > -1) {
                    arr = balls.split("|");
                }
                arr = arr.filter(item => item); // 去掉空的数组
                this.$set(lottery, "nums", arr);
                this.$set(lottery, "chaseNum", chaseNum);
                this.$set(lottery, "balls", balls);
            },
            // 获取随机数
            setQuick() {
                for (let idx = 0;idx < this.quickSplitNumber;idx++) {
                    this.setRandom(this.currentQuick[idx]);
                }
            }
        },
        created() {
            //  获取热门彩种
            this.$http
                .post("/api/v2/lottery/queryIndexQuickBettingList", "", { unenc: true })
                .then(response => {
                    if (response.data.code !== 0) return;
                    $(".fast-betting")[0].style.opacity = 1;
                    this.quickList = chunk(response.data.data.quickBettingList.slice(0,6), this.quickSplitNumber);
                    if (this.quickList[0]) {
                        this.currentQuick = this.quickList[0];
                    }
                    this.setQuick();
                });
        }
    };
</script>

<style lang="less" scoped>
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .fast-betting {
        position: absolute;
        height: 312px;
        bottom: 0;
        left: 5px;
        right: 24px;
        border: none;
        .lottery.active {
            display: block;
        }
        .lottery {
            padding: 16px;
            color: #ffffff;
            display: none;
            > li {
                margin-bottom: 20px;
            }
            .row-2 {
                margin: 12px 0;
            }
            .change-one {
                font-size: 14px;
                cursor: pointer;
            }
            .jump-trend {
                font-size: 14px;
                margin-right: 14px;
                cursor: pointer;
            }
            .title {
                font-size: 20px;
                font-weight: bold;
            }
            .betting-btn {
                font-size: 18px;
                width: 100px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background-color: rgba(255,255,255,0.2);
                border-radius: 20px;
                cursor: pointer;
            }
            .balls {
                margin-left: -6px;
                margin-right: -6px;
                margin-top: 12px;
                li {
                    width: 32px;
                    height: 32px;
                    display: inline-block;
                    background-color: rgba(0,0,0,0.14);
                    border-radius: 100%;
                    text-align: center;
                    line-height: 32px;
                    font-size: 14px;
                    font-weight: bold;
                    margin: 0 6px;
                }
            }
        }
        .pagination-dot {
            position: absolute;
            left: 0;
            right: 0;
            border: 0;
            text-align: center;
            bottom: 20px;
            li {
                width: 8px;
                height: 8px;
                border-radius: 100%;
                margin: 0 9px;
                display: inline-block;
                background-color: rgba(255,255,255,.4);
                cursor: pointer;
            }
            li.active {
                background-color: #ffffff;
                transform: scale(1.5);
            }
        }
    }

</style>
