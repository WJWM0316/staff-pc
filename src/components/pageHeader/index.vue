<template>
 <header id="header">
 		<div class="logo-box">
  		<router-link :to="{name: 'index'}">
  			<!-- <img src="~IMAGES/logo.png" alt=""> -->
  		</router-link>
  	</div>
  	<el-dropdown>
		  <span class="el-dropdown-link">
		    欢迎登录，{{userInfos.realname}}<i class="el-icon-caret-bottom"></i>
		  </span>
		  <el-dropdown-menu slot="dropdown">
		  	<el-dropdown-item>切换管理员端</el-dropdown-item>
		    <el-dropdown-item>退出登录</el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
 </header>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  computed: {
    ...mapGetters([
      'userInfos'
    ])
  }
})
export default class ComponentHeader extends Vue {}
</script>
<style lang="scss">
#header {
	height:60px;
	line-height: 60px;
	background:rgba(53,64,72,1);
	padding: 0 128px;
	.logo-box{
		display: inline-block;
		transition: all ease .4s;
		vertical-align: middle;
		img {
			width: 120px;
			display: block;
			vertical-align: middle;
			transition: all ease .4s;
		}
	}
	.el-dropdown {
		display: inline-block;
		float: right;
		color: white;
		.el-icon-caret-bottom {
			margin-left: 5px;
		}
	}
}
</style>