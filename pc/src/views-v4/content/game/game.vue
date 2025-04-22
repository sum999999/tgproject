<template>
    <div class="game4">
        <Banner :imgUrl="imgUrl"></Banner>
        <Games></Games>
    </div>
</template>
<script>
import Banner from "./Banner";
import Games from "./Games";
export default {
    components:{
        Banner,
        Games
    },
    data(){
        return {
           imgUrl:''
        }
    },
    watch: {
        $route: {
            handler(n) {
                this.handlerData()
            },
            deep: true
        }
    },
    created() {
        this.handlerData()
    },
    methods:{
        handlerData() {
            let code = this.$route.params.id;
            if (code.includes('POKER')) {
                this.imgUrl = require('../../images/qipai.png');
            }else if (code.includes('FISH')) {
                this.imgUrl = require('../../images/byyx.png');
            }else if (code.includes('VIDEO')) {
                this.imgUrl = require('../../images/zryl.png');
            }else if (code.includes('SLOT')) {
                this.imgUrl = require('../../images/dzjj.png');
            }else if (code.includes('SPORTS')) {
                this.imgUrl = require('../../images/dianjin.png');
            }else if (code.includes('BALL')) {
                this.imgUrl = require('../../images/sports.png');
            } 
        }
    }
}
</script>