import axios from 'axios';
import store from '../store';

/*
 * Add a response interceptor
 */
axios.interceptors.response.use((response) => response,
  (error) => {
    if (error.response) {
      if ([401, 419].includes(error.response.status)) {
        store.dispatch('Auth/handleUnauthenticated');
      } else if ([403].includes(error.response.status)) {
        console.log('you are not allowed access here! :)');
      }
    }

    return Promise.reject(error);
  }
);
