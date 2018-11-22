<template>
  <div class="priview" ref="priview" @mousemove="mousemoveFun" @click.stop="toggle" :class="cursorClass">
    <div class="wrap">
      <div class="swiper-container listBox">
        <div class="swiper-wrapper">
          <div class="swiper-slide imgBox swiper-no-swiping" v-for="(item, index) in pickList" :key="index">
            <template v-if="item.fileInfo">
              <img v-if="item.type === '图片'" :src="item.fileInfo.url" class="imgShow" :class="item.fileInfo.width > item.fileInfo.height ? 'horizontal' : 'vertical'">
              <video class="video" v-else :src="item.fileInfo.url" controls="controls"></video>
            </template>
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="inner">
          <div class="item prev" :class="{'disabled': noLastMonth}" @click.stop="lastMonth">上个月</div>
          <div class="item iconfont" :class="{'disabled': noPrev}" @click.stop="prevOne"><i class="icon font_family icon-loeft_up"></i></div>
          <div class="swiper-container littleList">
            <div class="swiper-wrapper littleBox">
              <div class="swiper-slide imgBox swiper-no-swiping" :class="{'cur': curIndex === index}" v-for="(item, index) in pickList" :key="index" @click.stop="slideTo(index)">
                <template v-if="item.fileInfo">
                  <img v-if="item.type === '图片'" :src="item.fileInfo.url" class="imgShow">
                  <div v-else class="videoMask">
                    <video class="video" :src="item.fileInfo.url"></video>
                    <div class="btn">
                      <i class="icon font_family icon-play"></i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="item" :class="{'disabled': noNext}" @click.stop="lastOne"><i class="icon font_family icon-loeft_down"></i></div>
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
import {getPicMonthListJobci1rcleApi, getPicListJobci1rcleApi} from 'API/jobcircle'
@Component({
  watch: {
    curIndex (val) {
      this.swiperBig.slideTo(val)
      this.swiperLittle.slideTo(val)
      if (this.curIndex === 0 || this.curIndex === this.pickList.length - 1) {
        this.cursorClass = ''
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
  curIndex = 0 // 当前索引
  monthList = []
  curMonthIndex = 0 // 当前月份索引
  pickList = [] // 图片列表
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
  toggle () {
    if (this.cursorClass === 'nextOne') {
      this.swiperBig.slideNext()
    } else if (this.cursorClass === 'lastOne') {
      this.swiperBig.slidePrev()
    }
    this.curIndex = this.swiperBig.activeIndex
  }
  prevOne () {
    if (!this.noPrev) {
      this.curIndex--
      if (this.curIndex < 0) {
        this.lastMonth()
      }
    }
  }
  lastOne () {
    if (!this.noNext) {
      if (this.curIndex > this.pickList.length - 1) {
        this.curMonthIndex++
        this.getPicList('nextMonth')
      } else {
        this.curIndex++
      }
    }
  }
  slideTo (index) {
    this.curIndex = index
  }
  async getPicList (type) {
    let data = {
      id: this.$route.query.id,
      month: this.monthList[this.curMonthIndex].month
    }
    let res = await getPicListJobci1rcleApi(data)
    if (type === 'jumpMonth') {
      this.curIndex = 0
      this.pickList = res.data.data
    } else {
      this.pickList = this.pickList.concat(res.data.data)
    }
    this.$nextTick(() => {
      this.swiperBig.update()
      this.swiperLittle.update()
      setTimeout(() => {
        if (type === 'nextMonth') {
          this.curIndex++
        }
      }, 500)
    })
  }
  async created () {
    let data = {
      id: this.$route.query.id
    }
    let res = await getPicMonthListJobci1rcleApi(data)
    this.monthList = res.data.data.reverse()
    this.getPicList()
  }
  mounted () {
    this.swiperBig = new Swiper ('.listBox', {
      speed: 300,
      noSwiping : true,
      direction: 'vertical'
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
  background: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  z-index: 1;
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
        .video {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          width: auto;
          height: 100%;
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