export const RongYunKeys = {
    // 暂时不能改变ryUuid这个值，当前代码在重构中，为了渐进兼容之前的代码
    // 存储游客加入融云信息{rongYunUserId, token, name: "游客"}
    RONGYUN_USER_INFO: "ryUuid",
};

export const RongYunChatRoomJoinStatus = { // 加入聊天室状态
    OFF: 0,     // 离线
    ERROR: 1,   // 错误
    ON: 2       // 加入成功
};

export const RongYunConnectStatus = { // 融云连接状态
    ERROR: -1,
    CONNECTED: 0,      // 链接成功
    CONNECTING: 1,    // 正在连接中
    DISCONNECTED: 2, // 手动调用 disconnect 方法或者用户被踢下线 会触发这个事件
    SUSPEND: 13
};

export const MessageObjectNames = {
    HB: "TG:HBMsg", // 红包
    JOIN_CHATROOM: "TG:LotteryWelcomeJoinMessage", // 加入聊天室
    WELCOME: "TG:LotteryTipsForSelfMessage", // 欢迎 （默认：尊敬的用户，欢迎来到......）
    CLEAR_CHATROOM_MSG: "TG:ClearMessage", // 聊天室清屏
    FOLLOW_ORDER: "TG:BettingMsg",  // 跟单
    EMOJI: "TG:LotteryEmojiMessage", // 自定义的GIF表情
    FOLLOW_LOTTERY: "TG:BetplanBotMsg", // 一键跟投
    LOTTERY: "TG:LotteryMsg", // 开奖
    SHARE_BET_WIN: "TG:ShareBetWin", // 注单详情-晒单 分享今日收益
    SHARE_BET_MSG: "TG:ShareBetMsg" // 用户手动分享注单
};

export const MessageTypes = {
    HB_MESSAGE: "HBMessage",
    GIF_MESSAGE: "GifMessage"
};

export const PushTypes = { // 后台推送来的消息
    LOTTERY: "01", // 新的开奖
    SYSTEM_NOTICE: "02", // 系统公告
    SPECIAL_OFFERS: "03", // 优惠活动
    LOTTERY_ORDER: "04", // 中奖注单
    USER_BALANCE_CHANGE: "05", // 用户余额改变
    LOTTERY_PUT_RIGHT: "06", // 开奖纠正错误
    VERSION_UPDATE: "07", // 版本更新
    CHATROOM_AUTH_CHANGE: "09", // 聊天室权限变更通知，如被禁言等
    FIREWORKS_EXPLODE: "11", // 其他用户中奖金额达到某个档位，会往聊天室里发，就是聊天室里的烟花爆炸消息
    CHATROOM_NOTICE: "13", // 聊天室公告
    CHATROOM_ALL_BANNED: "14", // 聊天室全局禁言
    GIFT_BAG_ALERT: "16", // 礼包中心达标提醒
    ROB_ZHUANG_ROOM_BANKER_CHANGE: "18", // 抢庄房有新的庄家
    ROB_ZHUANG_ROOM_CASH_DEPOSIT_CHANGE: "19", // 抢庄房庄家的保证金发生变更
    CHATROOM_BANNED_LEVEL: "20", // 后台修改了聊天室的禁言等级、是否开启快捷对话quickDialogue字段的通知、全局禁言时间段通知
    YUEBAO_BALANCE_CHANGE: "21", // 余额宝金额变更
    ROB_ZHUANG_ROOM_SPEAK_MODE: "22", // 抢庄房中聊天室发言模式,
    MEMBER_MSG: "26", // 后台推送会员消息
};

export const MessageLocalStatus = {
    LOADING: "0",
    SUCCESS: "1",
    ERROR: "2"
};
