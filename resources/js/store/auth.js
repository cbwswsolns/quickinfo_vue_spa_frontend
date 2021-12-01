import router from '../router';

function initialState() {
  return {
    authenticated: false,
    user:  {},
    teams: {},
  };
}

const getters = {
  authenticated(state) {
    return state.authenticated;
  },
  user(state) {
    return state.user;
  },
  teams(state) {
    return state.teams;
  },
};

const mutations = {
  setAuthenticated(state, value) {
    state.authenticated = value;
  },
  setUser(state, value) {
    state.user = value;
  },
  setTeams(state, value) {
    state.teams = value;
  }
};

const actions = {
  login({ commit }) {
    return axios.get('/api/auth').then(({ data }) => {
      commit('setUser', data[0]);
      commit('setTeams', data[1]);
      commit('setAuthenticated', true);
      router.push({ name: 'home' });
    }).catch(() => {
      commit('setUser', {});
      commit('setTeams', {});
      commit('setAuthenticated', false);
    });
  },
  logout({ dispatch }) {
    return axios.post('/api/logout').then(() => {
      dispatch('handleUnauthenticated');
    });
  },
  handleUnauthenticated({ commit }) {
    commit('setUser', {});
    commit('setTeams', {});
    commit('setAuthenticated', false);

    if (router.currentRoute.name !== 'login') {
      router.push({ name: 'login' });
    }
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
