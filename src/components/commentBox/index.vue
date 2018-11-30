<template>
	<section class="comment-box">
		<div class="simple-text" ref="simple-text">
			<textarea v-model="form.content" placeholder="说说你的想法…" class="note-content" ref="note-content" maxlength="1500"></textarea>
      <div class="limit-box"><font :style="`color: ${form.content.length <= 1000 ? '#BCBCBC' : '#FA6A30'}`">{{form.content.length}}</font>/1000</div>
		</div>
		<div class="compress-infos" v-if="compressUpload.show">
			<div class="img-box">
        <img :src="compressUpload.file.name | fileCover" alt="">   
      </div>
			<div class="file-infos">
				<p class="file-name">{{compressUpload.file.name}}</p>
				<div class="gray-line">
					<div class="active-line" :style="`width: ${compressUpload.progress}%`"></div>
				</div>
			</div>
			<div class="action-box">
				<i class="icon font_family icon-icon_errorsvg" @click="handleRemoveCompress"></i>
			</div>
		</div>
    <div class="link-infos" v-if="form.urls">
      <div class="img-box">
        <img src="https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/postLink.png" alt="">   
      </div>
      <div class="file-infos">
        <p class="file-name">{{form.urls}}</p>
      </div>
      <div class="action-box">
        <i class="icon font_family icon-icon_errorsvg" @click="handleRemoveLink"></i>
      </div>
    </div>
		<div class="input-link-box" v-if="inputLink.show">
			<input type="text" placeholder="输入或粘贴链接地址" v-model="inputLink.value">
			<button @click="confirmEmail">确定</button>
		</div>
		<div class="video-infos" v-if="videoUpload.show">
			<span class="btn-close" @click="handleVideoRemove"><i class="icon font_family icon-icon_errorsvg"></i></span>
			<div class="btn-click" v-if="videoUpload.progress === 100"><i class="icon font_family icon-play"></i></div>
      <el-progress type="circle" :percentage="videoUpload.progress" :stroke-width="2" :width="46" v-if="videoUpload.progress < 100"></el-progress>
			<video :src="videoUpload.infos.url" v-if="form.videos"> your browser does not support the video tag </video>
		</div>
		<ul class="common-list" v-if="commonList.length">
			<li
        v-for="(imageItem, imageIndex) in commonList"
        :key="imageIndex"
        :data-key="imageIndex"
        class="draggable"
        :style="`background-image: url(${imageItem.smallUrl}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
        draggable="true">
				<span class="btn-close" @click="handleRemoveUploadImage(imageIndex)"><i class="icon font_family icon-icon_errorsvg"></i></span>
				<el-progress type="circle" :percentage="imageItem.progress" :stroke-width="2" :width="46" v-if="imageItem.progress !== 100"></el-progress>
			</li>
      <li class="upload-li" v-if="commonList.length < 20">
        <el-upload
            :action="imageUpload.action"
            ref="image"
            :accept="imageUpload.accept"
            :data="imageUpload.params"
            :show-file-list="false"
            :on-progress="handleImageProgress"
            :on-success="handleImageSuccess"
            :on-change="handleImageChange"
            :on-exceed="handleImageExceed"
            :before-upload="beforeImageUpload"
            multiple>
            <i class="el-icon-plus"></i>
          </el-upload>
      </li>
		</ul>
		<div class="comment-controlls-box">
			<ul class="controlls-list">
				<li>
					<el-upload
            ref="image"
            :disabled="imageUpload.disabled"
            v-if="commonList.length < 20"
					  :action="imageUpload.action"
					  :accept="imageUpload.accept"
					  :data="imageUpload.params"
					  :show-file-list="false"
					  :on-progress="handleImageProgress"
					  :on-success="handleImageSuccess"
					  :on-change="handleImageChange"
					  :on-exceed="handleImageExceed"
            :before-upload="beforeImageUpload"
					  multiple>
					  <span><i class="icon font_family icon-btn_photo"></i>图片</span>
					</el-upload>
          <span @click="setOtherEnabled('imageUpload')" v-else><i class="icon font_family icon-btn_photo"></i>图片</span>
				</li>
				<li>
					<el-upload
            ref="video"
            :disabled="videoUpload.disabled"
					  :action="videoUpload.action"
					  :accept="videoUpload.accept"
					  :data="videoUpload.params"
					  :show-file-list="false"
					  :on-progress="handleVideoProgress"
					  :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
            :on-error="handleVideoError"
					  :on-change="handleVideoChange">
					  <span v-if="!videoUpload.disabled"><i class="icon font_family icon-btn_video"></i>视频</span>
            <span v-else @click="setOtherEnabled('videoUpload')"><i class="icon font_family icon-btn_video"></i>视频</span>
					</el-upload>
				</li>
				<li>
					<el-upload
            ref="file"
            :disabled="compressUpload.disabled"
					  :action="compressUpload.action"
					  :accept="compressUpload.accept"
					  :data="compressUpload.params"
					  :show-file-list="false"
					  :on-progress="handleCompressProgress"
					  :on-success="handleCompressSuccess"
            :before-upload="beforeCompressUpload"
					  :on-change="handleCompressChange">
					  <span v-if="!compressUpload.disabled"><i class="icon font_family icon-btn_doc"></i>文件</span>
            <span v-else @click="setOtherEnabled('compressUpload')"><i class="icon font_family icon-btn_doc"></i>文件</span>
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
import { docExt } from 'UTILS/doc.js'
import { compressExtS } from 'UTILS/compress.js'
import { lsCache } from '@/store/cacheService'

