import { request } from './index.js'
import Cookies from 'js-cookie'
let company = Cookies.get('code')
if(process.env.NODE_ENV === 'development') {
  company = process.env.VUE_APP__TEST_COMPANY
  Cookies.set('Authorization-Sso', process.env.VUE_APP__TEST_SSO_TOKEN)
}
const API_ROOT = `${process.env.VUE_APP_API}/${company}`
const upload_api = `${API_ROOT}/attaches`
// 上传的接口
export const uploadAttachesApi = params => request(upload_api, 'post', params)