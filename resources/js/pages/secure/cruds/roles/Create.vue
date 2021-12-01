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
          id="permissions-group"
          label="Permissions (multiple select)"
          label-for="permissions"
          :invalid-feedback="$formHelper.invalidFeedback(
            $v.relatedData.permissions, 'Permissions')"
          :state="validateState($v.relatedData.permissions, 'permissions')">

            <v-select
              name="permissions"
              label="name"
              placeholder="Choose permissions for this role..."
              :key="'permissions-field'"
              :options="lists.permissions"
              :closeOnSelect="true"
              multiple
              :class="fieldStyle($v.relatedData.permissions)"  
              :value="$v.relatedData.permissions.$model"
              @input="updateRelatedDataPermissions"
              @search:focus="focusField('permissions')"
              @search:blur="clearFocus"                 
            />

          <b-form-invalid-feedback
            :state="!(apiError.response.errorList['permissions'] !==
              undefined)">

            <div
              v-for="(msg, index) in apiError.response.errorList.permissions"
              :key="index">

              {{ msg }}

            </div>

          </b-form-invalid-feedback>

        </b-form-group>

        <b-button
          type="submit"
          variant="primary">

          Create Role

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
      status: '',
      activeField: ''
    }
  },  
  computed: {
    ...mapGetters('RolesSingle', ['entry', 'lists', 'relatedData', 
      'apiError', 'loading']),
  },
  validations: {
    entry: {
      name: {
        required,
        minLength: minLength(2)
      }
    },
    relatedData: {
      permissions: {
        required
      }
    }
  },
  created() {
    this.resetState();

    this.setListsPermissions();
  },
  methods: {
    ...mapActions('RolesSingle', [
      'storeData',
      'setEntryName',
      'resetState',
      'setListsPermissions',
      'setRelatedDataPermissions'
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
    updateRelatedDataPermissions(e) {
      this.$v.relatedData.permissions.$touch();
      this.setRelatedDataPermissions(e);
    },    
    onSubmit() {
      this.$v.$touch();

      if (this.$v.entry.$anyError || this.$v.relatedData.$anyError) {
        return;
      }

      this.storeData().then(() => {
        this.$router.go(-1);
      });
    },
    resetForm() {
      this.resetState();

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    focusField(name) {
      this.activeField = name
    },
    clearFocus() {
      this.activeField = ''
    },
    /* CBW - Note: this method required for dynmic class bindings for
                   styling of wysiwyg editor during client side validation */
    fieldStyle(validation) {
      if (this.activeField === 'permissions') {
        return {
          'vs__search': true,
          'is-valid': validation.$dirty && !validation.$error,
          'vs__search.is-invalid': validation.$error,
          'isInvalidFocus': validation.$error,
          'isValidFocus': validation.$dirty && !validation.$error,
          'inFocus': !validation.$dirty && !validation.$error
        };
      } else {
        return {
          'vs__search': true,
          'is-valid': validation.$dirty && !validation.$error,
          'is-invalid': validation.$error,
        };
      }
    }
  }
};

</script>
