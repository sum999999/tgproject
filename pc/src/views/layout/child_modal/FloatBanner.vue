<template>
  <div v-if="showBanner" class="float-banner">
    <div :id="androidId" style="display:none"></div>
    <div :id="iosId" style="display:none"></div>
    <div
      v-if="showLeftBanner"
      class="float-banner__left"
      :style="bannerLeftStyle"
    >
      <!-- <p class="float-banner__title">{{$tex("扫一扫")}}</p>
      <div class="float-banner__dsc">
        <i class="i-icon-new i-android-white"></i>
        <span>安卓APP客户端</span>
      </div> -->
      <div class="float-banner__close" @click="showLeftBanner = false">
        <Icon color="#3971ff" type="android-close"></Icon>
      </div>
      <div class="float-banner__rq">
        <img class="w-full" v-if="qrcodes.length" :src="qrcodes[1].img" />
        <!-- <i><img class="w-full" src="/static/images/icon_android.png"/></i> -->
      </div>
      <div
        class="float-banner__button float-banner__button--primary i-icon-new i-suspend-bt"
        @click="openOnlineService"
      >
        <!-- <i class="i-icon-new i-line-service "></i> -->
        <img class="img-icon" src="/static/images/icon_zxnkf.png" />
        <span class="span-left">在线客服</span>
      </div>
      <div
        class="float-banner__button float-banner__button--green i-icon-new i-suspend-bt"
        @click="$router.push('/helpCenter/register')"
      >
        <!-- <i class="i-icon-new i-help-service"></i> -->
        <img class="img-icon" src="/static/images/icon_bzzx.png" />
        <span class="span-left">帮助中心</span>
      </div>
      <div
        class="float-banner__button float-banner__button--primary i-icon-new i-suspend-bt"
        @click="onFeedBackClick"
      >
        <!-- <i class="iconfont icon-yonghufankui"></i> -->
        <img class="img-icon" src="/static/images/icon_yjfk.png" />
        <span class="span-left">意见反馈</span>
      </div>

      <!-- <div
        v-if="$store.state.servicer && $store.state.servicer.qq"
        class="float-banner__button float-banner__button--green i-icon-new i-suspend-bt"
        @click="openQQ"
      >
        <i class="i-icon-new i-qq-service"></i>
        <span>QQ客服</span>
      </div> -->
    </div>
    <div
      v-if="showRightBanner"
      class="float-banner__right"
      :style="bannerRightStyle"
    >
      <!-- <p class="float-banner__title">{{$tex("扫一扫")}}</p>
      <div class="float-banner__dsc">
        <i class="i-icon-new i-ios-white"></i>
        <span>苹果APP客户端</span>
      </div> -->
      <div class="float-banner__close" @click="showRightBanner = false">
        <Icon color="#3971ff" type="android-close"></Icon>
      </div>
      <div class="float-banner__rq">
        <img class="w-full" v-if="qrcodes.length" :src="qrcodes[0].img" />
        <!-- <i><img class="w-full" src="/static/images/icon_ios.png"/></i> -->
      </div>
      <div
        class="float-banner__button float-banner__button--green i-icon-new i-suspend-bt"
        @click="openWin('#/lottery')"
      >
        <!-- <i class="i-icon-new i-buylottery"></i> -->
        <img class="img-icon" src="/static/images/icon_lottery.png" />
        <span class="span-left">购彩大厅</span>
      </div>
      <div
        v-if="showLongqueue"
        class="float-banner__button float-banner__button--primary i-icon-new i-suspend-bt"
        @click="onLongqueueClick"
      >
        <!-- <i class="i-longqueue"></i> -->
        <img class="img-icon" src="/static/images/icon_changlong.png" />
        <span class="span-left">长龙助手</span>
      </div>
      <!-- <div
        class="float-banner__button float-banner__button--green i-icon-new i-suspend-bt"
        @click="$router.push('/helpCenter/register')"
      >
        <i class="i-icon-new i-help-service"></i>
        

        <span class="span-left">帮助中心</span>
      </div> -->
    </div>
    <my-feed-back
      v-if="showFeedBack"
      :showFeedBack="showFeedBack"
      @close-my-feed-back="showFeedBack = false"
      @add-feed-back="showAddFeedBack = true"
    />
    <add-feed-back
      v-if="showAddFeedBack"
      :showAddFeedBack="showAddFeedBack"
      @close-add-feed-back="showAddFeedBack = false"
    />
  </div>
