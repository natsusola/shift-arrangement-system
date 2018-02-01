import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import router from './router';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import 'vue-toast/dist/vue-toast.min.css';

import './scss';

window.log = console.log.bind(this, `%c LOG `, 'background: #FF7818; color: white');
if (!__DEBUG__) console.log = () => {};

Vue.use(BootstrapVue);

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');
