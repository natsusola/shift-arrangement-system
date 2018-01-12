import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import router from './router';

// Vue.use(BootstrapVue);
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');
