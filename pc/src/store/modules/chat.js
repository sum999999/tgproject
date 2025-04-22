/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑     永不宕机     永无BUG
 *
 * @Author:
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-10 10:53:51
 * @FilePath: \pc\src\store\modules\chat.js
 * @Description: 头部注释
 */

import {
  SET_CHAT_CONTACTS_LIST,
  ADD_CHAT_CONTACT,
  ADD_CHAT_MANAGER,
  SET_CHAT_MANAGER,
  DEL_CHAT_CONTACT,
  SET_CHAT_USER,
  UPDATE_CHAT_CONTACT,
  SET_CHAT_SHOW_PRIVATE_WIN,
  SET_CHAT_CURRENT_CONTACT,
  UPATE_CHAT_CONTACT_MESSAGE,
  UPDATE_CHAT_MANAGER_MESSAGE,
  SET_RY_CONNECT_SUCCESS,
  UPDATE_UNREAD_COUNT,
  SET_CHAT_LOADING_MORE_MESSAGE,
  IS_CONTACTS_JOIN_SUCCESS,
  SET_CHAT_CURRENT_ROOM,
  SET_CHAT_CONTACT_ROOMINFO,
  SET_CHAT_ISLOADING_USERLIST,
  SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE,
  SET_OPEN_PRIVATE_MSG_NOTICE_SWITCH,
  REMOVE_CHAT_PRIVATE_MESSAGE,
  SET_CHAT_PUSH_MEMBER_MSG,
  SET_CHAT_TEAM,
} from "../mutation_types";
import * as RongYun from "@/utils/rongyun";
import { getUserChatRank, queryUserInfo } from "@/api/chat";

const MAX_CHAT_LIST = 500;

