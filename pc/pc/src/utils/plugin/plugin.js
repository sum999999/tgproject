import Vue from 'vue'
import './ivewComponent.js'
import NoticeSelf from '@/components/NoticeSelf'
import xss from 'xss'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'
import Swiper, {
  A11y,
  Navigation,
  Pagination,
  Mousewheel,
  Autoplay,
  Controller,
  Virtual,
  Lazy,
  Keyboard,
  EffectCoverflow,
  EffectCube,
  EffectFade,
  EffectFlip,
  Parallax,
  Zoom,
  Scrollbar,
  Thumbs,
} from 'swiper'
Swiper.use([
  A11y,
  Navigation,
  Pagination,
  Mousewheel,
  Autoplay,
  Controller,
  Virtual,
  Lazy,
  Keyboard,
  EffectCoverflow,
  EffectCube,
  EffectFade,
  EffectFlip,
  Parallax,
  Zoom,
  Scrollbar,
  Thumbs,
])
import Store from '@/store'
import { querySystemConfig } from '@/api/sysDict'

Vue.use(VueAwesomeSwiper /* { default global options } */)

Vue.prototype.$xss = function (html) {
  return xss(html, {
    whiteList: [], // 白名单为空，表示过滤所有标签
    stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
    stripIgnoreTagBody: ['script'], // script标签较特殊，需要过滤标签中间的内容
  })
}
Vue.prototype.$NoticeSelf = NoticeSelf
Vue.prototype.$bus = new Vue()
Vue.prototype.$configText = window.configText

// 开发环境下打印
const PROCESS_ENY = process.env.NODE_ENV
Vue.prototype.console = function (...params) {
  if (PROCESS_ENY == 'development') {
    console.log(...params)
  }
}

let lastTime = 0
Vue.prototype.$systemConfig = function () {
  const vm = this
  const fetchData = function (resolve) {
    querySystemConfig().then((response) => {
      if (response.data.code !== 0) return
      let systemConfigData = {}
      response.data.data.forEach((item) => {
        systemConfigData[item.key] = item.value
      })
      resolve(systemConfigData)
    })
  }
  const nowTime = +new Date()
  if (nowTime - lastTime > 2000) {
    lastTime = nowTime
    return (window.$systemConfigPromise = new Promise(function (resolve, reject) {
      fetchData(resolve)
    }))
  } else {
    return window.$systemConfigPromise
  }
}

Vue.prototype.$tex = function () {
  const args = Array.prototype.slice.apply(arguments)
  const text = args[0]
  const options = args[1] || {}
  if (Store.getters.isInternational) {
    if (text === '元' || text === '¥' || text === '￥' || text === 'RMB' || text === '人民币') {
      return Store.getters.sysCurrency.currencyIcon
    }
    if (options.unit) {
      options.unit = Store.getters.sysCurrency.currencyIcon
    }
  }
  return this.$t.apply(this, args)
}

Vue.prototype.$scur = function () {
  const args = Array.prototype.slice.apply(arguments)
  const text = args[0]
  const options = args[1] || {}
  if (Store.getters.isInternational) {
    return Store.getters.sysExchangeInfo.scurIcon
  }
  return text
}
