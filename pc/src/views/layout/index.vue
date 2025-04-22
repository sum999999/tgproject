<template>
  <div class="laycol">
    <vue-qr
      v-show="false"
      :text="iosTargetUrl"
      :margin="0"
      :callback="onIosQRCodeCallBack"
    ></vue-qr>
    <vue-qr
      v-show="false"
      :text="androidTargetUrl"
      :margin="0"
      :callback="onAndroidQRCodeCallBack"
    ></vue-qr>
    <BackTop></BackTop>
    <!-- 接收消息的提示声 -->
    <audio ref="recePriMsgAudio" preload="true">
      <source src="~@/assets/voices/sms-received.mp3" type="audio/mpeg" />
      <source src="~@/assets/voices/sms-received.ogg" type="audio/ogg" />
      {{ $tex("您的浏览器不支持audio标签") }}
    </audio>
    <component
      :is="view"
      :show-head="showHead"
      :show-footer="showFooter"
    ></component>
    <switchTemplate></switchTemplate>
    <!-- 输入房间密码的弹框 -->
    <modal
      :modalShow="roomPwdDialogInfo.isShow"
      title="请输入房间密码"
      :width="260"
      :hasFooter="true"
      @btn-ok="subRoomId"
      @btn-cancel="closeRoomPwdDialog"
      claName="rooms-modal"
    >
      <div slot="content" class="pwd-wp">
        <div class="pwd-ipt">
          <pure-pwd-input
            ref="pwdIpt"
            :maxLength="6"
            type="password"
            @send-pwd="getRoomPwd"
          ></pure-pwd-input>
        </div>
        <div class="error-tip">
          <span v-show="roomPwdFlag === 0">密码不能为空</span>
          <span v-show="roomPwdFlag === 1">请输入六位数字</span>
          <span v-show="roomPwdFlag === 2">密码只能是数字</span>
        </div>
      </div>
      showDiffLoginDialog
    </modal>
    <!-- 异地登录弹框 -->
    <diffLogin :showDiffLoginDialog="showDiffLoginDialog"></diffLogin>

    <!-- 即时通信 -->
    <socket v-if="$route.name !== 'chatRoom'"></socket>

    <modal
      :modalShow="isClosePie"
      :width="416"
      :hasFooter="true"
      :hasNoBtn="false"
      claName="pie-modal"
      @btn-ok="$store.commit('getClosePie', false)"
    >
      <div slot="content">
        <p class="title">{{ $tex("撤单提示") }}</p>
        <div class="content">
          <Icon type="close-circled"></Icon>
          <span>{{ $tex("该记录已封盘不能撤销") }}</span>
        </div>
      </div>
    </modal>

    <!-- 红包 -->
    <div
      @click="goRedPacket()"
      :data="activityUrl"
      class="red-packet"
      ref="redPacket"
      v-show="showRedPacket"
    >
      <img :src="activityImg" />
    </div>

    <RedpactList
      v-if="showRedPacket"
      :redPackDetail="redPackDetail"
      :showRedPacket.sync="showRedPacketList"
    ></RedpactList>
    <component :is="popupNoticeView" v-show="isShowNotice"></component>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

const layout = () =>
  import(/* webpackChunkName: "layout" */ "@/views/layout/layout");
const layout2 = () =>
  import(/* webpackChunkName: "layout2" */ "@/views-v2/layout/layout");
const layout3 = () =>
  import(/* webpackChunkName: "layout3" */ "@/views-v3/layout/layout");
const layout4 = () =>
  import(/* webpackChunkName: "layout4" */ "@/views-v4/layout/layout");
const layout5 = () =>
  import(/* webpackChunkName: "layout5" */ "@/views-v5/layout/layout");
const layout6 = () =>
  import(/* webpackChunkName: "layout6" */ "@/views-v6/layout/layout");
const layout7 = layout3;
const layout8 = () =>
  import(/* webpackChunkName: "layout8" */ "@/views-v8/layout/layout");
