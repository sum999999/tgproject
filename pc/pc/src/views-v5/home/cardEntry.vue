<template>
    <div class="card-entry">
        <div class="feature-grid clearfix">
            <div class="remen fl">
                <p class="title">棋牌游戏</p>
                <fast-betting/>
            </div>
            <ul class="game fl clearfix">
                <li class="qipai" @click="jump('/game/POKER')">
                    <p class="title">棋牌游戏</p>
                    <ul class="type">
                        <li>开元棋牌</li>
                        <li>龙城棋牌</li>
                        <li>FG棋牌</li>
                    </ul>
                </li>
                <li class="buyu" @click="jump('/game/FISH')">
                    <p class="title">捕鱼游戏</p>
                    <ul class="type">
                        <li>FG捕鱼</li>
                        <li>MW捕鱼</li>
                        <li>JDB捕鱼</li>
                    </ul>
                </li>
                <li class="shixun" @click="jump('/game/VIDEO')">
                    <p class="title">真人视讯</p>
                    <ul class="type">
                        <li>BBIN视讯</li>
                        <li>BG视讯</li>
                        <li>LEBO视讯</li>
                    </ul>
                </li>
                <li class="youyi" @click="jump('/game/SLOT')">
                    <p class="title">电子游艺</p>
                    <ul class="type">
                        <li>JDB电子</li>
                        <li>FG电子</li>
                        <li>MW电子</li>
                    </ul>
                </li>
                <li class="jinji" @click="jump('/game/SPORTS')">
                    <p class="title">电子电竞</p>
                    <ul class="type">
                        <li>KG电竞</li>
                        <li>IM电竞</li>
                    </ul>
                </li>
                <li class="tiyu" @click="jump('/game/BALL')">
                    <p class="title">体育赛事</p>
                    <ul class="type">
                        <li>利记体育</li>
                        <li>AG体育</li>
                    </ul>
                </li>
            </ul>
            <ul class="fuli fr">
                <li class="redpacket" @click="appGetNotify"></li>
                <li class="lot-chat" @click="toChatRoom"></li>
                <li class="new-gift" @click="appGetNotify"></li>
                <li class="app-download clearfix">
                    <div class="fl">
                        <img class="qrcode" :src="curQrCode.img" :alt="curQrCode.icon">
                    </div>
                    <div class="fl qrcode-group-btns">
                        <h1>客户端下载</h1>
                        <div class="clearfix">
                            <div class="qrcode-btn" @mouseenter="curQrSelect = 'ios'">
                                <p>IOS</p>
                            </div>
                            <div class="qrcode-btn" @mouseenter="curQrSelect = 'android'">
                                <p>Android</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import goChatRoom from '@/mixins/goChatRoom.js'
    import fastBetting from "./fastBetting"

    export default {
        name: "cardEntry",
        mixins: [goChatRoom],
        components: {
            fastBetting
        },
        data() {
          return {
              curQrSelect: "ios",
          }
        },
        computed: {
            ...mapGetters(["androidQrcode", "iosQrcode"]),
            userInfo() {
                return this.$store.state.user
            },
            curQrCode() {
                if (this.curQrSelect === "android") {
                    return this.androidQrcode;
                } else if (this.curQrSelect === "ios") {
                    return this.iosQrcode;
                }
            }
        },
        watch: {
            androidQrcode(value) {
                console.log(value,"555")
            },
        },
        methods: {
            appGetNotify() {
                this.$Message.info("您好，仅通过手机App自助领取！");
            },
            jump(url) {
                this.$router.push(url)
            },
            toChatRoom() {
                let vm = this;
                if (this.hasClickGoChatRoom) return;
                this.hasClickGoChatRoom = true;
                this.$emit('go-chat-room', this.hasClickGoChatRoom);
                this.$http
                    .post(
                        '/api/v2/chat/queryChatRooms',
                        {current: 1, roomNo: '', size: 1, userId: this.userInfo.userId || ""},
                        {unenc: true}
                    )
                    .then(async res => {
                        this.hasClickGoChatRoom = false;
                        this.$emit('go-chat-room', this.hasClickGoChatRoom)
                        if (res.data.code !== 0) return;
                        if (!res.data.data.chatRooms[0] && !res.data.data.systemChatRooms[0]) {
                            return this.$Modal.error({
                                title: this.$tex("温馨提示"),
                                content: `<p>${this.$tex('未设置聊天室房间')}！</p>`,
                                onOk: function() {}
                            });
                        }
                        let {
                            bankLevel,
                            openLevel,
                            passwordLevel,
                            roomPassword,
                            roomId
                        } = res.data.data.systemChatRooms.length
                            ? res.data.data.systemChatRooms[0]
                            : res.data.data.chatRooms[0];
                        let hasOpenRight = this.hasRight(openLevel);
                        // debugger;
                        if (!hasOpenRight) {
                            //如果等级达标等级
                            this.$Message.error('用户等级不够不能进入聊天室')
                            return
                        }
                        if (roomPassword) {
                            //有密码要求的话
                            if (this.hasRight(passwordLevel)) {
                                let userNeedPwd = true
                                this.$store.commit('SET_CHATROOM_ID', roomId)
                                if (this.userInfo.userId) {
                                    let res = await this.$http.post(
                                        '/api/v2/chat/queryCheckChatRoomPwd',
                                        {roomId: roomId},
                                        {
                                            userId: true,
                                            unenc: true
                                        }
                                    )
                                    const {data, code} = res.data
                                    if (code === 0) {
                                        if (data.result) {
                                            userNeedPwd = true
                                        } else {
                                            userNeedPwd = false
                                        }
                                    }
                                }
                                if (userNeedPwd) {
                                    this.$store.commit('getRoomPwdDialogInfo', {
                                        isShow: true,
                                        roomId: roomId
                                    });
                                    return
                                }
                            }
                        }
                        //等级达标不需要密码
                        localStorage.setItem('isOtherToChatRoom', true)
                        // this.$router.push("/chatRoom");
                        const {href} = this.$router.resolve({
                            name: 'chatRoom',
                            path: '/chatRoom'
                        });
                        window.open(href, '_blank')
                    })
            },
        }
    }
