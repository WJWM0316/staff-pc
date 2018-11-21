
export const routes = [
  {
    path: '/',
    // 默认进入控制台
    redirect: {
      name: 'inidex'
    }
  },
  {
    path: '/index',
    name: 'index',
    title: '首页',
    component: () => import(/* webpackChunkName: "index" */ '@/pages/index/index.vue'),
  }
]
