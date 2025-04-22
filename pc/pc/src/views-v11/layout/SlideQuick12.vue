<template>
  <aside v-if="isShowRightAside" class="layout-right-aside">
    <div class="inner">
      <ul>
        <li v-if="showLongqueue" class="redEnvelope" @click="goRedPacket()">
          <div class="bg"><i></i></div>
          <span class="pack-title">{{ $tex("红包") }}</span>
        </li>
        <li v-if="showLongqueue" class="longqueue" @click="onLongqueueClick">
          <div class="bg"><i></i></div>
          <span class="pack-title">{{ $tex("长龙助手") }}</span>
        </li>
        <li
          v-if="$store.getters.sysSystemConfig.CHAT_SWITCH == '1'"
          class="download"
          @click="openChatRoom"
        >
          <div class="bg"><i></i></div>
          <span class="pack-title">{{ $tex("聊天室") }}</span>
        </li>
        <li class="Customer" @click="openService">
          <div class="bg"><i></i></div>
          <span class="pack-title">{{ $tex("在线客服") }}</span>
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
    <!-- 红包 -->
    <RedpactList
      :redPackDetail="redPackDetail"
      :showRedPacket.sync="showRedPacketList"
    ></RedpactList>
  </aside>
</template>

<script>
import Util from "@/utils/dom.js";
import myFeedBack from "@/components/myFeedBack.vue";
import addFeedBack from "@/components/addFeedBack.vue";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
// 红包
import RedpactList from "@/views/chatRoom/chatMain/components/RedpactList.vue";

export default {
  name: "SlideQuick",
  components: {
    addFeedBack,
    myFeedBack,
    RedpactList,
  },
  data() {
    return {
      isShowFeedBack: false, //是否显示我的反馈
      isShowAddFeedBack: false, //是否显示tianj
      showRedPacket: false, //红包
      showRedPacketList: false,
      redPackDetail: {},
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
        let url = null;
        if (this.$store.getters.sysPlatformFlag != "by336") {
          url = this.user.userCode
            ? this.serverUrl.url + `?id=${this.user.userCode}`
            : this.serverUrl.url;
        } else {
          // 336客服链接携带参数会报错
          url = this.serverUrl.url;
        }
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
    // 聊天室
    openChatRoom() {
      if (!this.user.userId) {
        this.$router.push("/login");
        return;
      }
      this.$router.push("/chatRoom");
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
    // 红包
    async goRedPacket(event) {
      // if (!this.showRedPacket) return;
      if (!this.user.userId) return this.$router.push("/login");
      const systemConfig = await this.$store.dispatch("querySystemConfig");
      const { pcRelativeUrl } = systemConfig;
      if (systemConfig["activityType"] == "01" /* && this.packetKey == "2" */) {
        this.onShowRecket();
      } else {
        if (!this.user.userId) {
          this.$Modal.confirm({
            title: this.$tex("抢红包"),
            content: `<p>${this.$tex("您还未登入！去登录？")}</p>`,
            onOk: () => {
              if (this.pageTemplate.index === 5) {
                return setTimeout(() => {
                  this.$store.commit("setTplv5LoginBoxVisible", true);
                });
              }
              this.$router.push("/login");
            },
          });
          return;
        } else if (this.user.userType === "09") {
          this.$Message.info("试玩账号没有权限");
          return;
        }
        if (pcRelativeUrl) {
          if (/(http|https):\/\/([\w.]+\/?)\S*/.test(pcRelativeUrl)) {
            this.activityUrl = pcRelativeUrl;
          } else {
            this.activityUrl = "/#" + pcRelativeUrl;
          }
        }
        console.log(this.activityUrl);
        window.open(this.activityUrl, "_blank");
      }
    },
    onShowRecket() {
      this.queryRecketList().then((data) => {
        if (data.unclaimedRedpacketRsp.length) this.showRedPacketList = true;
        else this.$Message.info(this.$tex("暂无红包"));
      });
    },
    queryRecketList() {
      const clostLoading = this.$Message.loading({
        content: `${this.$tex("加载中")}...`,
        duration: 0,
      });
      let roomId = "";
      if (this.$route.name === "home") {
        roomId = "1";
      } else {
        roomId = this.$store.state.chatRoomId;
      }
      return this.$http
        .post(
          "/api/v2/user/queryUnclaimedRedpacket",
          { userId: this.user.userId, roomId: roomId },
          { unenc: true }
        )
        .then((response) => {
          clostLoading();
          if (response.data.code !== 0) return;
          return (this.redPackDetail = response.data.data);
        });
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
  //   .redEnvelope {
  //   }
  ul {
    width: 50px;
    // border-radius: 10px;

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    // overflow: hidden;
    margin: 0 6px;
    li {
      position: relative;
      &:hover {
        .pack-title {
          opacity: 1;
        }
      }
      div {
        height: 50px;
        padding: 6px 0;
        position: relative;
        //   background-image: linear-gradient(0deg, #e6ebfe 0%, #f7f9ff 100%);
        border: 1px solid #eee;
        box-shadow: 0 0 15px 0 rgba(107, 168, 220, 0.1), inset 0 0 6px 0 #ebf2fb;
        //   border-radius: 8px;
        // margin: 1px 0;
        text-align: center;
        background: #fff;
        margin: 0 0 6px;
      }
      .pack-title,
      .aides-title,
      .chat-title,
      .Customer-title {
        position: absolute;
        top: 8px;
        right: 50px;
        width: 75px;
        line-height: 30px;
        padding: 0 10px;
        opacity: 0;
        text-align: right;
        background: linear-gradient(90deg, #fff, #ddd);
        transition: all 0.3s;
        transform: translateX(0);
      }
      .aides-title {
        top: 60px;
      }
      .chat-title {
        top: 115px;
      }
      .Customer-title {
        top: 165px;
      }
      &:hover {
        cursor: pointer;
        background-image: linear-gradient(45deg, #205cff 0%, #3bece4 100%);
        // color: #ffffff;

        i,
        img {
          filter: brightness(10000%);
        }
      }
      .bg {
        padding: 10px 20px 0;
        margin-bottom: 2px;
      }
      i {
        display: block;
        width: 30px;
        height: 32px;
        // background-image: url("~@/assets/images-v3/index/zaixianhehu.png");
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.help {
        i {
          width: 32px;
          background-image: url("~@/assets/images-v3/index/helpcenter.png");
        }
      }
      &.redEnvelope {
        .bg {
          //   background-image: url("~@/assets/images-v3/index/appxiazai.png");
          background: url("~@/assets/images-v11/sf1.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
      }
      &.download {
        .bg {
          //   background-image: url("~@/assets/images-v3/index/appxiazai.png");
          background: url("~@/assets/images-v11/sf4.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
        &:hover {
          .chat-title {
            opacity: 1;
          }
        }
        i {
          //   background-image: url("~@/assets/images-v3/index/appxiazai.png");
        }
      }
      &.qq-service {
        i {
          background-image: url("~@/assets/images-v3/index/qqservice.png");
        }
      }
      &.longqueue {
        .bg {
          background: url("~@/assets/images-v11/sf3.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
        &:hover {
          .aides-title {
            opacity: 1;
          }
        }
        // background-position: 5px;
        i {
          //   background-image: url("~@/assets/images/longqueue/yl_changlong.png");
        }
      }
      &.Customer {
        .bg {
          background: url("~@/assets/images-v11/sf5.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
        &:hover {
          .Customer-title {
            opacity: 1;
          }
        }
        i {
          //   background-image: url("~@/assets/images/longqueue/yl_changlong.png");
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
