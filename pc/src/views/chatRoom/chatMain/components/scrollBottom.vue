<template>
  <div
    class="scroll-bottom"
    @click="scrollBottom"
  >
    <span
      class="num"
      v-show="unReadCount"
    >{{unReadCount}}</span>
    <Icon type="ios-arrow-down" />
  </div>
</template>

<script>
export default {
  props: {
    unReadCount: 0
  },
  data() {
    return {};
  },
  methods: {
    scrollBottom() {
      this.$emit("on-scollToBottom");
    }
  }
};
</script>

<style lang="less" scoped>
.scroll-bottom {
  position: fixed;
  right: 466px;
  bottom: 187px;
  z-index: 100;
  cursor: pointer;
  width: 30px;
  .num {
    display: block;
    width: 20px;
    height: 20px;
    margin: 0 auto;
    background-color: #127dec;
    text-align: center;
    color: #fff;
    border-radius: 100%;
    z-index: 10;
    position: relative;
    font-size: 12px;
  }
  .ivu-icon {
    width: 30px;
    height: 30px;
    display: block;
    margin-top: -5px;
    border: 1px solid #ddd;
    border-radius: 100%;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    color: #999;
  }
}
</style>
