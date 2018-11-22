import { request } from './index.js'

// 获取关注的工作圈列表
export const getAttentionsJobcircleApi = params => request('/jobcircle/attentions', 'get', params)

// 关注工作圈
export const focusJobCircleApi = params => request('/jobcircle/focus', 'put', params)

// 取消关注工作圈
export const nofocusJobCircleApi = params => request('/jobcircle/nofocus', 'put', params)

// 获取全部可见的工作圈列表
export const getAllVisibleJobcircleApi = params => request('/jobcircle/all', 'get', params)

// 搜索当前工作圈内的带有文件、图片、视频、链接的帖子
export const getJobcirclePostaffixApi = params => request(`/staff/postaffix/${params.id}`, 'get', params.params)

// 获取工作圈分月相册
export const getJobcirclePostaffixOfPictureApi = params => request(`/jobcircle/picture/${params.id}?month=${params.month}`, 'get', params.params)

// 获取工作圈所有帖子文件分页
export const getJobcirclePostaffixOfFilesApi = params => request(`/jobcircle/files/${params.id}`, 'get', params.params)

// 获取工作圈所有帖子链接分页
export const getJobcirclePostaffixOfUrlsApi = params => request(`/jobcircle/urls/${params.id}`, 'get', params.params)
