import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Auth from './auth';
import Abilities from './abilities';
import CategoriesIndex from './resources/categories';
import CategoriesSingle from './resources/categories/single';
import InfosSingle from './resources/infos/single';
import RolesIndex from './resources/roles';
import RolesSingle from './resources/roles/single';
import TeamsIndex from './resources/teams';
import TeamsSingle from './resources/teams/single';
import UsersIndex from './resources/users/index';
import UsersSingle from './resources/users/single';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedState()
  ],
  modules: {
    Abilities,
    Auth,
    CategoriesIndex,
    CategoriesSingle,
    InfosSingle,
    RolesIndex,    
    RolesSingle,
    TeamsIndex,
    TeamsSingle,
    UsersIndex,
    UsersSingle
  }
});
