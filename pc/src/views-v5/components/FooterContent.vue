<template>
    <div class="footer">
      <ul class="footer-inner clearfix">
        <li>
          <img class="logo" src="/configstatic/pc/images/logo.gif" alt="">
          <img class="auth" src="~@/assets/images-v5/img0.png" alt="">
        </li>
        <li class="help clearfix">
          <div class="lf dsc-icon">
            <img src="/configstatic/pc/images/logo.gif" alt="">
          </div>
          <div class="lf dsc-content">
            <h1 class="title">帮助中心</h1>
            <div class="clearfix">
              <ul class="link-item lf">
                <li><a href="/#/register">注册账号</a></li>
                <li><a href="/#/helpcenter/withdrawal">账户提现</a></li>
                <li><a href="/#/helpcenter/security">账号安全</a></li>
              </ul>
              <ul class="link-item lf">
                <li><a href="/#/helpcenter/recharge">账户充值</a></li>
                <li><a href="/#/helpcenter/question">常见问题</a></li>
                <li><a href="/#/helpcenter/contact">联系我们</a></li>
              </ul>
            </div>
          </div>
        </li>
        <li class="help clearfix">
          <div class="lf dsc-icon">
            <img src="/configstatic/pc/images/logo.gif" alt="">
          </div>
          <div class="lf dsc-content">
            <h1 class="title">浏览器推荐</h1>
            <div class="clearfix">
              <ul class="link-item lf">
                <li>谷歌浏览器</li>
                <li>IE浏览器</li>
                <li>搜狐浏览器</li>
              </ul>
              <ul class="link-item lf">
                <li>火狐浏览器</li>
                <li>Safari浏览器</li>
                <li></li>
              </ul>
            </div>
          </div>
        </li>
        <li class="help clearfix">
          <div class="lf dsc-icon">
            <img src="/configstatic/pc/images/logo.gif" alt="">
          </div>
          <div class="lf dsc-content">
            <h1 class="title">平台入驻</h1>
            <div class="clearfix">
              <ul class="link-item lf">
                <li>AG视讯</li>
                <li>PT电子</li>
                <li>AG体育</li>
              </ul>
              <ul class="link-item lf">
                <li>开元棋牌</li>
                <li>BBIN视讯</li>
                <li>JDB捕鱼</li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
<style lang="less" scoped>
  .lf {
    float: left;
  }
  .footer{
      position: relative;
      width:100%;
      height:200px;
    padding-top: 34px;
    background-color: #ffffff;
    color: #adadad;
    a {
      color: #adadad;
    }
  }
  .footer-inner {
    width: 1110px;
    height: 100%;
    margin: auto;
    .logo {
      height: 53px;
      margin: 0 0 25px;
      float: none;
      width: auto;
    }
    .auth {
      width: 280px;
    }
    >li {
      float: left;
      width: 25%;
    }
  }
  .help {
    padding-left: 50px;
  }
  .dsc-icon {
    img {
      width: 47px;
      height: 47px;
      margin-right: 14px;
      float: none;
    }
  }
  .dsc-content {
    font-size: 14px;
    font-weight: bold;
    h1 {
      font-size: 18px;
      margin-top: 15px;
      margin-bottom: 18px;
    }
    .link-item:nth-child(1) {
      width: 82px;
    }
    .link-item {
      line-height: 24px;
    }
  }
</style>
