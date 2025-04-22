require("babel-polyfill");
require("!style-loader!css-loader!less-loader!./styles/theme/theme.less");

import Vue from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import i18n from "./lang";

import "@/utils/touch-emulator";
import "@/utils/prototype";

import "@/assets/css/iconfont/iconfont.css";
import "animate.css";
import "vue-loaders/dist/vue-loaders.css";
import "@/utils/plugin/plugin"; //ivew组件和vue插件
import "@/utils/request"; // http请求模块
import "@/utils/welcome"; // 打印控制台欢迎信息
import "@/utils/diswatch.js";
import store from "./store";
import App from "./App";
import router from "./router";

import * as directive from "./directive"; // global directive
import * as filters from "./filters"; // global filters
// register global utility directive.
Object.keys(directive).forEach((key) => {
  Vue.use(directive[key]);
});

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

import { less_init } from "@/utils/less";
less_init();

export default new Vue({
  el: "#app",
  i18n,
  router,
  store,
  template: "<App/>",
  components: {
    App,
  },
});
