<template>
  <div class="chat-private ">
    <div class="room-name-wp">
      <Icon type="ios-arrow-back" @click.native="onClose" />
      <div class="room-name">
        {{ $tex("您当前正在与 {name} 私聊", { name: privateUser.name }) }}
      </div>
    </div>
    <div class="chat-list nice-scroll" ref="chatList" id="privateList">
      <div
        class="more-message"
        v-if="isShowLoadMore"
        @click="handlerLoadMoreMessage"
      >
        {{ $tex("获取更多历史消息") }}
        <Icon
          v-if="chatIsLoadingMoreMessage"
          class="turn-round"
          type="loop"
        ></Icon>
      </div>
      <ul ref="chatListInner">
        <template v-for="item in chatList">
          <li
            class="chat-timeState"
            v-if="item && item.timeState"
            :key="item.messageUId"
          >
            <span>{{ item.timeState | formateDate }}</span>
          </li>
          <li
            class="chat-item"
            v-else-if="item && item.content.user"
            :id="`msg${item.messageUId}`"
            :class="[
              chatUser.uid == item.content.user.id ? 'chat-right' : 'chat-left',
              getChatItemClassByMessage(item),
            ]"
            :key="`chat-right-${item.messageUId}`"
          >
            <div class="u-img">
              <img
                class="img"
                :src="
                  (item.content.user && item.content.user.portrait) ||
                    (item.content.user && item.content.user.icon) ||
                    defHdImg
                "
                alt=""
              />
            </div>
            <div class="chat-info">
              <p class="chat-info-1">
                <img
                  class="userLevel"
                  :src="filterSendUserLevelIcon(item)"
                  alt=""
                />
                <span class="name">{{ item.content.user.name }} </span>
                <span class="time">{{ item.sentTime | formateDate }}</span>
              </p>
              <div
                :class="[
                  'chat-info-2',
                  valiRedPacketMessage(item) ? 'redPacketMessage' : '',
                ]"
                @contextmenu="rightClk(item, $event)"
              >
                <div class="chat-msg">
                  <component
                    :is="filterType(item)"
                    :message="item"
                    @on-fullImage="fullImage"
                    @on-get-redpacket="getRedPacket(item)"
                  ></component>
                  <span v-if="item.state == 0" class="msg-loading">
                    <span class="iconfont icon-loading"></span>
                  </span>
                  <span
                    v-if="item.state == 2"
                    :class="{ 'msg-fail': item.state == 2 }"
                  >
                    <span class="iconfont icon-warn"></span>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <scrollBottom
      :unReadCount="unReadCount"
      @on-scollToBottom="scroll2Bottom"
      v-show="showScrollBottom"
    ></scrollBottom>
    <chatBottom
      ref="chatBottom"
      v-model="msg"
      id="privateChatControl"
      @on-sendEmojiMessage="sendEmojiMessage"
      @on-sendImgMessage="sendImgMessage"
      @on-sendTextMessage="sendTextMessage"
      @on-sendRedPacketMessage="sendRedPacketMessage"
      @send-paste-img="receivePasteImg"
      :isCanSpeak="isCanSpeak"
    ></chatBottom>

    <!--  图片放大 -->
    <Modal v-model="showFullModal" class="fullScreen" width="800">
      <img
        :src="
          proxyImgUrl(
            currentMsg.content.imageUri || currentMsg.content.remoteUrl
          )
        "
        alt=""
    /></Modal>

    <!-- 发送粘切图片的弹框 -->
    <modal
      :modalShow="isShowPasteWp"
      :title="$tex('发送图片')"
      width="440"
      :hasHeader="true"
      claName="paste-img-wp"
      :okText="$tex('发送')"
      @btn-cancel="isShowPasteWp = false"
      @btn-ok="sendPasteImgMsg"
    >
      <div
        slot="content"
        class="section"
        :style="`background-image:url(${pasteImgUrl})`"
      ></div>
    </modal>
    <div class="chat-context-menu" v-show="showMenu" ref="contextMenu">
      <ul v-if="currentMsg.messageUId">
        <li
          v-if="canShowUserInfo && !isSelfMessage"
          @click="isShowUserInfo = true"
        >
          {{ $tex("查看用户资料") }}
        </li>
        <li
          @click="delMsg"
          v-show="
            isAdmin &&
              currentMsg.messageType != MessageObjectNames.HB &&
              currentMsg.messageType != MessageObjectNames.FOLLOW_ORDER &&
              isSelfMessage
          "
        >
          {{ $tex("撤回") }}
        </li>
      </ul>
    </div>
    <userInfo
      :current-msg="currentMsg"
      v-model="isShowUserInfo"
      :private-chat="true"
      :hit-rate="false"
    ></userInfo>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

