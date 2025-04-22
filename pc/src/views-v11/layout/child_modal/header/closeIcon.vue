
<template>
    <div class="close-icon-wp">
        <i @click="closeAds"></i>
    </div>
</template>
<script>
export default {
    methods:{
        closeAds() {
            this.$emit('close-ads');
        }
    }
}
</script>

<style lang="less" scoped>
.close-icon-wp {
    width: 100%;
    position: relative;
    i {
        display: block;
        position: absolute;
        right: -15px;
        top: -71px;
        width: 21px;
        height: 21px;
        background: url("/static/images/icon.png") no-repeat -20px -42px;
        z-index: 1;
        cursor: pointer;
        &:hover {
            background-color: hsla(0, 0%, 100%, 0.2);
        }
    }
}
</style>