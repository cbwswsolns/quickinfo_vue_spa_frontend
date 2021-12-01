<template>

  <b-card>

    <b-card-header>

      <b-navbar toggleable="md" type="light" variant="light">

        <b-navbar-toggle target="navbar-toggle-collapse">
        </b-navbar-toggle>

        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-navbar-nav>

            <template v-for="(item, index) in teamManagementNavLinks">
              <b-nav-item-dropdown
                v-if="$can(item.gate)"
                :key="`team-${index}`"
                id="my-nav-dropdown"
                :text="item.name"
                toggle-class="nav-link-custom"
                right>

                <template v-for="(child, subindex) in item.children">
                  <b-dropdown-item
                    v-if="$can(child.gate)"
                    :key="`team-${subindex}`"
                    :active="$route.name==child.path.name"
                    :to="{ name: child.path.name }">

                      {{ child.name }}

                  </b-dropdown-item>
                </template>

              </b-nav-item-dropdown>
            </template>

          </b-navbar-nav>

        </b-collapse>

      </b-navbar>

    </b-card-header>

    <b-card-body>
      <!-- Child route gets rendered in <router-view> -->
      <router-view></router-view>

    </b-card-body>

  </b-card>

</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      teamManagementNavLinks: [
        {
          name: 'Team Management',
          path: { name: 'team_management' },
          gate: 'team_access',
          children: [
            {
              name: 'Teams',
              path: { name: 'teams.index' },
              gate: 'team_access',
            },
            {
              name: 'Users',
              path: { name: 'users.index' },
              gate: 'user_access',
            },
            {
              name: 'Roles',
              path: { name: 'roles.index' },
              gate: 'role_access',
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters('Auth', ['authenticated']),
    ...mapGetters('Abilities', ['abilities']),
  },
  watch: {
    $route: {
      immediate: true,

      handler() {
        $('#navbarCollapse').collapse('hide');

        if (this.authenticated) {
          this.refreshAbilities().finally(() => {
            const teamPermissions =
            this.abilities.find((item) =>
              item.teamId ===
              parseInt(this.$route.params.tid)).rolePermissions.map(
              (rolePerms) => rolePerms.permissions);

            let permissions = [];
            if (teamPermissions.length > 1) {
              teamPermissions.forEach((item) => {
                /* CBW Note: exploit lodash _.merge for merging role
                             permissions without duplicates */
                permissions = _.merge(permissions, item);
              });
            } else {
              permissions = teamPermissions[0];
            }

            const teamAllPermissions = permissions;

            this.$ability.update([
              { subject: 'all', action: teamAllPermissions }
            ]);
          });
        }
      }
    },
  },
  methods: {
    ...mapActions('Abilities', [
      'refreshAbilities',
    ]),
  }
};
</script>
