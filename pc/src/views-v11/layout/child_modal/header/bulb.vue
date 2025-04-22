
<template>
   <div class='bulb' @click="openAds">
        <img src="/static/images/light.gif">
    </div>
</template>
    
<script>
export default {
    methods: {
        /**
         * 打开广告
         */
        openAds() {
            this.$emit('open-ads');
        }
    }
}
</script>

<style lang="less" scoped>
    .bulb{
        height: 100%;
        position: relative;
         cursor: pointer;
        img {
          display: block;
          width: 37px;
          height: 62px;
        }
    }
</style>