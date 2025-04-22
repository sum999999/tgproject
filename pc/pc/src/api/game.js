import request from "@/utils/request";

export async function queryPlayForm(playload) {
  return request({
    url: "/party/v2/game/queryPlayForm",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

export async function queryGameListTypes(playload) {
  return request({
    url: "/party/v2/game/queryGameListTypes",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

export async function queryTypePlatforms(playload) {
  return request({
    url: "/party/v2/game/queryTypePlatforms",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

// 全部三方_搜索游戏
export async function queryGameSearch(playload) {
  return request({
    url: `/party/v2/game/queryGameSearch/single/${playload}`,
    method: "POST",
    stopDialog: true,
    unenc: true,
  });
}

export async function queryPlatformGames(playload) {
  return request({
    url: "/party/v2/game/queryPlatformGames",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

export async function queryAllPlatformGames(payload) {
  return request({
    url: "/party/v2/game/queryAllPlatformGames",
    method: "POST",
    data: payload,
    userId: false,
    unenc: true,
  });
}

export async function loginGame(playload) {
  return request({
    url: "/party/v2/game/loginGame",
    method: "POST",
    data: playload,
    userId: true,
    unenc: true,
  });
}

export async function queryQuickPlayGames(playload) {
  return request({
    url: "/party/v2/game/quickPlayGames",
    method: "POST",
    data: playload,
    userId: false,
    unenc: true,
  });
}

export async function queryFavoritesList(playload = {}) {
  return request({
    url: "api/v2/lotUserFavorites/favoritesList",
    method: "POST",
    data: playload,
    noEncrypt: false,
    userId: true,
  });
}

export async function saveFavoritesList(playload = {}) {
  return request({
    url: "api/v2/lotUserFavorites/save",
    method: "POST",
    data: playload,
    noEncrypt: false,
    userId: true,
  });
}

export async function deleteFavoritesList(playload = {}) {
  return request({
    url: "api/v2/lotUserFavorites/delete",
    method: "POST",
    data: playload,
    noEncrypt: false,
    userId: true,
  });
}
