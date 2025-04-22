<template>
    <div class="home-main-wp">
        <div class="main">
            <lottery-act :lotteryInfo="lotteryIntro" v-if="lotteryIntro" @get-more="getMore"></lottery-act>
            <other-game  v-if="gameList.length" :games="gameList" :gameLength="data.length" @get-more="getMore"></other-game>
        </div>
    </div>
</template>

<script>
import lotteryAct from './main/lotteryAct';
import otherGame from './main/otherGame';
import { queryGameListTypes } from "@/api/game";

export default {
    components: {
        lotteryAct,
        otherGame
    },
    data() {
        return {
            lotteryIntro: '',
            gameList: []
        }
    },
    methods:{
        /**
         * 了解更多
         */
        getMore(code) {
            if(code.toLowerCase() === 'lottery') {
                this.$router.push({name:'lottery'});
                return
            }
            this.$router.push({name:'game',params:{id:code}});
        },
        getGameInfo() {
          queryGameListTypes({code:null}).then(res =>{
                if(res.data.code!==0) return;
                let data = res.data.data;
                this.data = data;
                if(data.list.length ===3) {
                    this.gameList = data.list;
                    return;
                }
                if(data.list.length === 6) {
                    this.gameList = data.list;
                    return;
                }
                for (let i = 0; i < data.list.length;i++) {
                  const item = data.list[i] || {};
                  const code = item.code;
                  if ("LOTTERY" === code) {
                    this.lotteryIntro = data.list.splice(i, 1)[0];
                    break;
                  }
                }
                this.gameList = data.list;
            });
        }
    },
    created() {
        this.getGameInfo();
    }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
    .home-main-wp {
        // margin-bottom: 20px;
        .main {
            @{deep}.flex {
                display: flex;
                justify-content: space-between;
            }
             @{deep}h3 {
                font-size: 30px;
                margin-bottom: 11px;
                font-weight: normal;
                font-family: 'PingFang SC Medium';
            }
             @{deep} .ivu-btn {
                width: 136px;
                height: 36px;
                border: none;
                background: @button-change-color-three;
                color: #1f1f1f;
                transition: all .3s;
                font-family: 'PingFang SC Medium';
                &:hover{
                    background: @button-hover-change-color;
                }
            }
             @{deep}.bor-rad{
                border-radius: 10px;
            }
             @{deep}.intro {
                position: absolute;
                text-align: center;
                color: #fff;
                width: 270px;
                height: 200px;
                .pie {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                dt {
                    span {
                        margin: 0 6px;
                        transition: all .3s;
                        &:hover {
                            cursor: pointer;
                            color: @textLightColor;
                        }
                    }
                }
            }
        }
    }
</style>
