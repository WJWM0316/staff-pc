/**
 * 状态信息相关处理
 */
import Vue from 'vue'

// 课程状态对应信息
const courseStatusOptions = {
  0: '上线',
  1: '下线'
}

// 课程状态过滤
Vue.filter('courseStatus', value => courseStatusOptions[value])

// 电子书状态对应信息
const bookStatusOptions = {
  0: '上线',
  1: '下线'
}

// 课程状态过滤
Vue.filter('bookStatus', value => bookStatusOptions[value])

// 文章状态对应信息
const articleStatusOptions = {
  0: '上线',
  1: '下线'
}

// 文章状态过滤
Vue.filter('articleStatus', value => articleStatusOptions[value])

// 投稿状态对应信息
const contributionStatusOptions = {
  1: '未联系',
  2: '已联系'
}

// 投稿状态过滤
Vue.filter('contributionStatus', value => contributionStatusOptions[value])

// 限时特惠状态对应信息
const flashsalesStatusOptions = {
  1: '进行中',
  2: '未开始',
  3: '已结束'
}

// 限时特惠状态过滤
Vue.filter('flashsalesStatus', value => flashsalesStatusOptions[value])

// 社区状态对应信息
const communityStatusOptions = {
  1: '未开始',
  2: '进行中',
  3: '已结束'
}

// 社区状态过滤
Vue.filter('communityStatus', value => communityStatusOptions[value])

// 社区状态对应信息
const operationalPositionStatus = {
  0: '未开始',
  1: '进行中',
  2: '已结束'
}

// 社区状态过滤
Vue.filter('operationalPositionStatus', value => operationalPositionStatus[value])

// 社区状态对应信息
const communityFreeJoinStatusOptions = {
  1: '未入社',
  2: '已入社'
}

// 社区状态过滤
Vue.filter('communityFreeJoinStatus', value => communityFreeJoinStatusOptions[value])

// 社区朋友圈对应信息
const communityCircleStatusOptions = {
  1: '有效',
  2: '无效',
  3: '已删除'
}

// 社区朋友圈过滤
Vue.filter('communityCircleStatus', value => communityCircleStatusOptions[value])

// 建塔申请状态对应信息
const communityCreateApplyStatusOptions = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过'
}

// 建塔申请状态过滤
Vue.filter('communityCreateApplyStatus', value => communityCreateApplyStatusOptions[value])

// 返回文件的类型封面 value 是文件的后缀
Vue.filter('fileCover', (value) => {
  if (!value) {
    return ''
  }
  if (value === 'doc' || value === 'docx') {
    return 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/word.png'
  } else if (value === 'xls' || value === 'xlsx') {
    return 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/xls.png'
  } else if (value === 'ppt' || value === 'pptx') {
    return 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/ppt.png'
  } else if (value === 'pdf') {
    return 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/pdf.png'
  } else {
    return 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181107163327.png'
  }
})