@Component({
	name: 'comment-box',
	methods: {
		...mapActions([
			'uploadAttachesApi',
			'postJobCircleNoteApi'
		])
	},
  computed: {
    ...mapGetters([
      'currentJobCircleId',
    ])
  },
  watch: {
    'commonList': {
      handler(commonList) {
        if(commonList.length) setTimeout(() => {this.handleImageRange()})
      },
      immediate: true
    },
    'form.content': {
      handler(content) {
        this.$emit('input', content)
      },
      immediate: true
    },
    'imageUpload.limit': {
      handler(num) {
        if(num === 0) {
          this.$message.error('一次发布最多只允许上传20张图片~')
        }
      },
      immediate: true
    }
  }
})
export default class ComponentCommentBox extends Vue {
  currentUploadType = null
  canResetHeight = true
	imgEdit = {
		start: {index: null, data: null},
		end: {index: null, data: null}
	}
	commonList = []
	domLists = null
	dragEl = null
	// 图片上传
  imageUpload = {
    disabled: false,
  	action: upload_api,
    limit: 20,
    accept: 'image/*',
    imgLists: [],
    loadingList: [],
    params: {
      token: getAccessToken(),
      attach_type: 'img',
    }
  }

  // 视频上传
  videoUpload = {
    loading: false,
    disabled: false,
  	show: false,
  	action: upload_api,
    limit: 1,
    accept: '.avi,.rmvb,.rm,.mov,.mpg,.mpeg,.swf,.flv,.mp4,.3gp,.asf,.f4v,.webm,.wmv',
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
    loading: false,
    disabled: false,
  	show: false,
  	action: upload_api,
    limit: 1,
    accept: [...docExt, ...compressExtS].join(','),
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
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   选择图片超过上传限制
   * @return   {[type]}            [description]
   */
  handleImageExceed() {
    this.$message.error('一次发布最多只允许上传20张图片~')
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
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   获取选中的图片
   * @return   {[type]}        [description]
   */
  handleImageChange(file) {}
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   图片上传之前做判断
   * @return   {[type]}   [description]
   */
  beforeImageUpload(file) {
    const isLt5M = file.size / 1024 / 1024 > 5
    if(isLt5M) {
      this.$message.error('上传的图片大小是5MB~')
      return false
    }
    if(this.commonList.length >= 20) return
    file.progress = 0
    if(this.currentUploadType && this.currentUploadType !== 'imageUpload') {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadTypeChange()
        this.currentUploadType = null
        this.setOtherDisabled('imageUpload')
      }).catch(() => {
        // nothing to do
      })
      return false
    } else {
      if(!this.imageUpload.imgLists.includes(file.uid)) {
        this.imageUpload.imgLists.push(file.uid)
        this.imageUpload.limit--
        this.commonList.push(file)
      }
      this.currentUploadType = 'imageUpload'
      this.setOtherDisabled('imageUpload')
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleImageProgress(event) {
    this.commonList[this.commonList.length - 1].progress = parseInt(event.percent)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleImageSuccess(res) {
    const infos = {...res.data[0], progress: 100}
    this.commonList.map((field, index, commonList) => {
      if(field.name === res.data[0].fileName) commonList.splice(index, 1, infos)
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   图片上传进度
   * @return   {[type]}        [description]
   */
  handleRemoveUploadImage(index) {
  	this.commonList.splice(index, 1)
    this.imageUpload.limit++
    if(this.imageUpload.progress < 100) {
      this.$refs.image.abort()
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   图片重新排序
   * @return   {[type]}   [description]
   */
  handleImageRange() {
  	this.domLists = document.querySelectorAll('.common-list .draggable')
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
  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   图片开始拖拽
   * @return   {[type]}     [description]
   */
  handleImageMoveDragStart(e) {
  	const index = e.target.getAttribute('data-key')
  	this.imgEdit.start.data = this.commonList[index]
  	this.imgEdit.start.index = index
    e.target.style.opacity = '0.5'
    e.target.classList.add('draging')
    this.dragEl = e.target
    e.dataTransfer.effectAllowed = 'move'
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}     [description]
   */
  handleImageMoveDragEnter(e) {
    e.target.classList.add('over')
    // e.dataTransfer.setData('text/html', '123')
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}     [description]
   */
  handleImageMoveDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move'
    // e.dataTransfer.setData('text/html', '123')
    // console.log(111)
    return false
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}     [description]
   */
  handleImageMoveDragLeave(e) {
    e.target.classList.remove('over')
  }   

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}     [description]
   */
  handleImageMoveDrop(e) {
  	const index = e.target.getAttribute('data-key')
    const commonList = [...this.commonList]
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    if (this.dragEl != e.target) {
    	this.commonList.splice(this.imgEdit.start.index, 1, this.commonList[index])
    	this.commonList.splice(index, 1, this.imgEdit.start.data)
    }
    return false
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}     [description]
   */
  handleImageMoveDrapend(e) {
  	Array.from(this.domLists).map(dom => {
  		dom.classList.remove('over')
      dom.style.opacity = '1'
      dom.classList.remove('draging')
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
  handleVideoChange(file) {}
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   视频上传进度
   * @return   {[type]}        [description]
   */
  handleVideoProgress(event) {
  	this.videoUpload.progress = parseInt(event.percent)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-30
   * @detail   视频上传失败
   * @return   {[type]}   [description]
   */
  handleVideoError(res) {
    console.log(res)
  }
   /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   视频上传成功
   * @return   {[type]}        [description]
   */
  handleVideoSuccess(res) {
  	this.videoUpload.infos = res.data[0]
    this.form.videos = res.data[0].id
    this.$message({showClose: true, message: '视频上传成功', type: 'success'})
    this.videoUpload.loading = false
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   图片上传之前做判断
   * @return   {[type]}   [description]
   */
  beforeVideoUpload(file) {
    const isLt200M = file.size / 1024 / 1024 > 200
    if(isLt200M) {
      this.$message.error('上传的视频大小限制是200MB~')
      return false
    }
    if(this.videoUpload.loading) {
      this.$message.error('视频正在上传，请勿重复提交~')
      return false
    }
    if(this.form.videos) {
      this.$message.error('视频只能上传一个，请删除后重试~')
      return false
    }
    if(this.currentUploadType && this.currentUploadType !== 'videoUpload') {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadTypeChange()
        this.currentUploadType = null
        this.setOtherDisabled('videoUpload')
      }).catch(() => {
        // nothing to do
      })
      return false
    } else {
      this.currentUploadType = 'videoUpload'
      this.videoUpload.show = true
      this.videoUpload.loading = true
      this.setOtherDisabled('videoUpload')
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   移除视频
   * @return   {[type]}   [description]
   */
  handleVideoRemove() {
    this.videoUpload.infos = {}
    this.form.videos = ''
    this.videoUpload.file = {}
    this.videoUpload.file = {}
    this.videoUpload.show = false
    this.currentUploadType = null
    this.setOtherEnabled()
    if(this.videoUpload.progress < 100) {
      this.$refs.video.abort()
      this.videoUpload.loading = false
    }
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
  handleCompressChange(file) {}
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
  handleCompressSuccess(res) {
    this.form.files = res.data[0].id
    this.$message({showClose: true, message: '文件上传成功', type: 'success'})
    this.compressUpload.loading = false
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   图片上传之前做判断
   * @return   {[type]}   [description]
   */
  beforeCompressUpload(file) {
    const isLt200M = file.size / 1024 / 1024 > 200
    if(isLt200M) {
      this.$message.error('上传的文件大小限制是200MB~')
      return false
    }
    if(this.compressUpload.loading) {
      this.$message.error('文件正在上传，请勿重复提交~')
      return false
    }
    if(this.form.files) {
      this.$message.error('文件只能上传一个，请删除后重试~')
      return false
    }
    const compress = compressExtS
    const doc = docExt
    if(compress.includes(this.getFileExt(file.name))) {
      this.compressUpload.params.attach_type = 'compress'
    }
    if(doc.includes(this.getFileExt(file.name))) {
      this.compressUpload.params.attach_type = 'doc'
    }
    if(this.currentUploadType && this.currentUploadType !== 'compressUpload') {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadTypeChange()
        this.currentUploadType = null
        this.setOtherDisabled('compressUpload')
      }).catch(() => {
        // nothing to do
      })
      return false
    } else {
      this.compressUpload.file = file
      this.compressUpload.show = true
      this.currentUploadType = 'compressUpload'
      this.setOtherDisabled('compressUpload')
      this.compressUpload.loading = true
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   获取文件后缀
   * @return   {[type]}        [description]
   */
  getFileExt(file) {
    return `.${file.split('.')[file.split('.').length - 1]}`
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   移除上传的文件
   * @return   {[type]}   [description]
   */
  handleRemoveCompress() {
  	this.compressUpload.show = false
  	this.compressUpload.file = {}
    this.form.files = ''
    this.currentUploadType = null
    this.setOtherEnabled()
    if(this.videoUpload.progress < 100) {
      this.$refs.file.abort()
      this.compressUpload.loading = false
    }
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-24
   * @detail   切换显示链接输入框
   * @return   {[type]}   [description]
   */
  switchLinkBox() {
    if(this.currentUploadType && this.currentUploadType !== 'link') {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadTypeChange()
        this.currentUploadType = null
        this.inputLink.show = !this.inputLink.show
      }).catch(() => {
        // nothing to do
      })
    } else {
      this.inputLink.show = !this.inputLink.show
      this.currentUploadType = 'link'
      if(this.inputLink.value) {
        this.form.urls = ''
      }
    }
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-29
   * @detail   移除链接
   * @return   {[type]}   [description]
   */
  handleRemoveLink() {
    this.form.urls = ''
    this.inputLink.show = false
    this.inputLink.value = ''
    this.currentUploadType = null
    this.setOtherEnabled()
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-27
   * @detail   确定选中邮箱
   * @return   {[type]}   [description]
   */
  confirmEmail() {
    const checkUrlReg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/ // 链接网址验证
    if(checkUrlReg.test(this.inputLink.value)) {
      this.form.urls = this.inputLink.value
      this.inputLink.show = !this.inputLink.show
    } else {
      this.$message.error('不是合法的链接~')
    }
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
    params.visible = params.visible === true ? 1 : 0
    if(!params.content.trim()) {
      this.$message.error('发布内容不能为空~')
      return
    }
  	this.postJobCircleNoteApi(params)
  			.then((res) => {
  				this.$message({
            message: `${res.data.msg}~`,
            type: 'success'
          })
          this.resetForm()
          lsCache.delete('editContent')
  			})
  			.catch(err => {
  				this.$message.error(`${err.msg}~`)
  			})
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   重置表单信息
   * @return   {[type]}   [description]
   */
  resetForm() {
    // 清空之前编辑的内容
    this.inputLink.value = ''
    this.compressUpload.file = {}
    this.compressUpload.show = false
    this.commonList = []
    this.videoUpload.show = false
    this.currentUploadType = null
    this.form = {
      community_id: null,
      content: '',
      visible: false,
      pictures: '',
      videos: '',
      files: '',
      urls: ''
    }
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
    // 如果有上传图片的话
    if(this.commonList.length) {
      let pictures  = this.commonList.map(field => field.id)
      formData.pictures = pictures
    }
    formData.community_id = this.currentJobCircleId
    return formData
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   获取dom的样式
   * @return   {[type]}        [description]
   */
  getDomStyle(dom, domAttr) {
    return dom.currentStyle ? dom.currentStyle[domAttr] : getComputedStyle(dom)[domAttr]
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   动态设置文本域的高度
   * @return   {[type]}   [description]
   */
  autoHeight(dom) {
    let lineHeight = parseInt(this.getDomStyle(dom, 'line-height'))
    let domHeight = parseInt(this.getDomStyle(dom, 'height'))
    let scrollHeight = dom.scrollHeight
    let rowNum = parseInt(domHeight / lineHeight)
    if(rowNum <= 20) {
      if(domHeight < scrollHeight) dom.style.height = scrollHeight + 'px'
    }
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-30
   * @detail   上传方式改变
   * @return   {[type]}   [description]
   */
  uploadTypeChange() {
    switch(this.currentUploadType) {
      case 'imageUpload':
        this.commonList = []
        break
      case 'compressUpload':
        this.form.files = ''
        this.compressUpload.file = {}
        this.compressUpload.show = false
        break
      case 'link':
        this.form.urls = ''
        this.inputLink.value = ''
        this.inputLink.show = false
        break
      case 'videoUpload':
        this.form.videos = ''
        this.videoUpload.file = {}
        this.videoUpload.show = false
        break
      default:
        break
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-30
   * @detail   清空之前的上传
   * @return   {[type]}   [description]
   */
  setOtherDisabled(type) {
    ['imageUpload', 'compressUpload', 'videoUpload'].map(field => this[field].disabled = type === field ? false : true)
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-30
   * @detail   清空之前的上传
   * @return   {[type]}   [description]
   */
  setOtherEnabled(type = '') {
    const currentUploadType = this.currentUploadType
    if(currentUploadType !== type && type) {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.uploadTypeChange()
        this.currentUploadType = type
        this.setOtherDisabled(type)
      }).catch(() => {
        // nothing to do
      })
    } else {
      ['imageUpload', 'compressUpload', 'videoUpload'].map(field => this[field].disabled = false)
    }
    if(type === 'imageUpload') {
      this.$message.error('一次发布最多只允许上传20张图片~')
    }
  }

  mounted() {
    const dom = this.$refs['note-content']
    dom.addEventListener('propertychange', () => { this.autoHeight(dom) })
    dom.addEventListener('keyup', () => {
      dom.removeAttribute('style')
      this.autoHeight(dom)
    })
    if(lsCache.get('editContent')) this.form.content = lsCache.get('editContent')
  }
}
</script>
<style lang="scss">
.comment-box {
	background: white;
	border-radius: 2px;
	padding: 16px;
	box-sizing: border-box;
  margin-bottom: 16px;
  .simple-text{
    overflow: hidden;
    position: relative;
    border-radius:4px;
    border:1px solid #EBEEF5;
    padding: 5px 5px 34px 5px;
    box-sizing: border-box;
    .limit-box {
      position: absolute;
      bottom: 10px;
      right: 8px;
      font-weight: 300;
      font-size: 14px;
      color: #BCBCBC;
    }
  }
	.note-content {
		width:100%;
		/*border-radius:4px;*/
		/*border:1px solid #EBEEF5;*/
		outline: unset;
    border: unset;
		overflow: hidden;
		line-height: 1.4;
    resize: none;
    box-sizing: border-box;
    padding: 0;
	}
	textarea::-webkit-input-placeholder{
    color: #BCBCBC;
    font-size: 12px;
    font-weight: 400;
	}

  .note-content::-webkit-scrollbar {
    width: 5px;
  }
  .note-content::-webkit-scrollbar-track {
    background-color:white;
    border-radius: 5px;
  }
  .note-content::-webkit-scrollbar-thumb {
    background-color:#BCBCBC;
    border-radius: 5px;
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
    i{
      font-weight: 500;
    }
	}
	.submit-setting {
		font-size:14px;
		font-weight:400;
		color:rgba(102,102,102,1);
		width: 230px;
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
			border-radius:4px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 8px;
      position: relative;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
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
  .link-infos {
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
      border-radius:4px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
      position: relative;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    .el-progress--circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
    }
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
      margin-bottom: 24px;
/*      &:nth-last-child(0) {
        margin-bottom: 0 !important;
      }
      &:nth-last-child(2) {
        margin-bottom: 0 !important;
      }
      &:nth-last-child(3) {
        margin-bottom: 0 !important;
      }
      &:nth-last-child(4) {
        margin-bottom: 0 !important;
      }
      &:nth-last-child(5) {
        margin-bottom: 0 !important;
      }*/
			img {
				width: 100%;
				height: 100%;
			}
      &:nth-child(5n) {
        margin-right: 0px;
      }
		}
    .upload-li {
      position: relative;
      box-sizing: border-box;
      border: dotted 1px #DCDCDC;
      background: white;
      > div {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      .el-upload {
        width: 100%;
        height: 100%;
      }
      .el-icon-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #DCDCDC;
        font-size: 24px;
      }
    }
    .draging{
      border: 1px red dotted;
      /*cursor: crosshair;*/
      /*background: white !important;*/
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
  .el-upload--picture-card:hover, .el-upload:focus {
    border-color: unset;
    color: #666666
  }
}
</style>