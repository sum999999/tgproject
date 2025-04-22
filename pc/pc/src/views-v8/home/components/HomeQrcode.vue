<template>
  <ul class="home-qrcode">
    <li class="home-qrcode-item ios">
      <div class="home-qrcode-item__icon">
        <img
          :src="iosQrcode"
          alt=""
        >
      </div>
      <div class="home-qrcode-item__btn">{{$tex("苹果系统下载")}}</div>
    </li>
    <li class="home-qrcode-item android">
      <div class="home-qrcode-item__icon">
        <img
          :src="androidQrcode"
          alt=""
        >
      </div>
      <div class="home-qrcode-item__btn">{{$tex("安卓系统下载")}}</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'HomeQrcode',
  computed: {
    qrcodes() {
      return this.$store.state.qrcodes
    },
    iosQrcode() {
      const iosQrcode = (this.qrcodes || []).find((qrcode) => {
        return qrcode.icon === 'ios'
      })
      if (iosQrcode) {
        return iosQrcode.img
      }
      return null
    },
    androidQrcode() {
      const androidQrcode = (this.qrcodes || []).find((qrcode) => {
        return qrcode.icon === 'android'
      })
      if (androidQrcode) {
        return androidQrcode.img
      }
      return null
    },
  },
}
</script>

<style scoped lang="less">
.home-qrcode {
  display: flex;
  justify-content: center;
  text-align: center;
}
.home-qrcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  &:hover {
    .home-qrcode-item__icon {
      transform: scale(1.101);
    }
  }
  &.ios {
    .home-qrcode-item__btn {
    }
  }
  &.android {
    .home-qrcode-item__btn {
    }
  }
}
.home-qrcode-item__icon {
  transition: transform ease-in-out 0.4s;
  transform-origin: bottom;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  border-image: linear-gradient(to top, #b48132, #fae0af, #b48132) 1;
  padding: 6px;
  font-size: 0;
  img {
    width: 165px;
    height: 165px;
    float: none;
    padding: 6px;
    background-color: #ffffff;
  }
}
.home-qrcode-item__btn {
  width: 240px;
  height: 56px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 20px 0 0;
  color: #5b3e0b;
  font-family: PingFang-SC-Heavy;
  font-size: 18px;
  color: #ffd427;
  letter-spacing: 0;
  text-align: center;
  line-height: 18px;
}
</style>
