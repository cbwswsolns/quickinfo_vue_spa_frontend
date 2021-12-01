
function initialState() {
  return {
    categories: [],
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
  categories: state => state.categories,
  apiError: state => state.apiError,
  loading: state => state.loading
}

const actions = {
  fetchIndexData({ commit }) {
    const indexPromise = axios.get('/api/category');

    commit('setLoading', true);

    indexPromise.then((response) => {
      commit('setCategories', response.data.data);
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
    const deletePromise = axios.delete('/api/category/' + payload.id);

    deletePromise.then(() => {
      commit('setCategoriesSpliced', payload.index);
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
  setCategories(state, value) {
    state.categories = value;
  },
  setCategoriesSpliced(state, index) {
    state.categories.splice(index, 1);
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