const Chat = {
  state: {
    ryConnectSuccess: false,
    contactsList: [],
    managerList: [],
    showPrivateWin: false,
    isLoadingMoreMessage: false,
    isContactsJoinSuccess: false,
    currentContact: {},
    currentRoom: {},
    contactRoomInfo: {},
    chatUser: {},
    isLoaddingUserList: false,
    isShowSinglePrivateMsgNotice: {}, //是否显示私聊消息的通知
    isOpenPrivateMsgNoticeSwitch: true, //是否打开私聊消息通知开关
    chatPushMemberMsg: {}, // 后台推送会员消息
    teamChat: "", // 团队成员聊天权限
  },
  getters: {
    chatCurrentRoom: (state) => state.currentRoom,
    chatUser: (state) => state.chatUser,
    chatContactsList: (state) => state.contactsList,
    chatManagerList: (state) => state.managerList,
    chatMessageUlist: (state) => state.messageUlist,
    chatShowPrivateWin: (state) => state.showPrivateWin,
    chatCurrentContact: (state) => state.currentContact,
    chatRyConnectSuccess: (state) => state.ryConnectSuccess,
    chatIsLoadingMoreMessage: (state) => state.isLoadingMoreMessage,
    chatIsContactsJoinSuccess: (state) => state.isContactsJoinSuccess,
    chatContactRoomInfo: (state) => state.contactRoomInfo,
    chatIsLoaddingUserList: (state) => state.isLoaddingUserList,
    isShowSinglePrivateMsgNotice: (state) => state.isShowSinglePrivateMsgNotice,
    isOpenPrivateMsgNoticeSwitch: (state) => state.isOpenPrivateMsgNoticeSwitch,
    chatPushMemberMsg: (state) => state.chatPushMemberMsg,
    teamChat: (state) => state.teamChat,
  },
  mutations: {
    [SET_CHAT_PUSH_MEMBER_MSG]: (state, payload) => {
      state.chatPushMemberMsg = payload;
    },
    [SET_RY_CONNECT_SUCCESS]: (state, playload) => {
      state.ryConnectSuccess = playload;
    },
    [SET_CHAT_USER]: (state, playload) => {
      state.chatUser = playload;
    },
    [SET_CHAT_CURRENT_ROOM]: (state, playload) => {
      state.currentRoom = playload;
    },
    [SET_CHAT_CONTACT_ROOMINFO]: (state, playload) => {
      state.contactRoomInfo = playload;
    },
    [SET_CHAT_ISLOADING_USERLIST]: (state, playload) => {
      state.isLoaddingUserList = playload;
    },
    /**
     * @团队聊天权限
     *
     */
    [SET_CHAT_TEAM]: (state, playload) => {
      state.teamChat = playload;
    },
    /**
     * @设置消息
     *
     */
    [SET_CHAT_CONTACTS_LIST]: (state, playload) => {
      state.contactsList = playload;
    },
    /**
     * @是否是接收消息
     *
     */
    [SET_CHAT_LOADING_MORE_MESSAGE]: (state, playload) => {
      state.isLoadingMoreMessage = playload;
    },
    /**
     * @是否联系人表拉取成功
     *
     */
    [IS_CONTACTS_JOIN_SUCCESS]: (state, playload) => {
      state.isContactsJoinSuccess = playload;
    },
    [SET_CHAT_MANAGER]: (state, playload) => {
      state.managerList = playload;
    },
    [REMOVE_CHAT_PRIVATE_MESSAGE]: (state, playload) => {
      const { message, toUser } = playload;
      const contactsList = state.contactsList;
      const index = contactsList.findIndex(
        (item) => item.userInfo.id === toUser.id
      );
      if (index > -1) {
        const contact = contactsList[index];
        const msgList = contact.msgList;
        for (let i = 0, len = msgList.length; i < len; i++) {
          if (
            msgList[i] &&
            message.content.extra.messageUId === msgList[i].messageUId
          ) {
            msgList.splice(i, 1);
            if (msgList[i - 1] && msgList[i - 1].timeState) {
              msgList.splice(i - 1, 1);
            }

            break;
          }
        }
        if (contact.msgList.length) {
          contact.lastMessage = contact.msgList[contact.msgList.length - 1];
        } else {
          contact.lastMessage = {};
        }
      }
    },
    /**
     * @添加客服/管理员
     *
     */
    [ADD_CHAT_MANAGER]: (state, playload) => {
      /*     const { contact, isTop } = playload
            const managerList = state.managerList
            const index = managerList.findIndex(
                item => item.userInfo.id === contact.userInfo.id
            )
            if (index > -1) {
                managerList.splice(index, 1, contact)
            } else {
                managerList.push(contact)
            }
            state.managerList = managerList */
    },
    /**
     * @添加消息
     *
     */
    [ADD_CHAT_CONTACT]: (state, playload) => {
      const { contact, isTop } = playload;
      const contactsList = state.contactsList;
      const index = contactsList.findIndex(
        (item) => item.userInfo.id === contact.userInfo.id
      );
      if (index > -1) {
        if (
          contact &&
          contact.lastMessage.sentTime >=
            contactsList[index].lastMessage.sentTime
        ) {
          contactsList.splice(index, 1);
          contactsList.unshift(contact);
        }
      } else {
        if (isTop) {
          contactsList.unshift(contact);
        } else {
          contactsList.push(contact);
        }
      }

      state.contactsList = contactsList;
    },
    [UPDATE_CHAT_CONTACT]: (state, playload) => {
      const { contact } = playload;
      const contactsList = state.contactsList;

      if (contact.userInfo.id) {
        let index = contactsList.findIndex(
          (item) => item.userInfo.id === contact.userInfo.id
        );

        contactsList.splice(index, 1, contact);
        state.contactsList = contactsList;
      }
    },

    /**
     * @更新消息的状态等
     *
     */
    [UPATE_CHAT_CONTACT_MESSAGE]: (state, playload) => {
      const { message, toUser } = playload;
      const contactsList = state.contactsList;
      const index = contactsList.findIndex(
        (item) => item.userInfo.id === toUser.id
      );
      if (index > -1) {
        const userChatInfo = contactsList[index];
        const msgIndex = userChatInfo.msgList.findIndex(
          (item) => item && item.messageUId === message.messageUId
        );
        if (msgIndex > -1) {
          userChatInfo.msgList[msgIndex] = RongYun.redPacketMsgHandler(message);
        }
        contactsList[index] = userChatInfo;
        state.currentContact = userChatInfo;
      }
    },

    /**
     * @打开私人聊天窗口
     *
     */
    [SET_CHAT_SHOW_PRIVATE_WIN]: (state, playload) => {
      state.showPrivateWin = playload;
      if (!playload) {
        state.currentContact = {};
      }
    },
    /**
     * @设置当前私聊信息
     *
     */
    [SET_CHAT_CURRENT_CONTACT]: (state, playload) => {
      state.currentContact = playload;
    },
    /**
     * @是否显示私聊消息通知
     *
     */
    [SET_SHOW_SINGLE_PRIVATE_MSG_NOTICE]: (state, payload) => {
      state.isShowSinglePrivateMsgNotice = payload;
    },
    /**
     * @是否打开私聊消息通知开关
     *
     */
    [SET_OPEN_PRIVATE_MSG_NOTICE_SWITCH]: (state, payload) => {
      state.isOpenPrivateMsgNoticeSwitch = payload;
    },
  },
  actions: {
    /**
     * 加载更多历史记录
     * @param {*} param0
     * @param {*} playload
     */
    async loadMoreMessage({ state, rootState, commit }, playload) {
      const currentContact = state.currentContact;

      let timestamp = null;
      if (currentContact.msgList && currentContact.msgList.length) {
        timestamp = currentContact.msgList[0].sentTime;
      }
      commit("SET_CHAT_LOADING_MORE_MESSAGE", true);
      const hisResult = await RongYun.getHistoryMessages(
        RongIMLib.ConversationType.PRIVATE,
        currentContact.userInfo.id,
        {
          timestamp,
        }
      ); //拉取历史数据

      const hisMessage = hisResult.list;
      const historyDelMsgList = [];
      const historyFilterMsgList = [];

      for (let i = 0; i < hisMessage.length; i++) {
        const curMessage = hisMessage[i];

        if (curMessage.content && curMessage.content.user) {
          let extra = curMessage.content.extra;
          if (typeof extra === "string") {
            extra = JSON.parse(extra);
          }
          if (extra && extra.type === "100") {
            historyDelMsgList.push(extra);
            continue;
          }
          // curMessage.content.user.userCode = extra.senderUser.userCode;
        }

        historyFilterMsgList.push(RongYun.redPacketMsgHandler(curMessage));
      }

      const beforeLength = currentContact.msgList.length;
      let msgList = (currentContact.msgList = historyFilterMsgList.concat(
        ...currentContact.msgList
      ));
      for (let i = 0; i < historyDelMsgList.length; i++) {
        const historyDelMsg = historyDelMsgList[i];
        // 删除消息
        for (let i = 0; i < msgList.length; ) {
          if (
            msgList[i] &&
            historyDelMsg.messageUId === msgList[i].messageUId
          ) {
            msgList.splice(i, 1);
            if (msgList[i - 1] && msgList[i - 1].timeState) {
              msgList.splice(i - 1, 1);
              i > 0 && i--;
            }
            break;
          }
          i++;
        }
      }
      const afterLength = currentContact.msgList.length;

      currentContact.msgList = currentContact.msgList.filter((item) => item);
      commit("SET_CHAT_CURRENT_CONTACT", currentContact);
      commit("UPDATE_CHAT_CONTACT", {
        contact: currentContact,
      });
      commit("SET_CHAT_LOADING_MORE_MESSAGE", false);
      return afterLength !== beforeLength;
    },
    /**
     * @移除某个人的会话记录
     */
    async removeChatConversation({ state, rootState, commit }, playload) {
      const { index } = playload;
      const contactsList = state.contactsList;
      const contact = contactsList[index];
      const { userInfo, targetId } = contact;
      const { userInfo: cureUser = {} } = state.currentContact;
      await RongYun.removeConversation(targetId);
      if (userInfo.id === cureUser.id) {
        state.currentContact = {};
        state.showPrivateWin = false;
      }
      contactsList.splice(index, 1);
      commit(SET_CHAT_CONTACTS_LIST, contactsList);
    },
    /**
     * @添加会话列表系统房
     */
    setConversationRoom: ({ state, rootState, commit }, playload) => {
      let { lastMessage, unreadMessageCount = 0 } = playload;
      const contactRoomInfo = state.contactRoomInfo;
      if (state.showPrivateWin) {
        unreadMessageCount = contactRoomInfo.unreadMessageCount;
        unreadMessageCount++;
      }
      commit("SET_CHAT_CONTACT_ROOMINFO", {
        room: state.currentRoom,
        lastMessage,
        unreadMessageCount,
      });
    },

    /**
     * @添加会话列表
     *
     */
    async addConversationList(
      { state, rootState, commit, dispatch },
      playload
    ) {
      let { message, unreadMessageCount, canSendMsg, targetId } = playload;
      let { user = {} } = message.content;
      let { uid } = state.chatUser;
      const manageList = state.managerList;
      let lastMessage = message;
      let extra = lastMessage.content.extra;
      if (typeof extra == "string") {
        extra = JSON.parse(extra);
      }
      let receiveUser = extra.receiveUser;
      if (uid == user.id && receiveUser) {
        if (typeof receiveUser === "string") {
          receiveUser = JSON.parse(receiveUser);
        }
        // 最后一条消息是自己的则去取对方 获取会话列表用到
        user = receiveUser;
        user.sendUserLevelIcon = receiveUser.userLevelIcon;
      } else {
        user.sendUserLevelIcon = extra.sendUserLevelIcon;
      }

      if (!user.id || user.id === uid) return;

      const validateIsCustComer = function(userId) {
        for (let idx in manageList) {
          const { userInfo } = manageList[idx];
          const { id } = userInfo || {};
          if (id === userId) {
            return true;
          }
        }
        return false;
      };

      const userChatInfo = {
        msgList: [lastMessage],
        userInfo: user,
        lastMessage: lastMessage,
        unreadMessageCount: unreadMessageCount || 0,
        targetId,
      };

      if (validateIsCustComer(user.id)) {
        userChatInfo.userInfo.isManager = true;
      }

      if (canSendMsg) {
        userChatInfo.userInfo.canSendMsg = canSendMsg;
      }

      commit(ADD_CHAT_CONTACT, {
        contact: userChatInfo,
      });
    },
    /**
     * 判断当前窗口是否是客服或者是管理员的信息
     * @param {*} param0
     * @param {*} playload
     */
    isManagerMessage: ({ state, rootState }, playload) => {
      const { contactsList, currentContact } = state;
      const managerList = contactsList.filter(
        (item) => item.userInfo.isManager
      );
      let { currentUser } = playload;
      let currentUserInfo = currentUser || currentContact.userInfo || {};
      return (
        managerList.findIndex(
          (item) =>
            //   item.userInfo.id === rootState.user.userId ||
            item.userInfo.id === currentUserInfo.id
        ) > -1
      );
    },
    /**
     * 设置当前窗口的最后一条信息
     * @param {*} param0
     * @param {*} playload
     */
    getUserChatInfo: ({ state, commit, dispatch }, playload) => {
      let { contactType, user, message } = playload;
      message = RongYun.redPacketMsgHandler(message);
      const contactsList = state[contactType];
      let index = contactsList.findIndex(
        (item) => item.userInfo.id === user.id
      );
      let userChatInfo = contactsList[index];
      if (!userChatInfo) {
        userChatInfo = {
          msgList: [],
          unreadMessageCount: 0,
        };
      }
      const { userInfo: curUser = {} } = state.currentContact || {};
      // 已经在会话窗口
      if (user.id == curUser.id) {
        userChatInfo.unreadMessageCount = 0;
      } else {
        userChatInfo.unreadMessageCount++;
      }
      if (userChatInfo.msgList.length >= MAX_CHAT_LIST) {
        userChatInfo.msgList.splice(0, 1);
      }
      /*     user.sendUserLevelIcon =
                message.extra && message.extra.sendUserLevelIcon */
      // userChatInfo.userInfo = user
      if (index >= 0) {
        userChatInfo.userInfo = contactsList[index].userInfo;
      } else {
        userChatInfo.userInfo = user;
      }
      userChatInfo.msgList.push(message);
      userChatInfo.lastMessage = message;
      return userChatInfo;
    },

    /**
     * @接收消息
     *
     */
    async addChatReceivePrivateUsers({ state, commit, dispatch }, playload) {
      if (!state.isContactsJoinSuccess) {
        return;
      }
      let { message, canSendMsg } = playload;
      let user = message.content.user;
      if (!user) return;

      let extra = message.content.extra || {};
      const uid = state.chatUser.uid;
      // 聊天室多方登录消息同步
      if (uid == user.id) {
        const receiveUser = {
          canSendMsg: true,
          ...extra.receiveUser,
          sendUserLevelIcon: extra.sendUserLevelIcon,
        };
        user = receiveUser;
      }

      if (typeof extra === "string") {
        extra = JSON.parse(extra);
      }

      if (extra) {
        if (extra.type === "100") {
          let index = state.contactsList.findIndex(
            (item) => item.userInfo.id === user.id
          );
          let userChatInfo = state.contactsList[index];
          if (userChatInfo && userChatInfo.msgList) {
            const msgList = userChatInfo.msgList;
            // 删除消息
            for (let i = 0; i < msgList.length; i++) {
              if (msgList[i] && extra.messageUId === msgList[i].messageUId) {
                let spmsg = msgList.splice(i, 1);
                if (
                  msgList[msgList.length - 1] &&
                  msgList[msgList.length - 1].timeState
                ) {
                  spmsg = msgList.splice(msgList.length - 1, 1);
                }

                if (userChatInfo.msgList.length) {
                  userChatInfo.lastMessage =
                    userChatInfo.msgList[userChatInfo.msgList.length - 1];
                } else {
                  userChatInfo.lastMessage = spmsg;
                }
                if (userChatInfo.unreadMessageCount) {
                  userChatInfo.unreadMessageCount--;
                }
                break;
              }
            }
            userChatInfo.msgList = userChatInfo.msgList.filter((item) => item);
          }
          return;
        }
        // message.content.user.userCode = extra.senderUser.userCode;
      }

      user.sendUserLevelIcon = extra.sendUserLevelIcon;

      const userChatInfo = await dispatch("getUserChatInfo", {
        message,
        user,
        contactType: "contactsList",
      });
      userChatInfo.userInfo.canSendMsg = canSendMsg;
      commit(ADD_CHAT_CONTACT, {
        contact: userChatInfo,
        isTop: true,
      });
    },
    /**
     * @添加消息或者更新列表 发消调用
     *
     */
    async addChatSendPrivateUsers({ state, commit, dispatch }, playload) {
      if (!state.isContactsJoinSuccess) {
        return;
      }
      let { message, toUser: user } = playload;
      if (!user) return;
      const userChatInfo = await dispatch("getUserChatInfo", {
        message,
        user,
        contactType: "contactsList",
      });
      commit(ADD_CHAT_CONTACT, {
        contact: userChatInfo,
        isTop: true,
      });
    },
    /**
     * @打开私人列表
     *
     */
    async setChatCurrentContact({ commit, state, dispatch }, playload) {
      let { userInfo = {}, msgList = [] } = playload;
      commit("SET_CHAT_SHOW_PRIVATE_WIN", true); // 打开窗口
      await RongYun.clearUnreadCount(userInfo.id);

      let index = state.contactsList.findIndex(
        (item) => item.userInfo.id === userInfo.id
      );

      let currentContact = state.contactsList[index] || {
        lastMessage: null,
        targetId: userInfo.id,
        msgList: [],
        userInfo,
        unreadMessageCount: 0,
      };

      currentContact.msgList.length = 0;
      if (
        !currentContact ||
        !currentContact.msgList ||
        !currentContact.msgList.length
      ) {
        const hisResult = await RongYun.getHistoryMessages(
          RongIMLib.ConversationType.PRIVATE,
          userInfo.id,
          {
            timestamp: 0,
          }
        );
        //拉取历史数据
        let hisMessage = hisResult.list;
        for (let i = 0; i < hisMessage.length; i++) {
          const curMessage = hisMessage[i];
          if (curMessage.content && curMessage.content.user) {
            let extra = curMessage.content.extra;
            if (typeof extra === "string") {
              curMessage.content.extra = extra = JSON.parse(extra);
            }
            if (extra && extra.senderUser && extra.senderUser.userCode) {
              curMessage.content.user.userCode = extra.senderUser.userCode;
            }
          }
          // fix msgList array push stack
          msgList.push(RongYun.redPacketMsgHandler(curMessage));
        }
      } else {
        msgList = currentContact.msgList;
      }

      const delMsgList = [];
      for (let i = 0; i < msgList.length; ) {
        const curMessage = msgList[i];

        if (curMessage.content.extra) {
          let extra = curMessage.content.extra;
          if (typeof extra === "string") {
            extra = JSON.parse(extra);
          }
          if (extra && extra.type === "100") {
            delMsgList.push(extra);
            msgList.splice(i, 1);
            continue;
          }
        }
        i++;
      }

      for (let i = 0; i < delMsgList.length; i++) {
        const delMsg = delMsgList[i];
        // 删除消息
        for (let i = 0; i < msgList.length; i++) {
          if (msgList[i] && delMsg.messageUId === msgList[i].messageUId) {
            msgList.splice(i, 1);
            if (
              msgList[msgList.length - 1] &&
              msgList[msgList.length - 1].timeState
            ) {
              msgList.splice(msgList.length - 1, 1);
            }
            break;
          }
        }
        msgList = msgList.filter((item) => item);
      }

      currentContact = {
        userInfo: userInfo,
        targetId: userInfo.id,
        msgList: msgList,
        unreadMessageCount: 0,
        lastMessage: currentContact.lastMessage || null,
      };
      commit(SET_CHAT_CURRENT_CONTACT, currentContact);
      if (index < 0) {
        // 添加用户
        commit(ADD_CHAT_CONTACT, {
          contact: currentContact,
          isTop: true,
        });
      } else {
        commit(UPDATE_CHAT_CONTACT, {
          contact: currentContact,
        });
      }
    },
    async getUserChatRank({ commit }, playload) {
      return await getUserChatRank(playload);
    },
    async queryUserInfo({ commit }, playload) {
      return await queryUserInfo(playload);
    },
  },
};

export default Chat;
