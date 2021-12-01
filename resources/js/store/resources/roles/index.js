
function initialState() {
  return {
    roles: [],
    apiError: {
      message: '',
      response: {
        message: '',
        errorList: {}
      }
    },    
    loading: false
  }
}

const getters = {
  roles: state => state.roles,
  apiError: state => state.apiError,
  loading: state => state.loading
}

const actions = {
  fetchIndexData({ commit }) {
    const indexPromise = axios.get('/api/role');

    commit('setLoading', true);

    indexPromise.then((response) => {
      commit('setRoles', response.data.data);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    }).finally(() => {
      commit('setLoading', false);
    });
  },
  destroyData({ commit, state }, payload) {
    const deletePromise = axios.delete('/api/role/' + payload.id);

    deletePromise.then(() => {
      commit('setRolesSpliced', payload.index);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });
  },
  resetState({ commit }) {
    commit('resetState')
  }
}

const mutations = {
  setRoles(state, value) {
    state.roles = value;
  },
  setRolesSpliced(state, index) {
    state.roles.splice(index, 1);
  },  
  setApiErrorMessage(state, value) {
    /* CBW - Note: all axios responses based on rejected promise will always
       have error.message as a minimum */
    console.log(value);
    state.apiError.message = value;
  },
  setApiErrorResponseMessage(state, value) {
    console.log(value);
    state.apiError.response.message = value;
  },
  setApiErrorResponseErrorList(state, value) {
    state.apiError.response.errorList = value;
  },
  setLoading(state, value) {
    state.loading = value;
  },
  resetState(state) {
    Object.assign(state, initialState())
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
}
