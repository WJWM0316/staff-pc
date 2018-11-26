<template>
  <div class="search">
    <div class="condition">
      <div class="search-box">
        <span class="back"  @click="$router.back(-1)"><i class="icon font_family icon-fanhui"></i>返回</span>
        <span class="input-box">
          <input type="text" v-model="keyWord" placeholder="搜索文件名称或关键词">
          <div class="search-button" @click.stop="keyWordSearch"><i class="icon font_family el-icon-search"></i>搜索</div>
        </span>
        <el-popover
          placement="bottom-end"
          title="高级搜索"
          width="432"
          trigger="manual"
          v-model="visible"
          class="adSearch"
          >
          <el-button slot="reference" @click.native="visible = !visible">
            <div class="more">
              <i class="icon font_family icon-shaixuan"></i>
              <span>高级搜索</span>
            </div>
          </el-button>
          <slot>
            <adSearch :id="parseInt($route.query.id)" @closePopover="visible = !visible" @search="search"></adSearch>
          </slot>
        </el-popover>
      </div>
      <div class="search-type">
        <span class="fileType" v-for="(item, index) in typeList" :key="index" :class="{'cur': typeIndex === index}" @click.stop="toggle(index)">{{item}}</span>
      </div>
    </div>
    <div class="content">
      <div class="type" v-if="list.picture.length > 0 && (typeIndex === 1 || typeIndex === 0)">
        <div class="title">图片与视频<span class="more" v-show="this.typeIndex === 0" @click.stop="toggle(1)">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner pic" :class="{'more' : this.typeIndex !== 0}">
          <div class="picBox" v-for="(item, index) in list.picture" :key="index">
            <picOrVideo :fileData="item" @click.native="openPreview(index)"></picOrVideo>
          </div>
        </div>
        <div class="loadMore" v-show="this.typeIndex === 1">
          <loadMore @loadMore="loadMore" :status="picsStatus" :list="list.picture"></loadMore>
        </div>
      </div>
      <div class="type" v-if="list.file.length > 0 && (typeIndex === 2 || typeIndex === 0)">
        <div class="title">文件<span class="more" v-show="this.typeIndex === 0" @click.stop="toggle(2)">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner file">
          <div class="fileBox"  v-for="(item, index) in list.file" :key="index">
            <fileBox :fileData="item" type="2"></fileBox>
          </div>
        </div>
        <div class="loadMore" v-show="this.typeIndex === 2">
          <loadMore @loadMore="loadMore" :status="filesStatus" :list="list.file"></loadMore>
        </div>
      </div>
      <div class="type" v-if="list.urls.length > 0 && (typeIndex === 3 || typeIndex === 0)">
        <div class="title">链接<span class="more" v-show="this.typeIndex === 0" @click.stop="toggle(3)">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner file">
          <div class="fileBox" v-for="(item, index) in list.urls" :key="index">
            <fileBox :fileData="item" type="2"></fileBox>
          </div>
        </div>
        <div class="loadMore" v-show="this.typeIndex === 3">
          <loadMore @loadMore="loadMore" :status="linksStatus" :list="list.urls"></loadMore>
        </div>
      </div>
      <nodata v-if="list.picture.length === 0 && list.file.length === 0 && list.urls.length === 0"></nodata>
    </div>
    <preview v-if="isPreview" :previewList="list.picture" :curOpenIndex="curOpenIndex" @closePreview="closePreview"></preview>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import picOrVideo from 'COMPONENTS/picOrVideo'
