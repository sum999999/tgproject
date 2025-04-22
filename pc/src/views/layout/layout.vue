<template>
  <div class="pc-layout">
    <float-banner v-show="$route.name !== 'game'"></float-banner>
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
      <keep-alive :include="['chatRoom']">
        <router-view />
      </keep-alive>
    </div>
    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <!-- 结束 -->

    <div class="footer" v-if="!isShowFoot">
      <foot-content></foot-content>
    </div>
  </div>
</template>

<script>
// import headContent from "./child_modal/header.vue";
import headContent from "./child_modal/newheader.vue";
import footContent from "./child_modal/footer.vue";
import FloatBanner from "./child_modal/FloatBanner";

export default {
  components: {
    headContent,
    footContent,
    FloatBanner,
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
    padding: 15px 0;
    background: #dae6f9;
    // position: fixed;
    // bottom: 0;
    width: 100%;
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
