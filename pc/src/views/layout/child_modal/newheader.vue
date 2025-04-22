<template>
  <div class="home-header">
    <!-- 顶部栏菜单 -->
    <head-menu :arrowFree="arrowFree != '0'" v-show="$route.name !== 'game'" />
    <lottery-head></lottery-head>
    <div class="nav" :style="{ background: themeColorList.primaryColorHover }">
      <div class="content">
        <!-- <p>
        </p> -->
        <img :src="imgUrl" alt="" />
        <div>
          <router-link to="/home"><span>首页</span></router-link>
          <router-link to="/lottery"><span>购彩大厅</span></router-link>
          <router-link
            :to="
              $route.name === 'game' && $route.params.id
                ? `/game/${$route.params.id}`
                : '/game/SLOT'
            "
            ><span>游戏中心 </span>
          </router-link>
          <router-link to="/active"><span>活动中心</span></router-link>
          <router-link to="/chatRoom"><span>聊天室</span></router-link>
          <router-link to="/phoneBuy"><span>手机购彩</span></router-link>
          <router-link to="/helpCenter/register"
            ><span>帮助指南</span></router-link
          >
        </div>
      </div>
    </div>
    <game-category v-show="$route.name === 'game'" />
  </div>
</template>

<script>
import headMenu from "./header/headMenu";
import lotteryHead from "./lottery_head";
import { mapGetters } from "vuex";
import gameCategory from "@/views/game/gameCategory.vue";
export default {
  components: {
    headMenu,
    lotteryHead,
    gameCategory,
  },
  data() {
    return {
      imgUrl: "/configstatic/pc/images/logo.gif",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["themeColorList"]),
    serverUrl() {
      return this.$store.state.servicer;
    },
    userInfo() {
      return this.$store.state.user;
    },
    // 免费试玩
    arrowFree() {
      return this.$store.getters.sysSystemConfig.ALLOW_PLAY_FOR_FREE;
    },
  },
  mounted() {
    const key = this.$store.getters.sysPlatformFlag;
    if (key == "tgdemo") {
      this.imgUrl = "/configstatic/pc/images/logo_B.gif";
    }
  },
  methods: {
    signOut() {
      let vm = this;
      if (this.loginOutStatus) return;
      this.loginOutStatus = true;
      this.$http
        .post("/api/v2/user/loginOut", "", { userId: true })
        .then((response) => {
          this.loginOutStatus = false;
          if (response.data.code !== 0) return;
          vm.$store.commit("getUser", "");
          localStorage.setItem("user", "");
          if (this.$route.name === "personalCenter") this.$router.push("/");
        });
    },
    login(flag) {
      this.$store.commit("getShouldLogin", true);
    },
    openService(url) {
      //打开客服
      // Util.openWin(url);
    },
    goRegister() {
      this.$router.push({
        name: "register",
      });
    },
  },
  created() {},
};
</script>
<style lang="less">
.home-header {
  .home-top {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    line-height: 30px;
    .left {
      span {
        color: #dc3b40;
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      span {
        padding: 0 5px;
      }
      span:hover {
        color: #dc3b40;
        cursor: pointer;
      }
      span + span {
        border-left: 1px solid rgb(112, 112, 112);
      }
      div {
        width: 100px;
        height: 30px;
        background: url(/configstatic/pc/images/zxkf.png) no-repeat center;
        cursor: pointer;
      }
    }
  }
  .nav {
    height: 70px;
    background: #1f6efe;
    box-shadow: 0 -2px 18px rgba(0, 0, 0, 0.24);

    .content {
      display: flex;
      height: 70px;
      justify-content: space-between;
      align-items: center;
      img {
        width: 150px;
        height: 65px;
        // background: url(/configstatic/pc/images/logo.png) no-repeat center;
        // background-size: 100% 100%;
      }
      a {
        color: #fff;
      }
      span:hover {
        color: #fedf50;
      }
      .router-link-active span {
        color: #fedf50;
      }
      a {
        font-size: 16px;
        padding: 0 20px;
      }
      a + a {
        border-left: 1px solid #e96163;
      }
    }
  }
}
</style>
