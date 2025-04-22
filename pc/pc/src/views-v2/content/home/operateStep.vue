<template>
  <div class="step-contaner">
    <div class="w">
      <div class="step-title">
        <h2>操作流程</h2>
        <h5> Operating procedures</h5>
      </div>
      <ul class="step-list clearfix">
        <li>
          <div class="logo"><i class="iconfont icon-per"></i></div>
          <p class="title">登录/注册</p>
          <div class="tip">
            <p>快速填写信息</p>
            <p>10s成为本站会员</p>
          </div>
        </li>
        <li>
          <div class="logo"><i class="iconfont icon-bank1"></i></div>
          <p class="title">充值</p>
          <div class="tip">
            <p>储蓄卡、信用卡、支付宝</p>
            <p>多种方式 安全快速</p>
          </div>
        </li>
        <li>
          <div class="logo"><i class="iconfont icon-buy"></i></div>
          <p class="title">购买彩票</p>
          <div class="tip">
            <p>竞技彩、数字彩、快频彩</p>
            <p>彩种全面 玩法多样</p>
          </div>
        </li>
        <li>
          <div class="logo"><i class="iconfont icon-zzjl"></i></div>
          <p class="title">中奖提现</p>
          <div class="tip">
            <p>最快5分钟到账</p>
            <p>安全有保障</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      homeLogo: JSON.parse(localStorage.getItem('getLogos'))[0].itemValue || null

    }
  }
};
</script>

<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";
.step-contaner {
  padding-bottom: 20px;
  background: url("@{imgSrc}/index-step-bg.png");
  background-position: center bottom;
  background-repeat: no-repeat;
  padding-bottom: 270px;
}
.step-title {
  text-align: center;
  margin-bottom: 96px;
  h2 {
    font-size: 30px;
    margin-bottom: 10px;
    color: #fff;
  }
  h5 {
    font-size: 20px;
    color: #414149;
  }
}
.step-list {
  li {
    float: left;
    width: 264px;
    color: #e1e0e2;
    position: relative;
    background-color: rgba(32, 38, 56, 0.5);
    margin-left: 47px;
    text-align: center;
    padding-top: 60px;
    padding-bottom: 30px;
    border-radius: 10px;
    &:first-child {
      margin-left: 0;
    }
    .logo {
      position: absolute;
      top: -40px;
      left: 50%;
      margin-left: -35px;
      background: url("@{imgSrc}/index-step-logo.png");
      width: 70px;
      height: 79px;
      line-height: 79px;
      .iconfont {
        color: #ed1459;
        font-size: 30px;
        text-align: center;
      }
    }
    .title {
      margin-bottom: 40px;
      font-size: 22px;
    }
    .tip {
      p {
        font-size: 16px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
