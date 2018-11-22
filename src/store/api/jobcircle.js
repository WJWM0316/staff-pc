import { request } from './index.js'

// 获取关注的工作圈列表
export const getAttentionsJobcircleApi = params => request('/jobcircle/attentions', 'get', params)

// 关注工作圈
export const focusJobCircleApi = params => request('/jobcircle/focus', 'put', params)

// 取消关注工作圈
export const nofocusJobCircleApi = params => request('/jobcircle/nofocus', 'put', params)

// 获取全部可见的工作圈列表
export const getAllVisibleJobcircleApi = params => request('/jobcircle/all', 'get', params)

// 获取全部可见的工作圈列表
export const getAllVisibleJobci1rcleApi = params => request(`/staff/postaffix/`, 'get', params)

// 获取工作圈相册分月列表
export const getPicMonthListJobci1rcleApi = params => request(`/jobcircle/picturemonth/${params.id}`, 'get', params)

// 获取工作圈分月相册
export const getPicListJobci1rcleApi = params => request(`/jobcircle/picture/${params.id}`, 'get', params)



