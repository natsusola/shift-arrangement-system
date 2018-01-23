import Vue from 'vue';
import Router from 'vue-router';

import { view as HomePage } from '@/views/home';
import { view as Detail } from '@/views/detail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HomePage
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
