<template>
  <div class="priview" ref="priview" @mousemove="mousemoveFun" @click.stop="toggle" :class="cursorClass">
    <div class="closeBtn">
      <i class="icon font_family"></i>
    </div>
    <div class="wrap">
      <div class="swiper-container listBox">
        <div class="swiper-wrapper">
          <div class="swiper-slide imgBox swiper-no-swiping" v-for="(item, index) in pickList" :key="index">
            <template v-if="item.fileInfo">
              <template v-if="item.type === '图片'" >
                <img :data-src="item.fileInfo.url" class="imgShow swiper-lazy" :class="item.fileInfo.width > item.fileInfo.height ? 'horizontal' : 'vertical'">
                <div class="swiper-lazy-preloader"></div>
              </template>
              <template v-else>
                <div class="videoPost" v-if="curVideoIndex !== index" @click.stop="playVideo(index)">
                  <img :src="item.fileInfo.coverImg.url" alt="">
                  <div class="btn">
                    <i class="icon font_family icon-play"></i>
                  </div>
                </div>
                <video class="video" v-else :src="item.fileInfo.url" controls="controls" ref="video"></video>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="inner">
          <div class="item prev" :class="{'disabled': noLastMonth}" @click.stop="lastMonth">上个月</div>
          <div class="item iconfont" :class="{'disabled': noPrev}" @click.stop="lastOne"><i class="icon font_family icon-loeft_up"></i></div>
          <div class="swiper-container littleList">
            <div class="swiper-wrapper littleBox">
              <div class="swiper-slide imgBox swiper-no-swiping" :class="{'cur': curIndex === index}" v-for="(item, index) in pickList" :key="index" @click="slideTo(index)">
                <template v-if="item.fileInfo">
                  <img v-if="item.type === '图片'" :src="item.fileInfo.smallUrl" class="imgShow">
                  <div v-else class="videoMask" @click="playVideo(index)">
                    <img class="video" :src="item.fileInfo.coverImg.url">
                    <div class="btn">
                      <i class="icon font_family icon-play"></i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="item" :class="{'disabled': noNext}" @click.stop="nextOne"><i class="icon font_family icon-loeft_down"></i></div>
          <div class="item last" :class="{'disabled': noNextMonth}" @click.stop="nextMonth">下个月</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Swiper from 'swiper';
