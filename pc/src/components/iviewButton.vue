<template>
    <div class="btn-wp">
        <Button
            v-preventReClick="2000"
            :type="btnType"
            :size="size"
            @click="onClick()"
        >{{btnText}}</Button>
    </div>
</template>

<script>
export default {
    props: {
        btnType: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'large',
        },
        btnText: {
            type: String,
            default: ''
        },
        onClick: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
          
        }
    }
}
</script>

<style lang="less" scoped>

</style>