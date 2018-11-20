const webpack = require('webpack')
const path = require('path')
const resolve  = dir => { return path.join(__dirname, dir) }

module.exports = {
	lintOnSave: false,
	baseUrl: process.env.NODE_ENV === 'production' ? `/${process.env.VUE_APP_COMPANY}` : '/',
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
  	resolve: {
	    alias: {
	      '@': resolve('src'),
	      'IMAGES': resolve('src/assets/images'),
	      'ICONFONT' : resolve('src/assets/iconfont'),
	      'MYFONT' : resolve('src/assets/myfont'),
	      'UTILS': resolve('src/utils'),
	      'API' : resolve('src/store/api'),
	      'STORE' : resolve('src/store'),
	      'COMPONENTS' : resolve('src/components')
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
  }
}