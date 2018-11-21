<template>
  <div class="priview">
    <div class="wrap">
      <el-carousel height="616px" :autoplay='false' class="listBox" indicator-position='none'>
        <el-carousel-item v-for="item in list" :key="item" class="imgBox">
          <img :src="item" class="imgShow" :class="{'vertical' : imgType === 'vertical', 'horizontal' : imgType === 'horizontal'}" @load="imgLoad">
        </el-carousel-item>
      </el-carousel>
      <div class="sidebar">
        <div class="inner">
          <div class="item">上个月</div>
          <div class="littleList">
            <ul class="littleBox">
              <li class="imgBox" v-for="item in list" :key="item">
                <img :src="item" class="imgShow">
              </li>
            </ul>
          </div>
        <div class="item">下个月</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({})
export default class ComponentPreview extends Vue {
  imgType = ''
  list = ['http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9836dab054.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9834b54cf0.jpg!330xauto', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd98050b5e1a.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807b777f7.jpeg', 'http://attach.xplus.ziwork.com/test/img/2018/1031/18/5bd9807c89e42.jpeg']
  imgLoad (e) {
    if (e.target.clientWidth / e.target.clientHeight > 1) {
      this.imgType = 'horizontal'
    } else {
      this.imgType = 'vertical'
    }
  }
}
</script>
<style lang="scss" scoped>
.priview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1;
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
      float: left;
      .imgBox {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        .imgShow {
          display: block;
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
      .inner {
        .littleList {
          width: 100%;
          max-height: 424px;
          overflow: hidden;
          .imgBox {
            width: 100%;
            height: 64px;
            margin-bottom: 8px;
            .imgShow {
              width: 100%;
              height: 64px;
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>