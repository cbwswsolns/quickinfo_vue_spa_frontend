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

                Info items

              </b-col>

              <b-col>

                <b-button
                  size="sm"
                  :to="{ name: 'infos.create' }"
                  variant="outline-secondary">

                  Create

                </b-button>

              </b-col>

            </b-row>

          </b-card-header>

          <b-card-body
            border-variant="light">

            <b-alert
              :show="!loading && relatedData.infos.length === 0"
              variant="warning">

              <i>There are currently no info items to view...</i>

            </b-alert>

            <b-alert
              v-for="(msg, index) in apiError.response.errorList"
              :key="index"
              :show="!(apiError.response.errorList !== undefined)"
              variant="info">

              {{ msg }}

            </b-alert>

            <b-table
              responsive
              :items="relatedData.infos"
              :fields="fieldsInfo">

              <!-- A virtual column -->
              <template
                #cell(index)="data">

                {{ data.index + 1 }}

              </template>

              <!-- A virtual column -->
              <template
                #cell(term)="data">

                {{ data.item.term }}

              </template>

              <!-- A virtual column -->
              <template
                #cell(definition)="data">

                <span
                  v-html="data.item.definition">
                </span>

              </template>

              <!-- A custom formatted column -->
              <template
                #cell(edit)="data">

                <b-button
                  :to="{name: 'infos.edit', params: { id: data.item.id }}"
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
                  @click="deleteInfoItem(data.item.id, data.index)">

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
      fieldsInfo: ['index', 'term', 'definition', 'edit', 'delete'],
    };
  },
  computed: {
    ...mapGetters('CategoriesSingle', ['entry', 'relatedData', 'apiError',
      'loading']),
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
    ...mapActions('CategoriesSingle', [
      'fetchShowData',
      'destroyItem'
    ]),
    deleteInfoItem(id, index) {
      this.destroyItem({ route: '/api/info/' + id, index })
    }    
  }
};

</script>
