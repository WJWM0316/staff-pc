<template>
	<section class="comment-box">
		<div class="simple-text">
			<textarea id="note-content" v-model="form.content" placeholder="说说你的想法…" class="note-content"></textarea>
		</div>
		<div class="compress-infos" v-if="compressUpload.show">
			<div class="img-box"></div>
			<div class="file-infos">
				<p class="file-name">{{compressUpload.file.name}}</p>
				<div class="gray-line">
					<div class="active-line" :style="`width: ${compressUpload.progress}%`"></div>
				</div>
			</div>
			<div class="action-box">
				<i class="icon font_family icon-icon_errorsvg" @click="removeCompress"></i>
			</div>
		</div>
		<div class="input-link-box" v-if="inputLink.show">
			<input type="text" placeholder="输入或粘贴链接地址" v-model="form.urls">
			<button @click="switchLinkBox">确定</button>
		</div>
		<div class="video-infos" v-if="videoUpload.show">
			<span class="btn-close"><i class="icon font_family icon-icon_errorsvg"></i></span>
			<div class="btn-click"><i class="icon font_family icon-play"></i></div>
			<!-- <video :src="videoUpload.infos.url" v-if="videoUpload.infos.url"> your browser does not support the video tag </video> -->
		</div>
		<ul class="common-list">
			<li
        v-for="(imageItem, imageIndex) in commonList"
        :key="imageIndex"
        :data-key="imageIndex"
        draggable="true" :style="`background-image: url(${imageItem.smallUrl}); background-size: cover; background-repeat: no-repeat; background-position: center center;`">
				<span class="btn-close" @click="handleRemoveUploadImage(imageIndex)"><i class="icon font_family icon-icon_errorsvg"></i></span>
				<!-- <img :src="imageItem.smallUrl" alt=""> -->
				<!-- <el-progress type="circle" :percentage="imageItem.percent" :stroke-width="2" :width="46"></el-progress> -->
			</li>
		</ul>
		<div class="comment-controlls-box">
			<ul class="controlls-list">
				<li>
					<el-upload
					  :action="imageUpload.action"
					  :accept="imageUpload.accept"
					  :data="imageUpload.params"
					  :show-file-list="false"
					  :limit="imageUpload.limit"
					  :on-progress="handleImageProgress"
					  :on-success="handleImageSuccess"
					  :on-change="handleImageChange"
					  :on-exceed="handleImageExceed"
					  multiple>
					  <i class="icon font_family icon-btn_photo"></i>图片
					</el-upload>
				</li>
				<li>
					<el-upload
					  :action="videoUpload.action"
					  :accept="videoUpload.accept"
					  :data="videoUpload.params"
					  :show-file-list="false"
					  :on-progress="handleVideoProgress"
					  :on-success="handleVideoSuccess"
					  :on-change="handleVideoChange">
					  <i class="icon font_family icon-btn_video"></i>视频
					</el-upload>
				</li>
				<li>
					<el-upload
					  :action="compressUpload.action"
					  :accept="compressUpload.accept"
					  :data="compressUpload.params"
					  :show-file-list="false"
					  :on-progress="handleCompressProgress"
					  :on-success="handleCompressSuccess"
					  :on-change="handleCompressChange">
					  <i class="icon font_family icon-btn_doc"></i>文件
					</el-upload>
				</li>
				<li @click="switchLinkBox"><i class="icon font_family icon-btn_link"></i>链接</li>
			</ul>
			<div class="submit-setting">
				<span class="auth-setting" @click="checked">
					<i class="icon font_family icon-radio_selected" v-if="!form.visible"></i>
					<i class="icon font_family icon-check-circle" v-if="form.visible"></i>
					仅成员可见
				</span>
				<button class="submit-button-default" :class="{'submit-button-active': form.content}" @click="submit">发布</button>
			</div>
		</div>
	</section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { getAccessToken } from '@/store/cacheService'
import { upload_api } from '@/store/api/index.js'

