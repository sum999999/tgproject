<template>
  <div>
    <div class="confirm1">
      <span>提示</span>
      <br />
      <br />
      <p>
        <span>您还没有设置过资金密码，请先设置!</span>
      </p>
    </div>
    <div class="clr"></div>
    <Button type="primary"
            style="height:36px;line-height:16px;margin-top:30px;margin-left:20px;"
            @click="onSetPwClick">设置资金密码</Button>
    <ModifyFundPwd v-model="isShowPwModal"
                   @on-end="handlePwSure"></ModifyFundPwd>
  </div>
</template>

<script>
import ModifyFundPwd from "@/components/modifyFundPwd";
export default {
  name: 'SetPwAmount',
  components: { ModifyFundPwd },
  data () {
    return { isShowPwModal: false }
  },
  methods: {
    onSetPwClick () {
      this.isShowPwModal = true
    },
    handlePwSure () {
      this.$emit('tab-replace-curview')
    },
  }
}
</script>

<style lang="less" scoped>
.confirm1 {
  float: left;
  margin-left: 20px;
}
.confirm1 span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}
.confirm1 p > span {
  font-size: 16px;
  font-weight: normal;
}
</style>
