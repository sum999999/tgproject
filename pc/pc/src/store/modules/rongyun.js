import isEmpty from 'lodash/isEmpty'

import store from '@/store'
import Logger from '@/utils/logger'
import { uuid } from '@/utils/utils'
import { logout } from '@/utils/rongyun'
import { registerRongYunAccount, getRongYunToken } from '@/api/rongyun'
import { RongYunKeys, RongYunChatRoomJoinStatus, RongYunConnectStatus } from '@/constant/rongyun'
import * as RongYun from '@/utils/rongyun'

import {
  SAVE_RONGYUN_INFO,
  SAVE_RONGYUN_TOKEN_INFO,
  SET_CHAT_USER,
  SAVE_RONGYUN_CHATROOM_JOIN_STATUS,
  SAVE_RONGYUN_CONNECT_STATUS,
  ADD_RONGYUN_MESSAGE,
  SAVE_RONGYUN_CONVERSATION_LIST,
} from '../mutation_types'

import EventBus from '@/utils/eventBus'

const RongIMLib = window.RongIMLib
const MAX_MESSAGE_STORE = 100
let isInitRongYun = false
function GetRongYunInfo() {
  let result = {}
  try {
    result = JSON.parse(window.localStorage.getItem(RongYunKeys.RONGYUN_USER_INFO) || null) || {}
  } catch (e) {
    console.log(e)
  }
  return result
}

