<template>
 	<section id="job-circle-update">
 		<header class="jobCircle-header">
 			<button @click="$router.back(-1)">
 				<i class="icon font_family icon-fanhui"></i> 返回
 			</button>
 		</header>
 		<main class="job-circle-content">
      <div class="form-header-name">工作圈设置</div>
 			<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <!-- 圈主修改工作圈 start -->
        <template v-if="jobcircleDetail.isOwner">
  			  <el-form-item label="工作圈名称" prop="name">
  			    <el-input v-model="form.name" style="width: 380px;"></el-input>
  			  </el-form-item>

  			   <!-- 头像设置 start-->
  			  <el-form-item
            label=" 工作圈封面"
            prop="check_cover_img_id"
            class="limit-width">

            <div class="img-box" v-if="form.cover_img_id.tem && !imageUpload.showError">
              <img :src="form.cover_img_id.tem" class="upload-cover">
            </div>
            <my-cropper
              :hasUploaded="imageUpload.hasUploaded"
              :btnTxt="imageUpload.btnTxt"
              :accept="imageUpload.accept"
              picShape="radiu"
              @success="imageUploadSuccess"
              @fail="imageUploadFail"
              />
            <div class="upload-error-tips" :class="{'upload-error-tips-show': imageUpload.showError}">
              <div class="tips">
                <p><i class="el-icon-error"></i></p>
                <p>上传失败</p>
              </div>
            </div>
            <div class="upload-image-tips">{{imageUpload.tips}}</div>
          </el-form-item>
          <!-- 头像设置 end -->

          <!-- 选择必修学员 -->
  	      <el-form-item
  	        label="选择必修学员"
  	        class="limit-width"
  	        >
  	          <div class="selected-item" v-show="form.members.show">
  	            <span
  	              @click="removeMultipleCheck(hIndex)"
  	              v-for="(hItem, hIndex) in form.members.tem"
  	              :key="hIndex">
  	                {{hItem.realname}}<i class="el-icon-close"></i>
  	            </span>
  	          </div>
  	          <el-button
  	            class="click-item"
  	            type="primary"
  	            :class="{'zike-btn-selected': form.members.show}"
  	            @click="openModal('members')">
  	              {{form.members.show ? '重新选择' : '点击选择'}}
  	          </el-button>
  	      </el-form-item>
          
          <el-form-item label="置顶该工作圈">
            <el-switch v-model="form.is_top"></el-switch>
          </el-form-item>
        </template>
        <!-- 圈主修改工作圈 end -->

        <!-- 圈内成员修改工作圈 start -->
        <template v-if="!jobcircleDetail.isOwner && jobcircleDetail.isMember">
          <el-form-item label="置顶该工作圈">
            <el-switch v-model="form.is_top"></el-switch>
          </el-form-item>
        </template>
        <!-- 圈内成员修改工作圈 end -->

        <!-- 非圈内成员修改工作圈 start -->
        <template v-if="!jobcircleDetail.isOwner && !jobcircleDetail.isMember">
          <el-form-item label="置顶该工作圈">
            <el-switch v-model="form.is_top"></el-switch>
          </el-form-item>
          <el-form-item label="关注该工作圈">
            <el-switch v-model="form.focus"></el-switch>
          </el-form-item>
        </template>
        <!-- 非圈内成员修改工作圈 end -->
			  <el-form-item>
			    <el-button type="primary" @click="preSubmit" class="form-submit-btn">保存</el-button>
			    <el-button @click="reset" class="form-reset-btn">取消</el-button>
			  </el-form-item>
			</el-form>
 		</main>
		  <modal-dialog
	    v-model="models.show"
	    :title="models.title"
	    :show-close="models.showClose"
	    :confirm-text="models.confirmText"
	    :type="models.type"
	    :width="models.width"
	    :min-height="models.minHeight"
	    @confirm="confirm"
	    @cancel="cancel"
	    >
	      <div slot="title" style="margin-left: 0px;">
	        <h3 class="dialog-title">
	          {{models.title}} 
	        </h3>
	      </div>
	      <div slot="customize-html">
	        <div class="customize-html-content">
	          <!-- 选择工作圈成员-start -->
	          <div class="menber-compulsory-type-list" v-if="models.currentModalName === 'members'">
	            <div style="margin: 30px 0;">
	              <search-bar
	                width="464px"
	                @search="handleSearch"
	                v-model="form.userName"
	                placeholder="请输入成员名称" />
	            </div>
	            <div class="group-list">
	              <button
	                class="common-btn"
	                v-for="(groupItem, groupIndex) in groupLists"
	                :key="groupIndex"
	                :class="{'common-btn-active': groupItem.active}"
	                @click="filterMenber(groupItem)">
	                {{groupItem.groupName}}
	              </button>
	            </div>
	            <div class="menber-list limit-menber-height">
	              <div
	                v-for="(memberItem, memberIndex) in memberLists"
	                :key="memberIndex"
	                @click="multipleSelection(memberItem, memberIndex)"
	                :class="{'common-checkbox-active': memberItem.active}"
	                class="common-checkbox">
	                <i class="icon font_family icon-check-circle" v-show="memberItem.active"></i>
	                <i class="icon font_family icon-radio_selected" v-show="!memberItem.active"></i>
	                <span>{{memberItem.realname}}</span>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	  </modal-dialog>
 	</section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ModalDialog from 'COMPONENTS/dialog/index.vue'
