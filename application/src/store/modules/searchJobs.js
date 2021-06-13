import { createNamespacedHelpers } from 'vuex';
import Vue from 'vue';

import { defaultAxiosClient } from '@/plugins/axios';
import { isNil } from '@/lib/utils';

export const fromSearchJobs = createNamespacedHelpers('searchJobStore');

const state = {
  currentSid: null,
  searchJobDetails: {},
  searchJobResult: {},
  searching: false,
  searchJobResultPagination: {
    page: 1,
    rowsPerPage: 10
  }
};

const mutations = {
  setCurrentSid (state, newCurrentSid) {
    Vue.set(state, 'currentSid', newCurrentSid);
  },
  setSearchJobDetails (state, newSearchJobDetails) {
    Vue.set(state, 'searchJobDetails', newSearchJobDetails);
  },
  setSearchJobResult (state, newSearchJobResult) {
    Vue.set(state, 'searchJobResult', newSearchJobResult);
  },
  setSearchJobResultPagination (state, newPagination) {
    if (newPagination.key) {
      Vue.set(state.searchJobResultPagination, newPagination.key, newPagination.value);
    } else {
      Vue.set(state, 'searchJobResultPagination', newPagination);
    }
  },
  setSearching (state, newSearchingState) {
    Vue.set(state, 'searching', newSearchingState);
  }
};

const actions = {
  async createSearchJob ({ commit }, form) {
    try {
      const searchJobForm = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (!isNil(value)) {
          searchJobForm.append(key, value);
        }
      });

      const { data } = await defaultAxiosClient.post(
        '/search',
        searchJobForm
      );

      if (data) {
        commit('setCurrentSid', data.sid);
        commit('setSearchJobDetails', {});
        commit('setSearchJobResult', {});

        return data.sid;
      }
    } catch (exception) {
      console.error('Failed to create a search job', exception);
    }

    return null;
  },
  async loadSearchJobDetails ({ commit }, sid) {
    try {
      const form = new FormData();
      form.append('sid', sid);

      const { data } = await defaultAxiosClient.post(
        '/search/details',
        form
      );

      if (data && data.details.sid) {
        commit('setSearchJobDetails', data.details);
        return data;
      }
    } catch (exception) {
      console.error('Failed to load search job details', exception);
    }

    return null;
  },
  async loadSearchJobResults ({ commit, state: { searchJobResultPagination } }, form) {
    try {
      form = {
        ...form,
        count: searchJobResultPagination.rowsPerPage,
        page: searchJobResultPagination.page
      };

      const searchJobForm = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        searchJobForm.append(key, value);
      });

      const { data } = await defaultAxiosClient.post(
        '/search/results',
        searchJobForm
      );

      if (data) {
        commit('setSearchJobResult', data);

        return data;
      }
    } catch (exception) {
      console.error('Failed to load search job results', exception);
    }

    return null;
  },
  updateJobSearchResultPagination ({ commit }, newPagination) {
    commit('setSearchJobResultPagination', newPagination);
  },
  setSearching ({ commit }, newSearchingState) {
    commit('setSearching', newSearchingState);
  }
};

const getters = {
  hasSearchJobDetails: ({ searchJobDetails }) => !!searchJobDetails.sid,
  searchJobResultsTotalCount: ({ searchJobDetails }, { hasSearchJobDetails }) => hasSearchJobDetails ? searchJobDetails.resultCount || 0 : 0,
  searchJobStatus: ({ searchJobDetails }, { hasSearchJobDetails }) => hasSearchJobDetails ? searchJobDetails.dispatchState : null,
  searchJobIsDone: ({ searchJobDetails }, { hasSearchJobDetails }) => hasSearchJobDetails ? searchJobDetails.isDone : false
};

export default { namespaced: true, state, mutations, actions, getters };
