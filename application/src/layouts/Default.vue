<template>
  <q-layout view="lHh lpr lFf">

    <main-header/>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-ajax-bar
      ref="loadingBar"
      position="bottom"
      color="secondary"
      size="1rem"
      skip-hijack />

  </q-layout>
</template>

<script>
import { mapActions } from 'vuex';

import MainHeader from '@/components/MainHeader';
import { fromSearchJobs } from '@/store/modules/searchJobs';

export default {
  name: 'Default',

  components: { MainHeader },

  computed: {
    ...fromSearchJobs.mapState(['searching'])
  },

  async created () {
    await this.loadSplunkInstanceInfo();
  },

  watch: {
    searching (searching) {
      if (searching) {
        this.$refs.loadingBar.start();
      } else {
        this.$refs.loadingBar.stop();
      }
    }
  },

  methods: {
    ...mapActions(['loadSplunkInstanceInfo'])
  }
};
</script>
