<template>

  <b-card border-variant="light">

    <b-card-header border-variant="light">

      <b-button size="sm"
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

        <b-button
          type="submit"
          variant="primary">

          Create Team

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
  created() {
    this.resetState();
  },
  methods: {
    ...mapActions('TeamsSingle', [
      'storeData',
      'setEntryName',
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
    onSubmit() {
      this.$v.entry.$touch();

      if (this.$v.entry.$anyError) {
        return;
      }

      this.storeData().then(() => {
        this.$router.push({ name: 'teams.index' });
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
