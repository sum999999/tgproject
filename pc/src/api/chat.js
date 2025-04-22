import request from "@/utils/request";

export async function checkChatRoomPassword(playload) {
    return request({
        url: "/api/v2/chat/checkChatRoomPassword",
        method: "POST",
        data: playload
    });
}

export async function queryChatRooms(playload = {}) {
    return request({
        url: "/api/v2/chat/queryChatRooms",
        method: "POST",
        data: {
            ...playload,
            userId: playload.userId || ""
        },
        unenc: true
    });
}

export async function queryCheckChatRoomPwd(playload) {
    return request({
        url: "/api/v2/chat/queryCheckChatRoomPwd",
        method: "POST",
        data: playload,
        userId: true,
        unenc: true
    });
}

/**
 * 充值、盈利、佣金排行榜
 * @param playload
 * @return {Promise<void>}
 */
export async function getUserChatRank(playload = {}) {
    return request({
        url: 'api/v2/user/userChatRank',
        method: 'POST',
        data: playload,
        unenc: true,
        userId: false
    });
}

export async function queryUserInfo(playload = {}) {
    return request({
        url: 'api/v2/user/queryUserInfo',
        method: 'POST',
        data: playload,
        unenc: true,
        userId: true
    });
}
