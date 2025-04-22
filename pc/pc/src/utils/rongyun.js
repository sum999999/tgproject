import ryEmoji from "ryEmoji"; //融云表情
import Store from "@/store";
import Logger from "@/utils/logger";
import utils from "@/utils/utils";
import context from "@/main";

import {
  MessageObjectNames,
  PushTypes,
  RongYunConnectStatus,
} from "@/constant/rongyun";

import { getChineseKey, getLanguage } from "@/lang/index";

import isEmpty from "lodash/isEmpty";
import DateUtil from "@/utils/format_date.js";
import isString from "lodash/isString";
import isArray from "lodash/isArray";

import { checkChineseKey } from "@/lang";

const RongIMLib = window.RongIMLib;
const RCS = window.RCS;

let token = null;

export const emoji = {
  init: function() {
    ryEmoji.init();
    return ryEmoji.list;
  },
  emojiToHTML: function(emojiContent) {
    return ryEmoji.emojiToHTML(emojiContent);
  },
  symbolToEmoji: function(sym) {
    return ryEmoji.symbolToEmoji(sym);
  },
  getEmoji: function() {
    return ryEmoji.list.map(function(data) {
      return data.node;
    });
  },
};
// 自定义表情配置
export function getGifConfig() {
  let gifConfig = {
    staticSrc: "/static/images/chat/",
    groups: [
      {
        groupName: "emoji1",
        groupImg: require("@/assets/images/chat/gif-gulid1.png"),
        len: 31,
        prefix: "lottery",
        list: [],
      },
      {
        groupName: "emoji2",
        groupImg: require("@/assets/images/chat/gif-gulid2.png"),
        len: 16,
        prefix: "chick",
        list: [],
      },
    ],
  };
  if (!checkChineseKey()) {
    gifConfig.groups.splice(0, 1);
  }

  for (let groups of gifConfig.groups) {
    for (let j = 1; j < groups.len; j++) {
      groups.list.push({
        src: groups.prefix + "_" + j + ".gif",
      });
    }
  }
  return gifConfig;
}

// 待移除 不该存在此文件内
export const BarOption = {
  barColor: "#959595", //滚动条颜色
  barWidth: 6, //滚动条宽度
  railColor: "#eee", //导轨颜色
  barMarginRight: 0, //垂直滚动条距离整个容器右侧距离单位（px）
  barMaginBottom: 0, //水平滚动条距离底部距离单位（px)
  barOpacityMin: 0.3, //滚动条非激活状态下的透明度
  zIndex: "auto", //滚动条z-Index
  autohidemode: true, //自动隐藏模式
  horizrailenabled: false, //是否显示水平滚动条
};

/**
 * 调用connectRongYun前必须调用此方法初始化融云
 * @param appKey
 */
export function initRongYun(appkey) {
  RongIMLib.init({ appkey });
}

/**
 * 获取融云实例
 * @return {*}
 */
export function getRongYunInstance() {
  return RongIMLib.getInstance();
}

/**
 * 设置监听
 */
export function setWatch(options = {}) {
  const { onReceived, onChanged } = options;

  const Events = RongIMLib.Events;
  /**
   * 正在链接的事件状态
   */
  RongIMLib.addEventListener(Events.CONNECTING, () => {
    Logger.prefixed.log("融云", "正在连接中");
    onChanged && onChanged(RongYunConnectStatus.CONNECTING);
  });

  /**
   * 链接到服务器会触发这个事件
   */
  RongIMLib.addEventListener(Events.CONNECTED, () => {
    Logger.prefixed.log("融云", "链接成功");
    onChanged && onChanged(RongYunConnectStatus.CONNECTED);
  });

  /**
   * 手动调用 disconnect 方法或者用户被踢下线 会触发这个事件
   */
  RongIMLib.addEventListener(Events.DISCONNECT, () => {
    Logger.prefixed.log("融云", "连接中断");
    onChanged && onChanged(RongYunConnectStatus.DISCONNECTED);
  });

  /**
   * 链接出问题时，内部进行重新链接，会出发这个事件
   */
  RongIMLib.addEventListener(Events.SUSPEND, () => {
    Logger.prefixed.log("融云", "链接异常断开(自动重连)");
    onChanged && onChanged(RongYunConnectStatus.SUSPEND);
  });

  RongIMLib.addEventListener(Events.MESSAGES, (res) => {
    const messages = res.messages || [];
    messages.forEach((message) => {
      onReceived && onReceived(message);
    });
  });
}

