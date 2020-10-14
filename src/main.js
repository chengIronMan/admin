import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//引入Element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import http from './utils/request'
import { gets,posts } from './utils/api'


Vue.use(ElementUI);

Vue.prototype.$http = http
Vue.prototype.$get = gets
Vue.prototype.$post = posts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