const layout9 = layout8;
const layout10 = () =>
  import(/* webpackChunkName: "layout10" */ "@/views-v10/layout/layout");
const layout11 = () =>
  import(/* webpackChunkName: "layout10" */ "@/views-v11/layout/layout");

const popupNotice = () =>
  import(
    /* webpackChunkName: "popupNotice" */ "@/views/layout/child_modal/popupNotice"
  );
const popupNotice2 = () =>
  import(
    /* webpackChunkName: "popupNotice2" */ "@/views-v2/layout/popupNotice"
  );
const popupNotice3 = () =>
  import(
    /* webpackChunkName: "popupNotice3" */ "@/views-v3/layout/popupNotice"
  );
const popupNotice4 = () =>
  import(
    /* webpackChunkName: "popupNotice4" */ "@/views-v4/layout/popupNotice"
  );
const popupNotice5 = () =>
  import(
    /* webpackChunkName: "popupNotice5" */ "@/views-v5/layout/popupNotice"
  );
const popupNotice6 = () =>
  import(
    /* webpackChunkName: "popupNotice6" */ "@/views-v6/layout/popupNotice"
  );
const popupNotice7 = popupNotice3;
const popupNotice8 = () =>
  import(
    /* webpackChunkName: "popupNotice8" */ "@/views-v8/layout/popupNotice"
  );
const popupNotice9 = popupNotice8;
const popupNotice10 = () =>
  import(
    /* webpackChunkName: "popupNotice10" */ "@/views-v10/layout/popupNotice"
  );
const popupNotice11 = popupNotice;

import RedpactList from "@/views/chatRoom/chatMain/components/RedpactList.vue";
import diffLogin from "@/components/diffLogin.vue";
import purePwdInput from "@/components/purePwdInput.vue";
import encryption from "@/utils/md5";
import modal from "@/components/modal";

import socket from "./child_modal/socket.vue";
import switchTemplate from "./child_modal/switchTemplate.vue";
import * as RongYun from "@/utils/rongyun";
import isEmpty from "lodash/isEmpty";
import VueQr from "vue-qr";
import { queryQrcodesAndServicer } from "@/api/cms";

