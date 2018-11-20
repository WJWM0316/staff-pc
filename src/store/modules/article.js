import {
  GET_ARTICLELIST
} from '../mutation-types'

import {
  articleGetArticleListApi,
  articlePostArticleApi,
  articleDeleteArticleApi,
  articlePutArticleApi
} from 'API/article'

const state = {
  articleListInfo: {},
  articleInfo: {}
}

const mutations = {
  [GET_ARTICLELIST] (status, boolean) {
    state.articleListInfo = boolean
  }
}

const getters = {
  articleListInfo: state => state.articleListInfo
}

const actions = {

  // 获取文章列表
  articleGetArticleListApi (store, params) {
    articleGetArticleListApi(params)
      .then(res => {
        store.commit(GET_ARTICLELIST, res.data.info)
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 创建文章
  articlePostArticleApi (store, params) {
    articlePostArticleApi(params)
      .then(res => {
        store.commit(GET_ARTICLELIST, res.data.info)
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 删除文章
  articleDeleteArticleApi (store, params) {
    articleDeleteArticleApi(params)
      .then(res => {
        store.commit(GET_ARTICLELIST, res.data.info)
        return res
      })
      .catch(error => {
        return error
      })
  },
  // 更新文章
  articlePutArticleApi (store, params) {
    articlePutArticleApi(params)
      .then(res => {
        store.commit(GET_ARTICLELIST, res.data.info)
        return res
      })
      .catch(error => {
        return error
      })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
