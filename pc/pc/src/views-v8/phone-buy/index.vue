<template>
  <div class="phone-buy">
    <div class="phone-buy__mask"></div>
    <div class="phone-buy__content">
      <img
        class="phone-buy-l phone-buy__img"
        src="~@/assets/images-v8/phone-buy/xzimage.png"
        alt=""
      >
      <div class="phone-buy-r">
        <h1 class="phone-buy-r__1 text-title text-title--repeat-gradient">{{$tex("娱乐手游的")}}</h1>
        <h1 class="phone-buy-r__2 text-title text-title--repeat-gradient">{{$tex("领导者")}}</h1>
        <p class="phone-buy-r__dsc">
          {{$tex("全网最顶尖的手机投注app，最丰富的游戏种类，最卓越的用户体验，新颖快捷投注模式自由切换，稳定陪伴您畅快游戏，随时可尽情享受游戏的乐趣！财富一键在手！")}}
        </p>
        <home-qrcode></home-qrcode>
      </div>
    </div>
  </div>
</template>

<script>
import HomeQrcode from '../home/components/HomeQrcode'

export default {
  name: 'phone-buy',
  components: {
    HomeQrcode,
  },
}
</script>

<style scoped lang="less">
.phone-buy {
  padding-top: 120px;
  background: url('~@/assets/images-v8/home/bg.png') no-repeat;
  background-size: cover;
  position: relative;
  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
  }
  &__content {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
}
.phone-buy__img {
  float: none;
  flex: 1;
  width: 100%;
  max-width: 552px;
  margin-bottom: 110px;
}
.phone-buy-l {
  margin-right: 35px;
}
.phone-buy-r {
  width: 544px;
  margin-bottom: 166px;
}
.text-title {
  font-size: 66px;
  line-height: 66px;
}
.phone-buy-r__2 {
  margin: 20px 0 30px;
  padding-left: 240px;
}
.phone-buy-r__dsc {
  color: #ffffff;
  font-size: 18px;
}
.home-qrcode {
  margin: 60px 0 0;
}
</style>
