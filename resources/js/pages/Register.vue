<template>

    <b-container>

    <br>

    <b-form @submit.stop.prevent="register" novalidate>

        <b-form-group id="name-group"
                      label="Name"
                      label-for="name"
                      :invalid-feedback="$formHelper.invalidFeedback(
                        $v.form['name'], 'Name')">

            <b-form-input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name..."
              v-model="$v.form.name.$model"
              :state="validateState('name')"
              autocomplete="off"
            >
            </b-form-input>

        </b-form-group>

        <b-form-group id="email-group"
                      label="Email"
                      label-for="email"
                      :invalid-feedback="$formHelper.invalidFeedback(
                        $v.form['email'], 'Email')">

            <b-form-input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email..."
              v-model="$v.form.email.$model"
              :state="validateState('email')"
              autocomplete="off"
            >
            </b-form-input>

        </b-form-group>

        <b-form-group id="password-group"
                      label="Password"
                      label-for="password"
                      :invalid-feedback="$formHelper.invalidFeedback(
                        $v.form['password'], 'Password')"> 

            <b-form-input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password..."
              v-model="$v.form.password.$model"
              :state="validateState('password')"
              autocomplete="off"
            >
            </b-form-input>

        </b-form-group>

        <b-form-group id="password-confirmation-group"
                      label="Password Confirmation"
                      label-for="password_confirmation"
                      :invalid-feedback="$formHelper.invalidFeedback(
                        $v.form['password_confirmation'],
                        'Password confirmation')">

            <b-form-input
              id="passwordConfirmation"
              name="password_confirmation"
              type="password"
              placeholder="Confirm password..."
              v-model="$v.form.password_confirmation.$model"
              :state="validateState('password_confirmation')"
              autocomplete="off"
            >
            </b-form-input>

        </b-form-group>

        <b-button :disabled="processing" type="submit" variant="primary">

            {{ processing ? "Please wait" : "Register" }}

        </b-button>

    </b-form>

    <div class="col-12 text-center">

        <label>

          Already have an account?

          <router-link  class="my-page-link"
                        :to="{name:'login'}">

            Login Now!

          </router-link>

        </label>

    </div>

  </b-container>

</template>

<script>

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  name: 'register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      processing: false
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(2)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(5)
      },
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password')
      },
    }
  },
  methods: {
    ...mapActions({ signIn: 'Auth/login' }),

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];

      return $dirty ? !$error : null;
      
    },
    async register() {
      this.processing = true;

      await axios.get('/sanctum/csrf-cookie');

      await axios.post('/api/register', this.form).then(() => {
        this.signIn();

      }).catch(({ response: { data } }) => {
        alert(data.message);

      }).finally(() => {
        this.processing = false;

      });
    }
  }
};

</script>
