<template>
  <q-form @submit="search" class="q-gutter-md">

    <div class="row">
      <div class="col">
        <q-input
          v-model="searchString"
          rounded outlined
          :loading="loading">
          <template v-slot:append v-if="!loading">
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row items-center q-col-gutter-x-md">
      <div class="col-3">
        <q-toggle
          v-model="needSpecificTimeWindow"
          toggle-indeterminate toggle-order="ft"
          keep-color color="secondary"
          :label="timeWindowOptionLabel" />
      </div>

      <div v-if="!isNil(needSpecificTimeWindow)" :class="hasSpecificTimeWindow ? 'col' : 'col-5'">
        <datepicker
          v-if="hasSpecificTimeWindow"
          v-model="earliestTime"
          label="From" />
        <relative-datepicker
          v-else
          v-model="relativeTimeWindow" />
      </div>

      <div class="col" v-if="!isNil(needSpecificTimeWindow)">
        <datepicker
          v-model="latestTime"
          label="To" />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-btn
          label="Search"
          type="submit"
          color="secondary"
          :disable="loading" />
      </div>
    </div>
  </q-form>
</template>

<script>
import { formatISO } from 'date-fns';
import { isNil } from '@/lib/utils';

import Datepicker from '@/components/global/Datepicker';
import RelativeDatepicker from '@/components/global/RelativeDatepicker';

export default {
  name: 'SearchForm',

  components: { RelativeDatepicker, Datepicker },

  props: {
    loading: { type: Boolean, default: false }
  },

  data: () => ({
    searchString: null,
    earliestTime: null,
    latestTime: null,
    needSpecificTimeWindow: null,
    relativeTimeWindow: null
  }),

  computed: {
    hasSpecificTimeWindow () {
      return isNil(this.needSpecificTimeWindow) || this.needSpecificTimeWindow;
    },
    timeWindowOptionLabel () {
      if (!isNil(this.needSpecificTimeWindow)) {
        if (this.needSpecificTimeWindow) {
          return 'Between dates';
        } else {
          return 'Relatively to now';
        }
      }

      return 'Now';
    }
  },

  methods: {
    isNil,
    search () {
      if (this.needSpecificTimeWindow) {
        this.$emit('search', {
          search: this.searchString,
          earliest_time: this.earliestTime ? formatISO(this.earliestTime) : null,
          latest_time: this.latestTime ? formatISO(this.latestTime) : null
        });
      } else if (isNil(this.needSpecificTimeWindow)) {
        this.$emit('search', {
          search: this.searchString
        });
      } else {
        this.$emit('search', {
          search: this.searchString,
          earliest_time: this.relativeTimeWindow
        });
      }
    }
  }
};
</script>
