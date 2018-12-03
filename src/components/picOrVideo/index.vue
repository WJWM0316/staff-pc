<template>
  <div class="picOrVideoWap">
    <img v-if="fileData.type === '图片'" :src="fileData.fileInfo.url" class="imgShow">
    <div v-else class="videoMask">
      <img class="video" :src="fileData.fileInfo.coverImg.url" v-if="">
      <div class="btn">
        <i class="icon font_family icon-play"></i>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component({
    name: 'picOrVideo',
    props: {
      fileData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      fileData () {}
    }
  })
  export default class ComponentPicOrVideo extends Vue {
  }
</script>
<style lang="scss" scoped>
  .picOrVideoWap {
    width: 100%;
    height: 100%;
    background: url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/login.png') center center;
    background-size: 100% 100%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    .imgShow {
      width: auto;
      height: 300px;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      display: block;
      border-radius: 2px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .videoMask {
      background: #000;
      position: relative;
      width: 100%;
      height: 100%;
      .video {
        width: auto;
        height: 300px;
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
      .btn {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #F8F8F8;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -23px 0 0 -23px;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          font-size: 18px;
          color: #354048;
        }
      }
    }
  }
</style>