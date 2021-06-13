import Vue from 'vue';
import axios from 'axios';

const apiHTTPUrl = process.env.VUE_APP_SERVICE_URL || 'http://localhost:4000/api/';

export const defaultAxiosClient = axios.create({
  baseURL: apiHTTPUrl
});

defaultAxiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
  });

Vue.prototype.$axios = defaultAxiosClient;
