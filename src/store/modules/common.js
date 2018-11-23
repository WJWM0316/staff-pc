import {
  SHOW_DIALOG,
  HIDE_DIALOG
} from '../mutation-types'

import {
  uploadAttachesApi
} from 'API/common'

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
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   取消关注的工作圈置顶
   */
  uploadAttachesApi (store, params) {
    return uploadAttachesApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
