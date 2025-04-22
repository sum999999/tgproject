<template>
    <div>
        {{main}}
    </div>
</template>

<script>
export default {
    data () {
        return {
            timer: null
        }
    },
    computed: {
        main () {
            return this.$store.state.anotherObj
        }
    },
    mounted () {
        // this.timer = setInterval(() => {
        //     let data = JSON.parse(localStorage.getItem('another'))
        //     if (!!data) {
        //         localStorage.removeItem('another')
        //         clearInterval(this.timer)
        //         document.write(data.data.content)
        //     }
        // }, 100)
    },
    beforeDestroy () {
        // clearInterval(this.timer)
        // localStorage.removeItem('another')
    }


}
</script>

<style>
</style>
