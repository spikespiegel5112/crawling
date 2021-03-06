import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import service, { baseUrl } from './utils/request'
import moment from 'moment'
import '@/styles/index.scss' // global css
import './assets/simditor/styles/simditor.scss'

import App from './App'
import router from './router/router'
import { autoComplete, layout, row } from 'vue-beauty'
import 'vue-beauty/package/style/vue-beauty.min.css'

import store from './store/store'
import i18n from './lang' // Internationalization
import util from './utils/util'
import '@/icons' // icon
import '@/permission' // permission control
import waves from '@/directive/waves' // 水波纹指令
import CommonUploadImage from './views/common/CommonUploadImage.vue'
import CommonLoading from './views/common/CommonLoading.vue'
// import Cookies from 'js-cookie'

// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
Vue.use(waves)

Vue.use(ElementUI, {
    size: 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(layout)
// Vue.use(row)
// Vue.use(autoComplete)

Vue.use(util)

// Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Vue.prototype.$http = service
Vue.prototype.$moment = moment
Vue.prototype.$moment.locale('zh-cn')

Vue.prototype.$prodBaseUrl = 'http://gateway.zan-qian.com/'
Vue.prototype.$prodEnv = process.env.NODE_ENV !== 'production'
Vue.prototype.$baseUrl = baseUrl
console.log(baseUrl)
// Vue.prototype.$baseUrl = 'http://testgate.zan-qian.com/';

// Vue.prototype.$baseUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://192.168.1.112:9002/';

Vue.component('CommonUploadImage', CommonUploadImage)
Vue.component('CommonLoading', CommonLoading)

const VueInstance = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
})

export default VueInstance

