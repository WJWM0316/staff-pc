
export const routes = [
  {
    // 路由的路径
    path: '/',
    // 路由名称
    name: 'index',
    // 页面的标题
    title: '首页',
    // 引用的组件
    component: () => import(/* webpackChunkName: "index" */ '@/pages/index/index.vue'),
    // 元信息
    meta: {
      // 页面是否需要缓存
      keepAlive: false
    }
  },
  {
    // 路由的路径
    path: '/index',
    // 路由名称
    name: 'index',
    // 页面的标题
    title: '首页',
    // 引用的组件
    component: () => import(/* webpackChunkName: "index" */ '@/pages/index/index.vue'),
    // 元信息
    meta: {
      // 页面是否需要缓存
      keepAlive: false
    }
  }
]
