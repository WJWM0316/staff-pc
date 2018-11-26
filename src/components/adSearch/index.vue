<template>
  <div class="searchBox">
    <div class="form">
      <div class="item">
        <span class="txt">关键词：</span>
        <input class="keyInPut" v-model="keyWord" type="text" placeholder="搜索文件、名称、链接">
      </div>
      <div class="item">
        <span class="txt">时间轴：</span>
        <el-date-picker
          v-model="keyTime"
          :editable='false'
          class="monthInPut"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </div>
      <div class="item">
        <span class="txt">类型：</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="3">相册</el-checkbox>
          <el-checkbox label="2">文件</el-checkbox>
          <el-checkbox label="4">链接</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="btnBox">
        <span class="sure" @click.stop="search">搜索</span>
        <span class="close" @click.stop="close">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    keyTime (val) {
      console.log(val)
    }
  }
})
export default class ComponentAdSearch extends Vue {
  checkList = [] // 筛选类型
  keyWord = '' // 搜索关键词
  keyTime = '' // 搜索时间范围
  close () {
    this.$emit('closePopover')
  }
  search () {
    let parmas = `id=${this.id}&keyword=${this.keyWord}&month=${this.keyTime}&type=${this.checkList}`
    this.$router.push(`/search?${parmas}`)
    this.$emit('search', {id: this.id, keyword: this.keyWord, month: this.keyTime, type: this.checkList})
    this.close()
  }
}
</script>
<style lang="scss">
.searchBox {
  .form {
    padding-top: 40px;
    border-top: 1px solid #F5F7FA;
    font-size: 14px;
    .item {
      font-size: 0;
      margin-bottom: 16px;
      .txt {
        width: 56px;
        font-size: 14px;
        line-height: 22px;
        color: #666666;
        display: inline-block;
        text-align: right;
      }
      .keyInPut {
        width: 300px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        padding-left: 8px;
        box-sizing: border-box;
      }
      .monthInPut {
        width: 300px;
        height: 32px;
        .el-input__inner {
          height: 100%;
          line-height: 1;
          border: 1px solid #EBEEF5;
          font-size: 14px;
        }
        .el-input__icon {
          line-height: 1;
        }
      }
      .el-checkbox-group {
        width: 300px;
        height: 32px;
        display: inline-block;
        .el-checkbox__inner {
          border-radius: 50%;
        }
        .el-checkbox__label {
          color: #D7AB70;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #D7AB70;
          border-color: #D7AB70;
        }
      }
    }
    .btnBox {
      margin-left: 56px;
      span {
        width: 64px;
        height: 32px;
        line-height: 32px;
        background: #FFE266;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        box-sizing: border-box;
        border-radius: 4px;
        cursor: pointer;
        &.close {
          background: #fff;
          margin-left: 16px;
          border: 1px solid #D9D9D9;
        }
      }
    }
  }
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #BCBCBC;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
     color: #BCBCBC;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
     color: #BCBCBC;
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
     color: #BCBCBC;
  }
}
</style>