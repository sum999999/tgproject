<template>
      <modal
            :modalShow='isShowDialog'
            width="360"
            :title="$tex('温馨提示')"
            @btn-ok="handConfirm"
            :maskClosable="true"
            @btn-cancel="handForClear"
            >
            <div slot="content">
                <p class="confirm-free-modal-p">{{$tex("当前使用的是正式账号，确定要切换到试玩模式吗")}}</p>
            </div>
        </modal>
</template>
<script>
import modal from '@/components/modal';
export default {
    props: {
        isShowDialog: {
            type: Boolean,
            default: false
        }
    },
    components: {modal},
    methods: {
        handConfirm() {
            this.$emit('hand-confirm');
        },
        handForClear() {
            this.$emit('hand-clear');
        }
    }
}
</script>

<style lang="less" scoped>
.confirm-free-modal-p {
  text-align: center;
  font-size: 14px;
}
</style>
