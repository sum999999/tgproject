<template>
  <footer class="index-footer-wp">
    <div class="footer">
      <div class="top">
        <div class="list-wp">
          <ul class="list">
            <li class="ad">
              <h3>{{ $tex("平台优势") }}</h3>
              <p>{{ $tex("账户安全") }}</p>
              <p>{{ $tex("购彩简单") }}</p>
              <p>{{ $tex("领奖方便") }}</p>
              <p>{{ $tex("提款快速") }}</p>
            </li>
            <li class="hp">
              <h3>{{ $tex("帮助中心") }}</h3>
              <p class="link" @click="goPage('register')">
                {{ $tex("注册帮助") }}
              </p>
              <p class="link" @click="goPage('recharge')">
                {{ $tex("充值帮助") }}
              </p>
              <p class="link" @click="goPage('withdrawal')">
                {{ $tex("提现帮助") }}
              </p>
              <p class="link" @click="goPage('question')">
                {{ $tex("常见问题") }}
              </p>
            </li>
            <li class="ser">
              <h3>{{ $tex("在线客服") }}</h3>
              <p class="link" @click="goService">
                {{ $tex("充值、提现咨询") }}
              </p>
              <p class="link" @click="goService">
                {{ $tex("注册、优惠咨询") }}
              </p>
              <p class="link" @click="goService">
                {{ $tex("游戏、兑奖资讯") }}
              </p>
              <p class="link" @click="goService">
                {{ $tex("联盟股东、躺赚佣金") }}
              </p>
            </li>
            <li class="pay">
              <h3>{{ $tex("支付方式") }}</h3>
              <div class="pay-logo">
                <img src="~@/assets/images/pay/chinaunionxz.png" alt="" />
                <img src="~@/assets/images/pay/wechatpayxz.png" alt="" />
                <img src="~@/assets/images/pay/alipayxz.png" alt="" />
                <img src="~@/assets/images/pay/banktransferxz.png" alt="" />
                <img src="~@/assets/images/pay/visaxz.png" alt="" />
                <img src="~@/assets/images/pay/MasterCardxz.png" alt="" />
                <img src="~@/assets/images/pay/bitkeepxz.png" alt="" />
                <img src="~@/assets/images/pay/tronxz.png" alt="" />
                <img src="~@/assets/images/pay/postepayxz.png" alt="" />
              </div>
            </li>
            <li class="code ios" v-if="iosQrCode">
              <img :src="iosQrCode.img" />
              <p>{{ $tex("iPhone版下载") }}</p>
              <i></i>
            </li>
            <li class="code" v-if="androidQrCode">
              <img :src="androidQrCode.img" />
              <p>{{ $tex("Android版下载") }}</p>
              <i></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <div class="icons">
          <!-- <img class="logomin" src="~@/assets/images-v3/index/logomin.png"> -->
          <img src="~@/assets/images-v3/index/wchat.png" class="wechat" />
          <img class="yl" src="~@/assets/images-v3/index/yinlian.png" />
          <img src="~@/assets/images-v3/index/zfb.png" class="zfb" />
        </div>
        <div class="txt">
          <p>
            2009-{{ new Date().getFullYear() }}&copy;{{ $configText.main }}
            {{ $tex("版权所有") }}
          </p>
          <p>
            {{ $configText.main }}&nbsp;&nbsp;{{
              $tex(
                "郑重提示：彩票有风险，投注需谨慎，不向未满18周岁的青少年出售彩票"
              )
            }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    androidQrCode: {
      type: Object,
    },
    iosQrCode: {
      type: Object,
    },
  },
  computed: {
    serverUrl() {
      return this.$store.state.servicer;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    goPage(id) {
      this.$router.push({ name: "helpcenter", params: { id: id } });
    },
    goService() {
      const url = this.user.userCode
        ? this.serverUrl.url + `?id=${this.user.userCode}`
        : this.serverUrl.url;
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="less">
.index-footer-wp {
  background: @baseColor;
  .footer {
    width: 1172px;
    margin: 0 auto;
    color: @textColor;
    img {
      width: initial;
      height: initial;
    }
    .top {
      padding: 35px 55px;
      border-bottom: 1px solid #4c4c4c;
      .list {
        display: flex;
        justify-content: flex-start;
        li {
          width: 128px;
          font-size: 14px;
          text-align: left;
          &.hp {
            width: 128px;
          }
          &.pay {
            width: 318px;
            .pay-logo {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              margin-top: 12px;
              img {
                width: 95px;
                height: 24px;
                border: none;
                margin-bottom: 12px;
              }
            }
            margin-right: 64px;
          }
          &.ser {
            width: 178px;
          }
          &.code {
            position: relative;
            width: 101px;
            height: 101px;
            text-align: center;
            i {
              position: absolute;
              left: 32px;
              top: 34px;
              display: block;
              width: 34px;
              height: 34px;
              background-image: url("~@/assets/images-v3/index/andicon.png");
              background-size: cover;
              background-repeat: no-repeat;
            }
          }
          &.ios {
            margin-right: 45px;
            i {
              background-image: url("~@/assets/images-v3/index/iosicon.png");
            }
          }
        }
        h3 {
          font-family: "PingFangSC Semibold";
          font-size: 16px;
          margin-bottom: 2px;
        }
        p {
          width: 100%;
          font-family: "PingFangSC Regular";
          line-height: 26px;
        }
        img {
          float: initial;
          width: 101px;
          height: 101px;
          border: 3px solid @textColor;
        }
        .link {
          cursor: pointer;
          transition: all 0.3s;
          &:hover {
            color: @textLightColor;
          }
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 77px;
      padding: 22px 26px;
      font-family: "PingFangSC Medium";
      // font-size: 10px;
      font-size: 12px;
      color: #9d9d9d;
      .icons {
        display: flex;
        align-items: center;
      }
      .wechat {
        width: 32px;
        height: 27px;
      }
      .logomin {
        // width: 32px;
        // height: 27px;
        margin-right: 30px;
      }
      .yl {
        width: 43px;
        height: 27px;
        margin: 0 20px;
      }
      .txt {
        line-height: 18px;
        text-align: right;
        font-size: 12px;
        transform: scale(0.833333);
      }
      .zfb {
        width: 27px;
        height: 28px;
      }
    }
  }
}
</style>
