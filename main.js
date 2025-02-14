
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'

Vue.config.productionTip = false

App.mpType = 'app'
// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 导入第三方网络请求包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http

// 请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中。。。'
	})
}

// 响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 2000) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}


const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import { func } from 'prop-types'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif