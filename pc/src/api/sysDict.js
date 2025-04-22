import request from "@/utils/request";

export async function querySystemConfig(playload = {}) {
    return request({
        url: "/api/v2/sysDict/querySystemConfig",
        method: "POST",
        data: playload
    });
}

export async function queryItemList(playload = {}) {
    return request({
        url: "/api/v2/sysDict/queryItemList",
        method: "POST",
        data: playload,
    });
}

