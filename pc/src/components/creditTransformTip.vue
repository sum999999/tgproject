<template>
     <modal
            :modalShow="isShowDialog"
            :title="$tex('棋牌游戏')"
            claName="login-game-dlg-wrap"
            width="380"
            @btn-cancel="closeDialog"
            @btn-ok="goGameLogin"
            >
            <div
                slot="content"
                class="gameTipDlg"
            >
            <p>{{$tex("首次进入游戏，系统将自动为您进行钱包额度转换，详情请前往钱包查看。")}}</p>
            </div>
        </modal>
</template>

<script>
import modal from '@/components/modal.vue';
export default {
    props: {
        isShowDialog: {
            type: Boolean,
            default: false
        }
    },
    components: {
        modal
    },
    methods: {
        closeDialog() {
            this.$emit('close-transform-tip');
        },
        goGameLogin() {
            this.$emit('go-game-login');
        }
    }
}
</script>

<style lang="less" scoped>

</style>
