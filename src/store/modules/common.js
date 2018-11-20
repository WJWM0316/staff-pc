import {
  SHOW_DIALOG,
  HIDE_DIALOG
} from '../mutation-types'

const state = {
  dialog: {
    show: true,
    width: '800px',
    content: '1111',
    title: '提示'
  }
}

const mutations = {
  [SHOW_DIALOG](state, option) {
    state.dialog = {
      show: true,
      ...option
    }
  },
  [HIDE_DIALOG](state, option) {
    state.dialog = {
      show: false,
      ...option
    }
  }
}

const getters = {
  dialog: state => state.dialog
}

const actions = {
  showDialog(store, options) {
    store.commit(SHOW_DIALOG, options)
  },
  hideDialog(store, options) {
    store.commit(HIDE_DIALOG, options)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
