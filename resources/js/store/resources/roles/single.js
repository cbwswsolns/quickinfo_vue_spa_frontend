function initialState() {
  return {
    entry: {
      id: null,
      name: '',
      created_at: '',
      updated_at: '',
    },
    relatedData: {
      permissions: []
    },
    lists: {
      permissions: []

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
    const payload = serialize( Object.assign(state.entry, state.relatedData), { indices: true, booleansAsIntegers: true });

    const storePromise = axios.post('/api/role', payload);

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
  updateData({ commit, state }) {
    const payload = serialize( Object.assign(state.entry,
      state.relatedData), { indices: true, booleansAsIntegers: true });

    /* CBW Note:  payload is a formData object and "...uses the same format
                  a form would use if the encoding type were set to
                  'multipart/form-data'."
                  [ref. https://developer.mozilla.org/en-US/docs/Web/API/FormData]
                  There exists a PHP bug that can't parse this format well
                  with HTTP PUT requests; however, using a POST request with
                  method spoofing will cause PHP to properly parse the
                  multipart/form-data */

    payload.set('_method', 'PUT');

    const updatePromise = axios.post('/api/role/' + state.entry.id, payload);

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
  setEntryCreatedAt({ commit }, value) {
    commit('setEntryCreatedAt', value);
  },
  setEntryUpdatedAt({ commit }, value) {
    commit('setEntryUpdatedAt', value);
  }, 
  setListsPermissions({ commit }) {
    const permissionListPromise = axios.get('/api/permission');

    permissionListPromise.then((response) => {
      commit('setListsPermissions', response.data);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });

    return permissionListPromise;
  },
  setRelatedDataPermissions({ commit }, value) {
    commit('setRelatedDataPermissions', value);
  },
  fetchEditData({ commit }, id) {
    const editDataPromise = axios.get('/api/role/' + id);

    editDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setRelatedDataPermissions', response.data.data.permissions);
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
    const showDataPromise = axios.get('/api/role/' + id);

    showDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setRelatedDataPermissions', response.data.data.permissions);      
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
  setEntryCreatedAt(state, value) {
    state.entry.created_at = value;
  },
  setEntryUpdatedAt(state, value) {
    state.entry.updated_at = value;
  },
  setListsPermissions(state, value) {
    state.lists.permissions = value;
  },
  setRelatedDataPermissions(state, value) {
    state.relatedData.permissions = value;
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
