import Vue from 'vue';
import './plugins/bootstrap-vue';
import './plugins/linkify';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
