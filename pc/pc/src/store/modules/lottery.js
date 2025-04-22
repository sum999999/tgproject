import {
  SET_LOTTERY_SELECT_LIST,
  SET_LOTTERY_INFO,
  SET_DEFAULT_LOTTERY_SELECT,
  SET_LOTTERY_BUY_LOTTERY_TYPE,
  SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE,
} from "../mutation_types";

import {
  queryLotteryList,
  queryLotteryRecordListV2,
  queryLotteryTypeRuleList,
  getLotteryDetailV2,
} from "@/api/lottery";

export default {
  state: {
    lotterySelectList: [], //彩票选择列表
    defaultLotterySelect: {},
    lotteryInfo: {}, // 查询彩种的信息
    lotteryBuyLotteryType: "",
    lotteryBuyLotteryShowPlayRule: false,
  },
  getters: {
    lotterySelectList: (state) => state.lotterySelectList,
    defaultLotterySelect: (state) => state.defaultLotterySelect,
    lotteryInfo: (state) => state.lotteryInfo, //prize: 最新一期开奖信息 record 下期彩种开奖信息
    lotteryBuyLotteryType: (state) => state.lotteryBuyLotteryType,
    lotteryBuyLotteryShowPlayRule: (state) =>
      state.lotteryBuyLotteryShowPlayRule,
  },
  mutations: {
    [SET_LOTTERY_SELECT_LIST](state, playload) {
      state.lotterySelectList = playload;
    },
    [SET_DEFAULT_LOTTERY_SELECT](state, playload) {
      state.defaultLotterySelect = playload;
    },
    [SET_LOTTERY_INFO](state, playload) {
      state.lotteryInfo = playload;
    },
    [SET_LOTTERY_BUY_LOTTERY_TYPE](state, playload) {
      state.lotteryBuyLotteryType = playload;
    },
    [SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE](state, playload) {
      state.lotteryBuyLotteryShowPlayRule = playload;
    },
  },
  actions: {
    // 查询聊天室右侧-开奖区-彩票选择列表
    async queryLotterySelectList({ state, commit, dispatch }, playload) {
      const res = await queryLotteryList({ lotteryType: "-2" });
      const { data, code, msg } = res.data;
      const { lotteryTypeList } = data;
      if (code !== 0) {
        throw new Error(msg);
      }
      const lotteryCodeAllObj = lotteryTypeList[0] || {};
      const result = lotteryCodeAllObj.lotteryList || [];
      commit(SET_LOTTERY_SELECT_LIST, result);
      commit(SET_DEFAULT_LOTTERY_SELECT, result[0] || {});
      return result;
    },
    async queryDefaultLotSelectById({ state, commit, dispatch }, playload) {
      const { lotteryId } = playload;
      const result = state.lotterySelectList.find((obj) => {
        return obj.lotteryId === lotteryId;
      });
      commit(SET_DEFAULT_LOTTERY_SELECT, result);
    },
    async queryLotInfo({ state, commit, dispatch }, playload) {
      const { lotteryId, num = 1 } = playload;
      const res = await queryLotteryRecordListV2({ lotteryId, num });
      const { data, code, msg } = res.data;
      const { recordList, prizeHistoryList } = data;
      if (code !== 0) {
        throw new Error(msg);
      }
      const record = recordList[0] || {};
      record.lotteryId = lotteryId;
      const prize = prizeHistoryList[0] || {};
      prize.lotteryId = lotteryId;
      const result = { record, recordList, prize, prizeHistoryList };
      commit(SET_LOTTERY_INFO, result);
      return result;
    },
    deleteLotterySelectList({ state, commit, dispatch }, playload) {
      commit(SET_LOTTERY_SELECT_LIST, []);
    },
    deleteDefaultLotterySelect({ state, commit, dispatch }, playload) {
      commit(SET_DEFAULT_LOTTERY_SELECT, {});
    },
    deleteLotInfo({ state, commit, dispatch }, playload) {
      commit(SET_LOTTERY_INFO, {});
    },
    async queryLotteryTypeRuleList(
      { state, rootGetters, commit, dispatch },
      playload = {}
    ) {
      const res = await queryLotteryTypeRuleList();
      if (res.data.code !== 0) {
        return [];
      }
      return res.data.data.lotteryTypeRuleList || [];
    },
    async getLotteryDetailV2(
      { state, rootGetters, commit, dispatch },
      playload = {}
    ) {
      const res = await getLotteryDetailV2(playload);
      if (res.data.code !== 0) {
        return [];
      }
      return res.data.data || {};
    },
  },
};