import {getPicMonthListJobci1rcleApi, getJobcirclePostaffixOfPictureApi} from 'API/jobcircle'
@Component({
  watch: {
    curIndex (val) {
      this.swiperBig.slideTo(val)
      this.swiperLittle.slideTo(val)
      if ((this.curIndex === this.pickList.length - 1 && this.noNextData && this.noNextMonth) || (this.curIndex === 0 && this.noPrevData && this.noPrevMonth)) {
        this.$message({
          showClose: true,
          message: `已经是最后一张了哦~`
        })
      }
    }
  },
  computed: {
    noPrev () {
      if (this.curIndex === 0 && this.noLastMonth) {
        return true
      } else {
        return false
      }
    },
    noNext () {
      if (this.curIndex === this.pickList.length - 1 && this.noNextMonth) {
        return true
      } else {
        return false
      }
    },
    noLastMonth () {
      if (this.curMonthIndex === 0) {
        return true
      } else {
        return false
      }
    },
    noNextMonth () {
      if (this.curMonthIndex === this.monthList.length - 1) {
        return true
      } else {
        return false
      }
    }
  }
})
export default class ComponentPreview extends Vue {
  cursorClass = '' // 手势类名
  imgType = ''
  swiperBig = null // 跑马灯对象
  swiperLittle = null // 跑马灯对象
  curVideoIndex = null // 当前播放视频的序号
  curIndex = 0 // 当前索引
  monthList = [] // 月份列表
  noLoadMonthList = [] // 还没有加载的月份列表
  curMonthIndex = 0 // 当前月份索引
  pageNum = 1 // 分页页码
  noPrevData = false // 当月是否还有上一页数据
  noNextData = false // 当月是否还有下一页数据
  pickList = [] // 图片列表
  isLoging = false
  lastMonth () {
    if (!this.noLastMonth) {
      this.curMonthIndex--
      this.getPicList('jumpMonth')
    }
  }
  nextMonth () {
    if (!this.noNextMonth) {
      this.curMonthIndex++
      this.getPicList('jumpMonth')
    }
  }
  playVideo (index) {
    this.curVideoIndex = index
    this.$nextTick(() => {
      this.$refs.video[index].play()
    })
  }
  mousemoveFun (e) {
    if (e.clientY > this.$refs.priview.clientHeight / 2) {
      if (!this.noNext) {
        this.cursorClass = 'nextOne'
      } else {
        this.cursorClass = ''
      }
    } else {
      if (!this.noPrev) {
        this.cursorClass = 'lastOne'
      } else {
        this.cursorClass = ''
      }
    }
  }
  preloadImages (type) {
    if (this.isLoging) return // 正常加载的时候阻止掉
    if (type === 'next') {
      if (this.curIndex >= this.pickList.length - 4 && this.noNextData && !this.noNextMonth) { // 提前三张判断，没有下一页数据，切还有下个月，则加载下一个月
        this.pageNum = 1
        this.curMonthIndex++
        this.getPicList('nextMonth')
      } else if (this.curIndex >= this.pickList.length - 4 && !this.noNextData) { // 提前三张判断，有下一页数据，则加载下一页数据
        this.pageNum++
        this.curIndex++
        this.getPicList('nextPage')
      }
    } else {
      if (this.curIndex <= 3 && this.noPrevData && !this.noPrevMonth) { // 提前三张判断，没有上一页数据，切还有上个月，则加载上一个月
        this.pageNum = 1
        this.curMonthIndex--
        let oldNum = this.pickList.length
        this.getPicList('lastMonth', oldNum)
      } else if (this.curIndex <= 3 && !this.noPrevData) { // 提前三张判断，有上一页数据，则加载上一页数据
        this.pageNum--
        this.curIndex--
        this.getPicList('prevPage', oldNum)
      }
    }
  }
  toggle () {
    if (this.cursorClass === 'nextOne') {
      this.nextOne()
    } else if (this.cursorClass === 'lastOne') {
      this.lastOne()
    }
  }
  lastOne () {
    if (!this.noPrev) {
      if (this.curIndex > 0) {
        this.curIndex--
      }
      this.preloadImages('last')
    }
  }
  nextOne () {
    if (!this.noNext) {
      if (this.curIndex < this.pickList.length - 1) {
        this.curIndex++
      }
      this.preloadImages('next')
    }
  }
  slideTo (index) {
    this.preloadImages('next')
    this.curIndex = index
  }
  async getPicList (type, oldNum) {
    let data = {
      id: this.$route.query.id,
      page: this.pageNum,
      month: this.monthList[this.curMonthIndex].month
    }
    if (!type) {
      data.globalLoading = true
    }
    this.isLoging = true
    let res = await getJobcirclePostaffixOfPictureApi(data)
    this.isLoging = false
    if (res.data.meta) {
      if (!res.data.meta.nextPageUrl) {
        this.noNextData = true
      }
      if (!res.data.meta.prevPageUrl) {
        this.noPrevData = true
      }
    }
    if (type === 'jumpMonth') {
      this.curIndex = 0
      this.pickList = res.data.data
      this.$message({
        showClose: true,
        message: `当前查看为${this.monthList[this.curMonthIndex].str}的相册`
      })
    } else if (type === 'lastMonth' || type === 'prevPage') {
      this.pickList = res.data.data.concat(this.pickList)
    } else {
      this.pickList = this.pickList.concat(res.data.data)
    }
    this.$nextTick(() => {
      this.swiperBig.update()
      this.swiperLittle.update()
      setTimeout(() => {
        if (type === 'nextMonth') {
          this.curIndex++
          this.$message({
            showClose: true,
            message: `当前查看为${this.monthList[this.curMonthIndex].str}的相册`
          })
        } else if (type === 'lastMonth') {
          this.curIndex = this.pickList.length - oldNum - 1
          this.$message({
            showClose: true,
            message: `当前查看为${this.monthList[this.curMonthIndex].str}的相册`
          })
        }
      }, 300)
    })
    // 加载月份数据的时候在noLoadMonthList去除当前月
    if (type === 'jumpMonth' || type === 'lastMonth' || type === 'nextMonth') {
      this.noLoadMonthList.replace(this.curMonthIndex, 1)
    }
  }
  async created () {
    let data = {
      id: this.$route.query.id
    }
    let res = await getPicMonthListJobci1rcleApi(data)
    this.monthList = res.data.data.reverse()
    this.noLoadMonthList = this.monthList
    this.getPicList()
  }
  mounted () {
    this.swiperBig = new Swiper ('.listBox', {
      speed: 300,
      noSwiping: true,
      direction: 'vertical',
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 10
      }
    })
    this.swiperLittle = new Swiper ('.littleList', {
      speed: 300,
      slidesPerView: 6,
      noSwiping : true,
      direction: 'vertical'
    })
  }
}
</script>
<style lang="scss" scoped>
@import url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/swiper.min.css');
.priview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  z-index: 10;
  &.nextOne {
    cursor: url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/arrow_down.png'), pointer;
  }
  &.lastOne {
    cursor: url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/arrow_up.png'), pointer;
  }
  .wrap {
    width: 1040px;
    height: 616px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -308px 0 0 -507px;
    overflow: hidden;
    .listBox {
      width: 934px;
      height: 100%;
      float: left;
      .imgBox {
        width: 934px;
        height: 100%;
        overflow: hidden;
        .imgShow {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          &.vertical {
            width: auto;
            height: 100%;
          }
          &.horizontal {
            width: 100%;
            height: auto;
          }
        }
        .video, .videoPost {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: auto;
          height: 100%;
          .btn {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #F8F8F8;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -40px 0 0 -40px;
            display: flex;
            align-items: center;
            justify-content: center;
            .icon {
              font-size: 24px;
              color: #354048;
            }
          }
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
    .sidebar {
      float: right;
      width: 64px;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;
      .inner {
        .item {
          width: 100%;
          height: 24px;
          line-height: 24px;
          color: #354048;
          background: #ffffff;
          font-size: 14px;
          text-align: center;
          border-radius: 2px;
          &:hover {
            background: #FFE266;
            color: #354048;
          }
          &.disabled {
            background: #666666;
            color: #929292;
          }
          &.prev {
            margin-bottom: 24px;
          }
          &.last {
            margin-top: 24px;
          }
        }
        .littleList {
          width: 100%;
          max-height: 420px;
          overflow: hidden;
          margin-top: 6px;
          .imgBox {
            width: 100%;
            height: 64px !important;
            overflow: hidden;
            margin-bottom: 6px;
            &::before {
              content: '';
              width: 100%;
              height: 64px;
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.5);
            }
            &:hover {
              &::before {
                display: none;
              }
            }
            &.cur {
              .imgShow, .videoMask {
                border: 1px solid #FFE266;
              }
              &::before {
                display: none;
              }
            }
            .imgShow, .videoMask {
              width: 100%;
              height: 64px;
              display: block;
              border-radius: 2px;
              box-sizing: border-box;
              overflow: hidden;
              background: url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/login.png') center center;
              background-size: 100% 100%;
            }
            .videoMask {
              background: #000;
              position: relative;
              .video {
                width: 100%;
                height: 64px;
                display: block;
              }
              .btn {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #F8F8F8;
                position: absolute;
                top: 50%;
                left: 50%;
                margin: -12px 0 0 -12px;
                display: flex;
                align-items: center;
                justify-content: center;
                .icon {
                  font-size: 10px;
                  color: #354048;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>