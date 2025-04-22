import request from '@/utils/request';

/**
 *  注册融云帐号
 *
 * @description  注册融云帐号
 * @param {Object} playload
 * @return {Object} Promise
 *
 */
export async function registerRongYunAccount(playload) {
    return request({
        url: "/api/v2/chat/registerRongYunAccount",
        method: "POST",
        data: playload,
        unenc: true
    });
}

export async function getRongYunToken(playload) {
    return request({
        url: "/api/v2/rongyun/getToken",
        method: "POST",
        data: playload,
        userId: true
    });
}


