<template>
  <div v-drag class="mobile-box">
    <div class="mobile-box__header">
      <Icon type="arrow-move"></Icon>
    </div>
    <div class="mobile-box__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobileBox",
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.mobile-box {
  display: flex;
  flex-direction: column;
  width: 375px;
  height: 620px;
  position: fixed;
  top: 100px;
  right: 550px;
  z-index: 999;
  box-shadow: 0 5px 10px rgba(6, 6, 6, 0.3);
  @{deep} {
    ::-webkit-scrollbar {
      width: 6px !important;
      background-color: #f5f5f5 !important;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #666 !important;
    }
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3) !important;
      background-color: #f5f5f5 !important;
    }
    ::-webkit-scrollbar-track-piece {
      background: rgba(0, 0, 0, 0.02) !important;
    }
  }
  &__header {
    cursor: move;
    user-select: none;
    border-radius: 3px 3px 0 0;
    height: 20px;
    color: #333;
    background: linear-gradient(0deg, #bbb, #eee);
    width: 100%;
    line-height: 10px;
    display: block;
    padding: 5px 10px;
    text-align: right;
  }
  &__body {
    flex: 1;
    background: #fff;
    height: 100%;
    overflow: hidden;
  }
}
</style>
