<template>

  <b-container fluid="md">

    <b-row>

      <b-col md="12">

        <b-card title="Card Title" no-body border-variant="light">

          <b-card-header header-tag="nav" v-if="user && authenticated">

            <b-navbar toggleable="md" type="light" variant="light">
              <b-navbar-brand :to="{ name: 'home' }">Quick Info</b-navbar-brand>

              <b-navbar-toggle target="navbar-toggle-collapse">
              </b-navbar-toggle>

              <b-collapse id="navbar-toggle-collapse" is-nav>
                <b-navbar-nav>

                  <!-- <b-nav-item>'s with child routes. Note the trailing slash on the first <b-nav-item> -->
                  <b-nav-item  :active="$route.name=='home'"
                               :to="{ name: 'home' }">
                    Home
                  </b-nav-item>

                  <b-nav-item @click="logout">Logout</b-nav-item>

                </b-navbar-nav>
              </b-collapse>
            </b-navbar>

          </b-card-header>

          <b-card-header header-tag="nav" v-else  align="left">

            <b-nav card-header>

              <b-nav-item :to="{ name: 'login' }"><b>QUICK INFO</b></b-nav-item>

            </b-nav>

          </b-card-header>

          <b-card-body>
            <!-- Child route gets rendered in <router-view> or <nuxt-child> -->
            <router-view></router-view>

          </b-card-body>

        </b-card>

      </b-col>

    </b-row>

  </b-container>

</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      //localModes: this.modes,
    };
  },
  computed: {
    ...mapGetters('Auth', ['authenticated', 'user']),
  },
  methods: {
    async logout() {
      this.$store.dispatch('Auth/logout');
    }
  }
};
</script>
