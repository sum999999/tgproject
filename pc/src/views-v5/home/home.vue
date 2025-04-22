<template>
    <div class="home content" v-loading="hasClickGoChatRoom">
        <banner></banner>
        <card-entry @go-chat-room="goChatRoom"/>
    </div>
</template>
<script>
    import banner from "./BannerLee.vue";
    import cardEntry from "./cardEntry.vue";

    import {mapGetters} from "vuex";
    import { queryGameListTypes } from "@/api/game";

    export default {
        components: {
            banner,
            cardEntry
        },
        data() {
            return {
                gameInfo: [],
                isShowFoot: true,
                hasClickGoChatRoom: false
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
        methods: {
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
            getGameInfo(code = null) {
              queryGameListTypes({ code: code }).then(res => {
                        const {code, data} = res.data;
                        if (code !== 0) return;
                        const {list} = data;
                        if (list.length > 0) {
                            this.gameInfo = list;
                        }
                    });
            },
            goChatRoom(hasClickGoChatRoom) {
                this.hasClickGoChatRoom = hasClickGoChatRoom;
            },
        }
    }
</script>
<style lang="less" scoped>

</style>
