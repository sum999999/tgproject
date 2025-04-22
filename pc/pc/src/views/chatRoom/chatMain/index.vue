<template>
  <div class="index-chat" ref="indexChat">
    <!-- 右侧福利：中将消息 -->
    <chat-aside
      ref="aside"
      :signFlag="signFlag"
      :joinRoomSuccess="chatRoomJoinSuccess"
    ></chat-aside>
    <!-- 右侧福利结束 -->
    <div class="chat-inner">
      <!-- 置顶消息 -->
      <!-- 聊天室标题部分 -->
      <div class="chat-room-name-wp" id="chatRoomNamewp" style="height: 46px;">
        <div style="height: 46px;"></div>
      </div>
      <div class="chat-room-name-bottom">
        <welcomeJoinPin
          :userName="joinChatWelcomeName"
          v-show="!!joinChatWelcomeName && !hideChatRoomJoinWelcomeMsg"
        />
        <stickPin
          :text="pinInfo.text"
          v-show="pinInfo.text"
          @on-pin-close="clearPin"
          @click.native="scrollToPin"
        />
        <topNotice
          :notice="notice"
          :admin="isSysManager"
          :barrage.sync="isOpenBarrage"
          @clear-click="clearMsg"
        />
        <div class="chat-list nice-scroll" id="chatList" ref="chatList">
          <div
            class="more-message"
            v-if="isShowLoadMore"
            @click="loadMoreMessage"
          >
            {{ $tex("获取更多历史消息") }}
          </div>
          <ul id="chatListInner">
            <template v-for="item in chatList">
              <li
                class="chat-more-records"
                v-if="item.timeState"
                :key="item.messageUId"
              >
                <span>{{ item.timeState | chatFormateDate }}</span>
              </li>
              <li
                class="chat-more-records"
                v-else-if="item.warn"
                :key="`warn-${item.messageUId}`"
              >
                {{ item.warn }}
              </li>
              <!--                            <li class="chat-welcome" v-else-if="item.type == 'joinMsg'" :key="item.messageUId">-->
              <!--                                <span>{{ item.joinMsg }}</span>-->
              <!--                            </li>-->
              <li
                class="chat-item"
                v-else-if="item.content.user"
                v-show="
                  !(
                    item.senderUserId === user.userId &&
                    item.messageType === MessageObjectNames.FOLLOW_ORDER
                  )
                "
                :id="`msg${item.messageUId}`"
                :class="[
                  chatUser.uid == item.content.user.id
                    ? 'chat-right'
                    : 'chat-left',
                  getChatItemClassByMessage(item),
                ]"
                :key="`${item.messageUId}-${new Date().getTime()}`"
              >
                <div class="u-img">
                  <img
                    class="img"
                    @click="toUser(item)"
                    :src="
                      (item.content.user && item.content.user.portrait) ||
                        (item.content.user && item.content.user.icon) ||
                        defHdImg
                    "
                    alt=""
                  />
                </div>
                <div class="chat-info">
                  <p
                    class="chat-info-1"
                    v-if="
                      item.messageType !== MessageObjectNames.FOLLOW_LOTTERY
                    "
                  >
                    <img
                      class="userLevel"
                      v-if="
                        item.content.extra.senderUser &&
                          item.content.extra.senderUser.userLevelIcon
                      "
                      :src="
                        item.content.extra.senderUser &&
                          item.content.extra.senderUser.userLevelIcon
                      "
                      alt=""
                    />
                    <span class="name">{{
                      item.content.user && item.content.user.name
                    }}</span>
                    <span
                      v-if="
                        !(
                          item.content.extra.data &&
                          item.content.extra.data.hitRate
                        )
                      "
                      class="time"
                      >{{ item.sentTime | chatFormateDate }}</span
                    >
                    <span
                      v-if="
                        item.content.extra.data &&
                          item.content.extra.data.hitRate
                      "
                      class="hitRate"
                    >
                      {{ $tex("投注命中率") }}
                      <b class="num">{{
                        item.content.extra.data &&
                          item.content.extra.data.hitRate
                      }}</b>
                    </span>
                  </p>
                  <div
                    class="chat-info-2"
                    :class="{
                      'betplan-botmsg':
                        item.messageType === MessageObjectNames.FOLLOW_LOTTERY,
                      todayBetWin:
                        item.messageType === MessageObjectNames.SHARE_BET_WIN,
                      shareBetMsg:
                        item.messageType === MessageObjectNames.SHARE_BET_MSG,
                    }"
                    @contextmenu="rightClk(item, $event)"
                  >
                    <div class="chat-msg">
                      <div
                        class="today-record"
                        v-if="
                          item.messageType === MessageObjectNames.SHARE_BET_WIN
                        "
                      >
                        <h1>{{ $tex("今日战绩") }}</h1>
                        <div class="today-record__content">
                          <em>{{ $tex("恭喜恭贺，您的今日收益") }}</em>
                          <div class="today-record__footer clearfix">
                            <div class="lottery">
                              <div>{{ $tex("游戏投注") }}</div>
                              <div>
                                {{ $tex("￥")
                                }}{{ item.content.extra.data.betMoney }}
                              </div>
                            </div>
                            <div class="win">
                              <div>{{ $tex("游戏中奖") }}</div>
                              <div>
                                {{ $tex("￥")
                                }}{{ item.content.extra.data.prizeMoney }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="share-bet-msg"
                        v-if="
                          item.messageType === MessageObjectNames.SHARE_BET_MSG
                        "
                        @click="clkChaseBetting(item)"
                      >
                        <div class="title">
                          <span class="lot-name">{{
                            item.content.extra.data.lotteryName
                          }}</span>
                          <span class="lot-period"
                            >{{ item.content.extra.data.periodNo
                            }}{{ $tex("期") }}</span
                          >
                        </div>
                        <p class="play">
                          {{ $tex("玩法") }}：{{
                            item.content.extra.data.playName
                          }}
                        </p>
                        <p class="lot-num">{{ $tex("投注号码") }}：</p>
                        <div class="balls">
                          {{ item.content.extra.data.lotteryNumber }}
                        </div>
                        <!--                                                <ul class="balls">-->
                        <!--                                                    <li>08</li>-->
                        <!--                                                    <li>10</li>-->
                        <!--                                                    <li>07</li>-->
                        <!--                                                    <li>05</li>-->
                        <!--                                                    <li>01</li>-->
                        <!--                                                </ul>-->
                        <div class="footer clearfix">
                          {{ $tex("投注")
                          }}<span class="bet-money">{{
                            item.content.extra.data.buyMoney
                          }}</span
                          >{{ $tex("￥") }}，{{ $tex("中奖")
                          }}<span class="prize-money">{{
                            item.content.extra.data.prizeMoney | keepDecimalOf2
                          }}</span
                          >{{ $tex("￥") }}
                          <span class="follow">
                            {{ $tex("跟单") }}
                            <Icon type="ios-arrow-right"></Icon>
                          </span>
                        </div>
                        <img :src="item.content.extra.data.lotteryIcon" />
                      </div>
                      <div
                        class="onekey-follow"
                        v-if="
                          item.messageType == MessageObjectNames.FOLLOW_LOTTERY
                        "
                      >
                        <img
                          :src="
                            checkChineseKey()
                              ? require('@/assets/images/chat/follow-bg.png')
                              : require('@/assets/images/chat/follow-bg-en.png')
                          "
                          alt=""
                        />
                        <div
                          class="onekey-follow-wrap"
                          v-html="item.content.extra.data.dispContent"
                        ></div>
                        <div
                          class="onekey-follow-btn"
                          @click="clkChaseBetting(item)"
                        >
                          {{ $tex("一键跟投") }}
                        </div>
                      </div>
                      <!-- WELCOME -->
                      <div
                        class="msg-text"
                        v-if="item.messageType == MessageObjectNames.WELCOME"
                        v-html="item.content.content"
                      ></div>
                      <!-- 文字 -->
                      <div
                        class="msg-text"
                        v-if="item.messageType == MESSAGE_TYPE.TEXT"
                        v-html="chatTextConvert(item.content.content)"
                      ></div>
                      <!-- emoji -->
                      <div
                        class="msg-emoji"
                        v-if="item.messageType == MessageObjectNames.EMOJI"
                      >
                        <img
                          @click="fullImage(item)"
                          :id="item.content.imageId"
                          :src="item.content.imageUri"
                          alt=""
                        />
                      </div>
                      <div
                        class="msg-gif"
                        v-if="item.messageType == MESSAGE_TYPE.GIF"
                      >
                        <img
                          @click="fullImage(item)"
                          :id="item.content.imageId"
                          :src="item.content.remoteUrl"
                          alt=""
                        />
                      </div>
                      <!-- 图片 -->
                      <div
                        class="msg-img"
                        v-if="item.messageType == MESSAGE_TYPE.IMAGE"
                      >
                        <img
                          @click="fullImage(item)"
                          :id="item.content.imageId"
                          :src="item.content.content || item.content.imageUri"
                          alt=""
                        />
                        <!--                                                <img v-else @click="fullImage(item)" :src="item.content.imageUri"-->
                        <!--                                                     alt=""/>-->
                      </div>
                      <!-- 声音 -->
                      <div
                        class="msg-voice"
                        v-if="item.messageType == MESSAGE_TYPE.VOICE"
                        @click="playVoice(item)"
                      >
                        <span class="iconfont icon-voice"></span>
                        {{ item.content.duration }}s
                      </div>
                      <!-- 红包 -->
                      <div
                        v-if="item.messageType == MessageObjectNames.HB"
                        class="msg-redpacket"
                        @click="getRedpacket(item)"
                      >
                        <div
                          class="txt"
                          :class="{
                            en: !checkChineseKey(),
                          }"
                        >
                          <p class="tit1">{{ item.content.extra.remark }}</p>
                          <p class="tip">{{ $tex("领取红包") }}</p>
                        </div>
                        <div class="bottom">{{ $tex("快来抢吧") }}！</div>
                      </div>
                      <!-- 投注记录 -->
                      <div
                        class="msg-betting"
                        :class="item.disable ? 'msg-disable' : 'msg-betting'"
                        @click="clkChaseBetting(item)"
                        v-if="
                          item.messageType === MessageObjectNames.FOLLOW_ORDER
                        "
                      >
                        <div class="betting-hd">
                          <img
                            class="img"
                            :src="item.content.extra.data.lotteryIcon"
                          />
                          <div class="info">
                            <p class="name">
                              {{ item.content.extra.data.lotteryName }}
                            </p>
                            <p class="period">
                              {{ $tex("期号") }}：{{
                                item.content.extra.data.periodNo
                                  | cutStrByLength(3)
                              }}{{ $tex("期") }}
                            </p>
                          </div>
                          <div class="playName">
                            <span class="key">{{ $tex("玩法") }}：</span>
                            <span class="val">{{
                              item.content.extra.data.playName
                            }}</span>
                          </div>
                        </div>
                        <div class="betting-bd">
                          <div class="cont">
                            <p class="val">
                              {{ item.content.extra.data.lotteryNumber }}
                            </p>
                            <p class="key">{{ $tex("投注内容") }}</p>
                          </div>
                          <div class="money">
                            <p class="val">
                              {{
                                convert2UserMoney(
                                  item.content.extra.data.buyMoney
                                )
                              }}
                            </p>
                            <p class="key">{{ $tex("投注金额") }}</p>
                          </div>
                        </div>
                        <div
                          class="betting-fd"
                          :class="
                            item.disable ? 'betting-disable' : 'betting-fd'
                          "
                        >
                          {{ $tex("跟单") }}
                        </div>
                      </div>
                      <!-- 投注状态 -->
                      <span v-if="item.state == 0" class="msg-loading"
                        ><span class="iconfont icon-loading"></span
                      ></span>
                      <span
                        v-if="item.state == 2"
                        :class="{ 'msg-fail': item.state == 2 }"
                        ><span class="iconfont icon-warn"></span
                      ></span>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>
        <div
          v-if="isShowQucikReply"
          v-click-out-slide="quickReplyOutSlideClick"
          class="chat-quick-reply"
        >
          <ul class="content" v-show="isShowQuickReplyContent">
            <li
              v-for="item in quickReplyContent"
              :key="item.dictId"
              @click="onQuickReplyItemClick(item)"
            >
              {{ item.itemValue }}
            </li>
          </ul>
          <div class="bottom" @click="onQuickReplyBtnClick">
            {{ $tex("快捷回复") }}
          </div>
        </div>
        <chat-feature
          ref="chatFeature"
          v-if="!isShowQucikReply"
          v-model="msg"
          :join-room-success="chatRoomJoinSuccess"
          :placeholder="placeholder"
          :can-speak="!inputDisabled"
          :has-auth="!isDontSpeack()"
          :red-packet="isShowRedpacket"
          :at-user-style="toUserStyle"
          :at-user-list="toUserList"
          :show-emoji-box="showEmojiPanel"
          :show-emoji-panel="fontEmojiShow"
          :show-emoji-panel-tab="showFontEmjoyGuild"
          :gif-panel-index="gifPanelIndex"
          @red-packet-send="sendIMMessage"
          @emoji-click="onShowEmjoyPanel"
          @img-click="clkFile"
          @img-change="sendImgMessage"
          @emoji-panel-tab-click="onShowFontEmjoyPanel"
          @gif-panel-tab-click="onShowGifPanel"
          @emoji-selected="chooseEmoji"
          @gif-selected="sendGifMessage"
          @at-user-close="toUserClose"
          @send-click="sendTextMessage"
        />
      </div>
    </div>

    <div class="chat-context-menu" v-show="showMenu" ref="contextMenu">
      <ul v-if="currentMsg.messageUId">
        <template v-if="isSysManager">
          <li
            @click="delMsg"
            v-show="
              currentMsg.messageType != MessageObjectNames.HB &&
                currentMsg.messageType != MessageObjectNames.FOLLOW_ORDER
            "
          >
            {{ $tex("撤回") }}
          </li>
          <li
            @click="forbidSpeak"
            v-show="
              user.userCode &&
                chatUser.uid != currentMsg.content.user.id &&
                currentMsg.content.extra.kUserMarkType == 'kUserMarkType_Login'
            "
          >
            {{ $tex("禁言") }}
          </li>
          <li v-show="currentMsg.messageType == MESSAGE_TYPE.TEXT" @click="pin">
            {{ $tex("置顶") }}
          </li>
        </template>
        <li v-if="canShowUserInfo" @click="isShowUserInfo = true">
          {{ $tex("查看用户资料") }}
        </li>
      </ul>
    </div>
    <!--  图片放大 -->
    <Modal v-model="showFullModal" class="fullScreen" width="800"
      ><img
        :src="
          proxyImgUrl(
            currentMsg.content.imageUri || currentMsg.content.remoteUrl
          )
        "
    /></Modal>
    <!--  弹框通知 -->
    <Modal v-model="showModalMsg" title="" class="msg-dlg chat-dlg">
      <div class="cont" ref="modalMsg">
        <div class="txt" v-html="modalMsg.content"></div>
        <img class="img" v-if="modalMsg.imgUrl" :src="modalMsg.imgUrl" />
      </div>
      <div slot="footer">
        <div class="btn-wrap">
          <div class="btn-block" @click="showModalMsg = false">
            {{ $tex("我知道了") }}
          </div>
        </div>
      </div>
    </Modal>
    <div class="winning-fix" :en="!checkChineseKey()" ref="winningFix">
      <div v-if="winList.length">
        <i18n
          path="恭喜{name1}在{name2}玩法中投注，中奖{num}{unit}"
          :tag="false"
        >
          <template slot="name1">
            <span class="name">{{ winList[0].userCode }}</span>
          </template>
          <template slot="name2">
            {{ winList[0].lotteryName }}-{{ winList[0].playName }}
          </template>
          <template slot="num">
            {{ winList[0].prize }}
          </template>
          <template slot="unit">
            {{ $scur("元") }}
          </template>
        </i18n>
      </div>
    </div>
    <div class="scroll-bottom" @click="scroll2Bottom" v-show="showScrollBottom">
      <span class="num" v-show="unReadMsgCount">{{ unReadMsgCount }}</span>
      <Icon type="ios-arrow-down" />
    </div>
    <transition name="fromTrans">
      <div class="fromTip" v-show="fromUsersMessage" @click="scrollToMsg">
        @{{ $tex("提醒") }}
      </div>
    </transition>
    <!--  跟单弹框 -->
    <chaseBetting
      ref="chaseBetting"
      :joinRoomSuccess="chatRoomJoinSuccess"
      :allowFollowInput="allowFollowInput"
      :ryChatRoomId="ryChatRoomId"
      :roomId="currRoomInfo.roomId"
    ></chaseBetting>
    <userInfo :currentMsg="currentMsg" v-model="isShowUserInfo"></userInfo>

    <chatPrivate v-if="chatShowPrivateWin" :chatUser="chatUser"></chatPrivate>
    <!-- 粘切的截图 -->
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
  </div>
