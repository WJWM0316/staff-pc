<template>
 <div id="index">
 	<div class="col-aside-left">
 		<div class="navigation-box">
 			<h2
 				:class="{'slide-down-active': attentionsJobcircle.active}"
 				@click="command({show: 'attentionsJobcircle', hide: 'allVisibleJobcircle'})">
	 				{{attentionsJobcircle.name}}
	 				<span class="icon">
	 					<i class="el-icon-caret-bottom"></i>
	 				</span>
 			</h2>
 			<ul :class="{'show-slide-down': attentionsJobcircle.active}">
 				<li
 					v-for="(attentionsJobcircleItem, attentionsJobcircleIndex) in attentionsJobcircle.list"
 					:key="attentionsJobcircleIndex"
 					@click="routeJump({show: 'attentionsJobcircle', hide: 'allVisibleJobcircle', index: attentionsJobcircleIndex})"
 					:class="{'router-active': attentionsJobcircleItem.active}">
 						<span class="icon-box"><img :src="attentionsJobcircleItem.coverImg.smallUrl" alt=""></span>
 						{{attentionsJobcircleItem.name}}
 					</li>
 			</ul>
 		</div>
 		<div class="navigation-box">
 			<h2
 				:class="{'slide-down-active': allVisibleJobcircle.active}"
 				@click="command({show: 'allVisibleJobcircle', hide: 'attentionsJobcircle'})">
	 				{{allVisibleJobcircle.name}}
	 				<span class="icon">
	 					<i class="el-icon-caret-bottom"></i>
	 				</span>
 			</h2>
 			<ul :class="{'show-slide-down': allVisibleJobcircle.active}">
 				<li
 					v-for="(allVisibleJobcircleItem, allVisibleJobcircleIndex) in allVisibleJobcircle.list"
 					:key="allVisibleJobcircleIndex"
 					@click="routeJump({show: 'allVisibleJobcircle', hide: 'attentionsJobcircle', index: allVisibleJobcircleIndex})"
 					:class="{'router-active': allVisibleJobcircleItem.active}">
 						<span class="icon-box"><img :src="allVisibleJobcircleItem.coverImg.smallUrl" alt=""></span>
 						{{allVisibleJobcircleItem.name}}
 					</li>
 			</ul>
 		</div>
 	</div>
 	<div class="col-daptive">
 		<div class="content-header">
 			<ul class="common-tab-box">
 				<li :class="{'tab-active': tabIndex === 1}" @click="tabClick(1)">文件</li>
 				<li :class="{'tab-active': tabIndex === 2}" @click="tabClick(2)">相册</li>
 				<li :class="{'tab-active': tabIndex === 3}" @click="tabClick(3)">链接</li>
 			</ul>
 			<div class="common-search-box">
 				<input type="text" placeholder="搜索文件名称或关键词">
 				<span class="search-button"><i class="el-icon-search"></i></span>
 			</div>
 		</div>
 		<div class="content">
 			<ul class="common-ul">
 				<li v-for="item in 5" :key="item">
 					<div class="li-header">
 						<div class="img-box"></div>
 						<p class="user-name">魏平</p>
 						<time>2018-11-12</time>
 					</div>
 					<div class="file-content">
 						<div class="icon-box"></div>
 						<div class="file-infos">
 							<p class="file-title">设计者，需要做出更好的设计决策，给予研发团队一种高…</p>
 							<p class="file-size">12M</p>
 						</div>
 						<div class="download-box">
 							<span><i class="el-icon-download"></i></span>
 						</div>
 					</div>
 				</li>
 			</ul>
 		</div>
 	</div>
 	<div class="col-aside-right">
 		<div class="work-circle-infos">
	 		<div class="img-box"></div>
	 		<p class="work-name">工作圈标题最多可以有二十五个字 这里需要完整显示完的</p>
	 		<div class="avatar-box">
	 			<div v-for="item in 4" :key="item"></div>
	 		</div>
	 		<p class="together-work-in">23人和你一起工作</p>
	 		<button class="attention-button">
	 			+ 关注
	 		</button>
 		</div>
 	</div>
 </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
	methods: {
		...mapActions([
			'getAttentionsJobcircleApi',
			'getAllVisibleJobcircleApi',
			'updateJobCircleCheckedStatus',
			'updateJobCircleItemCheckedStatus'
		])
	},
	computed: {
    ...mapGetters([
      'attentionsJobcircle',
      'allVisibleJobcircle'
    ])
  }
})
export default class pageIndex extends Vue {
	tabIndex = 1
	command(params) {
		this.updateJobCircleCheckedStatus(params)
	}
	routeJump(params) {
		this.updateJobCircleItemCheckedStatus(params)
	}
	tabClick(index) {
		this.tabIndex = index
	}
	created() {
		this.getAttentionsJobcircleApi()
		this.getAllVisibleJobcircleApi()
	}
}
</script>
<style lang="scss">
#index{
	margin-top: 24px;
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
			overflow: hidden;
			position: relative;
			line-height: 64px;
			font-size:12px;
			font-weight:400;
			color:rgba(53,64,72,1);
			cursor: pointer;
		}
		.router-active {
	    background:rgba(255,226,102,0.12);
	    position: relative;
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
			background: pink;
			border-radius: 50%;
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
		width: calc(100% - 612px);
		display: inline-block;
		vertical-align: top;
	}
	.avatar-box {
		height: 24px;
		margin-bottom: 10px;
		> div {
			height: 24px;
			width: 24px;
			border-radius: 50%;
			display: inline-block;
			border: 1px solid white;
			&:nth-child(1) {
				background: red;
			};
			&:nth-child(2) {
				background: red;
				margin-left: -10px;
			};
			&:nth-child(3) {
				background: red;
				margin-left: -10px;
			};
			&:nth-child(4) {
				background: pink;
				margin-left: -10px;
			};
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
	.common-search-box {
		width:300px;
		height:32px;
		border-radius:4px;
		border:1px solid #EBEEF5;
		display: inline-block;
		margin: 7px;
		box-sizing: border-box;
		float: right;
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
	.content {
		min-height:558px;
		background:rgba(255,255,255,1);
	}
	.common-ul {
		li {
			background:rgba(255,255,255,1);
			box-sizing: border-box;
			padding: 22px;
		}
		.file-content {
			background:rgba(245,247,250,1);
			border-radius:4px;
			margin-left: 40px;
			position: relative;
			padding: 8px;
			box-sizing: border-box;
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
		.download-box {
			width: 70px;
			display: block;
			height: 46px;
			text-align: center;
			float: right;
			line-height: 46px;
		}
		.icon-box {
			width: 46px;
			height: 46px;
			background: red;
			border-radius: 4px;
			display: inline-block;
			margin-right: 6px;
		}
		.file-infos {
			width: calc(100% - 62px - 70px);
			display: inline-block;
			height: 46px;
			vertical-align: top;
		}
		.file-title {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin: 0;
			font-size:14px;
			font-weight:300;
			color:rgba(0,0,0,0.85);
			line-height: 1;
			margin-top: 5px;
		}
		.file-size {
			font-size:12px;
			font-weight:300;
			color:rgba(146,146,146,1);
			margin: 0;
			line-height: 1;
			margin-top: 8px;
		}
	}
}
</style>