<template>
 	<section>
 		<commentBox></commentBox>
 		<!-- <p @click="handleChooseImage">上传</p>
 		<input type="file" multiple="multiple" @change="handleChangeImage" style="display: none;" ref="image" name="image" accept="image/*" />
 		<ul class="common-list">
			<li
        v-for="(imageItem, imageIndex) in commonlist"
        :key="imageIndex"
        :data-key="imageIndex"
        class="draggable"
        :style="`background-image: url(${imageItem.base64Src}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
        draggable="true">
				<span class="btn-close"><i class="icon font_family icon-icon_errorsvg"></i></span>
				<el-progress type="circle" :percentage="imageItem.uploadProgress" :stroke-width="2" :width="46" v-if="imageItem.uploadProgress < 100"></el-progress>
			</li>
		</ul> -->
 	</section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Cookies from 'js-cookie'
import { getAccessToken } from '@/store/cacheService'
import { upload_api } from '@/store/api/index.js'
import commentBox from 'COMPONENTS/commentBox1'

@Component({
	components: {
		commentBox
	}
})
export default class ComponentImageUploader extends Vue {
	commonlist = []
	formData = null
	xhr = new XMLHttpRequest()
	dom = null
	handleChooseImage() {
		this.dom = this.$refs['image']
    this.dom.click()
	}
	handleChangeImage() {
		this.formData = new FormData()
		this.files = this.dom.files
		Array.from(this.files).map((file, index) => {
			let reader = new FileReader()
			let data = {name: file.name}
			reader.readAsDataURL(file)
		  // 开始
			reader.onloadstart = (res) => {}
			// 正在读取
			reader.onprogress = (res) => {}
			// 中断
			reader.onabort = (res) => {}
			// 出错
			reader.onerror = (res) => {}
			// 成功读取
			reader.onload = (res) => {
				data.base64Src = res.target.result
				data.uploadProgress = 0
				this.commonlist.push(data)
			}
			// 读取完成，无论成功失败
			reader.onloadend = (res) => {}
			this.formData.append(`img${index + 1}`, file)
		})
		this.handleUploadImage()
	}
	handleUploadImage() {
		this.formData.append('attach_type', 'img')
    this.xhr.open('post', upload_api, true)
    this.xhr.setRequestHeader('Authorization', getAccessToken())
		this.xhr.setRequestHeader('Authorization-Sso', Cookies.get('Authorization-Sso'));
    this.xhr.onload = this.handleImageComplete
    this.xhr.onerror = this.handleImageFailed
    this.xhr.upload.onprogress = this.handleImageProgress
    this.xhr.send(this.formData)
	}
	handleImageProgress(res) {
		this.commonlist.map(field => field.uploadProgress = Math.round(res.loaded / res.total * 100) - 1)
	}
	handleImageComplete(res) {
		// 进度条设置到100
		this.commonlist.map(field => field.uploadProgress = 100)
		// 上传图片返回的数据
		const imageList = JSON.parse(res.target.responseText).data
		// 本地的图片名字
		const nameList = this.commonlist.map(field => field.name)
		// 过滤掉已删除的图片
		let uploadList = imageList.filter(field => nameList.includes(field.fileName))
		uploadList.map((field, index) => {
			field.base64Src = this.commonlist[index].base64Src
			field.uploadProgress = 100
		})
		this.commonlist = uploadList
	}
	handleImageFailed(res) {
		console.log(res)
	}
	handleImageCancle(res) {
		this.xhr.abort()
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