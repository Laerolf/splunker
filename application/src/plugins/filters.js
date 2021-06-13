import Vue from 'vue';
import { format, parseISO } from 'date-fns';

Vue.filter('dateify', (dateString, dateFormat = 'dd/MM/yyyy HH:mm:ss') => {
  if (!dateString) return dateString;

  return format(parseISO(dateString), dateFormat, new Date());
});
