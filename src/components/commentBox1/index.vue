<template>
	<section class="comment-box" style="width: 580px;">
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
					<div class="active-line" :style="`width: ${compressUpload.uploadProgress}%`"></div>
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
			<div class="btn-click" v-if="form.videos"><i class="icon font_family icon-play"></i></div>
      <el-progress type="circle" :percentage="videoUpload.uploadProgress" :stroke-width="2" :width="46" v-if="videoUpload.uploadProgress < 100"></el-progress>
			<video :src="form.videos" v-if="form.videos"> your browser does not support the video tag </video>
		</div>
		<ul class="common-list" v-if="commonList.length">
			<li
        v-for="(imageItem, imageIndex) in commonList"
        :key="imageIndex"
        :data-key="imageIndex"
        class="draggable"
        :style="`background-image: url(${imageItem.base64Src}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
        draggable="true">
				<span class="btn-close" @click="handleRemoveUploadImage(imageIndex)"><i class="icon font_family icon-icon_errorsvg"></i></span>
				<el-progress type="circle" :percentage="imageItem.uploadProgress" :stroke-width="2" :width="46" v-if="imageItem.uploadProgress !== 100"></el-progress>
			</li>
      <li class="upload-li" v-if="commonList.length < 20" @click="handleChooseImage">
        <i class="el-icon-plus"></i>
        <input type="file" multiple="multiple" @change="handleChangeImage" style="display: none;" id="image" name="image" accept="image/*" />
      </li>
		</ul>
		<div class="comment-controlls-box">
			<ul class="controlls-list">
        <!-- 上传图片 start -->
				<li @click="handleChooseImage">
					<i class="icon font_family icon-btn_photo"></i>图片
          <input type="file" multiple="multiple" @change="handleChangeImage" style="display: none;" id="image" name="image" :accept="imageUpload.accept" />
				</li>
        <!-- 上传图片 end -->

        <!-- 上传视频 start -->
        <li @click="handleChooseVideo">
          <i class="icon font_family icon-btn_video"></i>视频
          <input type="file" @change="handleChangeVideo" style="display: none;" id="video" name="video" :accept="videoUpload.accept" />
        </li>
        <!-- 上传视频 start -->

        <!-- 上传文件 start -->
        <li @click="handleChooseCompress">
          <i class="icon font_family icon-btn_doc"></i>文件
          <input type="file" @change="handleChangeCompress" style="display: none;" id="compress" name="compress" :accept="compressUpload.accept" />
        </li>
        <!-- 上传文件 start -->

        <!-- 上传链接 start -->
        <li @click="handleInputLink"><i class="icon font_family icon-btn_link"></i> 链接</li>
        <!-- 上传链接 start -->
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
import Cookies from 'js-cookie'

@Component({
	name: 'comment-box',
	methods: {
		...mapActions([
			'uploadAttachesApi',
			'postJobCircleNoteApi'
		])
	},
  props: {
    isNewJobCircle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'currentJobCircleId'
    ])
  },
  watch: {
    '$route': {
      handler() {
        const jobCircleId = this.$route.query.id
        this.form.content = jobCircleId !== lsCache.get('jobCircleId') ? '' : lsCache.get('editContent')
        this.removeBeforeUpload()
      },
      immediate: true
    },
    'form.content': {
      handler(content) {
        this.$emit('input', content)
      },
      immediate: true
    }
  }
})
export default class ComponentCommentBox extends Vue {
  currentUploadType = null
	imgEdit = {
		start: {index: null, data: null},
		end: {index: null, data: null}
	}

	commonList = []
	domLists = null
	dragEl = null
  formData = null
  xhr = null

	// 图片上传
  imageUpload = {
    limit: 20,
    accept: 'image/*'
  }

  // 视频上传
  videoUpload = {
  	show: false,
    accept: '.avi,.rmvb,.rm,.mov,.mpg,.mpeg,.swf,.flv,.mp4,.3gp,.asf,.f4v,.webm,.wmv',
    file: {},
    uploadProgress: 0
  }

