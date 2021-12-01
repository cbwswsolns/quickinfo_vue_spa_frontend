import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

const View = { template: '<router-view></router-view>' };


const routes = [
  {
    path: '/register',
    name: 'register',
    component: () => import('./pages/Register.vue'),
    meta: {
      middleware: 'guest',
      title: 'Register'
    }
  },
  {
    path: '/',
    name: 'login',
    component: () => import('./pages/Login.vue'),
    meta: {
      middleware: 'guest',
      title: 'Login'
    },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./pages/secure/Home.vue'),
    meta: {
      middleware: 'auth',
      title: 'Home'
    }
  },
  {
    path: '/team-area',
    name: 'team_area',
    component: () => import('./layouts/TeamAreaLayout.vue'),
    redirect: { name: 'home' },
    children: [
      {
        path: '/team-area/teams/:tid',
        name: 'team.search',
        component: () => import('./pages/secure/Search.vue'),
        meta: {
          middleware: 'auth',
          title: 'Team Search',
          gate: 'team_access'
        }
      },
      {
        path: '/team-area/teams/:tid/team-management',
        name: 'team_management',
        component: View,
        redirect: { name: 'teams.index' },
        children: [
          {
            path: 'teams',
            name: 'teams.index',
            component: () => import('./pages/secure/cruds/teams/Index.vue'),
            meta: {
              middleware: 'auth',
              title: 'Team Index',
              gate: 'team_show'
            }
          },
          {
            path: 'teams/create',
            name: 'teams.create',
            component: () => import('./pages/secure/cruds/teams/Create.vue'),
            meta: {
              middleware: 'auth',
              title: 'Team Create',
              gate: 'team_create'
            }
          },
          {
            path: 'teams/:id/show',
            name: 'teams.show',
            component: () => import('./pages/secure/cruds/teams/Show.vue'),
            meta: {
              middleware: 'auth',
              title: 'Team Show',
              gate: 'team_show'
            }
          },
          {
            path: 'teams/:id/edit',
            name: 'teams.edit',
            component: () => import('./pages/secure/cruds/teams/Edit.vue'),
            meta: {
              middleware: 'auth',
              title: 'Team Edit',
              gate: 'team_edit'
            }
          },
          {
            path: 'users',
            name: 'users.index',
            component: () => import('./pages/secure/cruds/users/Index.vue'),
            meta: {
              middleware: 'auth',
              title: 'User Index',
              gate: 'user_show'
            }
          },
          {
            path: 'users/create/:teamId?',
            name: 'users.create',
            component: () => import('./pages/secure/cruds/users/Create.vue'),
            meta: {
              middleware: 'auth',
              title: 'User Create',
              gate: 'user_create'
            }
          },
          {
            path: 'users/:id/show',
            name: 'users.show',
            component: () => import('./pages/secure/cruds/users/Show.vue'),
            meta: {
              middleware: 'auth',
              title: 'User Show',
              gate: 'user_show'
            }
          },
          {
            path: 'users/:id/edit/:teamId?',
            name: 'users.edit',
            component: () => import('./pages/secure/cruds/users/Edit.vue'),
            meta: {
              middleware: 'auth',
              title: 'User Edit',
              gate: 'user_edit'
            }
          },
          {
            path: 'roles',
            name: 'roles.index',
            component: () => import('./pages/secure/cruds/roles/Index.vue'),
            meta: {
              middleware: 'auth',
              title: 'Role Index',
              gate: 'role_show'
            }
          },
          {
            path: 'roles/create',
            name: 'roles.create',
            component: () => import('./pages/secure/cruds/roles/Create.vue'),
            meta: {
              middleware: 'auth',
              title: 'Role Create',
              gate: 'role_create'
            }
          },
          {
            path: 'roles/:id/edit',
            name: 'roles.edit',
            component: () => import('./pages/secure/cruds/roles/Edit.vue'),
            meta: {
              middleware: 'auth',
              title: 'Role Edit',
              gate: 'role_edit'
            }
          },
        ]
      },
      {
        path: '/team-area/teams/:tid/info-management',
        name: 'info_management',
        redirect: { name: 'categories.index' },
        component: View,
        children: [
          {
            path: 'categories',
            name: 'categories.index',
            component: () =>
              import('./pages/secure/cruds/categories/Index.vue'),
            meta: {
              middleware: 'auth',
              title: 'Category Index',
              gate: 'category_show'
            }
          },
          {
            path: 'categories/create',
            name: 'categories.create',
            component: () =>
              import('./pages/secure/cruds/categories/Create.vue'),
            meta: {
              middleware: 'auth',
              title: 'Category Create',
              gate: 'category_create'
            }
          },
          {
            path: 'categories/:id/show',
            name: 'categories.show',
            component: () => import('./pages/secure/cruds/categories/Show.vue'),
            meta: {
              middleware: 'auth',
              title: 'Category Show',
              gate: 'category_show'
            }
          },
          {
            path: 'categories/:id/edit',
            name: 'categories.edit',
            component: () => import('./pages/secure/cruds/categories/Edit.vue'),
            meta: {
              middleware: 'auth',
              title: 'Category Edit',
              gate: 'category_edit'
            }
          },
          {
            path: 'infos/create/:categoryId?',
            name: 'infos.create',
            component: () => import('./pages/secure/cruds/infos/Create.vue'),
            meta: {
              middleware: 'auth',
              title: 'Info Create',
              gate: 'info_create'
            }
          },
          {
            path: 'infos/:id/edit',
            name: 'infos.edit',
            component: () => import('./pages/secure/cruds/infos/Edit.vue'),
            meta: {
              middleware: 'auth',
              title: 'Info Edit',
              gate: 'info_edit'
            }
          },
        ]
      },
    ]
  },
];

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes
});


router.beforeEach((to, from, next) => {
  if (to.meta.middleware === 'auth' && !store.getters['Auth/authenticated']) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
