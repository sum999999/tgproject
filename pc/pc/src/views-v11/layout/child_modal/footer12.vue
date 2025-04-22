<template>
  <div>
    <div class="box-bottom">
      <div class="ftad">
        <h2 class="purchase">手机购彩</h2>
        <span style="font-size: 14px;color: #B8B8B8;"> Mobile lottery</span>
        <div class="technicalSupport">
          <!-- <img src="" /> -->
          <!-- <img class="QrCode" src="~@/assets/images-v11/yard.png" /> -->
          <vue-qr
            style="margin-left:20px"
            :text="domainName"
            :size="60"
            :margin="0"
          ></vue-qr>
          <div
            class="description"
            style="display: flex;flex-direction: column;justify-content: space-around;font-size:12px;"
          >
            <p>手机浏览器扫描二维码下载手机APP</p>
            <p>建议浏览器：Safari/Google Chrome/UC</p>
          </div>
          <span></span>
        </div>
      </div>
      <div class="ftad">
        <h2 class="purchase">服务体验</h2>
        <span style="font-size: 14px;color: #B8B8B8;"> Service experience</span>
        <div class="experienceTime" style="font-size:12px;">
          <span class="recharge" style="margin-right: 5px;"
            >昨日充值平均时间</span
          >
          <div class="footBar">
            <div class="recharge-Progress"></div>
          </div>
          <span class="Progress-time">1'17</span>秒
        </div>
        <div class="experienceTime" style="font-size:12px;">
          <span class="Payouts" style="margin-right: 5px;"
            >昨日提现平均时间</span
          >
          <div class="footBar">
            <div class="Payouts-Progress"></div>
          </div>
          <span class="Progress-time">3'22</span>秒
        </div>
      </div>
      <div class="ftad">
        <h2 class="purchase">充值方式</h2>
        <span style="font-size: 14px;color: #B8B8B8;"> Recharge method</span>
        <img class="methodImg" src="~@/assets/images-v11/deposit_method.png" />
      </div>
    </div>
    <div class="Container">
      <span class="setName">法律声明</span>
      <span class="setName">关于我们</span>
      <span class="setName">联系我们</span>
      <span class="setName">代理推广</span>
      <span class="setName">隐私声明</span>
      <p class="copyright">
        Copyright&nbsp;&nbsp; ©&nbsp;&nbsp;{{
          $configText.main
        }}&nbsp;&nbsp;Reserved | 18+
      </p>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";

export default {
  components: {
    VueQr,
  },
  data() {
    return {
      domainName: window.location.hostname,
    };
  },
  created() {
    const LINK = window.location.href.split("#")[0]; // 主域名后拼接 /a
    this.domainName = LINK;
    console.log(this.domainName);
  },
};
</script>

<style lang="less">
.box-bottom {
  background: #f8f8f8;
  border: 1px solid #dce1e5;
  border-left: none;
  border-right: none;
  height: 160px;
  display: flex;
  width: 100%;
  padding: 20px 0;
  justify-content: center;
  .ftad {
    width: 368px;
    height: 120px;
    border-right: 1px solid #dce1e5;
    .purchase {
      display: inline-block;
      font-size: 22px;
      margin: 2px 20px 4px;
    }
    .technicalSupport {
      display: flex;
      padding: 10px 10px;
      .QrCode {
        width: 60px;
        height: 60px;
        margin-left: 20px;
      }
      .description p {
        margin-left: 10px;
      }
    }
    .experienceTime {
      display: flex;
      margin: 14px 23px;
      .footBar {
        background: #e6e6e6;
        width: 120px;
        height: 15px;
        border-radius: 15px;
        position: relative;
        display: inline-block;
        vertical-align: sub;
        margin-left: 5px !important;
        overflow: hidden;
        .recharge-Progress {
          width: 33px;
          background: #fd5757;
          height: 14px;
          border-radius: 10px;
        }
        .Payouts-Progress {
          width: 87px;
          background: #4aa9db;
          height: 14px;
          border-radius: 10px;
        }
      }
      .Progress-time {
        font-size: 26px;
        color: #666666;
        margin: -17px 5px;
      }
    }
    .methodImg {
      width: 238px;
      height: 38px;
      margin: 17px 30px;
    }
  }
}
.Container {
  width: 100vh;
  height: 118px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .setName {
    display: inline-block;
    margin: 30px 14px 0px 0;
    border-right: 1px solid;
    height: 15px;
    padding-right: 10px;
  }
  .copyright {
    width: 100vw;
    display: flex;
    margin: 0 auto;
    justify-content: center;
    flex-wrap: nowrap;
    color: #999;
  }
}
</style>
