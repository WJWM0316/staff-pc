<template>
 <header id="header">
 		<div class="logo-box">
  		<router-link :to="{name: 'index'}">
  			<img src="~IMAGES/logo.png" alt="">
  		</router-link>
  	</div>
  	<el-dropdown @command="command">
		  <span class="el-dropdown-link">
		  	<img :src="userInfos.avatarInfo.middleUrl" alt="" v-if="userInfos.avatarInfo">
		    欢迎登录，{{userInfos.realname}}<i class="el-icon-caret-bottom"></i>
		  </span>
		  <el-dropdown-menu slot="dropdown">
		  	<el-dropdown-item command="switch" v-if="hasAuthJump">切换管理员端</el-dropdown-item>
		    <el-dropdown-item command="out">退出登录</el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
 </header>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Cookies from 'js-cookie'

@Component({
	methods: {
    ...mapActions(['logoutApi'])
  },
  computed: {
    ...mapGetters([
      'userInfos'
    ])
  },
  watch: {
    'userInfos.roles': {
      handler(roles) {
      	const hasAuthJump = roles.some(field => field <= 3)
        this.hasAuthJump = hasAuthJump
      },
      immediate: true
    }
  }
})
export default class ComponentHeader extends Vue {
	hasAuthJump = false
	command(action) {
		const company = process.env.NODE_ENV === 'development' ? process.env.VUE_APP__TEST_COMPANY : Cookies.get('code')
		const isContentManager = this.userInfos.roles.some(field => field <= 3) && !this.userInfos.roles.includes(1) && !this.userInfos.roles.includes(2)
    const routeName = isContentManager ? 'course' : 'dashboard'
		switch(action) {
			case 'out':
				this.logoutApi({code : Cookies.get('code')})
				break
			case 'switch':
				window.location.replace(`${process.env.VUE_APP__MANAGER_URL}/${company}/${routeName}`)
				break
			default:
				break
		}
	}
}
</script>
<style lang="scss">
#header {
	height:60px;
	line-height: 60px;
	background:rgba(53,64,72,1);
	padding: 0 128px;
	box-sizing: border-box;
	position: fixed;
	width: 100%;
	left: 0;
	top: 0;
	z-index: 10;
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
	.el-dropdown-link {
		img {
			width: 34px;
			height: 34px;
			background: rgba(0,0,0,.1);
			border-radius: 50%;
			display: inline-block;
			vertical-align: middle;
			cursor: pointer;
		}
	}
}
</style>