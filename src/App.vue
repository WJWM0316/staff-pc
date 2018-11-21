<template>
  <div id="lphva">
  	<page-header></page-header>
  	<div class="containner">
  		<transition>
	      <router-view />
	    </transition>
  	</div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import PageHeader from 'COMPONENTS/pageHeader/index.vue'
import Cookies from 'js-cookie'

@Component({
  components: {
    PageHeader
  },
  methods: {
    ...mapActions([
      'loginApi'
    ])
  }
})
export default class App extends Vue {
  created() {
    const code  = Cookies.get('code') ? Cookies.get('code') : process.env.VUE_APP__TEST_COMPANY
    this.loginApi({code, 'Authorization-Sso': Cookies.get('Authorization-Sso')})
  }
}
</script>
<style lang="scss">
@import url('./App.scss');
@import url('http://at.alicdn.com/t/font_928019_kprbzn6z0e9.css');
</style>