</template>

<script>
import numeral from "numeral";
import { mapActions, mapGetters, mapMutations } from "vuex";

import Logger from "@/utils/logger";
import Util from "@/utils/utils";
import firework from "@/utils/firework";
import DateUtil from "@/utils/format_date.js";
import loginDlg from "@/components/login_dlg.vue";
import modal from "@/components/modal.vue";
import * as RongYun from "@/utils/rongyun";
import {
  MessageLocalStatus,
  MessageObjectNames,
  PushTypes,
  RongYunChatRoomJoinStatus,
  RongYunConnectStatus,
} from "@/constant/rongyun";
import { UserTypes } from "@/constant/user";
import * as SysDictApi from "@/api/sysDict";
import * as domEx from "@/utils/domEx";

import chaseBetting from "./components/chaseBetting.vue";
import redPacket from "./components/redPacket.vue";
import aside from "./components/aside.vue";
import userInfo from "./components/userInfo.vue";
import chatPrivate from "./chatPrivate";
import welcomeJoinPin from "./welcomeJoinPin";
import stickPin from "./stickPin";
import topNotice from "./topNotice";
import chatFeature from "./chatFeature";

import EventBus from "@/utils/eventBus";
import isEmpty from "lodash/isEmpty";
import { checkChineseKey } from "@/lang";

const DEF_MSG_TEXT = {
  DEFAULT: "晋级为高段位会员就可以发言",
  USER_BANNED: "您已被禁言，请联系客服",
  ALL_BANNED: "全局禁言中",
  LEVEL_BANNED: "当前用户等级已被禁言，请联系客服",
  ROOM_BANNED: "房间禁言中",
  KICK_OUT: "您当前无法进入此聊天室,即将被踢出,请联系管理员！",
};

