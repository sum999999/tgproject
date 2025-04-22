import request from '@/utils/request'

/**
 * 查询下级报表
 * @param playload
 * @return {Promise<void>}
 */
export async function queryListTeamSubUsers(playload) {
  return request({
    url: '/api/v2/agent/listTeamSubusers',
    method: 'POST',
    data: playload,
    userId: true,
    unenc: true,
  })
}

export async function fetchAgentDesc(playload = { type: 7 }) {
  return request({
    url: '/api/v2/cms/agentDescription',
    method: 'POST',
    data: playload,
    unenc: true,
  })
}
