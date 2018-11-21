<template>
  <div id="lphva">
  	<page-header></page-header>
    <transition>
      <router-view class="containner" />
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import PageHeader from 'COMPONENTS/pageHeader/index.vue'

@Component({
	components: {
		PageHeader
	}
})
export default class App extends Vue {}
</script>
<style lang="scss">
@import url('./App.scss');
</style>