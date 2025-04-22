<template>
  <div class='radio-wrapper'>
    <span :class='{"focus-label":checked}'></span>
    <input type="radio" :name="radioName" :checked="checked">
  </div>
</template>

<script>
export default {
  props: {
    checked: { //是否默认显示
      type: Boolean,
      default: false
    },
    clasName: {
      type: String,
      default: ''
    },
    radioName: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
.radio-wrapper {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
    cursor: pointer;
}
.radio-wrapper input[type='radio'] {
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    right: 0;
    width: 13px;
    height: 13px;
    opacity: 0;
    filter: alpha(opacity=0);
    border: 1px solid #dddee1;
    cursor: pointer;
}
.radio-wrapper span {
    display: inline-block;
    box-sizing: content-box;
    padding: 1px;
    width: 11px;
    height: 11px;
    position: relative;
    top: 0;
    left: 0;
    background-color: @radio-span-bg;
    border: 1px solid @radio-span-border-color;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -ms-border-radius: 50%;
    -moz-border-radius: 50%;
    -o-border-radius: 50%;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}
.radio-wrapper span.focus-label,
.radio-wrapper span:hover {
    border: 1px solid @radio-span-hover-border-color;
}
.radio-wrapper span:after {
    display: inline-block;
    position: absolute;
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    content: '';
    border-radius: 6px;
    -webkit-border-radius: 6px;
    -ms-border-radius: 6px;
    -moz-border-radius: 6px;
    -o-border-radius: 6px;
    background: @radio-span-after-bg;
    border: 1px solid #fff;
    border-top: 0;
    border-left: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    transform: scale(0);
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    -moz-transform: scale(0);
    -o-transform: scale(0);
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}
.radio-wrapper span.focus-label:after {
    opacity: 1;
    filter: alpha(opacity=1);
    transform: scale(1);
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
}
</style>


