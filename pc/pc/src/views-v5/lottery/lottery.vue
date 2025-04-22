<template>
    <!-- :style="{minHeight: (lotteryTypeList.length + 2 + childList) * 50 + 'px'}" -->
    <div>
        <div class="banner">
            <win-list/>
        </div>
        <div
                class="lottery-list"
        >
            <div class="lottery-tab-title">
                <span class="title">购彩大厅</span>
                <span class="en-title">LOTTERY GAME</span>
                <div class="rt">
<!--                    <Button-->
<!--                            type="primary"-->
<!--                            @click="$router.push({name:'role',params:{id:'3'}})"-->
<!--                    >-->
<!--                        <i class="iconfont icon-YXWF"></i>-->
<!--                        <span class="record">游戏玩法</span>-->
<!--                    </Button>-->
                    <Button
                            type="primary"
                            @click="$router.push({name:'notice'})"
                    >
                        <i class="iconfont icon-jiangbei"></i>
                        <span class="record">开奖公告</span>
                    </Button>
                    <Button
                            type="primary"
                            @click="$router.push({name:'trend'})"
                    >
                        <i class="iconfont icon-chart"></i>
                        <span class="record">走势图表</span>
                    </Button>
                    <Button
                            type="primary"
                            @click="goRecord"
                    >
                        <i class="iconfont icon-record"></i>
                        <span class="record">投注记录</span>
                    </Button>
                </div>
            </div>
            <ul class="lottery-tab">
                <li class="lottery-tab-item" v-for="(item, idx) in lotteryTypeList" :key="idx" :class="{active: curCode === item.code}" @click="onTabClick(idx)">
                    <div class="title">{{item.lotteryTypeName}}</div>
                </li>
            </ul>
            <div class="child-content">
                <ul class="lottery-lobby">
                    <li
                            v-for="(item, idx) in curList"
                            :key="idx"
                            :id="item.lotteryId"
                    >
                        <item-page
                                :data="item"
                                :routeName="$route.name"
                        ></item-page>
                    </li>
                    <li class="lobby-item-placeholder"></li>
                    <li class="lobby-item-placeholder"></li>
                    <li class="lobby-item-placeholder"></li>
                    <li class="lobby-item-placeholder"></li>
                    <li class="lobby-item-placeholder"></li>
                </ul>
            </div>
            <div class="clr"></div>
            <Spin
                    size="large"
                    v-if='showSpin'
                    fix
            ></Spin>
        </div>
    </div>
</template>

<script>
    import itemPage from "./item.vue";
    import announce from "../components/annouce";
    import winList from "./winList";
    import { queryLotteryList } from "@/api/lottery";

    export default {
        components: {
            itemPage,
            announce,
            winList
        },
        data() {
            return {
                lotteryTypeList: [],
                curList: [],
                showSpin: true,
                curCode: "all"
            };
        },
        methods: {
            onTabClick(idx) {
                if (this.showSpin) {
                    return;
                }
                const lotteryTypeItem = this.lotteryTypeList[idx];
                this.curCode = lotteryTypeItem.code || "all";
                this.queryLotteryList();
            },
            goBetting(value) {
                //投注
                // let user = localStorage.getItem('user');
                // if(!user) {
                //     sessionStorage.setItem('path',`buyLottery&${value.lotteryId}`);
                // }
                this.$router.push({
                    name: "buyLottery",
                    params: {id: `${value.lotteryId}`}
                });
            },
            goRecord() {
                //投注记录
                let user = localStorage.getItem("user");
                if (!user) {
                    sessionStorage.setItem("path", "personalCenter&record");
                    this.$router.push("/login");
                    return;
                }
                this.$router.push("/personalCenter/record");
            },
            queryLotteryList() {
                var vm = this;
                this.showSpin = true;
              queryLotteryList().then(response => {
                        if (response.data.code !== 0) return;
                        vm.lotteryTypeList = response.data.data.lotteryTypeList;
                        vm.lotteryTypeList.forEach(item => {
                            if (vm.curCode === item.code) {
                                vm.curList = [
                                    ...item.lotteryList
                                ];
                                vm.showSpin = false;
                            }
                        });
                    });
            }
        },
        created() {
            this.queryLotteryList();
        }
    };
</script>
<style scoped>
    .ivu-spin-fix >>> .ivu-spin-main {
        top: 42%;
    }
</style>

