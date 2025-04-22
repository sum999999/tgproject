import request from "@/utils/request";

export async function verifyDigiccy(playload, config) {
  return request({
    url: "/api/v2/user/verifyDigiccy",
    method: "POST",
    data: playload,
    unenc: false,
    userId: true,
    ...config,
  });
}

export async function queryLotUserBankInfo(playload, config) {
  return request({
    url: "/api/v2/user/queryLotUserBankInfo",
    method: "POST",
    data: playload,
    userId: true,
    ...config,
  });
}

export async function getUserPayPwd(playload, config) {
  return request({
    url: "/api/v2/user/getUserPayPwd",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
    ...config,
  });
}

export async function queryBalance(playload, config) {
  return request({
    url: "/api/v2/user/queryBalance",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
    ...config,
  });
}

export async function queryCurrencyExchangeInfo(playload = {}, config) {
  return request({
    url: "/api/v2/user/queryCurrencyExchangeInfo",
    method: "POST",
    userId: false,
    unenc: true,
    ...config,
  });
}

export async function queryCurrencyExchangeByScur(playload = {}, config) {
  return request({
    url: "/api/v2/user/queryCurrencyExchangeByScur",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
    ...config,
  });
}

export async function handsfeeRecharge(playload = {}, config) {
  return request({
    url: "/api/v2/user/handsfeeRecharge",
    method: "POST",
    data: playload,
    userId: true,
    unenc: false,
    ...config,
  });
}

export async function getUsablePayType(playload = {}, config) {
  return request({
    url: "/api/v2/user/getUsablePayType",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
    ...config,
  });
}

// 礼包中心活动列表
export async function courtesy(playload = {}) {
  return request({
    url: "/api/v2/user/activity/courtesy",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

// 活动列表详情
export async function getDetail(playload = {}) {
  return request({
    url: "/api/v2/user/courtesy/getDetail",
    method: "POST",
    data: playload,
    unenc: true,
  });
}

// 领取奖励接口
export async function receivePrizeMoney(playload, config) {
  return request({
    url: "/api/v2/user/get/courtesy",
    method: "POST",
    data: playload,
    ...config,
    loading: true,
  });
}

// 获取钱包信息接口
export async function getWalletInfo(channelId = {}, config) {
  return request({
    url: "api/v2/user/getWalletInfo",
    method: "POST",
    data: channelId,
    userId: true,
    unenc: true,
    ...config,
  });
}

// 绑定第三方内嵌钱包 获取验证码
export async function sendCodeForWallet(playload = {}) {
  return request({
    url: "api/v2/user/sendCodeForWallet",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}

// 绑定第三方内嵌钱包
export async function bindWallet(playload = {}) {
  return request({
    url: "api/v2/user/bindWallet",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}

// 解绑第三方内嵌钱包
export async function unbindWallet(playload = {}) {
  return request({
    url: "api/v2/user/unbindWallet",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}