import MyCropper from 'COMPONENTS/cropper/index.vue'
import SearchBar from 'COMPONENTS/searchBar/index.vue'

@Component({
	components: {
    ModalDialog,
    MyCropper,
    SearchBar
  },
  methods: {
		...mapActions([
			'getJobcircleDetailApi',
			'getMemberListsApi',
			'getGroupListsApi',
			'classifyMemberListsByGroupIdApi',
			'updateMemberListsApi',
      'putJobCircleIdentityOfOwnerApi',
      'putJobCircleIdentityOfUnMemberApi',
      'putJobCircleIdentityOfMemberApi',
      'getJobCircleMemberListsApi',
      'getJobCircleMemberHitListsApi'
		])
	},
	computed: {
    ...mapGetters([
      'jobcircleDetail',
      'memberLists',
      'groupLists',
      'jobCircleMemberLists',
      'jobCircleMemberHitLists'
    ])
  }
})
export default class PageJobCircleUpdate extends Vue {
	// 图片上传
  imageUpload = {
    list:[],
    hasUploaded: false,
    btnTxt: '上传封面',
    tips: '建议尺寸160X160px ，JPG、PNG格式，图片小于5M',
    showError: false,
    accept: '.jpeg, .png, .jpg'
  }

  apiLists = {
    owner: 'putJobCircleIdentityOfOwnerApi',
    menber: 'putJobCircleIdentityOfMemberApi',
    unmember: 'putJobCircleIdentityOfMemberApi'
  }

	form = {
    id: null,
		userName: '',
    name: '',
    check_cover_img_id: '',
    cover_img_id: {
      tem: '',
      showError: false,
      value: ''
    },
    members: {
      value: [],
      tem: [],
      show: false,
      noEdit: {
        value: [],
        tem: [],
        show: false
      }
    },
    is_top: false
  }
  rules = {
    name: [
      { required: true, message: '请输入工作圈名称', trigger: 'blur' }
    ],
    check_cover_img_id: [
      { required: true, message: '请上传工作圈封面图片', trigger: 'blur' }
    ]
  }

