<template>

  <b-card border-variant="light">

    <b-card-header border-variant="light">

      <b-button
        size="sm"
        @click="$router.go(-1)">

        Back

      </b-button>

    </b-card-header>

    <b-card-body>

      <b-form
        @submit.stop.prevent="onSubmit">

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

        <b-button
          type="submit"
          variant="primary">

          Update Team

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
  computed: {
    ...mapGetters('TeamsSingle', ['entry', 'apiError', 'loading']),
  },
  validations: {
    entry: {
      name: {
        required,
        minLength: minLength(2)
      }
    }
  },
  beforeDestroy() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.initialiseTeamForm();
      }
    }
  },
  methods: {
    ...mapActions('TeamsSingle', [
      'setEntryName',
      'fetchEditData',
      'updateData',
      'resetState'
    ]),
    validateState(item, name = '') {
      const { $dirty, $error } = item;

      return $dirty ? !($error ||
        (this.apiError.response.errorList[name] !== undefined)) : null;
    },
    initialiseTeamForm() {
      this.fetchEditData(this.$route.params.id).finally(() => {
        this.$v.entry.$touch();
      });
    },
    updateEntryName(e) {
      this.$v.entry.name.$touch();
      this.setEntryName(e);
    },
    onSubmit() {
      this.$v.entry.$touch();

      if (this.$v.entry.$anyError) {
        return;
      }

      this.updateData({ id: this.$route.params.id,
        entryData: this.entry }).then(() => {
        this.$router.push({ name: 'teams.index' });
      });
    },
    resetForm() {
      this.initialiseTeamForm();
    }
  }
};

</script>
