<template>
    <div class="longheader">
        <div class="longheader-left">
            <Icon v-if="close" class="longheader-left__icon" type="close-round" @click.native="onCloseClick"></Icon>
            <i v-if="back" class="longheader-left__icon longheader-left__back" @click="onBackClick"></i>
            <span class="longheader-left__title">
                <slot name="title"></slot>
            </span>
        </div>
        <div class="longheader-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "LongHeader",
    props: {
      back: {
        type: Boolean,
        default: true
      },
      close: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onCloseClick() {
        this.$emit('close');
      },
      onBackClick() {
        this.$emit('back');
      },
    }
  }
</script>

<style scoped lang="less">
    .longheader {
        height: 110px;
        background: #FF464B;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        color: #ffffff;
        padding: 0 20px 10px;
    }
    .longheader-left__icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        vertical-align: middle;
        cursor: pointer;
    }
    .longheader-left__back {
        background-image: url(~@/assets/images/longqueue/fanhuijian.png);
    }
    .longheader-left__title {
        vertical-align: middle;
    }
    .longheader-right {
        line-height: 1;
    }
</style>
