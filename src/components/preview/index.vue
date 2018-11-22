<template>
  <div class="priview" ref="priview" @mousemove="mousemoveFun" @click.stop="toggle" :class="cursorClass">
    <div class="wrap">
      <div class="swiper-container listBox">
        <div class="swiper-wrapper">
          <div class="swiper-slide imgBox swiper-no-swiping" v-for="(item, index) in list" :key="index">
            <img :src="item" class="imgShow" :class="imgType" @load="imgLoad">
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="inner">
          <div class="item prev" :class="{'disabled': noPrev}">上个月</div>
          <div class="item iconfont" :class="{'disabled': noPrev}" @click.stop="prevOne"><i class="icon font_family icon-loeft_up"></i></div>
          <div class="swiper-container littleList">
            <div class="swiper-wrapper littleBox">
              <div class="swiper-slide imgBox swiper-no-swiping" :class="{'cur': curIndex === index}" v-for="(item, index) in list" :key="index" @click.stop="slideTo(index)">
                <img :src="item" class="imgShow">
              </div>
            </div>
          </div>
          <div class="item" :class="{'disabled': noNext}" @click.stop="lastOne"><i class="icon font_family icon-loeft_down"></i></div>
          <div class="item last" :class="{'disabled': noNext}">下个月</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Swiper from 'swiper';
import {getPicMonthListJobci1rcleApi} from 'API/jobcircle'
@Component({
  watch: {
    curIndex (val) {
      this.swiperBig.slideTo(val)
      this.swiperLittle.slideTo(val)
      if (this.curIndex === 0 || this.curIndex === this.list.length - 1) {
        this.cursorClass = ''
      }
    }
  },
  computed: {
    noPrev () {
      if (this.curIndex === 0) {
        return true
      } else {
        return false
      }
    },
    noNext () {
      if (this.curIndex === this.list.length - 1) {
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
  list = ['http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9836dab054.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9834b54cf0.jpg!330xauto', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd98050b5e1a.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807b777f7.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807c89e42.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9836dab054.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9834b54cf0.jpg!330xauto', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd98050b5e1a.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807b777f7.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807c89e42.jpeg']
  imgLoad (e) {
    if (e.target.clientWidth / e.target.clientHeight > 1) {
      this.imgType = 'vertical'
    } else {
      this.imgType = 'horizontal'
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
    }
  }
  lastOne () {
    if (!this.noNext) {
      this.curIndex++
    }
  }
  slideTo (index) {
    this.curIndex = index
  }
  async created () {
    let data = {
      id: this.$route.query.id
    }
    let res = await getPicMonthListJobci1rcleApi(data)
    console.log(res)
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
            height: 64px;
            overflow: hidden;
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
              .imgShow {
                border: 1px solid #FFE266;
              }
              &::before {
                display: none;
              }
            }
            .imgShow {
              width: 100%;
              height: 64px;
              display: block;
              border-radius: 2px;
              box-sizing: border-box;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>