@Component({
	name: 'comment-box',
	methods: {
		...mapActions([
			'uploadAttachesApi',
			'postJobCircleNoteApi'
		])
	},
	props: {
    // 按钮的状态
    visible: {
      type: Boolean,
      default: false
    }
  }
})
export default class ComponentCommentBox extends Vue {
	imgEdit = {
		start: {index: null, data: null},
		end: {index: null, data: null}
	}
	commonList = []
	domLists = null
	dragEl = null
	// 图片上传
  imageUpload = {
  	action: upload_api,
    limit: 20,
    accept: '.png, .jpg',
    imgLists: [],
    params: {
      token: getAccessToken(),
      attach_type: 'img',
    }
  }

  // 视频上传
  videoUpload = {
  	show: false,
  	action: upload_api,
    limit: 1,
    accept: '.mp4,.ogg,.flv,.avi,.wmv,.rmvb',
    file: {},
    params: {
      token: getAccessToken(),
      attach_type: 'video',
    },
    progress: 0,
    infos: {
    	url: ''
    }
  }

  // 文件上传
  compressUpload = {
  	show: false,
  	action: upload_api,
    limit: 1,
    accept: '.rar',
    file: {},
    params: {
      token: getAccessToken(),
      attach_type: 'compress',
    },
    progress: 0
  }

  inputLink = {
  	show: false,
  	value: ''
  }