export default {
  props: {
    currRoomInfo: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  components: {
    chaseBetting,
    redPacket,
    loginDlg,
    userInfo,
    chatPrivate,
    modal,
    "chat-aside": aside,
    welcomeJoinPin,
    stickPin,
    topNotice,
    chatFeature,
  },
  data() {
    return {
      MessageObjectNames,
      chatListScrollListener: null,
      MESSAGE_TYPE: RongIMLib.MessageType,
      notice: "",
      msg: "",
      placeholder: this.$tex(DEF_MSG_TEXT.DEFAULT),
      isShowLoadMore: true,
      historyChatList: [],
      chatList: [],
      defHdImg: "/static/images/chat/chat_def_hd.png",
      fontEmojiShow: true,
      gifShow: false, //显示gif
      gifConfig: RongYun.getGifConfig(),
      gifPanelIndex: -1, //显示gif表情列表
      showEmojiPanel: false, //显示表情面板
      loadeEmojiPanel: false, //加载表情面板
      showFontEmjoyGuild: false, // 显示普通表情入口
      currentMsg: {
        content: {
          content: "",
          extra: {},
        },
      },
      showMenu: false,
      showFullModal: false,
      showScrollBottom: false, // 显示滚动到底部
      showModalMsg: false, // 展示弹框通知
      isOpenBarrage: true, // 开启弹幕
      modalMsg: {},
      inputDisabled: true,
      signFlag: 0,
      unReadMsgCount: 0, // 未读消息数量
      winList: [],
      chatPeopleInfo: {
        speakStatus: "1", // 0是可以发言
        count: 0,
        isAdmin: 0,
      },
      toUserList: [],
      fromUsersMessage: "", // 来着某人的@,//@某人
      toUserStyle: {},
      pinInfo: {
        text: "",
      }, // pin内容
      isAllBanned: false, // 全体禁言
      followAllowInput: true,
      forbidRedpackt: false, // 是否显示红包
      chatRoomType: {
        type: "0",
      },
      ryChatRoomId: this.currRoomInfo.ryChatRoomId, //聊天的房间Id
      isBandLevel: this.currRoomInfo.isBand, //等级禁言
      banSpeakTime: this.currRoomInfo.banSpeakTime, //禁言时间段
      isCanSpeak: false, //时间段禁言
      isSpanDay: false, //禁言时间段是否跨天
      startTimeStr: "", //禁言起始时间
      endTimeStr: "", //禁言结束时间
      periodsTimer: "", //定时器
      isShowUserInfo: false,
      sendSyMsgTimer: "", //发送进入系统聊天室的计时器
      isShowUserList: true, // 是否显示用户列表
      isShowPasteWp: false, //是否显示黏贴的图片
      pasteImgUrl: "", //黏贴的图片链接
      pasteImgBlob: "", //黏贴图片的blob文件
      joinChatWelcomeName: "",
      joinChatWelcomeTimer: null,
      isShowQuickReplyContent: false,
      quickReplyContent: [],
      roomId: "",
      historyTimestamps: [],
      timer: null, // 定时器
      businesses: "",
    };
  },
  computed: {
    ...mapGetters([
      "chatContactsList",
      "chatShowPrivateWin",
      "chatUser",
      "chatCurrentRoom",
      "rongYunConnectStatus",
      "chatRoomJoinStatus",
      "sysExchangeInfo",
    ]),
    user() {
      return this.$store.state.user;
    },
    configList() {
      return this.$store.state.configList;
    },
    noticeList() {
      return this.$store.state.noticeList;
    },
    allowFollowInput() {
      if (!this.followAllowInput) {
        return false;
      }
      return true;
    },
    isShowRedpacket() {
      return !this.forbidRedpackt && !this.inputDisabled;
    },
    isSysRoom() {
      return this.chatRoomType.type === "0";
    },
    /**
     * 是否为正式用户
     */
    isFormatUser() {
      //游客、试玩用户为false
      return !(!this.user.userId || this.user.userType === UserTypes.TRY_PLAY);
    },
    canShowUserInfo() {
      const currentMsg = this.currentMsg;
      return (
        this.chatUser.uid != currentMsg.content.user.id &&
        currentMsg.content.extra.loginState != "0" &&
        currentMsg.messageType !== MessageObjectNames.WELCOME &&
        currentMsg.messageType !== MessageObjectNames.JOIN_CHATROOM &&
        currentMsg.messageType !== MessageObjectNames.FOLLOW_LOTTERY &&
        (this.isCanPrivate || this.isSysManager)
      );
    },
    isCanPrivate() {
      return this.chatPeopleInfo.privateChat === "1";
    },
    isSysManager() {
      return this.chatPeopleInfo.isAdmin === "1";
    },
    hideChatRoomJoinWelcomeMsg() {
      return window.configText.hideChatRoomJoinWelcomeMsg;
    },
    chatRoomJoinSuccess() {
      return RongYunChatRoomJoinStatus.ON === this.chatRoomJoinStatus;
    },
    quickDialogue() {
      return this.currRoomInfo.quickDialogue === "1";
    },
    isShowQucikReply() {
      return this.quickDialogue && !this.isDontSpeack();
    },
  },
  watch: {
    async currRoomInfo(newVal, oldVal = {}) {
      //切换房间重新加入聊天室
      if (!oldVal.ryChatRoomId) return;
      let {
        isBand,
        perDisableSpeak,
        ryChatRoomId,
        roomId,
        banSpeakTime,
        type,
      } = newVal;
      this.isBandLevel = isBand;
      this.ryChatRoomId = ryChatRoomId;
      this.roomId = roomId;
      this.banSpeakTime = banSpeakTime;
      //切换房间重新更新startTimeStr等字段，清除计时器
      this.startTimeStr = "";
      this.isCanSpeak = false;
      this.isSpanDay = false;
      this.clearPeriodsTimer();
      this.isCanSpeakHandle();
      this.$store.commit("SET_CHATROOM_ID", roomId);
      if (newVal.roomId !== oldVal.roomId) {
        this.queryQuickReplyContent();
        await this.$store.dispatch("quitChatRoom", {
          chatRoomId: oldVal.ryChatRoomId,
        }); // 此处未作退出失败处理
        this.joinRoom(true);
      }
    },
    user(n = {}, o = {}) {
      if (n && o && n.userCode == o.userCode) {
        return;
      }
      RongYun.disconnect();
      this.SET_RY_CONNECT_SUCCESS(false);
      this.$emit("change-chat-room-user", this.currRoomInfo); // 2019.7.7
      this.fontEmojiShow = false;
      this.queryChatPeopleCount();
    },
    chatCurrentRoom: {
      handler(n, o = {}) {
        if (n.roomId !== o.roomId) {
          this.queryChatPeopleCount();
        }
      },
      deep: true,
      immediate: true,
    },
    toUserList(n) {
      if (n) {
        this.resizeMsgInput();
      }
    },
    chatRoomJoinSuccess(value) {
      if (value) {
        if (this.loaddingMsg) {
          this.loaddingMsg();
        }
      } else {
        if (this.loaddingMsg) {
          this.loaddingMsg();
          this.loaddingMsg = null;
        }
        this.loaddingMsg = this.$Message.loading({
          content: `${this.$tex("加载中")}...`,
          duration: 0,
        });
      }
    },
    rongYunConnectStatus(value) {
      switch (value) {
        case RongYunConnectStatus.ERROR: // 连接失败
          break;
        case RongYunConnectStatus.CONNECTED: // 链接成功
          this.ryConnectSuccessHandler();
          break;
        case RongYunConnectStatus.CONNECTING: // 正在连接中
          this.hasJoinPrizeRoom = false;
          break;
        case RongYunConnectStatus.DISCONNECTED: // 用户主动断开链接
          this.hasJoinPrizeRoom = false;
          if (!isEmpty(this.user)) {
            this.$store.dispatch("connectRongYun");
          }
          break;
        case RongYunConnectStatus.SUSPEND: // 网络不可用, SDK 内部自动重连
          this.hasJoinPrizeRoom = false;
          break;
        default:
          break;
      }
    },
    chatRoomJoinStatus(value) {
      switch (value) {
        case RongYunChatRoomJoinStatus.ON:
          break;
        case RongYunChatRoomJoinStatus.OFF:
          break;
        case RongYunChatRoomJoinStatus.ERROR:
          break;
        default:
          break;
      }
    },
  },
  created() {
    RongYun.disconnect();
    localStorage.removeItem("isOtherToChatRoom");
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
    this.isCanSpeakHandle(); //判断在指定时间段是否可以发言
    RongIMLib.RongIMVoice.init();
    this.$store.dispatch("connectRongYun");

    this.$store.dispatch("querySystemConfig").then((data) => {
      this.forbidRedpackt = data["FORBID_SEND_REDPACKED"] == "1";
    });
  },
  mounted() {
    EventBus.addEventListener("messageStore", this.messageStore, this);
    this.handleFollowInput();
    this.slideWinning();
    this.chatListContaner = document.querySelector("#chatList");
    this.chatListScrollListener = Util.debounce((e) => {
      this.showMenu = false;
      let scrollTop = this.chatListContaner.scrollTop;
      let clientHeight = this.chatListContaner.clientHeight;
      if (scrollTop + clientHeight >= this.chatListContaner.scrollHeight - 4) {
        // 已经到底部了
        this.unReadMsgCount = 0;
        this.showScrollBottom = false;
      } else {
        this.showScrollBottom = true;
      }
    });
    this.chatListContaner.addEventListener(
      "scroll",
      this.chatListScrollListener
    );

    this.$nextTick(() => {
      this.$refs.modalMsg.style.maxHeight =
        window.innerHeight * 0.8 - 50 + "px";
    });
    window.addEventListener("click", () => {
      this.showEmojiPanel = false;
      this.gifShow = false;
    });

    if (this.$refs.chatFeature) {
      const msgIn = this.$refs.chatFeature.$refs.msgIn;

      msgIn.addEventListener("keydown", (e) => {
        if (e.keyCode === 8 && !this.msg) {
          this.toUserList.splice(this.toUserList.length - 1, 1);
        }
      });
      //输入框绑定粘切事件
      msgIn.addEventListener("paste", (e) => {
        Util.getPasterImg(e, this.receivePasteImgCallBack);
      });
    }
    this.queryQuickReplyContent();
    this.businessNber();
    console.log(
      "$store.getters.sysPlatformFlag",
      this.$store.getters.sysPlatformFlag
    );
  },
  beforeDestroy() {
    clearInterval(this.timer);
    EventBus.removeEventListener("messageStore", this.messageStore, this);
    this.chatListContaner.removeEventListener(
      "scroll",
      this.chatListScrollListener
    );
    if (this.loaddingMsg) {
      this.loaddingMsg();
    }
    this.clearPeriodsTimer();
    this.sendSyMsgTimer && clearTimeout(this.sendSyMsgTimer);
  },
  methods: {
    ...mapMutations([
      "SET_RY_CONNECT_SUCCESS",
      "SET_CHAT_USER",
      "SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE",
    ]),
    ...mapActions(["addChatReceivePrivateUsers", "setConversationRoom"]),
    checkChineseKey,
    escapeHtml: Util.escapeHtml,
    // 判断跟单是否结束
    checkDisable() {
      this.chatList.slice(-50).forEach((item, index) => {
        if (item.messageType == "TG:BettingMsg" && !item.disable) {
          if (item.content.extra.data.closeTime < new Date().getTime() - 1500) {
            this.$set(this.chatList[index], "disable", true);
          } else {
            this.$set(this.chatList[index], "disable", false);
          }
        }
      });
    },
    // 商户标识
    async businessNber() {
      const { PLATFORM_FLAG } = await this.$store.dispatch("querySystemConfig");
      this.businesses = PLATFORM_FLAG;
      if (this.businesses == "by321") {
        this.timer = setInterval(this.checkDisable, 2000);
      }
    },
    messageStore(event) {
      const lastMessage = event.target;
      let obj = null,
        messageContent,
        msgType;
      obj = lastMessage.content;
      if (obj.extra) {
        if (typeof obj.extra == "string") {
          obj.extra = messageContent = JSON.parse(obj.extra);
        } else {
          messageContent = obj.extra || {};
        }
        msgType = messageContent.type;
      }
      const conversationType = lastMessage.conversationType;
      if (
        conversationType === RongIMLib.ConversationType.CHATROOM &&
        lastMessage.targetId === this.ryChatRoomId
      ) {
        if (msgType) {
          if (PushTypes.CHATROOM_BANNED_LEVEL === msgType) {
            let bandLevel = messageContent.bankLevel;
            if (this.hasJoinRoomAuto(bandLevel)) {
              this.isBandLevel = true;
            } else {
              this.isBandLevel = false;
            }
            this.handleBanned();
            this.banSpeakTime = messageContent.banSpeakTime;
            this.isCanSpeakHandle();
            this.$set(
              this.currRoomInfo,
              "quickDialogue",
              messageContent.quickDialogue
            );
            this.queryQuickReplyContent();
            return;
          }
        }
        lastMessage.state = MessageLocalStatus.SUCCESS;
        this.addList(lastMessage);
      } else if (conversationType === RongIMLib.ConversationType.PRIVATE) {
        lastMessage.state = MessageLocalStatus.SUCCESS;
        this.addPrivateList(lastMessage);
      }

      switch (msgType) {
        case PushTypes.LOTTERY:
        case PushTypes.LOTTERY_PUT_RIGHT:
          this.$store.commit("getNoticeList", obj.extra);
          break;
        case PushTypes.CHATROOM_AUTH_CHANGE:
          if (messageContent.banStatus === "3") {
            this.$store.commit(
              "setSysModalText",
              this.$tex("您当前无法进入此聊天室,请联系管理员！")
            );
            this.$router.push("/");
            return;
          }
          this.chatPeopleInfo.speakStatus = messageContent.banStatus;
          this.chatPeopleInfo.isAdmin = messageContent.isAdmin;
          this.handleBanned();
          break;
        case PushTypes.FIREWORKS_EXPLODE:
          if (this.isOpenBarrage) {
            this.winList.push({
              userCode: messageContent.data.userCode,
              playName: messageContent.data.playName,
              lotteryName: messageContent.data.lotteryName,
              prize: this.convert2UserMoney(messageContent.data.prize),
            });
          } else {
            this.winList = [];
          }

          break;
        case PushTypes.CHATROOM_NOTICE:
          let annouceInfo = messageContent.annouceInfo;
          if (annouceInfo.type == "1") {
            //【彩票头条】type=1与 【聊天室弹窗】type=2)
            this.notice =
              Util.escapeHtml(annouceInfo.content) +
              "&nbsp;&nbsp;&nbsp;&nbsp;" +
              this.notice;
          } else if (annouceInfo.type == "2") {
            this.modalMsg = annouceInfo;
            this.showModalMsg = true;
          }
          break;
        case PushTypes.CHATROOM_ALL_BANNED:
          let status = messageContent.data["USER_BANNED_SWITCH"];
          this.toUserList = [];
          this.placeholder = this.$tex(DEF_MSG_TEXT.ALL_BANNED);
          if (status == 1) {
            this.isAllBanned = true;
            this.handleBanned();
          } else {
            this.isAllBanned = false;
            this.handleBanned();
          }
          break;
      }
    },
    convert2UserMoney(price) {
      price = price ? price : 0;
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      const money = Number(price).toFixed(2) || 0;
      return numeral(money)
        .divide(exchangeRate)
        .format("0.00");
    },
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
    async queryQuickReplyContent() {
      if (!this.quickDialogue) {
        return;
      }
      const res = await SysDictApi.queryItemList({
        dictName: "QUICK_CONVERSATION_LIST",
      });
      const { code, data } = res.data || {};
      if (code !== 0) {
        return;
      }
      const { itemList = [] } = data || {};
      this.quickReplyContent = itemList;
    },
    onQuickReplyItemClick(item) {
      this.isShowQuickReplyContent = false;
      this.msg = item.itemValue;
      this.sendTextMessage();
    },
    quickReplyOutSlideClick() {
      this.isShowQuickReplyContent = false;
    },
    onQuickReplyBtnClick() {
      this.isShowQuickReplyContent = !this.isShowQuickReplyContent;
    },
    // 其他设备登录
    otherDeviceLoginHandler() {
      this.$Modal.info({
        title: this.$tex("温馨提示"),
        content: `<p>${this.$tex("请重新登入！")}</p>`,
        onOk: () => {},
      });
    },
    async ryConnectSuccessHandler() {
      this.SET_RY_CONNECT_SUCCESS(true);
      this.joinRoom();
    },
    setIsCanSpeakStatus() {
      let dt = new Date();
      let tomorrow = new Date(dt.getTime());

      let date = DateUtil.getFormatDate2(dt, "yyyy/MM/dd");
      let date2 = DateUtil.getFormatDate2(tomorrow, "yyyy/MM/dd");

      let startTimeStr = date + " " + this.startTimeStr.trim();
      let endTimeStr = date2 + " " + this.endTimeStr.trim();
      const startTime = new Date(startTimeStr).getTime();
      const endTime = new Date(endTimeStr).getTime();
      const nowTime = dt.getTime();
      if (!this.isSpanDay) {
        //非跨天
        this.isCanSpeak = nowTime < startTime || nowTime > endTime;
      } else {
        this.isCanSpeak = nowTime > endTime && nowTime < startTime;
      }
      this.handleBanned();
    },
    /**
     *是否可以发言，指定时间段内
     */
    isCanSpeakHandle() {
      this.clearPeriodsTimer();
      if (!this.banSpeakTime) {
        //不存在表示不禁言
        this.isCanSpeak = true;
        this.handleBanned();
        return;
      }
      let [startTimeStr, endTimeStr] = this.banSpeakTime.split("-");
      startTimeStr = startTimeStr.trim();
      endTimeStr = endTimeStr.trim();
      this.startTimeStr = startTimeStr;
      this.endTimeStr = endTimeStr;
      let preStartHour = startTimeStr.split(":")[0];
      let suffEndHour = endTimeStr.split(":")[0];
      if (preStartHour * 1 > suffEndHour * 1) {
        //跨天
        this.isSpanDay = true;
      } else if (startTimeStr === endTimeStr) {
        //永久禁言
        this.handleBanned();
        return;
      }
      this.setIsCanSpeakStatus();
      this.periodsTimer = setInterval(this.setIsCanSpeakStatus, 1000);
    },
    /**
     * 判断用户接收的权限
     */
    hasJoinRoomAuto(levelStr) {
      let levelArr = getLevel(levelStr);
      if (!this.isFormatUser) {
        return levelArr.includes("-1");
      }

      function getLevel(levelStr) {
        if (!levelStr) return [];
        return levelStr.split("|");
      }

      return levelArr.includes(this.user.userLevel);
    },
    isDontSpeack() {
      const baseDontSpeak =
        this.isAllBanned || //全体禁言
        !this.chatRoomJoinSuccess ||
        this.chatPeopleInfo.speakStatus != "0" ||
        this.isBandLevel ||
        !this.isCanSpeak;
      return baseDontSpeak;
    },
    /*
     * 禁言后的输入框处理
     */
    handleBanned() {
      const { speakStatus } = this.chatPeopleInfo;
      if (this.isAllBanned) {
        //全都禁言
        this.inputDisabled = true;
        this.placeholder = this.$tex(DEF_MSG_TEXT.ALL_BANNED);
        this.toUserList = [];
        return;
      }

      if (speakStatus === "1") {
        //晋级才可发言
        this.placeholder =
          this.currRoomInfo.mute || this.$tex(DEF_MSG_TEXT.DEFAULT);
      } else if (speakStatus === "2") {
        //被禁言
        this.placeholder = this.$tex(DEF_MSG_TEXT.USER_BANNED);
      } else if (speakStatus === "3") {
        // 禁止进入聊天室
        this.placeholder = this.$tex(DEF_MSG_TEXT.KICK_OUT);
      } else if (this.isBandLevel) {
        //等级禁言
        this.placeholder = this.$tex(DEF_MSG_TEXT.LEVEL_BANNED);
      } else if (!this.isCanSpeak) {
        //是否时间段禁言
        this.placeholder = this.$tex(DEF_MSG_TEXT.ROOM_BANNED);
      } else {
        if (
          this.placeholder === this.$tex(DEF_MSG_TEXT.DEFAULT) ||
          this.placeholder === this.$tex(DEF_MSG_TEXT.ALL_BANNED) ||
          this.placeholder === this.$tex(DEF_MSG_TEXT.USER_BANNED) ||
          this.placeholder === this.$tex(DEF_MSG_TEXT.LEVEL_BANNED) ||
          this.placeholder === this.$tex(DEF_MSG_TEXT.ROOM_BANNED)
        ) {
          this.placeholder = "";
          this.toUserList = [];
        }
      }
      this.inputDisabled =
        this.isBandLevel || speakStatus != "0" || !this.isCanSpeak;
      if (!this.inputDisabled) {
        this.placeholder = "";
      }
    },
    /*
     *  @某人输入框变化
     */
    resizeMsgInput() {
      if (this.toUserList.length && !this.$refs.chatFeature) {
        return (this.toUserList = []);
      }
      if (this.toUserList.length) {
        this.$nextTick(() => {
          let toUserBox = this.$refs.chatFeature.$refs.toUser;
          let toUsers = toUserBox.querySelectorAll(".toUser");
          // let toUserW = toUserBox.clientWidth;
          let msgW = this.$refs.chatFeature.$refs.msgIn.clientWidth - 75;
          toUserBox.style.maxWidth = msgW + "px";
          let lastUser = toUsers[toUsers.length - 1];

          let pt = lastUser.offsetTop + 10;
          let pl = lastUser.offsetLeft + lastUser.clientWidth + 5;

          if (pl >= msgW) {
            pt = pt + lastUser.clientHeight;
            pl = 0;
          }

          this.toUserStyle = {
            "padding-top": pt + "px",
            "text-indent": pl + "px",
          };
        });
      } else {
        this.toUserStyle = {};
      }
    },
    /*
     *  @dec 跳转链接
     */
    goPage(link) {
      window.open(link, "_blank");
    },
    /*
     *  @dec 图片放大满屏展示
     */
    fullImage(item) {
      this.showFullModal = true;
      this.currentMsg = JSON.parse(JSON.stringify(item));
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
     *  @dec 清屏
     */
    clearMsg() {
      this.fromUsersMessage = "";
      this.chatList = this.chatList.filter((item) => item.type === "redpacket");
      const message = new RongYun.MessageManager.TextMessage({
        content: this.$tex("清屏"),
        extra: { type: "110" },
      });
      this.$store.dispatch("sendMessage", {
        targetId: this.ryChatRoomId,
        message,
      });
    },
    /*
     *  @dec 加入聊天室
     */
    async joinRoom(flag, flag2) {
      //flag2表示非切换房间
      //flag2关闭更多页面
      //切换房间进来的flag=true
      let vm = this;
      let sysData = "";
      if (!flag) {
        sysData = await this.$store.dispatch("querySystemConfig");
      }
      // !this.hasJoinPrizeRoom && (window.prizeChatRoom = sysData['chatRoomId']);
      const isSwitchRyChatRoom = this.lastRyChatRoomId !== this.ryChatRoomId;
      this.lastRyChatRoomId = this.ryChatRoomId;
      this.$store.dispatch("joinRongYunChatRoom", {
        chatRoomId: this.ryChatRoomId,
        count: 50,
        options: {
          onSuccess: function(msg) {
            // 加入聊天室成功
            let name =
              vm.user.nickName ||
              RongYun.FeatureEx.hideUserCode(vm.chatUser.name);
            flag &&
              vm.$emit(
                "change-room-info",
                JSON.parse(
                  JSON.stringify({
                    ryChatRoomId: vm.ryChatRoomId,
                    roomId: vm.roomId,
                  })
                )
              );
            if (isSwitchRyChatRoom) {
              vm.chatList = [];
              vm.sendSyMsgTimer && clearTimeout(vm.sendSyMsgTimer);
              vm.sendSyMsgTimer = setTimeout(() => {
                const { sysMessage = "" } = vm.currRoomInfo;
                if (sysMessage) {
                  const defaultMsg = vm.$tex(
                    "尊敬的用户，欢迎来到“{name}”开启您的幸运之旅，请遵守聊天室相关规定，禁止任何形式的广告以及发送相关联系方式，管理员有权撤回不当言论或消息，并禁言停用用户账号，如果遇到充值或提现问题，请联系所在平台的客服，谢谢！",
                    {
                      name: configText.main,
                    }
                  );
                  const welcomeTextMessage = new RongYun.MessageManager.WelcomeMessage(
                    {
                      content: sysMessage || defaultMsg,
                      extra: {},
                      user: {
                        name: vm.$tex("系统管理员"),
                        id: "",
                        portrait: "/static/images/chat/sys_hd.png",
                      },
                    }
                  );

                  vm.chatList.push(welcomeTextMessage);
                  vm.setConversationRoom({
                    lastMessage: welcomeTextMessage,
                  });
                  vm.scrollHandler(welcomeTextMessage, true);
                }
                vm.openJoinChatWelcomeInfo(name);
                const textJoinMessage = new RongYun.MessageManager.TextMessage({
                  content: "",
                  extra: {
                    content: name,
                    type: "101",
                    userCode: vm.chatUser.name,
                  },
                });
                RongYun.MessageManager.getInstance().addUser(textJoinMessage);
                vm.$store.dispatch("sendMessage", {
                  targetId: vm.ryChatRoomId,
                  message: textJoinMessage,
                });
              }, 2000);
            }
          },
        },
      });
      if (vm.hasJoinPrizeRoom) return;
      this.joinGlobalChatRoom();
    },
    async joinGlobalChatRoom() {
      const error = await this.$store.dispatch("joinRongYunChatRoom", {
        count: 1,
      });
      if (error) {
        Logger.prefixed.error("融云", "系统配置专用开奖聊天室加入失败!");
      } else {
        Logger.prefixed.log("融云", "系统配置专用开奖聊天室加入成功!");
        this.hasJoinPrizeRoom = true;
      }
    },
    /*
     *  @dec 禁言
     */
    forbidSpeak() {
      if (!this.isSysManager) return;
      this.$http
        .post(
          "/api/v2/chat/banUserSpeak",
          {
            banUserId: this.currentMsg.content.user.id,
          },
          {
            userId: true,
          }
        )
        .then((res) => {
          if (res.data.code !== 0) return;
          this.$Message.loading({
            content: this.currentMsg.content.user.name + res.data.msg,
            duration: 1,
          });
        });
    },
    /*
     *  @dec 删除消息
     */
    delMsg() {
      let vm = this;
      if (
        !this.isSysManager ||
        vm.currentMsg.state === MessageLocalStatus.LOADING
      )
        return;
      let currentMsg = vm.currentMsg;
      const message = new RongYun.MessageManager.TextMessage({
        content: "",
        extra: { type: "100", messageUId: currentMsg.messageUId },
      });
      RongYun.MessageManager.getInstance().addMessageExData(message);

      vm.msgMgrShow = false;
      vm.$store.dispatch("sendMessage", {
        targetId: vm.ryChatRoomId,
        message,
        options: {
          onSuccess: function(message) {
            if (currentMsg.messageUId === vm.pinInfo.msgId) {
              vm.pinInfo = {};
              clearInterval(vm.pinTimer);
            }
            let list = vm.chatList;
            for (let i = 0, len = list.length; i < len; i++) {
              if (currentMsg.messageUId === list[i].messageUId) {
                list.splice(i, 1);
                if (list[i - 1] && list[i - 1].timeState) {
                  list.splice(i - 1, 1);
                }
                break;
              }
            }
            if (vm.chatList.length) {
              vm.setConversationRoom({
                lastMessage: vm.chatList[vm.chatList.length - 1],
              });
            } else {
              vm.setConversationRoom({
                lastMessage: {},
              });
            }
          },
          onError: function(errorCode) {},
        },
      });
    },
    /*
     *  @显示gif表情
     */
    onShowGifPanel(index) {
      this.gifPanelIndex = index;
      // this.showFontEmjoyGuild = false;
      this.fontEmojiShow = false;
    },
    /*
     *  @显示普通表情
     */
    onShowFontEmjoyPanel() {
      this.fontEmojiShow = true;
      this.gifPanelIndex = -1;
    },
    /*
     *  @dec 显示表情
     */
    onShowEmjoyPanel() {
      if (this.isDontSpeack()) return;
      this.loadeEmojiPanel = true;
      if (this.user.userCode) {
        if (this.user.userType === UserTypes.TRY_PLAY) {
          // 试玩账号
          this.showEmojiPanel = true;
          this.gifPanelIndex = 0;
          this.showFontEmjoyGuild = false; // 普通表情入口显示
        } else if (this.chatPeopleInfo.speakStatus != "0" || this.isAllBanned) {
          // 禁言
          return;
        } else {
          // 可发言
          this.showFontEmjoyGuild = true; // 普通表情入口显示
          this.fontEmojiShow = true;
          this.showEmojiPanel = true;
          this.gifPanelIndex = -1;
        }
      } else {
        // 游客
        this.gifPanelIndex = 0;
        this.showEmojiPanel = true;
        this.fontEmojiShow = false;
        this.showFontEmjoyGuild = false;
      }
    },
    /*
     *  @dec 显示gif
     */
    clkShowGif() {
      if (this.isDontSpeack()) {
        // 正常用户被禁言状态
        return;
      }
      this.gifShow = !this.gifShow;
      this.fontEmojiShow = false;
    },
    /*
     *  @dec 点击图片上传
     */
    clkFile(event) {
      if (this.isDontSpeack()) {
        event.preventDefault();
      }
    },
    /*
     *  @dec 发送gif消息
     */
    sendGifMessage(groupName, item) {
      if (this.isDontSpeack()) return;
      let loginState = "1";
      if (!this.user.userCode || this.user.userType === UserTypes.TRY_PLAY) {
        if (
          this.unLoginSendMsgTime &&
          new Date() - this.unLoginSendMsgTime < 1000 * 60
        ) {
          this.$Message.loading({
            content: this.$tex("亲，您发言太频繁了"),
            duration: 1,
          });
          return false;
        }
        this.unLoginSendMsgTime = new Date();
        loginState = "0"; // 未登录
      } else if (this.chatPeopleInfo.speakStatus != "0") {
        // 禁言状态不可以发图
        return;
      }
      const gifMessage = new RongYun.MessageManager.EmojiMessage({
        objectName: MessageObjectNames.EMOJI,
        content: this.$tex("发送Emoji消息"),
        extra: {
          type: "106",
          groupName: groupName,
          emojiName: item.src,
          loginState: loginState,
        },
      });
      this.sendIMMessage(gifMessage);
    },
    /*
     *  @dec 发送图片消息
     */
    sendImgMessage(files) {
      if (this.isDontSpeack()) return;
      let vm = this;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgMessage = new RongYun.MessageManager.ImgMessage({
          content: Util.createObjectURL(file),
          imageUri: Util.createObjectURL(file),
        });
        imgMessage.state = MessageLocalStatus.LOADING;
        imgMessage.progress = "0%";
        imgMessage.sentTime = new Date().getTime();

        vm.addList(imgMessage);

        const messageContent = RongYun.MessageManager.getInstance().addMessageExData(
          imgMessage
        ).content;
        const msgBody = Object.assign({ file }, messageContent);

        RongYun.MessageManager.sendImageMessage(
          {
            targetId: this.ryChatRoomId,
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
            imgMessage.progress = vm.$tex("发送失败");
          });
      }
    },
    /*
     *  @dec  发送纯文本消息
     */
    sendTextMessage() {
      if (this.isDontSpeack()) return;
      let vm = this;
      let msg = this.msg;
      if (msg) {
        let startReg = /^[\r\n]/g;
        let endReg = /[\r\n]$/g;
        while (startReg.test(msg) || endReg.test(msg)) {
          msg = msg.replace(startReg, "");
          msg = msg.replace(endReg, "");
        }
      }
      if (vm.toUserList.length) {
        let names = vm.toUserList.map((item) => "@" + item.name).join(" ");
        msg = names + " " + msg;
      }
      if (!msg) {
        vm.msg = "";
        return;
      }
      const message = new RongYun.MessageManager.TextMessage({
        content: msg,
        extra: vm.toUserList.length
          ? {
              toUser: vm.toUserList,
              type: "104", // @消息
            }
          : null,
      });
      if (vm.sendIMMessage(message)) {
        // vm.setInputText('');
        vm.msg = "";
      }
      vm.fontEmojiShow = false;
    },
    /*
     *  @dec  点击投注单
     */
    clkChaseBetting(item) {
      if (item.disable) return;
      this.$refs.chaseBetting.clkChaseBetting(item);
    },
    /*
     *  @dec  点击抢红包
     */
    getRedpacket(item) {
      if (item.content.extra.hourly) {
        this.$Message.error(this.$tex("您好，仅通过手机App自助领取！"));
        return;
      }
      this.$refs.chatFeature.$refs.redPacket.getRedpacket(
        item,
        this.currRoomInfo.roomNo
      );
    },
    /*
     *  @dec  点击声音
     */
    playVoice(item) {
      // 预加载
      if (item.content.playState) {
        RongIMLib.RongIMVoice.stop(item.content.content, item.content.duration);
        item.content.playState = false;
        return;
      }
      RongIMLib.RongIMVoice.preLoaded(item.content.content, function(infio) {
        // 播放声音
        RongIMLib.RongIMVoice.play(item.content.content, item.content.duration);
        item.content.playState = true;
        item.content.voiceRead = true;
      });
    },
    /*
     *  @dec 真正发送信息
     */
    sendIMMessage(message) {
      let vm = this;
      if (vm.sendTimeLoad) {
        vm.sendTimeLoad();
      }
      if (vm.sendMsgTime && new Date() - vm.sendMsgTime < 2000) {
        vm.sendTimeLoad = vm.$Message.loading({
          content: vm.$tex("亲，您发言太频繁了"),
          duration: 1,
        });
        return false;
      }
      vm.sendMsgTime = new Date();

      message.state = MessageLocalStatus.LOADING;
      message.sentTime = new Date().getTime();
      const messageManager = RongYun.MessageManager.getInstance();
      messageManager.addMessageExData(message);
      vm.addList(message); // 往列表里面插入数据

      vm.toUserList = [];
      vm.$store.dispatch("sendMessage", {
        targetId: vm.ryChatRoomId,
        message,
        options: {
          onSuccess: function(msg) {
            message.state = MessageLocalStatus.SUCCESS;
            message.messageUId = msg.messageUId;
            vm.setConversationRoom({
              lastMessage: msg,
            });
          },
          onError: function(errorCode) {
            message.state = MessageLocalStatus.ERROR;
            message.code = errorCode;
            if (errorCode == 23408) {
              vm.chatList.push({
                warn: vm.$tex("您已经被禁言"),
              });
            }
          },
        },
      });
      return true;
    },
    /*
     *  @dec 选择表情
     */
    chooseEmoji(emojiName) {
      if (this.isDontSpeack()) {
        return;
      }
      if (emojiName) {
        let msg = this.msg;
        this.msg = msg + emojiName;
      }
    },
    /*
     *  @dec 设置输入框值---暂时不用
     */
    setInputText(msg) {
      this.$refs.chatFeature.$refs.msgIn.innerHTML = msg;
      this.msg = msg;
    },
    openJoinChatWelcomeInfo(content) {
      if (this.joinChatWelcomeTimer) {
        clearTimeout(this.joinChatWelcomeTimer);
        this.joinChatWelcomeTimer = null;
      }
      this.joinChatWelcomeName = content;
      this.joinChatWelcomeTimer = setTimeout(() => {
        clearTimeout(this.joinChatWelcomeTimer);
        this.joinChatWelcomeTimer = null;
        this.joinChatWelcomeName = "";
      }, 2000);
    },
    getMsgHideStatus(message) {
      let extra = message.content && message.content.extra;
      if (!extra) {
        return;
      }
      if (typeof extra === "string") {
        extra = JSON.parse(extra);
      }
      if (extra.type === "101" && message.isOffLineMessage) {
        return true;
      }
      return false;
    },
    verifyAddList(v) {
      if (v.messageType === MessageObjectNames.WELCOME) {
        return;
      }
      if (this.getMsgHideStatus(v)) {
        return;
      }

      let extra = v.content && v.content.extra;

      if (extra) {
        if (typeof extra === "string") {
          v.content.extra = extra = JSON.parse(extra);
        }
        if (extra.type === "100") {
          // 删除消息

          for (let i = 0; i < this.chatList.length; i++) {
            if (extra.messageUId === this.chatList[i].messageUId) {
              this.chatList.splice(i, 1);
              if (this.chatList[i - 1] && this.chatList[i - 1].timeState) {
                this.chatList.splice(i - 1, 1);
              }
              if (this.chatList.length) {
                this.setConversationRoom({
                  lastMessage: this.chatList[this.chatList.length - 1],
                });
              } else {
                this.setConversationRoom({
                  lastMessage: {},
                });
              }

              break;
            }
          }
          if (extra.messageUId === this.fromUsersMessage) {
            // 取消@
            this.fromUsersMessage = "";
          }
          if (extra.messageUId === this.pinInfo.msgId) {
            // 取pin
            this.pinInfo = {};
            clearInterval(this.pinTimer);
          }
          return;
        } else if (extra.type === "101" && !v.isOffLineMessage) {
          this.openJoinChatWelcomeInfo(extra.content);
          return;
        } else if (extra.type === "110") {
          // 清屏
          this.chatList = this.chatList.filter(
            (item) => item.messageType === MessageObjectNames.HB
          );
          this.fromUsersMessage = "";
          this.pinInfo = {};
          clearInterval(this.pinTimer);
          return;
        } else if (extra.type === "105") {
          // pin消息
          let messageUId = extra.messageUId;
          if (messageUId) {
            let curMsg = this.chatList.find(
              (item) => item.messageUId === messageUId
            );
            if (curMsg) {
              this.pinInfo = {
                text: curMsg.content.content,
                msgId: curMsg.messageUId,
              };
              clearInterval(this.pinTimer);
              this.pinTimer = setTimeout(() => {
                this.pinInfo = {};
                clearInterval(this.pinTimer);
              }, 2000 * 60);
            }
          }

          return;
        } else if (v.content.content === "00") {
          return;
        }
      }
      return true;
    },
    /*
     *  @dec 添加列表 发送消息和接收消息统一入口
     */
    addList(v) {
      if (!this.verifyAddList(v)) {
        return;
      }

      if (this.chatList.length) {
        let last = this.chatList[this.chatList.length - 1];
        if (!last.timeState && v.sentTime - last.sentTime > 1000 * 60 * 5) {
          // 5分钟
          this.chatList.push({
            timeState: v.sentTime,
          });
        }
      } else {
        this.chatList.push({
          timeState: v.sentTime,
        });
      }
      if (this.chatList.length > 200) {
        this.chatList.shift();
      }
      if (v.messageUId) {
        this.addReceivedMsg(v);
      } else {
        this.addSendIngMsg(v);
      }
    },
    chatTextConvert(text) {
      return RongYun.emoji.emojiToHTML(this.$xss(text));
    },
    wrapReceivedMsg(v) {
      v.state = MessageLocalStatus.SUCCESS;
      let vm = this;
      let messageType = v.messageType;

      let extra = v.content.extra;

      if (typeof extra === "string" && !!extra) {
        v.content.extra = extra = JSON.parse(extra);
      }

      if (messageType === RongIMLib.MessageType.GIF) {
        v.content.imageId = "image" + v.sentTime;
      } else if (messageType === RongIMLib.MessageType.IMAGE) {
        v.content.imageId = "image" + v.sentTime;
        if (v.content.content && !Util.validDataUrl(v.content.content)) {
          v.content.content = Util.joinBase64Head(
            Util.getMimeTypeByUrl(v.content.imageUri),
            v.content.content
          );
        }
      } else if (messageType === RongIMLib.MessageType.TEXT) {
        if (extra && extra.toUser) {
          let fromUsers = extra.toUser;
          if (typeof fromUsers == "string") {
            fromUsers = JSON.parse(fromUsers);
          }
          if (
            fromUsers.findIndex((item) => item.id === vm.chatUser.uid) > -1 &&
            !vm.fromUsersMessage
          ) {
            vm.fromUsersMessage = v.messageUId;
          }
        }
      } else if (messageType === MessageObjectNames.SHARE_BET_MSG) {
        let data = extra.data;
        let user = v.content.user || {};
        RongYun.MessageManager.getInstance().setUser(v, {
          id: data.userId,
          name: user.name,
          portrait: data.imgUrl,
        });
        RongYun.MessageManager.getInstance().setSenderUser(v, {
          id: data.userId,
          name: user.name,
          nickName: data.nickName,
          portrait: data.imgUrl,
          userCode: data.userCode,
          userLevelIcon: data.userLevelIcon,
        });
      } else if (messageType === MessageObjectNames.SHARE_BET_WIN) {
        let data = extra.data;
        let user = v.content.user || {};
        RongYun.MessageManager.getInstance().setUser(v, {
          id: user.id,
          name: user.name,
          portrait: user.icon,
        });
        RongYun.MessageManager.getInstance().setSenderUser(v, {
          id: user.id,
          name: user.name,
          nickName: data.nickName,
          portrait: user.icon,
          userCode: user.userCode,
          userLevelIcon: data.userLevelIcon,
        });
      } else if (messageType === MessageObjectNames.FOLLOW_ORDER) {
        // 投注记录
        let data = extra.data;
        let user = v.content.user || {};

        RongYun.MessageManager.getInstance().setUser(v, {
          id: data.userId,
          name: user.name,
          portrait: data.imgUrl,
        });

        RongYun.MessageManager.getInstance().setSenderUser(v, {
          id: data.userId,
          name: user.name,
          nickName: data.nickName,
          portrait: data.imgUrl,
          userCode: data.userCode,
          userLevelIcon: data.userLevelIcon,
        });
      } else if (messageType === MessageObjectNames.EMOJI) {
        v.content.imageId = "image" + v.sentTime;
        v.content.imageUri =
          this.gifConfig.staticSrc + extra.groupName + "/" + extra.emojiName;
      } else if (messageType === MessageObjectNames.FOLLOW_LOTTERY) {
        v.state = MessageLocalStatus.SUCCESS;
      }
      return v;
    },
    /*
     *  @dec 添加收到的消息
     */
    addReceivedMsg(v) {
      v = this.wrapReceivedMsg(v);
      this.setConversationRoom({
        lastMessage: v,
      });
      this.chatList.push(v);
      this.scrollHandler(v);
    },
    async loadMoreMessage() {
      let firstDom = this.$refs.chatList.querySelectorAll("li")[0];

      if (!this.historyTimestamps.length) {
        if (this.chatList && this.chatList.length) {
          let timestamp;
          for (let i = 0; i < this.chatList.length; i++) {
            timestamp = this.chatList[i].timeState || this.chatList[0].sentTime;
            if (timestamp) {
              this.historyTimestamps.push(timestamp);
              break;
            }
          }
          this.chatList.slice(20).forEach((item, index) => {
            if (item.messageType == "TG:BettingMsg" && !item.disable) {
              if (
                item.content.extra.data.closeTime <
                new Date().getTime() - 1500
              ) {
                this.$set(this.chatList[index], "disable", true);
              } else {
                this.$set(this.chatList[index], "disable", false);
              }
            }
          });
        }
      }

      while (true) {
        const history = await RongYun.getHistoryMessages(
          RongIMLib.ConversationType.CHATROOM,
          this.ryChatRoomId,
          {
            timestamp: this.historyTimestamps[
              this.historyTimestamps.length - 1
            ],
          }
        );
        if (!history.hasMore) {
          this.isShowLoadMore = false;
          return;
        }

        this.historyTimestamps.push(history.list[0].sentTime);

        const historyList = [];
        history.list.forEach((msg) => {
          if (!this.verifyAddList(msg)) {
            return;
          }
          historyList.push(this.wrapReceivedMsg(msg));
        });
        if (historyList.length > 0) {
          this.chatList = historyList.concat(...this.chatList);
          this.$nextTick(() => {
            this.$refs.chatList.scrollTop = firstDom.offsetTop - 56;
          });
          return;
        }
      }
    },
    addPrivateList(message) {
      this.addChatReceivePrivateUsers({
        message,
        canSendMsg: true,
      });
    },
    addSendIngMsg(message) {
      message.state = MessageLocalStatus.LOADING;
      let vm = this;

      let messageType = message.messageType;
      if (messageType === MessageObjectNames.EMOJI) {
        message.content.imageId = "image" + message.sentTime;
        message.content.imageUri =
          this.gifConfig.staticSrc +
          message.content.extra.groupName +
          "/" +
          message.content.extra.emojiName;
      } else if (messageType === RongIMLib.MessageType.IMAGE) {
        message.content.imageId = "image" + message.sentTime;
      } else if (messageType === RongIMLib.MessageType.GIF) {
        message.content.imageId = "image" + message.sentTime;
      }
      this.chatList.push(message);
      this.scrollHandler(message, true);
    },
    /*
     *  @dec 接收图片做加载处理
     */
    imageLoadHandle(id) {
      let vm = this;
      let image = document.querySelector("#" + id);
      if (!image) return;
      let reloadCount = 3;

      const backSrc = image.src;

      function load() {
        const imgCache = new Image();
        imgCache.src = backSrc;
        image.src = "/static/images/chat/load.gif";
        imgCache.onload = () => {
          image.src = imgCache.src;
          image.onerror = image.onload = () => {
            !vm.showScrollBottom && vm.scroll2Bottom();
          };
        };
        imgCache.onerror = () => {
          if (reloadCount > 0) {
            reloadCount--;
            return load();
          }
          image.src = "/static/images/chat/load-fail.png";
          image.onerror = image.onload = () => {
            !vm.showScrollBottom && vm.scroll2Bottom();
          };
        };
      }
      load();
    },
    is2ChatBottom() {
      const chatList = document.querySelector("#chatList");
      const scrollTop = chatList.scrollTop;
      const clientHeight = chatList.clientHeight;
      const scrollHeight = chatList.scrollHeight - 4;
      return scrollTop + clientHeight >= scrollHeight;
    },
    scroll2Bottom() {
      const chatList = document.querySelector("#chatList");
      const clientHeight = chatList.clientHeight;
      const scrollHeight = chatList.scrollHeight;
      chatList.scrollTop = scrollHeight - clientHeight;
      this.unReadMsgCount = 0;
      this.showScrollBottom = false;
    },
    // 显示未读消息和滚动处理
    scrollHandler(message, jump2Bottom = false) {
      const is2ChatBottom = this.is2ChatBottom();
      this.$nextTick(() => {
        if (jump2Bottom || is2ChatBottom) {
          if (
            message.messageType === RongIMLib.MessageType.GIF ||
            message.messageType === RongIMLib.MessageType.IMAGE ||
            message.messageType === MessageObjectNames.EMOJI
          ) {
            this.imageLoadHandle(message.content.imageId);
          }
          this.scroll2Bottom();
        } else {
          this.unReadMsgCount++;
          this.showScrollBottom = true;
        }
      });
    },
    /*
     *  @dec 右键点击显示菜单
     */
    rightClk(item, event) {
      if (!this.isSysManager) return;
      this.currentMsg = JSON.parse(JSON.stringify(item));
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
    /*
     *  @dec 点击pin
     */
    pin() {
      this.pinInfo = {
        text: this.currentMsg.content.content,
        msgId: this.currentMsg.messageUId,
      };
      const message = new RongYun.MessageManager.TextMessage({
        content: "pin",
        extra: {
          type: "105",
          messageUId: this.currentMsg.messageUId,
        },
      });
      this.$store.dispatch("sendMessage", {
        targetId: this.ryChatRoomId,
        message,
      });
      clearInterval(this.pinTimer);
      this.pinTimer = setTimeout(() => {
        this.clearPin();
      }, 2000 * 60);
    },
    /*
     *  @dec 关闭pin
     */
    clearPin() {
      this.pinInfo = {};
      clearInterval(this.pinTimer);
    },
    /*
     *  @dec 查询聊天用户信息
     */
    queryChatPeopleCount() {
      const { roomId, ryChatRoomId } = this.chatCurrentRoom;
      if (!roomId) return;
      let vm = this;
      //if (!vm.user.userCode) return
      let userId = vm.user.userCode ? vm.user.userId : "";

      vm.$store.dispatch("querySystemConfig").then((data) => {
        this.isAllBanned = data["USER_BANNED_SWITCH"] == "1";

        vm.$http
          .post(
            "/api/v2/chat/queryChatPeopleCount",
            {
              chatId: ryChatRoomId,
              userId: vm.user.userId,
              roomId,
            },
            {
              unenc: true,
            }
          )
          .then((response) => {
            const { data, code } = response.data;
            if (code !== 0) return;
            this.$store.commit("getChatPeopleData", Object.assign({}, data));
            vm.signFlag = data.signFlag;
            vm.chatPeopleInfo = {
              count: data.count,
              speakStatus: data.speakStatus,
              isAdmin: data.isAdmin,
              privateChat: data.privateChat,
              isCustomerService: data.isCustomerService === "1",
            };
            vm.handleBanned(); // 2019.6.4

            let rspMap = data.rspMap;
            vm.notice = "";
            for (let item of rspMap) {
              this.notice +=
                Util.escapeHtml(item.content) + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
          });
      });
    },
    // 删除@某人
    toUserClose(index) {
      this.toUserList.splice(index, 1);
    },
    // @某人
    toUser(message) {
      if (
        !this.user.userCode ||
        this.user.userType === UserTypes.TRY_PLAY ||
        !message.content.user.id ||
        this.chatUser.uid == message.content.user.id ||
        this.toUserList.findIndex(
          (item) => message.content.user.id === item.id
        ) > -1
      ) {
        return;
      }
      this.toUserList.push({
        id: message.content.user.id,
        name: message.content.user.name,
      });
    },
    // 滚动到pin
    scrollToPin() {
      let id = "msg" + this.pinInfo.msgId;
      let scrollDom = document.querySelector("#" + id);
      if (scrollDom) {
        this.chatListContaner.scrollTop = scrollDom.offsetTop - 50;
      } else {
        this.chatListContaner.scrollTop = 0;
      }
    },
    // 滚动到消息
    scrollToMsg() {
      let id = "msg" + this.fromUsersMessage;
      let scrollDom = document.querySelector("#" + id);
      if (scrollDom) {
        this.chatListContaner.scrollTop = scrollDom.offsetTop - 50;
      } else {
        this.chatListContaner.scrollTop = 0;
      }
      this.fromUsersMessage = "";
    },
    // 中奖消息通知
    slideWinning() {
      let vm = this;
      let winningFix = vm.$refs.winningFix;
      let indexChat = vm.$refs.indexChat;
      let duration = 0,
        time = 50,
        long = 2000;
      window.setInterval(() => {
        if (!vm.isOpenBarrage && vm.winList.length > 0) {
          vm.winList = [];
        }
        if (
          this.chatShowPrivateWin ||
          vm.winList.length <= 0 ||
          winningFix.className != "winning-fix"
        )
          return;

        winningFix.className = "winning-fix center";
        firework(
          {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          },
          "#chatList"
        );

        clearTimeout(vm.durationTimer);
        clearTimeout(vm.endTimer);
        vm.durationTimer = setTimeout(() => {
          winningFix.className = "winning-fix end";
          //     clearTimeout(vm.durationTimer)
        }, 4500);

        vm.endTimer = setTimeout(() => {
          winningFix.className = "winning-fix";
          vm.winList.splice(0, 1);
          //        clearTimeout(vm.endTimer)
        }, 5000);
      }, time);
    },
    async handleFollowInput() {
      const config = await this.$store.dispatch("querySystemConfig");
      this.followAllowInput = config.FOLLOW_ENTERAMOUNT == "1" ? true : false;
    },
    clearPeriodsTimer() {
      this.periodsTimer && clearInterval(this.periodsTimer);
    },
    //接收粘切图片的回调
    receivePasteImgCallBack(base64Url, blob) {
      const { isAdmin, isCustomerService } = this.chatPeopleInfo;
      if (isAdmin === "0" && !isCustomerService) return;
      this.pasteImgUrl = base64Url;
      this.pasteImgBlob = blob;
      this.isShowPasteWp = true;
    },
    //发送粘贴的图片消息
    sendPasteImgMsg() {
      this.isShowPasteWp = false;
      const vm = this;

      const imgMessage = new RongYun.MessageManager.ImgMessage({
        content: this.pasteImgUrl,
        imageUri: this.pasteImgUrl,
      });

      imgMessage.state = MessageLocalStatus.LOADING;
      imgMessage.progress = "0%";
      imgMessage.sentTime = new Date().getTime();

      vm.addList(imgMessage);

      const messageContent = RongYun.MessageManager.getInstance().addMessageExData(
        imgMessage
      ).content;
      const msgBody = Object.assign(
        { file: this.pasteImgBlob },
        messageContent
      );

      RongYun.MessageManager.sendImageMessage(
        {
          targetId: this.ryChatRoomId,
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
          imgMessage.progress = vm.$tex("发送失败");
        });
    },
  },
};
</script>

<style scoped lang="less">
@imgSrc: "~@/assets/images/chat";
@deep: ~">>>";
@import "./chat.less";

.index-chat {
  width: 100%;
  float: left;
  height: 100%;

  .chat-inner {
    background: #fff;
    border-right: 1px solid #e3e3e3;
    display: flex;
    flex-direction: column;
    height: 100%;

    .chat-room-name-bottom {
      flex: 1;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .chat-quick-reply {
      position: relative;

      .content {
        position: absolute;
        z-index: 10;
        height: 300px;
        bottom: 46px;
        box-shadow: 0 0px 1px rgba(0, 0, 0, 0.2);
        width: 100%;
        background-color: #ffffff;
        overflow: auto;

        li {
          cursor: pointer;
          text-align: center;
          line-height: 46px;
          border-bottom: 1px solid #eee;
        }
      }

      .bottom {
        position: relative;
        z-index: 11;
        cursor: pointer;
        height: 46px;
        line-height: 46px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        text-align: center;
        background-color: #ffffff;
      }
    }
  }

  .fromTip {
    position: absolute;
    top: 220px;
    text-align: center;
    /*   color: @primary-color; */
    cursor: pointer;
    right: 0;
    height: 40px;
    line-height: 40px;
    width: 76px;
    white-space: nowrap;
    text-align: center;
    box-shadow: 0 0 10px 4px #eee;
    border-top-left-radius: 34px;
    border-bottom-left-radius: 34px;
    z-index: 101;
    background: #fff;
  }

  .fromTrans-enter-active,
  .fromTrans-leave-active {
    transition: right 0.5s;
  }

  .fromTrans-enter,
  .fromTrans-leave-to {
    right: -76px;
  }
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

.chat-history,
.chat-welcome {
  text-align: center;
  margin-bottom: 10px;

  span {
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 4px 10px;
  }
}

.chat-more-records {
  font-size: 14px;
  color: #808080;
  text-align: center;
  margin-bottom: 5px;
}

.scroll-bottom {
  position: absolute;
  right: 20px;
  bottom: 190px;
  z-index: 99;
  cursor: pointer;
  width: 30px;

  .num {
    display: block;
    width: 20px;
    height: 20px;
    margin: 0 auto;
    background-color: #127dec;
    text-align: center;
    color: #fff;
    border-radius: 100%;
    z-index: 10;
    position: relative;
    font-size: 12px;
  }

  .ivu-icon {
    width: 30px;
    height: 30px;
    display: block;
    margin-top: -5px;
    border: 1px solid #ddd;
    border-radius: 100%;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    color: #999;
  }
}
</style>
<style lang="less">
@imgSrc: "~@/assets/images/chat";
@import "./chat.less";

.chat-noitce marquee * {
  white-space: nowrap;
  display: inline;
}

.ivu-spin-dot {
  display: none;
}

.fullScreen {
  .ivu-modal {
    text-align: center;

    .ivu-modal-content {
      display: inline-block;
    }
  }

  .ivu-modal-content {
    background-color: transparent;
    max-width: 800px;
    text-align: center;
    border: none;
    // position: static;
    //  transform: translate3d(0, 0, 0);
  }

  .ivu-modal-close {
    background: #293240;
    display: inline-block;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    border-radius: 100%;
    position: absolute;
    right: -20px;
    top: -20px;
    z-index: 10;

    .ivu-icon-ios-close-empty {
      top: -3px;
      color: #fff;
    }
  }

  img {
    float: none;
    width: auto;
    max-width: 100%;
    max-height: 85vh;
    //max-height: 600px;
  }

  .ivu-modal-body {
    text-align: center;
    display: inline-block;
  }

  .ivu-modal-footer {
    display: none;
  }
}

.chat-model {
  .btn-wrap {
    text-align: center;
    margin: 10px auto;
  }

  .btn-red {
    display: inline-block;
    //  margin: 10px auto;
    padding: 0 15px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-radius: 5px;
    /*   background-color: @primary-color; */
    color: #fff;
    min-width: 100px;
    cursor: pointer;

    &.disabled {
      background-color: #eee;
      color: #999;
      // color: #999;
    }
  }

  .ivu-modal-footer {
    display: none;
  }
}

.chaseBetting-detail {
  margin-bottom: 30px;
  padding: 0 20px;

  li {
    border-bottom: 1px solid #e6e6e6;
    font-size: 16px;
    overflow: hidden;
    padding: 10px 0;

    .lb {
      margin-right: 20px;
      float: left;
    }

    .val {
      color: #d81c28;
      display: inline-block;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 80px;
    }
  }
}

.redpacket-dlg2 {
  .ivu-icon-load-c {
    display: none;
  }

  .ivu-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  .balance {
    text-align: left;
    font-size: 16px;
    padding-left: 40px;

    .money {
      color: #fc4c4c;
    }
  }

  .ivu-modal-footer {
    display: none;
  }

  /*   .btn-red {
            display: block;
            margin: 10px auto;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border-radius: 5px;
            background-color: #be1204;
            color: #fff;
            width: 100px;
            cursor: pointer;
        } */

  .ivu-form-item-error-tip {
    position: absolute;
    top: 29px;
  }

  .redpacketDesc {
    .ivu-form-item-error-tip {
      top: 48px;
    }
  }

  .ivu-modal-content {
    .ivu-modal-header {
      background: transparent;
    }
  }
}

.redpacket-dlg {
  .ivu-modal-content {
    // position: fixed;
    // top: 50%;
    // left: 50%;
    // transform: translate3d(-50%, -50%, 0);
    width: 415px;
    height: 448px;
    background: url("@{imgSrc}/redpackt-bg.png");
    background-repeat: no-repeat;
    border: none !important;
  }

  .ivu-modal-footer {
    display: none;
  }

  .ivu-modal-close {
    background-color: #fff;
    width: 30px;
    height: 30px;
    line-height: -8px;
    border-radius: 100%;
    text-align: center;

    .ivu-icon-ios-close-empty {
      color: #000;
    }
  }

  .btn {
    position: absolute;
    bottom: 36px;
    left: 79px;
    border: 0;
    color: #ef412f;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }

  .btn-me {
    left: 229px;
  }
}

.chat-context-menu {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  box-shadow: 0 0 3px #eee;
  position: fixed;
  left: 288px;
  top: 250px;
  z-index: 500;

  li {
    border-bottom: 1px solid #eee;
    padding: 5px 30px;
    cursor: pointer;

    &:last-child {
      border-bottom: 0;
    }
  }
}

.index-chat {
  position: relative;
  overflow: hidden;
}

.winning-fix {
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -50px;
  // transform: translateX(100%);
  /*  background-color: rgba(0, 0, 0, 0.5); */
  background: #ff430f;
  background: linear-gradient(to right, #ff430f, #ff0f9e);
  border: 2px solid #fff000;
  padding: 2px 20px 2px 85px;
  border-radius: 40px;
  font-size: 16px;
  width: 400px;
  display: table;
  line-height: 20px;

  &.center {
    transition: all 0.5s linear;
    left: 50%;
    transform: translateX(-50%);
  }

  &.end {
    transition: all 0.5s linear;
    left: 0;
    transform: translateX(-110%);
  }

  .name {
    color: #9cff00;
  }

  .money {
    color: #fffc00;
  }

  color: #fff;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 80px;
    height: 80px;
    background: url("@{imgSrc}/gxzj.png") no-repeat;
  }
  &[en="true"]::before {
    background: url("@{imgSrc}/gxzj-en.png") no-repeat;
  }
  &::after {
    content: "";
    position: absolute;
    right: -20px;
    bottom: 10px;
    width: 57px;
    height: 69px;
    background: url("@{imgSrc}/gxzj-qiqiu.png") no-repeat;
  }
}

.chat-fix {
  position: absolute;
  right: 10px;
  top: 140px;
  text-align: center;

  li {
    cursor: pointer;
    margin-bottom: 10px;
  }

  img {
    width: 50px;
  }
}

.redpacketDetail-dlg {
  .ivu-modal-content {
    width: 600px;
    min-height: 431px;

    .redpacket-info {
      text-align: center;
    }

    .me-hd {
      width: 60px;
      height: 60px;
      display: block;
      margin: 10px auto;
      float: none;
      border-radius: 100%;
      margin-bottom: 10px;
    }

    .me-name {
      color: #000;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .me-money {
      margin-bottom: 5px;

      .num {
        font-size: 30px;
      }
    }

    .link {
      display: inline-block;
      margin-bottom: 10px;
      color: #ff8935;
      cursor: pointer;
    }

    .tip {
      color: #7f8388;
      margin-bottom: 20px;
    }
  }

  .redpacket-box {
    .box-hd {
      height: 35px;
      line-height: 35px;
      color: #666;
      background-color: #eeeeee;
      padding: 0 20px;
    }
  }

  .redpacket-list {
    max-height: 200px;
    overflow-y: scroll;

    li {
      padding: 8px 20px;
      height: 60px;
      overflow: hidden;
      position: relative;
      border-bottom: 1px solid #cbcbcb;

      &:last-child {
        border-bottom: none;
      }

      .hd {
        height: 28px;
        width: 28px;
        margin-right: 6px;
        border-radius: 100%;
        margin-top: 5px;
      }

      .cont {
        float: left;
        width: 300px;

        .name {
          font-size: 14px;
        }

        .time {
          color: #7f8388;
        }
      }

      .money {
        float: right;
        margin-top: 10px;
      }
    }
  }
}

.getpacket-dlg {
  .ivu-modal-content {
    width: 300px;
    height: 431px;
    padding-top: 30px;
    background: url("@{imgSrc}/hb-bg.png") no-repeat;
    border: none !important;
  }

  .ivu-modal-close {
    background-color: #fff;
    width: 30px;
    height: 30px;
    line-height: -8px;
    border-radius: 100%;
    text-align: center;
    right: 0;
    top: -23px;
  }

  .hd {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    float: none;
  }

  .name {
    text-align: center;
    color: #fbdec0;
    font-size: 16px;
    margin-bottom: 30px;
  }

  .dec {
    padding: 0 20px;
    max-height: 75px;
    overflow: hidden;
    text-align: center;
    color: #fbdec0;
    font-size: 16px;
  }

  .open {
    height: 90px;
    width: 90px;
    position: absolute;
    bottom: 94px;
    left: 50%;
    margin-left: -45px;
    cursor: pointer;
    background: url("@{imgSrc}/open-bg.png") no-repeat;
    &.en {
      background: url("@{imgSrc}/open-bg-en.png") no-repeat;
    }
    &.openning {
      animation: chat-openning 1s 0s linear infinite;
    }
  }

  .look {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    color: #fbdeb0;
  }

  /*   .ivu-modal-close {

            right: inherit;
            top: inherit;
            left: 30px;
            top: 40px;
            z-index: 10;
            background-color: transparent;
            .ivu-icon-ios-close-empty {
                color: #fff;
                font-size: 38px;
            }
        } */
}

@keyframes chat-loading {
  from {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes chat-openning {
  from {
    transform: rotateY(0deg);
  }

  50% {
    transform: rotateY(180deg);
  }

  to {
    transform: rotateY(360deg);
  }
}

/* .ivu-spin-dot {
        background-color: #127dec;
        animation: ani-demo-spin 1s 0s ease-in-out infinite;
    } */
/* .demo-spin-icon-load::before {
        content: 'sssssssssssss'; //\F45B
        display: block;
        width: 20px;
        height: 20px;
    }
    @keyframes chat-loading {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    } */
.share-bet-msg {
  width: 306px;
  min-height: 142px;
  background: url("~@/assets/images/record/cp_bg.png") no-repeat top;
  background-size: cover;
  color: #ffffff;
  padding: 4px 12px;
  font-size: 16px;
  cursor: pointer;
  position: relative;

  img {
    position: absolute;
    right: 9px;
    top: 8px;
    border-radius: 100%;
    width: 56px;
    height: 56px;
  }

  .title {
    font-weight: bold;
    position: relative;
    z-index: 1;
  }

  .lot-period {
    font-size: 14px;
  }

  .balls {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*li {*/
    /*    display: inline-block;*/
    /*    border-radius: 100%;*/
    /*    background-color: #ffffff;*/
    /*    color: #fe5655;*/
    /*    width: 24px;*/
    /*    height: 24px;*/
    /*    line-height: 26px;*/
    /*    text-align: center;*/
    /*    font-weight: bold;*/
    /*}*/
  }

  .lot-num {
    font-weight: bold;
    margin-top: 10px;
  }

  .play {
    font-size: 14px;
    line-height: 1;
  }

  .footer {
    margin-top: 11px;
    font-size: 14px;
    padding: 0 0;
    background: initial;
  }

  .bet-money,
  .prize-money {
    color: #fddd0b;
    font-size: 16px;
  }

  .follow {
    font-size: 16px;
    float: right;
  }
}

.today-record {
  width: 306px;
  min-height: 358px;
  background: url("~@/assets/images/record/hb_bg.png") no-repeat 0 20px;
  background-size: 100%;
  box-sizing: content-box;
  text-align: center;
  font-weight: bold;

  h1 {
    color: #ffffff;
    -webkit-text-stroke: 1.6px #f55739;
    -webkit-text-fill-color: #ffffff;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
  }

  .today-record__content {
    width: auto;
    padding: 156px 10px 0;
    color: #ffffff;
    font-size: 20px;
    > em {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .lottery {
      float: left;
      width: 50%;
    }

    .win {
      float: right;
      width: 50%;
    }

    .lottery,
    .win {
      margin: 0px 0px 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      div:nth-child(2) {
        overflow: hidden;
      }
    }
    .lottery div:nth-child(1),
    .win div:nth-child(1) {
      height: 54px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .lottery div:nth-child(2),
    .win div:nth-child(2) {
      color: #ffec7f;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .today-record__footer {
    padding-top: 20px;
    height: 130px;
  }
}

.onekey-follow {
  cursor: pointer;
  width: 300px;

  > img {
    display: block;
    width: 100%;
    height: 52px;
  }
}

.onekey-follow-wrap {
  white-space: pre-wrap;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(0deg, #fff, #fff),
    linear-gradient(90deg, #a32dd8, #3180fd);
  border: 2px solid transparent;
  border-bottom-width: 0;
  border-top-right-radius: 4px;
  padding: 10px;
  color: #7d49e4;

  p {
    color: #7d49e4;
    font-size: 12px;
  }
}

.onekey-follow-btn {
  position: relative;
  top: -1px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  height: 40px;
  line-height: 40px;
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  background-image: linear-gradient(90deg, #a32dd8, #3180fd),
    linear-gradient(90deg, #a32dd8, #3180fd);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
