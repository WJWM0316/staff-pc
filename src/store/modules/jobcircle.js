import {
  GET_ATTENTIONS_JOB_CIRCLE,
  GET_ALL_VISIBLE_JOB_CIRCLE,
  UPDATE_JOB_CIRCLE_CHECKED_STATUS,
  UPDATE_JOB_CIRCLE_ITEM_CHECKED_STATUS,
  GET_JOB_CIRCLE_POST_AFFIX_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_FILES_LIST,
  GET_JOB_CIRCLE_POST_AFFIX_URLS_LIST,
  GET_JOB_CIRCLE_DETAIL,
  UPDATE_JOB_CIRCLE_PICTURES_LIST,
  UPDATE_JOB_CIRCLE_FILES_LIST,
  UPDATE_JOB_CIRCLE_URLS_LIST
} from '../mutation-types'

import defaultJobCirclePicture from 'IMAGES/img_normal_head.png'
import {
  getAttentionsJobcircleApi,
  focusJobCircleApi,
  unFocusJobCircleApi,
  getAllVisibleJobcircleApi,
  getJobcirclePostaffixApi,
  getJobcirclePostaffixOfPicturesApi,
  getJobcirclePostaffixOfFilesApi,
  getJobcirclePostaffixOfUrlsApi,
  getJobcircleDetailApi,
  topJobCircleApi,
  unTopJobCircleApi,
  putJobCircleApi,
  postJobCircleNoteApi
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
  jobcirclePostAffixPictures: [],
  jobcirclePostAffixFiles: [],
  jobcirclePostAffixUrls: [],
  currentJobCircleId: null,
  jobcircleDetail: {
    avatarId: null,
    content: null,
    coverImg: {
      smallUrl: defaultJobCirclePicture
    },
    coverImgId: null,
    createdAt: null,
    createdUid: null,
    dynamicAt: null,
    gender: null,
    groupName: null,
    id: null,
    isAttention: null,
    isMember: null,
    isOwner: null,
    isTop: null,
    memberCount: null,
    name: null,
    nickname: null,
    ownerUid: null,
    realname: null,
    sort: 1,
    status: null,
    updatedAt: null,
    memberInfo: []
  }
}

const mutations = {
  [GET_ATTENTIONS_JOB_CIRCLE] (state, list) {
    list.map((field, index) => {
      if(index === 0) {
        field.active = true
        state.currentJobCircleId = field.id
      } else {
        field.active = false
      }
    })
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
    state[options.show].list.map((field, index) => {
      if(index === options.index) {
        field.active = true
        state.currentJobCircleId = field.id
      } else {
        field.active = false
      }
    })
    state[options.hide].list.map((field, index) => field.active = false)
  },
  [GET_JOB_CIRCLE_POST_AFFIX_LIST] (state, list) {
    state.jobcirclePostaffix = list
  },
  [GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST] (state, list) {
    state.jobcirclePostAffixPictures = state.jobcirclePostAffixPictures.concat(list)
  },
  [GET_JOB_CIRCLE_POST_AFFIX_FILES_LIST] (state, list) {
    state.jobcirclePostAffixFiles = state.jobcirclePostAffixFiles.concat(list)
  },
  [GET_JOB_CIRCLE_POST_AFFIX_URLS_LIST] (state, list) {
    state.jobcirclePostAffixUrls = state.jobcirclePostAffixUrls.concat(list)
  },
  [GET_JOB_CIRCLE_DETAIL] (state, data) {
    state.jobcircleDetail = data
  },
  [UPDATE_JOB_CIRCLE_PICTURES_LIST] (state, data) {
    state.jobcirclePostAffixPictures = data
  },
  [UPDATE_JOB_CIRCLE_FILES_LIST] (state, data) {
    state.jobcirclePostAffixFiles = data
  },
  [UPDATE_JOB_CIRCLE_URLS_LIST] (state, data) {
    state.jobcirclePostAffixUrls = data
  }
}

const getters = {
  attentionsJobcircle: state => state.attentionsJobcircle,
  allVisibleJobcircle: state => state.allVisibleJobcircle,
  jobcirclePostAffix: state => state.jobcirclePostAffix,
  jobcirclePostAffixPictures: state => state.jobcirclePostAffixPictures,
  jobcirclePostAffixFiles: state => state.jobcirclePostAffixFiles,
  jobcirclePostAffixUrls: state => state.jobcirclePostAffixUrls,
  currentJobCircleId: state => state.currentJobCircleId,
  jobcircleDetail: state => state.jobcircleDetail
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
        return Promise.reject(error.data || {})
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
        return Promise.reject(error.data || {})
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
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   取消关注工作圈
   */
  unFocusJobCircleApi (store, params) {
    return unFocusJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
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
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取工作圈分月相册
   */
  getJobcirclePostaffixOfPicturesApi (store, params) {
    return getJobcirclePostaffixOfPicturesApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_POST_AFFIX_PICTURES_LIST, res.data.data)
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  // 更新图片列表
  undataJobcirclePostaffixOfPictures (store, data) {
     store.commit(UPDATE_JOB_CIRCLE_PICTURES_LIST, data)
   },
   // 更新文件列表
  undataJobcirclePostaffixOfFiles (store, data) {
     store.commit(UPDATE_JOB_CIRCLE_FILES_LIST, data)
   },
   // 更新链接列表
  undataJobcirclePostaffixOfUrls (store, data) {
     store.commit(UPDATE_JOB_CIRCLE_URLS_LIST, data)
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
        return Promise.reject(error.data || {})
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
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   获取工作圈详情
   */
  getJobcircleDetailApi (store, params) {
    return getJobcircleDetailApi(params)
      .then(res => {
        store.commit(GET_JOB_CIRCLE_DETAIL, res.data.data)
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   置顶关注的工作圈
   */
  topJobCircleApi (store, params) {
    return topJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   取消关注的工作圈置顶
   */
  unTopJobCircleApi (store, params) {
    return unTopJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   编辑工作圈
   * @return   {[type]}          [description]
   */
  putJobCircleApi(store, params) {
    return putJobCircleApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   添加工作圈帖子
   * @return   {[type]}          [description]
   */
  postJobCircleNoteApi(store, params) {
    return postJobCircleNoteApi(params)
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