  // 确认信息弹窗
  models = {
    show: false,
    title: '提示',
    showClose: true,
    confirmText: '提交',
    currentModalName: '',
    type: 'confirm',
    editType: 'tutor',
    isSearch: false
  }
  created() {
    const id = this.$route.query.id
    const params = {id}
    Promise.all(
      [
        this.getMemberListsApi(),
        this.getGroupListsApi(),
        this.getJobcircleDetailApi(params),
        this.getJobCircleMemberListsApi(params),
        this.getJobCircleMemberHitListsApi(params)
      ]
    )
    .then((res) => {
      this.form.id = id
      this.form.cover_img_id.value = this.jobcircleDetail.coverImgId
      this.form.check_cover_img_id = this.jobcircleDetail.coverImgId
      this.form.cover_img_id.tem = this.jobcircleDetail.coverImg.smallUrl
      this.form.name = this.jobcircleDetail.name
      this.form.is_top = this.jobcircleDetail.isTop
      this.form.focus = this.jobcircleDetail.isAttention
      this.imageUpload.hasUploaded = true
      this.imageUpload.btnTxt = '重新上传'
      this.jobCircleMemberLists.map(field => {
        this.form.members.value.push(field.uid)
        this.form.members.tem.push(field)
        this.form.members.show = true
        this.form.members.noEdit.value.push(field.uid)
        this.form.members.noEdit.tem.push(field)
        this.form.members.noEdit.show = true
      })
      this.form.members.value = this.form.members.value.join(',')
      this.form.members.noEdit.value = this.form.members.noEdit.value.join(',')
    })
    .catch((err) => {
      this.$message.error('初始化页面失败~')
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-26
   * @detail   detail
   * @return   {[type]}   [description]
   */
  preSubmit() {
    this.$refs['form'].validate((valid) => {
      if (valid) {
        const ownerNeed = ['name', 'cover_img_id', 'is_top', 'id', 'members']
        const menberNeed = ['is_top', 'id']
        const unmemberNeed = ['is_top', 'id', 'focus']
        const action = this.jobcircleDetail.isOwner ? this.apiLists['owner'] : this.jobcircleDetail.isMember ? this.apiLists['menber'] : this.apiLists['unmenber']
        const need = this.jobcircleDetail.isOwner ? ownerNeed : this.jobcircleDetail.isMember ? menberNeed : unmemberNeed
        const params = this.transformData(this.form, need)
        params.is_top = params.is_top ? 1 : 0
        params.focus = params.focus ? 1 : 0
        this.submit(params, action)
      }
    })
  }
  submit(params, action) {
    this[action](params)
        .then(res => {
          this.$message({
            message: `${res.data.msg}~`,
            type: 'success'
          })
        })
        .catch(err => {
          this.$message.error(`${err.msg}~`)
        })
  }
  reset() {
    this.$refs['form'].resetFields()
  }
  /**
   * @Author   小书包
   * @DateTime 2018-09-12
   * @detail   获取提交参数
   * @return   {[type]}   [description]
   */
  transformData(data, params) {
    const formData = {}
    params.map(field => {
      if(typeof data[field] != 'object') {
        formData[field] = data[field]
      } else {
        formData[field] = data[field].value
      }
    })
    return formData
  }
  /**
   * @Author   小书包
   * @DateTime 2018-09-29
   * @detail   图片上传成功
   * @return   {[type]}       [description]
   */
  imageUploadSuccess(res) {
    this.form.avatarId = res.id
    this.form.cover_img_id.tem = res.url
    this.form.cover_img_id.value = res.id
    this.form.check_cover_img_id = res.id
    this.imageUpload.hasUploaded = true
    this.imageUpload.btnTxt = '重新上传'
    this.imageUpload.showError = false
  }

  /**
   * @Author   小书包
   * @DateTime 2018-09-29
   * @detail   图片上传是被
   * @return   {[type]}       [description]
   */
  imageUploadFail(res) {
    this.imageUpload.status = 'error'
    this.imageUpload.hasUploaded = false
    this.imageUpload.btnTxt = '重新上传'
    this.imageUpload.showError = true
    if(Object.prototype.toString.call(res) === '[object String]') {
      this.$message.error(`${res}~`)
    } else {
      this.$message.error(`${res.msg}~`)
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2018-09-11
   * @detail   移除多选
   */
  removeMultipleCheck(index, item) {
    let tem = this.form['members'].value.split(',')
    tem.splice(index, 1)
    this.form['members'].tem.splice(index, 1)
    this.form['members'].value = tem.join(',') ? tem.join(',') : []
    this.form['members'].show = this.form['members'].tem <= 0 ? false : true
    this.form['members'].noEdit.show = this.form['members'].show
    this.form['members'].noEdit.tem = this.form['members'].tem
    this.form['members'].noEdit.value = this.form['members'].value
    if(this.form.members.tem.length <= 0) {
      this.form.members.noEdit.value = []
      this.form.members.noEdit.tem = []
      this.form.members.noEdit.show = false
      this.updateMenberListsAllApi({bool: false})
    }
  }

  /**
   * @Author   小书包
   * @DateTime 2018-09-11
   * @detail   打开弹窗model
   */
  openModal(type) {
    this.models.currentModalName = type
    this.models.width = '860px'
    this.models.minHeight = '284px'
    this.models.show = true
    this.models.title = '选择成员'
  }
  confirm() {
  	let list = []
  	const data = { show: true, tem: [], value: [] }
    list = this.memberLists.filter(field => field.active)
    // 去除与圈主重复的成员
    list = list.filter(field => field.uid !== this.jobcircleDetail.ownerUid)

    this.form.members.noEdit.tem.map(field => {
        data.value.push(field.uid)
        data.tem.push(field)
    })

    list.map(field => {
    	if(!data.value.includes(field.uid)) {
	      data.value.push(field.uid)
	      data.tem.push(field)
	    }
    })

    // 重新清空选择
    if(!list.length) {
      data.show = false
      data.tem = []
      data.value = []
    }
    data.value = data.value.join(',')
    data.show = list.length > 0 ? true : false
    this.form.members = Object.assign(this.form.members, data)
    this.form.members.noEdit = data
    delete this.form.members.noEdit.noEdit
    this.models.show = false
  }
  cancel() {
    this.models.show = false
    this.form['members'].value = this.form['members'].noEdit.value
    this.form['members'].tem = this.form['members'].noEdit.tem
    this.form['members'].show = this.form['members'].noEdit.show
  }
  /**
   * @Author   小书包
   * @DateTime 2018-09-17
   * @detail   搜索成员
   * @return   {[type]}   [description]
   */
  handleSearch() {}
  /**
   * @Author   小书包
   * @DateTime 2018-09-10
   * @detail   多选
   */
  multipleSelection(item, index) {
    this.updateMemberListsApi({ index })
  }

  /**
   * @Author   小书包
   * @DateTime 2018-09-10
   * @detail  分类获取成员数据
   * @return   {[type]}      [description]
   */
  filterMenber(item) {
    this.classifyMemberListsByGroupIdApi({groupId: item.groupId, bool: item.active})
  }
}
</script>
<style lang="scss">
#job-circle-update {
	background: white;
  .form-header-name {
    font-size:20px;
    font-weight:500;
    color:rgba(53,64,72,1);
    line-height:1;
    margin-bottom: 40px;
  }
	.jobCircle-header {
		height:68px;
		background:rgba(255,255,255,1);
		box-shadow:0px 1px 0px 0px rgba(235,238,245,1);
		line-height: 68px;
		button {
			display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    cursor: pointer;
	    background: transparent;
	    border: unset;
	    color: #606266;
	    -webkit-appearance: none;
	    text-align: center;
	    box-sizing: border-box;
	    outline: none;
	    margin: 0;
	    transition: .1s;
	    font-weight: 500;
	    -moz-user-select: none;
	    -webkit-user-select: none;
	    -ms-user-select: none;
	    padding: 12px 20px;
	    font-size: 14px;
	    border-radius: 4px;
	    vertical-align: middle;
		}
	}
	.job-circle-content {
		padding: 24px 24px 120px 24px;
	}
	.upload-error-tips {
	  width:0;
	  height:0;
	  background:rgba(237,237,237,1);
	  border-radius:4px;
	  vertical-align: middle;
	  margin-right: 16px;
	  transition: all ease .4s;
	  position: relative;
	  margin: 16px 0;
	  transform: scale(0);
	  transform-origin: 100% 100%;
	  .tips {
	    position: absolute;
	    left: 0;
	    top: 50%;
	    width: 100%;
	    transform: translateY(-50%);
	    font-size: 12px;
	    color:rgba(146,146,146,1);
	  }
	  p {
	    line-height: 1.5;
	    margin: 0;
	    text-align: center;
	    width: 100%;
	  }
	}
	.upload-error-tips-show {
	  transform: scale(1);
	  width:96px;
	  height:96px;
	}
	.img-box {
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    background: #EDEDED;
    .upload-cover {
      width:96px;
      height:96px;
      border-radius:4px;
      display: block;
    }
  }
  .selected-item {
    font-size: 12px;
    font-weight: 400;
    color: rgba(146,146,146,1);
    line-height: 40px;
    margin-bottom: 6px;
    overflow: hidden;
    span {
      background:rgba(248,248,248,1);
      border-radius:4px;
      border:1px solid rgba(220,220,220,1);
      display: inline-block;
      line-height: 1;
      padding: 4px 8px;
      font-size: 12px;
      color:rgba(0,0,0,0.65);
      margin-right: 8px;
      i{
        margin-left: 5px;
      }
    }
  }
  .zike-btn-active {
    color: rgb(230, 203, 92);
    border-color: rgb(230, 203, 92); 
    outline: 0;
    background-color: rgb(255, 252, 240);
  }
  .zike-btn-selected {
    background:rgba(237,237,237,1);
    border-radius:4px;
    font-size:14px;
    font-weight:400;
    color:#929292 !important;
    border-color: rgba(237,237,237,1);
  }
  .zike-btn-active-selected {
    background:rgba(255,226,102,0.2);
    border-radius:4px;
    font-size:14px;
    font-weight:400;
    color:#D7AB70;
    border-color: #EDEDED;
  }
  .common-btn {
    display: inline-block;
    line-height: 1;
    cursor: pointer;
    border: 1px solid #DCDCDC;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #354048;
    background-color: transparent;
    color: #354048;
    margin-right: 8px;
    min-width: 128px;
    outline: unset;
    margin: 0px 16px 16px 0px;
    border-radius: 4px;
    &:hover{
      /*background: rgba(255, 226, 102, 0.2);*/
      /*font-size: 14px;*/
      /*font-weight: 400;*/
      /*color: #D7AB70;*/
      /*border-color: #EDEDED;*/
    };
  }
  .common-btn-active {
    background: rgba(255, 226, 102, 0.2);
    font-size: 14px;
    font-weight: 400;
    color: #D7AB70;
    border-color: #D7AB70;
  }

  .common-checkbox {
    font-size:14px;
    font-weight:400;
    color:rgba(102,102,102,1);
    display: inline-block;
    margin: 10px 30px 10px 0px;
    cursor: pointer;
    i{
      padding-right: 10px;
      font-size: 14px;
    }
    span{
      min-width: 70px;
      display: inline-block;
    }
  }
  .common-checkbox-active{
    font-size:14px;
    font-weight:400;
    color:rgba(215,171,112,1);
  }
  .upload-image-tips {
    font-size:12px;
    font-weight:400;
    color:rgba(188,188,188,1);
    line-height:1;
  }
}
</style>