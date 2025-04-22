import { querySystemConfig } from "@/api/sysDict";
import { getLocalApiCoin } from "@/lang";

import {
  SAVE_APP_LANGUAGE,
  SAVE_SYSTEM_CONFIG,
  SAVE_SYSTEM_API_COIN,
  SAVE_SYSTEM_REALNAME,
} from "../mutation_types";

export default {
  state: {
    sysConfig: {},
    sysCurrency: {
      currency: "",
      currencyIcon: "",
    },
    sysLotteryMoney: {
      selfFlag: {},
      customAmount: {},
    },
    sysApiPhoneOpen: false,
    sysApiCoinList: [],
    sysApiCoin: getLocalApiCoin(),
    sysDragon: "0",
    sysCarouselDelay: 5,
    sysPlatformFlag: "",
    sysShowOdds: "0",
    sysSystemConfig: {},
    sysRealName: 1, //强制实名
  },
  getters: {
    sysConfig: (state) => state.sysConfig,
    sysCurrency: (state) => state.sysCurrency,
    sysLotteryMoney: (state) => state.sysLotteryMoney,
    sysUserCostAmount: (state, getters) => {
      const { selfFlag = {} } = state.sysLotteryMoney;
      const { cur } = getters.sysApiCoin || {};
      return selfFlag[cur];
    },
    sysUserCustomAmount: (state, getters) => {
      const { customAmount = {} } = state.sysLotteryMoney;
      const { cur } = getters.sysApiCoin || {};
      return customAmount[cur];
    },
    getSysUserAmountBySelfFlag: (state, getters) => (selfFlag) => {
      if (selfFlag === "1") {
        return getters.sysUserCustomAmount;
      }
      return getters.sysUserCostAmount;
    },
    sysApiPhoneOpen: (state) => state.sysApiPhoneOpen,
    sysApiCoinList: (state) => state.sysApiCoinList,
    sysApiCoin: (state) => {
      if (state.sysApiCoin) {
        return state.sysApiCoin;
      }
      return state.sysApiCoinList[0] || {};
    },
    showSysDragon: (state) => {
      return state.sysDragon === "1";
    },
    sysCarouselDelay: (state) => {
      return state.sysCarouselDelay;
    },
    // 商户标识
    sysPlatformFlag: (state) => {
      return state.sysPlatformFlag;
    },
    sysShowOdds: (state) => state.sysShowOdds,
    // querySystemConfig接口返回的所有数据
    sysSystemConfig: (state) => state.sysSystemConfig,
    sysRealName: (state) => state.sysRealName,
  },
  mutations: {
    [SAVE_SYSTEM_CONFIG](state, playload = {}) {
      const {
        CURRENCY,
        lotteryMoney,
        API_PHONE_OPEN,
        API_COIN_LIST,
        dragon,
        INDEX_CAROUSEL,
        PLATFORM_FLAG,
        SHOW_ODDS_WHEN_NOT_LOGIN,
      } = playload;
      if (CURRENCY) {
        state.sysCurrency = JSON.parse(CURRENCY);
      }
      if (lotteryMoney) {
        state.sysLotteryMoney = JSON.parse(lotteryMoney);
      }
      if (API_COIN_LIST) {
        try {
          state.sysApiCoinList = JSON.parse(API_COIN_LIST);
        } catch (e) {
          state.sysApiCoinList = [];
        }
      }
      state.sysApiPhoneOpen = API_PHONE_OPEN === "1";
      state.sysConfig = playload;
      state.sysDragon = dragon;
      state.sysCarouselDelay =
        parseInt(INDEX_CAROUSEL) || state.sysCarouselDelay;
      state.sysPlatformFlag = PLATFORM_FLAG;
      state.sysShowOdds = SHOW_ODDS_WHEN_NOT_LOGIN;
      state.sysSystemConfig = playload;
    },
    [SAVE_SYSTEM_API_COIN](state, cur) {
      const coin =
        state.sysApiCoinList.find((coin) => {
          return coin.cur === cur;
        }) || {};
      if (coin) {
        localStorage.setItem("api-coin", JSON.stringify(coin));
      } else {
        localStorage.clear("api-coin");
      }
      state.sysApiCoin = coin;
    },
    [SAVE_SYSTEM_REALNAME](state, id) {
      state.sysRealName = id;
    },
  },
  actions: {
    async querySystemConfig({ state, commit, getters, dispatch }, playload) {
      const res = await querySystemConfig();
      if (res.data.code !== 0) {
        return;
      }
      const systemConfigData = {};
      res.data.data.forEach((item) => {
        systemConfigData[item.key] = item.value;
      });
      commit(SAVE_SYSTEM_CONFIG, systemConfigData);
      // console.log("systemConfigData", systemConfigData);
      return systemConfigData;
    },
  },
};
