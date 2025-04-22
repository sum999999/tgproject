<template>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "SysTextModal",
        computed: {
            ...mapGetters(["sysModalText"])
        },
        watch: {
            sysModalText: {
                deep: true,
                immediate: true,
                handler(newValue) {
                    if (newValue) {
                        this.open();
                    }
                }
            }
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$Modal.info({
                            title: this.$tex("系统提示"),
                            content: this.sysModalText,
                            onOk: () => {
                                this.$store.commit("setSysModalText", null);
                            }
                        });
                    }, 200)
                });
            }
        }
    }
</script>

<style scoped>

</style>
