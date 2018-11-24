<template>
  <section id="x-plus">
    <template v-if="token">
    	<page-header></page-header>
    	<main class="containner">
    		<transition>
  	      <router-view />
  	    </transition>
    	</main>
    </template>
  </section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import PageHeader from 'COMPONENTS/pageHeader/index.vue'
import Cookies from 'js-cookie'
import { Loading } from 'element-ui'
@Component({
  components: {
    PageHeader
  },
  methods: {
    ...mapActions([
      'loginApi'
    ])
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  }
})
export default class App extends Vue {
  created() {
    this.loadingInstance = Loading.service({})
    const code  = Cookies.get('code') ? Cookies.get('code') : process.env.VUE_APP__TEST_COMPANY
    this.loginApi({code, 'Authorization-Sso': Cookies.get('Authorization-Sso')})
        .then(() => { this.loadingInstance.close() })
  }
}
</script>
<style lang="scss">
@import url('./App.scss');
@import url('http://at.alicdn.com/t/font_928019_jv11xf700o7.css');
</style>