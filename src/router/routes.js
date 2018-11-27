
export const routes = [
  {
    path: '/',
    // 默认进入控制台
    redirect: {
      name: 'index'
    }
  },
  {
    path: '/index',
    name: 'index',
    title: '首页',
    component: () => import(/* webpackChunkName: "index" */ '@/pages/index/index.vue'),
  },
  {
    path: '/search',
    name: 'search',
    title: '搜索',
    component: () => import('@/pages/search/index.vue'),
  },
  {
    path: '/jobcircle-edit',
    name: 'jobCircleUpdate',
    title: '工作圈设置',
    component: () => import(/* webpackChunkName: "jobCircleUpdate" */ '@/pages/jobCircle/update/index.vue'),
  },
  {
    path: '/test',
    name: 'test',
    title: '首页',
    component: () => import(/* webpackChunkName: "test" */ '@/pages/test/index.vue'),
  },
  {
    path: '*',
    // 默认进入控制台
    redirect: {
      name: 'index'
    }
  },
]
