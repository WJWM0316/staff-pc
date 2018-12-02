/**
 * @Author   小书包
 * @DateTime 2018-12-1
 * @detail   上传插件
 */
export class XUploader {
	constructor(options) {
		this.options = options
		this.formData = new FormData()
		this.xhr = new XMLHttpRequest()
		this.dom = document.querySelector(this.options.el)
	}
	change() {
		this.dom.onchange = () => {
			this.files = this.dom.files
			Array.from(this.files).map((file, index) => {
				// let reader = new FileReader()
				// reader.readAsDataURL(file)
				// // 中断
				// reader.onabort = (e) => {
				// 	console.log(e, '中断')
				// }
				// // 出错
				// reader.onerror = (e) => {
				// 	console.log(e, '出错')
				// }
				// // 开始
				// reader.onloadstart = (e) => {
				// 	console.log(e, '开始')
				// }
				// // 正在读取
				// reader.onprogress = (e) => {
				// 	console.log(e.loaded/e.total*100)
				// 	console.log(e, '正在读取')
				// }
				// // 成功读取
				// reader.onload = (e) => {
				// 	console.log(e, '成功读取')
				// }
				// // 读取完成，无论成功失败
				// reader.onloadend = (e) => {
				// 	console.log(e, '读取完成，无论成功失败')
				// }
				this.formData.append('img1', file)
				this.upload()
			})
		}
	}
	upload() {
		this.formData.append('attach_type', 'img')
    this.xhr.open('post', `http://wap.xplus.ziwork.com/laohu/attaches?token=${this.options.token}`, true)
    this.xhr.onload = this.complete
    this.xhr.onerror =  this.failed
    this.xhr.upload.onprogress = this.progress
    this.xhr.send(this.formData)

	}
	progress(res) {
		console.log(res.loaded / res.total * 100)
	}
	complete(res) {
		console.log('complete')
	}
	failed(res) {
		console.log('failed')
	}
	cancle(res) {
		console.log('用户取消上传')
		this.xhr.abort()
	}
}
