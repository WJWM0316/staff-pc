<template>
 <div id="index">
 	<div class="col-aside-left">
 		<div class="navigation-box" v-for="(pItem, pIndex) in navigation" :key="pIndex">
 			<h2 :class="{'slide-down-active': pItem.active}" @click="command(pIndex)">{{pItem.name}}<span class="icon"><i class="el-icon-caret-bottom"></i></span></h2>
 			<ul :class="{'show-slide-down': pItem.active}">
 				<li v-for="(cItem, cIndex) in pItem.children" :key="cIndex" @click="routeJump(pIndex, cIndex)" :class="{'router-active': cItem.active}"><span class="icon-box"></span>{{cItem.name}}</li>
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
 			11111
 		</div>
 	</div>
 	<div class="col-aside-right">
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
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
	methods: {
		...mapActions([
			'showMsg'
		])
	},
	computed: {
    ...mapGetters([
      'dialog'
    ])
  }
})
export default class pageIndex extends Vue {
	tabIndex = 1
	navigation = [
		{
			name: '我关注的工作圈',
			active: false,
			children: [
				{
					name: '我关注的工作圈1',
					active: false
				},
				{
					name: '我关注的工作圈2',
					active: false
				},
				{
					name: '我关注的工作圈3',
					active: false
				}
			]
		},
		{
			name: '所有工作圈',
			active: false,
			children: [
				{
					name: '所有工作圈1',
					active: false
				},
				{
					name: '所有工作圈2',
					active: false
				},
				{
					name: '所有工作圈3',
					active: false
				}
			]
		}
	]
	command(index) {
		// this.navigation[index].active = !this.navigation[index].active
		this.navigation.map((pNavField, pNavIndex) => pNavField.active = index === pNavIndex ? !pNavField.active : false)
	}
	routeJump(pIndex, cIndex) {
		this.navigation.map((pNavField, pNavIndex) => {
			pNavField.children.map((cNavField, cNavIndex) => cNavField.active = cIndex === cNavIndex ? true : false)
		})
	}
	tabClick(index) {
		this.tabIndex = index
	}
}
</script>
<style lang="scss">
#index{
	display: flex;
	margin-top: 24px;
	.col-aside-left {
		width: 282px;
		height: 300px;
		margin-right: 24px;
		box-sizing: border-box;
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
				transition: all 1s ease;
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
			background: pink;
			display: inline-block;
			border-radius: 50%;
			vertical-align: middle;
			margin-right: 10px;
			margin-left: 32px;
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
		background: white;
		margin-left: 24px;
		border-radius: 2px;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
		padding: 32px;
	}
	.col-daptive {
		flex-grow: 1;
		box-sizing: border-box;
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
				transform: translateX(-10px);
			};
			&:nth-child(3) {
				background: red;
				transform: translateX(-20px);
			};
			&:nth-child(4) {
				background: pink;
				transform: translateX(-30px);
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
}
</style>