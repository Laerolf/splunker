<template>
  <div class="row justify-between">
    <div class="col-6">
      <q-input
        dense
        :label="label"
        :disable="disabled"
        v-model="computedAmount" />
    </div>
    <div class="col-5">
      <q-select
        dense
        v-model="computedRelativeUnit"
        :options="unitOptions"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelativeDatepicker',

  props: {
    value: { type: String, default: null },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    dateFormat: { type: String, default: 'DD/MM/YYYY HH:mm' },
    parseFormat: { type: String, default: 'dd/MM/yyyy HH:mm' }
  },

  data: () => ({
    amount: 0,
    relativeUnit: {
      value: 'min',
      label: 'minutes ago'
    },
    unitOptions: [
      {
        value: 'sec',
        label: 'seconds ago'
      },
      {
        value: 'min',
        label: 'minutes ago'
      },
      {
        value: 'hr',
        label: 'hours ago'
      },
      {
        value: 'day',
        label: 'days ago'
      },
      {
        value: 'week',
        label: 'weeks ago'
      },
      {
        value: 'month',
        label: 'months ago'
      },
      {
        value: 'qtr',
        label: 'quarters ago'
      },
      {
        value: 'yr',
        label: 'years ago'
      }
    ]
  }),

  computed: {
    computedValue: {
      get () {
        return this.value ? this.value.match(/\d*/g).find(value => value.length) : null;
      },
      set (newValue) {
        this.$emit('input', newValue);
      }
    },
    computedAmount: {
      get () {
        return this.amount;
      },
      set (newAmount) {
        this.amount = newAmount;
        this.computedValue = `-${newAmount}${this.computedRelativeUnit.value}`;
      }
    },
    computedRelativeUnit: {
      get () {
        return this.unitOptions.find(({ value }) => value === this.relativeUnit.value);
      },
      set (newRelativeUnit) {
        this.relativeUnit = newRelativeUnit;
        this.computedValue = `-${this.computedAmount}${newRelativeUnit.value}`;
      }
    }
  }
};
</script>
