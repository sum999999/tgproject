<template>
    <div class="banner" :style="`background-image:url(${imgUrl})`">
    </div>
</template>
<script>
export default {
    props:{
        imgUrl: {
            type: String,
        },
    }
}
</script>
<style lang="less" scoped>
    .banner{
        width:100%;
        height:534px;
        background-repeat: no-repeat;
        background-position: center top;
		background-size: cover;
    }
</style>