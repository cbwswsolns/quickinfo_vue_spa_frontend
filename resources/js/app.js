/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue').default;

window.serialize = require('object-to-formdata').serialize;

Vue.use(require('vue-moment'));

import vSelect from 'vue-select'

import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

import router from './router';
import store from './store';
import interceptors from './helpers/interceptors';
import form from './helpers/form';
import App from './layouts/App.vue';

import { abilitiesPlugin } from '@casl/vue';
import ability from './services/ability';

Vue.use(abilitiesPlugin, ability);

const formHelperPlugin = {
  install() {
    Vue.formHelper = form;
    Vue.prototype.$formHelper = form;
  }
};

Vue.use(formHelperPlugin);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue ->
       <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0],
// files(key).default))

Vue.component('quill-editor', require('./components/QuillEditor.vue').default);
Vue.component('v-select', vSelect);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
  router,
  store,
  el: '#app',
  components: { App },
});
