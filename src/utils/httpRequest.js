import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 請求攔截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 請求頭带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 響應攔截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 請求地址處理
 * @param {*} actionName action 方法名稱
 */
http.adornUrl = (actionName) => {
  // 非生產環境 && 開啟代理, 接口前缀统一使用 [/proxyApi/] 前缀做代理攔截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get請求参數處理
 * @param {*} params 参數物件
 * @param {*} openDefultParams 是否開啟默認参數?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post請求資料處理
 * @param {*} data 資料物件
 * @param {*} openDefultdata 是否開啟默認資料?
 * @param {*} contentType 資料格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
