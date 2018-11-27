<template>
 <div id="index">
 	<div class="col-aside-left">
 		<div class="navigation-box">
 			<h2
 				:class="{'slide-down-active': attentionsJobcircle.active}"
 				@click="command({show: 'attentionsJobcircle', hide: 'allVisibleJobcircle'})">
	 				{{attentionsJobcircle.name}}
	 				<span class="icon">
	 					<i class="el-icon-caret-top"></i>
	 				</span>
 			</h2>
 			<ul :class="{'show-slide-down': attentionsJobcircle.active}">
 				<li
 					v-for="(attentionsJobcircleItem, attentionsJobcircleIndex) in attentionsJobcircle.list"
 					:key="attentionsJobcircleIndex"
 					@click="getActiveJobCircleInfos({show: 'attentionsJobcircle', hide: 'allVisibleJobcircle', index: attentionsJobcircleIndex})"
 					:class="{'router-active': attentionsJobcircleItem.active}">
 						<div class="icon-box">
 							<img :src="attentionsJobcircleItem.coverImg.smallUrl" alt="">
 							<span class="is-top" v-if="attentionsJobcircleItem.isTop"></span>
 						</div>
 						<p>{{attentionsJobcircleItem.name}}</p>
 					</li>
 			</ul>
 		</div>
 		<div class="navigation-box">
 			<h2
 				:class="{'slide-down-active': allVisibleJobcircle.active}"
 				@click="command({show: 'allVisibleJobcircle', hide: 'attentionsJobcircle'})">
	 				{{allVisibleJobcircle.name}}
	 				<span class="icon">
	 					<i class="el-icon-caret-top"></i>
	 				</span>
 			</h2>
 			<ul :class="{'show-slide-down': allVisibleJobcircle.active}">
 				<li
 					v-for="(allVisibleJobcircleItem, allVisibleJobcircleIndex) in allVisibleJobcircle.list"
 					:key="allVisibleJobcircleIndex"
 					@click="getActiveJobCircleInfos({show: 'allVisibleJobcircle', hide: 'attentionsJobcircle', index: allVisibleJobcircleIndex})"
 					:class="{'router-active': allVisibleJobcircleItem.active}">
 						<div class="icon-box">
 							<img :src="allVisibleJobcircleItem.coverImg.smallUrl" alt="">
 							<span class="is-top" v-if="allVisibleJobcircleItem.isTop"></span>
 						</div>
 						<p>{{allVisibleJobcircleItem.name}}</p>
 					</li>
 			</ul>
 		</div>
 	</div>
 	<div class="col-daptive">
 		<comment-box v-if="jobcircleDetail.isOwner || jobcircleDetail.isMember"></comment-box>
 		<div class="content-header">
 			<ul class="common-tab-box">
 				<li :class="{'tab-active': tabIndex === 'Pictures'}" @click="tabClick('Pictures')">相册</li>
 				<li :class="{'tab-active': tabIndex === 'Files'}" @click="tabClick('Files')">文件</li>
 				<li :class="{'tab-active': tabIndex === 'Urls'}" @click="tabClick('Urls')">链接</li>
 			</ul>
 			<div class="search">
 				<div class="common-search-box">
	 				<input type="text" v-model="keyWord" placeholder="搜索文件名称或关键词">
	 				<span class="search-button" @click.stop="toSearch"><i class="el-icon-search"></i></span>
	 			</div>
	 			<el-popover
			    placement="bottom-end"
			    title="高级搜索"
			    width="432"
			    trigger="manual"
			    v-model="visible"
			    >
			    <el-button slot="reference" @click.native="visible = !visible">
			    	<div class="more">
			 				<i class="icon font_family icon-shaixuan"></i>
			 				<span>更多</span>
			 			</div>
			    </el-button>
			    <slot>
						<adSearch :id="currentJobCircleId" @closePopover="visible = !visible"></adSearch>
			    </slot>
			  </el-popover>
 			</div>
 		</div>
 		<div class="content">
 			<div class="month">
	 			<div class="common-ul" v-show="tabIndex === 'Pictures'">
	 				<template v-for="(affixItem, affixIndex) in picList">
	 					<div class="monthTitle" v-if="affixIndex === 0 || (affixIndex > 1 && picList[affixIndex-1].month !== affixItem.month)"><i class="icon font_family icon-riqi"></i> {{affixItem.month}}</div>
		 				<picOrVideo class="picOrVideo" :key="affixIndex" :fileData="affixItem" @click.native="openPreview(affixItem, affixIndex)"></picOrVideo>
	 				</template>
	 				<div class="loadMore">
		 				<loadMore @loadMore="loadMore" :status="picsStatus" :list="picList"></loadMore>
		 			</div>
	 			</div>
	 			<div class="common-ul" v-show="tabIndex === 'Files'">
	 				<template v-for="(affixItem, affixIndex) in fileList">
	 					<div class="monthTitle" v-if="affixIndex === 0 || (affixIndex > 1 && fileList[affixIndex-1].month !== affixItem.month)"><i class="icon font_family icon-riqi"></i> {{affixItem.month}}</div>
		 				<div class="common-li">
		 					<div class="inner">
			 					<div class="li-header">
			 						<div class="img-box">
			 							<img :src="affixItem.avatarInfo.smallUrl" alt="">
			 						</div>
			 						<p class="user-name">{{affixItem.realname}}</p>
			 						<time>{{affixItem.createdDay}}</time>
			 					</div>
			 					<fileBox :fileData="affixItem"></fileBox>
		 					</div>
		 				</div>
	 				</template>
	 				<div class="loadMore">
		 				<loadMore @loadMore="loadMore" :status="filesStatus" :list="fileList"></loadMore>
		 			</div>
	 			</div>
	 			<div class="common-ul" v-show="tabIndex === 'Urls'">
	 				<template v-for="(affixItem, affixIndex) in linkList">
	 					<div class="monthTitle" v-if="affixIndex === 0 || (affixIndex > 1 && linkList[affixIndex-1].month !== affixItem.month)"><i class="icon font_family icon-riqi"></i> {{affixItem.month}}</div>
		 				<div class="common-li">
		 					<div class="inner">
			 					<div class="li-header">
			 						<div class="img-box">
			 							<img :src="affixItem.avatarInfo.smallUrl" alt="">
			 						</div>
			 						<p class="user-name">{{affixItem.realname}}</p>
			 						<time>{{affixItem.createdDay}}</time>
			 					</div>
			 					<fileBox :fileData="affixItem"></fileBox>
		 					</div>
		 				</div>
	 				</template>
	 				<div class="loadMore">
		 				<loadMore @loadMore="loadMore" :status="linksStatus" :list="linkList"></loadMore>
		 			</div>
	 			</div>
 			</div>
 		</div>
 	</div>
 	<div class="col-aside-right">
 		<div class="work-circle-infos">
	 		<div class="img-box">
	 			<img :src="jobcircleDetail.coverImg.middleUrl" alt="">
	 		</div>
	 		<p class="work-name">{{jobcircleDetail.name}}</p>
	 		<div class="avatar-box" v-if="jobcircleDetail.memberInfo.length">
	 			<div v-for="(memberItem, memberIndex) in jobcircleDetail.memberInfo" :key="memberIndex">
	 				<img :src="memberItem.avatarInfo.smallUrl" alt="">
	 			</div>
	 			<div class="gray" v-if="jobcircleDetail.memberInfo.length > 2"><i></i><i></i><i></i></div>
	 		</div>
	 		<p class="together-work-in">{{jobcircleDetail.memberCount ? `${jobcircleDetail.memberCount}人和你一起工作` : ''}}</p>
	 		<template v-if="!jobcircleDetail.isOwner && !jobcircleDetail.isMember">
	 			<button class="attention-button" v-if="!jobcircleDetail.isAttention" @click="todoAction('focus')"> + 关注 </button>
	 			<button class="attentioned-button" v-if="jobcircleDetail.isAttention" @click="todoAction('unfocus')"> 已关注 </button>
			</template>
			<template v-if="!jobcircleDetail.isOwner && jobcircleDetail.isAttention">
	 			<button class="button-untop" v-if="!jobcircleDetail.isTop" @click="todoAction('top')"> 置顶 </button>
	 			<button class="button-top" v-if="jobcircleDetail.isTop" @click="todoAction('untop')"> 取消置顶 </button>
 			</template>
 			<button class="job-circle-setting"  @click="todoAction('setting')" v-if="jobcircleDetail.isOwner">
 				<i class="icon font_family icon-shezhi"></i> 工作圈设置
 			</button>
 		</div>
 	</div>
 	<preview v-if="isPreview" :previewData="previewData" @closePreview="closePreview"></preview>
 </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import preview from 'COMPONENTS/preview'
