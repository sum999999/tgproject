import request from "@/utils/request";

export async function queryTodayBetWin(playload) {
  return request({
    url: "/api/v2/betShare/getTodayBetWin",
    method: "POST",
    data: playload,
    userId: true,
  });
}

export async function queryLotteryChatRooms(playload) {
  return request({
    url: "/api/v2/betShare/getLotteryChatRooms",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}

export async function shareTodayBetWin(playload) {
  return request({
    url: "/api/v2/betShare/shareTodayBetWin",
    method: "POST",
    data: playload,
    userId: true,
  });
}

export async function queryAllowShare(playload) {
  return request({
    url: "/api/v2/betShare/checkAllowShare",
    method: "POST",
    data: playload,
    userId: true,
  });
}

export async function shareRecord(playload) {
  return request({
    url: "/api/v2/betShare/shareRecord",
    method: "POST",
    data: playload,
    userId: true,
  });
}

export async function bettingInfoList(playload) {
  return request({
    url: "/api/v2/betting/queryBettingInfoList",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}
