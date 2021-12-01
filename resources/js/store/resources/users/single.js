
function setTeamRoles(team, roles, roleValidationState) {
  let teamRoles = {};

  teamRoles.team = team;
  teamRoles.roles = roles;

  teamRoles.validationTrackId = team.id;
  teamRoles.resetRoleValidation = roleValidationState;

  return teamRoles;
}

function initialState() {
  return {
    entry: {
      id: null,
      profile: {
        name: '',
        email: '',
      },
      passwordData: {
        current_password: '',
        password: null,
        password_confirmation: null
      },
      email_verified_at: '',
      remember_token: '',
      two_factor_secret: null,
      two_factor_recovery_codes: null,
      created_at: '',
      updated_at: '',
    },
    relatedData: {
      rolesUT: [],
      teams: [],
      teamsRoles: [],
    },
    lists: {
      roles: [],
      teams: [],
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
    const entryData = serialize(Object.assign(state.entry.profile,
      state.entry.passwordData), { indices: true, booleansAsIntegers: true });

    const storePromise = axios.post('/api/user', entryData);

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
  updateData({ commit, state }, payload) {
    const updateData = serialize(payload.updateData, { indices: true,
      booleansAsIntegers: true });

    /* CBW Note:  updateData is a formData object and "...uses the same format
                  a form would use if the encoding type were set to
                  'multipart/form-data'."
                  [ref. https://developer.mozilla.org/en-US/docs/Web/API/FormData]
                  There exists a PHP bug that can't parse this format well
                  with HTTP PUT requests; however, using a POST request with
                  method spoofing will cause PHP to properly parse the
                  multipart/form-data */

    updateData.set('_method', 'PUT');

    const updatePromise = axios.post('/api/user/' + payload.id, updateData);

    commit('setLoading', true);

    console.log(payload.updateData);

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
  setEntryEmail({ commit }, value) {
    commit('setEntryEmail', value);
  },
  setEntryEmailVerifiedAt({ commit }, value) {
    commit('setEntryEmailVerifiedAt', value);
  },
  setEntryCurrentPassword({ commit }, value) {
    commit('setEntryCurrentPassword', value);
  },
  setEntryPassword({ commit }, value) {
    commit('setEntryPassword', value);
  },
  setEntryPasswordConfirmation({ commit }, value) {
    commit('setEntryPasswordConfirmation', value);
  },
  setEntryRememberToken({ commit }, value) {
    commit('setEntryRememberToken', value);
  },
  setEntryCreatedAt({ commit }, value) {
    commit('setEntryCreatedAt', value);
  },
  setEntryUpdatedAt({ commit }, value) {
    commit('setEntryUpdatedAt', value);
  },
  refreshRelatedDataTeamsRoles({ commit, state }, payload) {
    const relatedDataTeamsRoles = [];

    state.lists.teams.forEach((team) => {
      const teamCurrentlySelected = payload.newSelectedTeams.includes(team.id);
      const teamPrevioulySelected = payload.oldSelectedTeams.includes(team.id);

      const oldRelatedDataTeamRoles = state.relatedData.teamsRoles.find(
        (teamRoles) => team.id === teamRoles.team.id);

      if (teamCurrentlySelected) {
        const roles = (oldRelatedDataTeamRoles !== undefined) ?
          oldRelatedDataTeamRoles.roles : [];

        relatedDataTeamsRoles.push(
          setTeamRoles({ id: team.id, name: team.name }, roles,
            teamCurrentlySelected && !teamPrevioulySelected)
        );
      }
    });

    commit('setRelatedDataTeamsRoles', relatedDataTeamsRoles);
  },
  setRelatedDataTeamsRoles({ commit }, value) {
    commit('setRelatedDataTeamsRoles', value);
  },
  setRelatedDataSelectedTeamRoles({ commit }, value) {
    commit('setRelatedDataSelectedTeamRoles', value);
  },
  fetchCreateData({ commit }) {

    const createDataPromise = axios.get('/api/user/create');

    createDataPromise.then((response) => {
      commit('setListsRoles', response.data.meta.roles);
      commit('setListsTeams', response.data.meta.teams);
    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });
  },
  fetchEditData({ commit }, id) {
    const editDataPromise = axios.get('/api/user/' + id);

    editDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setEntryEmail', response.data.data.email);
      commit('setEntryCreatedAt', response.data.data.created_at);
      commit('setEntryUpdatedAt', response.data.data.updated_at);

      commit('setListsRoles', response.data.meta.roles);
      commit('setListsTeams', response.data.meta.teams);

      const teamsRolesHydrated =
        response.data.data.teams_users.map((teamUser) =>
          setTeamRoles(teamUser.team, teamUser.roles, false));

      commit('setRelatedDataTeamsRoles', teamsRolesHydrated);

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
    const showDataPromise = axios.get('/api/user/' + id);

    showDataPromise.then((response) => {
      commit('setEntryId', response.data.data.id);
      commit('setEntryName', response.data.data.name);
      commit('setEntryEmail', response.data.data.email);
      commit('setEntryCreatedAt', response.data.data.created_at);
      commit('setEntryUpdatedAt', response.data.data.updated_at);

      commit('setListsRoles', response.data.meta.roles);
      commit('setListsTeams', response.data.meta.teams);

      const teamsRolesHydrated =
        response.data.data.teams_users.map((teamUser) =>
          setTeamRoles(teamUser.team, teamUser.roles, false));

      commit('setRelatedDataTeamsRoles', teamsRolesHydrated);

    }).catch((error) => {
      commit('setApiErrorMessage', error.message);

      if (error.response !== undefined) {
        commit('setApiErrorResponseMessage', error.response.data.message);
        commit('setApiErrorResponseErrorList', error.response.data.errors);
      }
    });

    return showDataPromise;
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
    state.entry.profile.name = value;
  },
  setEntryEmail(state, value) {
    state.entry.profile.email = value;
  },
  setEntryEmailVerifiedAt(state, value) {
    state.entry.email_verified_at = value;
  },
  setEntryCurrentPassword(state, value) {
    state.entry.passwordData.current_password = value;
  },
  setEntryPassword(state, value) {
    state.entry.passwordData.password = value;
  },
  setEntryPasswordConfirmation(state, value) {
    state.entry.passwordData.password_confirmation = value;
  },
  setEntryRememberToken(state, value) {
    state.entry.remember_token = value;
  },
  setEntryCreatedAt(state, value) {
    state.entry.created_at = value;
  },
  setEntryUpdatedAt(state, value) {
    state.entry.updated_at = value;
  },
  setRelatedDataRolesUT(state, value) {
    state.relatedData.rolesUT = value;
  },
  setRelatedDataTeams(state, value) {
    state.relatedData.teams = value;
  },
  setRelatedDataTeamsRoles(state, value) {
    state.relatedData.teamsRoles = value;
  },
  setRelatedDataSelectedTeamRoles(state, value) {
    state.relatedData.teamsRoles[value.index].roles = value.roles;
  },
  setListsRoles(state, value) {
    state.lists.roles = value;
  },
  setListsTeams(state, value) {
    state.lists.teams = value;
  },
  setLoading(state, value) {
    state.loading = value;
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
