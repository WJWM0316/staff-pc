import {
  GET_ATTENTIONS_JOB_CIRCLE,
  GET_ALL_VISIBLE_JOB_CIRCLE,
  UPDATE_JOB_CIRCLE_CHECKED_STATUS,
  UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS,
  GET_JOB_CIRCLE_POST_AFFIX_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_FILES_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_URLS_LIST
} from '../mutation-types'

import {
  getAttentionsJobcircleApi,
  focusJobCircleApi,
  nofocusJobCircleApi,
  getAllVisibleJobcircleApi,
  getJobcirclePostaffixApi,
  getJobcirclePostaffixOfPictureApi,
  getJobcirclePostaffixOfFilesApi,
  getJobcirclePostaffixOfUrlsApi
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
  },
  jobcirclePostAffix: [],
  jobcirclePostAffixPicture: [],
  jobcirclePostAffixFiles: [],
  jobcirclePostAffixUrls: []
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
  },
  [UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS] (state, options) {
    state[options.show].list.map((field, index) => field.active = index === options.index ? true: false)
    state[options.hide].list.map((field, index) => field.active = false)
  },
  [GET_JOB_CIRCLE_POST_AFFIX_LIST] (state, list) {
    state.jobcirclePostaffix = list
  },
  [GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST] (state, list) {
    state.jobcirclePostAffixPicture = list
  },
  [GET_JOB_CIRCLE_POST_AFFIX_FILES_LIST] (state, list) {
    state.jobcirclePostAffixFiles = list
  },
  [GET_JOB_CIRCLE_POST_AFFIX_URLS_LIST] (state, list) {
    state.jobcirclePostAffixUrls = list
  },
}

const getters = {
  attentionsJobcircle: state => state.attentionsJobcircle,
  allVisibleJobcircle: state => state.allVisibleJobcircle,
  jobcirclePostAffix: state => state.jobcirclePostAffix,
  jobcirclePostAffixPicture: state => state.jobcirclePostAffixPicture,
  jobcirclePostAffixFiles: state => state.jobcirclePostAffixFiles,
  jobcirclePostAffixUrls: state => state.jobcirclePostAffixUrls
}

const actions = {

  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取关注的工作圈列表
   */
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
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取全部可见的工作圈列表
   */
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
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   关注工作圈
   */
  focusJobCircleApi (store, params) {
    return focusJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return error
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   取消关注工作圈
   */
  nofocusJobCircleApi (store, params) {
    return nofocusJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return error
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   更新工作圈的选中状态
   */
  updateJobCircleCheckedStatus(store, options) {
    store.commit(UPDATE_JOB_CIRCLE_CHECKED_STATUS, options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   更新工作圈列表项目的选中状态
   */
  updateJobCircleItemCheckedStatus(store, options) {
    store.commit(UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS, options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   搜索当前工作圈内的带有文件、图片、视频、链接的帖子
   */
  getJobcirclePostaffixApi (store, params) {
    return getJobcirclePostaffixApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_POST_AFFIX_LIST, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取工作圈分月相册
   */
  getJobcirclePostaffixOfPictureApi (store, params) {
    return getJobcirclePostaffixOfPictureApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取工作圈分月相册
   */
  getJobcirclePostaffixOfFilesApi (store, params) {
    return getJobcirclePostaffixOfFilesApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_POST_AFFIX_FILES_LIST, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取工作圈分月相册
   */
  getJobcirclePostaffixOfUrlsApi (store, params) {
    return getJobcirclePostaffixOfUrlsApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_POST_AFFIX_URLS_LIST, res.data.data)
        return res
      })
      .catch(error => {
        return error
      })
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
