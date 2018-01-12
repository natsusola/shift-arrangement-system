import Vue from 'vue';
import Router from 'vue-router';

import { view as HomePage } from '@/views/home';
import { view as Detail } from '@/views/detail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: HomePage
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
