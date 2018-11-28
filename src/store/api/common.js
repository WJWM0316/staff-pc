import { request } from './index.js'

// 上传问价文件
export const uploadApi = data => request('/attaches', 'post', data)

// 获取成员列表
export const getMemberListsApi = params => request('/member/simpleList', 'get', params)

// 获取分组成员列表
export const getGroupListsApi = params => request('/group', 'get', params)

// 提交获取上传基本信息
export const postAttachesConfigApi = params => request('/attaches/config', 'post', params)

// 下载附件
export const downloadApi = params => request(`/attaches/download/${params.id}`, 'get')