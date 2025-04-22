<template>
  <div>
    <div class="dcp" v-show="isShowCurPage">
      <chatHeader />
      <div class="index-body clearfix" :class="{ hideLeft: !isShowChatLeft }">
        <chatLeft ref="indexLeft" />
        <!--中间聊天室标题 当isHiddenBets符合条件时active收缩功能隐藏-->
        <div
          class="chat-room-title"
          :class="{ active: !isShowChatLeft, 'title-witch': isHiddenBets }"
          v-if="isShowChatMain"
        >
          <room-title
            ref="roomTitle"
            :currRoom="currRoom"
            @show-room-pwd-dialog="onPwdRoomEnter"
            @no-pwd-enter-room="onNoPwdRoomEntry"
            :showLeft="isShowChatLeft"
          ></room-title>
        </div>
        <i
          v-if="!isHiddenBets"
          class="turn iconfont"
          :class="[isShowChatLeft ? 'icon-left2' : 'icon-right2']"
          @click="isShowChatLeft = !isShowChatLeft"
        ></i>
        <!-- isHiddenBets控制聊天框宽 并隐藏右侧投注 -->
        <chatMain
          :class="{
            chatMain: isHiddenBets,
          }"
          v-if="isShowChatMain"
          :currRoomInfo="currRoom"
          @change-room-info="switchCurrRoom"
          @change-chat-room-user="changeChatRoomUser"
          ref="mainChatRoom"
        >
        </chatMain>
        <!-- 聊天室右侧投注 -->
        <chatRight v-if="!isHiddenBets" />
        <!-- 更多房间 -->
        <div class="more-rooms" :class="{ active: isShowMoreRoom }"></div>
      </div>
      <!-- 异地登录弹框 -->
      <diffLogin
        :showDiffLoginDialog="showDiffLoginDialog"
        :serveUrl="serviceUrl"
      >
      </diffLogin>
      <!-- 房间密码弹框 -->
      <modal
        :modalShow="isShowRoomPwdModal"
        :title="$tex('请输入房间密码')"
        :width="260"
        :hasFooter="true"
        @btn-ok="subRoomId"
        @btn-cancel="onRoomPwdDlgCancel"
        claName="rooms-modal"
      >
        <div slot="content" class="pwd-wp">
          <div class="pwd-ipt">
            <pure-pwd-input
              ref="pwdIpt"
              :maxLength="6"
              type="password"
              @send-pwd="setRoomPwd"
            ></pure-pwd-input>
          </div>
          <div class="error-tip">
            <span v-show="pwdFlag === 0">{{ $tex("密码不能为空") }}</span>
            <span v-show="pwdFlag === 1">{{ $tex("请输入六位数字") }}</span>
            <span v-show="pwdFlag === 2">{{ $tex("密码只能是数字") }}</span>
          </div>
        </div>
      </modal>
    </div>
    <Spin size="large" fix v-if="!isShowCurPage"></Spin>
  </div>
</template>

<script>
import diffLogin from "@/components/diffLogin.vue";
import modal from "@/components/modal.vue";
import purePwdInput from "@/components/purePwdInput.vue";
import encryption from "@/utils/md5";
import roomsMixin from "@/mixins/roomsMixin";
import {
  checkChatRoomPassword,
  queryChatRooms,
  queryCheckChatRoomPwd,
} from "@/api/chat";
import { queryQrcodesAndServicer } from "@/api/cms";

import chatLeft from "./chatLeft";
import chatRight from "./chatRight";
import chatMain from "./chatMain";
import chatHeader from "./chatHeader";
import roomTitle from "./roomTitle";

