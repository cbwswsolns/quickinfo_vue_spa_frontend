<template>

  <b-card
    border-variant="light">

    <b-card-header
      border-variant="light">

      <b-button
        size="sm"
        @click="$router.go(-1)">

        Back

      </b-button>

    </b-card-header>

    <b-card-body
      border-variant="light">

      <b-alert
        v-for="(msg, index) in apiError.response.errorList"
        :key="index"
        :show="!(apiError.response.errorList !== undefined)"
        variant="info">

        {{ msg }}

      </b-alert>

      <b-card>
        <b-card-header>

          <b-row>

            <b-col>

              <h3> {{ entry.profile.name  }} </h3>

            </b-col>

            <b-col class="text-right">

              <b-button
                size="sm"
                @click="$router.push({ name: 'users.edit',
                  params: { id: entry.id } })">

                Edit

              </b-button>

            </b-col>

          </b-row>

          <small v-if="entry.created_at !== ''">

            Account created on {{ entry.created_at |
            moment("dddd, MMMM Do YYYY") }}

          </small>

        </b-card-header>

        <b-card-body>

          <b-list-group flush>

            <b-list-group-item>

              <b>Email: </b> {{ entry.profile.email }}

            </b-list-group-item>

            <b-list-group-item>

              <b-table
                hover
                :items="relatedData.teamsRoles"
                :fields="fields">

                <!-- A virtual column -->
                <template
                  #cell(team)="data">

                  <b-link :to="{name: 'teams.show',
                    params: { id: data.item.team.id }}"> 

                    {{ data.item.team.name }}

                  </b-link>

                </template>

                <!-- A virtual column -->
                <template
                  #cell(roles)="data">

                  <b-list-group
                    v-for="(role, index) in data.item.roles"
                    :key="index">

                    <b-list-group-item>

                      {{ role.name }}

                    </b-list-group-item>

                  </b-list-group>

                </template>

              </b-table>

            </b-list-group-item>

          </b-list-group>

        </b-card-body>

      </b-card>


    </b-card-body>

  </b-card>

</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      fields: ['team', 'roles']
    };
  },
  computed: {
    ...mapGetters('UsersSingle', ['entry',  'relatedData', 'lists', 'apiError',
      'loading']),
  },
  created() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.initialiseProfileData();
      }
    }
  },
  methods: {
    ...mapActions('UsersSingle', [
      'fetchShowData',
      'setListsTeams',
      'initialiseEntryTeamRoles',
      'setEntryTeamRoles',
      'resetState'
    ]),
    initialiseProfileData() {
      this.fetchShowData(this.$route.params.id);
    }
  }
};

</script>