/**
 * 连接到融云
 * @param token
 * @param options {onSuccess, onTokenIncorrect, onError}
 */
export function connectRongYun(newToken, options = {}) {
  const { onSuccess, onError } = options;
  token = newToken;
  RongIMLib.connect(token).then((res) => {
    const code = res.code;
    if (code === 0) {
      onSuccess && onSuccess(res.data.userId);
    } else {
      Logger.prefixed.error(`融云','连接错误 code: ${code}`);
      onError && onError(new Error(`${code}`));
    }
  });
}
/**
 * 断开链接
 */
export function disconnect() {
  return logout();
}
/**
 * 退出融云登陆
 */
export function logout() {
  Logger.prefixed.debug("融云", "logout");
  try {
    RongIMLib.getConnectionStatus();
  } catch (e) {
    return e;
  }
  return RongIMLib.disconnect().then(() => {
    Logger.prefixed.debug("融云", "连接已断开");
  });
}
/**
 * 重新连接到融云
 * @param options
 */
export function reconnect(options = {}) {
  const { onSuccess, onError } = options;
  RongIMLib.connect(token).then((res) => {
    const code = res.code;
    if (code === 0) {
      Logger.prefixed.log("融云", "Reconnect successfully. " + res.data.userId);
      onSuccess && onSuccess(res.data.userId);
    } else {
      Logger.prefixed.error("融云", "重新链接失败", new Error(`${code}`));
      onError && onError(new Error(`${code}`));
    }
  });
}
/**
 * 加入聊天室
 * @param chatRoomId 聊天室 id
 * @param count 拉取聊天数, 范围 0 - 50
 * @param options {onSuccess, onError}
 */
export function joinChatRoom(chatRoomId, count, options = {}) {
  const { onSuccess, onError } = options;
  RongIMLib.joinChatRoom(chatRoomId, {
    count,
  })
    .then((res) => {
      if (res.code === 0) {
        Logger.prefixed.log("融云", `加入聊天室成功，请求历史消息数量${count}`);
        onSuccess && onSuccess();
      } else {
        const e = new Error(`code: ${res.code}, msg: ${res.msg}`);
        onError && onError(e);
      }
    })
    .catch((error) => {
      onError && onError(error);
    });
}
/**
 * 退出聊天室
 * @param chatRoomId 聊天室 id
 * @param options {onSuccess, onError}
 */
export function quitChatRoom(chatRoomId, options = {}) {
  const { onSuccess, onError } = options;
  RongIMLib.quitChatRoom(chatRoomId)
    .then((res) => {
      if (res.code === 0) {
        Logger.prefixed.debug("融云", "退出聊天室成功");
        onSuccess && onSuccess();
      } else {
        const e = new Error(`code: ${res.code}, msg: ${res.msg}`);
        Logger.prefixed.error("融云", "退出聊天室失败", e);
        onError && onError(e);
      }
    })
    .catch((e) => {
      Logger.prefixed.error("融云", "退出聊天室失败", e);
      onError && onError(e);
    });
}
export function sendMessage(conversationType, targetId, message, options = {}) {
  const { onSuccess, onError } = options;

  switch (conversationType) {
    case RongIMLib.ConversationType.PRIVATE:
      sendPrivateMessage(targetId, message)
        .then((res) => {
          Logger.prefixed.debug("融云", "私聊消息发送成功", res);
          onSuccess && onSuccess(res.data);
        })
        .catch((e) => {
          Logger.prefixed.debug("融云", "私聊消息发送失败", e);
          onError && onError(e);
        });
      break;
    case RongIMLib.ConversationType.CHATROOM:
      sendChatRoomMessage(targetId, message)
        .then((res) => {
          Logger.prefixed.debug("融云", "聊天室消息发送成功", res);
          onSuccess && onSuccess(res.data);
        })
        .catch((e) => {
          Logger.prefixed.debug("融云", "聊天室消息发送失败", e);
          onError && onError(e);
        });
      break;
  }
}

