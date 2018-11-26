import {
  SWITCH_OPEN_MODAL,
  GET_MEMBER_LISTS,
  GET_GROUP_LISTS,
  CLASSIFY_MENBER_LISTS_BY_GROUPID,
  UPDATE_MEMBER_LISTS
} from '../mutation-types'

import {
  uploadApi,
  getMemberListsApi,
  getGroupListsApi,
  postAttachesConfigApi
} from 'API/common'

const state = {
  memberLists: [],
  groupLists: []
}

const mutations = {
  // 切换限制弹窗
  [SWITCH_OPEN_MODAL] (state, open) {
    state.openModal = !!open
  },
  // 获取成员列表
  [GET_MEMBER_LISTS] (state, data) {
    data.map(field => {
      field.active = false
      field.selfGroup = []
      if(field.group) field.group.map(val => field.selfGroup.push(val.groupId))
    })
    state.memberLists = data
  },
  // 获取组列表
  [GET_GROUP_LISTS] (state, data) {
    const list = data.filter(field => field.count)
    list.map(field => field.active = false)
    state.groupLists = [{count: 4, groupId: 'all', groupName: '所有人', sort: 1, active: false}, ...list]
  },
  // 通过组划分成员
  [CLASSIFY_MENBER_LISTS_BY_GROUPID] (state, params) {
    if(params.groupId === 'all') {
      params.bool ? state.memberLists.map(field => field.active = false) : state.memberLists.map(field => field.active = true)
      params.bool ? state.groupLists.map(field => field.active = false) : state.groupLists.map(field => field.active = true)
    } else {
      state.groupLists.map(field => field.active = field.groupId === params.groupId ? !field.active : false)
      state.memberLists.map(field => {
        if(field.selfGroup && field.selfGroup.includes(params.groupId)) field.active = !field.active
      })
    }
  },
  // 更新成员列表
  [UPDATE_MEMBER_LISTS] (state, params) {
    state.memberLists.map((field, i) => {
      if(params.index === i) field.active = !field.active
    })
  }
}

const getters = {
  memberLists: state => state.memberLists,
  groupLists: state => state.groupLists
}

const actions = {
  switchOpenModal (store, open) {
    store.commit(SWITCH_OPEN_MODAL, open)
  },
  showDialog(store, options) {
    store.commit(SHOW_DIALOG, options)
  },
  hideDialog(store, options) {
    store.commit(HIDE_DIALOG, options)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-20
   * @detail   上传文件
   * @return   {[type]}          [description]
   */
  uploadApi(store, params) {
    return uploadApi(params)
      .then(res => {
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-20
   * @detail   获取成员列表
   * @return   {[type]}          [description]
   */
  getMemberListsApi(store, params) {
    return getMemberListsApi(params)
      .then(res => {
        store.commit(GET_MEMBER_LISTS, res.data.data)
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   获取分组列表
   * @return   {[type]}          [description]
   */
  getGroupListsApi(store, params) {
    return getGroupListsApi(params)
      .then(res => {
        store.commit(GET_GROUP_LISTS, res.data.data)
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   成员分组
   * @return   {[type]}          [description]
   */
  classifyMemberListsByGroupIdApi(store, params) {
    store.commit(CLASSIFY_MENBER_LISTS_BY_GROUPID, params)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   更新分组列表
   * @return   {[type]}          [description]
   */
  updateMemberListsApi(store, params) {
    store.commit(UPDATE_MEMBER_LISTS, params)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-09-21
   * @detail   提交获取上传基本信息
   * @return   {[type]}          [description]
   */
  postAttachesConfigApi(store, params) {
    return postAttachesConfigApi(params)
      .then(res => {
        store.commit(GET_GROUP_LISTS, res.data.data)
        return res
      })
      .catch(error => {
        return Promise.reject(error.data || {})
      })
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
