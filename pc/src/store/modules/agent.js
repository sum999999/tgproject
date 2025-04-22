import { queryListTeamSubUsers, fetchAgentDesc } from '@/api/agent'
import util from '@/utils/utils'
import { SAVE_AGENT_DESC } from '../mutation_types'

export default {
  state: {
    agentDesc: '',
  },
  getters: {
    agentDesc: (state) => state.agentDesc,
  },
  mutations: {
    [SAVE_AGENT_DESC](state, playload) {
      state.agentDesc = playload
    },
  },
  actions: {
    async queryListTeamSubUsers({ commit }, playload) {
      return await queryListTeamSubUsers(playload)
    },
    async fetchAgentDesc({ commit }) {
      const res = await fetchAgentDesc()
      commit(SAVE_AGENT_DESC, util.escapeHtml(res.data.data.map((item) => item.content).join('\n')))
    },
  },
}