/**
 * 发送私聊消息
 * @param targetId
 * @param message
 * @return {*}
 */
export function sendPrivateMessage(targetId, message) {
  const conversation = {
    conversationType: RongIMLib.ConversationType.PRIVATE,
    targetId,
  };
  return RongIMLib.sendMessage(conversation, message);
}

/**
 * 发送聊天室消息
 * @param targetId
 * @param message
 * @return {*}
 */
export function sendChatRoomMessage(targetId, message) {
  const conversation = {
    conversationType: RongIMLib.ConversationType.CHATROOM,
    targetId,
  };
  return RongIMLib.sendMessage(conversation, message);
}

/**
 * 获取会话列表
 * @return {*|Array}
 */
export function getConversationList() {
  return RongIMLib.getConversationList({
    count: 1000,
  }).then((res) => {
    let conversationList = res.data || [];
    if (res.code === 0) {
      if (conversationList.length) {
        conversationList = conversationList.map((conversation) => {
          conversation.latestMessage = MessageManager.normalize(
            conversation.latestMessage
          );
          return conversation;
        });
      }
      return conversationList;
    } else {
      Logger.prefixed.error(
        "融云",
        "获取会话列表失败",
        new Error(`code: ${res.code} msg: ${res.msg}`)
      );
    }
  });
}

/**
 *  获取历史消息
 */
export function getHistoryMessages(conversationType, targetId, options = {}) {
  const defaultOpts = Object.assign(
    {
      timestamp: 0,
      count: 20,
      order: 0,
    },
    options
  );

  switch (conversationType) {
    case RongIMLib.ConversationType.PRIVATE:
      return getPrivateHistoryMessages(targetId, defaultOpts);
    case RongIMLib.ConversationType.CHATROOM:
      return getChatRoomHistoryMessage(targetId, defaultOpts);
  }
}

/**
 * 获取私聊历史消息
 */
export function getPrivateHistoryMessages(targetId, options = {}) {
  return RongIMLib.getHistoryMessages(
    {
      targetId: targetId,
      conversationType: RongIMLib.ConversationType.PRIVATE,
    },
    options
  )
    .then((res) => {
      if (res.code === 0) {
        const list = res.data.list || [];
        res.data.list = list.map((message) => {
          return MessageManager.normalize(message);
        });
        Logger.prefixed.log("融云", "获取私聊历史消息成功");
        return res.data;
      }
      Logger.prefixed.error(
        "融云",
        "获取私聊历史消息失败",
        new Error(`code: ${res.code} msg: ${res.msg}`)
      );
      return {
        list: [],
        hasMore: false,
      };
    })
    .catch((error) => {
      Logger.prefixed.error("融云", "获取私聊历史消息失败", error);
    });
}

/**
 * 获取聊天室历史消息
 */
export function getChatRoomHistoryMessage(targetId, options = {}) {
  return RongIMLib.getChatroomHistoryMessages(targetId, options)
    .then((res) => {
      if (res.code === 0) {
        const list = res.data.list || [];
        res.data.list = list.map((message) => {
          return MessageManager.normalize(message);
        });
        Logger.prefixed.log("融云", "获取聊天室历史消息成功");
        return res.data;
      }
      Logger.prefixed.error(
        "融云",
        "获取聊天室历史消息失败",
        new Error(`code: ${res.code} msg: ${res.msg}`)
      );
      return {
        list: [],
        hasMore: false,
      };
    })
    .catch((error) => {
      Logger.prefixed.error("融云", "获取聊天室历史消息失败", error);
    });
}

/**
 * 删除会话
 * @param targetId
 * @param options
 */
export function removeConversation(targetId, options = {}) {
  const defaultOpts = Object.assign(
    {
      conversationType: RongIMLib.ConversationType.PRIVATE,
    },
    options
  );
  return RongIMLib.removeConversation({
    conversationType: defaultOpts.conversationType,
    targetId: targetId,
  })
    .then((res) => {
      if (res.code === 0) {
        Logger.prefixed.debug("融云", "删除指定会话成功");
      } else {
        Logger.prefixed.error(
          "融云",
          "删除指定会话成功失败",
          new Error(`code: ${res.code} msg: ${res.msg}`)
        );
      }
    })
    .catch((error) => {
      Logger.prefixed.error("融云", "删除指定会话成功失败", error);
    });
}

