import Vue from 'vue';
import Vuex from 'vuex';

import searchJobStore from '@/store/modules/searchJobs';
import { defaultAxiosClient } from '@/plugins/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    searchJobStore
  },

  state: {
    splunkInstanceInfo: {}
  },

  mutations: {
    setSplunkInstanceInfo (state, newInfo) {
      Vue.set(state, 'splunkInstanceInfo', newInfo);
    }
  },

  actions: {
    async loadSplunkInstanceInfo ({ commit }) {
      try {
        const { data } = await defaultAxiosClient.get('/info');

        if (data.entry) {
          const { content } = data.entry[0];
          commit('setSplunkInstanceInfo', content);

          return content;
        }
      } catch (exception) {
        console.error('Failed to load spunk instance info', exception);
      }

      return null;
    }
  }
});
