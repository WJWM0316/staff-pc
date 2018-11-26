<template>
  <div class="nodata">
    <div class="nodata-inner">
      <img src="~IMAGES/no-data.png" alt="" class="pic">
      <p>{{text}}</p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
	name: 'nodata',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
})
export default class ComponentNodata extends Vue {}
</script>
<style lang="scss" scoped>
	.pic {
    width: 120px;
  }
</style>