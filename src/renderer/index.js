import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import router from './router';
import _ from 'lodash';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

import './scss';

Vue.use(BootstrapVue);

new Vue({
  components: { App },
  router,
  _,
  template: '<App/>'
}).$mount('#app');
