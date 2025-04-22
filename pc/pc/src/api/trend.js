import request from "@/utils/request";

// 查询指定彩种历史记录
// lotteryId: "41"
// num: 60
// time: "2019-10-30"
export async function queryOpencodes(playload = {}) {
    return request({
        url: "/api/v2/trend/queryOpencodes",
        method: "POST",
        data: playload,
        unenc: true
    });
}
