import Vue from "vue";
import Vuex from "vuex";
import EventBus from "@/utils/eventBus";
import { hasPermission } from "@/utils/authority-utils";
import {
  SET_DEFAULT_LOTTERY_SELECT,
  SET_LOTTERY_SELECT_LIST,
} from "./mutation_types";

Vue.use(Vuex);

const user = localStorage.getItem("user");

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context("./modules", true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default new Vuex.Store({
  state: {
    // configList: [],
    user: user ? JSON.parse(user) : {},
    preiodInfo: {},
    isSales: "",
    servicer: "",
    qrcodes: [],
    showLoginDialog: false,
    mbHeadData: {
      leftData: "登录",
    },
    netStatus: false,
    resourceId: undefined,
    updateNotice: "",
    updateRecord: "",
    betDetailDialog: "",
    anotherObj: null, //another页面内容
    isLogin: false, //是否登录
    isSuccessModal: false, //投注成功弹框
    freePlayValue: 0,
    isClosePie: false, //判断是否封盘
    isIpForbid: "", //ip是否被限制
    rongImConnectState: 0, //融云链接状态 0: 初始值, 1: 获取token成功，2:融云链接成功
    configList: [], //全局配置
    yebInfo: {}, //余额宝信息
    chatPeopleData: {},
    prizeEndTime: "", //计算六合彩的生肖--endTime
    wmInstance: "", //调用（网易盾）接口的实例
    diffPlaceLogin: false, // 异地登录弹框
    diffLoginExtraInfo: "{}", //异地登录异常，返回的手机号
    cacheLoginUserInfo: "", //登录异常，缓存的登录信息
    diffLoginKaptchaFlag: "", //异地登录的KaptchaFlag
    roomPwdDialogInfo: {}, //是否显示进入房间的密码
    chatRoomInfo: {}, //
    chatRoomId: "",
    systemMaintenanceInfo: {}, // 系统维护信息
    sysModalText: "",
    regAddDefaultExpandStatus: true, // 用户注册后，后台会默认生成与账号相同的邀请码，而且用户可以自定义邀请码名。为false则表示后台创建默认邀请码失败，提示注册用户去创建邀请码
    tplv5LoginBoxVisible: false,
  },
  modules,
  getters: {
    user: (state) => state.user,
    isLogin: (state) => state.user && !!state.user.userId,
    userAreaCode: (state) => state.user && state.user.areaCode,
    isTryUser: (state) => state.user.userType === "09", //试玩账号
    isLoginUser: (state) => !!state.user.userId,
    userCurrency: (state) => state.user.currency,
    chatPeopleData: (state) => state.chatPeopleData,
    systemMaintenanceInfo: (state) => state.systemMaintenanceInfo,
    sysModalText: (state) => state.sysModalText,
    regAddDefaultExpandStatus: (state) => state.regAddDefaultExpandStatus,
    qrcodes: (state) => {
      return state.qrcodes || [{}, {}];
    },
    androidQrcode: (state, getters) => {
      return getters.qrcodes[1] || {};
    },
    iosQrcode: (state, getters) => {
      return getters.qrcodes[0] || {};
    },
    tplv5LoginBoxVisible: (state) => state.tplv5LoginBoxVisible,
    servicerBBM: (state) => {
      return (state.servicer || {}).bbm;
    },
    servicerFaceBook: (state) => {
      return (state.servicer || {}).facebook;
    },
    servicerInstagram: (state) => {
      return (state.servicer || {}).instagram;
    },
    servicerLine: (state) => {
      return (state.servicer || {}).line;
    },
    servicerShareChat: (state) => {
      return (state.servicer || {}).shareChat;
    },
    servicerSkype: (state) => {
      return (state.servicer || {}).skype;
    },
    servicerWhatsApp: (state) => {
      return (state.servicer || {}).whatsapp;
    },
    servicerZalo: (state) => {
      return (state.servicer || {}).zalo;
    },
  },
  mutations: {
    setTplv5LoginBoxVisible(state, playload) {
      state.tplv5LoginBoxVisible = playload;
    },
    setRegAddDefaultExpandStatus(state, playload) {
      state.regAddDefaultExpandStatus = playload;
    },
    setSysModalText(state, playload) {
      state.sysModalText = playload;
    },
    getChatPeopleData(state, playload) {
      state.chatPeopleData = playload;
    },
    getConfigList(state, list) {
      state.configList = list;
    },
    //改变anotherObj
    freePlay(state, val) {
      state.freePlayValue = val;
    },
    getAnotherObj(state, obj) {
      state.anotherObj = obj;
    },
    getResourceId(state, id) {
      state.resourceId = id;
    },
    getIsSales(state, data) {
      state.isSales = data;
    },
    // 期数信息
    getPreiodInfo(state, data) {
      state.preiodInfo = data;
    },
    // 二维码
    getQrcodes(state, data) {
      state.qrcodes = data;
    },
    getQrcode(state, data = {}) {
      if (data.icon === "ios") {
        state.qrcodes[0] = data;
      }
      if (data.icon === "android") {
        state.qrcodes[1] = data;
      }
      state.qrcodes = state.qrcodes.concat([]);
    },
    // 手机端
    getHeadData(state, data) {
      state.mbHeadData = data;
    },
    // 在线客服信息
    getServicer(state, data = {}) {
      state.servicer = data;
      document.title = data.name;
      // 底部平台版权name
      configText.main = data.name;
    },
    getUserBalance(state, balance) {
      state.user.balance = balance;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    getUser(state, data) {
      state.user = data || {};
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    getUserAreaCode(state, areaCode) {
      state.user.areaCode = areaCode;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    getShowLoginDialog(state, data) {
      state.showLoginDialog = data;
    },
    //网关状态
    getNetStatus(state, data) {
      state.netStatus = data;
    },
    // 开奖公告和开奖历史更新
    getNoticeList(state, data) {
      EventBus.dispatch("updatePrizeHistory", data);
      state.updateNotice = data;
    },
    getRecord(state, data) {
      state.updateRecord = data;
    },
    //是否登录
    getShouldLogin(state, data) {
      state.isLogin = data;
    },
    getSuccessModal(state, data) {
      //投注成功弹框
      state.isSuccessModal = data;
    },
    getClosePie(state, data) {
      //是否封盘
      state.isClosePie = data;
    },
    getRongImConnectState(state, data) {
      state.rongImConnectState = data;
    },
    getIpForbid(state, data) {
      //IP限制
      state.isIpForbid = data;
    },
    /*     getChatUser(state, data) {
            state.chatUser = data
        }, */
    getYebInfo(state, data) {
      state.yebInfo = data || {};
    },
    getPrizeEndTime(state, data) {
      state.prizeEndTime = data;
    },
    getWmInstance(state, data) {
      state.wmInstance = data;
    },
    getDiffLogin(state, data) {
      state.diffPlaceLogin = data;
    },
    getDiffLoginInfo(state, data) {
      //异地登录
      state.diffLoginExtraInfo = data;
    },
    getCacheLoginUserInfo(state, data) {
      //异地登录
      state.cacheLoginUserInfo = data;
    },
    getKaptchaFlag(state, data) {
      //异地登录
      state.diffLoginKaptchaFlag = data;
    },
    getRoomPwdDialogInfo(state, data) {
      //登录聊天室房间密码的信息
      state.roomPwdDialogInfo = data;
    },

    SET_CHATROOM_ID(state, data) {
      state.chatRoomId = data;
    },
    SET_SYSTEM_MAINTENANCE_INFO(state, data) {
      state.chatRoomId = data;
    },
  },
  actions: {},
});
