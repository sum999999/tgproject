import {
} from '../mutation_types'

import { queryCurrencyExchangeInfo, queryCurrencyExchangeByScur } from "@/api/user";
import { SET_SYS_EXCHANGE_INFO } from "../mutation_types";

export default {
  state: {
    sysExchangeInfo: {}
  },
  getters: {
    sysExchangeInfo: state => state.sysExchangeInfo,
  },
  mutations: {
    [SET_SYS_EXCHANGE_INFO](state, playload) {
      state.sysExchangeInfo = playload;
    },
  },
  actions: {
    /**
     * 额度转换使用
     * @param state
     * @param rootGetters
     * @param commit
     * @param dispatch
     * @param playload
     * @returns {Promise<*&{tcurIcon: string, scurIcon, tcur: string}>}
     */
    async queryCurrencyExchangeByScur({ state, rootGetters, commit, dispatch }, playload = {}) {
      const { scur } = playload;
      const res = await queryCurrencyExchangeByScur({ scur });
      if (res.data.code !== 0) {
        return;
      }
      // const exchangeInfo = res.data.data;
      const exchangeInfo = {
        ...res.data.data,
        scurIcon: res.data.data.icon,
        tcur: rootGetters.sysCurrency.currency,
        tcurIcon: rootGetters.sysCurrency.currencyIcon
      };
      return exchangeInfo;
    },
    /**
     * 页面顶部右上角货币选择使用
     * 查询用户货币与官方货币的符号和汇率
     * @param state
     * @param rootState
     * @param rootGetters
     * @param commit
     * @param dispatch
     * @param playload
     * @returns {Promise<*&{tcurIcon: string, scurIcon, tcur: string}>}
     */
    async querySysExChangeInfo({ state, rootState, rootGetters, commit, dispatch }, playload) {
      if (!rootGetters.sysApiCoin.cur) {
        await dispatch('querySystemConfig');
      }
      const res = await queryCurrencyExchangeInfo();
      if (res.data.code !== 0) {
        return;
      }
      // const exchangeInfo = res.data.data;
      // scur  String  true  兑换编码（用户注册|第三方）
      // tcur  String  true  官方编码
      const exchangeInfo = {
        ...res.data.data,
        scurIcon: res.data.data.icon,
        tcur: rootGetters.sysCurrency.currency,
        tcurIcon: rootGetters.sysCurrency.currencyIcon
      };
      commit(SET_SYS_EXCHANGE_INFO, exchangeInfo);
      return exchangeInfo;
    },
    /**
     * 与querySysExChangeInfo不用的是通过改变header内的scur字段进行查询
     * @param state
     * @param rootState
     * @param rootGetters
     * @param commit
     * @param dispatch
     * @param playload
     * @returns {Promise<*>}
     */
    async queryApiCoinExChangeInfo({ state, rootState, rootGetters, commit, dispatch }, playload = {}) {
      const { headers } = playload || {};
      if (!rootGetters.sysApiCoin.cur) {
        await dispatch('querySystemConfig');
      }
      const res = await queryCurrencyExchangeInfo({}, {
        headers
      });
      if (res.data.code !== 0) {
        return;
      }
      return {
        ...res.data.data,
        scurIcon: res.data.data.icon,
        tcur: rootGetters.sysCurrency.currency,
        tcurIcon: rootGetters.sysCurrency.currencyIcon
      };
    },
  }
}
