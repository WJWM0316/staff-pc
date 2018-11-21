import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes.js'
import Cookies from 'js-cookie'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.NODE_ENV === 'development' ? process.env.VUE_APP__TEST_COMPANY : Cookies.get('code'),
  routes
})
