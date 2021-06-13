import Vue from 'vue';
import VueRouter from 'vue-router';

import DefaultLayout from '@/layouts/Default';

import SearchPage from '@/pages/Search';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: '',
        redirect: 'search'
      },
      {
        path: 'search',
        name: 'Search',
        component: SearchPage
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
