<template>
  <div>
    <template v-if="type==='1'">
      <div class="file-content" @click.stop="filePreview(fileData.fileInfo.url)" v-if="fileData.type !== '链接'">
        <div class="icon-box">
          <img :src="fileData.fileInfo.extension | fileCover" alt="">
        </div>
        <div class="file-infos">
          <el-tooltip class="item" effect="dark" :content="fileData.fileInfo.fileName" placement="top">
            <p class="file-title">{{fileData.fileInfo.fileName}}</p>
          </el-tooltip>
          <p class="file-size">{{fileData.fileInfo.sizeM}}</p>
        </div>
        <div class="download-box">
          <span @click.stop="download(fileData.fileInfo.url)"><i class="icon font_family icon-xiazai"></i></span>
        </div>
      </div>
      <div class="file-content" @click.stop="newWindow(fileData.url)" v-else>
        <div class="icon-box">
          <img src="https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/postLink.png">
        </div>
        <div class="file-infos link">
          <p class="file-title link">{{fileData.title}}</p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="file-content bigFileBox" v-if="fileData.type !== '链接'">
        <div class="icon-box">
          <img :src="fileData.fileInfo.extension | fileCover" alt="">
        </div>
        <div class="file-infos">
          <el-tooltip class="item" effect="dark" :content="fileData.fileInfo.fileName" placement="top">
            <p class="file-title">{{fileData.fileInfo.fileName}}</p>
          </el-tooltip>
          <p class="file-size">{{fileData.fileInfo.sizeM}}</p>
        </div>
        <img class="avatar" :src="fileData.releaseUser.avatarInfo.smallUrl" alt="">
        <div class="user">
          <div class="name ellipsisOne">{{fileData.releaseUser.realname}}</div>
          <div class="date ellipsisOne">{{fileData.createdAt}}</div>
        </div>
        <div class="btnBox">
          <span class="btn" @click.stop="download(fileData.fileInfo.url)"><i class="icon font_family icon-xiazai"></i>下载</span>
          <span class="btn" @click.stop="filePreview(fileData.fileInfo.url)"><i class="icon font_family icon-yulan"></i>预览</span>
        </div>
      </div>
      <div class="file-content bigFileBox" v-else @click.stop="newWindow(fileData.url)">
        <div class="icon-box">
          <img src="https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/postLink.png">
        </div>
        <div class="file-infos link">
          <el-tooltip class="item" effect="dark" :content="fileData.title ? fileData.title : '链接'" placement="top">
            <p class="file-title link">{{fileData.title ? fileData.title : '链接'}}</p>
          </el-tooltip>
        </div>
        <img class="avatar" :src="fileData.releaseUser.avatarInfo.smallUrl" alt="">
        <div class="user">
          <div class="name ellipsisOne">{{fileData.releaseUser.realname}}</div>
          <div class="date ellipsisOne">{{fileData.createdAt}}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  @Component({
    name: 'file-box',
    props: {
      type: {
        type: String,
        default: '1'
      },
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
  export default class ComponentFileBox extends Vue {
    download(fileLink) {
      // require('downloadjs')(fileLink, fileLink, 'file')
      let event = new MouseEvent('click')
      let a = document.createElement('a')
      a.href = fileLink
      a.dispatchEvent(event)
    }
    filePreview (fileLink) {
      let event = new MouseEvent('click')
      let a = document.createElement('a')
      a.target = 'view_window'
      a.href = `https://view.officeapps.live.com/op/view.aspx?src=${fileLink}`
      a.dispatchEvent(event)
    }
    newWindow (link) {
      let event = new MouseEvent('click')
      let a = document.createElement('a')
      a.target = 'view_window'
      a.href = link
      a.dispatchEvent(event)
    }
  }
</script>
<style lang="scss" scoped>
  .file-content {
    background:rgba(245,247,250,1);
    border-radius:4px;
    margin-left: 40px;
    position: relative;
    padding: 8px;
    box-sizing: border-box;
    cursor: pointer;
    .icon-box {
      width: 46px;
      height: 46px;
      border-radius: 4px;
      display: inline-block;
      margin-right: 8px;
      overflow: hidden;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .file-infos {
      width: calc(100% - 54px - 70px);
      height: 46px;
      display: inline-block;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*justify-content: center;*/
      &.link {
        width: calc(100% - 62px);
        display: flex;
        align-items: center;
      }
    }
    .file-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      font-size:14px;
      font-weight:300;
      color:rgba(0,0,0,0.85);
      line-height: 1;
      margin-top: 5px;
      &.link {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        white-space: normal;
        line-height: 1.4;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .file-size {
      font-size:12px;
      font-weight:300;
      color:rgba(146,146,146,1);
      margin: 0;
      line-height: 1;
      margin-top: 8px;
    }
    .download-box {
      width: 70px;
      display: block;
      height: 46px;
      text-align: center;
      float: right;
      line-height: 46px;
      color: #666666;
    }
  }
  .bigFileBox {
    margin: 0;
    overflow: hidden;
    padding: 0 0 24px 0;
    border-bottom: 1px solid #EBEEF5;
    background: none;
    display: flex;
    align-items: center;
    .icon-box, .file-infos, .avatar, .user {
      float: left;
    }
    .file-infos {
      width: 406px !important;
    }
    .btnBox {
      float: right;
      color: #666666;
      font-size: 12px;
      .btn {
        margin-left: 40px;
        .icon {
          margin-right: 3px;
          vertical-align: -1px;
        }
      }
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 8px;
      margin-left: 99px;
    }
    .user {
      width: 144px;
      height: 32px;
      display: flex;
      flex-direction: column;
      color: #666666;
      justify-content: center;
      .name {
        font-size: 14px;
      }
      .date {
        font-size: 12px;
        color: #929292;
      }
    }
  }
</style>