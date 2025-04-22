import Vue from "vue";
import store from "@/store";
import axios from "axios";
import iView from "iview";
import encryption from "@/utils/md5.js";
import router from "@/router/index";
import context from "@/main";
import { getLanguage } from "@/lang";
import { cloneDeep } from "lodash";

export const ApiCache = (function() {
  const ApiCacheTimeOut = {
    k1s: 1000,
    k1m: 60 * 1000,
  };
  const ApiCacheConfig = {
    "/api/v2/lottery/dragon": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1s,
      response: null,
    },
    "/api/v2/sysDict/querySystemConfig": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/api/v2/cms/queryQrcodesAndServicer": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    // '/api/v2/lottery/queryLotteryList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 60 * 60 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/getLotteryDetailV2': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 60 * 60 * 1000,
    //   response: null
    // },
    "/api/v2/cms/queryAnnounceEssayList": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/party/v2/game/quickPlayGames": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/party/v2/game/queryTypePlatforms": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/party/v2/game/queryPlatformGames": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/party/v2/game/queryGameListTypes": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    "/api/v2/home/index": {
      cache: true,
      timestamp: 0,
      timeout: ApiCacheTimeOut.k1m,
      response: null,
    },
    // '/api/v2/lottery/queryLotteryTypeRuleList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 60 * 60 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/queryDiscountActivityList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/queryDiscountActivityById': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/chat/queryChatRooms': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/app/getUrlForDownload': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/chat/queryChatPeopleCount': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/chat/queryChatCustComerService': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryChatPrizeList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/queryAdvisoryEssayList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/isqueryUserMessage': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/balanceAdnSign': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryPrizeHistoryList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/party/v2/game/queryPlayIndex': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/app/getApiLineRspTime': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/lottery-opencode/api/app/getApiLine': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/betShare/getTodayBetWin': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/betShare/checkAllowShare': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/app/getLatestVersion': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/party/v2/game/queryGameBettingList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/chat/queryChatAdmin': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/queryBanners': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/party/v2/game/queryLotUserAccount': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/hbgame/hbRoomList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/activity/courtesy': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/hbgame/hbType': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/getUsablePayType': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/queryBalance': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/party/v2/game/queryGameSearch': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/agent/queryAgentBettingList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/queryBalanceDetailList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryLotteryNumberByPeriod': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryPrizeList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/queryUserMessage': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/sysDict/queryItemList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/chat/queryChatRoomComboBox': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/agent/subuser/oneReport': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/queryRechargeList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/courtesy/getDetail': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/queryLotUserBankInfo': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/user/getUserPayPwd': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryPlayLayoutByBettingId': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/discountInternational': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/lottery/queryPrizeRankingList': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/trend/queryAllLotterys': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/cms/indexBigAd': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 10 * 1000,
    //   response: null
    // },
    // '/api/v2/app/getLanguageConfig': {
    //   cache: true,
    //   timestamp: 0,
    //   timeout: 5 * 60 * 1000,
    //   response: null
    // },
  };

  function getApiCache(url, key) {
    const { cache } = ApiCacheConfig[url] || {};
    if (!cache) {
      return void 0;
    }
    let config = {};
    try {
      config = JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      config = {};
    }
    const { timestamp = 0, timeout = 0, response = null } = config;
    const curTime = +new Date();
    if (curTime - timestamp > timeout) {
      return void 0;
    } else {
      if (!response.config.unenc) {
        response.data = JSON.parse(
          AESDec(response.config.key, response.data.body)
        );
      }
      return new Promise((r) => {
        r(response);
      });
    }
  }

  function setApiCache(url = "", key = "", response = null) {
    const { cache, timeout } = ApiCacheConfig[url] || {};
    if (!!cache) {
      let apiCacheKey = [];
      try {
        apiCacheKey = JSON.parse(localStorage.getItem("api-key-cache")) || [];
      } catch (e) {
        apiCacheKey = [];
      }
      if (!apiCacheKey.includes(key)) {
        apiCacheKey.push(key);
        localStorage.setItem("api-key-cache", JSON.stringify(apiCacheKey));
      }
      localStorage.setItem(
        key,
        JSON.stringify({
          cache,
          timestamp: +new Date(),
          timeout,
          response,
        })
      );
    }
  }

  function clearAll() {
    let apiCacheKey = [];
    try {
      apiCacheKey = JSON.parse(localStorage.getItem("api-key-cache")) || [];
    } catch (e) {
      apiCacheKey = [];
    }
    apiCacheKey.forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem("api-key-cache");
  }

  return {
    getApiCache,
    setApiCache,
    clearAll,
  };
})();

const service = axios.create({
  timeout: 20000, // 请求超时时间
});

Vue.prototype.$http = service;

function getResponseCode(response) {
  return response.data.code;
}

function getResponseDataMsg(response) {
  return response.data.msg || context.$tex("服务异常");
}

function code207Handler(response) {
  store.commit("SET_CODE_503_DATA", response.data.data);
  store.commit("SET_SYSTEM_MAINTENANCE_INFO", response.data.data); // 设置系统维护信息
  router.push("/503");
  throw new Error("系统维护");
}

function code503Handler(response) {
  code207Handler(response);
}

function code301Handler(response) {
  const errText = getResponseDataMsg(response);
  iView.Modal.error({
    title: context.$tex("温馨提示"),
    content: `<p>${errText}</p>`,
    onOk: function() {
      window.location.href = "/#/login";
    },
  });
  store.commit("getUser", {});
  localStorage.setItem("user", "");
}

