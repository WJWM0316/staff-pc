import { request } from './index.js'

export const articleGetArticleListApi = params => request('/', 'get', params)
export const articlePostArticleApi = params => request('/', 'post', params)
export const articleDeleteArticleApi = params => request('/', 'delete', params)
export const articlePutArticleApi = params => request('/', 'put', params)