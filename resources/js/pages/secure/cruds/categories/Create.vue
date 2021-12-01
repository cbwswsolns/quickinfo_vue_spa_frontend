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

    <b-card-body>

      <b-form
        @submit.stop.prevent="onSubmit"
        novalidate>

        <b-form-group
          id="name-group"
          label="Name"
          label-for="name"
          :invalid-feedback="$formHelper.invalidFeedback(
            $v.entry.name, 'Name')">

          <b-form-input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name..."
            :value="$v.entry.name.$model"
            :state="validateState($v.entry.name, 'name')"
            @input="updateEntryName">
          </b-form-input>

          <b-form-invalid-feedback
            :state="!(apiError.response.errorList['name'] !== undefined)">

            <div
              v-for="(msg, index) in apiError.response.errorList.name"
              :key="index">

              {{ msg }}

            </div>

          </b-form-invalid-feedback>

        </b-form-group>

        <br>

        <b-form-group
          id="team-group"
          label="Select Team"
          label-for="team"
          :invalid-feedback="$formHelper.invalidFeedback(
            $v.entry.team, 'Team')">

          <b-form-select
            id="team"
            name="team"
            :value="$v.entry.team.$model"
            :options="teamOptions"
            :state="validateState($v.entry.team, 'team')"
            @input="updateEntryTeam">
          </b-form-select>

        </b-form-group>

        <br>

        <b-button
          type="submit"
          variant="primary">

          Create Category

        </b-button>

        <b-button
          class="ml-2"
          @click="resetForm()">

          Reset

        </b-button>

      </b-form>

    </b-card-body>

  </b-card>

</template>

<script>

import { required, minLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      teamOptions: [],
    };
  },
  computed: {
    ...mapGetters('CategoriesSingle',
      ['entry', 'lists', 'apiError', 'loading']),
  },
  created() {
    this.resetState();

    this.setListsTeams().then(() => {
      this.teamOptions = this.$formHelper.generateFormSelectOptionsList(
        this.lists.teams, 'Select a team for this category...');
    });
  },
  validations: {
    entry: {
      name: {
        required,
        minLength: minLength(2)
      },
      team: {
        required
      }
    }
  },
  beforeDestroy() {
    this.resetState();
  },
  methods: {
    ...mapActions('CategoriesSingle', [
      'storeData',
      'setEntryName',
      'setEntryTeam',
      'setListsTeams',
      'resetState'
    ]),
    validateState(item, name = '') {
      const { $dirty, $error } = item;

      return $dirty ? !($error ||
        (this.apiError.response.errorList[name] !== undefined)) : null;
    },
    updateEntryName(e) {
      this.$v.entry.name.$touch();
      this.setEntryName(e);
    },
    updateEntryTeam(e) {
      this.$v.entry.team.$touch();
      this.setEntryTeam(e);
    },
    onSubmit() {
      this.$v.entry.$touch();

      if (this.$v.entry.$anyError) {
        return;
      }

      this.storeData().then(() => {
        this.$router.push({ name: 'categories.index' });
      });
    },
    resetForm() {
      this.resetState();

      this.$nextTick(() => {
        this.$v.$reset();
      });
    }
  }
};

</script>
