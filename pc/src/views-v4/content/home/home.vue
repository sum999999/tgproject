<template>
    <div class="home content">
        <banner></banner>
        <slider></slider>
        <carousel :dataList="gameInfo"></carousel>
        <activity></activity>
        <download></download>
        <service></service>
    </div>
</template>
<script>
import banner from "./BannerLee.vue";
import slider from "./Slider.vue";
import carousel from "./Carousel.vue";
import activity from "./Activity.vue";
import download from "./Download.vue";
import service from "./Service.vue";
import { mapGetters } from "vuex";
import { queryGameListTypes } from "@/api/game";

export default {
    components:{
        banner,
        slider,
        carousel,
        activity,
        download,
        service
    },
    data(){
        return{
            gameInfo: [],
            isShowFoot: true
        }
    },
    async created() {
        this.gameList = {};
        let code = this.$route.params.id;
        this.getGameInfo();
   },
   watch: {
    $route(n) {
        this.routeStatus(n.name);
    },
    pageTemplate: {
        handler() {
            this.routeStatus(this.$route.name);
        },
        immediate: true
    }
  },
  computed: {
    ...mapGetters(["pageTemplate"])
  },
  methods:{
       routeStatus(name) {
            if (
                name === "buyLottery" ||
                name === "redPacket" ||
                name === "chatRoom" ||
                name === "feedbackActive") {
                this.isShowFoot = false;
            } else if (name === "lottery") {
                this.isShowFoot = false;
            } else {
                this.isShowFoot = true;
            }
        },
        getGameInfo(code=null) {
          queryGameListTypes({ code: code }).then(res => {
                    const { code, data } = res.data;
                if (code !== 0) return;
                    const { list } = data;
                if (list.length > 0) {
                    this.gameInfo = list;
                }
            });
        },
    }
}
</script>
<style lang="less" scoped>

</style>