</template>

<script>
import suspend from "./suspend";
import Util from "@/utils/dom.js";
import dom from "@/utils/dom.js";
import QRCode from "@/utils/qrcode";
import myFeedBack from "@/components/myFeedBack.vue";
import addFeedBack from "@/components/addFeedBack.vue";

import { queryQrcodesAndServicer } from "@/api/cms";
import { getConfigList } from "@/utils/getSysConfig";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

export default {
  name: "FloatBanner",
  components: {
    suspend,
    myFeedBack,
    addFeedBack,
  },
  data() {
    return {
      uuid: window.uuid(),
      showBanner: true,
      offsetY: 0,
      enableScroll: true,
      leftOptions: {
        buttons: [],
      },
      rightOptions: {
        buttons: [],
      },
      // bannerLeftBg: '',
      bannerRightBg: "",
      showFeedBack: false,
      showAddFeedBack: false,
      showLeftBanner: false,
      showRightBanner: false,
    };
  },
  computed: {
    ...mapGetters(["user", "showSysDragon"]),
    isLogin() {
      return !!this.user.userId;
    },
    bannerLeftStyle() {
      return {
        transform: `translate(0, ${this.offsetY}px)`,
        // 'background-image': `url(${this.bannerLeftBg})`,
      };
    },
    bannerRightStyle() {
      return {
        transform: `translate(0, ${this.offsetY}px)`,
        //'background-image': `url(${this.bannerRightBg})`,
      };
    },
    qrcodes() {
      return this.$store.state.qrcodes || [];
    },
    androidId() {
      return `android-${this.uuid}`;
    },
    iosId() {
      return `ios-${this.uuid}`;
    },
    servicerQQ() {
      return `tencent://message/?exe=qq&menu=yes&Uin=${this.$store.state.servicer.qq}`;
    },
    onlineService() {
      return this.$store.state.servicer.url;
    },
    showLongqueue() {
      return hasPermission("longqueue") && this.showSysDragon;
    },
  },
  watch: {
    $route(to) {
      this.routeHandler(to.name);
    },
  },
  mounted() {
    this.routeHandler();
    this.queryQrcodesAndServicer();
    this.sysConfigHandler();
    window.addEventListener("scroll", this.scrollHandler, false);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    hasPermission,
    scrollHandler() {
      if (this.enableScroll) {
        this.enableScroll = false;
        if (this.scrollTimer) clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
          let scrollTop = dom.getScrollTop();
          if (scrollTop <= 180) {
            this.offsetY = 0;
          } else {
            this.offsetY = scrollTop;
          }
          this.enableScroll = true;
        }, 400);
      }
    },
    routeHandler(name) {
      name = name || this.$route.name;
      const hideArr = [
        "redPacket",
        "chatRoom",
        "feedbackActive",
        "lottery",
        "phone_buy",
      ];
      if (!this.showLongqueue) {
        hideArr.push("buyLottery");
      }
      if (hideArr.indexOf(name) !== -1) {
        this.showBanner = false;
      } else {
        this.showBanner = true;
      }
    },
    async queryQrcodesAndServicer() {
      const response = await queryQrcodesAndServicer();
      if (response.data.code !== 0) {
        return;
      }
      const data = response.data.data;
      this.$store.commit("getServicer", data.servicer);
      this.qrcodesHandler(data.qrcodes);
    },
    qrcodesHandler(data) {
      const arr = [];
      [this.iosId, this.androidId].forEach((id, index) => {
        new QRCode(id, data[index].targetUrl);
        const timer = setTimeout(() => {
          const img = document.getElementById(id).querySelector("img");
          if (img) {
            const value = img.getAttribute("src");
            if (value) {
              clearTimeout(timer);
              arr.push({
                img: value,
                icon: id === this.androidId ? "android" : "ios",
                url: data[index].targetUrl,
              });
              if (id === this.androidId) {
                this.$store.commit("getQrcodes", arr);
              }
            }
          }
        });
      });
    },
    async sysConfigHandler() {
      const sysConfig = await getConfigList();
      this.$store.commit("getConfigList", sysConfig);
      sysConfig.forEach((config) => {
        if (config.key === "TEST_PLAY_MONEY") {
          this.$store.commit("freePlay", config.value);
        }
        if (config.key === "LEFT_COUPLET_IMG") {
          // this.bannerLeftBg = config.value
          this.$nextTick(() => {
            this.showLeftBanner = true;
          });
        }
        if (config.key === "RIGHT_COUPLET_IMG") {
          // this.bannerRightBg = config.value
          this.$nextTick(() => {
            this.showRightBanner = true;
          });
        }
      });
    },
    openWin(name) {
      window.open(name, "_blank");
    },
    openQQ() {
      Util.openWin(this.servicerQQ);
    },
    openOnlineService() {
      const url = this.user.userCode
        ? this.onlineService + `?id=${this.user.userCode}`
        : this.onlineService;
      Util.openWin(url);
    },
    onFeedBackClick() {
      this.showFeedBack = true;
    },
    onLongqueueClick() {
      if (this.isLogin) {
        this.$store.commit("SET_APP_LONGQUEUE", true);
      } else if (this.$route.name === "buyLottery") {
        this.$store.commit("getShowLoginDialog", true);
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped lang="less">
/* icon */
.i-icon-new {
  background: #fff;
  border-radius: 3px;
  display: inline-block;
}
.float-banner {
  &__left,
  &__right {
    position: absolute;
    top: 165px;
    z-index: 105;

    min-height: 313px;
    color: #fff;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% 100%;
    transition: all 1.2s;
    text-align: center;

    padding-bottom: 14px;
  }
  &__left {
    left: 15px;
    width: 163px;
    height: 403px;
    padding-top: 147px;
    background-image: url("/static/images/left_bg.png");
  }
  &__right {
    right: 15px;
    width: 163px;
    height: 361px;
    padding-top: 144px;
    background-image: url("/static/images/right_bg.png");
  }
  &__close {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    bottom: 3px;
    left: 0;
    right: 0;
    box-shadow: 0, 0, 5px rgba(190, 19, 4, 0.58);
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    color: #be1304;
  }
  &__title {
    margin-bottom: 2px;
    text-align: center;
    font-size: 15px;
    font-weight: normal;
  }
  &__dsc {
    text-align: center;
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    i,
    span {
      vertical-align: top;
    }
  }
  &__rq {
    width: 80px;
    height: 80px;
    padding: 6px;
    background: #fff;
    margin: 0 auto 26px;
    position: relative;
    i {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 35px;
      padding: 2px;
      // background: #fff;
      border-radius: 2px;
    }
  }
  &__button {
    height: 27px;
    display: flex;
    top: 70px;
    margin: 10px auto;
    padding-left: 12px;
    align-items: center;
    cursor: pointer;
    .icon-yonghufankui {
      font-size: 20px;
    }
    &--primary {
      color: #3971ff;
    }
    &--green {
      color: #3971ff;
    }
    i {
      display: inline-block;
      margin-left: 5px;
      margin-right: 5px;
      height: 100%;
      text-align: center;
      line-height: 40px;
    }
    span {
      padding-bottom: 2px;
      padding-left: 4px;
    }
  }
}
.i-longqueue {
  background: url("~@/assets/images/longqueue/jd_changlong.png") no-repeat
    center top;
  background-size: contain;
  width: 30px;
  height: 40px;
  background-position-y: 4px;
}
.span-left {
  padding: 5px 4px;
}

.img-icon {
  width: 21px;
}
</style>
