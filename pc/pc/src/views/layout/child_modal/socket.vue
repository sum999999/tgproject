<template>
  <div class="web-socket">
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import isEmpty from "lodash/isEmpty";
import * as RongYun from '@/utils/rongyun';
import EventBus from '@/utils/eventBus';
import {
  PushTypes
} from '@/constant/rongyun';
import {
  RongYunConnectStatus,
} from '@/constant/rongyun';

export default {
  data() {
    return { };
  },
  computed: {
    ...mapGetters(['user', "rongYunConnectStatus", "chatRoomJoinStatus"]),
    user() {
      return this.$store.state.user;
    }
  },
  watch: {
    user: {
      handler(n, o) {
        if (n && o && n.userCode == o.userCode) {
          return;
        }
        RongYun.disconnect();
        this.connectRongYun();
      },
      deep: true
    },
    rongYunConnectStatus(value) {
      switch (value) {
        case RongYunConnectStatus.ERROR:    // 连接失败
          break;
        case RongYunConnectStatus.CONNECTED:// 链接成功
          this.$store.dispatch("joinRongYunChatRoom", {
            count: 1
          });
          break;
        case RongYunConnectStatus.CONNECTING:// 正在连接中
          break;
        case RongYunConnectStatus.DISCONNECTED:// 用户主动断开链接
          break;
        case RongYunConnectStatus.SUSPEND:// 网络不可用, SDK 内部自动重连
          break;
        default:
          break;
      }
    },
  },
  created() {
      EventBus.addEventListener('messageStore', this.messageStore, this);
      this.connectRongYun();
  },
  beforeDestroy() {
    EventBus.removeEventListener('messageStore', this.messageStore, this);
  },
  methods: {
    ...mapMutations(["SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE", "SET_CHAT_PUSH_MEMBER_MSG"]),
    isFilterTypStsTypeMessage(message) {
      return message.messageType === "RC:TypSts"
    },
    messageStore(event) {
      const message = event.target;
      let obj = message.content;
      let extra = {};
      if (this.isFilterTypStsTypeMessage(message)) {
        return
      }
      if (typeof obj.extra == "string") {
        extra = JSON.parse(obj.extra);
      } else {
        extra = obj.extra || {};
      }

      const type = extra.type;
      const conversationType = message.conversationType;

      if (conversationType === RongIMLib.ConversationType.PRIVATE) {
        // 私聊
        message.state = 1;
        //提取消息中发送方的信息
        const hisInfo = this.getSenderUserInfo(message);
        const { name } = this.$route;
        if(name!== 'chatRoom') {
          this.SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE({
            hisInfo,
            messageUId: message.messageUId,
            isShowNotice: true
          });
        }
        return;
      }

      // type判断消息类型  00 保活服务 01历史开奖，02系统公告，03优惠活动，04中奖注单，06token失效
      switch (type) {
        case PushTypes.MEMBER_MSG:
          this.SET_CHAT_PUSH_MEMBER_MSG(message);
          break;
        case PushTypes.LOTTERY:
        case PushTypes.LOTTERY_PUT_RIGHT:
          this.$store.commit("getNoticeList", obj.extra);
          break;
        case PushTypes.SYSTEM_NOTICE:
          this.$Notice.open({
            title: this.$tex("系统公告"),
            duration: 10,
            render: (h, params) => {
              return h(
                      "span",
                      {
                        style: { cursor: "pointer" },
                        on: {
                          click: () => {
                            this.$router.push(
                                    `/personalCenter/information?essayId=${
                                            extra.essayId
                                            }`
                            );
                          }
                        }
                      },
                      extra.title
              );
            }
          });
          break;
        case PushTypes.SPECIAL_OFFERS:
          this.$Notice.open({
            title: this.$tex("优惠活动"),
            duration: 10,
            render: (h, params) => {
              return h(
                      "span",
                      {
                        style: { cursor: "pointer" },
                        on: {
                          click: () => {
                            this.$router.push(
                                    `/active?resourceId=${extra.resourceId}`
                            );
                          }
                        }
                      },
                      extra.title
              );
            }
          });
          break;
        case PushTypes.LOTTERY_ORDER:
          if (obj.extra.userId !== this.user.userId) {
            return;
          }
          this.$Notice.open({
            title: this.$tex("注单推送"),
            duration: 10,
            render: (h, params) => {
              return h(
                      "span",
                      {
                        style: { cursor: "pointer" },
                        on: {
                          click: () => {
                            if (
                                    this.$route.name === "personalCenter" &&
                                    this.$route.params.id === "record"
                            ) {
                              this.$store.commit("getRecord", obj.extra);
                            } else {
                              this.$router.push({
                                name: "personalCenter",
                                params: {
                                  id: "record",
                                  detail: extra.userBettingRecordId
                                }
                              });
                            }
                          }
                        }
                      },
                      extra.message
              );
            }
          });
          break;
        case PushTypes.USER_BALANCE_CHANGE:
          let user = this.$store.state.user;
          let balance = extra.balance.toFixed(2);
          user.balance = balance;
          this.$store.commit("getUser", user);
          localStorage.setItem("user", JSON.stringify(user));
          break;
        case PushTypes.GIFT_BAG_ALERT:
          if (obj.extra.userId !== this.user.userId) {
            return;
          }
          this.$Notice.open({
            title: this.$tex("礼包"),
            duration: 10,
            render: (h, params) => {
              return h(
                      "span",
                      {
                        style: { cursor: "pointer" },
                        on: {
                          click: () => {
                            if (this.$route.name === "phone_buy") return;
                            this.$router.push({ name: "phone_buy" });
                          }
                        }
                      },
                      extra.message
              );
            }
          });
          break;
        default:
      }
    },
    connectRongYun() {
      if (!isEmpty(this.user)) {
        this.$store.dispatch("connectRongYun");
      }
    },
    /**
     * @desc 提取当前发送消息方的信息
     */
    getSenderUserInfo(msg) {
      let {user} = msg.content;
      return {
        nickName: user.name,
        user: {
          portrait: user.portrait,
          name:  user.name,
          sendUserLevelIcon: user.sendUserLevelIcon,
          id: msg.targetId,
          senderUserId: msg.senderUserId
        }
      }
    },
  }
};
</script>
<style lang="less">
@import "../../../styles/mixin.less";
.web-socket {
  height: 0;
}
</style>

