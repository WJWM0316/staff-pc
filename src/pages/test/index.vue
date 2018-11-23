<template>
 	<section>
 		<comment-box></comment-box>
 	</section>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import CommentBox from 'COMPONENTS/commentBox/index.vue'

@Component({
	components: {
    CommentBox
  }
})
export default class ComponentHeader extends Vue {}
</script>
<style lang="scss"></style>