/**
 * 清除会话未读数
 * @param targetId
 * @param option
 * @return {Promise<any>}
 */
export function clearUnreadCount(targetId, options = {}) {
  const defaultOpts = Object.assign(
    {
      conversationType: RongIMLib.ConversationType.PRIVATE,
    },
    options
  );

  return RongIMLib.clearMessagesUnreadStatus({
    conversationType: defaultOpts.conversationType,
    targetId,
  })
    .then((res) => {
      if (res.code === 0) {
        Logger.prefixed.debug("融云", "清除指定会话未读数成功");
      } else {
        Logger.prefixed.error(
          "融云",
          "清除指定会话未读数成功",
          new Error(`code: ${res.code} msg: ${res.msg}`)
        );
      }
    })
    .catch((error) => {
      Logger.prefixed.error("融云", "清除指定会话未读数成功", error);
    });
}

export function deleteMessages(targetId, messages, options = {}) {
  const defaultOpts = Object.assign(
    {
      conversationType: RongIMLib.ConversationType.PRIVATE,
    },
    options
  );

  return RongIMLib.deleteMessages(
    {
      conversationType: defaultOpts.conversationType,
      targetId,
    },
    messages
  )
    .then((res) => {
      if (res.code === 0) {
        Logger.prefixed.debug("融云", "删除消息成功");
      } else {
        Logger.prefixed.error(
          "融云",
          "删除消息失败",
          new Error(`code: ${res.code} msg: ${res.msg}`)
        );
      }
    })
    .catch((error) => {
      Logger.prefixed.error("融云", "删除消息失败", error);
    });
}
/**
 * 扩展功能
 */
export const FeatureEx = {
  hideUserCode(userCode) {
    if (!userCode) return;
    return (
      userCode.substr(0, 2) +
      "***" +
      userCode.substr(userCode.length - 2, userCode.length)
    );
  },
};

/**
 * // const testMessage = MessageManager.factory("TextMessage");
 * // testMessage.setContent("123456");
 * // testMessage.setExtra();
 * // textMessage.generate();
 */
