<template>
  <q-page padding>

    <div class="row justify-center q-gutter-xl">

      <div class="col-10 q-gutter-xl">
        <div id="" class="row justify-center">
          <div class="col-6">
            <search-form
              :loading="searching"
              @search="search" />
          </div>
        </div>

        <div class="row justify-center">
          <div class="col-10">
            <search-job-results
              v-if="searched && !searching"
              :loading="searching"
              @search="search" />
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { fromSearchJobs } from '@/store/modules/searchJobs';

import SearchJobResults from '@/components/pages/search/SearchJobResults';
import SearchForm from '@/components/pages/search/SearchForm';

export default {
  name: 'Search',

  components: { SearchForm, SearchJobResults },

  data: () => ({
    searched: false,
    searchInterval: null
  }),

  computed: {
    ...fromSearchJobs.mapState(['currentSid', 'searchJobResult', 'searching']),
    ...fromSearchJobs.mapGetters(['searchJobIsDone'])
  },

  methods: {
    ...fromSearchJobs.mapActions(['createSearchJob', 'loadSearchJobDetails', 'loadSearchJobResults', 'setSearching']),
    async search (searchForm) {
      if (searchForm) {
        await this.createSearchJob(searchForm);
      }

      if (this.currentSid) {
        this.setSearching(true);

        this.searchInterval = setInterval(async () => {
          await this.loadSearchJobDetails(this.currentSid);

          if (this.searchJobIsDone) {
            clearInterval(this.searchInterval);

            await this.loadSearchJobResults({
              sid: this.currentSid
            });

            this.searched = true;
            this.setSearching(false);
          }
        }, 1000);
      }
    }
  }
};
</script>
