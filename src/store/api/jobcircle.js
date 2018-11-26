import { request } from './index.js'
import Qs from 'qs'

// 获取关注的工作圈列表
export const getAttentionsJobcircleApi = params => request('/jobcircle/attentions', 'get', params)

// 关注工作圈
export const focusJobCircleApi = params => request('/jobcircle/focus', 'put', params)

// 取消关注工作圈
export const unFocusJobCircleApi = params => request('/jobcircle/nofocus', 'put', params)

// 获取全部可见的工作圈列表
export const getAllVisibleJobcircleApi = params => request('/jobcircle/all', 'get', params)

// 获取全部可见的工作圈列表
export const getAllVisibleJobci1rcleApi = params => request(`/staff/postaffix/`, 'get', params)

// 获取工作圈相册分月列表
export const getPicMonthListJobci1rcleApi = params => request(`/jobcircle/picturemonth/${params.id}`, 'get', params)


// 搜索当前工作圈内的带有文件、图片、视频、链接的帖子 (不分页)
export const getJobcirclePostaffixApi = params => request(`/staff/postaffix/${params.id}`, 'get', params)

// 搜索当前工作圈内的带有文件、图片、视频、链接的帖子 （单项分页）
export const getJobcircleTypeaffixApi = params => request(`/staff/typeaffix/${params.id}`, 'get', params)

// 获取工作圈分月相册
export const getJobcirclePostaffixOfPictureApi = params => request(`/jobcircle/picture/${params.id}}`, 'get', params)

// 获取工作圈相册
export const getJobcirclePostaffixOfPicturesApi = params => request(`/staff/jobpicture/${params.id}}`, 'get', params.params)

// 获取工作圈所有帖子文件分页
export const getJobcirclePostaffixOfFilesApi = params => request(`/jobcircle/files/${params.id}`, 'get', params.params)

// 获取工作圈所有帖子链接分页
export const getJobcirclePostaffixOfUrlsApi = params => request(`/jobcircle/urls/${params.id}`, 'get', params.params)

// 获取工作圈详情
export const getJobcircleDetailApi = params => request(`/jobcircle/detail/${params.id}`, 'get', params.params)

// 置顶关注的工作圈
export const topJobCircleApi = params => request('/jobcircle/stick', 'put', params)

// 取消关注的工作圈置顶
export const unTopJobCircleApi = params => request('/jobcircle/nostick', 'put', params)

// 圈主编辑工作圈
export const putJobCircleIdentityOfOwnerApi = data => request(`/staff/jobcircle/${data.id}`, 'put', Qs.stringify(data))

// 非工作圈成员修改关注，置顶
export const putJobCircleIdentityOfUnMemberApi = data => request(`/staff/focustop/${data.id}`, 'put', Qs.stringify(data))

// 工作圈成员修改置顶
export const putJobCircleIdentityOfMemberApi = data => request(`/staff/membertop/${data.id}`, 'put', Qs.stringify(data))

// 添加工作圈帖子
export const postJobCircleNoteApi = data => request('/jobcircle/post', 'post', Qs.stringify(data))

// 获取工作圈成员列表
export const getJobCircleMemberListsApi = data => request(`/jobcircle/members/${data.id}`, 'get')

// 获取工作圈不可见成员列表
export const getJobCircleMemberHitListsApi = data => request(`/staff/circlehit/${data.id}`, 'get')