export const MessageManager = (function() {
  const MessageManager = function() {};
  MessageManager.prototype = {
    constructor: MessageManager,
    printName: function() {
      throw new Error("printName未被实现");
    },
    getContentByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      return message.content || {};
    },
    getRemoteDataByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      const extra = this.getExtraByMessage(message);
      return extra.data || {};
    },
    getUserByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      const messageContent = this.getContentByMessage(message);
      return messageContent.user || {};
    },
    getExtraByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      const messageContent = this.getContentByMessage(message);
      return messageContent.extra || {};
    },
    getSenderUserByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      const extra = this.getExtraByMessage(message);
      return extra.senderUser || {};
    },
    getReceiveUserByMessage(message) {
      if (isEmpty(message)) {
        return {};
      }
      const extra = this.getExtraByMessage(message);
      return extra.receiveUser || {};
    },
    getUserNameByStore() {
      const userCode = this.getUserCodeByStore();
      if (userCode) {
        return (
          Store.state.user.nickName ||
          FeatureEx.hideUserCode(Store.state.chat.chatUser.name)
        );
      }
      return FeatureEx.hideUserCode(Store.state.chat.chatUser.name);
    },
    getUserByStore: function() {
      const name = this.getUserNameByStore();
      const id = this.getUserIdByStore();
      const portrait = this.getUserPortrait();
      return {
        id,
        name,
        portrait,
      };
    },
    getSenderUserByStore: function() {
      const name = this.getUserNameByStore();
      const userCode = this.getUserCodeByStore();
      const userLevelIcon = this.getUserLevelIconByStore();
      const nickName = this.getUserNickNameByStore();
      const id = this.getUserIdByStore();
      const portrait = this.getUserPortrait();
      return {
        id,
        name,
        nickName,
        portrait,
        userCode,
        userLevelIcon,
      };
    },
    setSenderUser(message, senderUser) {
      if (isEmpty(message)) {
        throw new Error("setSenderUser方法传入的message参数不能为空");
      }
      message.content.extra.senderUser = senderUser;
    },
    addSenderUser(message) {
      if (isEmpty(message)) {
        throw new Error("addSenderUser方法传入的message参数不能为空");
      }
      const senderUser = this.getSenderUserByStore();
      message.content.extra.senderUser = senderUser;
    },
    getKUserMarkTypeByStore: function() {
      if (!Store.state.user.userId) {
        return "kUserMarkType_UnLogin"; // 未登录
      } else if (Store.state.user.userType === "09") {
        return "kUserMarkType_Guest"; // 试玩
      }
      return "kUserMarkType_Login"; // 登录
    },
    getUserLevelIconByStore: function() {
      return Store.state.user.userLevelIcon;
    },
    getUserCodeByStore: function() {
      return FeatureEx.hideUserCode(Store.state.user.userCode);
    },
    getUserNickNameByStore: function() {
      return Store.state.user.nickName;
    },
    getUserIdByStore: function() {
      return Store.state.chat.chatUser.uid;
    },
    getUserPortrait: function() {
      return Store.state.chat.chatUser.portrait;
    },
    getReceiveUser: function(id, name, portrait, userLevelIcon) {
      return {
        id,
        name,
        portrait,
        userLevelIcon,
      };
    },
    setUser(message, user) {
      if (isEmpty(message)) {
        throw new Error("setUser方法传入的message参数不能为空");
      }
      message.content.user = user;
      return message;
    },
    addUser(message) {
      if (isEmpty(message)) {
        throw new Error("addUser方法传入的message参数不能为空");
      }
      const user = this.getUserByStore();
      message.content.user = user;
      return message;
    },
    setReceiveUser: function(message, receiveUser) {
      if (isEmpty(message)) {
        throw new Error("addReceiveUser方法传入的message参数不能为空");
      }
      message.content.extra.receiveUser = receiveUser;
      return message;
    },
    addMessageExData: function(message) {
      if (isEmpty(message)) {
        throw new Error("addMessageExData方法传入的message参数不能为空");
      }
      if (isEmpty(message.content.extra)) {
        message.content.extra = {};
      }
      const user = this.getUserByStore();
      const senderUser = this.getSenderUserByStore();
      const kUserMarkType = this.getKUserMarkTypeByStore();
      const userCode = this.getUserCodeByStore();
      const sendUserLevelIcon = this.getUserLevelIconByStore();
      message.content.user = user;
      message.content.extra.senderUser = senderUser;
      message.content.extra.kUserMarkType = kUserMarkType;
      message.content.extra.userCode = userCode;
      message.content.extra.sendUserLevelIcon = sendUserLevelIcon;
      return message;
    },
  };

  for (let stakey in MessageManager) {
    for (let commonMethod in MessageManager.prototype) {
      if (MessageManager.prototype.hasOwnProperty(commonMethod)) {
        if (MessageManager[stakey].prototype[commonMethod]) continue;
        MessageManager[stakey].prototype[commonMethod] =
          MessageManager.prototype[commonMethod];
      }
    }
    if (MessageManager[stakey].prototype.proxyHandler) {
      MessageManager[stakey].prototype = new Proxy(
        MessageManager[stakey].prototype,
        MessageManager[stakey].prototype.proxyHandler
      );
    }
  }

  MessageManager._instance = new MessageManager();

  MessageManager.factory = function(type) {
    return new MessageManager[type]();
  };

  const normalizeByMessageType = {
    [MessageObjectNames.HB](message) {
      const extra = message.content.extra;
      const lang = getLanguage();
      const originRemarkText = extra.remark;
      const originDscText = extra.redpacketDesc;
      const toI18nText = extra.remarkI18n && extra.remarkI18n[lang];
      const zhRemarkText =
        extra.remarkI18n && extra.remarkI18n[getChineseKey()];
      extra.hourly = (zhRemarkText || originRemarkText) === "整点红包";
      extra.remark = toI18nText ? toI18nText : originRemarkText;
      extra.redpacketDesc =
        originRemarkText === originDscText ? toI18nText : originRemarkText;
    },
    [MessageObjectNames.FOLLOW_LOTTERY](message) {
      const extra = message.content.extra;
      const extraData = extra.data;
      let dataArr = [];
      if (!extraData) {
        return void 0;
      } else if (isString(extraData.data)) {
        try {
          dataArr = JSON.parse(extraData.data) || [];
        } catch (e) {
          console.log("normalizeByMessageType error", e);
        }
      } else {
        return void 0;
      }
      const lang = getLanguage();
      const langData = (
        dataArr.find((item) => {
          return item.lang === lang;
        }) || { data: null }
      ).data;
      if (!!langData && isString(langData)) {
        extra.data = {
          ...extra.data,
          ...JSON.parse(langData),
        };
      }
    },
    [MessageObjectNames.FOLLOW_ORDER](message) {
      const extra = message.content.extra;
      const extraData = extra.data;
      let dataArr = [];
      if (!extraData) {
        return void 0;
      } else if (isArray(extraData)) {
        dataArr = extraData;
      } else if (isString(extraData.data)) {
        try {
          dataArr = JSON.parse(extraData.data) || [];
        } catch (e) {
          console.log("normalizeByMessageType error", e);
        }
      } else {
        return void 0;
      }
      const lang = getLanguage();
      const langData = (
        dataArr.find((item) => {
          return item.lang === lang;
        }) || { data: null }
      ).data;
      if (!!langData && isString(langData)) {
        extra.data = {
          ...extra.data,
          ...JSON.parse(langData),
        };
      }
    },
    [PushTypes.FIREWORKS_EXPLODE](message) {
      const extra = message.content.extra;
      const extraData = extra.data;
      let dataArr = [];
      if (!extraData) {
        return void 0;
      } else if (isString(extraData.data)) {
        try {
          dataArr = JSON.parse(extraData.data) || [];
        } catch (e) {
          console.log("normalizeByMessageType error", e);
        }
      } else {
        return void 0;
      }
      const lang = getLanguage();
      const langData = (
        dataArr.find((item) => {
          return item.lang === lang;
        }) || { data: null }
      ).data;
      if (!!langData && isString(langData)) {
        extra.data = {
          ...extra.data,
          ...JSON.parse(langData),
        };
      }
    },
    [MessageObjectNames.SHARE_BET_MSG](message) {
      const extra = message.content.extra;
      const extraData = extra.data;
      let dataArr = [];
      if (!extraData) {
        return void 0;
      } else if (isArray(extraData)) {
        dataArr = extraData;
      } else if (isString(extraData.data)) {
        try {
          dataArr = JSON.parse(extraData.data) || [];
        } catch (e) {
          console.log("normalizeByMessageType error", e);
        }
      } else {
        return void 0;
      }
      const lang = getLanguage();
      const langData = (
        dataArr.find((item) => {
          return item.lang === lang;
        }) || { data: null }
      ).data;
      if (!!langData && isString(langData)) {
        extra.data = {
          ...extra.data,
          ...JSON.parse(langData),
        };
      }
    },
    [PushTypes.LOTTERY_ORDER](message) {
      const extra = message.content.extra;
      const alertI18n = extra.aps.alertI18n;
      const lang = getLanguage();
      const text = alertI18n && alertI18n[lang];
      extra.message = text ? text : extra.message;
    },
    [PushTypes.MEMBER_MSG](message) {
      this[PushTypes.LOTTERY_ORDER](message);
    },
    [PushTypes.GIFT_BAG_ALERT](message) {
      this[PushTypes.LOTTERY_ORDER](message);
    },
  };

  return {
    normalize(message) {
      try {
        let messageContent = message.content || {};
        if (messageContent.message) {
          message = Object.assign(message, messageContent.message);
          messageContent = message.content;
        }
        let extra = messageContent.extra || {};
        if (isString(extra)) {
          messageContent.extra = extra = JSON.parse(extra);
        }
        if (messageContent.extra && messageContent.extra.user) {
          messageContent.user = {
            ...messageContent.user,
            ...messageContent.extra.user,
          };
        }
        normalizeByMessageType[message.messageType] &&
          normalizeByMessageType[message.messageType](message);
        normalizeByMessageType[extra.type] &&
          normalizeByMessageType[extra.type](message);
      } catch (e) {
        console.log(e, message);
      }
      return message;
    },
    getInstance() {
      return MessageManager._instance;
    },
    factory(type) {
      return MessageManager.factory(type);
    },
    RedPacketMessage: function(msgBody = {}) {
      return new RongIMLib.BaseMessage(MessageObjectNames.HB, msgBody);
    },
    WelcomeMessage: function(msgBody = {}) {
      return new RongIMLib.BaseMessage(MessageObjectNames.WELCOME, msgBody);
    },
    EmojiMessage: function(msgBody = {}) {
      return new RongIMLib.BaseMessage(MessageObjectNames.EMOJI, msgBody);
    },

    ImgMessage: RongIMLib.ImageMessage,
    TextMessage: function(msgBody = {}) {
      Object.assign(msgBody, {
        content: emoji.symbolToEmoji(msgBody.content || ""),
      });
      return new RongIMLib.TextMessage(msgBody);
    },
    sendImageMessage: function(
      conversation = {},
      msgBody = {},
      hooks = {},
      options = {}
    ) {
      conversation = Object.assign(
        {
          conversationType: RongIMLib.ConversationType.CHATROOM,
        },
        conversation
      );
      return RongIMLib.sendImageMessage(
        conversation,
        msgBody,
        hooks,
        options
      ).then((res) => {
        if (res.code === 0) {
          Logger.prefixed.debug("融云", `发送图片消息成功`);
          return res.data;
        }
        throw new Error(`code: ${res.code}`);
      });
    },
  };
})();

