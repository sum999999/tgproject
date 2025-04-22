<template>
  <div class="w title-contanier">
    <p class="title">
      <span class="red">{{redTitle}}</span><span class="white">{{whiteTitle}}</span>
    </p>
    <p class="subTitle">{{subTitle}}</p>
    <p
      class="text"
      :style="{width:textWidth}"
    >{{text}}</p>

    <slot name="cont"></slot>
    <div class="right-logo">
      <img
        :src="img"
        alt=""
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    redTitle: "",
    whiteTitle: "",
    subTitle: "",
    text: "",
    img: "",
    textWidth: {
      type: String,
      defalut() {
        return "514px";
      }
    }
  }
};
</script>
<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";
.title-contanier {
  color: #fff;
  padding-top: 100px;
  padding-left: 76px;
  position: relative;
  background: url("@{imgSrc}/title-bg.png") no-repeat;
  background-position: 0 60px;
  padding-bottom: 148px;
  p {
    color: #fff;
  }
  .title {
    font-size: 70px;
    font-weight: bold;
    letter-spacing: 10px;
    .red {
      color: #ed1459;
    }
    .white {
      color: #fff;
    }
  }
  .subTitle {
    letter-spacing: 6px;
    font-size: 28px;
    margin-bottom: 30px;
  }
  .text {
    width: 514px;
    line-height: 25px;
    color: #ccc;
    font-size: 14px;
  }
  .right-logo {
    position: absolute;
    right: 0;
    bottom: -35px;
    img {
      width: auto;
    }
  }
}
</style>
