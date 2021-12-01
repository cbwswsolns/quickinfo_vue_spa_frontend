<template>

  <b-overlay
    :show="loading">

    <b-card
      border-variant="light"
      :aria-hidden="loading ? 'true' : null">

      <b-card-header
        border-variant="light">

        <b-button
          size="sm"
          :to="{ name: 'teams.create' }">

          Create New Team

        </b-button>

      </b-card-header>

      <b-card-body>

        <b-alert
          :show="!loading && teams.length === 0"
          variant="warning">

          <i>There are currently no teams to view...</i>

        </b-alert>

        <b-alert
          v-for="(msg, index) in apiError.response.errorList"
          :key="index"
          :show="!(apiError.response.errorList !== undefined)"
          variant="info">

          {{ msg }}

        </b-alert>

        <b-table
          hover
          :items="teams"
          :fields="fields">

          <!-- A virtual column -->
          <template
            #cell(index)="data">

            {{ data.index + 1 }}

          </template>

          <!-- A virtual column -->
          <template
            #cell(name)="data">

            {{ data.item.name }}

          </template>

          <!-- A custom formatted column -->
          <template
            #cell(show)="data">

            <b-button
              :to="{name: 'teams.show', params: { id: data.item.id }}"
              type="submit"
              variant="outline-secondary">

              Manage

            </b-button>

          </template>

          <!-- A custom formatted column -->
          <template
            #cell(edit)="data">

            <b-button
              :to="{name: 'teams.edit', params: { id: data.item.id }}"
              type="submit"
              variant="outline-secondary">

              Edit

            </b-button>

          </template>

          <!-- A custom formatted column -->
          <template
            #cell(delete)="data">

            <b-button
              type="submit"
              variant="outline-danger"
              @click="deleteItem(data.item.id, data.index)">

              Delete

            </b-button>

          </template>

        </b-table>

      </b-card-body>

    </b-card>

    <template #overlay>

      <div class="text-center">

        <b-icon icon="arrow-clockwise"
                animation="spin"
                font-scale="4">
        </b-icon>

        <p>Please wait. Items loading...</p>

      </div>

    </template>

  </b-overlay>

</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      fields: ['index', 'name', 'show', 'edit', 'delete'],
    };
  },
  computed: {
    ...mapGetters('TeamsIndex', ['teams', 'apiError', 'loading'])
  },
  created() {
    this.fetchIndexData();
  },
  beforeDestroy() {
    this.resetState();
  },  
  methods: {
    ...mapActions('TeamsIndex', [
      'fetchIndexData',
      'destroyData',
      'resetState']
    ),
    deleteItem(id, index) {
      this.destroyData({ id, index })
    }
  }
};

</script>
