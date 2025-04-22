import {
    SET_CODE_503_DATA
} from '../mutation_types'

export default {
    state: {
        code503Data: {}
    },
    getters: {
        code503Data: state => state.code503Data
    },
    mutations: {
        [SET_CODE_503_DATA](state, data) {
            localStorage.setItem("CODE_503", JSON.stringify(data || null));
            state.code503Data = data
        },
    },
    actions: {
    }
}
