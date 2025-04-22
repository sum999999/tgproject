<template>
  <div class="base-footer">
    <div class="base-footer-content">
      <div class="container base-footer-content__layout">
        <dl class="base-footer-content__column">
          <dt class="base-footer-content__title">{{$tex("帮助中心")}}</dt>
          <dd
            class="base-footer-content__link"
            @click="$router.push({name:'helpcenter',params:{id: 'register'}})"
          >{{$tex("用户注册")}}</dd>
          <dd
            class="base-footer-content__link"
            @click="$router.push({name:'helpcenter',params:{id: 'security'}})"
          >{{$tex("账号安全")}}</dd>
          <dd
            class="base-footer-content__link"
            @click="$router.push({name:'helpcenter',params:{id: 'question'}})"
          >{{$tex("常见问题")}}</dd>
          <dd
            class="base-footer-content__link"
            @click="$router.push({name:'helpcenter',params:{id: 'contact'}})"
          >{{$tex("联系我们")}}</dd>
        </dl>
        <dl class="base-footer-content__column">
          <dt class="base-footer-content__title">{{$tex("浏览器推荐")}}</dt>
          <dd class="base-footer-content__browser">
            <img
              src="~@/assets/images-v6/home/liulanqi_google.png"
              alt=""
            >
            <img
              src="~@/assets/images-v6/home/liulanqi_safari.png"
              alt=""
            >
            <img
              src="~@/assets/images-v6/home/liulanqi_huohu.png"
              alt=""
            >
            <img
              src="~@/assets/images-v6/home/liulanqi_ie.png"
              alt=""
            >
            <img
              src="~@/assets/images-v6/home/liulanqi_sougou.png"
              alt=""
            >
          </dd>
        </dl>
        <dl class="base-footer-content__column">
          <dt class="base-footer-content__title">{{$tex("监管机构")}}</dt>
          <dd class="base-footer-content__org">
            <img
              class="base-footer-content__org-pagcor"
              src="~@/assets/images-v6/home/jianguan_pagcor.png"
              alt=""
            >
            <img
              class="base-footer-content__org-bvi"
              src="~@/assets/images-v6/home/jianguan_bvi.png"
              alt=""
            >
            <img
              class="base-footer-content__org-mga"
              src="~@/assets/images-v6/home/jianguan_mga.png"
              alt=""
            >
            <img
              class="base-footer-content__org-gc"
              src="~@/assets/images-v6/home/jianguan_gc.png"
              alt=""
            >
          </dd>
        </dl>
      </div>
    </div>
    <div class="base-footer-secondary">
      <div class="container base-footer-secondary__layout">
        <div class="base-footer-secondary__content">
          {{$tex("本网站拥有欧洲马耳他博彩管理局（MGA）、英国GC监管委员会（Gambling Commission）、菲律宾政府博彩委员会（PAGCOR）颁发合法执照、英属维尔京群岛（BM）认证。进行注册并娱乐前，请确保您年满18周岁。")}}
          <span class="base-footer-secondary__copyright">2009-{{new Date().getFullYear()}}© {{$tex("本网站属于{name}公司版权所有", { name: $configText.main })}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseFooter',
}
</script>

<style scoped lang="less">
.base-footer-content {
  color: #666666;
  background-color: #171717;
  font-size: 14px;
  padding: 40px 0;
}
.base-footer-secondary {
  color: #444444;
  background-color: #000000;
  font-size: 12px;
}
.base-footer-secondary__copyright {
  color: #999999;
}
.base-footer-content__layout {
  display: flex;
  justify-content: space-between;
}
.base-footer-content__title {
  font-size: 18px;
  margin-bottom: 30px;
}
.base-footer-content__browser {
  width: 210px;
  font-size: 0;
  img {
    width: 46px;
    height: 46px;
    float: none;
    margin: 0 30px 20px 0;
  }
  img:nth-child(3n + 3) {
    margin-right: 0;
  }
}

.base-footer-content__link {
  margin-bottom: 16px;
  cursor: pointer;
}
.base-footer-content__column {
  .base-footer-content__link:nth-last-child(1) {
    margin-bottom: 0px;
  }
}
.base-footer-content__org {
  width: 490px;
  font-size: 0;
  img {
    float: none;
    margin-right: 68px;
    margin-bottom: 18px;
  }
  img:nth-child(2n + 2) {
    margin-right: 0;
  }
  .base-footer-content__org-pagcor {
    width: 210px;
    height: 46px;
  }
  .base-footer-content__org-bvi {
    width: 198px;
    height: 46px;
  }
  .base-footer-content__org-mga {
    width: 215px;
    height: 44px;
  }
  .base-footer-content__org-gc {
    width: 168px;
    height: 46px;
  }
}
.base-footer-secondary__content {
  width: 770px;
  text-align: center;
  margin: 0 auto;
  padding: 24px 0;
}
</style>
