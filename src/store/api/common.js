import { request } from './index.js'

// 上传问价文件
export const uploadApi = data => request('/attaches', 'post', data)

// 获取成员列表
export const getMemberListsApi = params => request('/member/simpleList', 'get', params)

// 获取分组成员列表
export const getGroupListsApi = params => request('/group', 'get', params)