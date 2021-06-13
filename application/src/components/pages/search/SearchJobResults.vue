<template>
  <div>
    <div class="row">
      <div class="col">
        <h4>{{ searchJobResultsTotalCount || 'No' }} results were found.</h4>
      </div>
    </div>

    <div class="row">
      <div class="col q-gutter-md">

        <div v-if="searchJobResultsTotalCount"
             class="row items-center"
             :class="{
                        'justify-between': amountOfPages > 1,
                        'justify-end': amountOfPages <= 1
                      }">

          <div class="col-6" v-if="amountOfPages > 1">
            <q-pagination
              v-model="paginationPage"
              :max="amountOfPages" :max-pages="6"
              direction-links dense />
          </div>

          <div class="col-4">
            <q-select
              v-model="paginationResultsPerPage"
              :options="rowsPerPageOptions"
              label="Results per page"
              dense />
          </div>

        </div>

        <div class="row"
             v-for="(result, resultIndex) in searchJobResult.results"
             :key="`result-${resultIndex}`">

          <div class="col">
            <q-card>
              <q-card-section>
                {{ result._raw }}
              </q-card-section>

              <q-card-section>
                {{ result.host }} {{ result.index }} {{ result.sourcetype }}
              </q-card-section>
            </q-card>
          </div>

        </div>

        <div class="row" v-if="loading">
          <div class="col">
            <q-inner-loading />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { fromSearchJobs } from '@/store/modules/searchJobs';

export default {
  name: 'SearchJobResults',

  props: {
    loading: { type: Boolean, default: false }
  },

  data: () => ({
    rowsPerPageOptions: [10, 25, 50, 100, 1000, 'All']
  }),

  computed: {
    ...fromSearchJobs.mapState(['searchJobResult', 'searchJobResultPagination']),
    ...fromSearchJobs.mapGetters(['searchJobResultsTotalCount']),
    searched () {
      return !!this.searchJobResult.results;
    },
    paginationPage: {
      get () {
        return this.searchJobResultPagination.page;
      },
      set (newSelectedPage) {
        this.updateJobSearchResultPagination({ key: 'page', value: newSelectedPage });

        this.search();
      }
    },
    paginationResultsPerPage: {
      get () {
        return this.searchJobResultPagination.rowsPerPage;
      },
      set (newSelectedRowsPerPage) {
        this.updateJobSearchResultPagination({
          rowsPerPage: newSelectedRowsPerPage,
          page: 1
        });
      }
    },
    amountOfPages () {
      const rowsPerPage = this.paginationResultsPerPage === 'All' ? this.searchJobResultsTotalCount : this.paginationResultsPerPage;
      const rest = this.searchJobResultsTotalCount % rowsPerPage;

      return Math.floor((this.searchJobResultsTotalCount / rowsPerPage) + (rest ? 1 : 0));
    }
  },

  methods: {
    ...fromSearchJobs.mapActions(['updateJobSearchResultPagination']),
    search () {
      this.$emit('search');
    }
  }
};
</script>