import adSearch from 'COMPONENTS/adSearch'
import fileBox from 'COMPONENTS/fileBox'
import loadMore from 'COMPONENTS/loadMore'
import preview from 'COMPONENTS/preview'
import nodata from 'COMPONENTS/nodata'
import {getJobcirclePostaffixApi} from 'API/jobcircle'
@Component({
  components: {
    picOrVideo,
    preview,
    adSearch,
    fileBox,
    loadMore,
    nodata
  },
  watch: {
    typeIndex () {
      this.list = {
        picture: [],
        file: [],
        urls: []
      }
    },
    '$route' () {
      this.init()
    }
  }
})
export default class pageSearch extends Vue {
  keyWord = '' // 关键词
  isPreview = false // 打开预览层
  curOpenIndex = null // 预览的索引
  visible = false // 显示高级搜索框
  typeIndex = 0 // 选择的搜索类型
  typeList = ['全部', '相册', '文件', '链接']
  list = {
    picture: [],
    file: [],
    urls: []
  }
  picsStatus = {
    noData: false,
    loading: false,
    page: 1
  }
  filesStatus = {
    noData: false,
    loading: false,
    page: 1
  }
  linksStatus = {
    noData: false,
    loading: false,
    page: 1
  }
  toggle (index) {
    this.typeIndex = index
    let params = this.$route.query
    switch (this.typeIndex) {
      case 0:
        params.type = [2,3,4]
        break
      case 1:
        params.type = [3]
        break
      case 2:
        params.type = [2]
        break
      case 3:
        params.type = [4]
        break
    }
    this.getListData(params)
  }
  search (params) {
    this.getListData(params)
  }
  keyWordSearch () {
    if (this.keyWord === '') return
    let data = this.$route.query
    data.keyword = this.keyWord
    this.getListData(data)
  }
  openPreview (index) {
    this.isPreview = true
    this.curOpenIndex = index
  }
  closePreview () {
    this.isPreview = false
  }
  getListData (params) {
    let data = {}
    if (params) {
      data = params
    } else {
      data = this.$route.query
      data.type = data.type.split(',')
    }
    if (this.typeIndex === 0) {
      data.count = 7
    } else {
      data.count = 20
    }
    getJobcirclePostaffixApi(data).then(res => {
      switch (this.typeIndex) {
        case 1:
          this.list.picture = this.list.picture.concat(res.data.data.picture)
          this.picsStatus.loading = false
          if (res.data.data.picture.length === 0) {
            this.picsStatus.noData = true
          }
          break
        case 2:
          this.list.file = this.list.file.concat(res.data.data.file)
          this.filesStatus.loading = false
          if (res.data.data.file.length === 0) {
            this.filesStatus.noData = true
          }
          break
        case 3:
          this.list.urls = this.list.urls.concat(res.data.data.urls)
          this.linksStatus.loading = false
          if (res.data.data.urls.length === 0) {
            this.linksStatus.noData = true
          }
          break
        default:
          this.list = res.data.data
      }
    })
  }
  loadMore () {
    let data = this.$route.query
    switch (this.typeIndex) {
      case 1:
        this.picsStatus.page++
        this.picsStatus.loading = true
        data.page = this.picsStatus.page
        break
      case 2:
        this.filesStatus.page++
        this.filesStatus.loading = true
        data.page = this.filesStatus.page
        break
      case 3:
        this.linksStatus.page++
        this.linksStatus.loading = true
        data.page = this.linksStatus.page
        break
    }
    this.getListData(data)
  }
  init () {
    switch (this.$route.query.type) {
      case '3':
        this.typeIndex = 1
        break
      case '2':
        this.typeIndex = 2
        break
      case '4':
        this.typeIndex = 3
        break
      default:
        this.typeIndex = 0
        break
    }
    this.getListData()
  }
  created () {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
  .search {
    width: 1000px;
    margin: 0 auto;
    .condition {
      background: #fff;
      .search-box {
        padding: 18px 24px;
        line-height: 40px;
        font-size: 0;
        .back {
          font-size: 14px;
          color: #666666;
          .icon {
            font-size: 12px;
            margin-right: 5px;
            font-weight: bold;
          }
        }
        .input-box {
          width: 780px;
          border: 1px solid #EBEEF5;
          border-radius: 4px;
          display: inline-block;
          margin-left: 24px;
          height: 40px;
          padding: 0 64px 0 16px;
          box-sizing: border-box;
          position: relative;
          input {
            width: 100%;
            height: 100%;
            border: none;
            padding: 0;
          }
          .search-button {
            width: 58px;
            height: 38px;
            display: block;
            z-index: 1;
            position: absolute;
            top: 0;
            right: 0;
            float: right;
            text-align: center;
            line-height: 38px;
            color: #666666;
            display: flex;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .adSearch {
          button {
            padding: 0;
            border: none;
          }
          font-size: 14px;
          font-weight: 500;
          color: #666666;
          float: right;
          .icon {
            margin-right: 5px;
          }
        }
      }
      .search-type {
        font-size: 0;
        .fileType {
          width: 88px;
          height: 46px;
          display: inline-block;
          line-height: 46px;
          text-align: center;
          font-size: 14px;
          color: #354048;
          cursor: pointer;
          &.cur {
            font-weight: 700;
            position: relative;
            &::after {
              width: 24px;
              height: 2px;
              content: '';
              position: absolute;
              left: 50%;
              margin-left: -12px;
              bottom: 0;
              background: #FFE266;
            }
          }
        }
      }
    }
    .content {
      background: #fff;
      margin-top: 16px;
      padding-top: 43px;
      .type {
        padding-bottom: 43px;
        .title {
          font-size: 20px;
          font-weight: 400;
          line-height: 40px;
          color: #666666;
          padding: 0 24px 0 23px;
          box-shadow:0px 1px 0px 0px rgba(235,238,245,1);
          .more {
            float: right;
            font-size: 14px;
            color: #666666;
            cursor: pointer;
            .icon {
              font-size: 12px;
              vertical-align: 1px;
            }
          }
        }
        .inner {
          overflow: hidden;
          padding: 0 25px;
          &.pic {
            padding: 0 21px;
          }
          &.file {
            padding: 1px 0 0;
          }
          .picBox {
            width: 130px;
            height: 130px;
            float: left;
            margin: 24px 8px 0 0;
            &:nth-child(7n) {
              margin: 24px 0 0 0;
            }
          }
          &.more {
            padding-top: 24px;
            .picBox {
              margin: 0 8px 8px 0;
              &:nth-child(7n) {
                margin: 0 0 8px 0;
              }
            }
          }
          .fileBox {
            padding: 24px 32px 0 25px;
            background: #fff;
            &:hover {
              background: #F8F8F8;
            }
          }
        }
      }
    }
  }
</style>