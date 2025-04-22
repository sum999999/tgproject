<template>
    <div class="content game-wp">
        <div class="game">
            <div class="suspend-wp">
                <suspend :currGameIntro="currGameIntro"/>
            </div>
            <div class="banner-wp">
                <banner :imgUrl="currGameIntro.contenticon"/>
            </div>
            <div class="announce-wp">
                <announce />
            </div>
            <div class="game-content-wp">
                <game-wp :code="code" />
            </div>
        </div>
    </div>
</template>

<script>
import banner from './child_vue/banner.vue';
import suspend from './child_vue/suspend.vue';
import announce from '@/views-v3/common/module_vue/annouce.vue';
import gameWp from './child_vue/game.vue'
import { queryGameListTypes } from "@/api/game";

export default {
    components:{
        banner,
        suspend,
        announce,
        gameWp
    },
    data() {
        return {
            code: '',
            sysData: '', //系统配置数据
            isShowLoginGameTip: true,
            currGameIntro:{},
        }
    },
    watch: {
        '$route'(n) {
            this.setCurrCode(n);
            this.getGamePageInfo(n.params.id);
        }
    },
    methods: {
        setCurrCode({params}) {
            this.code = params.id;
        },
        /**
         * 获取是否显示登陆游戏前的额度转换?提示
         */
        getIsShowLoginGameTip() {
            this.isShowLoginGameTip = this.sysData["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
        },
        /**
         * 获取子页面信息
         */
        getGamePageInfo(code) {
          queryGameListTypes({ code: code }).then(res =>{
            if(res.data.code!==0) return;
            this.currGameIntro = res.data.data.list.filter(item=> item.code===code)[0];
        });
        },
        getCode(code) {
            // if(code.includes('_')) return code.s
        }
    },
    async created() {
        const {id} = this.$route.params;
        this.code = id;
        // console.log(this.code);
        this.sysData = await this.$store.dispatch("querySystemConfig");
        this.getIsShowLoginGameTip();
        this.getGamePageInfo(this.code);
    }
}
</script>

<style lang="less">
    .game-wp {
        .game {
            position: relative;
            .suspend-wp {
                position: absolute;
                top: 0;
                right: 136px;
            }
            .game-content-wp {
                //   padding-bottom: 72px;
            }
        }
    }
</style>
