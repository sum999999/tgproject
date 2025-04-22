<template>
    <div class="game-amount-convert-dialog">
        <modal
                :modalShow="showConvertAmountTips"
                :title="$tex('棋牌游戏')"
                width="380"
                @btn-cancel="onCancel"
                @btn-ok="$emit('login-game')"
        >
            <div
                    slot="content"
                    class="gameTipDlg"
            >
                <p>{{$tex("首次进入游戏，系统将自动为您进行钱包额度转换，详情请前往钱包查看。")}}</p>
            </div>
        </modal>
    </div>
</template>

<script>
  import modal from "@/components/modal.vue";

  export default {
    name: "GameAmountConvertDialog",
    components: {
      modal
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showConvertAmountTips: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        }
      }
    },
    methods: {
      onCancel() {
        this.showConvertAmountTips = false;
        this.$emit("cancel");
      }
    }
  }
</script>

<style scoped>

</style>
