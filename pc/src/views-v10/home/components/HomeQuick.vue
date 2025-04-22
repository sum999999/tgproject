<template>
  <div class="home-quick">
    <div class="flex justify-center items-end gap-12">
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_l.png"
      />
      <span class="text-5xl font-bold leading-11 border border-white/50 drop-shadow-[0_8px_8px_rgba(52,130,197,0.2)] bg-clip-text text-transparent bg-gradient-to-b from-[#208BFF] to-[#2FD4F6]">{{ $tex('最佳支持') }}</span>
      <img
        class="w-24 h-5"
        src="~@/assets/images-v10/home/topgames_deco_r.png"
      />
    </div>
    <p class="my-7 text-center text-base">{{ $tex("您想要的我们都有，带给您丰富的游戏体验") }}</p>
    <div class="flex justify-center items-center container">
      <div class="home-quick__support">
        <div class="home-quick__support__items">
          <div
            class="home-quick__support__item flex items-center justify-between pl-7"
            @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'recharge'}}) : $router.push({ name: 'login' })"
          >
            <img src="~@/assets/images-v10/home/bestsupport_Chongzhi.png">
            <div>
              <p class="text-font-accent font-bold">{{ $tex('存款') }}</p>
              <p>{{ $tex('存款送奖金') }}</p>
            </div>
          </div>
          <div
            class="home-quick__support__item flex items-center justify-between pl-7"
            @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'withdraw'}}) : $router.push({ name: 'login' })"
          >
            <img src="~@/assets/images-v10/home/bestsupport_Tixian.png">
            <div>
              <p class="text-font-accent font-bold">{{ $tex('提款') }}</p>
              <p>{{ $tex('提款最快到账') }}</p>
            </div>
          </div>
          <div
            class="home-quick__support__item flex items-center justify-between pl-7"
            @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'description'}}) : $router.push({ name: 'login' })"
          >
            <img src="~@/assets/images-v10/home/bestsupport_Daili.png">
            <div>
              <p class="text-font-accent font-bold">{{ $tex('代理') }}</p>
              <p>{{ $tex('代理人奖金计划') }}</p>
            </div>
          </div>
        </div>
      </div>
      <img
        class="mx-7"
        src="~@/assets/images-v10/home/bestsupport_Beauty.png"
      >
      <div class="home-quick__hot">
        <vue-seamless-scroll
          :data="[1,2,3,4,5]"
          :class-option="classOption"
          class="home-quick__hot__wrap"
        >
          <div class="home-quick__hot__items">
            <div
              class="home-quick__hot__item"
              @click="$router.push({name: 'active'})"
            >
              <img src="~@/assets/images-v8/home/crown.png">
              <div class="home-quick__hot__item__content">
                <p class="text-font-accent font-bold">{{ $tex('至尊礼物') }}</p>
                <p class="text-font-primary">{{ $tex('王者回归') }}</p>
              </div>
              <span class="home-quick__hot__item__number text-accent">88888 ¥</span>
            </div>
          </div>
          <div class="home-quick__hot__items">
            <div
              class="home-quick__hot__item"
              @click="$router.push({name: 'active'})"
            >
              <img src="~@/assets/images-v8/home/fire.png">
              <div class="home-quick__hot__item__content">
                <p class="text-font-accent font-bold">{{ $tex('新人礼物') }}</p>
                <p class="text-font-primary">{{ $tex('三大礼包，冲啊！') }}</p>
              </div>
              <span class="home-quick__hot__item__number text-accent">1888 ¥</span>
            </div>
          </div>
          <div class="home-quick__hot__items">
            <div
              class="home-quick__hot__item"
              @click="$router.push({name: 'active'})"
            >
              <img src="~@/assets/images-v8/home/money.png">
              <div class="home-quick__hot__item__content">
                <p class="text-font-accent font-bold">{{ $tex('返利') }}</p>
                <p class="text-font-primary">{{ $tex('支付安全稳定') }}</p>
              </div>
              <span class="home-quick__hot__item__number text-accent">1.8%</span>
            </div>
          </div>
          <div class="home-quick__hot__items">
            <div
              class="home-quick__hot__item"
              @click="$router.push({name: 'active'})"
            >
              <img src="~@/assets/images-v8/home/crown.png">
              <div class="home-quick__hot__item__content">
                <p class="text-font-accent font-bold">{{ $tex('至尊礼物') }}</p>
                <p class="text-font-primary">{{ $tex('王者回归') }}</p>
              </div>
              <span class="home-quick__hot__item__number text-accent">88888 ¥</span>
            </div>
          </div>
          <div class="home-quick__hot__items">
            <div
              class="home-quick__hot__item"
              @click="$router.push({name: 'active'})"
            >
              <img src="~@/assets/images-v8/home/fire.png">
              <div class="home-quick__hot__item__content">
                <p class="text-font-accent font-bold">{{ $tex('新人礼物') }}</p>
                <p class="text-font-primary">{{ $tex('三大礼包，冲啊！') }}</p>
              </div>
              <span class="home-quick__hot__item__number text-accent">1888 ¥</span>
            </div>
          </div>
        </vue-seamless-scroll>

      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeQuick',
  components: {
    vueSeamlessScroll,
  },
  data() {
    return {
      classOption: {
        direction: 1,
      },
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-quick {
  background: url(~@/assets/images-v10/home/bestsupport_bg.png) no-repeat;
  background-size: cover;
  background-position: left center;
  padding: 40px 80px 60px;
  &__support__title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 43px;
      height: 43px;
      margin-right: 10px;
    }
    span {
      font-family: PingFang-SC-Heavy;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
  &__support__items &__support__item:nth-child(1) {
    img {
      width: 64px;
    }
  }
  &__support__items &__support__item:nth-child(2) {
    img {
      width: 64px;
    }
  }
  &__support__items &__support__item:nth-child(3) {
    img {
      width: 64px;
    }
  }
  &__support__item {
    cursor: pointer;
    width: 320px;
    height: 87px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
    background-image: linear-gradient(0deg, #e6ebfe 0%, #f7f9ff 100%);
    border: 2px solid #ffffff;
    box-shadow: 0 0 15px 0 rgba(107, 168, 220, 0.1), inset 0 0 6px 0 #ebf2fb;
    img {
      position: relative;
      object-fit: contain;
    }
    > div {
      text-align: right;
      padding-right: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p:nth-child(1) {
        font-family: PingFang-SC-Heavy;
        font-size: 22px;
        letter-spacing: 0;
        text-align: right;
        line-height: 22px;
        margin-bottom: 6px;
      }
      p:nth-child(2) {
        font-family: PingFang-SC-Medium;
        font-size: 12px;
        letter-spacing: 0;
        text-align: right;
        line-height: 12px;
      }
    }
  }
  &__hot__wrap {
    height: 290px;
    overflow: hidden;
  }
  &__hot__title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 32px;
      height: 38px;
      margin-right: 10px;
    }
    span {
      font-family: PingFang-SC-Heavy;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
  &__hot__item {
    cursor: pointer;
    width: 320px;
    height: 71px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
    padding: 20px 10px 20px 18px;
    display: flex;
    align-items: center;
    background-image: linear-gradient(0deg, #e6ebfe 0%, #f7f9ff 100%);
    border: 2px solid #ffffff;
    box-shadow: 0 0 15px 0 rgba(107, 168, 220, 0.1), inset 0 0 6px 0 #ebf2fb;
    > img {
      width: 25px;
      height: 25px;
      position: relative;
      object-fit: contain;
    }
    &__content {
      padding-left: 8px;
      width: 100%;
      p:nth-child(1) {
        font-family: PingFang-SC-Heavy;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 16px;
        margin-bottom: 4px;
      }
      p:nth-child(2) {
        font-family: PingFang-SC-Bold;
        font-size: 12px;
        letter-spacing: 0;
        line-height: 12px;
      }
    }
    &__number {
      font-family: PingFang-SC-Heavy;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 16px;
      flex-shrink: 0;
    }
  }
}
</style>