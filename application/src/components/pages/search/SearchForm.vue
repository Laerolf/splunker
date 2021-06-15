<template>
  <q-form @submit="search" class="q-gutter-md">

    <div class="row">
      <div class="col">
        <q-input
          v-model="searchString"
          :error-message="searchStringErrors[0]"
          :error="!!searchStringErrors[0]"
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
          :error-message="earliestTimeErrors[0]"
          :error="!!earliestTimeErrors[0]"
          label="From" />
        <relative-datepicker
          v-else
          v-model="relativeTimeWindow"
          :error-message="relativeTimeWindowErrors[0]"
          :error="!!relativeTimeWindowErrors[0]"/>
      </div>

      <div v-if="hasSpecificTimeWindow && !isNil(needSpecificTimeWindow)" class="col">
        <datepicker
          v-model="latestTime"
          :error-message="latestTimeErrors[0]"
          :error="!!latestTimeErrors[0]"
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
import { required, requiredIf } from 'vuelidate/lib/validators';

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

  validations () {
    return {
      searchString: { required },
      earliestTime: {
        required: requiredIf(() => !isNil(this.needSpecificTimeWindow) && this.hasSpecificTimeWindow)
      },
      latestTime: {
        required: requiredIf(() => !isNil(this.needSpecificTimeWindow) && this.hasSpecificTimeWindow)
      },
      relativeTimeWindow: {
        required: requiredIf(() => !isNil(this.needSpecificTimeWindow) && !this.hasSpecificTimeWindow)
      }
    };
  },

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

      return 'All-time';
    },
    searchStringErrors () {
      const errors = [];
      if (!this.$v.searchString.$dirty) return errors;
      !this.$v.searchString.required && errors.push('This field is required.');
      return errors;
    },
    earliestTimeErrors () {
      const errors = [];
      if (!this.$v.earliestTime.$dirty) return errors;
      !this.$v.earliestTime.required && errors.push('This field is required.');
      return errors;
    },
    latestTimeErrors () {
      const errors = [];
      if (!this.$v.latestTime.$dirty) return errors;
      !this.$v.latestTime.required && errors.push('This field is required.');
      return errors;
    },
    relativeTimeWindowErrors () {
      const errors = [];
      if (!this.$v.relativeTimeWindow.$dirty) return errors;
      !this.$v.relativeTimeWindow.required && errors.push('This field is required.');
      return errors;
    }
  },

  watch: {
    needSpecificTimeWindow () {
      this.$v.$reset();
    }
  },

  methods: {
    isNil,
    search () {
      this.$v.$touch();

      if (!this.$v.$invalid) {
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
            earliest_time: this.relativeTimeWindow,
            latest_time: 'now'
          });
        }
      }
    }
  }
};
</script>
