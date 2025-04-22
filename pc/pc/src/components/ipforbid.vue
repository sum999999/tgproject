<template>
  <div class='forbidden'>
<!--    <div class="logo"></div>-->
<!--    <div class="no-service"></div>-->
    <img class="forbidden__logo" src="/configstatic/pc/images/logo.gif" alt="">
    <img class="forbidden__icon" src="~@/assets/images/forbid_icon.png" alt="">
    <div class='forbidden__text'>
      <div class="forbidden__dsc">
        <h1 class="forbidden__dsc-title">{{$tex("抱歉！您所在的地区限制访问!")}}</h1>
        <h2 class="forbidden__dsc-title-en">Sorry！We are not serving your location</h2>
        <h3 class="forbidden__dsc-ip" v-if="ipForbidData.code === '1'">{{$tex("您的IP")}}：<span class="forbidden__dsc-ip-address">{{ipForbidData.info}}</span></h3>
        <h3 class="forbidden__dsc-dev" v-else>{{$tex("您的设备码")}}：<span class="forbidden__dsc-dev-address">{{ipForbidData.info}}</span></h3>
      </div>
      <div class="forbidden__line forbidden__line_first"></div>
      <dl class="forbidden__content">
        <dt class="forbidden__content-title">{{$tex("尊敬的客户")}}</dt>
        <i18n path="由于IP所在区域不在我们服务范围内 , 或您的设备已被禁用导致无法访问 ,很抱歉造成您的不便 , 若有任何疑问请与我们的{name}联系 , 谢谢您 !" tag="dd">
          <template slot="name">
            <a class="forbidden_cus-link" :href="ipForbidData.url">{{$tex("在线客服")}}</a>
          </template>
        </i18n>,
      </dl>
      <div class="forbidden__line"></div>
      <dl class="forbidden__content-en">
        <dt class="forbidden__content-en-title">Dear Customers,</dt>
        <dd class="forbidden__content-en-text">Due to the reason that IP location is not in our service area or your
          device has been disabled resulted in the forbidden access We are
          sorry for the inconvenience . If you have any concern , please don’t
          be hesitate to contact us . Thank you !</dd>
      </dl>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      cusUrl: ""
    };
  },
  computed: {
    ipForbidData() {
      return this.$store.state.isIpForbid || {};
    }
  },
};
</script>
<style scoped>
  .forbidden {
    width: 100%;
    min-width: 580px;
    text-align: center;
    min-height: 100vh;
    background: url(~@/assets/images/forbid_lottery.png) no-repeat center center/1836px;
    background-color: #f6f7fc;
    position: relative;
  }
  .forbidden_cus-link {
    font-weight: bold;
    color: #f65229;
  }
  .forbidden__logo {
    position: absolute;
    float: none;
    width: 300px;
    margin: auto;
    top: 194px;
    left: 0;
    right: 0;
  }
  .forbidden__icon {
    float: none;
    max-width: 632px;
    max-height: 582px;
  }
  .forbidden__text {
    text-align: center;
    margin: 0 auto;
    background: url(~@/assets/images/forbid_map.png) no-repeat center center;
    background-size: contain;
    min-height: 381px;
    width: 580px;
    color: #1f1f1f;
    margin-top: -82px;
    border-top: 1px solid transparent;
  }
  .forbidden__dsc {
    width: 420px;
    margin: auto;
    text-align: left;
    margin-top: -107px;
  }
  .forbidden__line {
    border-bottom: 1px solid #9e9e9e;
    margin: 36px 0;
  }
  .forbidden__line_first {
    margin: 38px 0 36px;
  }
  .forbidden__dsc-title {
    font-size: 28px;
  }
  .forbidden__dsc-title-en {
    font-size: 20px;
  }
  .forbidden__dsc-ip, .forbidden__dsc-dev {
    font-size: 16px;
  }
  .forbidden__dsc-ip-address, .forbidden__dsc-dev-address {
    color: #0088ff;
  }
  .forbidden__content {
    width: 520px;
    margin: auto;
    text-align: left;
  }
  .forbidden__content-en {
    width: 520px;
    margin: auto;
    text-align: left;
  }
</style>