service.interceptors.request.use(
  function(config) {
    config.dataBackUp = cloneDeep(config.data);
    //在发送请求之前做某事
    let time = new Date().getTime();
    let user = localStorage.getItem("user");
    let userId = "";
    let token = "";
    let sign = encryption.encrypt.md5(time + "##Lottery2017$$");
    let vuexUser = "";
    // 登入后更改userID
    if (user) {
      user = JSON.parse(user);
      userId = user.userId;
      token = user.token;
      vuexUser = store.state.user.userId;
      //判断重新登录以后 localStorage里面的值是否与vuex里面的值同步，如果不同步就更新vuex里面的
      if (vuexUser && userId && vuexUser != userId) {
        iView.Modal.info({
          title: context.$tex("不能连续登陆"),
          content: context.$tex("您已经登录另外一个账户,现在为您刷新到新账户"),
          onOk: () => {
            // store.commit('getUser', user)
            location.reload();
          },
        });
        return;
      }
    }
    // 判断需要登入后才能操作的接口并更改sign
    if (config.userId) {
      if (user) {
        sign = encryption.encrypt.md5(time + "##Lottery2017$$" + user.token);
      } else {
        // debugger;
        config.url = "/";
        iView.Modal.error({
          title: context.$tex("温馨提示"),
          content: `<p>${context.$tex("你目前还没有登入哦")}</p>`,
          onOk: function() {
            // 5.3
            localStorage.setItem("user", "");
            store.commit("getUser", {});
            window.location.href = "/#/login";
          },
        });
        return config;
      }
    }

    // 参数加密
    if (!config.unenc) {
      const RndNum = function(n) {
        let rnd = "";
        let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
        for (let i = 0; i < n; i++) {
          let num = Math.round(Math.random() * 36);
          if (num === 36) num--;
          rnd += x.substring(num, num + 1);
        }
        return rnd;
      };
      let key = RndNum(16);

      config.headers.key = RSA(key);
      config.key = key;
      config.data = {
        body: AESEnc(key, JSON.stringify(config.data)),
      };
    }
    if (config.kaptchaFlag) {
      config.headers.kaptchaFlag = config.kaptchaFlag;
    }
    config.headers.sign = sign;
    config.headers.timestamp = `${time}`;
    config.headers.userId = userId || "";
    config.headers.token = token || "";
    config.headers.deviceId = "WEB";
    config.headers.lang = getLanguage();
    !config.headers.scur &&
      store.getters.sysApiCoin.cur &&
      (config.headers.scur = store.getters.sysApiCoin.cur);
    config.headers.zone = (new Date().getTimezoneOffset() / 60) * -1;
    if (config.contentType) {
      config.headers["Content-Type"] = config.contentType;
    }
    return config;
  },
  function(error) {
    //请求错误时做些事
    return Promise.reject(error);
  }
);

//添加响应拦截器
service.interceptors.response.use(
  function(response) {
    if (typeof response.data.data === "string") {
      response.data = JSON.parse(response.data.data);
    }
    let code = getResponseCode(response);
    //对响应数据做些事
    if (!code) {
      ApiCache.setApiCache(
        response.config.url,
        JSON.stringify({
          url: response.config.url,
          data: response.config.dataBackUp,
        }),
        response
      );
      // 解密
      if (!response.config.unenc) {
        response.data = JSON.parse(
          AESDec(response.config.key, response.data.body)
        );
      }
    }

    code = getResponseCode(response);

    if (code !== 0) {
      const errText = getResponseDataMsg(response);
      if (
        code === 301 ||
        code === 110 ||
        code === 302 ||
        code === 111 ||
        code === 170
      ) {
        code301Handler(response);
      } else if (code === 256) {
        //异地登录账号异常
        store.commit("getDiffLogin", true);
        store.commit("getDiffLoginInfo", errText); //msg,phone
        // debugger;
      } else if (code === 165) {
        //封盘不能投注提示框
        store.commit("getClosePie", true);
      } else if (code === 502) {
        store.commit("getNetStatus", true);
        // }else if('/api/v2/user/get/redpacket' !== response.config.url && '/api/v2/user/queryBankFrom' !== response.config.url){
      } else if (code === 303) {
        //ip限制
        store.commit("getIpForbid", response.data.data);
      } else if (code === 207) {
        code207Handler(response);
      } else if (code === 503) {
        code503Handler(response);
      } else if (code === 186) {
        // 优惠活动无相对类型任务
        iView.Message.warning(errText);
      } else if (!response.config.stopDialog && code !== 256) {
        iView.Modal.error({
          title: context.$tex("请求异常"),
          content: "<p>" + errText + "</p>",
        });
      }
    }
    return response;
  },
  function(error) {
    if (error.config.timeoutDialog) {
      iView.Modal.error({
        title: context.$tex("请求异常"),
        content: `<p>${context.$tex("请求超时")}</p>`,
      });
    }
    //请求错误时做些事
    return Promise.reject(error);
  }
);

const requestStore = {};

export default function(config = {}) {
  const key = JSON.stringify(config);
  if (!requestStore[key]) {
    requestStore[key] = {
      lastTime: 0,
      promise: null,
    };
  }
  const curTime = +new Date();
  if (curTime - requestStore[key].lastTime > 2000) {
    const p = ApiCache.getApiCache(
      config.url,
      JSON.stringify({
        url: config.url,
        data: config.data,
      })
    );
    if (!!p) {
      return p;
    }
    requestStore[key].lastTime = curTime;
    requestStore[key].promise = service(config);
  }
  return requestStore[key].promise;
}
