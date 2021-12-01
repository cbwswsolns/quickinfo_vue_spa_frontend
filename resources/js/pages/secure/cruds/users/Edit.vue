<template>

  <div>
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
      </b-card-body>

    </b-card>

    <b-card
      title="Update profile details"
      border-variant="light">

      <b-card-body>

        <b-form
          @submit.stop.prevent="onSubmitProfile"
          novalidate>

          <b-form-group
            id="name-group"
            label="Name"
            label-for="name"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.entry.profile.name, 'Name')">

            <b-form-input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name..."
              :value="$v.entry.profile.name.$model"
              :state="validateState($v.entry.profile.name, 'name')"
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

          <b-form-group
            id="email-group"
            label="Email"
            label-for="email"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.entry.profile.email, 'Email')">

            <b-form-input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email..."
              :value="$v.entry.profile.email.$model"
              :state="validateState($v.entry.profile.email, 'email')"
              @input="updateEntryEmail"
              autocomplete="username">
            </b-form-input>

            <b-form-invalid-feedback
              :state="!(apiError.response.errorList['email'] !== undefined)">

              <div
                v-for="(msg, index) in apiError.response.errorList.email"
                :key="index">

                {{ msg }}

              </div>

            </b-form-invalid-feedback>

          </b-form-group>

          <b-form-group
            id="teams-group"
            label="Select teams for new member to join..."
            label-for="teams-checkbox"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.selectedTeams, 'Teams')">

            <b-form-checkbox-group
              id="teams-checkbox"
              name="teams-checkbox"
              v-model="selectedTeams"
              :state="validateState($v.selectedTeams)">

              <b-form-checkbox
                v-for="team in lists.teams"
                :key="team.name"
                :value="team.id">

                {{ team.name }}

              </b-form-checkbox>

            </b-form-checkbox-group>

          </b-form-group>

          <b-form-group
            v-for="(v, index) in $v.relatedData.teamsRoles.$each.$iter"
            :key="index"
            :id="'role-group-'+index"
            :label="'Select Role for ' + v.$model.team.name"
            :label-for="'roleId'+index"
            :invalid-feedback="$formHelper.invalidFeedback(
              v.roles, 'Roles')"
            :state="validateState(v.roles, 'roles')">

              <v-select
                name="roles"
                label="name"
                placeholder="Choose roles for this user..."
                :key="'roles-field'"
                :options="lists.roles"
                :closeOnSelect="true"
                multiple
                :class="fieldStyle(v.roles)"
                :value="v.roles.$model"
                @input="updateRelatedDataSelectedTeamRoles($event, index)"
                @search:focus="focusField('roles')"
                @search:blur="clearFocus"
              />

            <b-form-invalid-feedback
              :state="!(apiError.response.errorList['roles'] !==
                undefined)">

              <div
                v-for="(msg, index) in apiError.response.errorList.roles"
                :key="index">

                {{ msg }}

              </div>

            </b-form-invalid-feedback>

          </b-form-group>

          <b-button
            type="submit"
            variant="primary">

            Update User Profile

          </b-button>

          <b-button
            class="ml-2"
            @click="resetForm()">

            Reset

          </b-button>

        </b-form>

      </b-card-body>

    </b-card>

    <b-card
      title="Change password details"
      border-variant="light">

      <b-card-body>

        <b-form
          @submit.stop.prevent="onSubmitPassword"
          novalidate>

          <input
            hidden
            id="username"
            name="name"
            type="text"
            autocomplete="username"
            value=""/>

          <b-form-group
            id="current-password-group"
            label="Current password"
            label-for="current_password"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.entry.passwordData.current_password,
                'Current password')">

            <b-form-input
              id="current_password"
              name="current_password"
              type="password"
              placeholder="Enter password..."
              :value="$v.entry.passwordData.current_password.$model"
              :state="validateState('passform', 'current_password')"
              @input="updateEntryCurrentPassword"
              autocomplete="new-password">
            </b-form-input>

            <b-form-invalid-feedback
              :state="!(apiError.response.errorList['current_password'] !==
                undefined)">

              <div
                v-for="(msg, index) in
                  apiError.response.errorList.current_password"
                :key="index">

                {{ msg }}

              </div>

            </b-form-invalid-feedback>

          </b-form-group>

          <b-form-group
            id="password-group"
            label="Password"
            label-for="password"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.entry.passwordData.password, 'Password')">

            <b-form-input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password..."
              :value="$v.entry.passwordData.password.$model"
              :state="validateState('passform', 'password')"
              @input="updateEntryPassword"
              autocomplete="new-password">
            </b-form-input>

            <b-form-invalid-feedback
              :state="!(apiError.response.errorList['password'] !== undefined)">

              <div
                v-for="(msg, index) in apiError.response.errorList.password"
                :key="index">

                {{ msg }}

              </div>

            </b-form-invalid-feedback>

          </b-form-group>

          <b-form-group
            id="password-confirmation-group"
            label="Password Confirmation"
            label-for="password_confirmation"
            :invalid-feedback="$formHelper.invalidFeedback(
              $v.entry.passwordData.password_confirmation,
                'Password confirmation')">

            <b-form-input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Confirm password..."
              :value="$v.entry.passwordData.password_confirmation.$model"
              :state="validateState('passform', 'password_confirmation')"
              @input="updateEntryPasswordConfirmation"
              autocomplete="new-password">
            </b-form-input>

          </b-form-group>

          <b-button
            type="submit"
            variant="primary">

            Update User Password

          </b-button>

        </b-form>

      </b-card-body>

    </b-card>

  </div>