export default {
  state: {
    rongYunInfo: GetRongYunInfo(), // 游客加入融云的信息
    tokenInfo: {}, // 登陆的用户加入融云的信息
    chatRoomJoinStatus: RongYunChatRoomJoinStatus.OFF, // 聊天室加入状态
    rongYunConnectStatus: null, // 融云连接状态
    messageStore: [], // 存储所有接收到的消息体
    conversationStore: [],
    connectedStatus: false,
  },
  getters: {
    rongYunInfo: (state) => state.rongYunInfo,
    chatRoomJoinStatus: (state) => state.chatRoomJoinStatus,
    rongYunConnectStatus: (state) => state.rongYunConnectStatus,
    messageStore: (state) => state.messageStore,
  },
  mutations: {
    /**
     * 保存游客加入融云的信息到store与localStorage中
     * @param state
     * @param playload {rongYunUserId, token}
     */
    [SAVE_RONGYUN_INFO](state, playload) {
      const { rongYunUserId, token, userCode } = playload || {}
      const result = { rongYunUserId, token, name: userCode }
      state.rongYunInfo = result
      window.localStorage.setItem(RongYunKeys.RONGYUN_USER_INFO, JSON.stringify(result))
    },
    /**
     * 保存登陆的用户加入融云的信息到store
     * @param state
     * @param playload {token, userId}
     */
    [SAVE_RONGYUN_TOKEN_INFO](state, playload) {
      const { token, userId } = playload || {}
      state.tokenInfo = {
        token,
        userId,
      }
    },
    [SAVE_RONGYUN_CHATROOM_JOIN_STATUS](state, playload) {
      state.chatRoomJoinStatus = playload
    },
    [SAVE_RONGYUN_CONNECT_STATUS](state, playload) {
      state.rongYunConnectStatus = playload
    },
    [ADD_RONGYUN_MESSAGE](state, playload) {
      if (state.messageStore.length >= MAX_MESSAGE_STORE) {
        state.messageStore.shift()
      }
      state.messageStore.push(playload)
    },
    [SAVE_RONGYUN_CONVERSATION_LIST](state, playload) {
      state.conversationStore = playload
    },
  },
  actions: {
    /**
     * 使用此action连接到融云
     * @return {Promise<void>}
     */
    async connectRongYun({ state, commit, dispatch, getters, rootGetters, rootState }, playload) {
      state.connectedStatus = false
      const user = rootState.user
      let token, uid, name, portrait
      if (isEmpty(user)) {
        await dispatch('registerRongYunAccount')
        uid = state.rongYunInfo.rongYunUserId
        name = state.rongYunInfo.name
        portrait = ''
        token = state.rongYunInfo.token
      } else {
        await dispatch('queryRongYunToken')
        uid = state.tokenInfo.userId
        name = RongYun.FeatureEx.hideUserCode(user.userCode)
        portrait = user.imgUrl
        token = state.tokenInfo.token
      }
      commit(SET_CHAT_USER, { uid, name, portrait }) // 重构旧代码而加入的适配，后期会移除
      if (!isInitRongYun) {
        isInitRongYun = true

        await dispatch('querySystemConfig')
        const {
          sysConfig: { ryAppKey },
        } = rootState.sysDict
        RongYun.initRongYun(ryAppKey)
        RongYun.setWatch({
          onReceived: function (message) {
            if (!localStorage.getItem('user') && !isEmpty(user)) {
              logout()
            }
            const normalizeMessage = RongYun.MessageManager.normalize(message)
            EventBus.dispatch('messageStore', normalizeMessage)
            store.commit(ADD_RONGYUN_MESSAGE, normalizeMessage)
          },
          onChanged: (status) => {
            switch (status) {
              case RongYunConnectStatus.CONNECTED:
                if (state.connectedStatus) {
                  store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.CONNECTED)
                }
                break
              case RongYunConnectStatus.CONNECTING:
                store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.CONNECTING)
                break
              case RongYunConnectStatus.DISCONNECTED:
                store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.DISCONNECTED)
                store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.OFF)
                break
              case RongYunConnectStatus.SUSPEND:
                store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.SUSPEND)
                store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.OFF)
                break
            }
          },
        })
      }
      let ready, reject
      const readyPromise = new Promise((r, e) => {
        ready = r
        reject = e
      })

      RongYun.connectRongYun(token, {
        onSuccess: (userId) => {
          state.connectedStatus = true
          store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.CONNECTED)
          ready(userId)
        },
        onError: (error) => {
          store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.ERROR)
          reject(error)
        },
      })
      return readyPromise
    },
    /**
     * 重连到融云
     * @return {Promise<any>}
     */
    async reConnectRongYun({ state, commit, dispatch, getters, rootGetters, rootState }, playload) {
      let ready, reject
      const readyPromise = new Promise((r, e) => {
        ready = r
        reject = e
      })

      RongYun.reconnect({
        onSuccess: (userId) => {
          store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.CONNECTED)
          ready(userId)
        },
        onError: (error) => {
          store.commit(SAVE_RONGYUN_CONNECT_STATUS, RongYunConnectStatus.ERROR)
          reject(error)
        },
      })
      return readyPromise
    },
    /**
     * 加入聊天室
     * 必须在连接融云成功后才可以调用
     * 不传入chatRoomId聊天室id则取系统默认配置内开奖聊天室id
     * @param playload {chatRoomId, count = 0, options: {onSuccess, onError}}
     * @return {Promise<any>}
     */
    async joinRongYunChatRoom({ state, commit, dispatch, getters, rootGetters, rootState }, playload) {
      const { chatRoomId, count = 0, options } = playload || {}
      const { onSuccess, onError } = options || {}

      await dispatch('querySystemConfig')
      const {
        sysConfig: { chatRoomId: globalChatRoomId },
      } = rootState.sysDict

      let ready, reject
      const readyPromise = new Promise((r, e) => {
        ready = r
        reject = e
      })
      RongYun.joinChatRoom(chatRoomId || globalChatRoomId, count, {
        onSuccess: function () {
          store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.ON)
          onSuccess && onSuccess()
          ready()
        },
        onError: function (error) {
          store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.ERROR)
          onError && onError(error)
          reject(error)
        },
      })

      return readyPromise
    },
    /**
     * 退出聊天室
     * 不传入chatRoomId聊天室id则取系统默认配置聊天室id
     * @param playload {chatRoomId, options: {onSuccess, onError}}
     * @return {Promise<any>}
     */
    async quitChatRoom({ state, commit, dispatch, getters, rootGetters, rootState }, playload) {
      const { chatRoomId, options } = playload || {}
      const { onSuccess, onError } = options || {}

      await dispatch('querySystemConfig')
      const {
        sysConfig: { chatRoomId: globalChatRoomId },
      } = rootState.sysDict

      let ready, reject
      const readyPromise = new Promise((r, e) => {
        ready = r
        reject = e
      })

      RongYun.quitChatRoom(chatRoomId || globalChatRoomId, {
        onSuccess: function () {
          store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.OFF)
          onSuccess && onSuccess()
          ready()
        },
        onError: function (error) {
          store.commit(SAVE_RONGYUN_CHATROOM_JOIN_STATUS, RongYunChatRoomJoinStatus.ERROR)
          onError && onError(error)
          reject(error)
        },
      })
      return readyPromise
    },
    /**
     * 发送消息
     * @param playload {conversationType, targetId, message, {onSuccess, onError}}
     * @return {Promise<any>}
     */
    async sendMessage({ state, commit, dispatch, getters, rootGetters, rootState }, playload) {
      const { conversationType = RongIMLib.ConversationType.CHATROOM, targetId, message, options } = playload || {}
      const { onSuccess, onError } = options || {}

      await dispatch('querySystemConfig')
      const {
        sysConfig: { chatRoomId: globalChatRoomId },
      } = rootState.sysDict

      let ready, reject
      const readyPromise = new Promise((r, e) => {
        ready = r
        reject = e
      })

      RongYun.sendMessage(conversationType, targetId || globalChatRoomId, message, {
        onSuccess: function (message) {
          onSuccess && onSuccess(message)
          ready(message)
        },
        onError: function (error) {
          onError && onError(error)
          reject(error)
        },
      })
      return readyPromise
    },
    async registerRongYunAccount({ state, commit, dispatch }, playload) {
      let rongYunUserId = state.rongYunInfo.rongYunUserId
      if (!rongYunUserId) {
        rongYunUserId = uuid()
      }
      const res = await registerRongYunAccount({
        rongYunUserId,
      })
      const { code, data } = res.data
      if (code !== 0) {
        Logger.prefixed.error('融云', res.data)
        return void 0
      }
      commit(SAVE_RONGYUN_INFO, data)
      return data
    },
    async queryRongYunToken({ state, commit, dispatch }, playload) {
      const res = await getRongYunToken({})
      const { code, data } = res.data
      if (code !== 0) {
        Logger.prefixed.error('融云', res.data)
        return void 0
      }
      commit(SAVE_RONGYUN_TOKEN_INFO, data)
      return data
    },
  },
}
