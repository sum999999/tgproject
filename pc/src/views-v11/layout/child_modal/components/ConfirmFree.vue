<template>
    <div class="confirm-free-modal">
         <Modal
            v-model="modal1"
            title="提示"
            @on-ok="ok"
            @on-cancel="cancel">
            <p class="confirm-free-modal-p">{{$tex("当前使用的是正式账号，确定要切换到试玩模式吗")}}</p>
        </Modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                modal1: true
            }
        },
        methods: {
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        }
    }
</script>

<style lang='less'>
.confirm-free-modal-p{
        text-align: center;
        font-size: 14px;
    }
</style>
