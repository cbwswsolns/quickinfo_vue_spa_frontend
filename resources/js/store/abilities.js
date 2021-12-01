
function initialState() {
  return {
    abilities: []
  };
}

const getters = {
  abilities: (state) => state.abilities
};

const actions = {
  refreshAbilities({ commit }) {
    const refreshAbilitiesPromise = axios.get('/api/abilities');

    refreshAbilitiesPromise.then((response) => {
      const teamPermissions = response.data.map((teamUser) => {
        const rolePermissions = teamUser.roles.map((role) =>
          ({ roleId: role.id, permissions: role.permissions.map(
            (permission) => permission['name'])
          })
        );

        return { teamId: teamUser.team_id, rolePermissions };
      });

      commit('refreshAbilities', teamPermissions);

    }).catch(() => {
      commit('refreshAbilities', []);
      
    });

    return refreshAbilitiesPromise;
  }
};

const mutations = {
  refreshAbilities(state, value) {
    state.abilities = value;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
