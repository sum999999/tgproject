import Store from "@/store";

const internationalHideAuthorities = [
  // "personalCenter.link",
  // "personalCenter.report",
  // "personalCenter.agentCenter",
  "personalCenter.borrow",
  // "personalCenter.description",
  // "personalCenter.userManage",
  // "personalCenter.myExpand",
  // "personalCenter.expand",
  // "personalCenter.override",
  // "personalCenter.subReport",
  // "personalCenter.agentReport",
  // "personalCenter.agentBetting",
  // "personalCenter.agentTrade",
  "personalCenter.record.detailAllowShared",
  "validator.chinese",
  "validator.phone.length",
  "buyLottery.chaseNum",
  "personalCenter.loginHistory",
  "home.chatRoom",
  "buyLottery.itemLimit",
  "buyLottery.preset",
  "personalCenter.trade.desc",
  "buyLottery.odds",
  "buyLottery.markSix",
  "chatRoom.pkVideo",
  "longqueue"
];

const NotInternationalHideAuthorities = [
  "element.areaCode",
  "element.unit",
  "element.currencyExchange",
  "element.language",
  "element.coin",
  "v4.skin",
  "buyLottery.bigBall",
  "buyLottery.singleLimit",
  "buyLottery.decimals",
  "buyLottery.jettons",
  "personalCenter.accountInfo"
];

function hasPermission(key) {
  if (Store.getters.isInternational) {
    return internationalHideAuthorities.indexOf(key) === -1;
  } else {
    return NotInternationalHideAuthorities.indexOf(key) === -1;
  }
}

export { hasPermission };