export default {
  name: "chatRoom",
  mixins: [roomsMixin],
  data() {
    return {
      isShowCurPage: false,
      isShowChatLeft: true,
      serviceUrl: "",
      isShowMoreRoom: false,
      isShowRoomPwdModal: false,
      roomPwd: "", //房间密码,
      pwdFlag: -1, //判输入密码的格式，0空，1不合法
      isAwaitRoomPwdSubmit: false,
      isShowChatMain: false, //是否显示聊天室内容
      backTimer: null,
      currRoom: {}, //当前房间信息，传到chat.vue和roomTitle.vue
      curRoomTmpCache: {}, // 临时存储的当前房间信息，用于验证房间密码后使用
      // 隐藏投注盘口
      hiddenBets: [],
    };
  },
  computed: {
    showDiffLoginDialog() {
      //是否提示异地登录异常
      return this.$store.state.diffPlaceLogin;
    }, //异地登录异常弹框
    user() {
      return this.$store.state.user;
    },
    isHiddenBets() {
      return this.hiddenBets.includes(this.$store.getters.sysPlatformFlag);
    },
  },
  components: {
    chatHeader,
    chatMain,
    chatLeft,
    chatRight,
    diffLogin,
    modal,
    purePwdInput,
    roomTitle,
  },
  beforeDestroy() {
    this.backTimer && clearTimeout(this.backTimer);
  },
  created() {
    const isOtherToChatRoom = localStorage.getItem("isOtherToChatRoom"); //从其它地方进到聊天室不需要再次输入房间密码等判断
    this.handleChatRoomUserStatus("", isOtherToChatRoom);
  },
  methods: {
    switchCurrRoom({ ryChatRoomId }) {
      //传到roomTitle中，在加入聊天室成功后切换房间
      this.$refs["roomTitle"].switchRoom(ryChatRoomId);
    },
    /**
     * 不显示密码进来
     */
    onNoPwdRoomEntry(roomInfo) {
      this.currRoom = roomInfo;
    },
    /**
     * 显示密码框
     */
    onPwdRoomEnter(roomInfo) {
      this.showRoomPwdDlg();
      this.curRoomTmpCache = roomInfo;
    },
    /**
     * 获取房间密码
     */
    setRoomPwd(pwd) {
      this.roomPwd = pwd;
    },
    clearRoomPwd() {
      this.roomPwd = "";
      this.$refs["pwdIpt"].clearPwd();
    },
    showRoomPwdDlg() {
      this.isShowRoomPwdModal = true;
    },
    hideRoomPwdDlg() {
      this.isShowRoomPwdModal = false;
    },
    showChatMain() {
      this.isShowChatMain = true;
    },
    hideChatMain() {
      this.isShowChatMain = false;
    },
    getChatMainVisible() {
      return this.isShowChatMain;
    },
    onRoomPwdDlgCancel() {
      this.hideRoomPwdDlg();
      this.clearRoomPwd();
      this.hideRoomPwdErrorTips();
      if (!this.getChatMainVisible()) {
        clearTimeout(this.backTimer);
        this.backTimer = setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      }
    },
    /**
     * 判断密码是否合规
     */
    validateRoomPwdRule() {
      if (!this.roomPwd) {
        this.pwdFlag = 0;
        return false;
      } else if (this.roomPwd.length < 6) {
        this.pwdFlag = 1;
        return false;
      } else if (this.roomPwd.length === 6 && !/^\d{6}$/.test(this.roomPwd)) {
        this.pwdFlag = 2;
        return false;
      }
      return true;
    },
    hideRoomPwdErrorTips() {
      this.pwdFlag = -1;
    },
    /**
     * 检查房间密码
     */
    checkRoomPwd(roomId, pwd) {
      const encryPwd = encryption.encrypt.md5(pwd);
      const userId = this.user.userId || "";
      return checkChatRoomPassword({ roomId, password: encryPwd, userId });
    },
    /**
     * 提交房间密码
     */
    async subRoomId() {
      if (!this.validateRoomPwdRule()) return;
      if (this.isAwaitRoomPwdSubmit) return;
      this.isAwaitRoomPwdSubmit = true;
      const res = await this.checkRoomPwd(
        this.curRoomTmpCache.roomId,
        this.roomPwd
      );
      this.isAwaitRoomPwdSubmit = false;
      this.hideRoomPwdErrorTips();
      this.clearRoomPwd();
      if (res.data.code !== 0) return;
      this.subRoomIdSuccessHandler();
    },
    subRoomIdSuccessHandler() {
      this.hideRoomPwdDlg();
      this.clearRoomPwd();
      this.showChatMain();
      this.currRoom = JSON.parse(JSON.stringify(this.curRoomTmpCache));
    },
    async setServiceUrl() {
      //获取服务Url
      const response = await queryQrcodesAndServicer();
      if (response.data.code !== 0) return;
      this.serviceUrl = response.data.data.servicer.url;
    },
    //登录或者退出房间重新更新聊天室状态
    changeChatRoomUser({ roomNo, roomId }) {
      let name = "";
      if (roomId !== "1") {
        //非系统房
        name = roomNo;
      }
      this.handleChatRoomUserStatus(name, false);
    },
    saveRoomId2Store(roomId) {
      this.$store.commit("SET_CHATROOM_ID", roomId);
    },
    //进入聊天室、退出和登陆修改聊天室状态
    async handleChatRoomUserStatus(roomNo, isOtherToChatRoom) {
      const res = await queryChatRooms({
        current: 1,
        roomNo: roomNo,
        size: 1,
        userId: this.user.userId ? this.user.userId : "",
      });
      if (res.data.code !== 0) return;
      let data = res.data.data;
      const { speakStatus } = data;
      if (speakStatus === "3") {
        this.$store.commit(
          "setSysModalText",
          this.$tex("您当前无法进入此聊天室,请联系管理员！")
        );
        this.$router.push("/");
      } else {
        this.isShowCurPage = true;
      }
      let chocieRoom = data.systemChatRooms.length
        ? data.systemChatRooms[0]
        : data.chatRooms[0];
      let systemChatRooms = chocieRoom;
      let {
        bankLevel,
        openLevel,
        passwordLevel,
        roomPassword,
        roomId,
        roomName,
        banSpeakTime,
      } = systemChatRooms;
      this.saveRoomId2Store(roomId);
      this.currRoom = systemChatRooms;
      if (isOtherToChatRoom) {
        // 其它地方进来的不需要进一步验证了
        this.currRoom.isBand = this.hasJoinRoomAuto(bankLevel);
        this.currRoom.banSpeakTime = banSpeakTime;
        this.showChatMain();
        if (!this.user.userCode) {
          this.setServiceUrl();
        }
        return;
      }
      // 1.等级达标的计算
      let hasOpenRight = this.hasJoinRoomAuto(openLevel);
      if (!hasOpenRight) {
        //如果等级达标等级
        this.hideChatMain();
        this.$Message.error(this.$tex("用户等级不够不能进入聊天室"));
        this.backTimer = setTimeout(() => {
          this.$router.push("/");
        }, 3000);
        return;
      }
      if (roomPassword) {
        //有密码要求的话
        if (this.hasJoinRoomAuto(passwordLevel)) {
          let userNeedPwd = false;
          this.saveRoomId2Store(roomId);
          if (this.user.userId) {
            const res = await queryCheckChatRoomPwd({ roomId: roomId });
            const { data, code } = res.data;
            if (code === 0) {
              if (data.result) {
                userNeedPwd = true;
              }
            }
          }
          if (userNeedPwd) {
            //需要输入密码
            this.hideChatMain();
            this.curRoomTmpCache = systemChatRooms;
            this.showRoomPwdDlg();
            this.currRoom.isBand = this.hasJoinRoomAuto(bankLevel);
            this.currRoom.banSpeakTime = banSpeakTime;
            return;
          }
        }
      }
      //等级达标不需要密码
      this.currRoom.isBand = this.hasJoinRoomAuto(bankLevel);
      this.currRoom.banSpeakTime = banSpeakTime;
      if (this.getChatMainVisible()) return; //登录和退出直接返回
      this.showChatMain();
    },
  },
};
</script>

