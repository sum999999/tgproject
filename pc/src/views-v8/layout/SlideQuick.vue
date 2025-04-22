<template>
  <aside v-if="isShowRightAside" class="layout-right-aside">
    <div class="inner">
      <ul>
        <li class="service" @click="openService">
          <div class="bg"><i></i></div>
          <span>{{ $tex("在线客服") }}</span>
        </li>
        <li
          v-if="!$configText.hideAsideHelpCenter"
          class="help"
          @click="openHelpCenter"
        >
          <div class="bg"><i></i></div>
          <span>{{ $tex("帮助中心") }}</span>
        </li>
        <li class="download" @click="openDownLoadApp">
          <div class="bg"><i></i></div>
          <span>{{ $tex("APP下载") }}</span>
        </li>
        <li
          v-if="serverUrl && serverUrl.qq"
          class="qq-service"
          @click="openQqService"
        >
          <div class="bg"><i></i></div>
          <span>{{ $tex("QQ客服") }}</span>
        </li>
        <li class="sugg-feed" @click="showFeedBack">
          <div class="bg">
            <img
              :src="
                $configText.feedbackImg
                  ? '/configstatic/pc/images/feedback.png'
                  : require('@/assets/images-v3/index/yjfk.png')
              "
              alt=""
            />
          </div>

          <span>{{
            $configText.feedbackText
              ? $tex($configText.feedbackText)
              : $tex("意见反馈")
          }}</span>
        </li>
        <li v-if="servicerBBM" class="bbm-service">
          <a :href="servicerBBM" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>bbm</span>
        </li>
        <li v-if="servicerFaceBook" class="facebook-service">
          <a :href="servicerFaceBook" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>facebook</span>
        </li>
        <li v-if="servicerInstagram" class="instagram-service">
          <a :href="servicerInstagram" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>Instagram</span>
        </li>
        <li v-if="servicerLine" class="line-service">
          <a :href="servicerLine" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>Line</span>
        </li>
        <li v-if="servicerShareChat" class="shareChat-service">
          <a :href="servicerShareChat" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>ShareChat</span>
        </li>
        <li v-if="servicerSkype" class="skype-service">
          <a :href="servicerSkype" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>Skype</span>
        </li>
        <li v-if="servicerWhatsApp" class="whatsApp-service">
          <a :href="servicerWhatsApp" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>whatsapp</span>
        </li>
        <li v-if="servicerZalo" class="zalo-service">
          <a :href="servicerZalo" target="_blank">
            <div class="bg"><i></i></div>
          </a>
          <span>zalo</span>
        </li>
        <li v-if="showLongqueue" class="longqueue" @click="onLongqueueClick">
          <div class="bg"><i></i></div>
          <span>{{ $tex("长龙助手") }}</span>
        </li>
      </ul>
    </div>
    <!-- 我的反馈 -->
    <div v-if="isShowFeedBack">
      <my-feed-back
        :showFeedBack="isShowFeedBack"
        @close-my-feed-back="closeMyFeedBack"
        className="v3-home-feed-back"
        @add-feed-back="addFeedBack"
      />
    </div>
    <!-- 添加反馈 -->
    <div v-if="isShowAddFeedBack">
      <add-feed-back
        :showAddFeedBack="isShowAddFeedBack"
        className="v3-home-add-feed-back"
        @close-add-feed-back="isShowAddFeedBack = false"
      />
    </div>
  </aside>
</template>

<script>
import Util from "@/utils/dom.js";
import myFeedBack from "@/components/myFeedBack.vue";
import addFeedBack from "@/components/addFeedBack.vue";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

