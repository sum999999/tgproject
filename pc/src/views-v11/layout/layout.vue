<template>
  <div class="pc-layout">
    <!-- 悬浮窗改悬浮按钮 -->
    <!-- <float-banner></float-banner> -->
    <slide-quick-two />
    <!-- 悬浮窗结束 -->
    <div class="header" v-if="!isShowHead">
      <head-content
        @toggle-loading="toggleLoading"
        @go-chat-room="toggleLoading"
      ></head-content>
    </div>

    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <!-- 结束 -->

    <div class="bodyer" v-loading="loginGameloading">
      <gameCategory />
      <keep-alive :include="['chatRoom']">
        <router-view />
      </keep-alive>
    </div>
    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <!-- 结束 -->

    <div class="footer" v-if="!isShowFoot">
      <!-- <foot-content></foot-content> -->
      <foot-content-two></foot-content-two>
    </div>
  </div>
</template>

<script>
// import headContent from "./child_modal/header.vue";
import headContent from "./child_modal/newheader.vue";
// import footContent from "./child_modal/footer.vue";
// import FloatBanner from "./child_modal/FloatBanner";
import SlideQuickTwo from "@/views-v11/layout/SlideQuick12.vue";
import footContentTwo from "./child_modal/footer12.vue";
import gameCategory from "./gameCategory.vue";

export default {
  components: {
    headContent,
    // footContent,
    // FloatBanner,
    SlideQuickTwo,
    footContentTwo,
    gameCategory,
  },
  data() {
    return {
      isShowHead: false,
      isShowFoot: false,
      loginGameloading: false,
    };
  },
  watch: {
    $route(n) {
      this.routeStatus(n.name);
    },
  },
  methods: {
    toggleLoading(flag) {
      this.loginGameloading = flag;
    },
    routeStatus(name) {
      if (
        name === "buyLottery" ||
        name === "redPacket" ||
        name === "chatRoom" ||
        name === "feedbackActive"
      ) {
        this.isShowHead = true;
        this.isShowFoot = true;
      } else if (name === "lottery") {
        this.isShowHead = false;
        this.isShowFoot = true;
      } else {
        this.isShowHead = false;
        this.isShowFoot = false;
      }
    },
  },
  async created() {
    this.routeStatus(this.$route.name);
  },
  actived() {
    this.$nextTick(() => {
      if (this.$refs.redPacket) {
        this.$refs.redPacket.style.opacity = 1;
      }
    });
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.redPacket) {
        this.$refs.redPacket.style.opacity = 1;
      }
    }, 300);
  },
};
</script>

<style lang="less">
@import "../../styles/mixin.less";
.pc-layout {
  background-color: white;
  .suspend-container {
    position: absolute;
    top: 220px;
    z-index: 105;
    opacity: 0;
    transition: transform 1s;
    &.suspend-left {
      left: 15px;
    }
    &.suspend-right {
      right: 15px;
    }
  }
  .content {
    width: 1000px;
    margin: 0 auto;
  }
  .lee-globaloading {
    .load-3 {
      top: 25%;
    }
  }
  .footer {
    // padding: 15px 0;
    // background: #dae6f9;
    // position: fixed;
    // bottom: 0;
    padding: 0;
    background: white;
    width: 100%;
    margin: 0 auto;
    // left: 0;
  }
}
.rooms-modal {
  .ivu-modal-body {
    height: 86px;
    padding: 28px 40px 8px;
    text-align: center;
  }
  .pwd-wp {
    height: 50px;
    display: inline-block;
  }
  .pwd-ipt {
    width: 170px;
    height: 30px;
  }
  .error-tip {
    height: 20px;
    text-align: left;
    color: #be1204;
    font-size: 12px;
    line-height: 20px;
  }
  .ivu-modal-footer {
    padding: 0 40px 22px;
    font-size: 0;
  }
}
</style>
