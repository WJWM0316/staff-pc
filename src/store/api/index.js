// http://wap.xplus.ziwork.com/laohu/api/docs#/
import axios from 'axios'
import { Loading } from 'element-ui'
import Cookies from 'js-cookie'

let company = Cookies.get('code')

// if(!company) {
//   window.location.href = process.env.VUE_APP__LOGIN_URL
// }

if(process.env.NODE_ENV === 'development') {
  company = process.env.VUE_APP__TEST_COMPANY
  Cookies.set('Authorization-Sso', process.env.VUE_APP__TEST_SSO_TOKEN)
}

let loadingInstance = null
export const API_ROOT = `${process.env.VUE_APP_API}/${company}`

import { removeAccessToken, getAccessToken } from '@/store/cacheService'

// 请求的跟地址
export const upload_api = `${API_ROOT}/attaches`

axios.defaults.baseURL = API_ROOT

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = getAccessToken()
    config.headers.common['Authorization-Sso'] = Cookies.get('Authorization-Sso')
    return config
  },
  error => {
    return Promise.error(error)
  }
)

axios.interceptors.response.use(
  res => {
    if (loadingInstance) loadingInstance.close()
    return res
  },
  err => {
    if(err.response.data.httpStatus === 401) {
      removeAccessToken()
      Cookies.remove('Authorization-Sso', { path: '' })
      window.location.href = process.env.VUE_APP__LOGIN_URL
      return
    }
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(err.response)
  }
)


export const request = (url, method, params = {}) => {
  if (params.globalLoading) {
    loadingInstance = Loading.service({})
    delete params.globalLoading
  }
  return axios[method](url, method === 'get' ? { params } : params)
}
