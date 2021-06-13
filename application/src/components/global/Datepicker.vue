<template>
  <q-input :label="label"
           :disable="disabled"
           dense
           v-model="computedValue">
    <template v-slot:prepend>

      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">

          <q-date
            v-model="computedValue"
            today-btn minimal
            :disable="disabled"
            :mask="dateFormat">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>

        </q-popup-proxy>
      </q-icon>

    </template>
    <template v-slot:append>

      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">

          <q-time
            v-model="computedValue"
            :disable="disabled"
            :mask="dateFormat"
            format24h now-btn>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>

        </q-popup-proxy>
      </q-icon>

    </template>
  </q-input>
</template>

<script>
import { parse, format } from 'date-fns';

export default {
  name: 'Datepicker',

  props: {
    value: { type: Date, default: null },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    dateFormat: { type: String, default: 'DD/MM/YYYY HH:mm' },
    parseFormat: { type: String, default: 'dd/MM/yyyy HH:mm' }
  },

  computed: {
    computedValue: {
      get () {
        return this.value ? format(this.value, this.parseFormat) : this.value;
      },
      set (newValue) {
        this.$emit('input', parse(newValue, this.parseFormat, new Date()));
      }
    }
  }
};
</script>

<style scoped>

</style>