export default {
  name: "SlideQuick",
  components: {
    addFeedBack,
    myFeedBack,
  },
  data() {
    return {
      isShowFeedBack: false, //是否显示我的反馈
      isShowAddFeedBack: false, //是否显示tianj
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "servicerBBM",
      "servicerFaceBook",
      "servicerInstagram",
      "servicerLine",
      "servicerShareChat",
      "servicerSkype",
      "servicerWhatsApp",
      "servicerZalo",
      "showSysDragon",
      "isLogin",
    ]),
    isShowRightAside() {
      const path = this.$route.path;
      return (
        !path.includes("lottery") &&
        !path.includes("redPacket") &&
        !path.includes("chatRoom")
      );
    },
    serverUrl() {
      if (!this.$store.state.servicer) {
        return;
      }
      return this.$store.state.servicer;
    },
    showLongqueue() {
      return hasPermission("longqueue") && this.showSysDragon;
    },
  },
  methods: {
    hasPermission,
    openService() {
      if (this.serverUrl) {
        const url = this.user.userCode
          ? this.serverUrl.url + `?id=${this.user.userCode}`
          : this.serverUrl.url;
        Util.openWin(url);
      }
    },
    openHelpCenter() {
      this.$router.push("/helpCenter/register");
    },
    openDownLoadApp() {
      this.$router.push("/phoneBuy");
    },
    openQqService() {
      Util.openWin(
        `tencent://message/?exe=qq&menu=yes&Uin=${this.serverUrl.qq}`
      );
    },
    showFeedBack() {
      if (this.$configText.feedbackUrl) {
        return window.open(this.$configText.feedbackUrl, "_blank");
      }
      if (!this.user.userId) {
        this.$router.push("/login");
        return;
      }
      this.isShowFeedBack = true;
    },
    closeMyFeedBack() {
      this.isShowFeedBack = false;
    },
    addFeedBack() {
      this.closeMyFeedBack();
      setTimeout(() => {
        this.isShowAddFeedBack = true;
      }, 1000);
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

<style lang="less" scoped>
.layout-right-aside {
  position: fixed;
  top: 210px;
  right: 0;
  font-size: 12px;
  z-index: 5;
  ul {
    width: 70px;
    border-radius: 10px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    overflow: hidden;
    li {
      padding: 6px 0;
      background: @button-change-color-three;
      text-align: center;
      &:hover {
        cursor: pointer;
        background: @button-hover-change-color;
      }
      .bg {
        padding: 10px 20px 0;
        margin-bottom: 2px;
      }
      i {
        display: block;
        width: 30px;
        height: 32px;
        background-image: url("~@/assets/images-v3/index/zaixianhehu.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.help {
        i {
          width: 32px;
          background-image: url("~@/assets/images-v3/index/helpcenter.png");
        }
      }
      &.download {
        i {
          background-image: url("~@/assets/images-v3/index/appxiazai.png");
        }
      }
      &.qq-service {
        i {
          background-image: url("~@/assets/images-v3/index/qqservice.png");
        }
      }
      &.longqueue {
        i {
          background-image: url("~@/assets/images/longqueue/yl_changlong.png");
        }
      }
      &.sugg-feed {
        img {
          width: 32px;
          float: none;
          height: 32px;
        }
        i {
          width: 35px;
          background-image: url("/configstatic/pc/images/feedback.png");
        }
      }
      &.bbm-service {
        i {
          background-image: url("~@/assets/images-v3/contact/bbm.png");
        }
      }
      &.facebook-service {
        i {
          background-image: url("~@/assets/images-v3/contact/facebook.png");
        }
      }
      &.instagram-service {
        i {
          background-image: url("~@/assets/images-v3/contact/Instagram.png");
        }
      }
      &.line-service {
        i {
          background-image: url("~@/assets/images-v3/contact/Line.png");
        }
      }
      &.shareChat-service {
        i {
          background-image: url("~@/assets/images-v3/contact/ShareChat.png");
        }
      }
      &.skype-service {
        i {
          background-image: url("~@/assets/images-v3/contact/Skype.png");
        }
      }
      &.whatsApp-service {
        i {
          background-image: url("~@/assets/images-v3/contact/whatsapp.png");
        }
      }
      &.zalo-service {
        i {
          background-image: url("~@/assets/images-v3/contact/zalo.png");
        }
      }
    }
  }
}
</style>