</script>

<style scoped lang="less">
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .card-entry {
        position: relative;
        height:566px;
        background:url('~@/assets/images-v5/home-bg.jpg') no-repeat center center;
        background-size: cover;
    }
    .feature-grid {
        width: 1200px;
        margin: auto;
        position: relative;
        top: -45px;
        padding-left: 304px;
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
        }
        .type {
            font-size: 16px;
            color: #ffffff;
            li {
                list-style-type: disc;
                margin-left: 20px;
                line-height: 30px;
            }
        }
        .remen {
            position: absolute;
            left: 0;
            top: -10px;
            width: 328px;
            background:url('~@/assets/images-v5/remencaipiao.png') no-repeat center center;
            height: 532px;
            padding: 24px 20px;
        }
        .game {
            width: 596px;
            >li {
                float: left;
                width: 50%;
                height: 174px;
                cursor: pointer;
                padding: 15px 13px;
            }
            .qipai {
                background:url('~@/assets/images-v5/qipai-game.png') no-repeat center center;
                background-size: cover;
            }
            .buyu {
                background:url('~@/assets/images-v5/buyu-game.png') no-repeat center center;
                background-size: cover;
            }
            .shixun {
                background:url('~@/assets/images-v5/zhenren-shixun.png') no-repeat center center;
                background-size: cover;
            }
            .youyi {
                background:url('~@/assets/images-v5/e-game.png') no-repeat center center;
                background-size: cover;
            }
            .jinji {
                background:url('~@/assets/images-v5/e-sports.png') no-repeat center center;
                background-size: cover;
            }
            .tiyu {
                background:url('~@/assets/images-v5/tiyubisai.png') no-repeat center center;
                background-size: cover;
            }
        }
        .fuli {
            width: 300px;
            padding-left: 6px;
            li {
                height: 123px;
                cursor: pointer;
            }
            .redpacket {
                background:url('~@/assets/images-v5/redpacket-war.png') no-repeat center center;
                background-size: cover;
            }
            .lot-chat {
                background:url('~@/assets/images-v5/caipiao-chat.png') no-repeat center center;
                background-size: cover;
                margin: 5px 0;
            }
            .new-gift {
                background:url('~@/assets/images-v5/new-gift.png') no-repeat center center;
                background-size: cover;
            }
            .app-download {
                background-color: #e04241;
                height: 143px;
                padding: 16px 0 16px 29px;
                cursor: initial;
                text-align: center;
                color: #ffffff;
                .qrcode {
                    width: 90px;
                    height: 90px;
                    border: 6px solid #ffffff;
                    float: none;
                    border-radius: 4px;
                }
                .qrcode-btn {
                 cursor: pointer;
                    display: inline-block;
                }
                .qrcode-group-btns {
                 padding-left: 29px;
                    h1 {
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>
