<template>
  <div>
    <div class="flex justify-center items-end gap-12 mt-20">
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_l.png"
      />
      <span class="text-5xl font-bold leading-11 border border-white/50 drop-shadow-[0_8px_8px_rgba(52,130,197,0.2)] bg-clip-text text-transparent bg-gradient-to-b from-[#208BFF] to-[#2FD4F6]">{{ $tex('APP下载') }}</span>
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_r.png"
      />
    </div>
    <p class="my-7 text-center text-base">{{ $tex("您想要的我们都有，带给您丰富的游戏体验") }}</p>
    <div class="flex justify-center items-center gap-24">
      <img
        class="object-contain"
        src="~@/assets/images-v10/phone-buy/APPdownload_image.png"
        alt=""
      >
      <div class="phone-buy-r bg-[#F5F9FF] rounded-3xl border-2 border-white border-solid shadow-lg shadow-[rgba(107,168,220,0.10)]">
        <div class="w-full h-full rounded-3xl shadow-inner shadow-[#EBF2FB] py-10 px-16">
          <h2 class="font-bold text-4xl text-center pb-5">{{$tex("娱乐手游领导者")}}</h2>
          <p class="text-lg font-medium text-font-accent  ">
            {{$tex("全网最顶尖的手机投注app，最丰富的游戏种类，最卓越的用户体验，新颖快捷投注模式自由切换，稳定陪伴您畅快游戏，随时可尽情享受游戏的乐趣！财富一键在手！")}}
          </p>
          <home-qrcode class="mt-6"></home-qrcode>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import HomeQrcode from './HomeQrcode'
export default {
  name: 'HomeDownload',
  components: {
    HomeQrcode,
  },
}
</script>

<style scoped lang="less">
</style>