</template>

<script>

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      roleOptions: [],
      selectedTeams: [],
      initialised: false
    };
  },
  computed: {
    ...mapGetters('UsersSingle', ['entry', 'relatedData', 'lists', 'apiError', 'loading']),
    /* CBW Note: in boostrap-vue package, we have to use v-model for multiple
                 checkboxes that bind to single data state array variables
                 given the particular bootstrap-vue component structure in
                 our template.
                 As we are using VueX, we need to declare a computed property
                 to avoid attempts to directly mutate the state of selected
                 teams */
  },
  validations: {
    entry: {
      profile: {
        name: {
          required,
          minLength: minLength(2)
        },
        email: {
          required,
          email
        },
      },
      passwordData: {
        current_password: {
          required,
          minLength: minLength(5)
        },
        password: {
          required,
          minLength: minLength(5)
        },
        password_confirmation: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    },
    relatedData: {
      teamsRoles: {
        $each: {
          roles: {
            required
          },
          $trackBy: 'validationTrackId'
        }
      }
    },
    selectedTeams: {
      required,
    },
  },
  beforeDestroy() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.initialiseProfileForm();
      }
    },
    selectedTeams(newValue, oldValue) {

      if (!this.initialised) {
        this.initialised = true;
        return;
      }

      this.refreshRelatedDataTeamsRoles({ newSelectedTeams: newValue,
        oldSelectedTeams: oldValue });

      /* CBW Note: the following logic handles dynamic teamRole field
                   validation reset according to requirements */
      const prop = this.$v.relatedData.teamsRoles;

      for (const index in prop.$each.$iter) {
        if (prop.$each.$iter[index].$model.resetRoleValidation) {
          this.$nextTick(() => {
            prop.$each.$iter[index].roles.$reset();
          });
        }
      }
    }
  },
  methods: {
    ...mapActions('UsersSingle', [
      'setEntryName',
      'setEntryEmail',
      'setEntryCurrentPassword',
      'setEntryPassword',
      'setEntryPasswordConfirmation',
      'setRelatedDataSelectedTeamRoles',
      'refreshRelatedDataTeamsRoles',
      'setListsRoles',
      'setListsTeams',
      'fetchEditData',
      'updateData',
      'resetState'
    ]),
    validateState(item, name = '') {
      const { $dirty, $error } = item;

      return $dirty ? !($error ||
        (this.apiError.response.errorList[name] !== undefined)) : null;
    },
    initialiseProfileForm() {
      this.fetchEditData(this.$route.params.id).then(() => {
        /* CBW Note: there is always a non-zero number of roles associated
                     with a user */
        this.selectedTeams = this.relatedData.teamsRoles.map((teamRoles) =>
          teamRoles.team.id);

      }).finally(() => {
        this.$v.$touch();
      });
    },
    updateEntryName(e) {
      this.$v.entry.profile.name.$touch();
      this.setEntryName(e);
    },
    updateEntryEmail(e) {
      this.$v.entry.profile.email.$touch();
      this.setEntryEmail(e);
    },
    updateEntryCurrentPassword(e) {
      this.$v.entry.passwordData.current_password.$touch();
      this.setEntryCurrentPassword(e);
    },
    updateEntryPassword(e) {
      this.$v.entry.passwordData.password.$touch();
      this.setEntryPassword(e);
    },
    updateEntryPasswordConfirmation(e) {
      this.$v.entry.passwordData.password_confirmation.$touch();
      this.setEntryPasswordConfirmation(e);
    },
    updateRelatedDataSelectedTeamRoles(e, index) {
      this.$v.relatedData.teamsRoles.$each.$iter[index].roles.$touch();
      this.setRelatedDataSelectedTeamRoles({ index, roles: e });
    },
    onSubmitProfile() {
      this.$v.entry.profile.$touch();

      if (this.$v.entry.profile.$anyError) {
        return;
      }

      this.updateData({ id: this.$route.params.id,
        updateData: Object.assign(this.entry.profile,
          { teamsRoles: this.relatedData.teamsRoles }) }).then(() => {
        this.$router.go(-1);
      });
    },
    onSubmitPassword() {
      this.$v.entry.passwordData.current_password.$touch();

      if (this.$v.entry.passwordData.$anyError) {
        return;
      }

      this.updateData({ id: this.$route.params.id,
        entryData: this.entry.passwordData }).then(() => {

        this.$router.go(-1);
      });
    },
    resetForm() {
      this.initialiseProfileForm();
    },
    focusField(name) {
      this.activeField = name;
    },
    clearFocus() {
      this.activeField = '';
    },
    /* CBW - Note: this method required for dynmic class bindings for
                   styling of v-select during client side validation */
    fieldStyle(validation) {
      if (this.activeField === 'roles') {
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
