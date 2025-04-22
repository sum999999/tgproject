<template>
  <ul class="home-qrcode">
    <li
      class="home-qrcode-item ios"
      @mouseenter="index = 0"
      @mouseleave="index = -1"
    >
      <div class="home-qrcode-item__icon">
        <img
          :src="iosQrcode"
          alt=""
        >
      </div>
      <Button
        class="mt-5 px-5 py-4"
        :class="{
          'ivu-btn-style--2': index == 0,
          'ivu-btn-style--4': index != 0,
        }"
        type="primary"
        shape="circle"
      >{{$tex("苹果系统下载")}}</Button>
    </li>
    <li
      class="home-qrcode-item android"
      @mouseenter="index = 1"
      @mouseleave="index = -1"
    >
      <div class="home-qrcode-item__icon">
        <img
          :src="androidQrcode"
          alt=""
        >
      </div>
      <Button
        class="mt-5 px-5 py-4"
        :class="{
          'ivu-btn-style--2': index == 1,
          'ivu-btn-style--4': index != 1,
        }"
        type="primary"
        shape="circle"
      >{{$tex("安卓系统下载")}}</Button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'HomeQrcode',
  data() {
    return {
      index: -1,
    }
  },
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
  background: #f0f6ff;
  border: 1px solid #ffffff;
  border-radius: 20px;
  padding: 15px;
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
