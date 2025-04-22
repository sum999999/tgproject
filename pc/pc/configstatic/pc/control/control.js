var configText = {
  main: "必赢包网", // keyword
  headBg: true,
  language: "zh_CN",
  hotPhone: "400-9966-052",
  isCloseQQ: true,
  siteId: "k70",
  gameTitle: "棋牌",
  homeRedPackedDialog: true,
  FromHkLiuheToFastLiuhe: true,
  defaultTheme: 3, // 默认不配置,必发和500:7， 乐乐:8
  isShowSwitchTemplate: true,
  // hideChatRoomJoinWelcomeMsg: true,
  isCloseJoinRoomMsg: true,
  pageTemplate: {
    temp: { name: "经典" },
    temp1: { name: "游戏风格" },
    temp2: { name: "娱乐城风格" },
    temp3: { name: "体育风格" },
    temp4: { name: "模板4" },
    temp5: { name: "国际版" },
    temp6: { name: "娱乐国际版" },
    temp7: { name: "国际电子版" },
    temp8: { name: "普通电子版" },
    temp9: { name: "蓝白电子版" },
    temp10: { name: "大发彩票", selected: true },
  },
  closeActiveTabs: false,
  feedbackText: "快速充值",
  feedbackImg: true,
};
window.onload = function() {
  loadScript({
    text: "",
  });
};
function loadScript(opt) {
  var resolve, reject;
  var p = new Promise(function(a, b) {
    resolve = a;
    reject = b;
  });
  var script = document.createElement("script");
  script.charset = "UTF-8";
  script.type = "text/javascript";
  opt.id && (script.id = opt.id);
  opt.text && (script.text = opt.text);
  opt.src && (script.src = opt.src);
  script.onload = function(a, b, c) {
    resolve(script);
    opt.complete && opt.complete(script);
  };
  document.body.appendChild(script);
  return p;
}
var metaInfo = "";
var mainDom = document.getElementsByTagName("head")[0];
mainDom.innerHTML = metaInfo + mainDom.innerHTML;
// 自定义覆盖 less变量
const CONTROL_LESS = {
  temp: {
    "@primaryColor": "#1F6EFE",
    "@primary-color": "#1F6EFE",
    "@primary-color-hover": "#0547ef",
    "@background-color": "#ffffff",
    "@button-bg-color": "none",
  },
  temp1: {
    "@primaryColor": "#131522",
    "@primary-color": "#131522",
    "@primary-color-hover": "#414142",
    "@background-color": "#131522",
    "@button-bg-color": "none",
  },
  temp2: {
    "@primaryColor": "#131522",
    "@primary-color": "#131522",
    "@primary-color-hover": "#414142",
    "@background-color": "#131522",
    "@button-bg-color": "none",
  },
  temp3: {
    "@primaryColor": "#0079fe",
    "@primary-color": "#0079fe",
    "@primary-color-hover": "#5279a3",
    "@background-color": "#fff",
    "@button-bg-color": "none",
  },
  temp4: {
    "@primaryColor": "#ff464b",
    "@primary-color": "#ff464b",
    "@primary-color-hover": "#e63e44",
    "@background-color": "#f5f5f5",
    "@button-bg-color": "none",
  },
  temp5: {
    "@primaryColor": "#ddc17c",
    "@primary-color": "#ddc17c",
    "@primary-color-hover": "#ddc17c",
    "@background-color": "#000000",
    "@button-bg-color":
      "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
  },
  temp6: {
    "@primaryColor": "#131522",
    "@primary-color": "#131522",
    "@primary-color-hover": "#414142",
    "@background-color": "#131522",
    "@button-bg-color": "none",
  },
  temp7: {
    "@primaryColor": "#ddc17c",
    "@primary-color": "#ddc17c",
    "@primary-color-hover": "#ddc17c",
    "@background-color": "#000000",
    "@button-bg-color":
      "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
  },
  temp8: {
    "@primaryColor": "#ddc17c",
    "@primary-color": "#ddc17c",
    "@primary-color-hover": "#ddc17c",
    "@background-color": "#000000",
    "@button-bg-color":
      "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
  },
  temp9: {
    "@primaryColor": "#1F6EFE",
    "@primary-color": "#1F6EFE",
    "@primary-color-hover": "#1f5efe",
    "@background-color": "#F0F6FF",
    "@button-bg-color": "linear-gradient(180deg, #3BE6E5 0%, #1F94FF 100%)",
  },
  temp10: {
    "@primaryColor": "#e4393c",
    "@primary-color": "#e4393c",
    "@primary-color-hover": "#d20003",
    "@background-color": "#fff",
    "@button-bg-color": "#e4393c",
    "@lottery-head-text-hover-color": "#ddc17c",
  },
};