import fileBox from 'COMPONENTS/fileBox'
import picOrVideo from 'COMPONENTS/picOrVideo'
import adSearch from 'COMPONENTS/adSearch'
import loadMore from 'COMPONENTS/loadMore'
import commentBox from 'COMPONENTS/commentBox'

@Component({
	components: {
		preview,
		fileBox,
		picOrVideo,
		loadMore,
		adSearch,
		commentBox
	},
	methods: {
		...mapActions([
			'getAttentionsJobcircleApi',
			'getAllVisibleJobcircleApi',
			'updateJobCircleCheckedStatus',
			'updateJobCircleItemCheckedStatus',
			'getJobcirclePostaffixApi',
			'getJobcirclePostaffixOfPicturesApi',
			'getJobcirclePostaffixOfFilesApi',
			'getJobcirclePostaffixOfUrlsApi',
			'getJobcircleDetailApi',
			'focusJobCircleApi',
			'unFocusJobCircleApi',
			'unTopJobCircleApi',
			'topJobCircleApi',
      'undataJobcirclePostaffixOfPictures',
      'undataJobcirclePostaffixOfFiles',
      'undataJobcirclePostaffixOfUrls'
		])
	},
	computed: {
    ...mapGetters([
      'attentionsJobcircle',
      'allVisibleJobcircle',
      'jobcirclePostAffix',
      'jobcirclePostAffixPictures',
      'jobcirclePostAffixFiles',
      'jobcirclePostAffixUrls',
      'currentJobCircleId',
      'jobcircleDetail'
    ])
  },
  watch: {
  }
})
export default class pageIndex extends Vue {
	tabIndex = 'Pictures'
	keyWord = '' // 关键词
	visible = false // 显示高级搜索框
	isPreview = false // 打开预览层
	previewData = null // 传递给预览层的数据
	picsStatus = {
		noData: false,
		loading: false,
		page: 1
	}
	filesStatus = {
		noData: false,
		loading: false,
		page: 1
	}
	linksStatus = {
		noData: false,
		loading: false,
		page: 1
	}
  get fileList() {
    return this[`jobcirclePostAffixFiles`]
  }
  get picList () {
  	let list = this[`jobcirclePostAffixPictures`]
  	let innerIndex = 0
  	list.forEach((item, index) => {
  		innerIndex++
  		if (index === 0 || (index > 1 && list[index-1].month !== item.month)) {
  			innerIndex = 0
  		}
  		item.index = innerIndex
  	})
  	return list
  }
  get linkList () {
  	return this[`jobcirclePostAffixUrls`]
  }
  toSearch () {
  	if (this.keyWord === '') return
  	this.$router.push(`/search?id=${this.currentJobCircleId}&keyword=${this.keyWord}&type=2,3,4`)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   侧边栏选中
   */
	command(params) {
		this.updateJobCircleCheckedStatus(params)
	}
	/**
	 * @Author   小书包
	 * @DateTime 2018-11-22
	 * @detail   获取页面选的的工作圈信息
	 */
	getActiveJobCircleInfos(params) {
		this.updateJobCircleItemCheckedStatus(params)
    // 重置操作
    this.undataJobcirclePostaffixOfPictures([])
    this.undataJobcirclePostaffixOfFiles([])
    this.undataJobcirclePostaffixOfUrls([])
    this.picsStatus = {
      noData: false,
      loading: false,
      page: 1
    }
    this.filesStatus = {
      noData: false,
      loading: false,
      page: 1
    }
    this.linksStatus = {
      noData: false,
      loading: false,
      page: 1
    }
		this[params.show].list.map(field => {
			if(field.active) {
				this.getLists({id: this.currentJobCircleId, params: {page: 1, count: 35}})
				this.getJobcircleDetail({id: this.currentJobCircleId})
			}
		})
	}
	/**
	 * @Author   小书包
	 * @DateTime 2018-11-22
	 * @detail   选显卡切换
	 */
	tabClick(index) {
		this.tabIndex = index
		if (this[`jobcirclePostAffix${this.tabIndex}`].length === 0) {
			this.getLists({id: this.currentJobCircleId, params: {page: 1, count: 35}})
		}
	}
	closePreview () {
		this.isPreview = false
	}
	openPreview (affixItem) {
		this.previewData = {
			month: affixItem.month,
			index: affixItem.index,
			id: this.currentJobCircleId,
			page: Math.ceil(affixItem.index / 35)
		}
		this.isPreview = true
	}
	/**
	 * @Author   小书包
	 * @DateTime 2018-11-22
	 * @detail   根据id获取列表数据
	 */
	loadMore () {
		switch (this.tabIndex) {
			case 'Pictures':
				this.picsStatus.page++
				break
			case 'files':
				this.filesStatus.page++
				break
			default:
				this.linksStatus.page++
				break
		}
		this.getLists({id: this.currentJobCircleId, params: {count: 35}})
	}
	getLists(params) {
		switch (this.tabIndex) {
			case 'Pictures':
				params.params.page = this.picsStatus.page
				this.picsStatus.loading = true
				break
			case 'Files':
				params.params.page = this.filesStatus.page
				this.filesStatus.loading = true
				break
			default:
				params.params.page = this.linksStatus.page
				this.linksStatus.loading = true
				break
		}
		this[`getJobcirclePostaffixOf${this.tabIndex}Api`](params).then(res => {
			let noData = false
			if (res.data.meta && !res.data.meta.nextPageUrl || !res.data.meta) {
				noData = true
			}
			switch (this.tabIndex) {
				case 'Pictures':
					this.picsStatus.loading = false
					this.picsStatus.noData = noData
					break
				case 'Files':
					this.filesStatus.loading = false
					this.filesStatus.noData = noData
					console.log(this.filesStatus)
					break
				default:
					this.linksStatus.loading = false
					this.linksStatus.noData = noData
					break
			}
		})
	}
	/**
	 * @Author   小书包
	 * @DateTime 2018-11-22
	 * @detail   获取工作圈详情
	 */
	getJobcircleDetail(params) {
		this.getJobcircleDetailApi(params)
	}
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   待办项
   * @return   {[type]}   [description]
   */
  todoAction(action) {
  	switch(action) {
  		case 'focus':
  			this.focusJobCircleApi({id: this.currentJobCircleId, globalLoading: true})
  					.then((res) => {
  						this.$message({
			          message: `${res.data.msg}~`,
			          type: 'success'
			        })
  						this.getJobcircleDetail({id: this.currentJobCircleId})
  					})
  					.catch(error => {
  						this.$message.error(`${error.msg}~`)
  					})
  			break
  		case 'unfocus':
  			this.unFocusJobCircleApi({id: this.currentJobCircleId, globalLoading: true})
  					.then((res) => {
  						this.$message({
			          message: `${res.data.msg}~`,
			          type: 'success'
			        })
  						this.getJobcircleDetail({id: this.currentJobCircleId})
  					})
  					.catch(error => {
  						this.$message.error(`${error.msg}~`)
  					})
  			break
  		case 'top':
  			this.topJobCircleApi({id: this.currentJobCircleId, globalLoading: true})
  					.then((res) => {
  						this.$message({
			          message: `${res.data.msg}~`,
			          type: 'success'
			        })
  						this.getJobcircleDetail({id: this.currentJobCircleId})
  					})
  					.catch(error => {
  						this.$message.error(`${error.msg}~`)
  					})
  			break
  		case 'untop':
  			this.unTopJobCircleApi({id: this.currentJobCircleId, globalLoading: true})
  					.then((res) => {
  						this.$message({
			          message: `${res.data.msg}~`,
			          type: 'success'
			        })
  						this.getJobcircleDetail({id: this.currentJobCircleId})
  					})
  					.catch(error => {
  						this.$message.error(`${error.msg}~`)
  					})
  			break
  		case 'setting':
  			this.$router.push({name: 'jobCircleUpdate', query: {id: this.currentJobCircleId}})
  			break
  		default:
  			break
  	}
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-22
   * @detail   初始化页面数据
   */
  init() {
  	this.getAttentionsJobcircleApi()
				.then(() => {
					this.attentionsJobcircle.list.map(field => {
						this.getAllVisibleJobcircleApi()
						if(field.active) {
							this.getLists({id: this.currentJobCircleId, params: {page: 1, count: 35}})
							this.getJobcircleDetail({id: this.currentJobCircleId})
						}
					})
				})
  }
	created() {
    // 重置操作
    this.undataJobcirclePostaffixOfPictures([])
    this.undataJobcirclePostaffixOfFiles([])
    this.undataJobcirclePostaffixOfUrls([])
		this.init()
	}
}
</script>
<style lang="scss">
#index{
	width: 1200px;
	margin: 0 auto;
	.col-aside-left {
		width: 282px;
		height: 300px;
		margin-right: 24px;
		box-sizing: border-box;
		display: inline-block;
		vertical-align: top;
	}
	.attention-zone {
		width:282px;
		height:64px;
		background: white;
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 16px;
	}
	.navigation-box {
		background: white;
		overflow: hidden;
		border-radius: 2px;
		margin-bottom: 16px;
		h2{
			font-size:14px;
			font-weight:400;
			line-height: 64px;
			color:rgba(53,64,72,1);
			margin: 0;
			padding: 0 25px;
			cursor: pointer;
			.icon {
				float: right;
				transition: all .4s ease;
			}
		}
		.slide-down-active{
			.icon {
				transform: rotate(180deg);
			}
		};
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			max-height: 0;
			overflow: hidden;
			transition: all ease 1s;
		}
		.show-slide-down {
			max-height: unset !important;
		}
		.icon-box {
			width: 40px;
			height: 40px;
			display: inline-block;
			border-radius: 50%;
			vertical-align: middle;
			margin-right: 10px;
			margin-left: 32px;
			position: relative;
			img{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		li {
			height: 64px;
			line-height: 64px;
			font-size:12px;
			font-weight:400;
			color:rgba(53,64,72,1);
			cursor: pointer;
			padding-right: 24px;
			text-overflow: ellipsis;
			white-space: nowrap;
			position: relative;
		}
		p {
			line-height: 64px;
			font-weight:400;
			color:rgba(53,64,72,1);
			text-overflow: ellipsis;
			white-space: nowrap;
			margin: 0;
			display: inline-block;
			overflow: hidden;
			vertical-align: middle;
			width: calc(100% - 82px)
		}
		.is-top {
			width:16px;
			height:16px;
			background: white url(~IMAGES/icon_top.png) no-repeat center center;
			background-size: cover;
			border-radius:50%;
			box-sizing: border-box;
			text-align: center;
			line-height: 16px;
			display: inline-block;
			position: absolute;
			bottom: -3px;
			right: -3px;
		}
		.router-active {
	    background:rgba(255,226,102,0.12);
	    pointer-events: none;
	    a {
	      color: #fff;
	      .iconfont{
	        color: #fff;
	      }
	    }
	    &:before {
	      background: #FFE266;
	      content: '';
	      display: block;
	      left: 0;
	      position: absolute;
	      height: 100%;
	      width:4px;
	    }
	    &:after {
	      width: 0;
	      height: 0;
	      border-color: red;
	      position: absolute;
	      top: 50%;
	      left: 0;
	      transform: translateY(-50%);
	      border-width: 10px;
	      border-style: solid;
	      border-color: transparent transparent transparent #FFE266;
	      display: block;
	      content: '';
	    }
	  }
	}
	.col-aside-right {
		width: 282px;
		margin-left: 24px;
		border-radius: 2px;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
		display: inline-block;
		vertical-align: top;
		.work-circle-infos {
			background: white;
			padding: 32px;
		}
		.img-box{
			width: 80px;
			height: 80px;
			display: inline-block;
			border-radius: 50%;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.work-name {
			font-size:14px;
			font-weight:500;
			color:rgba(53,64,72,1);
			line-height: 1.5;
			margin: 0;
			margin-bottom: 25px;
		}
	}
	.col-daptive {
		box-sizing: border-box;
		width: 580px;
		display: inline-block;
		vertical-align: top;
		.month {
			width: 100%;
			margin-bottom: 8px;
			overflow: hidden;
			background: white;
			overflow: hidden;
			font-size: 0;
			.monthTitle {
				font-size:14px;
				font-weight:400;
				color:rgba(53,64,72,1);
				margin: 0;
				height: 46px;
				line-height: 46px;
				padding-left: 24px;
				margin-bottom: 1px;
				box-shadow:0px -1px 0px 0px rgba(235,238,245,1) inset;
			}
			.picOrVideo {
				width: 140px;
				height: 140px;
				display: inline-block;
				margin: 4px 0 0 4px;
				position: relative;
				overflow: hidden;
			}
		}
	}
	.avatar-box {
		height: 24px;
		margin-bottom: 10px;
		> div {
			height: 24px;
			width: 24px;
			line-height: 24px;
			text-align: center;
			border-radius: 50%;
			display: inline-block;
			border: 1px solid white;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
			&:nth-child(1) {
			};
			&:nth-child(2) {
				margin-left: -10px;
			};
			&:nth-child(3) {
				margin-left: -10px;
			};
			&:nth-child(4) {
				margin-left: -10px;
			};
		}
		.gray {
			background: #F8F8F8;
			i{
				width: 3px;
				height: 3px;
				border-radius: 50%;
				background: #BCBCBC;
				display: inline-block;
				margin: 0 1px;
				vertical-align: middle;
			}
		}
	}
	.together-work-in {
		font-size:12px;
		font-weight:400;
		color:rgba(102,102,102,1);
		margin: 0;
		margin-bottom: 25px;
	}
	.attention-button {
		width:126px;
		height:36px;
		background:linear-gradient(180deg,rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%);
		border-radius:4px;
		border:1px solid #D7AB70;
		color: #D7AB70;
		cursor: pointer;
		outline: none;
	}
	.attentioned-button {
		border:1px solid rgba(248,248,248,1);
		color: #929292;
		cursor: pointer;
		outline: none;
		width:98px;
		height:36px;
		background:rgba(248,248,248,1);
		border-radius:4px;
		font-size: 14px;
	}
	.button-top {
		border:1px solid rgba(248,248,248,1);
		color: #929292;
		cursor: pointer;
		outline: none;
		width:98px;
		height:36px;
		background:rgba(248,248,248,1);
		border-radius:4px;
		margin-left: 16px;
		font-size: 14px;
	}
	.button-untop {
		border:1px solid #D7AB70;
		color: #D7AB70;
		cursor: pointer;
		outline: none;
		width:98px;
		height:36px;
		background:white;
		border-radius:4px;
		margin-left: 16px;
		font-size: 14px;
	}
	.job-circle-setting {
		width:126px;
		height:36px;
		border-radius:4px;
		border:1px solid #EBEEF5;
		color: #666666;
		cursor: pointer;
		outline: none;
		background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 100%);
	}
	.content-header {
		height:46px;
		background:rgba(255,255,255,1);
		margin-bottom: 16px;
	}
	.common-tab-box {
		display: inline-block;
		li{
			display: inline-block;
			min-width: 72px;
			position: relative;
			text-align: center;
			line-height: 46px;
			cursor: pointer;
			font-weight: 400;
			color: #354048;
			&:before{
        position: absolute;
        bottom: 1px;
        height: 2px;
        background: #FFE266;
        content: '';
        display: block;
        width: 70%;
        opacity: 0;
        visibility: hidden;
        left: 50%;
        transform: translateX(-50%);
      };
		}
		.tab-active {
      color: #354048;
      font-weight: 500;
      &:before{
        opacity: 1;
        visibility: visible;
      };
    }
	}
	.search {
		float: right;
		overflow: hidden;
		button {
			padding: 0;
			border: none;
		}
		.common-search-box {
			float: left;
			width:240px;
			height:32px;
			border-radius:4px;
			border:1px solid #EBEEF5;
			display: inline-block;
			margin: 7px;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			.search-button {
				width: 32px;
				height: 30px;
				display: block;
				z-index: 1;
				position: relative;
				float: right;
				text-align: center;
				line-height: 30px;
				color: #666666;
				cursor: pointer;
			}
			input {
				width: 100%;
				outline: unset;
				border: unset;
				padding: 5px;
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			input::-webkit-input-placeholder {
				font-size:14px;
				font-weight:400;
				color:rgba(188,188,188,1);
			}
		}
		.more {
			font-size: 14px;
			color: #666666;
			margin: 0 16px 0 11px;
			float: right;
			line-height: 46px;
			cursor: pointer;
			.icon {
				margin-right: 6px;
			}
		}
	}
	
	.common-ul {
		overflow: hidden;
		.common-li {
			background:rgba(255,255,255,1);
			box-sizing: border-box;
			padding: 22px 22px 0 22px;
			.inner {
				padding-bottom: 22px;
				border-bottom: 1px solid #F5F7FA;
			}
		}
		.li-header {
			margin-bottom: 5px;
		}
		.img-box {
			width:30px;
			height:30px;
			border-radius: 50%;
			background: gray;
			display: inline-block;
			vertical-align: middle;
			position: relative;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.user-name {
			font-size:14px;
			font-weight:400;
			color:rgba(53,64,72,1);
			line-height: 30px;
			margin: 0;
			display: inline-block;
			vertical-align: middle;
			margin-left: 10px;
		}
		time {
			font-size:12px;
			font-weight:300;
			color:rgba(146,146,146,1);
			line-height: 30px;
			float: right;
		}
	}
}
</style>