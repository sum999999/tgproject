import { queryPlayForm, queryQuickPlayGames, queryAllPlatformGames, queryFavoritesList, saveFavoritesList, deleteFavoritesList } from "@/api/game";
import { SET_COLLECT_GAMES, DEL_COLLECT_GAME, ADD_COLLECT_GAME } from '../mutation_types'
import { uuid } from "@/utils/utils.js"

export default {
  state: {
    collectGames: []
  },
  getters: {
    collectGames: state => state.collectGames,
  },
  mutations: {
    [SET_COLLECT_GAMES](state, playload) {
      state.collectGames = playload
    },
    [DEL_COLLECT_GAME](state, userFavoritesId) {
      const index = state.collectGames.findIndex((game) => game.userFavoritesId == userFavoritesId)
      if (index != -1) {
        state.collectGames.splice(index, 1)
      }
    },
    [ADD_COLLECT_GAME](state, game) {
      state.collectGames.unshift(game)
    },
  },
  actions: {
    async queryPlayForm({ state, commit, dispatch }, payload) {
      const res = await queryPlayForm(payload);
      if (res.data.code !== 0) return;
      return res.data.data;
    },
    async queryQuickPlayGames({ state, commit, dispatch }, payload) {
      const { code } = payload;
      const res = await queryQuickPlayGames({ code });
      if (res.data.code !== 0) return;
      return res.data.data;
    },
    async queryAllPlatformGames({ state, commit, dispatch }, payload) {
      const res = await queryAllPlatformGames(payload);
      if (res.data.code !== 0) return;
      return res.data.data;
    },
    async queryFavoritesList({ commit, state }, playload) {
      const res = await queryFavoritesList(playload)
      if (res.data.code !== 0) return
      commit('SET_COLLECT_GAMES', res.data.data.reverse())
    },
    async saveFavoritesList({ commit }, playload) {
      const res = await saveFavoritesList(playload)
      if (res.data.code !== 0) return
      playload.userFavoritesId = `location:${uuid()}`
      commit('ADD_COLLECT_GAME', playload)
      
    },
    async deleteFavoritesList({ commit }, playload) { 
      const { userFavoritesId } = playload
      if (!`${userFavoritesId}`.includes("location:")) {
        const res = await deleteFavoritesList(playload)
        if (res.data.code !== 0) return
      }
      commit('DEL_COLLECT_GAME', userFavoritesId)
    },
  }
}
