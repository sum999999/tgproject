// import store from '@/store'
// import ryEmoji from 'ryEmoji' //融云表情
// import 'RCS' //融云上传图片
// import DateUtil from '@/utils/format_date.js'
//
// const barOption = {
//     barColor: '#959595', //滚动条颜色
//     barWidth: 6, //滚动条宽度
//     railColor: '#eee', //导轨颜色
//     barMarginRight: 0, //垂直滚动条距离整个容器右侧距离单位（px）
//     barMaginBottom: 0, //水平滚动条距离底部距离单位（px)
//     barOpacityMin: 0.3, //滚动条非激活状态下的透明度
//     zIndex: 'auto', //滚动条z-Index
//     autohidemode: true, //自动隐藏模式
//     horizrailenabled: false //是否显示水平滚动条
// }
//
// function initPlanHeight() {
//     // let winH = window.innerHeight;
//     // let planMains1 = document.querySelector('#planMains1');
//     // let planMains2 = document.querySelector('#planMains2');
//     // let planMains3 = document.querySelector('#planMains3');
//     // let planTypes = document.querySelector('#planTypes');
//     // if (!planMains1) return
//     // let planH = winH - planTypes.getBoundingClientRect().top - planTypes.clientHeight - 50 + 'px'
//     // planMains1.style.height = planH;
//     // planMains2.style.height = planH;
//     // planMains3.style.height = planH;
//     let winH = window.innerHeight
//     let planMains1 = document.querySelector('#planMains1')
//     let rightTab = document.querySelector('#rightTab')
//     let app = document.querySelector('#app')
//     if (!planMains1) return
//     // let planH = winH - rightTab.clientHeight - rightTab.getBoundingClientRect().top - 20 + 'px'
//     let planH =
//         winH -
//         rightTab.clientHeight -
//         rightTab.getBoundingClientRect().top +
//         'px' //2019.6.29 by xiaojiji
//     planMains1.style.height = planH
// }
//
// function initVedioHeight() {
//     let winH = window.innerHeight
//     let vedio = document.querySelector('#vedio')
//     let rightTab = document.querySelector('#rightTab')
//     let rightDetail = document.querySelector('#rightDetail')
//     if (vedio) {
//         // vedio.style.height = winH - rightTab.getBoundingClientRect().top - rightTab.clientHeight - rightDetail.clientHeight - 20 + 'px';
//         vedio.style.height =
//             winH -
//             rightTab.getBoundingClientRect().top -
//             rightTab.clientHeight -
//             rightDetail.clientHeight +
//             'px' // 2019.6.29 by xiaojiji
//     }
// }
//
// function initPrizeHeight() {
//     let winH = window.innerHeight
//     let prizeNotice = document.querySelector('#prizeNotice')
//     let rightTab = document.querySelector('#rightTab')
//     // prizeNotice && (prizeNotice.style.height = winH - rightTab.getBoundingClientRect().top - rightTab.clientHeight - 20 + 'px');
//     prizeNotice &&
//         (prizeNotice.style.height =
//             winH -
//             rightTab.getBoundingClientRect().top -
//             rightTab.clientHeight +
//             'px')
// }
// function initPrivateListHeight() {
//     let privateList = document.querySelector('#privateList')
//     let chatControl = document.querySelector('#chatControl')
//     let winH = window.innerHeight
//     if (privateList) {
//         privateList.style.height =
//             winH -
//             privateList.getBoundingClientRect().top -
//             chatControl.clientHeight +
//             'px'
//     }
// }
// function initContactList() {
//     let winH = window.innerHeight
//     let kflist = document.querySelector('#kflist')
//     let frendslist = document.querySelector('#frendslist')
//     if (kflist) {
//         kflist.style.height =
//             winH - kflist.getBoundingClientRect().top - 10 + 'px'
//     }
//     if (frendslist) {
//         frendslist.style.height =
//             winH - frendslist.getBoundingClientRect().top - 10 + 'px'
//     }
// }
// function initHeight() {
//     let header = document.querySelector('#header')
//     let chatNotice = document.querySelector('#chatNotice')
//     let chatList = document.querySelector('#chatList')
//     let chatControl = document.querySelector('#chatControl')
//     let userlist2 = document.querySelector('#userlist2')
//     let leftTab = document.querySelector('#leftTab')
//     let chatRoomNamewp = document.querySelector('#chatRoomNamewp')
//
//     let winH = window.innerHeight
//
//     if (userlist2) {
//         userlist2.style.height =
//             winH - leftTab.getBoundingClientRect().top - 79 + 'px'
//     }
//     //2019.6.11
//     if (chatNotice) {
//         let chatListH =
//             winH -
//             header.clientHeight -
//             chatNotice.clientHeight -
//             chatControl.clientHeight -
//             3 -
//             chatRoomNamewp.clientHeight +
//             'px'
//         // let chatListH = winH - header.clientHeight - chatNotice.clientHeight - chatControl.clientHeight -10 -chatRoomNamewp.clientHeight + 'px';
//         chatList.style.height = chatListH
//     }
//
//     initPlanHeight()
//     initVedioHeight()
//     initPrizeHeight()
//     initPrivateListHeight()
//     initContactList()
// }
//
// function initRongIM(token, obj, connectCallBack, msgCallBack) {
//     connectCallBack = Object.assign(
//         {
//             onError: function(errorCode) {
//                 let info = ''
//                 switch (errorCode) {
//                     case RongIMLib.ErrorCode.TIMEOUT:
//                         info = '超时'
//                         break
//                     case RongIMLib.ErrorCode.UNKNOWN_ERROR:
//                         info = '未知错误'
//                         break
//                     case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
//                         info = '不可接受的协议版本'
//                         break
//                     case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
//                         info = 'appkey不正确'
//                         break
//                     case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
//                         info = '服务器不可用'
//                         break
//                 }
//             }
//         },
//         connectCallBack
//     )
//
//     msgCallBack = Object.assign({}, msgCallBack)
//
//     let vm = obj,
//         reconnetConfig = {
//             auto: true, // 默认 false, true 启用自动重连，启用则为必选参数
//             url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js', // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
//             rate: [100, 1000, 3000, 6000, 10000] // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
//         }
//     try {
//         RongIMClient.getInstance().disconnect()
//     } catch (e) {}
//
//     vm.$systemConfig().then(data => {
//         RongIMClient.init(data.ryAppKey) //这是初始化，需要填参数就是你的APPKEY
//         RongIMClient.connect(token, connectCallBack)
//
//         // 连接状态监听器
//         RongIMClient.setConnectionStatusListener({
//             onChanged: function(status) {
//                 switch (status) {
//                     //链接成功
//                     case RongIMLib.ConnectionStatus.CONNECTED:
//                         vm.console('connect 0')
//                         break
//                     //正在链接
//                     case RongIMLib.ConnectionStatus.CONNECTING:
//                         vm.console('connect 1')
//                         break
//                     //断开
//                     case RongIMLib.ConnectionStatus.DISCONNECTED:
//                         vm.console('connect 2')
//                         // store.commit("getRoomSuccess", 0);
//                         //     RongIMClient.reconnect(connectCallBack, reconnetConfig);
//                         break
//                     //网络不可用
//                     case RongIMLib.ConnectionStatus.SUSPEND:
//                         vm.console('connect 4')
//                         //  store.commit("getRoomSuccess", 0);
//                         RongIMClient &&
//                             RongIMClient.reconnect(
//                                 connectCallBack,
//                                 reconnetConfig
//                             )
//                         break
//                 }
//             }
//         })
//
//         // 消息监听器
//         RongIMClient.setOnReceiveMessageListener(msgCallBack)
//     })
// }
// function roomIMDisconnect() {
//     try {
//         try {
//             RongIMClient.getInstance().logout()
//             RongIMClient.getInstance().disconnect()
//         } catch (error) {}
//     } catch (error) {}
// }
// function disconnectRongIM(callBack) {
//     try {
//         RongIMClient.getInstance().quitChatRoom(window.dcpRoom, {
//             onSuccess: function() {
//                 // 退出聊天室成功。
//
//                 RongIMClient.getInstance().logout()
//                 callBack && callBack()
//                 //   RongIMClient.getInstance().disconnect(callBack && callBack())
//             },
//             onError: function(error) {
//                 // 退出聊天室失败。
//                 callBack && callBack()
//             }
//         })
//     } catch (error) {
//         //   RongIMClient.getInstance().disconnect();
//         callBack && callBack()
//     }
// }
//
// var emoji = {
//     init: function() {
//         //  RongIMLib.RongIMEmoji.init();
//         return ryEmoji.list
//     },
//     emojiToHTML: function(emojiContent) {
//         return ryEmoji.emojiToHTML(emojiContent)
//     },
//     symbolToEmoji: function(sym) {
//         return ryEmoji.symbolToEmoji(sym)
//     },
//     getEmoji: function() {
//         return ryEmoji.list.map(function(data) {
//             return data.node
//         })
//     }
// }
//
// function sendMessage(message, option) {
//     option = Object.assign(
//         {
//             conversationType: RongIMLib.ConversationType.CHATROOM,
//             targetId: window.dcpRoom,
//             onSuccess: function() {},
//             onError: function() {}
//         },
//         option
//     )
//     RongIMLib.getInstance().sendMessage(
//         option.conversationType,
//         option.targetId,
//         message,
//         {
//             // 发送消息成功
//             onSuccess: function(message) {
//                 //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
//                 option.onSuccess && option.onSuccess(message)
//             },
//             onError: function(errorCode, message) {
//                 var info = ''
//                 option.onError && option.onError(errorCode, message)
//                 switch (errorCode) {
//                     case RongIMLib.ErrorCode.TIMEOUT:
//                         info = '超时'
//                         break
//                     case RongIMLib.ErrorCode.UNKNOWN_ERROR:
//                         info = '未知错误'
//                         break
//                     case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
//                         info = '在黑名单中，无法向对方发送消息'
//                         break
//                     case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
//                         info = '不在讨论组中'
//                         break
//                     case RongIMLib.ErrorCode.NOT_IN_GROUP:
//                         info = '不在群组中'
//                         break
//                     case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
//                         info = '不在聊天室中'
//                         break
//                     default:
//                         info = ''
//                         break
//                 }
//             }
//         }
//     )
// }
//
// function clearUnreadCount(targetId, option = {}) {
//     const defOption = Object.assign(
//         {
//             conversationType: RongIMLib.ConversationType.PRIVATE
//         },
//         option
//     )
//     return new Promise((resolve, reject) => {
//         const im = RongIMLib.getInstance();
//         var conversation = im.Conversation.get({
//             targetId: targetId,
//             type: defOption.conversationType
//         });
//         conversation.read().then(function(){
//             resolve();
//         }).catch(e => {
//             reject(e)
//         });
//     })
// }
// function removeConversation(targetId, option = {}) {
//     const defOption = Object.assign(
//         {
//             conversationType: RongIMLib.ConversationType.PRIVATE
//         },
//         option
//     )
//     return new Promise((resolve, reject) => {
//         RongIMClient.getInstance().removeConversation(
//             defOption.conversationType,
//             targetId,
//             {
//                 onSuccess: function(bool) {
//                     resolve()
//                 },
//                 onError: function(error) {
//                     reject(new Error())
//                 }
//             }
//         )
//     })
// }
//
// function getHistoryMessages(targetId, option = {}) {
//     let messageList = []
//     const defOption = Object.assign(
//         {
//             conversationType: RongIMLib.ConversationType.PRIVATE,
//             timestrap: null, // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
//             count: 20 // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
//         },
//         option
//     )
//     return new Promise((resolve, reject) => {
//         fetchList()
//         function fetchList() {
//             const im = RongIMLib.getInstance();
//             var conversation = im.Conversation.get({
//                 targetId: targetId,
//                 type: defOption.conversationType
//             });
//             var option = {
//                 timestrap: defOption.timestrap,
//                 count: defOption.count
//             };
//             conversation.getMessages(option).then(function(result){
//                 var list = result.list; // 历史消息列表
//                 var hasMore = result.hasMore; // 是否还有历史消息可以获取
//                 messageList = messageList.concat([...list])
//                 resolve(messageList)
//             }).catch(e => {
//                 reject([]);
//                 console.log('GetHistoryMessages, errorcode:', e)
//             });
//         }
//     })
// }
//
// function imgUpload(event, option) {
//     let thisTarget = event.target || event.srcElement
//     const backfiles = Array.prototype.slice(event.target.files, 0).concat([])
//     let _file = thisTarget.files
//     // console.log(_file);
//     option = Object.assign({}, option)
//     for (let i = 0; i < _file.length; i++) {
//         ;(function(file) {
//             option.onfileBefore && option.onfileBefore(file)
//             RCS.imageStartUpload(
//                 file,
//                 function(data) {
//                     option.onSuccess && option.onSuccess(data, file)
//                 },
//                 {
//                     onProgress: function(loaded, total) {
//                         option.onProgress && option.onProgress(loaded, total)
//                     },
//                     onError: function(errorCode) {
//                         option.onError && option.onError()
//                     }
//                 }
//             )
//         })(_file[i])
//     }
//     thisTarget.value = ''
// }
// var messageItem = {
//     file: function(file) {
//         var name = file.name || '',
//             index = name.lastIndexOf('.') + 1,
//             type = name.substring(index)
//         // 发送文件消息请参考： http://rongcloud.cn/docs/web_api_demo.html#发送消息
//         // 创建文件消息
//         return new RongIMLib.FileMessage({
//             name: file.name,
//             size: file.size,
//             type: type,
//             messageName: 'FileMessage',
//             fileUrl: file.downloadUrl
//         })
//     },
//     image: function(image, extra = {}) {
//         /*   if (extra.messageUId) {
//         extra.type = '100'
//       } */
//         return new RongIMLib.ImageMessage({
//             content: image.thumbnail,
//             imageUri: image.downloadUrl,
//             messageName: 'ImageMessage',
//             extra: extra
//         })
//     },
//     text: function(msg, extra = {}) {
//         msg = emoji.symbolToEmoji(msg)
//         /*   if (extra.messageUId) {
//         extra.type = '100'
//       } */
//         return new RongIMLib.TextMessage({
//             content: msg,
//             messageName: 'TextMessage',
//             extra: extra
//         })
//     }
// }
//
// function getFileUrl(data, option) {
//     option = Object.assign(
//         {
//             onSuccess: function() {}
//         },
//         option
//     )
//     var urlItem = {
//         file: function(data) {
//             if (RCS.config.fileConfig && RCS.config.fileConfig.isPrivate) {
//                 if (data.rc_url.type == 1) {
//                     data.downloadUrl = data.rc_url.path
//                 } else {
//                     data.downloadUrl =
//                         RCS.config.fileConfig.fileServer + data.rc_url.path
//                 }
//                 var msg = messageItem[data.fileType](data)
//                 option.onSuccess(msg)
//             } else {
//                 var fileType = RongIMLib.FileType.FILE
//                 RongIMClient.getInstance().getFileUrl(
//                     fileType,
//                     data.filename,
//                     data.name,
//                     {
//                         onSuccess: function(result) {
//                             data.downloadUrl = result.downloadUrl
//                             var msg = messageItem[data.fileType](data)
//                             option.onSuccess(msg)
//                         },
//                         onError: function(error) {
//                             showResult('getFileToken error:' + error)
//                         }
//                     }
//                 )
//             }
//         },
//         image: function(data) {
//             if (
//                 RCS.config &&
//                 RCS.config.upload &&
//                 RCS.config.upload.isPrivate
//             ) {
//                 if (data.rc_url.type == 1) {
//                     data.downloadUrl = data.rc_url.path
//                 } else {
//                     data.downloadUrl =
//                         RCS.config.upload.fileServer + data.rc_url.path
//                 }
//                 var msg = messageItem[data.fileType](data)
//                 option.onSuccess(msg)
//             } else {
//                 var fileType = RongIMLib.FileType.IMAGE
//                 RongIMClient.getInstance().getFileUrl(
//                     fileType,
//                     data.filename,
//                     null,
//                     {
//                         onSuccess: function(result) {
//                             data.downloadUrl = result.downloadUrl
//                             var msg = messageItem[data.fileType](data)
//                             option.onSuccess(msg)
//                         },
//                         onError: function(error) {}
//                     }
//                 )
//             }
//         }
//     }
//     urlItem[data.fileType](data)
// }
//
// function handlerName(name) {
//     // 统一*名字
//     if (!name) return
//     return name.substr(0, 2) + '***' + name.substr(name.length - 2, name.length)
// }
//
// function getGifConfig() {
//     let gifConfig = {
//         staticSrc: '/static/images/chat/',
//         groups: [
//             {
//                 groupName: 'emoji1',
//                 groupImg: require('@/assets/images/chat/gif-gulid1.png'),
//                 len: 31,
//                 prefix: 'lottery',
//                 list: []
//             },
//             {
//                 groupName: 'emoji2',
//                 groupImg: require('@/assets/images/chat/gif-gulid2.png'),
//                 len: 16,
//                 prefix: 'chick',
//                 list: []
//             }
//         ]
//     }
//     for (let groups of gifConfig.groups) {
//         for (let j = 1; j < groups.len; j++) {
//             groups.list.push({
//                 src: groups.prefix + '_' + j + '.gif'
//             })
//         }
//     }
//     return gifConfig
// }
// function isAddMessageSplitTime(curMessage, preMessage) {
//     if (preMessage) {
//         if (curMessage.sentTime - preMessage.sentTime > 1000) {
//             //1000 * 60 * 5
//             return true
//         }
//     }
//     return false
// }
// const SELF_MESSAGE_TYPE = {
//     HB_Msg_TYPE: 'TG:HBMsg',
//     JOIN_Msg_TYPE: 'TG:LotteryWelcomeJoinMessage',
//     WEL_Msg_TYPE: 'TG:LotteryTipsForSelfMessage',
//     CLEAR_Msg_TYPE: 'TG:ClearMessage',
//     BETTING_Msg_TYPE: 'TG:BettingMsg',
//     GIF_Msg_TYPE: 'TG:LotteryEmojiMessage',
//     BETPLAN_BOT_MSG: 'TG:BetplanBotMsg'
// }
//
// function chatFormateDate(value) {
//     if (!value) return ''
//     let date = new Date(value)
//     let currentDate = new Date()
//     if (
//         Math.abs(currentDate.getTime() - date.getTime()) < 1000 * 3600 * 24 &&
//         Math.abs(currentDate.getDate() - date.getDate()) <= 0
//     ) {
//         date = DateUtil.getFormatDate2(date, 'hh:mm:ss') /* yymmddhhmmss */
//         return date
//     } else if (Math.abs(currentDate.getFullYear() - date.getFullYear()) <= 0) {
//         return DateUtil.getFormatDate2(date, 'MM-dd hh:mm:ss')
//     } else {
//         return DateUtil.getFormatDate2(date, 'yyyy-MM-dd hh:mm:ss')
//     }
// }
//
// export default {
//     barOption: barOption,
//     initVedioHeight: initVedioHeight,
//     initPlanHeight: initPlanHeight,
//     initPrizeHeight: initPrizeHeight,
//     initHeight: initHeight,
//     initPrivateListHeight: initPrivateListHeight,
//     initRongIM: initRongIM,
//     initContactList: initContactList,
//     sendMessage: sendMessage,
//     imgUpload: imgUpload,
//     getFileUrl: getFileUrl,
//     emoji: emoji,
//     messageItem: messageItem,
//     disconnectRongIM: disconnectRongIM,
//     handlerName: handlerName,
//     getGifConfig: getGifConfig,
//     clearUnreadCount,
//     removeConversation,
//     getHistoryMessages,
//     isAddMessageSplitTime,
//     SELF_MESSAGE_TYPE,
//     chatFormateDate,
//     roomIMDisconnect
// }
