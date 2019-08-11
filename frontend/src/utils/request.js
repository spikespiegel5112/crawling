import axios from 'axios'
// import { MessageBox } from 'element-ui'
import store from '../store/store'
import { getToken } from '@/utils/auth'

const baseUrl = process.env.NODE_ENV === 'production' ? 'http://antisony.org:3001/' : 'http://localhost:3001/'
// const baseUrl = 'http://crawler.antisony.org:3001/'

// 创建axios实例
const service = axios.create({
  baseURL: baseUrl,
  // api的base_url
  timeout: 5000, // 请求超时时间
  // transformRequest: [function(data) {
  //   // Do whatever you want to transform the data
  //   let ret = '';
  //   for (const it in data) {
  //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  //   }
  //   return ret
  // }],
  headers: {
    // 'Content-Type': 'application/json;charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    console.log(store.getters.token)

    // config.headers['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
    // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const result_response = error.response

    // if (result_response.status && result_response.status === 401) {
    //   store.dispatch('FedLogOut').then(() => {
    //     location.reload()// 为了重新实例化vue-router对象 避免bug
    //   })
    //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     confirmButtonText: '重新登录',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('FedLogOut').then(() => {
    //       location.reload()// 为了重新实例化vue-router对象 避免bug
    //     })
    //   })
    // }

    console.log('err' + error)// for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
export { baseUrl }
