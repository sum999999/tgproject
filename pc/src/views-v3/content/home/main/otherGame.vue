<template>
    <div class="home-other-game-wp">
        <!-- games长度为1时 -->
        <template v-if="games.length===1">
            <div class="other-game flex one-game">
                <div class="one-wp bor-rad" @click="downApp">
                    <div class="intro">
                        <h3>APP下载</h3>
                        <div>DOWNLOAD</div>
                    </div>
                </div>
                <div class="two-wp bor-rad" :style="`backgroundImage:url(${games[0].pc3icon})`">
                    <dl class="intro">
                        <dt>
                            <h3>{{games[0].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                        <Button type="primary" @click="getMore(games[0].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                </div>
            </div>
        </template>
        <!-- games长度为4时 -->
        <template v-else-if="games.length===4">
            <div class="other-game flex">
                <div class="one-wp bor-rad" :style="`backgroundImage:url(${games[0].pc4icon})`">
                    <dl class="intro">
                        <dt>
                            <h3>{{games[0].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                        <Button type="primary" @click="getMore(games[0].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                </div>
                <div class="two-wp bor-rad flex">
                    <div class="two bor-rad"  :style="`backgroundImage:url(${games[1].pc3icon})`">
                        <dl class="intro">
                            <dt>
                                <h3>{{games[1].typeName}}</h3>
                                <div class="wp">
                                    <div class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div  class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                </div>
                            </dt>
                            <dd>
                                <Button type="primary" @click="getMore(games[1].code)">{{$tex("了解更多")}}</Button>
                            </dd>
                        </dl>
                    </div>
                    <div class="three bor-rad" :style="`backgroundImage:url(${games[2].pc3icon})`">
                        <dl class="intro" >
                        <dt>
                            <h3>{{games[2].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                            <Button type="primary" @click="getMore(games[2].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                    </div>
                </div>
            </div>
            <div class="other-game flex four-game">
                <div class="one-wp bor-rad" @click="downApp">
                    <div class="intro">
                        <h3 >APP下载</h3>
                        <div>DOWNLOAD</div>
                    </div>
                </div>
                <div class="two-wp bor-rad" :style="`backgroundImage:url(${games[3].pc3icon})`">
                    <dl class="intro">
                        <dt>
                            <h3>{{games[0].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                        <Button type="primary" @click="getMore(games[0].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                </div>
            </div>
        </template>
        <!-- games长度为3和6时 -->
        <template v-else-if="games.length===3 || games.length===6">
            <div class="other-game flex">
                <div class="one-wp bor-rad" :style="`backgroundImage:url(${games[0].pc4icon})`">
                    <dl class="intro">
                        <dt>
                            <h3>{{games[0].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[0].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                        <Button type="primary" @click="getMore(games[0].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                </div>
                <div class="two-wp bor-rad flex">
                    <div class="two bor-rad"  :style="`backgroundImage:url(${games[1].pc3icon})`">
                        <dl class="intro">
                            <dt>
                                <h3>{{games[1].typeName}}</h3>
                                <div class="wp">
                                    <div class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div  class="pie">
                                            <span @click="goGameLobby(item)" v-for="item of games[1].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                </div>
                            </dt>
                            <dd>
                                <Button type="primary" @click="getMore(games[1].code)">{{$tex("了解更多")}}</Button>
                            </dd>
                        </dl>
                    </div>
                    <div class="three bor-rad" :style="`backgroundImage:url(${games[2].pc3icon})`">
                        <dl class="intro" >
                        <dt>
                            <h3>{{games[2].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[2].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                            <Button type="primary" @click="getMore(games[2].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                    </div>
                </div>
            </div>
        </template>
        <!-- games长度为6时 -->
        <template v-if="games.length===6">
            <div class="other-game flex">
                <div class="one-wp bor-rad" :style="`backgroundImage:url(${games[5].pc4icon})`">
                    <dl class="intro">
                        <dt>
                            <h3>{{games[5].typeName}}</h3>
                            <div class="wp">
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[5].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[5].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                                <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[5].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                </div>
                            </div>
                        </dt>
                        <dd>
                        <Button type="primary" @click="getMore(games[5].code)">{{$tex("了解更多")}}</Button>
                        </dd>
                    </dl>
                </div>
                <div class="two-wp bor-rad flex">
                    <div class="two bor-rad"  :style="`backgroundImage:url(${games[3].pc3icon})`">
                        <dl class="intro">
                            <dt>
                                <h3>{{games[3].typeName}}</h3>
                                <div class="wp">
                                    <div class="pie">
                                        <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                        <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                        <span @click="goGameLobby(item)" v-for="item of games[3].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                </div>
                            </dt>
                            <dd>
                                <Button type="primary" @click="getMore(games[3].code)">{{$tex("了解更多")}}</Button>
                            </dd>
                        </dl>
                    </div>
                    <div class="three bor-rad" :style="`backgroundImage:url(${games[4].pc3icon})`">
                        <dl class="intro  second">
                            <dt>
                                <h3>{{games[4].typeName}}</h3>
                                <div class="wp">
                                    <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[4].platformsRsps.slice(0,3)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                        <span @click="goGameLobby(item)" v-for="item of games[4].platformsRsps.slice(3,6)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                    <div class="pie">
                                    <span @click="goGameLobby(item)" v-for="item of games[4].platformsRsps.slice(6,9)" :key="item.platformId" :class="[item.dispType==='1'&&item.platformStatus!=='1'?'disabled':'']">{{item.typeName}}</span>
                                    </div>
                                </div>
                            </dt>
                            <dd>
                                <Button type="primary" @click="getMore(games[4].code)">{{$tex("了解更多")}}</Button>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props:['games','gamelength'],
    data() {
        return {
            setIndex:1
        }
    },
    methods: {
        /**
         * 了解更多
         */
        getMore(code) {
            this.$emit('get-more',code);
        },
        /**
         * 去下载app
         */
        downApp() {
            this.$router.push('/phoneBuy');
        },
        goGameLobby(info) {
            if (info.dispType === "1" && info.platformStatus !== "1") {
                return;
            }
            this.$router.push({ name: "game", params: { id: info.code } });
        }
    },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-other-game-wp {
    margin-top: 16px;
    @{deep}.other-game {
        &:nth-child(2){
            margin-top: 16px;
            flex-direction: row-reverse;
        }
        &.one-game {
            background:url('~@/assets/images-v3/index/yhhd.png') no-repeat;
            background-size: 384px 300px;
            &:hover {
                cursor: pointer;
            }
            .one-wp {
                width: 384px;
                height: 300px;
            }
            .two-wp{
                position: relative;
            }
        }
        &.four-game {
            flex-direction: row;
            .one-wp {
                height: 300px;
                background:url('~@/assets/images-v3/index/app-download.png') no-repeat;
                &:hover {
                    cursor: pointer;
                }
            }
            .two-wp {
                position:relative;
                height: 300px;
            }
        }
        .bor-rad {
            background-repeat: no-repeat;
        }
        .disabled {
            cursor: not-allowed;
            color: gray!important;
        }
        dt {
            margin-bottom: 27px;
        }
        .intro {
            // top: 50%;
        }
        .wp {
            height: 78px;
            line-height: 26px;
        }
        .pie {
            display: inline-block;
            width: 100%;
        }
        .one-wp {
            position: relative;
            width: 383px;
            height: 616px;
            text-align: center;
            background-size: 383px 616px;
            .intro {
                display: inline-block;
                position: initial;
                margin-top: 49px;
            }
            h3 {
                margin-bottom: 14px;
            }

        }
        .two-wp {
            width: 772px;
            flex-direction: column;
            .intro {
                top: 50%;
                right: 58px;
                transform: translateY(-50%);
            }
            >.three {
                position:relative;
                height: 300px;
                background-size: 772px 300px;
                h3 {
                    margin-bottom: 16px;
                }
            }
            >.two {
                position: relative;
                height: 300px;
                background-size: 772px 300px;
                h3 {
                    margin-bottom: 14px;
                }
            }
        }
    }
}
</style>
