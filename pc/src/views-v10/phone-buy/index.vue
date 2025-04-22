<template>
  <div class="phone-buy">
    <div class="phone-buy__content">
      <img
        class="phone-buy-l phone-buy__img object-contain"
        src="~@/assets/images-v10/phone-buy/APPdownload_image.png"
        alt=""
      >
      <div class="phone-buy-r bg-[#F5F9FF] rounded-3xl border-2 border-white border-solid shadow-lg shadow-[rgba(107,168,220,0.10)]">
        <div class="w-full h-full rounded-3xl shadow-inner shadow-[#EBF2FB] py-10 px-16">
          <h2 class="font-bold text-4xl text-center pb-5">{{$tex("娱乐手游领导者")}}</h2>
          <p class="text-lg font-medium text-font-accent">
            {{$tex("全网最顶尖的手机投注app，最丰富的游戏种类，最卓越的用户体验，新颖快捷投注模式自由切换，稳定陪伴您畅快游戏，随时可尽情享受游戏的乐趣！财富一键在手！")}}
          </p>
          <home-qrcode></home-qrcode>
        </div>
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
  background: url('~@/assets/images-v10/phone-buy/APPdownload_bg_2.png') no-repeat;
  background-size: cover;
  position: relative;
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
  margin-right: 100px;
}
.phone-buy-r {
  width: 550px;
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
  font-size: 18px;
}
.home-qrcode {
  margin: 25px 0 0;
}
</style>
