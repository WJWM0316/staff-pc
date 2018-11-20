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
 	<div class="col-daptive"></div>
 	<div class="col-aside-right">
 		<div class="img-box"></div>
 		<p class="work-name">工作圈标题最多可以有二十五个字 这里需要完整显示完的</p>
 		<div class="avatar-box">
 			<div v-for="item in 4" :key="item"></div>
 		</div>
 	</div>
 </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({})
export default class pageIndex extends Vue {
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
		height: 300px;
		margin-left: 24px;
		border-radius: 2px;
		overflow: hidden;
		text-align: center;
		box-sizing: border-box;
		padding: 32px;
	}
	.col-daptive {
		flex-grow: 1;
		background: white;
		height: 300px;
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
	}
}
</style>