import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes.js'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.NODE_ENV === 'production' ? `/${process.env.VUE_APP_COMPANY}` : '/',
  routes
})
