import request from "@/utils/request";

// 查询购彩彩票列表接口
// lotteryType 为空查询所有彩种
export async function queryLotteryList(playload = {}) {
    return request({
        url: "/api/v2/lottery/queryLotteryList",
        method: "POST",
        data: playload,
        unenc: true
    });
}

// 102.彩票期数列表接口V2版本
// lotteryId: this.data.lotteryId,
// num: 1
export async function queryLotteryRecordListV2(playload = {}) {
    return request({
        url: "/api/v2/lottery/queryLotteryRecordListV2",
        method: "POST",
        data: playload,
        unenc: true
    });
}

// 开奖公告
export async function queryIndexLotteryPrizeList(playload = {}) {
    return request({
        url: "/api/v2/lottery/queryIndexLotteryPrizeList",
        method: "POST",
        data: playload,
        unenc: true
    });
}

export async function queryIndexQuickBettingList(playload = {}) {
    return request({
        url: "/api/v2/lottery/queryIndexQuickBettingList",
        method: "POST",
        data: playload,
        unenc: true
    });
}

export async function queryLotteryTypeRuleList(playload) {
    return request({
        url: "/api/v2/lottery/queryLotteryTypeRuleList",
        method: "POST",
        data: playload,
        unenc: true,
    });
}

export async function getLotteryDetailV2(playload) {
    return request({
        url: "/api/v2/lottery/getLotteryDetailV2",
        method: "POST",
        data: playload,
        unenc: true,
    });
}

export async function queryDragon(playload = {}) {
    return request({
        url: "/api/v2/lottery/dragon",
        method: "POST",
        data: playload,
        unenc: true,
    });
}