export default {
  components: {
    layout,
    layout2,
    layout3,
    layout4,
    layout5,
    layout6,
    layout7,
    layout8,
    layout9,
    layout10,
    layout11,
    socket,
    modal,
    diffLogin,
    purePwdInput,
    RedpactList,
    switchTemplate,
    popupNotice,
    popupNotice2,
    popupNotice3,
    popupNotice4,
    popupNotice5,
    popupNotice6,
    popupNotice7,
    popupNotice8,
    popupNotice9,
    popupNotice10,
    popupNotice11,
    VueQr,
  },
  data() {
    return {
      showRedPacket: false,
      showRedPacketList: false,
      isShowRoomPwdModal: false, //是否显示房间密码弹框
      packetKey: "",
      activityImg: "", // 活动图片
      activityUrl: "", // 活动地址
      redPackDetail: {},
      roomPwdFlag: -1,
      roomRwd: "", //房间密码
      isShowNotice: false,
      hasClickSubMitPwd: false, //是否点击了提交房间密码
      privateMsgAudio: null,
      priMsgTimer: "", //
      msgUId: "", //当前消息的uid
      hisInfo: {}, //单个私聊消息方的信息
      iosTargetUrl: "",
      androidTargetUrl: "",
      showHead: true,
      showFooter: true,
    };
  },
  computed: {
    ...mapGetters([
      "pageTemplate",
      "isShowSinglePrivateMsgNotice",
      "isOpenPrivateMsgNoticeSwitch",
      "user",
      "chatPushMemberMsg",
    ]),
    version() {
      return this.pageTemplate.index || "";
    },
    view() {
      let verseion = this.pageTemplate.index || "";
      return "layout" + this.version;
    },
    popupNoticeView() {
      return "popupNotice" + this.version;
    },
    user() {
      //删除投注详情订单提示
      return this.$store.state.user;
    },
    isClosePie() {
      //删除投注详情订单提示
      return this.$store.state.isClosePie;
    },
    showDiffLoginDialog() {
      //是否提示异地登录异常
      // console.log();
      return this.$store.state.diffPlaceLogin;
    }, //异地登录异常弹框
    roomPwdDialogInfo() {
      //进入聊天室相关的信息
      return this.$store.state.roomPwdDialogInfo;
    },
  },
  watch: {
    chatPushMemberMsg(message) {
      if (isEmpty(message)) {
        return;
      }
      const messageUId = message.messageUId;
      const extra = RongYun.MessageManager.getInstance().getExtraByMessage(
        message
      );
      const { userId, title } = extra;
      if (this.user.userId !== userId) {
        return;
      }
      this.$NoticeSelf.open({
        name: messageUId,
        title: this.$tex(`推送消息`),
        desc: extra.message,
        duration: 4,
        okText: this.$tex("查看"),
        onSuccess: () => {
          this.$router.push("/personalCenter/information");
          this.$store.commit("SET_CHAT_PUSH_MEMBER_MSG", null);
        },
        onClose: () => {
          this.$store.commit("SET_CHAT_PUSH_MEMBER_MSG", null);
        },
      });
    },
    $route(n) {
      this.routeStatus(n.name);
      const hash = window.location.href;
      let startIndex = hash.indexOf("=");
      if (n.path == "/register" && startIndex > -1) {
        // 每次携带exp都刷新重新获取
        window.location.reload();
        // this.obtainExp();
      }
    },
    isShowSinglePrivateMsgNotice(value) {
      const { name } = this.$route;
      const { isShowNotice, hisInfo, messageUId } = value;
      if (this.msgUId === messageUId) {
        //同一消息不执行
        return;
      }
      this.msgUId = messageUId;
      this.hisInfo = hisInfo;
      if (hisInfo.user && hisInfo.user.senderUserId === this.user.userId) {
        return;
      }
      let flag =
        isShowNotice &&
        name !== "chatRoom" &&
        this.isOpenPrivateMsgNoticeSwitch;
      this.priMsgTimer && clearTimeout(this.priMsgTimer);
      if (flag) {
        this.setPlayMsgVoice();
        this.$NoticeSelf.open({
          name: messageUId,
          title: this.$tex(`您有一条私聊信息！`),
          duration: 4,
          okText: this.$tex("查看"),
          onSuccess: () => {
            this.$NoticeSelf.close(messageUId);
            this.closePrivateMsgDialog();
            window.open(
              `#/chatroom?private2userId=${hisInfo.user.senderUserId}`,
              "_blank"
            );
          },
          onClose: () => {
            this.closePrivateMsgDialog();
          },
        });
      }
      return flag;
    },
  },
  created() {
    this.obtainExp();
    this.routeStatus(this.$route.name);
    this.handleQrcodesAndServicer();
    this.initSysConfig();
  },
  mounted() {
    this.privateMsgAudio = this.$refs.recePriMsgAudio;
  },
  methods: {
    ...mapMutations(["SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE"]),
    onIosQRCodeCallBack(dataUrl) {
      this.$store.commit("getQrcode", {
        icon: "ios",
        img: dataUrl,
        url: this.iosTargetUrl,
      });
    },
    onAndroidQRCodeCallBack(dataUrl) {
      this.$store.commit("getQrcode", {
        icon: "android",
        img: dataUrl,
        url: this.androidTargetUrl,
      });
    },
    handleQrcodesAndServicer() {
      queryQrcodesAndServicer().then((response) => {
        if (response.data.code !== 0) {
          return;
        }
        const data = response.data.data;
        this.$store.commit("getServicer", data.servicer);
        const iosData = data.qrcodes.find((qrcode) => {
          return qrcode.type === 21;
        });
        if (iosData) {
          this.iosTargetUrl = iosData.targetUrl;
        }
        const androidData = data.qrcodes.find((qrcode) => {
          return qrcode.type === 22;
        });
        if (androidData) {
          this.androidTargetUrl = androidData.targetUrl;
        }
        document.title = data.servicer.name;
      });
    },
    initSysConfig() {
      this.$store.dispatch("querySystemConfig").then((res) => {
        const {
          YI_DUN_VAILD_CONFIG,
          pcUrl,
          pcRelativeUrl,
          activityPcImg,
          RED_PACKET_SWITCH,
        } = res;
        if (YI_DUN_VAILD_CONFIG) {
          this.productNumber = JSON.parse(YI_DUN_VAILD_CONFIG).productNumber;
          this.initWatchman();
        }
        if (pcRelativeUrl) {
          if (/(http|https):\/\/([\w.]+\/?)\S*/.test(pcRelativeUrl)) {
            this.activityUrl = pcRelativeUrl;
          } else {
            this.activityUrl = "/#" + pcRelativeUrl;
          }
        }
        if (activityPcImg) {
          this.activityImg = activityPcImg;
        }
        if (RED_PACKET_SWITCH) {
          this.packetKey = RED_PACKET_SWITCH;
          this.judgeShowPacket(this.$route.name);
        }
      });
    },
    /**
     * @desc 打开/关闭 切换播放声音提示
     */
    setPlayMsgVoice() {
      if (!this.privateMsgAudio) return;
      const nopromise = {
        catch: new Function(),
      };
      (this.privateMsgAudio.play() || nopromise).catch(function() {});
    },
    /**
     * @desc 关闭私聊消息通知
     */
    closePrivateMsgDialog() {
      this.SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE({
        hisInfo: {},
        isShowNotice: false,
      });
    },
    /**
     * 关闭房间密码弹框
     */
    closeRoomPwdDialog() {
      this.roomPwdFlag = -1;
      this.$refs["pwdIpt"].clearPwd();
      this.$store.commit("getRoomPwdDialogInfo", { isShow: false });
    },
    /**
     * 获取房间密码
     */
    getRoomPwd(roomPwd) {
      this.roomPwd = roomPwd;
    },
    cancelBetting() {
      //取消进入投注页
      this.$store.commit("getShowLoginDialog", false);
    },
    okBetting() {
      this.$store.commit("getShowLoginDialog", false);
      this.$router.push("/login");
    },
    async goRedPacket(event) {
      if (!this.showRedPacket) return;
      const systemConfig = await this.$store.dispatch("querySystemConfig");
      if (systemConfig["activityType"] == "01" && this.packetKey == "2") {
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
        const index = window.location.href.indexOf("#");
        const redUrl = window.location.href.slice(0, index - 1);
        // console.log(redUrl + this.activityUrl, "window", window.location);
        window.open(redUrl + this.activityUrl, "_blank");
      }
    },
    routeStatus(name) {
      this.judgeShowPacket(name);
      this.headAndFooterShow(name);
    },
    headAndFooterShow(name) {
      if (
        name === "buyLottery" ||
        name === "redPacket" ||
        name === "chatRoom" ||
        name === "feedbackActive"
      ) {
        this.showHead = false;
        this.showFooter = false;
      } else if (name === "lottery") {
        this.showHead = true;
        this.showFooter = false;
      } else {
        this.showHead = true;
        this.showFooter = true;
      }
    },
    judgeShowPacket(name) {
      this.isShowNotice = name == "home";
      if (
        [
          "home",
          "phone_buy",
          "active",
          "notice",
          "trend",
          "notice_detail",
        ].indexOf(name) > -1 &&
        this.packetKey !== "0" &&
        this.packetKey !== "3"
      ) {
        this.showRedPacket = true;
        this.$nextTick(() => {
          if (this.$refs.redPacket) {
            this.$refs.redPacket.style.opacity = 1;
          }
        });
      } else {
        this.showRedPacket = false;
      }
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
    onShowRecket() {
      this.queryRecketList().then((data) => {
        if (data.unclaimedRedpacketRsp.length) this.showRedPacketList = true;
        else this.$Message.info(this.$tex("暂无红包"));
      });
    },
    /**
     * 提交输入房间密码
     */
    subRoomId() {
      if (!this.roomPwd) {
        this.roomPwdFlag = 0;
        return;
      } else if (this.roomPwd.length < 6) {
        this.roomPwdFlag = 1;
        return;
      } else if (this.roomPwd.length === 6 && !/^\d{6}$/.test(this.roomPwd)) {
        this.roomPwdFlag = 2;
        return;
      }
      if (this.hasClickSubMitPwd) return;
      this.hasClickSubMitPwd = true;
      let encryPwd = encryption.encrypt.md5(this.roomPwd);
      let userId = this.user.userId || "";
      let obj = {
        roomId: this.roomPwdDialogInfo.roomId,
        password: encryPwd,
        userId,
      };

      this.$http
        .post("/api/v2/chat/checkChatRoomPassword", obj, { unenc: false })
        .then((res) => {
          this.hasClickSubMitPwd = false;
          this.roomPwdFlag = -1;
          this.$refs["pwdIpt"].clearPwd();
          if (res.data.code !== 0) {
            return;
          }
          this.$store.commit("getRoomPwdDialogInfo", { isShow: false });
          localStorage.setItem("isOtherToChatRoom", true);
          // this.$router.push("/chatRoom");
          const { href } = this.$router.resolve({
            name: "chatRoom",
            path: "/chatRoom",
          });
          window.open(href, "_blank");
        });
    },
    //初始化防作弊SDK实例
    initWatchman() {
      let vm = this;
      if (initWatchman && typeof initWatchman === "function") {
        //by xiaojiji 4.4
        initWatchman({
          productNumber: this.productNumber,
          onload: function(instance) {
            vm.$store.commit("getWmInstance", instance);
          },
          onerror: function(error) {
            console.log("易盾错误,再发起两次请求" + error);
            if (vm.initWmCount > 2) {
              vm.initWmCount = 0;
              return;
            }
            vm.initWatchman();
            vm.initWmCount++;
          },
        });
      }
    },
    // 获取exp
    obtainExp() {
      let { ttpaste = null, exp } = this.$route.query;
      if (ttpaste && !sessionStorage.getItem("ttpaste")) {
        sessionStorage.setItem("ttpaste", ttpaste);
      }
      if (exp) {
        sessionStorage.setItem(
          "exp",
          JSON.stringify({ value: exp, time: new Date().getTime() })
        );
        console.log("exp", sessionStorage.getItem("exp"));
      }
    },
  },
};
</script>

<style lang="less" scoped>
.laycol {
  // background: linear-gradient(80deg, #4c8bfe26, #4c8bfe26, #4c8bfe26);
}
.red-packet {
  position: fixed;
  bottom: 75px;
  // right: 20px;
  left: 10px;
  cursor: pointer;
  opacity: 0;
  transition: all 1s eas-in-out;
  // z-index: 3;
  z-index: 200;
  img {
    max-height: 150px;
    width: auto;
  }
  .close {
    position: absolute;
    left: 0;
    top: 0;
    /*       color: #be1204; */
    font-size: 14px;
    cursor: pointer;
  }
}
.footer {
  background: #f2f2f2;
  padding: 15px 0;
}
</style>
<style lang="less">
.v-transfer-dom {
  .pie-modal {
    .ivu-modal-header {
      height: 0 !important;
      padding: 0;
      span {
        display: none;
      }
    }
    .ivu-modal-body {
      p {
        &.title {
          font-weight: bold;
        }
      }
      .content {
        position: relative;
        padding: 22px 0 0 48px;
        margin-top: 6px;
        font-size: 12px;
        i {
          position: absolute;
          left: 0;
          top: 10px;
          color: #ed3f14;
          font-size: 36px;
        }
      }
    }
    .ivu-modal-footer {
      text-align: right;
      button {
        width: 60px !important;
        height: 36px !important;
      }
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
      /*   color:#be1204; */
      font-size: 12px;
      line-height: 20px;
    }
    .ivu-modal-footer {
      padding: 0 40px 22px;
      font-size: 0;
    }
  }
}
</style>
