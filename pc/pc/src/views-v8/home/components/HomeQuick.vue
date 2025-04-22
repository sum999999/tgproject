<template>
  <div class="home-quick">
    <div class="home-quick__support">
      <div class="home-quick__support__title">
        <img src="~@/assets/images-v8/home/support.png">
        <span>{{ $tex('最佳支持') }}</span>
      </div>
      <div class="home-quick__support__items">
        <div
          class="home-quick__support__item"
          @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'recharge'}}) : $router.push({ name: 'login' })"
        >
          <img src="~@/assets/images-v8/home/deposit.png">
          <div>
            <p>{{ $tex('存款') }}</p>
            <p>{{ $tex('存款送奖金') }}</p>
          </div>
        </div>
        <div
          class="home-quick__support__item"
          @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'withdraw'}}) : $router.push({ name: 'login' })"
        >
          <img src="~@/assets/images-v8/home/withdrawal.png">
          <div>
            <p>{{ $tex('提款') }}</p>
            <p>{{ $tex('提款最快到账') }}</p>
          </div>
        </div>
        <div
          class="home-quick__support__item"
          @click="isLogin ? $router.push({name: 'personalCenter', params: {id: 'description'}}) : $router.push({ name: 'login' })"
        >
          <img src="~@/assets/images-v8/home/agent.png">
          <div>
            <p>{{ $tex('代理') }}</p>
            <p>{{ $tex('代理人奖金计划') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="home-quick__hot">
      <div class="home-quick__hot__title">
        <img src="~@/assets/images-v8/home/hot.png">
        <span>{{ $tex('热门优惠') }}</span>
      </div>
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
              <p>{{ $tex('至尊礼物') }}</p>
              <p>{{ $tex('王者回归') }}</p>
            </div>
            <span class="home-quick__hot__item__number">88888 ¥</span>
          </div>
        </div>
        <div class="home-quick__hot__items">
          <div
            class="home-quick__hot__item"
            @click="$router.push({name: 'active'})"
          >
            <img src="~@/assets/images-v8/home/fire.png">
            <div class="home-quick__hot__item__content">
              <p>{{ $tex('新人礼物') }}</p>
              <p>{{ $tex('三大礼包，冲啊！') }}</p>
            </div>
            <span class="home-quick__hot__item__number">1888 ¥</span>
          </div>
        </div>
        <div class="home-quick__hot__items">
          <div
            class="home-quick__hot__item"
            @click="$router.push({name: 'active'})"
          >
            <img src="~@/assets/images-v8/home/money.png">
            <div class="home-quick__hot__item__content">
              <p>{{ $tex('返利') }}</p>
              <p>{{ $tex('支付安全稳定') }}</p>
            </div>
            <span class="home-quick__hot__item__number">1.8%</span>
          </div>
        </div>
        <div class="home-quick__hot__items">
          <div
            class="home-quick__hot__item"
            @click="$router.push({name: 'active'})"
          >
            <img src="~@/assets/images-v8/home/crown.png">
            <div class="home-quick__hot__item__content">
              <p>{{ $tex('至尊礼物') }}</p>
              <p>{{ $tex('王者回归') }}</p>
            </div>
            <span class="home-quick__hot__item__number">88888 ¥</span>
          </div>
        </div>
        <div class="home-quick__hot__items">
          <div
            class="home-quick__hot__item"
            @click="$router.push({name: 'active'})"
          >
            <img src="~@/assets/images-v8/home/fire.png">
            <div class="home-quick__hot__item__content">
              <p>{{ $tex('新人礼物') }}</p>
              <p>{{ $tex('三大礼包，冲啊！') }}</p>
            </div>
            <span class="home-quick__hot__item__number">1888 ¥</span>
          </div>
        </div>
      </vue-seamless-scroll>

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
  background: url(~@/assets/images-v8/home/quick-bg.png) no-repeat;
  background-size: cover;
  background-position: center top;
  display: flex;
  justify-content: space-between;
  padding: 30px 80px 15px;
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
      width: 123px;
    }
  }
  &__support__items &__support__item:nth-child(2) {
    img {
      width: 136px;
      left: -9%;
      top: 27%;
      height: 71px;
    }
  }
  &__support__items &__support__item:nth-child(3) {
    img {
      width: 140px;
      top: 5%;
      left: -3%;
    }
  }
  &__support__item {
    cursor: pointer;
    background: #4f4c40;
    width: 320px;
    height: 87px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
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
        color: #fffffe;
        letter-spacing: 0;
        text-align: right;
        line-height: 22px;
        margin-bottom: 6px;
      }
      p:nth-child(2) {
        font-family: PingFang-SC-Medium;
        font-size: 12px;
        color: #fffffe;
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
    box-shadow: inset 0 1px 0 0 #978853, inset 0 0 16px 0 rgba(254, 209, 54, 0.18);
    cursor: pointer;
    background: #4f4c40;
    width: 320px;
    height: 71px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
    padding: 20px 10px 20px 18px;
    display: flex;
    align-items: center;
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
        color: #ffffff;
        letter-spacing: 0;
        line-height: 16px;
        margin-bottom: 4px;
      }
      p:nth-child(2) {
        font-family: PingFang-SC-Bold;
        font-size: 12px;
        color: #bebebe;
        letter-spacing: 0;
        line-height: 12px;
      }
    }
    &__number {
      font-family: PingFang-SC-Heavy;
      font-size: 16px;
      color: #ffd427;
      letter-spacing: 0;
      line-height: 16px;
      flex-shrink: 0;
    }
  }
}
</style>