export function redPacketMsgHandler(message) {
  let messageName = message.messageType;

  if (messageName === MessageObjectNames.HB) {
    message.state = 1;
    // let user = {};
    // if (!!message.content) {
    //     user = message.content.user
    // } else {
    //     user = message.user;
    // }
    // let obj = {
    //     sentTime: message.sentTime,
    //     messageUId: message.messageUId,
    //     user,
    //     state: 1
    // };
    //
    // let extra =
    //     message.extra || message.content.extra ||
    //     (message.content.message &&
    //         message.content.message.content &&
    //         message.content.message.content.extra);
    //
    // if (typeof extra === "string") {
    //     extra = JSON.parse(extra);
    // }
    //
    // if (extra) {
    //     if (obj.user) {
    //         obj.user.sendUserLevelIcon = extra.sendUserLevelIcon;
    //         obj.user.userCode = extra.userCode;
    //         obj.kUserMarkType = extra.kUserMarkType;
    //     }
    // }
    // // 红包消息
    // var tmpMsg = Object.assign(obj, {
    //     type: "redpacket",
    //     role: "redpacket",
    //     remark: extra.remark,
    //     redpacketChatId: extra.redpacketChatId,
    //     objectName: SELF_MESSAGE_TYPE.HB_Msg_TYPE,
    //     messageName: messageName,
    //     messageType: message.messageType
    // });
    // return Object.assign(tmpMsg, message);
  }

  return message;
}

export function chatFormateDate(value) {
  if (!value) return "";
  let date = new Date(value);
  let currentDate = new Date();
  if (
    Math.abs(currentDate.getTime() - date.getTime()) < 1000 * 3600 * 24 &&
    Math.abs(currentDate.getDate() - date.getDate()) <= 0
  ) {
    date = DateUtil.getFormatDate2(date, "hh:mm:ss"); /* yymmddhhmmss */
    return date;
  } else if (Math.abs(currentDate.getFullYear() - date.getFullYear()) <= 0) {
    return DateUtil.getFormatDate2(date, "MM-dd hh:mm:ss");
  } else {
    return DateUtil.getFormatDate2(date, "yyyy-MM-dd hh:mm:ss");
  }
}

export function initPrivateListHeight() {
  let privateList = document.querySelector("#privateList");
  let chatControl = document.querySelector("#privateChatControl");
  let winH = window.innerHeight;
  if (privateList) {
    privateList.style.height =
      winH -
      privateList.getBoundingClientRect().top -
      chatControl.clientHeight +
      "px";
  }
}