  // 文件上传
  compressUpload = {
  	show: false,
    accept: [...docExt, ...compressExtS].join(','),
    file: {},
    uploadProgress: 0
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
   * @DateTime 2018-12-03
   * @detail  点击选择图片
   * @return   {[type]}   [description]
   */
  handleChooseImage() {
    this.inputLink.show = false
    if(this.currentUploadType && this.currentUploadType !== 'Image') {
      this.$confirm('该操作会替换已上传的文件, 是否继续?', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.currentUploadType = 'Image'
        this.form.videos = ''
        this.removeBeforeUpload()
        document.querySelector('#image').click()
        document.querySelector('#image').value = ''
        if(this.xhr) this.handleAbortUpload()
      }).catch(() => {
        // nothing to do
      })
    } else {
      if(this.commonList.length === this.imageUpload.limit) {
        this.$message.error('一次发布最多只允许上传20张图片~')
        return
      }
      document.querySelector('#image').click()
      document.querySelector('#image').value = ''
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   处理选中的图片
   * @return   {[type]}   [description]
   */
  handleChangeImage() {
    this.formData = new FormData()
    this.files = document.querySelector('#image').files
    this.currentUploadType = 'Image'
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
        if(this.commonList.length === this.imageUpload.limit) return
        this.commonList.push(data)
        this.handleImageRange()
      }
      // 读取完成，无论成功失败
      reader.onloadend = (res) => {}
      this.formData.append('img1', file)
      this.formData.append('attach_type', 'img')
      if(this.commonList.length === this.imageUpload.limit) return
      this.handleUploadImage()
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   上传选中的图片
   * @return   {[type]}         [description]
   */
  handleUploadImage() {
    this.xhr = new XMLHttpRequest()
    this.xhr.open('post', upload_api, true)
    this.xhr.setRequestHeader('Authorization', getAccessToken())
    this.xhr.setRequestHeader('Authorization-Sso', Cookies.get('Authorization-Sso'))
    // 上传成功
    this.xhr.onload = (res) => {
      // 上传图片返回的数据
      const imageItem = JSON.parse(res.target.responseText).data[0]
      this.commonList.map(field => {
        if(field.name === imageItem.fileName) field = Object.assign(field, imageItem)
      })
      this.commonList.map(field => field.uploadProgress = 100)
    }
    // 上传失败
    this.xhr.onerror = (res) => {}
    // 上传进度
    this.xhr.upload.onprogress = (res) => {
      this.commonList[this.commonList.length - 1].uploadProgress = Math.round(res.loaded / res.total * 100) - 1
    }
    this.xhr.send(this.formData)
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
   * @DateTime 2018-12-03
   * @detail  点击选择视频
   * @return   {[type]}   [description]
   */
  handleChooseVideo() {
    this.inputLink.show = false
    if(this.form.videos) {
      this.$confirm('该操作会替换已上传的视频, 是否继续?', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.form.videos = ''
        this.removeBeforeUpload()
        document.querySelector('#video').click()
        document.querySelector('#video').value = ''
        if(this.xhr) this.handleAbortUpload()
      }).catch(() => {
        // nothing to do
      })
    } else {
      if(this.currentUploadType && this.currentUploadType !== 'Video') {
        this.$confirm('该操作会替换已上传的文件, 是否继续?', '确认提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.currentUploadType = 'Video'
          this.form.videos = ''
          this.removeBeforeUpload()
          document.querySelector('#video').click()
          document.querySelector('#video').value = ''
          if(this.xhr) this.handleAbortUpload()
        }).catch(() => {
          // nothing to do
        })
      } else {
        document.querySelector('#video').click()
        document.querySelector('#video').value = ''
      }
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   处理选中的视频
   * @return   {[type]}   [description]
   */
  handleChangeVideo() {
    this.formData = new FormData()
    this.currentUploadType = 'Video'
    this.files = document.querySelector('#video').files[0]
    this.formData.append('img1', this.files)
    this.formData.append('attach_type', 'video')
    this.handleUploadVideo()
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   上传选中的视频
   * @return   {[type]}         [description]
   */
  handleUploadVideo(index) {
    this.videoUpload.show = true
    this.videoUpload.uploadProgress = 0
    this.xhr = new XMLHttpRequest()
    this.xhr.open('post', upload_api, true)
    this.xhr.setRequestHeader('Authorization', getAccessToken())
    this.xhr.setRequestHeader('Authorization-Sso', Cookies.get('Authorization-Sso'))
    // 上传成功
    this.xhr.onload = (res) => {
      // 上传视频返回的数据
      const videoItem = JSON.parse(res.target.responseText).data[0]
      this.videoUpload.infos = videoItem
      this.form.videos = videoItem.id
      this.$message({showClose: true, message: '视频上传成功', type: 'success'})
      this.videoUpload.uploadProgress = 100
    }
    // 上传失败
    this.xhr.onerror = (res) => {}
    // 上传进度
    this.xhr.upload.onprogress = (res) => {
      this.videoUpload.uploadProgress = Math.round(res.loaded / res.total * 100) - 1
    }
    this.xhr.send(this.formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   取消上传文件
   * @return   {[type]}       [description]
   */
  handleAbortUpload(res) {
    this.xhr.abort()
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-28
   * @detail   移除上传的视频
   * @return   {[type]}   [description]
   */
  handleVideoRemove() {
    this.form.videos = ''
    this.videoUpload.file = {}
    this.videoUpload.show = false
    this.currentUploadType = null
    if(this.videoUpload.uploadProgress < 100) this.xhr.abort()
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail  点击选择图片
   * @return   {[type]}   [description]
   */
  handleChooseCompress() {
    this.inputLink.show = false
    // 已经上传了文件
    if(this.form.files) {
      this.$confirm('该操作会替换已上传的文件, 是否继续?', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.form.files = ''
        this.removeBeforeUpload()
        document.querySelector('#compress').click()
        document.querySelector('#compress').value = ''
        if(this.xhr) this.handleAbortUpload()
      }).catch(() => {
        // nothing to do
      })
    } else {

      // 已经选择了其他的发布类型
      if(this.currentUploadType && this.currentUploadType !== 'Compress') {
        this.$confirm('该操作会替换已上传的文件, 是否继续?', '确认提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.form.files = ''
          this.currentUploadType = 'Compress'
          this.removeBeforeUpload()
          document.querySelector('#compress').click()
          document.querySelector('#compress').value = ''
          if(this.xhr) this.handleAbortUpload()
        }).catch(() => {
          // nothing to do
        })
      } else {
        document.querySelector('#compress').click()
        document.querySelector('#compress').value = ''
      }
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   处理选中的文件
   * @return   {[type]}   [description]
   */
  handleChangeCompress() {
    this.formData = new FormData()
    this.files = document.querySelector('#compress').files[0]
    this.formData.append('img1', this.files)
    this.formData.append('attach_type', 'compress')
    this.compressUpload.file = this.files
    this.handleUploadCompress()
    this.currentUploadType = 'Compress'
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   上传选中的文件
   * @return   {[type]}         [description]
   */
  handleUploadCompress(index) {
    this.compressUpload.show = true
    this.compressUpload.uploadProgress = 0
    this.xhr = new XMLHttpRequest()
    this.xhr.open('post', upload_api, true)
    this.xhr.setRequestHeader('Authorization', getAccessToken())
    this.xhr.setRequestHeader('Authorization-Sso', Cookies.get('Authorization-Sso'))
    // 上传成功
    this.xhr.onload = (res) => {
      // 上传视频返回的数据
      this.form.files = JSON.parse(res.target.responseText).data[0].id
      this.$message({showClose: true, message: '文件上传成功', type: 'success'})
      this.compressUpload.uploadProgress = 100
    }
    // 上传失败
    this.xhr.onerror = (res) => {}
    // 上传进度
    this.xhr.upload.onprogress = (res) => {
      this.compressUpload.uploadProgress = Math.round(res.loaded / res.total * 100) - 1
      console.log(this.compressUpload.uploadProgress)
    }
    this.xhr.send(this.formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   取消上传文件
   * @return   {[type]}       [description]
   */
  handleAbortCompress(res) {
    this.xhr.abort()
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
    if(this.videoUpload.uploadProgress < 100) this.xhr.abort()
  }

  /**
   * @Author   小书包
   * @DateTime 2018-11-24
   * @detail   切换显示链接输入框
   * @return   {[type]}   [description]
   */
  handleInputLink() {
    if(this.currentUploadType && this.currentUploadType !== 'Link') {
      this.$confirm('你上传的文件将会清除，确定切换吗？', '确认提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.removeBeforeUpload()
        this.inputLink.show = !this.inputLink.show
        if(this.xhr) this.handleAbortUpload()
      }).catch(() => {
        // nothing to do
      })
    } else {
      this.inputLink.show = !this.inputLink.show
      if(this.inputLink.value) this.form.urls = ''
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
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   移除之前上传的文件
   * @return   {[type]}   [description]
   */
  removeBeforeUpload() {
    this.form.urls = ''
    this.form.videos = ''
    this.form.files = ''
    this.form.pictures = ''
    this.commonList = []
    this.compressUpload.show = false
    this.compressUpload.file = {}
    this.videoUpload.show = false
    this.videoUpload.file = {}
    this.inputLink.show = false
    this.inputLink.value = ''
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
      this.currentUploadType = 'Link'
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
          // window.location.reload()
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
   * @DateTime 2018-12-03
   * @detail   dom树构建完成
   * @return   {[type]}   [description]
   */
  mounted() {
    const dom = this.$refs['note-content']
    const jobCircleId = this.$route.query.id
    this.form.content = jobCircleId !== lsCache.get('jobCircleId') ? '' : lsCache.get('editContent')
    dom.addEventListener('propertychange', () => { this.autoHeight(dom) })
    dom.addEventListener('keyup', () => {
      dom.removeAttribute('style')
      this.autoHeight(dom)
    })
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