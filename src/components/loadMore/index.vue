<template>
  <div class="loadMore">
    <p class="clickP" v-show="!status.loading && !status.noData" @click.stop="loadMore">点击加载更多</p>
    <p class="loading" v-show="status.loading"><i class="icon font_family icon-jiazai"></i> 正在努力加载中…</p>
    <p v-show="status.noData">没有更多数据</p>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component({
    name: 'loadMore',
    props: {
      status: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      status () {}
    }
  })
  export default class ComponentLoadMore extends Vue {
    loadMore () {
      this.$emit('loadMore')
    }
  }
</script>
<style lang="scss" scoped>
.loadMore {
  padding: 20px 0;
  text-align: center; 
  p {
    font-size: 12px;
    color: #929292;
    line-height: 18px;
    &.clickP {
      cursor: pointer;
    }
    &.loading {
      .icon {
        vertical-align: -1px;
      }
    }
  }
}
</style>