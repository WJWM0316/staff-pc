import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './eleui/index.js'
Vue.config.productionTip = false

import './filters'

new Vue({
	store,
	router,
  render: h => h(App)
}).$mount('#x-plus')
