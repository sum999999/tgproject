<template>
  <div class="head-fast-nav">
    <ul class="clearfix">
      <li v-if="user.userCode" :class="{ 'red-circle': hasNews }">
        <span @click.stop="goPerCenter">{{ $tex("会员中心") }}</span>
      </li>
      <li v-if="arrowFree">
        <span @click.stop="freePlay">{{ $tex("免费试玩") }}</span>
      </li>
      <li>
        <span @click.stop="addCollect">{{ $tex("加入收藏") }}</span>
      </li>
      <li>
        <span @click.stop="goHelpCenter">{{ $tex("帮助中心") }}</span>
      </li>
      <li v-if="isShowGamePlay">
        <span @click.stop="gameRule">{{ $tex("游戏玩法") }}</span>
      </li>
      <li class="on-line-ser-wp">
        <div class="online-service" @click.stop="openCusService">
          <i v-if="isShowSerIcon" class="iconfont icon-zxkf"></i>
          <span>{{ $tex("在线客服") }}</span>
        </div>
      </li>
      <li v-if="isShowChangeTheme" @click.stop="switchTheme">
        <span>更换主题</span>
        <Icon type="android-arrow-dropdown" />
      </li>
      <li
        v-show="businesses !== 'by313'"
        class="hot-line-phone"
        v-if="isShowHotPhone && hotPhone"
      >
        <i class="i-icon i-telephone2"></i>
        <span>{{ hotPhone }}</span>
      </li>
    </ul>
    <!-- 免费试玩谈框 -->
    <try-play :isShowTryPlay="isShowPlay" @close-try-play="closeTryPlay">
    </try-play>
    <!-- 免费试玩前的确认 -->
    <confirm-free-play
      :isShowDialog="confirmDialog"
      @hand-confirm="handConfirm"
      @hand-clear="handForClear"
    />
    <!-- 更换主题 -->
    <change-theme
      :isShowThemeList="isShowThemeList"
      @close-theme-dialog="closeThemeDialog"
    />
  </div>
</template>

<script>
import tryPlay from "@/components/tryPlay.vue";
import changeTheme from "@/components/changeTheme.vue";
import confirmFreePlay from "@/components/confirmFreePlay.vue";
import Util from "@/utils/dom.js";
export default {
  props: {
    arrowFree: {
      //是否显示试玩菜单
      type: Boolean,
      default: true,
    },
    isShowChangeTheme: {
      //是否显示客服列表
      type: Boolean,
      default: true,
    },
    isShowSerIcon: {
      //是否显示客服图标
      type: Boolean,
      default: true,
    },
    isShowGamePlay: {
      //是否显示游戏玩法
      type: Boolean,
      default: true,
    },
    isShowHotPhone: {
      //是否显示游戏玩法
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hasNews: false,
      hotPhone: configText.hotPhone,
      confirmDialog: false,
      isShowPlay: false,
      isShowThemeList: false,
      businesses: "",
    };
  },
  components: {
    changeTheme,
    tryPlay,
    confirmFreePlay,
  },
  watch: {
    user(n, o) {
      if (n.userId && !o.userId) {
        this.hasNewInformation();
      }
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    serverUrl() {
      return this.$store.state.servicer;
    },
  },
  created() {
    if (this.$store.state.user.userId) {
      this.hasNewInformation();
    }
    this.businessNber();
  },
  methods: {
    // 商户标识
    async businessNber() {
      const { PLATFORM_FLAG } = await this.$store.dispatch("querySystemConfig");
      this.businesses = PLATFORM_FLAG;
    },
    // 是否有新消息
    hasNewInformation() {
      this.$http
        .post("/api/v2/user/isqueryUserMessage", "", {
          userId: true,
          unenc: true,
        })
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          if (
            (data.isEssayConut || data.isUserCount) &&
            this.$route.name !== "personalCenter"
          ) {
            //暂未考虑游戏信息
            let totalCount =
              data.isEssayConut + data.isGameCount + data.isUserCount;
            if (totalCount > 0) {
              this.hasNews = true;
            } else {
              this.hasNews = false;
            }
          }
        });
    },
    /**
     * 关闭主题弹框
     */
    closeThemeDialog() {
      this.isShowThemeList = false;
    },
    /**
     * 打开切换主题
     */
    switchTheme() {
      this.isShowThemeList = true;
    },
    /**
     * 去个人中心
     */
    goPerCenter() {
      if (this.hasNews) {
        this.hasNews = false;
      }
      this.$router.push({
        name: "personalCenter",
        params: { id: "account" },
      });
    },
    /**
     * 免费试玩
     */
    freePlay() {
      const { userType } = this.user;
      if (userType) {
        if (userType === "09") {
          this.$Message.info("正在使用试玩账号");
        } else {
          this.confirmDialog = true;
        }
      } else {
        this.isShowPlay = true;
      }
    },

    /**
     * 取消要试玩
     */
    handForClear() {
      this.confirmDialog = false;
    },
    /**
     * 确定要试玩
     */
    handConfirm() {
      this.confirmDialog = false;
      this.signOut();
      this.isShowPlay = true;
    },
    /**
     * 关闭试玩弹框
     */
    closeTryPlay() {
      this.isShowPlay = false;
    },
    /**
     * 去帮助中心
     */
    goHelpCenter() {
      this.$router.push("/helpCenter/register");
    },
    /**
     * 去游戏玩法
     */
    gameRule() {
      this.$router.push("/role/3");
    },

    /**
     * 打开在线客服
     */
    openCusService() {
      if (this.serverUrl) {
        const url = this.user.userCode
          ? this.serverUrl.url + `?id=${this.user.userCode}`
          : this.serverUrl.url;
        Util.openWin(url);
      }
    },
    /**
     * 加入收藏
     */
    addCollect() {
      this.$Modal.info({
        title: this.$tex("加入收藏"),
        content: this.$tex("请按Ctrl+D加入收藏"),
        onOk: () => {},
      });
    },
    /**
     * 退出登陆
     */
    signOut() {
      let vm = this;
      this.$http
        .post("/api/v2/user/loginOut", "", { userId: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          vm.$store.commit("getUser", "");
          localStorage.setItem("user", "");
          if (this.$route.name === "personalCenter");
          this.$router.push("/");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.head-fast-nav {
  ul {
    font-size: 0;
  }
  li {
    float: left;
    height: 14px;
    line-height: 14px;
    padding: 0 10px;
    color: #7f7f7f;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
    &:not(:last-child) {
      border-right: 1px solid #7f7f7f;
    }
    &:last-child {
      padding-right: 0;
    }
    &.hot-line-phone:hover {
      cursor: initial;
    }
    &.red-circle {
      position: relative;
      &:before {
        display: block;
        position: absolute;
        content: "";
        width: 12px;
        height: 12px;
        right: 3px;
        top: -5px;
        border-radius: 50%;
        transform: scale(0.5);
        background-color: #be1204;
      }
    }
    .online-service {
      width: 100%;
      height: 20px;
      line-height: 16px;
      margin-top: -3px;
      color: #fff;
      padding: 2px 5px;
      border-radius: 5px;
      text-align: center;
    }
    .icon-zxkf {
      font-size: 12px;
    }
    .i-telephone2 {
      width: 16px;
      height: 17px;
      background-image: url(/static/images/icon.png);
      background-position: -169px -46px;
      background-repeat: no-repeat;
      vertical-align: middle;
    }
  }
}
</style>
