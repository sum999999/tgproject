import {
} from '../mutation_types'

import {queryOpencodes} from "@/api/trend";
import {SET_TREND_HISTORY_LIST, ADD_TREND_HISTORY_ITEM_BEFORE, UPDATE_TREND_HISTORY_ITEM} from "../mutation_types";
import isEmpty from "lodash/isEmpty";

export default {
    state: {
        historyList: [] // 历史记录
    },
    getters: {
        historyList: state => state.historyList,
        findHistoryItemByPeriodNo: (state) => {
            return (periodNo) => {
                return state.historyList.find((lottery) => {
                    return periodNo.indexOf(lottery.periodNo) !== -1;
                });
            }
        }
    },
    mutations: {
        [SET_TREND_HISTORY_LIST](state, playload) {
            state.historyList = playload;
        },
        [ADD_TREND_HISTORY_ITEM_BEFORE](state, playload) {
            state.historyList.unshift(playload);
        },
        [UPDATE_TREND_HISTORY_ITEM](state, playload) {
            const {periodNo, lotteryNumber} = playload;
            const historyItem = state.historyList.find((lottery) => {
                return periodNo.indexOf(lottery.periodNo) !== -1;
            });
            if (!isEmpty(historyItem)) {
                historyItem.lotteryNumber = lotteryNumber;
            }
        },
    },
    actions: {
        // 查询历史记录列表
        async queryLotHoistoryList({ state, commit, dispatch }, playload) {
            const res = await queryOpencodes(playload);
            const {data, code, msg} = res.data;
            const {records} = data;
            if (code !== 0) {
                throw new Error(msg);
            }
            const result = records || [];
            commit(SET_TREND_HISTORY_LIST, result);
            return records;
        },
        // 添加一条历史记录
        addLotHistoryItem({ state, commit, dispatch }, playload) {
            const {lotteryId, endTime, periodNo, lotteryNumber} = playload;
            commit(ADD_TREND_HISTORY_ITEM_BEFORE, {
                lotteryId,
                endTime,
                periodNo,
                lotteryNumber
            })
        },
        // 通过periodNo期数找到对应历史条目并更新
        updateHistoryLotItem({ state, commit, dispatch }, playload) {
            const {lotteryId, endTime, periodNo, lotteryNumber} = playload;
            // const historyItem = state.historyList.find((lottery) => {
            //     return lottery.periodNo === periodNo;
            // });
            // if (isEmpty(historyItem)) {
            //     commit(ADD_TREND_HISTORY_ITEM_BEFORE, {
            //         lotteryId,
            //         endTime,
            //         periodNo,
            //         lotteryNumber
            //     })
            // }
            commit(UPDATE_TREND_HISTORY_ITEM, {
                periodNo,
                lotteryNumber
            });
        },
    }
}
