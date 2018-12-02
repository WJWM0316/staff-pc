<template>
 	<section>
 		<p @click="selete">上传</p>
 		<input type="file" id="image" multiple="multiple" @change="change" style="display: none;" ref="image" value="123456" name="image" />
 		<button @click="cancle">取消</button>
 		<ul class="common-list">
			<li
        v-for="(imageItem, imageIndex) in commonList"
        :key="imageIndex"
        :data-key="imageIndex"
        class="draggable"
        :style="`background-image: url(${imageItem.base64Src}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
        draggable="true">
				<span class="btn-close"><i class="icon font_family icon-icon_errorsvg"></i></span>
				<el-progress type="circle" :percentage="imageItem.uploadProgress" :stroke-width="2" :width="46" v-if="imageItem.uploadProgress < 100"></el-progress>
			</li>
		</ul>
 	</section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Cookies from 'js-cookie'
import { getAccessToken } from '@/store/cacheService'

@Component({})
export default class ComponentImageUploader extends Vue {
	commonList = []
	isAllComplete = false
	uploader = null
	formData = new FormData()
	xhr = new XMLHttpRequest()
	dom = null
	selete() {
    this.$refs['image'].click()
	}
	change() {
		this.files = this.dom.files
		Array.from(this.files).map((file, index) => {
			let reader = new FileReader()
			let data = {name: file.name}
			reader.readAsDataURL(file)
		  // 开始
			reader.onloadstart = (res) => {}
			// 正在读取
			reader.onprogress = (res) => {
				// data.uploadProgress = parseInt(res.loaded / res.total*100)
			}
			// 中断
			reader.onabort = (res) => {}
			// 出错
			reader.onerror = (res) => {}
			// 成功读取
			reader.onload = (res) => {
				data.base64Src = res.target.result
				data.uploadProgress = 0
				this.commonList.push(data)
			}
			// 读取完成，无论成功失败
			reader.onloadend = (res) => {}
			this.formData.append(`img${index + 1}`, file)
		})
		this.upload()
	}
	upload() {
		this.formData.append('attach_type', 'img')
    this.xhr.open('post', 'http://wap.xplus.ziwork.com/laohu/attaches', true)
    this.xhr.setRequestHeader('Authorization', getAccessToken())
		this.xhr.setRequestHeader('Authorization-Sso', Cookies.get('Authorization-Sso'));
    this.xhr.onload = this.complete
    this.xhr.onerror =  this.failed
    this.xhr.upload.onprogress = this.progress
    this.xhr.send(this.formData)
	}
	progress(res) {
		this.commonList.map(field => field.uploadProgress = Math.round(res.loaded / res.total * 100) - 1) 
	}
	complete(res) {
		this.commonList.map(field => field.uploadProgress = 100)
		const commonList = JSON.parse(res.target.responseText).data
		const nameList = this.commonList.map(field => field.name)
	}
	failed(res) {}
	cancle(res) {
		this.xhr.abort()
	}
	mounted() {
		this.dom = document.querySelector('#image')
	}
}
</script>
<style lang="scss">
.common-list {
	margin-top: 24px;
	li {
		width:88px;
		height:88px;
		background:rgba(245,247,250,1);
		border-radius:4px;
		position: relative;
		display: inline-block;
		margin-right: 24px;
    margin-bottom: 24px;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>