import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSlideMini from 'vue-slide-mini'
Vue.use(VueSlideMini);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
