<template>
    <div class="game-banner-wp">
        <div class="banner" :style="`background-image:url(${imgUrl})`"></div>
    </div>
</template>

<script>
export default {
    props:['imgUrl'],
    computed: {
        codeClass() {
            return this.code.toLowerCase();
        }
    },
    created(){
       
    }
}
</script>

<style lang="less" scoped>
.game-banner-wp {
      .banner {
        height: 400px;
        background-size: 1172px 400px;
        background-repeat: no-repeat;
    }
}
</style>