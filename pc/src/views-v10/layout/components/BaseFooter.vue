<template>
  <div class="base-footer">
    <div class="base-footer-content bg-font-accent">
      <div class="container flex flex-nowrap gap-8 justify-center items-center">
        <img src="~@/assets/images-v10/home/ft-dsf-bbin.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-ag.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-bg.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-ky.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-og.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-pg.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-mg.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-playtech.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-CQ9.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-CMD.png" />
        <img src="~@/assets/images-v10/home/ft-dsf-fanya.png" />
      </div>
      <div class="container">
        <div class="w-full h-px base-footer_line mt-7 mb-10"></div>
      </div>
      <div class="container flex gap-12 justify-center items-center">
        <img class="w-28" src="~@/assets/images-v10/home/certified_1.png" />
        <img class="w-44" src="~@/assets/images-v10/home/certified_2.png" />
        <img class="w-44" src="~@/assets/images-v10/home/certified_3.png" />
        <img class="w-52" src="~@/assets/images-v10/home/certified_4.png" />
      </div>
    </div>

    <div class="base-footer-secondary bg-black">
      <div class="container base-footer-secondary__layout">
        <div class="base-footer-secondary__content text-[#969698] text-xs">
          {{
            $tex(
              "本网站拥有欧洲马耳他博彩管理局（MGA）、英国GC监管委员会（Gambling Commission）、菲律宾政府博彩委员会（PAGCOR）颁发合法执照、英属维尔京群岛（BM）认证。进行注册并娱乐前，请确保您年满18周岁。"
            )
          }}
          <span class="base-footer-secondary__copyright"
            >2009-{{ new Date().getFullYear() }}©
            {{
              $tex("本网站属于{name}平台版权所有", {
                name: $configText.main,
              })
            }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseFooter",
};
</script>

<style scoped lang="less">
.base-footer-content {
  font-size: 14px;
  padding: 40px 0 20px;
}
.base-footer-secondary {
}
.base-footer-secondary__copyright {
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
.base-footer_line {
  opacity: 0.75;
  background: #141b28;
  background: #878ea6;
}
</style>
