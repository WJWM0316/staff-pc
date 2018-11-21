import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import auth from './modules/auth'
import jobcircle from './modules/jobcircle'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common,
    auth,
    jobcircle
  }
})

export default store