<style lang="less" scoped>
    @deep: ~'>>>';
    .lottery-tab {
        background-color: #ffffff;
        border-radius: 10px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 1px solid #f5f5f5;
        padding-left: 34.5px;
        .lottery-tab-item {
            padding: 0 17.5px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
            color: #dbdbdb;
            position: relative;
            .title {
                font-size: 16px;
                font-family: 'PingFang SC Medium';
                padding: 15px 0;
            }
            &.active .title {
                color: #ff464b;
                border-bottom: 4px solid #ff464b;
            }
        }
    }
    .lottery-tab-title {
        padding: 32px 0 16px 52px;
        .title {
            font-size: 32px;
            color: #3d3d3d;
            margin-right: 14px;
            font-weight: bold;
        }
        .en-title {
            font-size: 20px;
            color: #ff464b;
            font-weight: bold;
        }
        .rt {
            float: right;
            padding-top: 13px;
            padding-right: 50px;
        }
        .ivu-btn-primary {
            background-color: #ffffff;
            border: none;
            color: #838384;
        }
        .ivu-btn-primary:focus {
            box-shadow: none;
        }
    }
    .banner {
        height: 460px;
        background-image: url(~@/assets/images-v5/banner/goucai.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center bottom;
        position: relative;
    }



    .lottery-list {
        position: relative;
        width: 1200px;
        margin: auto;
        margin-top: -45px;
        background-color: #ffffff;
        box-shadow: 0 -2px 10px 2px rgba(0, 0, 0, 0.16);
        border-radius: 8px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        min-height: 600px;
    }

    .lottery-list .ivu-spin-large {
        position: absolute;
        left: 50%;
        top: 50%;
        /*margin-top: 188px;*/
        z-index: 9999999;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform-origin: 50% 50%;
    }

    .lottery-list .list {
    }

    .lottery-list .list h5 {
        height: 50px;
        line-height: 50px;
        color: @textLightColor;
        font-size: 16px;
        /*   background: @primary-color; */
        position: relative;
        padding-left: 35px;
        box-shadow: 1px 0 8px rgba(0, 0, 0, 0.36);
        background: @btnTxtColor;
        border: 1px solid #333;
    }

    .lottery-list .list h5 i {
        position: absolute;
        top: 14px;
        left: 5px;
    }

    .lottery-list .list ul {
        border: 1px solid #333;
        border-top: none;
        border-left: 0;
        border-bottom: 0;
        box-shadow: 0px -8px 8px rgba(0, 0, 0, 0.2);
    }

    .lottery-list .list li {
    }


    .lottery-list .streamer {
        margin-left: 210px;
        height: 38px;
        line-height: 38px;
        font-size: 16px;

        @{deep} {
            .commom-announce-wp {
                padding: 0;
            }
        }
    }

    .lottery-list .streamer .lf {
        float: left;
    }

    .lottery-list .streamer .lf span {
        color: #000;
    }

    .lottery-list .streamer .rt {
        float: right;
        // padding-right: 20px;
        margin-top: -1px;
        font-size: 0;
    }

    .lottery-list .streamer .rt .ivu-btn > span {
        width: 100%;
        height: 100%;
        line-height: 30px;
    }

    .lottery-list .streamer .rt .ivu-btn {
        width: 100px;
        padding: 0;
        margin-right: 20px;
        background: transparent;
        border-radius: 6px;
        border-color: @textLightColor;
        color: @textLightColor;
    }

    .lottery-list .streamer .rt .record {
        display: inline-block;
        vertical-align: middle;
    }

    .lottery-list .streamer .rt .i-icon {
        display: inline-block;
        vertical-align: top;
        /* margin-top: 2px; */
    }

    .lottery-list .streamer .rt .btn-trend {
        background: url("~@/assets/images/lottery-trend.png") no-repeat;
    }

    .lottery-list .streamer .icon-jiangbei {
        font-size: 20px;
    }

    .lottery-list .streamer i {
        vertical-align: middle;
        font-size: 16px;
        /*   margin-top: 9px; */
    }

    .lottery-list .streamer .icon-YXWF {
        margin-right: 5px;
    }

    .lottery-list .child-content {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        flex: 1 1 0%;
    }

    .lottery-list .lottery-lobby {
        height: 100%;
        padding-bottom: 30px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: space-around;
    }

    .lottery-list .lottery-lobby .lobby-item-placeholder {
        width: 200px;
        height: 1px;
        display: flex;
        flex-shrink: 0;
        margin: 15px 5px 0px 5px;
    }
</style>
