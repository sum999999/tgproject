<template>
  <div class="footer">
    <div class="w">
      <ul class="poster-list clearfix">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li><img
            class="w-full"
            src="/configstatic/pc/images/logo.gif"
            alt=""
          ></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <!--   <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li> -->
      </ul>

      <p class="split"></p>

      <ul class="license-list clearfix">
        <li>
          <span class="img"></span>
          <p>英国CG监督委员会</p>
        </li>
        <li> <span class="img"></span>
          <p>马耳他博彩牌照（MGA）认证</p>
        </li>
        <li> <span class="img"></span>
          <p>英属维尔京群岛（BM）认证</p>
        </li>
        <li> <span class="img"></span>
          <p>菲律宾（PAGCOR）监督博彩牌照</p>
        </li>
      </ul>

      <p class="txt">2009-{{new Date().getFullYear()}}© {{$configText.main}} 公司版权所有<br />
        {{$configText.main}} 郑重提示：彩票有风险，投注需谨慎。不向未满18周岁的青少年出售彩票！</p>
    </div>

  </div>
</template>

<script>
export default {}
</script>
<style scoped lang="less">
@imgSrc: '../../../assets/images/template-v2';
.poster-list {
  padding-top: 30px;
  text-align: center;
  li {
    //float: left;
    display: inline-block;
    width: 102px;
    height: 30px;
    margin-left: 3px;
    background-repeat: no-repeat;
    background-position: center center;
    &:nth-child(1) {
      margin-left: 0;
      background-image: url('@{imgSrc}/footer-cb.png');
    }
    &:nth-child(2) {
      background-image: url('@{imgSrc}/footer-bbin.png');
    }
    &:nth-child(3) {
      background-image: url('@{imgSrc}/footer-ag.png');
    }
    &:nth-child(4) {
      background-image: url('@{imgSrc}/footer-ebet.png');
    }
    &:nth-child(5) {
      background-image: url('@{imgSrc}/footer-ygg.png');
    }
    &:nth-child(7) {
      background-image: url('@{imgSrc}/footer-kyqp.png');
    }
    &:nth-child(8) {
      background-image: url('@{imgSrc}/footer-net.png');
    }
    &:nth-child(9) {
      background-image: url('@{imgSrc}/footer-pg.png');
    }
    &:nth-child(10) {
      background-image: url('@{imgSrc}/footer-sb.png');
    }
    &:nth-child(11) {
      background-image: url('@{imgSrc}/footer-fadj.png');
    }
  }
}
.license-list {
  text-align: center;
  margin-bottom: 50px;
  li {
    display: inline-block;
    margin-left: 34px;
    text-align: center;
    .img {
      display: block;
      background-repeat: no-repeat;
      background-position: center center;
      margin-bottom: 5px;
    }
    p {
      color: #777e90;
    }
    &:nth-child(1) {
      width: 120px;
      .img {
        width: 100%;
        height: 25px;
        background-image: url('@{imgSrc}/footer-cert1.png');
      }
      margin-left: 0;
    }
    &:nth-child(2) {
      width: 200px;
      .img {
        width: 100%;
        height: 30px;
        background-image: url('@{imgSrc}/footer-cert2.png');
      }
    }
    &:nth-child(3) {
      width: 200px;
      .img {
        width: 100%;
        height: 40px;
        background-image: url('@{imgSrc}/footer-cert3.png');
      }
    }
    &:nth-child(4) {
      width: 230px;
      .img {
        width: 100%;
        height: 41px;
        background-image: url('@{imgSrc}/footer-cert4.png');
      }
    }
  }
}
.footer {
  background-color: #0e0e16;
  .split {
    width: 1100px;
    height: 2px;
    background-color: #0a0b12;
    border-top: 1px solid #121823;
    margin: 20px auto 30px auto;
  }
  .txt {
    padding-bottom: 20px;
    color: #e1e0e2;
    text-align: center;
  }
}
</style>
