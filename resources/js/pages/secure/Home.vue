<template>

  <b-card>

    <b-card-header>

      Welcome <b> {{ user.name }} </b>

    </b-card-header>



    <b-card-body>

      <b-button
        v-for="(teamRole, index) in relatedData.teamsRoles"
        :key="index"
        :to="{name: 'team.search', params: { tid: teamRole.team.id }}"
        block
        variant="primary">{{ teamRole.team.name }}
      </b-button>

    </b-card-body>

  </b-card>

</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      fields: ['team', 'role']
    };
  },
  computed: {
    ...mapGetters('UsersSingle', ['entry', 'relatedData', 'apiError',
      'loading']),
    ...mapGetters('Auth', ['user']),
  },
  created() {
    this.resetState();

    this.fetchShowData(this.user.id).then(() => {
      console.log(this.relatedData.teamsRoles);
      if (this.relatedData.teamsRoles.length === 1) {
        this.$router.push({ name: 'team.search',
          params: { tid: this.relatedData.teamsRoles[0].team.id } });
      }
    });

  },
  methods: {
    ...mapActions('UsersSingle', [
      'fetchShowData',
      'setListsTeams',
      'initialiseEntryTeamRoles',
      'resetState'
    ]),
  }
};

</script>
