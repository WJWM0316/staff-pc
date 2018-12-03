import { upload_api } from '@/store/api/index.js'
import { getAccessToken } from '@/store/cacheService'
import axios from 'axios'

export function download(vkey) {
	return axios.get(`${upload_api}/download/${vkey}`)
}