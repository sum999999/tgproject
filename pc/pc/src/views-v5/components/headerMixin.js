import lottery from "./left_lottery";
import encryption from "@/utils/md5";
import iView from "iview";
import tryPlay from "./try_play.vue";
import ConfirmFree from "@/components/modal";
import utils from "@/utils/utils";
import Util from "@/utils/dom.js";
import modal from "@/components/modal.vue";
import loginDlg from "@/components/login_dlg.vue";
import goChatRoom from "@/mixins/goChatRoom.js";
import popupCaptcha from "@/mixins/popupCaptcha";
import { mapGetters } from "vuex";
import { THEME_CONFIG } from "@/utils/tplConfig";
import { getTemplateConfig } from "@/utils/tplConfig";
import { queryQuickPlayGames } from "@/api/game";

let defaultMenu = [
  { label: "首页", url: "/home", en: "HOME" },
  { label: "购彩大厅", url: "/lottery", target: "_blank", en: "LOTTERY GAME" },
  { label: "app下载", url: "/phoneBuy" },
  { label: "优惠活动", url: "/active" },
];

export default {
  components: {
    lottery,
    ConfirmFree,
    modal,
    loginDlg,
  },
  mixins: [goChatRoom, popupCaptcha()],
  data() {
    return {
      currentMenu: this.$route.path,
      defaultMenu: defaultMenu,
      menu: [...defaultMenu],
      insertPos: 2,
      notice: "",
      userCode: "",
      password: "",
      checkCode: "",
      ewmUrl: "",
      showPopup: false,
      play: false,
      turnRound: false,
      hasAsideMenu: false,
      hasRefreshChode: false,
      confirmDialog: false,
      hasInformation: false,
      hasAds: "0", //是否有广告图
      showAds: false, //是否显示广告图
      hasBuld: false, //是否显示灯泡
      adsInfo: {}, //广告信息
      arrowFree: false, // 允许免费试玩
      hotPhone: configText.hotPhone,
      tryPlay: null,
      //    gameTipShow: false,
      loginDialog: null,
      showLoginDialog: false,
      loginStatus: false, //阻止连续登录
      loginOutStatus: false, //阻止连续退出
      gameIndex: -1,
      loading: false,
      gameMoneyTipShow: false, //登录游戏前的自动额度转换提示弹框flag
      currGameInfo: {}, //当前准备登录的游戏,
      loginGameLoading: false,
      showLoginGameTip: "", // 是否提示登陆第三方游戏弹框
      hasClickGoChatRoom: false,
      subMitLoginInfo: {},
      isShowThemeList: false,
      themeList: THEME_CONFIG,
      currentTheme: THEME_CONFIG[0],
      tryPlayCaptchaInfo: "",
      picture: "/configstatic/pc/images/logo.gif",
    };
  },
  watch: {
    $route(n, o) {
      // this.currentMenu = n.path
      let id = n.params.id;
      if (id) {
        id = id.includes("_") ? id.split("_")[1] : id;
        this.currentMenu = id;
      } else {
        this.currentMenu = n.path;
      }
    },
    userInfo(n, o) {
      if (n.userId && !o.userId) {
        this.hasNewInformation();
        // console.dir(n);
      }
    },
    // configList (configList) {

    //     this.initConfig(configList);
    // }
    /*       configList: {
              handler (newVal) {
                  this.initConfig(newVal);
              },
              deep: true
          } */
  },
  computed: {
    ...mapGetters(["pageTemplate"]),
    serverUrl() {
      return this.$store.state.servicer;
    },
    userInfo() {
      return this.$store.state.user;
    },
    configList() {
      return this.$store.state.configList;
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    /*         defaultMenu() {
            this.insertPos = 2
            if (this.pageTemplate.index == 2) {
                defaultMenu = [
                    { label: '首页', url: '/home' },
                    { label: '购彩大厅', url: '/lottery', target: '_blank' },
                    { label: '优惠活动', url: '/active' }
                ]
                this.insertPos = 1
            }
            return defaultMenu
        } */
  },
  methods: {
    selTheme(info) {
      this.currentTheme = info;
    },
    changeTheme() {
      this.$store.dispatch("changTheme", {
        themeColorList: this.currentTheme,
      });
      this.isShowThemeList = false;
    },
    async loadEwmUrl() {
      const data = await utils.loadEwmUrl();

      this.ewmUrl = data.url;
      this.kaptchaFlag = data.kaptchaFlag;
      return data.kaptchaFlag;
    },
    /*  initConfig (configList) { //初始化配置项
         configList.forEach(item => {
             if (item.key === 'PC_HOME_MAIN_ACTIVITY') {
                 this.hasAds = item.value;
                 if (this.hasAds === '1') {
                     this.showAds = true;
                 }
             }
             if (item.key === 'ALLOW_PLAY_FOR_FREE') {
                 this.arrowFree = item.value === '0' ? false : true;
             }
         })
     }, */
    onGameHover(idx) {
      this.gameIndex = idx;
      const currentGame = this.menu[idx];
      if (currentGame.subMenu || this.loading) return;
      this.loading = true;
      this.getSubGames(currentGame.code).then((res) => {
        this.loading = false;
        if (res.data.code !== 0) return;
        currentGame.subMenu = res.data.data.list;
      });
    },
    onGameLeave() {
      this.gameIndex = -1;
    },
    openService(url) {
      //打开客服
      Util.openWin(url);
    },
    openAds() {
      //打开广告图
      this.showAds = true;
      this.hasBuld = false;
    },
    closeAds() {
      //关闭广告
      this.showAds = false;
      setTimeout(() => {
        this.hasBuld = true;
      }, 500);
    },
    goPersonCenter() {
      //去会员中心
      if (this.hasInformation) {
        this.hasInformation = !this.hasInformation;
      }
      this.$router.push({
        name: "personalCenter",
        params: { id: "account" },
      });
    },
    goRegister() {
      this.$router.push({
        name: "register",
      });
    },
    handForClear() {
      this.confirmDialog = false;
    },
    handConfirm() {
      this.confirmDialog = false;
      this.signOut();
      this.play = true;
    },
    refreshCheckCode() {
      //获取焦点刷新验证码
      if (this.hasRefreshChode) {
        return;
      }
      this.changeCaptcha();
      this.hasRefreshChode = true;
    },
    showAsideMenu() {
      //显示快速导航
      if (this.$route.name === "lottery") {
        return;
      }
      this.hasAsideMenu = true;
    },
    hideAsideMenu() {
      //隐藏快速导航
      if (this.$route.name === "lottery") {
        return;
      }
      this.hasAsideMenu = false;
    },
    refreshBalance() {
      //刷新资金
      this.turnRound = true;
      this.$http
        .post("/api/v2/user/balanceAdnSign", {}, { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.userInfo.balance = response.data.data.balance;
          this.userInfo.userLevel = response.data.data.levelId;
          this.$store.commit("getUser", this.userInfo);
          this.turnRound = false;
        });
    },
    freePlay() {
      // this.getHomeAdsImg();
      // 打开免费试玩窗口
      const { userType } = this.userInfo;
      if (userType) {
        if (userType == "09") {
          this.$Message.info("正在使用试玩账号");
        } else {
          this.confirmDialog = true;
        }
      } else {
        this.play = true;
      }
    },
    //切换验证码
    changeCaptcha: function() {
      this.loadEwmUrl();
    },
    getWxToken() {
      //获取易盾验证的token
      let vm = this;
      if (this.wmInstance) {
        return new Promise((resolve, reject) => {
          this.wmInstance.getToken(vm.businessId, function(token) {
            resolve(token);
          });
        });
      } else {
        return Promise.reject("");
      }
    },
    doLogin: async function() {
      let vm = this;
      if (this.loginStatus) return;
      if (localStorage.getItem("user")) {
        let user = JSON.parse(localStorage.getItem("user"));
        let userId = user.userId;
        if (userId) {
          this.$Modal.info({
            title: "不能连续登陆",
            content: "现在为您跳转",
            onOk: () => {
              this.$store.commit("getUser", user);
            },
          });
          return;
        }
      }
      if (!this.userCode) {
        this.specialRefreshCaptcha();
        this.verifyData = {};
        iView.Modal.error({
          title: "请求失败",
          content: "<p>账号不能为空</p>",
        });
        return;
      }
      if (!this.password) {
        this.specialRefreshCaptcha();
        this.verifyData = {};
        iView.Modal.error({
          title: "请求失败",
          content: "<p>密码不能为空</p>",
        });
        return;
      }
      if (!this.captchaFlag) {
        //非行为验证
        if (!this.checkCode) {
          this.verifyData = {};
          iView.Modal.error({
            title: "请求失败",
            content: "<p>验证码不能为空</p>",
          });
          this.changeCaptcha();
          return;
        }
      }
      this.loginStatus = true;
      let obj = {
        userCode: this.userCode,
        password: encryption.encrypt.md5(this.password),
      };
      if (this.antiCheatFlag) {
        //开启了反作弊
        let token = await this.getWxToken();
        console.log("开启了反作弊");
        obj = {
          ydtoken: token,
          ...obj,
        };
      }

      if (!this.captchaFlag) {
        //未开启行为验证
        obj.checkCode = this.checkCode;
        if (this.antiCheatFlag) {
          let loading = this.$Message.loading({
            content: "加载中...",
            duration: 0,
          });
          this.loginSubmit(obj, loading);
          return;
        }
        this.loginSubmit(obj);
        return;
      }
      this.subMitLoginInfo = obj;
      this.capthcaValidate(); //行为验证
      // const capObj = this.capthcaValidate() //行为验证
      //  if (!capObj) {
      //   vm.loginStatus = false
      //   return
      // }

      // var { validate, loading } = capObj;
      //  obj = {
      //    ydNECaptchaValidate: validate,
      //    ...obj
      //  }
      //  this.loginSubmit(obj,loading);

      // let params = {
      //   userCode: this.userCode,
      //   password: encryption.encrypt.md5(this.password),
      //   checkCode: this.checkCode,
      // }
      // this.$http.post('/api/v2/user/login', params, {  kaptchaFlag:this.kaptchaFlag}).then(async response => {
      //   vm.changeCaptcha()
      //   this.loginStatus = false;

      //   if (response.data.code !== 0) {
      //       if(response.data.code===256){
      //         vm.$store.commit('getCacheLoginUserInfo',JSON.stringify(params)); //存储临时的登录信息
      //          let data = await vm.loadEwmUrl(); // 2019.5.9
      //          vm.$store.commit('getKaptchaFlag',data.kaptchaFlag);
      //       }
      //       return;
      //   }
      //     ;['userCode', 'password', 'checkCode'].forEach(
      //       item => (vm[item] = '')
      //     )
      //   localStorage.setItem('user', JSON.stringify(response.data.data))
      //   vm.$store.commit('getUser', response.data.data)
      //   if (
      //     vm.$route.name === 'login' ||
      //     vm.$route.name === 'register'
      //   ) {
      //     vm.$router.push('/')
      //   }
      // })
    },
    ValidateCapthca() {
      //行为验证弹框关闭后，进一步验证
      if (!this.verifyDataInfo) {
        this.loginStatus = false;
        return;
      }
      var { validate, loading } = this.verifyDataInfo;
      this.subMitLoginInfo = {
        ydNECaptchaValidate: validate,
        ...this.subMitLoginInfo,
      };
      this.loginSubmit(this.subMitLoginInfo, loading);
    },
    loginSubmit(obj, loading) {
      //最后的登陆
      let vm = this;
      const curKaptchaFlag = vm.kaptchaFlag;
      this.$http
        .post("/api/v2/user/login", obj, {
          kaptchaFlag: curKaptchaFlag,
        })
        .then(async (response) => {
          vm.changeCaptcha();
          this.loginStatus = false;
          if (response.data.code !== 0) {
            loading && loading();
            vm.password = "";
            if (vm.captchaFlag) {
              vm.refreshCaptchaValidate();
            }
            if (response.data.code === 256) {
              vm.$store.commit("getCacheLoginUserInfo", JSON.stringify(params)); //存储临时的登录信息
              vm.$store.commit("getKaptchaFlag", curKaptchaFlag);
            }
            return;
          }
          loading && loading();
          ["userCode", "password", "checkCode"].forEach(
            (item) => (vm[item] = "")
          );
          localStorage.setItem("user", JSON.stringify(response.data.data));
          vm.$store.commit("getUser", response.data.data);
          if (vm.$route.name === "login" || vm.$route.name === "register") {
            vm.$router.push("/");
          }
        });
    },
    signOut() {
      let vm = this;
      if (this.loginOutStatus) return;
      this.loginOutStatus = true;
      this.$http
        .post("/api/v2/user/loginOut", "", { userId: true })
        .then((response) => {
          this.loginOutStatus = false;
          if (response.data.code !== 0) return;
          vm.$store.commit("getUser", "");
          localStorage.setItem("user", "");
          if (this.$route.name === "personalCenter") this.$router.push("/");
        });
    },
    addCollection() {
      this.$Modal.info({
        title: this.$tex("加入收藏"),
        content: this.$tex("请按Ctrl+D加入收藏"),
        onOk: () => {},
      });
    },
    getNotice() {
      let vm = this;
      this.$store
        .dispatch("queryAnnounceEssayList", {
          current: 1,
          size: 100,
          type: "02",
        })
        .then((response) => {
          if (response.data.code !== 0) return;
          let n = response.data.data.list;
          let txt = "";
          n.forEach((item) => {
            txt +=
              utils.escapeHtml(item.content) +
              "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
          });
          this.notice = txt;
        });
    },
    // 是否有新消息
    hasNewInformation() {
      this.$http
        .post("/api/v2/user/isqueryUserMessage", "", {
          userId: true,
          unenc: true,
        })
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          if (
            (data.isEssayConut || data.isUserCount) &&
            this.$route.name !== "personalCenter"
          ) {
            //暂未考虑游戏信息
            this.hasInformation = true;
          }
        });
    },
    getHomeAdsImg() {
      this.$http
        .post("/api/v2/cms/indexBigAd", {}, { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.adsInfo = response.data.data;
        });
    },
    /*    goCreditConver () {
           this.$router.push('/personalCenter/creditConver');
           this.gameTipShow = false;
       }, */
    /**
     * 点击导航菜单跳到游戏页
     */
    navGoGamePlat(code) {
      // if (this.$route.name === 'game') {
      this.currentMenu = code;
      // debugger;
      this.$router.push({ name: "game", params: { id: code } });
      // }
    },
    async goGamePlat(info, event) {
      if (info.dispType === "1" && info.platformStatus !== "1") {
        return;
      }
      if (info.dispType === "2") {
        //游戏类型直接跳到第三方页面
        if (this.userInfo.userType == "09") {
          // 试玩账号
          this.$Message.info("试玩账号不能使用该功能！");
          return;
        }
        if (!this.userInfo.userCode) {
          this.$Modal.confirm({
            title: "提示",
            content: "<p>您还未登入！去登录？</p>",
            onOk: () => {
              this.showLoginDialog = true;
              this.loginDialog = loginDlg;
            },
          });
          return;
        }
        if (this.gameLoading) {
          event.preventDefault();
          return;
        }
        this.currGameInfo = info;
        //弹出自动转换额度的提示
        let hasLoginOtherGame =
          localStorage.getItem("hasLoginOtherGame") === "1" ? true : false;
        // debugger;
        if (!hasLoginOtherGame && this.showLoginGameTip) {
          //第一次登陆游戏并且配置了要显示额度转换提示
          this.gameMoneyTipShow = true;
          localStorage.setItem("hasLoginOtherGame", "1");
          return;
        }
        this.goGameLogin();
        // this.gameMoneyTipShow = true;
        // return;
        // this.gameLoading = true;

        // await this.$http.post('/party/v2/game/loginGame', { platformId: info.platformId, gameId: info.gameId }, { unenc: true, userId: true }).then(response => {
        //   this.gameLoading = false;
        //   if (response.data.code !== 0) return
        //   let url = response.data.data.url;
        //   if (url) {
        //     this.$Modal.confirm({
        //       title: '提示',
        //       content: '为更好的进行游戏娱乐，将为您打开新的窗口',
        //       onOk: () => {
        //         window.open(url, '_blank');
        //       }
        //     });

        //   }
        // })
      } else {
        //去游戏大厅
        this.$router.push({ name: "game", params: { id: info.code } });
      }
      event.preventDefault();
    },
    /**
     * 开始登陆游戏
     */
    goGameLogin() {
      this.gameMoneyTipShow = false;
      if (this.loginGameLoading) return;
      this.loginGameLoading = true;
      this.$emit("toggle-loading", this.loginGameLoading);
      let info = this.currGameInfo;
      this.$http
        .post(
          "/party/v2/game/loginGame",
          { platformId: info.platformId, gameId: info.gameId },
          { unenc: true, userId: true }
        )
        .then((response) => {
          this.loginGameLoading = false;
          this.$emit("toggle-loading", false);
          // let hasLoginOtherGame = localStorage.getItem('hasLoginOtherGame');
          // if(!hasLoginOtherGame) {
          //   localStorage.setItem('hasLoginOtherGame','1');
          // }
          if (response.data.code !== 0) return;
          let url = response.data.data.url;
          let html = response.data.data.html;
          if (url) {
            this.$Modal.confirm({
              title: this.$tex("提示"),
              content: this.$tex("为更好的进行游戏娱乐，将为您打开新的窗口"),
              onOk: () => {
                window.open(url, "_blank");
              },
            });
          } else {
            var newPage = window.open("", "_blank");
            newPage.document.open();
            newPage.document.write(html); //运行 HTML 代码
            newPage.document.close();
          }
        });
    },
    // fetchGamePlat () {
    //   this.$http.post('/party/v2/game/queryPlayForm', { isMain: '0' }, { unenc: true }).then(response => {
    //     if (response.data.code !== 0) return

    //     const list = response.data.data;
    //     if (list.length) {
    //       let item = list[0];
    //       this.menu.splice(2, 0, { label: '棋牌/电子', url: '/game', hot: true })
    //     }

    //   })
    // }
    /**
     * 获取第三方游戏快捷投注列表
     */
    getSubGames(code) {
      return new Promise((resolve, reject) => {
        queryQuickPlayGames({ code: code }).then((res) => {
          resolve(res);
        });
      });
    },
    /**
     * 去聊天室
     */
    toChatRoom() {
      let vm = this;
      if (this.hasClickGoChatRoom) return;
      this.hasClickGoChatRoom = true;
      this.$emit("go-chat-room", this.hasClickGoChatRoom);
      this.$http
        .post(
          "/api/v2/chat/queryChatRooms",
          {
            current: 1,
            roomNo: "",
            size: 1,
            userId: this.userInfo.userId || "",
          },
          { unenc: true }
        )
        .then(async (res) => {
          this.hasClickGoChatRoom = false;
          this.$emit("go-chat-room", this.hasClickGoChatRoom);
          if (res.data.code !== 0) return;
          if (
            !res.data.data.chatRooms[0] &&
            !res.data.data.systemChatRooms[0]
          ) {
            return this.$Modal.error({
              title: this.$tex("温馨提示"),
              content: `<p>${this.$tex("未设置聊天室房间")}！</p>`,
              onOk: function() {},
            });
          }
          let {
            bankLevel,
            openLevel,
            passwordLevel,
            roomPassword,
            roomId,
          } = res.data.data.systemChatRooms.length
            ? res.data.data.systemChatRooms[0]
            : res.data.data.chatRooms[0];
          let hasOpenRight = this.hasRight(openLevel);
          // debugger;
          if (!hasOpenRight) {
            //如果等级达标等级
            this.$Message.error("用户等级不够不能进入聊天室");
            return;
          }
          if (roomPassword) {
            //有密码要求的话
            if (this.hasRight(passwordLevel)) {
              let userNeedPwd = true;
              this.$store.commit("SET_CHATROOM_ID", roomId);
              if (this.userInfo.userId) {
                let res = await this.$http.post(
                  "/api/v2/chat/queryCheckChatRoomPwd",
                  { roomId: roomId },
                  {
                    userId: true,
                    unenc: true,
                  }
                );
                const { data, code } = res.data;
                if (code === 0) {
                  if (data.result) {
                    userNeedPwd = true;
                  } else {
                    userNeedPwd = false;
                  }
                }
              }
              if (userNeedPwd) {
                this.$store.commit("getRoomPwdDialogInfo", {
                  isShow: true,
                  roomId: roomId,
                });
                return;
              }
            }
          }
          //等级达标不需要密码
          localStorage.setItem("isOtherToChatRoom", true);
          // this.$router.push("/chatRoom");
          const { href } = this.$router.resolve({
            name: "chatRoom",
            path: "/chatRoom",
          });
          window.open(href, "_blank");
        });
    },
    capthcaSuccess() {},
  },
  mounted() {
    const key = this.$store.getters.sysPlatformFlag;
    if (key == "tgdemo") {
      this.picture = "/configstatic/pc/images/logo_B.gif";
    }
    this.loadEwmUrl();
    this.currentTheme = this.$store.state.theme.themeColorList;
    let route = this.$route;
    if (route.name === "game") {
      let id = route.params.id;
      id = id.includes("_") ? id.split("_")[1] : id;
      this.currentMenu = id;
    }

    this.getHomeAdsImg();
    // debugger;

    // let gameLists = this.$configText.gameList; // 2019.5.13
    // gameLists = gameLists || []
    let GAME_SWITCH = localStorage.getItem("GAME_SWITCH");
    if (GAME_SWITCH) {
      let GAME_LIST = localStorage.getItem("GAME_LIST");
      if (GAME_LIST) {
        this.menu.splice(
          this.menu.length - this.insertPos,
          0,
          ...JSON.parse(GAME_LIST)
        );
      }
    }

    this.$store.dispatch("querySystemConfig").then((data) => {
      let gameLists = data["lotCcGameTypeConfig"];

      let ydConfig = data["YI_DUN_VAILD_CONFIG"];
      if (ydConfig) {
        ydConfig = JSON.parse(ydConfig);
        let {
          captchaFlag,
          antiCheatFlag,
          businessId,
          captchaId,
        } = ydConfig.loginFilter;
        // console.log(JSON.parse(data.value).loginFilter);
        this.captchaFlag = captchaFlag;
        this.antiCheatFlag = antiCheatFlag;
        this.businessId = businessId;
        this.captchaId = captchaId;
        if (this.captchaFlag) {
          this.$nextTick(() => {
            this.initCapthca();
          });
        } else {
          this.changeCaptcha();
        }
        //去试玩
        this.tryPlayCaptchaInfo = ydConfig.register;
        // console.log(this.tryPlayCaptchaInfo);
        // debugger;
      }

      if (gameLists) {
        gameLists = JSON.parse(gameLists).filter((item) => item.status === "1");
      }
      gameLists = gameLists || [];
      /*   let GAME_SWITCH = localStorage.getItem('GAME_SWITCH')
            if (GAME_SWITCH) {
                this.menu.splice(this.menu.length - insertPos, 0, ...gameLists)
            } */
      if (data["PC_HOME_MAIN_ACTIVITY"] === "1") {
        this.showAds = true;
      }
      let GAME_SWITCH = data["GAME_SWITCH"];
      if (GAME_SWITCH === "1") {
        //开启游戏
        localStorage.setItem("GAME_SWITCH", GAME_SWITCH);
        localStorage.setItem("GAME_LIST", JSON.stringify(gameLists));
        this.menu = [...this.defaultMenu];
        this.menu.splice(this.menu.length - this.insertPos, 0, ...gameLists);
      } else {
        localStorage.removeItem("GAME_SWITCH");
        localStorage.removeItem("GAME_LIST");
        this.menu = [...this.defaultMenu];
      }
      if (data["CHAT_SWITCH"] === "1") {
        this.menu.splice(this.menu.length - this.insertPos, 0, {
          label: "聊天室",
          url: "/chatRoom",
          target: "_blank",
          hot: true,
        });
      }
      if (!gameLists || !gameLists.length || GAME_SWITCH == "0") {
        this.menu = this.menu.concat([
          { label: "开奖公告", url: "/notice" },
          { label: "走势图表", url: "/trend" },
        ]);
      }
      //是否开启第三方游戏第一个登录的弹框提示, 2019.6.2 by xiaojiji
      this.showLoginGameTip =
        data["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
      // debugger;
      if (data["PC_HOME_MAIN_ACTIVITY"] == "1") {
        this.hasAds = "1";
        this.showAds = true;
      }
      if (data["ALLOW_PLAY_FOR_FREE"] === "0") {
        this.arrowFree = false;
      } else {
        this.arrowFree = true;
        this.tryPlay = tryPlay;
      }
    });
    this.getNotice();
  },
};
