<template>

  <b-overlay
    :show="loading">

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
        :title="entry.name"
        border-variant="light">

        <b-card
          border-variant="light">

          <b-card-header
            border-variant="light"
            header-class="createButton">

            <b-row>

              <b-col
                class="h4 text-left">

                Team Members

              </b-col>

              <b-col>

                <b-button
                  size="sm"
                  :to="{ name: 'users.create', params: { teamId: entry.id } }"
                  variant="outline-secondary">

                  Create

                </b-button>

              </b-col>

            </b-row>

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

            <b-table
              responsive
              :items="relatedData.users"
              :fields="fieldsUser">

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
                #cell(profile)="data">

                <b-button
                  :to="{name: 'users.show', params: { id: data.item.id }}"
                  type="submit"
                  variant="outline-secondary">

                  Show

                </b-button>

              </template>

              <!-- A custom formatted column -->
              <template
                #cell(edit)="data">

                <b-button
                  :to="{name: 'users.edit', params: { id: data.item.id,
                    teamId: entry.id }}"
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
                  @click="deleteUserItem(data.item.id, data.index)">

                  Delete

                </b-button>

              </template>

            </b-table>

          </b-card-body>

        </b-card>

      </b-card-body>

    </b-card>

    <template
      #overlay>

      <div
        class="text-center">

        <b-icon
          icon="arrow-clockwise"
          animation="spin"
          font-scale="4">
        </b-icon>

        <p>

          Please wait. Items loading...

        </p>

      </div>

    </template>

  </b-overlay>

</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      fieldsUser: ['index', 'name', 'profile', 'edit', 'delete'],
    };
  },
  computed: {
    ...mapGetters('TeamsSingle', ['entry', 'relatedData', 'apiError',
      'loading']),
  },
  created() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.fetchShowData(this.$route.params.id);
      }
    }
  },
  methods: {
    ...mapActions('TeamsSingle', [
      'fetchShowData',
      'destroyItem',
      'resetState'
    ]),
    deleteUserItem(id, index) {
      this.destroyItem({ route: '/api/user/' + id, index });
    },
    deleteRoleItem(id, index) {
      this.destroyItem({ route: '/api/role/' + id, index });
    }     
  }
};

</script>
