<template>
    <div class="header-user-info clearfix">
        <div class="user-info">
            <div class="user-code">
                <img :src="avatarUrl" @click="$router.push('/personalCenter/account')">
                <span>{{userInfo.userCode}}</span>
            </div>
            <div>
                <span class="money-label">余额：{{$tex("￥")}}</span>
                <span class="money">{{userInfo.balance | keepDecimalOf2}}</span>
                <i class="iconfont icon-refresh" :class="{'turn-round':turnRound}" @click='refreshBalance'></i>
            </div>
        </div>
        <span class="btn recharge" @click="$router.push('/personalCenter/recharge')">充值</span>
        <span class="btn deposit" @click="$router.push('/personalCenter/withdraw')">提现</span>
        <button class="btn quit" v-preventReClick="2000" @click="signOut">退出登陆</button>
    </div>
</template>

<script>
    const USER_AVATAR = '/static/images/account.png';

    export default {
        name: "headerLoginInfo",
        data() {
          return {
              turnRound: false,
          };
        },
        computed: {
            userInfo() {
                return this.$store.state.user;
            },
            userLoad() {
                return Number(this.userInfo.balance).toFixed(2)
            },
            avatarUrl() {
                return this.userInfo.imgUrl || USER_AVATAR;
            },
        },
        methods: {
            refreshBalance() {
                this.turnRound = true;
                this.$http
                    .post(
                        '/api/v2/user/balanceAdnSign',
                        {},
                        { userId: true, unenc: true }
                    )
                    .then(response => {
                        if (response.data.code !== 0) return;
                        let {balance,levelId} = response.data.data;
                        let user = Object.assign({},this.userInfo,{
                            balance: balance,
                            levelId: levelId
                        });
                        this.$store.commit('getUser', user);
                        this.turnRound = false;
                    })
            },
            signOut() {
                let vm = this;
                this.$http
                    .post('/api/v2/user/loginOut', '', { userId: true })
                    .then(response => {
                        if (response.data.code !== 0) return;
                        vm.$store.commit('getUser', '');
                        localStorage.setItem('user', '');
                        this.$router.push('/')
                    })
            },
        }
    }
</script>

<style scoped lang="less">
    .turn-round {
        animation: rotating 5s infinite linear;
    }
    @keyframes rotating {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .header-user-info {
        position: absolute;
        display: inline-block;
        right: 0;
        top: 0;
        bottom: 0;
        color: #ffffff;
        .user-info {
            display: inline-block;
            line-height: normal;
            width: 138px;
            font-size: 13px;
            height: 46px;
            float: left;
            padding-top: 4px;
            .user-code {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .money-label {
                vertical-align: middle;
            }
            .money {
                max-width: 58px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
                vertical-align: middle;
            }
            .icon-refresh {
                font-size: 13px;
                cursor: pointer;
                display: inline-block;
                vertical-align: bottom;
            }
            img {
                width: 18px;
                height: 18px;
                border-radius: 100%;
                float: none;
                vertical-align: middle;
                cursor: pointer;
            }
        }
        .btn {
            padding: 4px 22px;
            color: #ffffff;
            font-size: 18px;
            border-radius: 20px;
            margin-left: 15px;
            margin-right: 15px;
            cursor: pointer;
            border: none;
        }
        .recharge {
            background-color: #ffaa46;
        }
        .deposit {
            background-color: #46aaff;
        }
        .quit {
            background-color: rgba(0,0,0, 0.2);
            padding: 8px 16px;
        }
        .quit[disabled] {
            cursor: not-allowed;
        }
    }
</style>
