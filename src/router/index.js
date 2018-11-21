import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes.js'

Vue.use(Router)
const base = location.href.split('/')[3]

export default new Router({
	mode: 'history',
	base,
  routes
})