import Util from "@/utils/utils";
import * as domEx from "@/utils/domEx";
import modal from "@/components/modal.vue";
import { UserTypes } from "@/constant/user";
import { MessageLocalStatus, MessageObjectNames } from "@/constant/rongyun";
import * as RongYun from "@/utils/rongyun";

import chatBottom from "./chatBottom";
import isEmpty from "lodash/isEmpty";
import textType from "../components/message-type/textType";
import imageType from "../components/message-type/imageType";
import emojiType from "../components/message-type/emojiType";
import gifType from "../components/message-type/gifType";
import voiceType from "../components/message-type/voiceType";
import redPacketType from "../components/message-type/redPacketType";
import scrollBottom from "../components/scrollBottom";
import userInfo from "../components/userInfo";

const GIF_Msg_TYPE = "TG:LotteryEmojiMessage";
const MAX_CHAT_LIST = 500;

export default {
  props: {
    chatUser: {},
  },
  components: {
    textType,
    imageType,
    emojiType,
    gifType,
    voiceType,
    redPacketType,
    chatBottom,
    scrollBottom,
    modal,
    userInfo,
  },
  data() {
    return {
      MessageObjectNames,
      chatListScrollListener: null,
      msg: "",
      defHdImg: "/static/images/chat/chat_def_hd.png",
      showFullModal: false,
      currentMsg: {
        content: {
          content: "",
          extra: {},
        },
      },
      unReadCount: 0,
      showScrollBottom: false,
      isShowLoadMore: true,
      oldMessageLen: 0,
      isShowPasteWp: false,
      pasteImgUrl: "",
      pasteImgBlob: "",
      showMenu: false,
      isShowUserInfo: false,
    };
  },
  computed: {
    ...mapGetters([
      "chatContactsList",
      "chatCurrentContact",
      "user",
      "chatIsLoadingMoreMessage",
      "chatPeopleData",
    ]),
    chatList() {
      return this.chatCurrentContact.msgList || [];
    },
    privateUser() {
      return this.chatCurrentContact.userInfo || {};
    },
    chatManagerList() {
      return this.chatContactsList.filter((item) => item.userInfo.isManager);
    },
    isCanPrivate() {
      return this.chatPeopleData.privateChat === "1";
    },
    isCanSpeak() {
      if (this.canSendMsg) {
        return true;
      }
      if (this.isManagerChat) {
        return true;
      }
      return this.user.userCode && this.isCanPrivate;
    },
    isManagerChat() {
      return this.privateUser.isManager;
    },
    canSendMsg() {
      return this.privateUser.canSendMsg;
    },
    isAdmin() {
      return this.chatPeopleData.isAdmin === "1";
    },
    isCustomerService() {
      return this.chatPeopleData.isCustomerService === "1";
    },
    isSelfMessage() {
      const currentMsg = this.currentMsg;
      return this.chatUser.uid === currentMsg.content.user.id;
    },
    canShowUserInfo() {
      const currentMsg = this.currentMsg;
      return (
        !isEmpty(currentMsg.content.user) &&
        this.user.userCode &&
        currentMsg.content.extra.loginState != "0" &&
        currentMsg.messageType !== MessageObjectNames.WELCOME &&
        currentMsg.messageType !== MessageObjectNames.JOIN_CHATROOM &&
        currentMsg.messageType !== MessageObjectNames.FOLLOW_LOTTERY &&
        (this.isCanPrivate || this.isAdmin)
      );
    },
  },
  watch: {
    privateUser(n, o) {
      if (n.id !== o.id) {
        this.$nextTick(() => {
          this.scroll2Bottom();
          this.isShowLoadMore = true;
          this.oldMessageLen = 0;
        });
      }
    },
    chatCurrentContact: {
      deep: true,
      handler(n, o) {
        if (n.msgList && n.msgList.length > this.oldMessageLen) {
          if (!this.chatIsLoadingMoreMessage) {
            this.oldMessageLen = n.msgList.length;
            RongYun.clearUnreadCount(this.privateUser.id);
          }
        }
      },
      immediate: true,
    },
    chatList: {
      deep: true,
      immediate: true,
      handler(messageList, oldMessageList) {
        if (messageList && messageList.length) {
          const message = messageList[messageList.length - 1];
          if (message.messageDirection === 1) {
            this.scrollHandler(message, true);
          } else {
            this.scrollHandler(message);
          }
        }
      },
    },
  },

  filters: {
    formateDate(value) {
      return RongYun.chatFormateDate(value);
    },
  },
  mounted() {
    console.log(this.chatList);
    this.chatListContaner = this.$refs.chatList;
    this.chatListContanerInner = this.$refs.chatListInner;
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
    this.chatListScrollListener = Util.debounce(async (e) => {
      this.showMenu = false;
      let scrollTop = this.chatListContaner.scrollTop;
      let clientHeight = this.chatListContaner.clientHeight;
      if (scrollTop + clientHeight >= this.chatListContaner.scrollHeight - 50) {
        // 已经到底部了
        this.unReadCount = 0;
        this.showScrollBottom = false;
      } else {
        this.showScrollBottom = true;
      }
    });
    this.chatListContaner.addEventListener(
      "scroll",
      this.chatListScrollListener
    );
  },
  beforeDestroy() {
    this.chatListContaner.removeEventListener(
      "scroll",
      this.chatListScrollListener
    );
  },
  methods: {
    ...mapMutations([
      "UPATE_CHAT_CONTACT_MESSAGE",
      "UPDATE_CHAT_MANAGER_MESSAGE",
      "SET_CHAT_SHOW_PRIVATE_WIN",
      "SET_CHAT_LOADING_MORE_MESSAGE",
      "REMOVE_CHAT_PRIVATE_MESSAGE",
    ]),
    ...mapActions(["addChatSendPrivateUsers", "loadMoreMessage"]),
    getChatItemClassByMessage(message) {
      switch (message.messageType) {
        case MessageObjectNames.WELCOME:
          return "chat-system";
        case MessageObjectNames.HB:
          return "chat-redpacket";
        case MessageObjectNames.FOLLOW_ORDER:
          return "chat-betting";
        case MessageObjectNames.EMOJI:
          return "chat-emoji";
        case RongIMLib.MessageType.GIF:
          return "chat-gif";
        case RongIMLib.MessageType.IMAGE:
          return "chat-image";
      }
    },
    proxyImgUrl(url) {
      const proxyUrl = "https://pic.tg9web.com";
      return location.href.indexOf("ryproxy=t") !== -1
        ? (url || "").replace(
            /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/im,
            `${proxyUrl}$3$4`
          )
        : url;
    },
    /*
     *  @dec 右键点击显示菜单
     */
    rightClk(item, event) {
      this.currentMsg = JSON.parse(JSON.stringify(item));
      if (!this.canShowUserInfo) {
        return;
      }
      const contextMenu = this.$refs.contextMenu;
      this.showMenu = true;
      this.$nextTick(() => {
        const menuHeight = parseFloat(domEx.getStyle(contextMenu, "height"));
        const clientHeight = domEx.getClientHeight();
        const bottomHeight = clientHeight - event.clientY;
        let top = event.clientY;
        if (bottomHeight < menuHeight) {
          const gap = menuHeight - bottomHeight;
          // top = event.clientY - gap;
          top = event.clientY;
        }
        let style = contextMenu.style;
        style.left = `${event.clientX}px`;
        style.top = `${top}px`;
      });
      event.preventDefault();
    },
    getRedPacket(item) {
      this.$refs.chatBottom.$refs.chatBottomTool.$refs.redPacket.getRedpacket(
        item
      );
    },
    /**
     * 接收粘切的图片
     */
    receivePasteImg({ blob, base64Url }) {
      this.pasteImgUrl = base64Url;
      this.pasteImgBlob = blob;
      this.isShowPasteWp = true;
    },
    /**
     * 发送粘切的图片
     */
    sendPasteImgMsg() {
      this.isShowPasteWp = false;

      const imgMessage = new RongYun.MessageManager.ImgMessage({
        content: this.pasteImgUrl,
        imageUri: this.pasteImgUrl,
      });
      imgMessage.state = MessageLocalStatus.LOADING;
      imgMessage.progress = "0%";
      imgMessage.sentTime = new Date().getTime();
      imgMessage.messageDirection = RongIMLib.MessageDirection.SEND;

      this.setMessageUserInfo(imgMessage);
      this.addChatSendPrivateUsers({
        message: imgMessage,
        toUser: this.privateUser,
      }); // 往列表里面插入数据

      const messageContent = imgMessage.content;
      const msgBody = Object.assign(
        { file: this.pasteImgBlob },
        messageContent
      );

      RongYun.MessageManager.sendImageMessage(
        {
          conversationType: RongIMLib.ConversationType.PRIVATE,
          targetId: this.privateUser.id,
        },
        msgBody,
        {
          onProgress(progress) {
            imgMessage.progress = progress >= 100 ? false : progress + "%";
          },
          onComplete(fileInfo) {
            imgMessage.content.imageUri = fileInfo.url;
          },
        }
      )
        .then((message) => {
          imgMessage.messageUId = message.messageUId;
          imgMessage.state = MessageLocalStatus.SUCCESS;
        })
        .catch(() => {
          imgMessage.progress = this.$tex("发送失败");
        });
    },
    filterSendUserLevelIcon(item) {
      let extra = item.content.extra;
      if (item.content.extra) {
        if (typeof extra == "string") {
          extra = JSON.parse(extra);
        }
        return extra.sendUserLevelIcon;
      } else {
        return "";
      }
    },
    valiRedPacketMessage(message) {
      const messageType = message.messageType;
      if (messageType === MessageObjectNames.HB) {
        return true;
      }
      return false;
    },
    async handlerLoadMoreMessage() {
      if (this.chatIsLoadingMoreMessage) {
        return;
      }
      if (this.chatList.length >= MAX_CHAT_LIST) {
        this.isShowLoadMore = false;
        return;
      }
      let firstDom = this.$refs.chatList.querySelectorAll("li")[0];

      const hasMore = await this.loadMoreMessage();
      if (!hasMore) {
        this.isShowLoadMore = false;
      }

      this.$nextTick(() => {
        this.scrollToTarget(firstDom);
      });
    },
    filterType(message) {
      let components = null;
      const messageType = message.messageType;
      switch (messageType) {
        case RongIMLib.MessageType.TEXT:
          components = textType;
          break;
        case RongIMLib.MessageType.IMAGE:
          components = imageType;
          break;
        case MessageObjectNames.EMOJI:
          components = emojiType;
          break;
        case RongIMLib.MessageType.GIF:
          components = gifType;
          break;
        case RongIMLib.MessageType.VOICE:
          components = voiceType;
          break;
        case MessageObjectNames.HB:
          components = redPacketType;
          break;
      }
      return components;
    },
    /**
     * 关闭私聊窗口
     */
    onClose() {
      this.SET_CHAT_SHOW_PRIVATE_WIN(false);
    },
    createObjectURL(blob) {
      return window[window.webkitURL ? "webkitURL" : "URL"]["createObjectURL"](
        blob
      );
    },
    /*
     *  @dec 发送gif消息
     */
    sendEmojiMessage(groupName, item) {
      const gifMessage = new RongYun.MessageManager.EmojiMessage({
        objectName: MessageObjectNames.EMOJI,
        content: this.$tex("发送Emoji消息"),
        extra: {
          type: "106",
          groupName: groupName,
          emojiName: item.src,
        },
      });
      gifMessage.sentTime = +new Date();
      gifMessage.messageDirection = RongIMLib.MessageDirection.SEND;
      this.sendIMMessage(gifMessage);
    },
    /**
     * 设置信息需要携带的用户信心
     */
    setMessageUserInfo(message) {
      const toUser = this.privateUser;
      const messageManager = RongYun.MessageManager.getInstance();
      messageManager.addMessageExData(message);
      const receiveUser = messageManager.getReceiveUser(
        toUser.id,
        toUser.name,
        toUser.portrait,
        toUser.sendUserLevelIcon
      );
      messageManager.setReceiveUser(message, receiveUser);
    },
    /**
     * @dec 发送图片
     */
    sendImgMessage(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgMessage = new RongYun.MessageManager.ImgMessage({
          content: Util.createObjectURL(file),
          imageUri: Util.createObjectURL(file),
        });
        imgMessage.state = MessageLocalStatus.LOADING;
        imgMessage.progress = "0%";
        imgMessage.sentTime = new Date().getTime();
        imgMessage.messageDirection = RongIMLib.MessageDirection.SEND;

        this.setMessageUserInfo(imgMessage);
        this.addChatSendPrivateUsers({
          message: imgMessage,
          toUser: this.privateUser,
        }); // 往列表里面插入数据

        const messageContent = imgMessage.content;
        const msgBody = Object.assign({ file }, messageContent);

        RongYun.MessageManager.sendImageMessage(
          {
            conversationType: RongIMLib.ConversationType.PRIVATE,
            targetId: this.privateUser.id,
          },
          msgBody,
          {
            onProgress(progress) {
              imgMessage.progress = progress >= 100 ? false : progress + "%";
            },
            onComplete(fileInfo) {
              imgMessage.content.imageUri = fileInfo.url;
            },
          }
        )
          .then((message) => {
            imgMessage.messageUId = message.messageUId;
            imgMessage.state = MessageLocalStatus.SUCCESS;
          })
          .catch(() => {
            imgMessage.progress = this.$tex("发送失败");
          });
      }
    },
    /*
     *  @dec 图片放大满屏展示
     */
    fullImage(message) {
      this.currentMsg = message;
      this.showFullModal = true;
    },
    /**
     * @dec 发送文字
     */
    sendTextMessage(msg) {
      if (msg) {
        let startReg = /^[\r\n]/g;
        let endReg = /[\r\n]$/g;
        while (startReg.test(msg) || endReg.test(msg)) {
          msg = msg.replace(startReg, "");
          msg = msg.replace(endReg, "");
        }
      }
      if (!msg) {
        this.msg = "";
        return;
      }
      this.msg = msg;
      const message = new RongYun.MessageManager.TextMessage({
        content: this.$xss(msg),
      });
      message.messageDirection = RongIMLib.MessageDirection.SEND;
      if (this.sendIMMessage(message)) {
        this.msg = "";
      }
    },
    sendRedPacketMessage(message) {
      const vm = this;
      const toUser = this.privateUser;
      message.sentTime = new Date().getTime();
      message.messageDirection = 1;
      this.setMessageUserInfo(message);
      this.$store.dispatch("sendMessage", {
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: toUser.id,
        message,
        options: {
          onSuccess: function(message) {
            vm.addChatSendPrivateUsers({ message, toUser }); // 往列表里面插入数据
            vm.UPATE_CHAT_CONTACT_MESSAGE({ message, toUser });
          },
          onError: function(errorCode) {},
        },
      });
    },
    /*
     *  @dec 真正发送信息
     */
    sendIMMessage(message, oldMessage = {}) {
      const toUser = this.privateUser;
      message.state = 0;
      this.setMessageUserInfo(message);
      message.sentTime = +new Date();
      if (
        message.messageType !== RongIMLib.MessageType.IMAGE &&
        message.messageType !== RongIMLib.MessageType.GIF
      ) {
        this.addChatSendPrivateUsers({ message, toUser }); // 往列表里面插入数据
      }
      this.$store.dispatch("sendMessage", {
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: this.privateUser.id,
        message,
        options: {
          onSuccess: (msg) => {
            message.state = 1;
            message.messageUId = msg.messageUId;
            if (message.messageType === RongIMLib.MessageType.IMAGE) {
              // 更新图片
              oldMessage.state = 1;
              message.state = 1;
            }
            this.UPATE_CHAT_CONTACT_MESSAGE({ message, toUser });
          },
          onError: function(errorCode) {
            message.state = 2;
            message.code = errorCode;
            oldMessage.state = 2;
            oldMessage.code = errorCode;
          },
        },
      });
      return true;
    },
    scrollToTarget(target) {
      let chatList = this.chatListContaner;
      if (chatList && target) {
        chatList.scrollTop = target.offsetTop - 56;
      }
    },
    /*
     *  @dec 删除消息
     */
    delMsg() {
      let vm = this;
      if (
        !this.canShowUserInfo ||
        vm.currentMsg.state === MessageLocalStatus.LOADING
      )
        return;
      let currentMsg = vm.currentMsg;
      const message = new RongYun.MessageManager.TextMessage({
        content: "",
        extra: {
          type: "100",
          messageUId: currentMsg.messageUId,
        },
      });
      RongYun.MessageManager.getInstance().addMessageExData(message);
      const receiveUser = RongYun.MessageManager.getInstance().getReceiveUser(
        this.privateUser.id,
        this.privateUser.name,
        this.privateUser.portrait,
        this.privateUser.sendUserLevelIcon
      );
      RongYun.MessageManager.getInstance().setReceiveUser(message, receiveUser);

      vm.$store.dispatch("sendMessage", {
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: vm.privateUser.id,
        message,
        options: {
          onSuccess: function(msg) {
            RongYun.deleteMessages(vm.privateUser.id, [
              {
                messageUId: currentMsg.messageUId,
                sentTime: currentMsg.sentTime,
                messageDirection: RongIMLib.MessageDirection.SEND,
              },
              {
                messageUId: msg.messageUId,
                sentTime: msg.sentTime,
                messageDirection: RongIMLib.MessageDirection.SEND,
              },
            ]);
            vm.REMOVE_CHAT_PRIVATE_MESSAGE({
              message: msg,
              toUser: vm.privateUser,
            }); // 往列表里面插入数据
          },
          onError: function(errorCode) {},
        },
      });
    },
    /*
     *  @dec 接收图片做加载处理
     */
    imageLoadHandle(id) {
      let vm = this;
      let image = document.querySelector("#img-" + id);
      if (!image) return;
      let reloadCount = 3;
      const backSrc = image.src;

      function load() {
        let imgCache = new Image();
        imgCache.src = backSrc;
        image.src = "/static/images/chat/load.gif";

        imgCache.onload = () => {
          image.src = imgCache.src;
          image.onerror = image.onload = () => {
            vm.$nextTick(() => {
              !vm.showScrollBottom && vm.scroll2Bottom();
            });
          };
        };
        imgCache.onerror = () => {
          if (reloadCount > 0) {
            reloadCount--;
            return load();
          }
          image.src = "/static/images/chat/load-fail.png";
          image.onerror = image.onload = () => {
            vm.$nextTick(() => {
              !vm.showScrollBottom && vm.scroll2Bottom();
            });
          };
        };
      }

      load();
    },
    is2ChatBottom() {
      const chatList = document.querySelector("#privateList");
      const scrollTop = chatList.scrollTop;
      const clientHeight = chatList.clientHeight;
      const scrollHeight = chatList.scrollHeight;
      console.log(scrollTop, clientHeight, scrollHeight);
      return scrollTop + clientHeight >= scrollHeight;
    },
    scroll2Bottom() {
      const chatList = document.querySelector("#privateList");
      chatList.scrollTop = chatList.scrollHeight;
      this.unReadCount = 0;
      this.showScrollBottom = false;
    },
    // 显示未读消息和滚动处理
    scrollHandler(message, jump2Bottom = false) {
      this.$nextTick(() => {
        const is2ChatBottom = this.is2ChatBottom();
        if (jump2Bottom || is2ChatBottom) {
          if (
            message.messageType === RongIMLib.MessageType.GIF ||
            message.messageType === RongIMLib.MessageType.IMAGE ||
            message.messageType === MessageObjectNames.EMOJI
          ) {
            this.imageLoadHandle(message.sentTime);
          }
          this.scroll2Bottom();
        } else {
          this.unReadCount++;
          this.showScrollBottom = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../chat.less";
.chat-private {
  position: absolute;
  z-index: 901;
  background-color: #fff;
  left: 0px;
  top: 0;
  bottom: 0;
  right: 1px;
  border-right: 1px solid #e3e3e3;
  display: flex;
  flex-direction: column;
}
.room-name-wp {
  position: relative;
  width: 100%;
  height: 46px;
  line-height: 46px;
  margin-left: 6px;
  text-align: center;
  border-bottom: 1px solid #ebebeb;
  .ivu-icon-ios-arrow-back {
    position: absolute;
    left: 10px;
    top: 10px;
    font-weight: 200;
    font-size: 30px;
    cursor: pointer;
  }
}
.chat-timeState {
  text-align: center;
  color: #999;
}
.paste-img-wp {
  .section {
    width: 408px;
    height: 300px;
    max-width: 408px;
    max-height: 300px;
    background-color: #fff;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.turn-round {
  animation: rotating 2s infinite linear;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
