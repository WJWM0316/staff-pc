<template>
  <div class="search">
    <div class="condition" v-if="false">
      <div class="search-box">
        <span class="back"><i class="icon font_family icon-fanhui"></i>返回</span>
        <span class="input-box">
          <input type="text" placeholder="搜索文件名称或关键词">
          <div class="search-button"><i class="icon font_family el-icon-search"></i>搜索</div>
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
            <adSearch :id="parseInt($route.query.id)" @closePopover="visible = !visible"></adSearch>
          </slot>
        </el-popover>
      </div>
      <div class="search-type">
        <span class="fileType" v-for="(item, index) in typeList" :key="index" :class="{'cur': typeIndex === index}">{{item}}</span>
      </div>
    </div>
    <div class="content">
      <div class="type" v-if="list.picture.length > 0">
        <div class="title">图片与视频<span class="more" v-if="false">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner pic">
          <div class="picBox" v-for="(item, index) in list.picture" :key="index">
            <picOrVideo :fileData="item"></picOrVideo>
          </div>
        </div>
      </div>
      <div class="type" v-if="list.file.length > 0">
        <div class="title">文件<span class="more" v-if="false">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner file">
          <div class="fileBox"  v-for="(item, index) in list.file" :key="index">
            <fileBox :fileData="item" type="2"></fileBox>
          </div>
        </div>
      </div>
      <div class="type" v-if="list.urls.length > 0">
        <div class="title">链接<span class="more" v-if="false">查看更多<i class="icon font_family icon-gengduo"></i></span></div>
        <div class="inner file">
          <div class="fileBox" v-for="(item, index) in list.urls" :key="index">
            <fileBox :fileData="item" type="2"></fileBox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import picOrVideo from 'COMPONENTS/picOrVideo'
import adSearch from 'COMPONENTS/adSearch'
import fileBox from 'COMPONENTS/fileBox'
import {getJobcirclePostaffixApi} from 'API/jobcircle'
@Component({
  components: {
    picOrVideo,
    adSearch,
    fileBox
  }
})
export default class pageSearch extends Vue {
  visible = false // 显示高级搜索框
  typeIndex = 0 // 选择的搜索类型
  typeList = ['全部', '相册', '文件', '链接']
  list = {
    picture: [],
    file: [],
    urls: []
  }
  getListData () {
    let data = this.$route.query
    getJobcirclePostaffixApi(data).then(res => {
      this.list = res.data.data
    })
  }
  created () {
    this.getListData()
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
      .type {
        .title {
          font-size: 20px;
          font-weight: 400;
          line-height: 40px;
          color: #666666;
          padding: 43px 24px 0 23px;
          box-shadow:0px 1px 0px 0px rgba(235,238,245,1);
          .more {
            float: right;
            font-size: 14px;
            color: #666666;
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
            &:last-child {
              margin: 24px 0 0 0;
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