<template>
    <div class="layout">
        <chat-feature
                room-type="1"
                :join-room-success="true"
                :can-speak="false"
                :has-auth="false"
                :red-packet="false"
                :at-user-style="{}"
                :at-user-list="[]"
                :show-emoji-box="false"
                :show-emoji-panel="false"
                :show-emoji-panel-tab="false"
                :gif-panel-index="-1"/>
    </div>
</template>

<script>
    import chatFeature from "@/views/chatRoom/chatMain/chatFeature";

    export default {
        name: "test",
        components: {chatFeature},
        computed: {},
        watch: {},
        mounted() {
            this.$store.dispatch("connectRongYun")
        }
    }
</script>

<style scoped lang="less">
    .layout {
        position: absolute;
        bottom: 20px;
        right: 20px;
    }
</style>
