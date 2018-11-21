import {
  GET_ATTENTIONS_JOB_CIRCLE,
  GET_ALL_VISIBLE_JOB_CIRCLE,
  UPDATE_JOB_CIRCLE_CHECKED_STATUS,
  UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS
} from '../mutation-types'

import {
  getAttentionsJobcircleApi,
  focusJobCircleApi,
  nofocusJobCircleApi,
  getAllVisibleJobcircleApi
} from 'API/jobcircle'

const state = {
  attentionsJobcircle: {
    active: true,
    name: '我关注的工作圈',
    list: []
  },
  allVisibleJobcircle: {
    active: false,
    name: '所有工作圈',
    list: []
  }
}

const mutations = {
  [GET_ATTENTIONS_JOB_CIRCLE] (state, list) {
    list.map((field, index) => field.active = index === 0 ? true : false)
    state.attentionsJobcircle.list = list
  },
  [GET_ALL_VISIBLE_JOB_CIRCLE] (state, list) {
    list.map((field, index) => field.active = false)
    state.allVisibleJobcircle.list = list
  },
  [UPDATE_JOB_CIRCLE_CHECKED_STATUS] (state, options) {
    state[options.show].active = !state[options.show].active
    // state[options.hide].active = false
  },
  [UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS] (state, options) {
    state[options.show].list.map((field, index) => field.active = index === options.index ? true: false)
    state[options.hide].list.map((field, index) => field.active = false)
  }
}

const getters = {
  attentionsJobcircle: state => state.attentionsJobcircle,
  allVisibleJobcircle: state => state.allVisibleJobcircle
}

const actions = {

  // 获取关注的工作圈列表
  getAttentionsJobcircleApi (store, params) {
    return getAttentionsJobcircleApi(params)
      .then(res => {
        store.commit(GET_ATTENTIONS_JOB_CIRCLE, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 获取全部可见的工作圈列表
  getAllVisibleJobcircleApi (store, params) {
    return getAllVisibleJobcircleApi(params)
      .then(res => {
        store.commit(GET_ALL_VISIBLE_JOB_CIRCLE, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 关注工作圈
  focusJobCircleApi (store, params) {
    return focusJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 取消关注工作圈
  nofocusJobCircleApi (store, params) {
    return nofocusJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 更新工作圈的选中状态
  updateJobCircleCheckedStatus(store, options) {
    store.commit(UPDATE_JOB_CIRCLE_CHECKED_STATUS, options)
  },
  // 更新工作圈列表项目的选中状态
  updateJobCircleItemCheckedStatus(store, options) {
    store.commit(UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS, options)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
