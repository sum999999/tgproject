import {
  queryTodayBetWin,
  queryLotteryChatRooms,
  shareTodayBetWin,
  queryAllowShare,
  shareRecord,
} from "@/api/betShare";
import {
  SAVE_BETSHARE_TODAY_BETWIN,
  SAVE_BETSHARE_BETTING,
} from "../mutation_types";
import { bettingInfoList } from "@/api/betShare";
import { convert2ServerDateTime } from "@/filters/index";
export default {
  state: {
    todayBetWin: {
      // 今日战绩
      allowShare: false,
      betMoney: 0, // 投注金额
      prizeMoney: 0, // 盈利金额
    },
    bettingInfoList: [], // 投注记录
  },
  getters: {
    todayBetWin: (state) => state.todayBetWin,
    bettingInfoList: (state) => state.bettingInfoList,
  },
  mutations: {
    [SAVE_BETSHARE_TODAY_BETWIN](state, playload) {
      state.todayBetWin = playload;
    },
    [SAVE_BETSHARE_BETTING](state, playload) {
      state.bettingInfoList = playload;
    },
  },
  actions: {
    async queryTodayBetWin({ state, commit, dispatch }, playload) {
      const res = await queryTodayBetWin();
      const { code, data = {} } = res.data || {};
      if (code !== 0) return;
      const { allowShare = false, betMoney, prizeMoney } = data || {};
      commit(SAVE_BETSHARE_TODAY_BETWIN, {
        allowShare,
        betMoney,
        prizeMoney,
      });
    },
    async queryLotteryChatRooms({ state, commit, dispatch }, playload) {
      const { current = 1, size = 10, userBettingRecordId } = playload || {};
      const res = await queryLotteryChatRooms({
        current,
        size,
        userBettingRecordId,
      });
      const { code, data = {} } = res.data || {};
      if (code !== 0) return;
      const { total, current: sCurrent, pages, size: sSize, records } =
        data || {};
      return {
        total,
        current: sCurrent,
        pages,
        size: sSize,
        records,
      };
    },
    async shareTodayBetWin({ state, commit, dispatch }, playload) {
      const { ryRoomId } = playload || {};
      const res = await shareTodayBetWin({ ryRoomId });
      const { code, data = {} } = res.data || {};
      if (code !== 0) return;
      return true;
    },
    async queryAllowShare({ state, commit, dispatch }, playload) {
      const { userBettingRecordId } = playload || {};
      const res = await queryAllowShare({ userBettingRecordId });
      const { code, data = {} } = res.data || {};
      if (code !== 0) return;
      const { isAllow = false } = data || {};
      return isAllow;
    },
    async shareRecord({ state, commit, dispatch }, playload) {
      const { userBettingRecordId, ryRoomId } = playload || {};
      const res = await shareRecord({ userBettingRecordId, ryRoomId });
      const { code, data = {} } = res.data || {};
      if (code !== 0) return;
      return true;
    },
    async bettingRecord({ state, commit, dispatch }, playload) {
      let gtBuyTime = new Date();
      gtBuyTime.setHours(0);
      gtBuyTime.setMinutes(0);
      gtBuyTime.setSeconds(0);
      gtBuyTime = convert2ServerDateTime(gtBuyTime);
      let ltBuyTime = new Date();
      ltBuyTime.setHours(23);
      ltBuyTime.setMinutes(59);
      ltBuyTime.setSeconds(59);
      ltBuyTime = convert2ServerDateTime(ltBuyTime);
      const param = {
        status: "",
        current: 1,
        size: 20,
        ltBuyTime,
        gtBuyTime,
      };
      const response = await bettingInfoList(param);
      if (response.data.code !== 0) {
        return void 0;
      }
      commit(SAVE_BETSHARE_BETTING, response.data.data.bettingInfoList);
    },
  },
};
