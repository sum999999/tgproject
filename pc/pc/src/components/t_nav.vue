<template>
  <div class="p-wrap t_nav">
    <div class="p-frame">
      <div class="p-inner">
        <div
          class="p-title"
          v-if="hide"
        ><span>{{title}}</span></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    hide: Boolean
  }
};
</script>

<style lang="less" scoped>
.p-wrap {
  height: 528px;
  padding: 45px 0;
  /*     border-bottom:2px solid #be1204; */
  .p-frame {
    width: 1000px;
    height: 438px;
    margin: 0 auto;
    background: #f2f2f2;
    border: 8px solid #f2f2f2;
    border-radius: 6px;
    .p-inner {
      width: 984px;
      height: 422px;
      border-radius: 6px;
      background: #fff;
      border: 2px solid #fff;
      .p-title {
        width: 446px;
        height: 52px;
        line-height: 52px;
        font-size: 18px;
        /*   color: #be1204; */
        margin-left: 18px;
        padding-left: 62px;
        border-bottom: 2px solid #f2f2f2;
      }
    }
  }
}
</style>

