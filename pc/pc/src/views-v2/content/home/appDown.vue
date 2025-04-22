<template>
  <div class="down-contanier">
    <div class="w">
      <div class="down-title">
        <h2>APP下载</h2>
        <h5>Download</h5>
      </div>
      <div class="down-box">
        <img
          class="title"
          :src="require('@/assets/images/template-v2/index-down-title.png')"
          alt=""
        >
        <div class="text">
          {{$configText.main}}支持iOS、Android、移动端浏览器、PC浏览器等多终端用户
          娱乐体验；下载我们的应用，感受原生态APP带来的流畅操作、新颖
          快捷的投注方式、多种投注模式的自由切换，以及体贴入微的用户考
          虑，让用户拥有沉浸式的娱乐享受！`</div>
        <div class="btn-section">
          <div class="btn-wrap">
            <div class="down-btn">
              <Icon
                type="social-apple"
                class="plat-logo"
              />IOS下载</div>

            <div class="ewm-wrap">
              <img
                :src="qrcodes[0] && qrcodes[0].img"
                alt=""
              >
              <img
                class="center"
                src="/static/images/ios.png"
                alt=""
              >
            </div>
          </div>
          <div class="btn-wrap">
            <div class="down-btn">
              <Icon
                type="social-android"
                class="plat-logo"
              />Android下载
            </div>
            <div class="ewm-wrap">
              <img
                :src="qrcodes[1] && qrcodes[1].img"
                alt=""
              >
              <img
                class="center"
                src="/static/images/android.png"
                alt=""
              >

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    qrcodes() {
      return this.$store.state.qrcodes;
    }
  }
};
</script>

<style scoped lang="less">
@imgSrc: "../../../assets/images/template-v2";

.down-contanier {
  background: url("@{imgSrc}/index-down-bg.png");
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 804px;
  margin-bottom: 50px;
  margin-top: -200px;
}
.down-title {
  text-align: center;
  margin-bottom: 180px;
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
.down-box {
  padding: 0 60px;
  .title {
    float: none;
    width: auto;
    margin-bottom: 25px;
  }
  .text {
    font-size: 16px;
    color: #e1e0e2;
    width: 680px;
    font-size: 16px;
    line-height: 30px;
    letter-spacing: 1px;
  }
  .btn-section {
    margin-top: 60px;
    .btn-wrap {
      display: inline-block;
      position: relative;
      margin-right: 50px;
      &:hover {
        .down-btn {
          background-color: #ed1459;
          box-shadow: inset 0px 0px 8px 5px #f25876;
        }

        .ewm-wrap {
          display: block;
        }
      }
      .ewm-wrap {
        position: absolute;
        background-color: #ed1459;
        width: 152px;
        height: 152px;
        border-radius: 10px;
        left: 50%;
        margin-left: -76px;
        top: -182px;
        padding: 10px;
        display: none;
        &::before {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 50%;
          margin-left: -10px;
          border: 10px solid transparent;
          border-top-color: #ed1459;
        }
        .center {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -15px;
          margin-left: -15px;
          background-color: #6d6e72;
          width: 30px;
          height: 30px;
          line-height: 30px;
          color: #fff;
          text-align: center;
          font-size: 25px;
          border-radius: 5px;
        }
      }
    }
    .down-btn {
      cursor: pointer;
      margin: 0 auto;
      color: #fff;
      height: 50px;
      line-height: 50px;
      width: 200px;
      text-align: center;
      font-size: 16px;
      border-radius: 40px;
      background-color: #242838;
      .plat-logo {
        font-size: 30px;
        margin-right: 5px;
        vertical-align: sub;
      }
    }
  }
}
</style>
