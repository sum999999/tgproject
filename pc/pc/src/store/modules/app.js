import { getLanguageConfig } from '@/api/app'
import { getLanguage, getLocalLanguage } from '@/lang'

import { SAVE_APP_LANGUAGE_CONFIG, SAVE_APP_LANGUAGE, SET_APP_LONGQUEUE } from '../mutation_types'

export default {
  state: {
    appLanguageConfig: [],
    appLanguage: getLocalLanguage(),
    showLongqueue: false,
  },
  getters: {
    appLanguageConfig: (state) => state.appLanguageConfig,
    appLanguage: (state) => {
      if (state.appLanguage) {
        return state.appLanguage
      }
      const code = getLanguage()
      return (
        state.appLanguageConfig.find((language) => {
          return language.code === code
        }) || {}
      )
    },
  },
  mutations: {
    [SAVE_APP_LANGUAGE_CONFIG](state, playload = []) {
      state.appLanguageConfig = playload
    },
    [SAVE_APP_LANGUAGE](state, code) {
      const language = state.appLanguageConfig.find((language) => {
        return language.code === code
      })
      if (language) {
        localStorage.setItem('language', JSON.stringify(language))
      } else {
        localStorage.clear('language')
      }
      state.appLanguage = language
    },
    [SET_APP_LONGQUEUE](state, playload = []) {
      state.showLongqueue = playload
    },
  },
  actions: {
    async queryLanguageConfig({ state, commit, getters, dispatch }, playload) {
      const res = await getLanguageConfig()
      if (res.data.code !== 0) {
        return
      }
      commit(SAVE_APP_LANGUAGE_CONFIG, res.data.data || [])
      return res.data.data
    },
  },
}
