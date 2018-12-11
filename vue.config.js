const webpack = require('webpack')
const path = require('path')
const resolve  = dir => { return path.join(__dirname, dir) }

module.exports = {
	lintOnSave: false,
	baseUrl: process.env.NODE_ENV === 'development' ? '/' : '',
  configureWebpack: {
  	entry: {
	    vendors: [
	      'vue',
	      'vue-router',
	      'axios',
	      'vuex'
	    ],
	    eleui: [ resolve('src/eleui/index.js') ]
  	},
  	// 确保一下库不会打包到bundle中，并使用cdn 减小第三方库的打包体积,可快速打开网页  测试有效
    // externals: {
    //   'axios':'axios',
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex',
    //   'jquery': 'jquery',
    //   'swiper': 'swiper',
    //   'clipboard': 'clipboard',
    //   'echarts': 'echarts',
    // },
  	resolve: {
	    alias: {
	      '@': resolve('src'),
	      'IMAGES': resolve('src/assets/images'),
	      'ICONFONT' : resolve('src/assets/iconfont'),
	      'MYFONT' : resolve('src/assets/myfont'),
	      'UTILS': resolve('src/utils'),
	      'API' : resolve('src/store/api'),
	      'STORE' : resolve('src/store'),
	      'COMPONENTS' : resolve('src/components'),
	      'COLORS' : resolve('src/eleui/colors')
	    }
	  },
    plugins: [
      new webpack.ProvidePlugin({
	      mapActions: ['vuex', 'mapActions'],
	      mapMutations: ['vuex', 'mapMutations'],
	      mapGetters: ['vuex', 'mapGetters'],
	      mapState: ['vuex', 'mapState']
	    })
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/variables.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  }
}