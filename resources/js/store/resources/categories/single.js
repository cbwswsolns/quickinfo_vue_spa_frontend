function initialState() {
  return {
    entry: {
      id: null,
      name: '',
      team: null,
      created_at: '',
      updated_at: '',
    },
    relatedData: {
      infos: [],
      team: []
    },    
    lists: {
      teams: []
    },
    /*
    CBW - Note:
      the following are error messages from server-side validation:
      there may be additional validation checks, e.g. uniqueness,
      that are not performed client side
    */
    apiError: {
      message: '',
      response: {
        message: '',
        errorList: {}
      }
    },
    loading: false
  };
}

const getters = {
  entry: (state) => state.entry,
  relatedData: (state) => state.relatedData,  
  lists: (state) => state.lists,
  apiError: (state) => state.apiError,
  loading: (state) => state.loading
};

const actions = {
  storeData({ commit, state }) {
    const entryData = serialize(state.entry, { indices: true,
      booleansAsIntegers: true });

    const storePromise = axios.post('/api/category', entryData);

    commit('setLoading', true);

    storePromise.then(() => {}).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    }).finally(() => {
      commit('setLoading', false);
    });

    return storePromise;
  },
  updateData({ commit }, payload) {
    const entryData = serialize(payload.entryData, { indices: true,
      booleansAsIntegers: true });

    /* CBW Note:  entryData is a formData object and "...uses the same format
                  a form would use if the encoding type were set to
                  'multipart/form-data'."
                  [ref. https://developer.mozilla.org/en-US/docs/Web/API/FormData]
                  There exists a PHP bug that can't parse this format well
                  with HTTP PUT requests; however, using a POST request with
                  method spoofing will cause PHP to properly parse the
                  multipart/form-data */

    entryData.set('_method', 'PUT');

    const updatePromise = axios.post('/api/category/' + payload.id, entryData);

    commit('setLoading', true);

    updatePromise.then(() => {}).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    }).finally(() => {
      commit('setLoading', false);
    });

    return updatePromise;
  },
  setEntryName({ commit }, value) {
    commit('setEntryName', value);
  },
  setEntryTeam({ commit }, value) {
    commit('setEntryTeam', value);
  },
  setEntryCreatedAt({ commit }, value) {
    commit('setEntryCreatedAt', value);
  },
  setEntryUpdatedAt({ commit }, value) {
    commit('setEntryUpdatedAt', value);
  },
  setListsTeams({ commit }) {
    const teamsListPromise = axios.get('/api/team');

    teamsListPromise.then((response) => {
      commit('setListsTeams', response.data.data);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });

    return teamsListPromise;
  },
  fetchEditData({ commit }, id) {
    const editDataPromise = axios.get('/api/category/' + id);

    editDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setEntryTeam', response.data.data.team.id);
      commit('setEntryCreatedAt', response.data.data.created_at);
      commit('setEntryUpdatedAt', response.data.data.updated_at);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });

    return editDataPromise;
  },
  fetchShowData({ commit }, id) {
    const showDataPromise = axios.get('/api/category/' + id);

    showDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setRelatedDataInfos', response.data.data.infos);
      commit('setRelatedDataTeam', response.data.data.team);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    }).finally(() => {
      /* CBW - Note: Represents a delay following load completion
                     to prevent load icon glitching for very short lists */
      setTimeout(() => { this.loading = false; }, 1500);
    });
  },
  destroyItem({ commit, state, dispatch }, payload) {
    const deletePromise = axios.delete(payload.route);

    deletePromise.then((payload) => {
      dispatch('fetchShowData', state.entry.id);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });
  },
  resetState({ commit }, value) {
    commit('resetState', value);
  }
};

const mutations = {
  setEntryId(state, value) {
    state.entry.id = value;
  },
  setEntryName(state, value) {
    state.entry.name = value;
  },
  setEntryTeam(state, value) {
    state.entry.team = value;
  },
  setRelatedDataInfos(state, value) {
    state.relatedData.infos = value;
  },
  setRelatedDataTeam(state, value) {
    state.relatedData.team = value;
  },  
  setEntryCreatedAt(state, value) {
    state.entry.created_at = value;
  },
  setEntryUpdatedAt(state, value) {
    state.entry.updated_at = value;
  },
  setListsTeams(state, value) {
    state.lists.teams = value;
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
    Object.assign(state, initialState());
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