<style scoped lang="less">
.index-body {
  height: 100%;
  margin-top: -60px;
  padding-top: 60px;
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  width: 100%;
  right: 0;
  padding-left: 260px;
  padding-right: 450px;
  transition: padding 0.2s linear;
  background-color: #fff;

  .chat-room-title {
    min-width: 300px;
    width: calc(100vw - 710px);
    height: 46px;
    position: absolute;
    left: 260px;
    top: 60px;
    z-index: 900;
    background-color: #fff;

    &.active {
      width: calc(100vw - 450px);
      left: 0;
    }
    &.title-witch {
      width: calc(100vw - 270px);
    }
  }
  .chatMain {
    width: calc(100vw - 260px);
  }

  .turn {
    position: absolute;
    left: 260px;
    top: 50%;
    margin-top: -20px;
    z-index: 1000;
    cursor: pointer;
    font-weight: bold;
    transition: left 0.2s linear;

    &:hover {
      color: #000;
    }
  }
}
</style>
<style lang="less">
@imgSrc: "../../assets/images/chat";
.index-body {
  &.hideLeft {
    padding-left: 0;

    .index-left {
      width: 0;
      height: 0;
    }

    .turn {
      left: 0;
    }
  }
}

.dcp img {
  width: auto;
  float: none;
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
