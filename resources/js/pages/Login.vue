<template>

    <b-container>

    <br>

    <b-form @submit.stop.prevent="login" novalidate>

        <b-form-group id="email-group"
                      label="Email"
                      label-for="email"
                      :invalid-feedback="$formHelper.invalidFeedback(
                        $v.form.email, 'Email')">

          <b-form-input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email..."
            v-model="$v.form.email.$model"
            :state="validateState('email')"
          >
          </b-form-input>

      </b-form-group>

      <b-form-group id="password-group"
                    label="Password"
                    label-for="password"
                    :invalid-feedback="$formHelper.invalidFeedback(
                      $v.form.password, 'Password')">

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

      <b-button :disabled="processing"
                type="submit"
                variant="primary">

          {{ processing ? "Please wait" : "Login" }}

      </b-button>

    </b-form>

    <div class="col-12 text-center">

      <label>

        Don't have an account?

        <router-link class="my-page-link"
                     :to="{name:'register'}">

          Register Now!

        </router-link>

      </label>

    </div>

  </b-container>

</template>

<script>

import { required, minLength, email } from 'vuelidate/lib/validators';
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      processing: false
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(5)
      },
    }
  },
  methods: {
    ...mapActions({
      signIn: 'Auth/login'
    }),
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    async login() {
      this.processing = true;
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/api/login', this.form).then(() => {
        this.signIn();
      }).catch(({ response: { data } }) => {
        alert(data.message);
      }).finally(() => {
        this.processing = false;
      });
    },
  }
};

</script>
