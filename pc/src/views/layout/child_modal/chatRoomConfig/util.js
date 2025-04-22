// //发送文本消息
// /**
//  *
//  * @param {*} targetType 发送类型
//  * @param {*} targetId 目标id
//  * @param {*} msg 消息
//  * @param {*} callback 回调函数
//  */
// const sendMessage = function (targetType, targetId, msg, callback) {
//     // var targetId = conversation.id; // 目标 Id
//     RongIMClient.getInstance().sendMessage(targetType, targetId, msg, {
//         // 发送消息成功
//         onSuccess: function (message) {
//             //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
//             callback && callback(message);
//         },
//         onError: function (errorCode, message) {
//             var info = '';
//             switch (errorCode) {
//                 case RongIMLib.ErrorCode.TIMEOUT:
//                     info = '超时';
//                     break;
//                 case RongIMLib.ErrorCode.UNKNOWN_ERROR:
//                     info = '未知错误';
//                     break;
//                 case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
//                     info = '在黑名单中，无法向对方发送消息';
//                     break;
//                 case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
//                     info = '不在讨论组中';
//                     break;
//                 case RongIMLib.ErrorCode.NOT_IN_GROUP:
//                     info = '不在群组中';
//                     break;
//                 case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
//                     info = '不在聊天室中';
//                     break;
//                 default:
//                     info = x;
//                     break;
//             }
//             console.log('发送失败:' + info);
//         }
//     });
// };
// /**
//  *
//  * @param {*} targetType 发送类型
//  * @param {*} targetId 目标id
//  * @param {*} callback 回调函数
//  * @param {*} data 上传图片返回的消息
//  * @param {*} extra 额外的用户信息
//  */
// const sendImageMessage = function (targetType, targetId, data, extra, callback) {
//     var fileType = RongIMLib.FileType.IMAGE;
//     RongIMClient.getInstance().getFileUrl(fileType, data.filename, null, {
//         onSuccess: function (result) {
//             data.downloadUrl = result.downloadUrl;
//             var msg = new RongIMLib.ImageMessage({
//                 content: data.thumbnail,
//                 imageUri: data.downloadUrl
//             });
//             msg.user = extra;
//             sendMessage(targetType, targetId, msg, callback);
//         },
//         onError: function (error) {
//             console.log(error);
//         }
//     });
// }
// //拉取最近消息
// // const getHisMessage = function (conversationId, timestrap, count, callbacks) {
// //     var conversationType = RongIMLib.ConversationType.CHATROOM; //私聊,其他会话选择相应的消息类型即可。
// //     var targetId = conversationId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
// //     // timestrap默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
// //     // count每次获取的历史消息条数，范围 0-20 条，可以多次获取。
// //     RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
// //         onSuccess: function (list, hasMsg) {
// //             conversation.messageContent = list.concat(conversation.messageContent);
// //             callbacks(list, hasMsg);
// //         },
// //         onError: function (error) {
// //             console.log("GetHistoryMessages,errorcode:" + error);
// //         }
// //     });
// // }
// export default {
//     sendMessage,
//     sendImageMessage
// }
