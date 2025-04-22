<template>
  <div class="home-head-menu-wp">
    <div class="home-head-menu clearfix">
      <!-- 左侧跑马灯 -->
      <div class="home-marquee">
        <home-marquee></home-marquee>
      </div>
      <!-- 右侧菜单 -->
      <div class="menu">
        <home-head-fast-nav :arrowFree="arrowFree" :isShowHotPhone="false" />
      </div>
    </div>
  </div>
</template>

<script>
import homeMarquee from "@/components/marquee.vue";
import homeHeadFastNav from "@/components/headMenu.vue";

export default {
  props: {
    arrowFree: {
      //是否显示试玩菜单
      type: Boolean,
      default: true,
    },
  },
  components: {
    homeMarquee,
    homeHeadFastNav,
  },
};
</script>

<style lang="less" scoped>
.home-head-menu-wp {
  .home-head-menu {
    width: 1000px;
    margin: 0 auto;
    font-size: 0;
    .home-marquee {
      float: left;
      width: 355px;
      height: 36px;
    }
    .menu {
      float: right;
      height: 36px;
      padding-top: 11px;
    }
  }
}
</style>