  form = {
  	community_id: null,
  	content: '',
  	visible: false,
  	pictures: '',
  	videos: '',
  	files: '',
  	urls: ''
  }
  created() {
  	const community_id = this.$route.query.id
  	this.form.community_id = community_id
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   选择图片超过上传限制
   * @return   {[type]}            [description]
   */
  handleImageExceed(files, fileList) {
    console.log(files)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   多图上传
   * @return   {[type]}   [description]
   */
  multipleImageUpload() {
    const formData = new FormData()
    let i = 0
    formData.append('attach_type', 'img')
    this.imageUpload.imgLists.forEach((file, index) => {
    	formData.append(`img${index + 1}`, file)
    	i = i + 1
    })
    // this.uploadAttachesApi(formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   获取选中的图片
   * @return   {[type]}        [description]
   */
  handleImageChange(file) {
  	if(!this.imageUpload.imgLists.includes(file.uid)) {
  		this.imageUpload.imgLists.push(file.uid)
  		this.imageUpload.limit--
  	}
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleImageProgress(event) {
  	// this.commonList[this.commonList.length - 1].percent = event.percent
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleImageSuccess(res) {
  	this.commonList.push(res.data[0])
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleRemoveUploadImage(index) {
  	this.commonList.splice(index, 1)
  }

  test() {
  	this.domLists = document.querySelectorAll('.common-list li')
  	this.dragEl = null
  	Array.from(this.domLists).map(dom => {
  		dom.addEventListener('dragstart', this.handleImageMoveDragStart,false)
	    dom.addEventListener('dragenter', this.handleImageMoveDragEnter, false)
	    dom.addEventListener('dragover', this.handleImageMoveDragOver, false)
	    dom.addEventListener('dragleave', this.handleImageMoveDragLeave, false)
	    dom.addEventListener('drop', this.handleImageMoveDrop, false)
	    dom.addEventListener('dragend', this.handleImageMoveDrapend, false)
  	})
  }

  handleImageMoveDragStart(e) {
  	const index = e.target.getAttribute('data-key')
  	this.imgEdit.start.data = this.commonList[index]
  	this.imgEdit.start.index = index
    e.target.style.opacity = '0.5'
    this.dragEl = e.target
    e.dataTransfer.effectAllowed = 'move'
  }

  handleImageMoveDragEnter(e) {
    e.target.classList.add('over')
  }

  handleImageMoveDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move'
    return false
  }

  handleImageMoveDragLeave(e) {
    e.target.classList.remove('over')
  }   

  handleImageMoveDrop(e) {
  	const index = e.target.getAttribute('data-key')
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    if (this.dragEl != e.target) {
    	this.commonList.splice(this.imgEdit.start.index, 1, this.commonList[index])
    	this.commonList.splice(index, 1, this.imgEdit.start.data)
    }
    return false
  }

  handleImageMoveDrapend(e) {
  	Array.from(this.domLists).map(dom => {
  		dom.classList.remove('over')
      dom.style.opacity = '1'
  	})
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   视频上传
   * @return   {[type]}   [description]
   */
  handleVideoUpload() {
  	const formData = new FormData()
    formData.append('attach_type', 'video')
    formData.append('img1', this.videoUpload.file)
  	this.uploadAttachesApi(formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   获取选中的视频
   * @return   {[type]}   [description]
   */
  handleVideoChange(file) {
  	this.videoUpload.file = file.raw
  	this.videoUpload.show = true
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   视频上传进度
   * @return   {[type]}        [description]
   */
  handleVideoProgress(event, file, fileList) {
  	this.videoUpload.progress = event.percent
  }
   /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   视频上传成功
   * @return   {[type]}        [description]
   */
  handleVideoSuccess(res) {
  	this.videoUpload.infos = res.data[0]
  }
   /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   文件上传
   * @return   {[type]}   [description]
   */
  handleCompressUpload() {
  	const formData = new FormData()
    formData.append('attach_type', 'compress')
    formData.append('img1', this.compressUpload.file)
  	this.uploadAttachesApi(formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   获取选中的文件
   * @return   {[type]}   [description]
   */
  handleCompressChange(file) {
  	this.compressUpload.file = file.raw
  	this.compressUpload.show = true
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   文件上传进度
   * @return   {[type]}        [description]
   */
  handleCompressProgress(event, file, fileList) {
  	this.compressUpload.progress = event.percent
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   文件上传成功
   * @return   {[type]}        [description]
   */
  handleCompressSuccess(event, file, fileList) {
  	console.log(event.percent, file, fileList)
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   文件上传成功
   * @return   {[type]}        [description]
   */
  handleCompressSuccess(event, file, fileList) {
  	console.log(event, file, fileList)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   移除上传的文件
   * @return   {[type]}   [description]
   */
  removeCompress() {
  	this.compressUpload.show = false
  	this.compressUpload.file = {}
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-24
   * @detail   切换显示链接输入框
   * @return   {[type]}   [description]
   */
  switchLinkBox() {
  	this.inputLink.show = !this.inputLink.show
  }
  showLinkBox() {
  	this.inputLink.show = true
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-24
   * @detail   提交接口
   * @return   {[type]}   [description]
   */
  submit() {
  	const params = this.transformData(this.form)
  	if(!params.content) return
  	this.postJobCircleNoteApi(params)
  			.then((res) => {
  				this.$message({
            message: `${res.data.msg}~`,
            type: 'success'
          })
  			})
  			.catch(err => {
  				this.$message.error(`${err.msg}~`)
  			})
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-24
   * @detail   是否队成员可见
   * @return   {[type]}   [description]
   */
  checked() {
  	this.form.visible = !this.form.visible
  }
  /**
   * @Author   小书包
   * @DateTime 2018-09-12
   * @detail   获取提交参数
   * @return   {[type]}   [description]
   */
  transformData(data) {
  	const formData = {}
  	Object.keys(data).map(attr => {
  		if(data[attr]) formData[attr] = data[attr]
  	})
    return formData
  }

  mounted() {
  	this.test()
  }
}
</script>
<style lang="scss">
.comment-box {
	background: white;
	border-radius: 2px;
	padding: 16px;
	box-sizing: border-box;
	.note-content {
		width:100%;
		height:80px;
		background:rgba(255,255,255,1);
		border-radius:4px;
		border:1px solid #EBEEF5;
		box-sizing: border-box;
		outline: unset;
		overflow: hidden;
		line-height: 30px;
	}
	textarea::-webkit-input-placeholder{
    color: #BCBCBC;
    font-size: 12px;
    font-weight: 400;
	}
	.comment-controlls-box {
		display: flex;
		height: 36px;
		margin-top: 16px;
	}
	.controlls-list {
		overflow: hidden;
		font-size: 14px;
		line-height: 36px;
		flex-grow: 1;
		li{
			display: inline-block;
			margin-right: 25px;
			color: #666666;
			cursor: pointer;
		}
	}
	.submit-setting {
		font-size:14px;
		font-weight:400;
		color:rgba(102,102,102,1);
		width: 300px;
		text-align: right;
		.auth-setting {
			display: inline-block;
			cursor: pointer;
		}
		.icon-radio_selected {
			color: #EBEEF5;
		}
		.icon-check-circle {
			color: #FFE266;
		}
	}
	.submit-button-default {
		width:98px;
		height:36px;
		background:rgba(248,248,248,1);
		font-size:14px;
		font-weight:400;
		color:rgba(146,146,146,1);
    white-space: nowrap;
    cursor: pointer;
    color: #606266;
    -webkit-appearance: none;
    box-sizing: border-box;
    outline: none;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    border-radius: 4px;
    border: unset;
    margin-left: 24px;
	}
	.submit-button-active {
		background:#FFE266;
		color: #354048;
	}
	.compress-infos {
		height:62px;
		background:rgba(245,247,250,1);
		border-radius:4px;
		margin-top: 16px;
		display: flex;
		padding: 8px;
		box-sizing: border-box;
		.img-box {
			width:46px;
			height:46px;
			background:rgba(255,114,58,1);
			border-radius:4px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 8px;
		}
		.action-box {
			width:54px;
			height:46px;
			border-radius:4px;
			display: inline-block;
			vertical-align: middle;
			text-align: center;
			line-height: 46px;
			color: #BCBCBC;
		}
		.file-infos{
			height: 46px;
			width: calc(100% - 56px - 52px);
			display: inline-block;
			vertical-align: middle;
		}
		.file-name {
			font-size:14px;
			font-weight:300;
			color:rgba(0,0,0,0.85);
			line-height: 1;
		}
		.gray-line {
			height:4px;
			background:rgba(237,237,237,1);
			border-radius:8px;
			position: relative;
			overflow: hidden;
		}
		.active-line {
			height:4px;
			background:#FFE266;
			border-radius:8px;
			position: relative;
			overflow: hidden;
			position: absolute;
			left: 0;
			width: 50%;
		}
	}
	.input-link-box{
		height:62px;
		background:rgba(245,247,250,1);
		border-radius:4px;
		margin-top: 16px;
		box-sizing: border-box;
		padding: 12px 8px;
		input{
			width: calc(100% - 44px);
			box-sizing: border-box;
			display: inline-block;
			vertical-align: middle;
			height: 38px;
			border-radius: 4px;
			box-sizing: border-box;
			border: unset;
			outline: unset;
			-webkit-appearance: none;
			padding: 0 16px;
		}
		input::-webkit-input-placeholder{
	    color: #BCBCBC;
	    font-size: 12px;
	    font-weight: 400;
		}
		button{
			width: 44px;
			height:38px;
			background:transparent;
			color:rgba(146,146,146,1);
	    cursor: pointer;
	    color: #606266;
	    -webkit-appearance: none;
	    outline: none;
	    font-weight: 500;
	    -moz-user-select: none;
	    -webkit-user-select: none;
	    -ms-user-select: none;
	    border-radius: 4px;
	    border: unset;
	    display: inline-block;
			font-size:14px;
			font-weight:500;
			color:rgba(215,171,112,1);
		}
	}
	.video-infos {
		width:90px;
		height:90px;
		background:#354048;
		border-radius:4px;
		position: relative;
		margin-top: 24px;
		.btn-close{
			position: absolute;
			top: -8px;
			right: -8px;
			color: #BCBCBC;
		}
		video{
			width: 100%;
			height: 100%;
		}
		.btn-click{
			width:34px;
			height:34px;
			background:rgba(255,255,255,1);
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			line-height: 34px;
			text-align: center;
		}
	}
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
			img {
				width: 100%;
				height: 100%;
			}
		}
		.btn-close{
			position: absolute;
			top: -8px;
			right: -8px;
			color: #BCBCBC;
		}
		.el-progress--circle{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>