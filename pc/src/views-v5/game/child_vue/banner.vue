<template>
    <div class="game-banner-wp">
        <div class="banner" :style="`background-image:url(${imgUrl})`"></div>
    </div>
</template>

<script>
    export default {
        props: ['imgUrl'],
        computed: {
            codeClass() {
                return this.code.toLowerCase();
            }
        },
        created() {

        }
    }
</script>

<style lang="less" scoped>
    .game-banner-wp {
        .banner {
            height: 460px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center bottom;
        }
    }
</style>
