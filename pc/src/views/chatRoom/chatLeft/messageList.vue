<template>
  <div class="fill-height">
    <div class="contact-tab">
      <span
        :class="{ selected: curTabIndex === index }"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="swichTab(index)"
        >{{ tab.name }}</span
      >
    </div>

    <div id="frendslist-wap">
      <div v-if="curTabIndex === 0" id="frendslist" class="nice-scroll">
        <ul class="user-list">
          <!-- 系统房间 begin -->
          <itemList
            v-if="chatContactRoomInfo.room"
            key="sys_1111"
            :class="{ selected: !chatShowPrivateWin }"
            :portrait="chatGroupImg"
            :name="$tex('多人聊天群')"
            :text="filterMessageText(null, 0, chatContactRoomInfo.lastMessage)"
            :unreadMessageCount="chatContactRoomInfo.unreadMessageCount"
            :showDelBtn="false"
            @click.native="showSysRoom"
          ></itemList>
          <!-- 系统房间 end -->
          <template v-for="(item, index) in chatContactsList">
            <itemList
              v-if="item.lastMessage"
              :key="item.userInfo.id"
              :class="{ selected: isActive(item) }"
              :portrait="item.userInfo.portrait"
              :name="item.userInfo.name"
              :sendUserLevelIcon="item.userInfo.sendUserLevelIcon"
              :text="filterMessageText(index, 0)"
              :unreadMessageCount="item.unreadMessageCount"
              @click.native="onOpenPrivateWin(index, 0)"
              @on-delete="onDeleteContact(index)"
            ></itemList>
          </template>
        </ul>
      </div>
      <div v-if="curTabIndex === 1" id="kflist" class="nice-scroll">
        <ul class="user-list" v-if="managerList.length">
          <itemList
            v-for="(item, index) in managerList"
            :key="item.userInfo.id"
            :class="{ selected: isActive(item) }"
            :portrait="item.userInfo.portrait"
            :name="item.userInfo.name"
            text=""
            :showDelBtn="false"
            :unreadMessageCount="item.unreadMessageCount"
            @click.native="onOpenPrivateWin(index, 1)"
          ></itemList>
        </ul>
        <div v-else class="ui-empty">{{ $tex("暂无数据") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import itemList from "./itemList";
import * as RongYun from "@/utils/rongyun";
import { MessageObjectNames } from "@/constant/rongyun";

export default {
  components: { itemList },
  data() {
    return {
      tabs: [
        { name: this.$tex("消息") },
        { name: `${this.$tex("客服")}/${this.$tex("管理员")}` },
      ],
      curTabIndex: 0,
      chatGroupImg: require(`@/assets/images/chat/chat_group.png`),
      managerList: [],
      webName: configText.main,
      watchPrivate2UserFlag: true,
    };
  },
  computed: {
    ...mapGetters([
      "chatMessageUlist",
      "chatContactsList",
      "chatRyConnectSuccess",
      "chatCurrentContact",
      "chatContactRoomInfo",
      "chatShowPrivateWin",
      "user",
      "chatCurrentRoom",
    ]),
  },
  watch: {
    chatContactsList: {
      handler(value, oldValue) {
        if (this.watchPrivate2UserFlag) {
          const { private2userId } = this.$route.query;
          if (private2userId) {
            for (const index in value) {
              if (value.hasOwnProperty(index)) {
                const { userInfo = {} } = value[index];
                const { id } = userInfo || {};
                if (id === private2userId) {
                  this.onOpenPrivateWin(index, 0);
                  this.watchPrivate2UserFlag = false;
                }
              }
            }
          }
        }
      },
      deep: true,
    },
    chatCurrentRoom: {
      handler(n, o = {}) {
        if (n.roomId !== o.roomId) {
          this.queryChatCustComerService(n.roomId);
        }
      },
      deep: true,
      immediate: true,
    },
    chatRyConnectSuccess(n) {
      if (n) {
        this.getConversationList();
      }
    },

    user(n, o) {
      if (n.userCode !== o.userCode) {
        this.IS_CONTACTS_JOIN_SUCCESS(false);
        this.SET_CHAT_CONTACTS_LIST([]);
        this.SET_CHAT_SHOW_PRIVATE_WIN(false);
        this.SET_CHAT_CURRENT_CONTACT({});
      }
    },
  },
  created() {},
  methods: {
    ...mapMutations([
      "IS_CONTACTS_JOIN_SUCCESS",
      "SET_CHAT_SHOW_PRIVATE_WIN",
      "SET_CHAT_CONTACT_ROOMINFO",
      "DEL_CHAT_CONTACT",
      "SET_CHAT_CONTACTS_LIST",
      "ADD_CHAT_CONTACT",
      "SET_CHAT_CURRENT_CONTACT",
    ]),
    ...mapActions([
      "addConversationList",
      "setChatCurrentContact",
      "setConversationRoom",
      "removeChatConversation",
    ]),
    filterName(name) {
      return RongYun.FeatureEx.hideUserCode(name);
    },
    filterMessageText(index, type, lastMessage) {
      let message = lastMessage;
      if (!lastMessage) {
        if (type === 0) {
          message = this.chatContactsList[index].lastMessage;
        } else {
          message = this.managerList[index].lastMessage;
        }
      }
      let text;
      if (!message || !message.content) {
        return `${this.$tex("暂无消息")}~`;
      }
      let messageType = message.messageType;
      switch (messageType) {
        case MessageObjectNames.WELCOME:
        case RongIMLib.MessageType.TEXT:
          text = RongYun.emoji.emojiToHTML(this.$xss(message.content.content));
          break;
        case RongIMLib.MessageType.IMAGE:
          text = `【${this.$tex("图片")}】`;
          break;
        case RongIMLib.MessageType.GIF:
          text = `【${this.$tex("图片")}】`;
          break;
        case MessageObjectNames.EMOJI:
          text = `【${this.$tex("表情")}】`;
          break;
        case RongIMLib.MessageType.VOICE:
          text = `【${this.$tex("声音")}】`;
          break;
      }
      if (!text) {
        switch (messageType) {
          case MessageObjectNames.HB:
            text = `【${this.$tex("红包")}】`;
            break;
          case MessageObjectNames.JOIN_CHATROOM:
            text = `【${this.$tex("欢迎")}】`;
            break;
          case MessageObjectNames.CLEAR_CHATROOM_MSG:
            text = `【${this.$tex("清屏")}】`;
            break;
          case MessageObjectNames.EMOJI:
            text = `【${this.$tex("表情")}】`;
            break;
          case MessageObjectNames.FOLLOW_ORDER:
            text = `【${this.$tex("跟单")}】`;
            break;
          case MessageObjectNames.FOLLOW_LOTTERY:
            text = `【${this.$tex("导师计划")}】`;
            break;
        }
      }
      if (!text) {
        return `${this.$tex("暂无消息")}~`;
      }
      return text;
    },
    swichTab(index) {
      this.curTabIndex = index;
    },
    isActive(item) {
      const { userInfo = {} } = this.chatCurrentContact;
      return item.userInfo.id === userInfo.id;
    },

    onOpenPrivateWin(index, type) {
      if (type === 0) {
        this.setChatCurrentContact(this.chatContactsList[index]);
      } else {
        this.setChatCurrentContact(this.managerList[index]);
      }
    },
    showSysRoom() {
      this.SET_CHAT_SHOW_PRIVATE_WIN(false); // 打开窗口
      this.chatContactRoomInfo.unreadMessageCount = 0;
      this.SET_CHAT_CONTACT_ROOMINFO(this.chatContactRoomInfo);
    },
    onDeleteContact(index) {
      const user = this.chatContactsList[index].userInfo;
      this.$Modal.confirm({
        title: this.$tex("提示"),
        content: `<p>${this.$tex("确定删除{name}吗？", {
          name: user.name,
        })}</p>`,
        onOk: () => {
          this.removeChatConversation({ index });
        },
      });
    },
    async getConversationList() {
      if (!this.managerList.length) {
        await this.queryChatCustComerService(this.chatCurrentRoom.roomId);
      }
      this.IS_CONTACTS_JOIN_SUCCESS(false);
      this.SET_CHAT_CONTACTS_LIST([]);
      this.setConversationRoom({
        lastMessage: {},
        unreadMessageCount: 0,
      });
      RongYun.getConversationList().then((conversationList) => {
        this.IS_CONTACTS_JOIN_SUCCESS(true);
        for (const item of conversationList) {
          // 过滤融云返回空值
          if (!item.latestMessage.content) continue;
          if (item.conversationType === RongIMLib.ConversationType.PRIVATE) {
            this.addConversationList({
              canSendMsg: true,
              message: item.latestMessage,
              unreadMessageCount: item.unreadMessageCount,
              targetId: item.targetId,
            });
          }
        }
      });
    },
    async queryChatCustComerService(roomId) {
      const res = await this.$http.post(
        "api/v2/chat/queryChatCustComerService",
        { roomId },
        { unenc: true, stopDialog: true }
      );
      const { code, data } = res.data;
      if (code !== 0) return;
      this.managerList = [];
      for (let item of data) {
        if (item.userId === this.user.userId) continue;
        this.managerList.push({
          userInfo: {
            id: item.userId,
            portrait: item.imgUrl,
            isManager: true,
            name:
              item.nickName || RongYun.FeatureEx.hideUserCode(item.userCode),
            sendUserLevelIcon: item.levelIcon,
          },
          lastMessage: {},
          unreadMessageCount: 0,
        });
      }
      this.$store.commit("SET_CHAT_MANAGER", this.managerList);
    },
  },
};
</script>

<style lang="less" scoped>
.nice-scroll {
  overflow: auto;
}
.fill-height {
  height: 100%;
}
.contact-tab {
  padding: 10px 20px;
  font-size: 0;
  span {
    display: inline-block;
    width: 50%;
    font-size: 14px;
    text-align: center;
    color: #fff;
    border-radius: 20px;
    padding: 2px 4px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    &.selected {
      background-color: #1a202b;
    }
  }
}
#frendslist-wap {
  height: 100%;
  padding-top: 45px;
  margin-top: -45px;
  > div {
    height: 100%;
  }
  .user-list {
    height: 100%;
  }
}
</style>
